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

    getRuleById(ruleId: string): Rule {
        return rules[0]
    }

    getRules(): Rule[] {
        return rules
    }
    updateRuleById(ruleId: string, rule) {

    }

    deleteRuleById(ruleId: string) {

    }
    addRule(rule: Rule) {

    }

    /**
     * 
     * @param ruleId 
     * 
     * returns the active usage for a given rule
     */
    getActiveUsage(ruleId: string): number {

        return quotaUsage[0].activeUsage
    }

    /**
     * 
     * @param ruleId string
     * 
     * returns the visibility usage for a given rule 
     */
    getVisibilityUsage(ruleId: string): number {

        return quotaUsage[0].activeUsage
    }

    getUsage(ruleId: string): QuotaUsage {
        return quotaUsage[0]
    }
    incrementQuotaUsage(ruleId: string) {

    }

    resetQuotaUsage(ruleId: string) {

    }



    getMatchingRules(url: string): Rule[] {
        return rules
    }

}