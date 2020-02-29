import { Rule } from './../popup/types';
import { MatcherType } from 'popup/types/index';
import data from 'popup/data';
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

    getUsage(ruleId: string): number {
        return 0
    }

    incrementUsage(ruleId: string) {

    }

    resetUsage(ruleId: string) {

    }



    getMatchingRules(url: string): Rule[] {
        return data
    }

}