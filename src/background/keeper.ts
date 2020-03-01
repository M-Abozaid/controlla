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
            const rules = this.storage.getMatchingRules(tab.url)

            const effectiveRules = rules.filter(r => this.isRuleMatchingDaysOfWeek(r) && this.isRuleMatchingTimeOfDay(r))


            effectiveRules.forEach(async effectiveRule => {
                const { activeUsage, visibilityUsage } = await this.storage.getUsage(effectiveRule.id);
                if (tabRemoved) return;
                if (activeUsage > effectiveRule.activeQuota) {
                    this.removeTab(tab);
                    tabRemoved = true
                }
                if (activeUsage > effectiveRule.activeQuota) {
                    this.removeTab(tab);
                    tabRemoved = true
                }
            })

        })
    }

    isRuleMatchingTimeOfDay(rule: Rule): boolean {
        return false
    }

    isRuleMatchingDaysOfWeek(rule: Rule): boolean {
        return false
    }


    removeTab(tab) {
        chromep.tabs.remove(tab.id)
    }












    // get active tabs
    // for each tab
    // get matching rules
    // filter rules that match time of day
    // filter rules taht match time of week
    // get usage for each rule
    // compare usage to qouta
    // 







}