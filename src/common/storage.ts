import { QuotaUsage, } from './../popup/types';
import { Rule } from './../popup/types';
import { rules, quotaUsage } from './data';
import PounchDB from 'pouchdb';
export class Storage {

    rulesDB
    quotaUsageDB

    constructor() {
        this.rulesDB = new PounchDB('rules')
        this.quotaUsageDB = new PounchDB('quotaUsage')

    }

    getRuleById(ruleId: string) {
        return {}
    }


    updateRuleById(ruleId: string, rule) {

    }

    deleteRuleById(ruleId: string) {

    }
    addRule(rule: Rule) {

    }

    getQuotaUsage(ruleId: string): number {

        return quotaUsage[0].amount
    }

    incrementQuotaUsage(ruleId: string) {

    }

    resetQuotaUsage(ruleId: string) {

    }



    getMatchingRules(url: string): Rule[] {
        return rules
    }

}