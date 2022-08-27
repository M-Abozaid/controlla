import { PauseControlUsage } from './../types/index'
import { Visit } from '../types'
import { RuleObj, QuotaUsage } from '../types/index'
import Rule from './Rule'
import PounchDB from 'pouchdb'
import pounchDBFind from 'pouchdb-find'
import ruleMatcher from './ruleMatcher'
import { EventEmitter } from 'events'
import moment from 'moment'
import settings from './settings'
import getYTVideos from '../common/getYTVideos'
import { v4 as uuidv4 } from 'uuid'
import saveVisit from './saveVisit'

declare let window
PounchDB.plugin(pounchDBFind)

// eslint-disable-next-line @typescript-eslint/ban-types
class Storage extends EventEmitter {
  rulesDB = new PounchDB<RuleObj>('rules')
  quotaUsageDB = new PounchDB<QuotaUsage>('quotaUsage')
  visitsDB = new PounchDB<Visit>('visits')
  ytVideoURLRegex = /youtube.com\/watch\?v=/
  public visits = []

  constructor() {
    super()
  }

  async getRuleById(ruleId: string): Promise<Rule> {
    const ruleDoc: RuleObj = await this.rulesDB.get(ruleId)
    return new Rule(ruleDoc)
  }

  async getRuleObjById(ruleId: string): Promise<RuleObj> {
    const ruleDoc: RuleObj = await this.rulesDB.get(ruleId)
    return ruleDoc
  }

  async getRules(): Promise<Rule[]> {
    const dbResponse = await this.rulesDB.find({ selector: {} })
    const rulesDocs: RuleObj[] = dbResponse.docs
    return rulesDocs.map(r => new Rule(r))
  }

  async updateRuleById(ruleId: string, ruleObj: RuleObj) {
    await this.updateOrCreateDoc(this.rulesDB, ruleObj, ruleId)
    await this.getRules()
    return this.rulesDB.get(ruleId)
  }

  async removeRule(ruleObj) {
    await this.rulesDB.remove(ruleObj)
    this.emit('rule_removed', ruleObj)
    return
  }
  async createRule(rule: RuleObj): Promise<Rule> {
    if (rule._rev) {
      delete rule._rev
    }
    if (rule._id) {
      try {
        const exists = await this.rulesDB.get(rule._id)
        if (exists) {
          await this.updateRuleById(rule._id, rule)
          return this.getRuleById(rule._id)
        }
      } catch (error) {
        console.error(error)
      }
    }
    const newRule = await this.rulesDB.post(rule)
    this.emit('new_rule', newRule)
    await this.getOrCreateQuotaUsage(newRule.id)
    await this.getRules()
    return this.getRuleById(newRule.id)
  }

  createUsage(usage: QuotaUsage, update?: boolean): Promise<any> {
    return this.quotaUsageDB.put(usage)
  }

  async closeOpenVisit(visit: Visit) {
    const dbVisit = this.visits.find(v => v._id === visit._id)
    if (dbVisit.leftTime) return
    dbVisit.leftTime = new Date()
    await saveVisit(visit)
    return dbVisit
  }

  getOpenVisit(tabId: number) {
    try {
      const dbVisit = this.visits.find(v => {
        return v.tabId === tabId && !v.leftTime
      })

      return dbVisit
    } catch (error) {
      console.error('Error getting visit ' + String(tabId), error)
    }
  }
  createVisit(visit: Visit) {
    this.visits.push(visit)
    return visit
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async updateVisit(visit: Visit) {
    // console.log('%cstorage.ts line:107 update visit', 'color: #007acc;', visit);
    // return this.visitsDB.put(visit)
  }

  async updateOrCreateDoc<Model>(
    db: PouchDB.Database<Model>,
    fieldsToUpdate: Model,
    _id?: string
  ): Promise<Model> {
    try {
      if (!_id) {
        const resp = await db.post(fieldsToUpdate)
        return db.get(resp.id)
      }
      const doc = await db.get(_id)
      if (!doc) {
        const resp = await db.post(fieldsToUpdate)
        return db.get(resp.id)
      }

      const updatedDoc = await db.put({
        ...doc,
        ...fieldsToUpdate,
      })
      return db.get(updatedDoc.id)
    } catch (error) {
      console.error('Error updateOrCreateDoc', error)
    }
  }

  async getMatchingRules(tab: chrome.tabs.Tab): Promise<Rule[]> {
    const allRules = await this.getRules()

    const visit = this.getOpenVisit(tab.id)

    return allRules.filter(rule => rule.doesMatch(tab, visit))
  }

  /**
   *
   * @param ruleId {string}
   * @param interval {number}
   *
   * Get a rule and interval and check if counting for today exists if so increment it if not create a new usage
   */
  async incrementOrAddUsage(
    ruleId: string,
    interval: number
  ): Promise<QuotaUsage> {
    const usage = await this.getOrCreateQuotaUsage(ruleId)

    usage.activeUsage = usage.activeUsage + interval
    usage.visibilityUsage = usage.visibilityUsage + interval
    await this.quotaUsageDB.put(usage)
    return usage
  }

  async maxOutUsage(rule: Rule): Promise<any> {
    const usage = await this.getOrCreateQuotaUsage(rule._id)
    usage.activeUsage = rule.ruleObj.activeQuota
    usage.visibilityUsage = rule.ruleObj.visibilityQuota
    await this.quotaUsageDB.put(usage)
    return usage
  }
  async getOrCreateQuotaUsage(ruleId: string) {
    const result = await this.quotaUsageDB.find({
      selector: { ruleId },
    })

    const usage = result.docs[0]

    const usageDay = this.__getDailyQuotaDay(usage && usage.day)

    if (!usage) {
      // create usage
      const newUsage = {
        ruleId,
        day: usageDay,
        activeUsage: 0,
        visibilityUsage: 0,
      }
      console.log('create new usage', result)

      const response = await this.quotaUsageDB.post(newUsage)
      return this.quotaUsageDB.get(response.id)
    } else if (usageDay !== usage.day) {
      // update usage
      usage.day = usageDay
      usage.activeUsage = 0
      usage.visibilityUsage = 0
      await this.quotaUsageDB.put(usage)
      return usage
    }

    return usage
  }

  pauseControl() {
    if (this.isPauseAllowed()) {
      localStorage.setItem('isControlPaused', 'true')
    }
  }

  resumeControl() {
    localStorage.setItem('isControlPaused', 'false')
  }
  isPauseAllowed(): boolean {
    const pauseUsage = storage.getOrCreatePauseUsage()
    return pauseUsage.usage < settings.pauseQuota
  }
  incrementPauseUsage(increment: number) {
    if (this.isPauseAllowed()) {
      const pauseControlUsage = this.getOrCreatePauseUsage()
      pauseControlUsage.usage = pauseControlUsage.usage + increment

      localStorage.setItem(
        'pauseControlUsage',
        JSON.stringify(pauseControlUsage)
      )
    } else {
      this.resumeControl()
    }
  }

  getOrCreatePauseUsage(): PauseControlUsage {
    const pauseControlUsage =
      localStorage.pauseControlUsage &&
      JSON.parse(localStorage.pauseControlUsage)

    if (
      pauseControlUsage &&
      this.__getDailyQuotaDay(pauseControlUsage.day) === pauseControlUsage.day
    ) {
      return pauseControlUsage
    }
    {
      const initialPauseControlUsage = {
        day: this.__getDailyQuotaDay(),
        usage: 0,
      }

      localStorage.setItem(
        'pauseControlUsage',
        JSON.stringify(initialPauseControlUsage)
      )
      return initialPauseControlUsage
    }
  }
  isControlPaused() {
    return localStorage.isControlPaused === 'true'
  }

  __getDailyQuotaDay(usageDay?): string {
    const today = moment().format('DD-MM-YYYY')
    const yesterday = moment()
      .subtract(1, 'days')
      .format('DD-MM-YYYY')
    const hour = moment().hour()

    if (!usageDay) {
      return hour < settings.quotaRenewalHour ? yesterday : today
    }
    if (usageDay !== today) {
      if (hour >= settings.quotaRenewalHour) {
        return today
      } else {
        return yesterday
      }
    }

    return usageDay
  }

  async createVisitFromTab(tab: chrome.tabs.Tab): Promise<Visit> {
    const newVisit: Visit = {
      visitTime: new Date(),
      tabId: tab.id,
      url: tab.url,
      title: tab.title,
      audible: false,
      visibility: [],
      click: [],
      keypress: [],
      audibleState: [],
      _id: uuidv4(),
      status: 'loading',
    }
    if (tab.url.includes('youtube.com/watch?v=')) {
      // eslint-disable-next-line @typescript-eslint/prefer-regexp-exec
      const vidId = tab.url.match(/watch\?v=(.{11})/)[1]
      const ytDetails = await getYTVideos([vidId])
      ;[newVisit.ytDetails] = ytDetails.items
      newVisit.ytVideoId = vidId
    }
    storage.createVisit(newVisit)
    return newVisit
  }

  async init(scope?) {
    console.log('initialize storage ', Date.now())
    await this.rulesDB.createIndex({ index: { fields: ['matcher.type'] } })
    await this.quotaUsageDB.createIndex({ index: { fields: ['ruleId'] } })
    await this.visitsDB.createIndex({
      index: { fields: ['tabId', 'leftTime', 'visitTime'] },
    })

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    window.rulesDB = this.rulesDB
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    window.visitsDB = this.visitsDB
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    window.quotaUsageDB = this.quotaUsageDB

    if (scope === 'popup') {
      return new Promise<void>((resolve, reject) => {
        chrome.runtime.sendMessage({ message: 'getVisits' }, response => {
          console.log('Got response ', response)
          this.visits = response.visits
          console.log('initialize storage ', Date.now())

          resolve()
        })
      })
    }
  }
}

const storage = new Storage()
window.storage = storage
export default storage
