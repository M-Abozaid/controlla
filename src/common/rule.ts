import storage from './storage';
import { RuleObj, QuotaUsage } from './../popup/types/index';
import moment from 'moment';


class Rule{

    ruleObj: RuleObj
    _id:string
    
    constructor( _id?:string, ruleObj?:RuleObj){
        this.ruleObj = ruleObj
        this._id = _id
    
    }
  
    async getObj(){
        if(!this.ruleObj){
            this.ruleObj = await storage.getRuleObjById(this._id)
        }

        return this.ruleObj
    }
  
    isEffectiveNow(): boolean{
      return this.isEffectiveThisTimeOfDay() &&  this.isEffectiveThisDaysOfWeek()
    }

    isEffectiveThisTimeOfDay(): boolean {
        const currentMinutes = moment
            .duration()
            .add(moment().hours(), 'hours')
            .add(moment().minutes(), 'minutes')
            .asMinutes();

        return (
            moment.duration(this.ruleObj.startTime).asMinutes() <= currentMinutes &&
            moment.duration(this.ruleObj.endTime).asMinutes() > currentMinutes
        );
    }

    isEffectiveThisDaysOfWeek(): boolean {
        return this.ruleObj.daysOfWeek.includes(moment().weekday())
    }

    update(fieldsToUpdate: Partial<RuleObj>): Promise<any>{
        return storage.updateRuleById(this._id, {...this.ruleObj, ...fieldsToUpdate})
    }

    getUsage():Promise<QuotaUsage>{
        return storage.getUsage(this._id)
    }
}

export default Rule