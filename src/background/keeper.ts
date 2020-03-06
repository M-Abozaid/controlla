import { QuotaUsage, Visit } from '../types/index';
import Rule from '../common/rule'
import storage from '../common/storage';
import chromep from 'chrome-promise';
import ruleMatcher from '../common/ruleMatcher';

const ytVideoURLRegex = /youtube.com\/watch\?v=/;
export class Keeper {

    incrementQuota(rules: Rule[]) {
        return Promise.all(rules.map(rule => {

            return storage.incrementOrAddUsage(rule._id)
        }))
    }


    controlTab = async (tab: chrome.tabs.Tab) => {

        // console.log('tab ', tab)
        const rules = await storage.getRules()


        const effectiveRules = rules.filter(r => r.isEffectiveNow())


        let matchingRules = [];

        // if this is a youtube tab
        if (ytVideoURLRegex.test(tab.url)) {

            const { ytDetails }: Visit = await storage.getOpenVisit(tab.id);
            if (!ytDetails) {
                console.log('video details don\'t exist ')
                return
            }
            matchingRules = effectiveRules.filter(rule => ruleMatcher.matchTab(rule.ruleObj.matcher, tab, ytDetails.snippet))
        } else {
            matchingRules = effectiveRules.filter(rule => ruleMatcher.matchURL(rule.ruleObj.matcher, tab))

        }


        // update Quota 
        await this.incrementQuota(matchingRules || effectiveRules)

        const [tabExpired, visibilityExpired] = await this.quotaCheck(matchingRules || effectiveRules)

        if (tabExpired) {
            this.removeTab(tab)
        } else if (visibilityExpired) {
            this.hideTab(tab)
        }


    }

    async quotaCheck(rules: Rule[]): Promise<boolean[]> {

        let tabRemoved = false;
        const result = [false, false]

        await Promise.all(rules.map(async rule => {
            if (tabRemoved) return;
            const usage = await storage.getQuotaUsage(rule._id);
            if (tabRemoved) return;
            if (this.compareActiveQuota(usage, rule)) {
                result[0] = true
                tabRemoved = true;
            }
            if (this.compareVisibilityQuota(usage, rule)) {
                result[1] = true
            }
        }))

        return result

    }


    run = async () => {
        const activeTabs = await chromep.tabs.query({ active: true })
        activeTabs.forEach(this.controlTab)
    }


    compareActiveQuota({ activeUsage }: QuotaUsage, { ruleObj: { activeQuota } }: Rule): boolean {

        return activeUsage >= activeQuota;

    }


    compareVisibilityQuota({ visibilityUsage }: QuotaUsage, { ruleObj: { visibilityQuota } }: Rule): boolean {

        return visibilityUsage >= visibilityQuota;

    }

    removeTab(tab: chrome.tabs.Tab) {
        return chromep.tabs.remove(tab.id)
    }


    async hideTab(tab: chrome.tabs.Tab) {
        const [newTab] = await chromep.tabs.query({
            url: 'chrome://newtab/',
            windowId: tab.windowId,
        });
        if (newTab) {
            return chromep.tabs.update(newTab.id, { active: true });
        }
        return chromep.tabs.create({ windowId: tab.windowId });
    }



    async isYTVideoAllowed(video: gapi.client.youtube.VideoSnippet): Promise<boolean> {

        const YTRules = await storage.getYTRules()

        const matchingRules = YTRules.filter(rule => rule.isEffectiveNow() && ruleMatcher.matchVideoSnippet(rule.ruleObj.matcher, video))

        console.log('matching ', matchingRules)
        const [disallowed] = await this.quotaCheck(matchingRules)

        return !disallowed;

    }


}

export default new Keeper()