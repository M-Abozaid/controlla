import { Rule } from './../popup/types/index';
import { Storage } from './../common/storage';
import chromep from 'chrome-promise';
import moment from 'moment';
export class Keeper {

    storage = new Storage()
    constructor() {

    }

    isAllowed(tab: chrome.tabs.Tab): boolean {

        return false;
    }


    async run() {

        const activeTabs = await chromep.tabs.query({ active: true })

        activeTabs.forEach(async tab => {
            let tabRemoved = false;
            let tabHidden = false;
            const rules = await this.storage.getMatchingRules(tab.url)

            const effectiveRules = rules.filter(r => this.isRuleMatchingDaysOfWeek(r) && this.isRuleMatchingTimeOfDay(r))


            effectiveRules.forEach(async effectiveRule => {
                const { activeUsage, visibilityUsage } = await this.storage.getUsage(effectiveRule.id);
                if (tabRemoved || tabHidden) return;
                if (activeUsage > effectiveRule.activeQuota) {
                    await this.removeTab(tab);
                    tabRemoved = true
                }
                if (visibilityUsage > effectiveRule.visibilityQuota) {
                    await this.hideTab(tab);
                    tabHidden = true
                }
            })

        })
    }

    isRuleMatchingTimeOfDay(rule: Rule): boolean {
        const currentMinutes = moment
            .duration()
            .add(moment().hours(), 'hours')
            .add(moment().minutes(), 'minutes')
            .asMinutes();

        return (
            moment.duration(rule.startTime).asMinutes() <= currentMinutes &&
            moment.duration(rule.endTime).asMinutes() > currentMinutes
        );
    }

    isRuleMatchingDaysOfWeek(rule: Rule): boolean {
        return rule.daysOfWeek.includes(moment().weekday())
    }


    removeTab(tab) {
        chromep.tabs.remove(tab.id)
    }


    async hideTab(tab) {
        const [newTab] = await chromep.tabs.query({
            url: 'chrome://newtab/',
            windowId: tab.windowId,
        });
        if (newTab) {
            return chromep.tabs.update(newTab.id, { active: true });
        }
        return chromep.tabs.create({ windowId: tab.windowId });
    }



    isYTVideoAllowed({ categoryId, channelTitle, title }: gapi.client.youtube.VideoSnippet): Promise<boolean> {
        // get rules for vidoe category channel and title 
        return Promise.resolve(false);
    }



}