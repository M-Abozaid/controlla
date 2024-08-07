import { QuotaUsage, Visit } from '../types/index'
import storage from '../common/storage'
import chromePromise from 'chrome-promise'
import ruleMatcher from '../common/ruleMatcher'
import Rule from 'common/Rule'
import settings from '../common/settings'
export class Keeper {
  controlIsPaused = false

  private incrementQuota(rules: Rule[]) {
    return Promise.all(
      rules.map(rule => {
        return storage.incrementOrAddUsage(rule._id, settings.tickDuration)
      })
    )
  }

  controlTab = async (
    tab: chrome.tabs.Tab,
    shouldIncrementQuota = true
  ): Promise<void> => {
    const rules = await storage.getRules()

    const effectiveRules = rules.filter(r => r.isEffectiveNow())

    if (!effectiveRules.length) return

    let matchingRules: Rule[] = []

    const visit: Visit = storage.getOpenVisit(tab.id)

    if (!visit) {
      console.warn('No visit ', tab, shouldIncrementQuota)
      // visit = await storage.createVisitFromTab(tab)
      return
    }

    if (!this.isVisitActive(visit)) return

    matchingRules = effectiveRules.filter(rule => rule.doesMatch(tab, visit))

    // filter highest priority rules
    const highestPriority = Math.max(
      ...matchingRules.map(r => r.ruleObj.priority || 1)
    )

    matchingRules = matchingRules.filter(
      rule => (rule.ruleObj.priority || 1) === highestPriority
    )

    if (!matchingRules.length) return

    if (shouldIncrementQuota) {
      // update Quota
      await this.incrementQuota(matchingRules)
    }

    const [tabExpired, visibilityExpired] = await this.quotaCheck(matchingRules)

    if (tabExpired || visibilityExpired) {
      if (storage.isControlPaused()) {
        if (shouldIncrementQuota) {
          storage.incrementPauseUsage(settings.tickDuration)
        }
        return
      }

      if (tab.active) {
        try {
          const lastVisibility = visit.visibility[visit.visibility.length - 1]
          if (
            lastVisibility &&
            Date.now() - new Date(lastVisibility.time).getTime() < 4000
          ) {
            return
          }
          await this.hideTab(tab)
        } catch (error) {
          console.error('Error Hiding tab', error)
        }
      }

      if (tabExpired) {
        console.log('Removing tab', tab, 'Because of ', matchingRules)
        this.removeTab(tab)
      }
    }
  }

  async quotaCheck(rules: Rule[]): Promise<boolean[]> {
    let tabRemoved = false
    const result = [false, false]

    await Promise.all(
      rules.map(async rule => {
        if (tabRemoved) return
        const usage = await storage.getOrCreateQuotaUsage(rule._id)
        if (tabRemoved) return
        if (this.isQuotaExceeded(usage, rule)) {
          result[0] = true
          tabRemoved = true
        }
        if (this.compareVisibilityQuota(usage, rule)) {
          result[1] = true
        }
      })
    )

    return result
  }

  run = (): void => {
    try {
      chromePromise.tabs
        .query({ active: true })
        .then(async activeTabs => {
          for (const tab of activeTabs) {
            try {
              if (tab.url.indexOf('http') === 0) {
                await this.controlTab(tab)
              }
            } catch (error) {
              console.error(error)
            }
          }
        })
        .catch(err => {
          // eslint-disable-next-line no-console
          console.error('error getting tabs ', err)
        })
    } catch (error) {
      console.error('Error running keeper', error)
    }
  }

  isQuotaExceeded(
    { activeUsage }: QuotaUsage,
    { ruleObj: { activeQuota } }: Rule
  ): boolean {
    return activeUsage >= activeQuota
  }

  compareVisibilityQuota(
    { visibilityUsage }: QuotaUsage,
    { ruleObj: { visibilityQuota } }: Rule
  ): boolean {
    return visibilityUsage >= visibilityQuota
  }

  removeTab(tab: chrome.tabs.Tab) {
    if (settings.disabled) return
    chrome.tabs.get(tab.id, tabFound => {
      if (chrome.runtime.lastError) {
        console.log(chrome.runtime.lastError.message)
      } else {
        console.log('%ckeeper.ts line:129 tab', 'color: #007acc;', tab)
        if (tabFound) {
          console.log(
            '%ckeeper.ts line:131 remove tab',
            'color: #007acc;',
            tabFound
          )
          chrome.tabs.remove(tab.id, err => {
            if (err) console.error('Error removing tab', err)
          })
        }
      }
    })
  }

  async hideTab(tab: chrome.tabs.Tab): Promise<any> {
    if (settings.disabled) return
    try {
      const refreshedTab = await chromePromise.tabs.get(tab.id)
      if (!refreshedTab || !refreshedTab.active) {
        return
      }
      const [newTab] = await chromePromise.tabs.query({
        url: 'chrome://newtab/',
        windowId: tab.windowId,
      })
      if (newTab) {
        return await chromePromise.tabs.update(newTab.id, { active: true })
      }
      return await chromePromise.tabs.create({ windowId: tab.windowId })
    } catch (error) {
      console.error('Error hiding tab', error)
    }
  }

  async isYTVideoAllowed(
    video: gapi.client.youtube.VideoSnippet
  ): Promise<boolean> {
    if (storage.isControlPaused()) {
      return true
    }
    const YTRules = await storage.getRules()

    let matchingRules = YTRules.filter(
      rule =>
        rule.isEffectiveNow() &&
        rule.ruleObj.matchers.some(matcher =>
          ruleMatcher.matchVideoSnippet(matcher, video)
        )
    )

    // filter highest priority rules
    const highestPriority = Math.max(
      ...matchingRules.map(r => r.ruleObj.priority || 1)
    )

    matchingRules = matchingRules.filter(
      rule => (rule.ruleObj.priority || 1) === highestPriority
    )

    const [disallowed] = await this.quotaCheck(matchingRules)

    return !disallowed
  }

  isVisitActive(visit: Visit): boolean {
    const activeThresholdAgo = new Date(
      Date.now() - settings.visitActiveThreshold
    )
    // check if audio is playing
    if (
      visit.audibleState?.length &&
      visit.audibleState[visit.audibleState.length - 1].audible
    ) {
      return true
    }
    // check last visibility
    if (
      visit.visibility.length &&
      visit.visibility[visit.visibility.length - 1].focus &&
      visit.visibility[visit.visibility.length - 1].time > activeThresholdAgo
    ) {
      return true
    }

    // check last click
    if (
      visit.click.length &&
      visit.click[visit.click.length - 1].time > activeThresholdAgo
    ) {
      return true
    }

    if (visit.visitTime > activeThresholdAgo) {
      return true
    }
    return false
  }

  pauseControlUsage(): void {
    storage.pauseControl()
  }
}

const keeper = new Keeper()
;(window as any).keeper = keeper
export default keeper
