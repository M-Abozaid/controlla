import { Rule } from './../popup/types/index';
import { MatcherType } from 'popup/types/index';
import data from 'popup/data';
export class Storage{

    constructor(){

    }

    getRuleById(id:string){
        return {}
    }

    getMatcherRules(matcher:MatcherType){

    }
    deleteRuleById(id: string){

    }
    addRule(rule: Rule){

    }

    getUsage(ruleId: string): number{
        return 0
    }

    incrementUsage(ruleId: string){

    }

    resetUsage(ruleId:string){

    }



    getMatchingRules(url: string):Rule[]{
        return data[0]
    }

}