import { QuotaUsage } from './../popup/types/index';
import { Rule } from './../popup/types';
import { MatcherType } from 'popup/types/index';
import { rules, quotaUsage } from '../popup/data';
export class Storage {

    constructor() {

    }

    getRuleById(ruleId: string) {
        return {}
    }


    updateRuleById(ruleId: string) {

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