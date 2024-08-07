import storage from './storage'
import { RuleObj, QuotaUsage, Visit, MatcherType } from '../types/index'
import moment from 'moment'
import ruleMatcher from '../common/ruleMatcher'

class Rule {
  ruleObj: RuleObj
  _id: string
  usage: QuotaUsage
  constructor(ruleObj?: RuleObj) {
    this.ruleObj = ruleObj

    this._id = this.ruleObj._id
  }

  async getObj(): Promise<RuleObj> {
    if (!this.ruleObj) {
      this.ruleObj = await storage.getRuleObjById(this._id)
    }

    return this.ruleObj
  }

  isEffectiveNow(): boolean {
    return this.isEffectiveThisTimeOfDay() && this.isEffectiveThisDaysOfWeek()
  }

  isEffectiveThisTimeOfDay(): boolean {
    const currentMinutes = moment
      .duration()
      .add(moment().hours(), 'hours')
      .add(moment().minutes(), 'minutes')
      .asMinutes()

    return (
      moment.duration(this.ruleObj.startTime).asMinutes() <= currentMinutes &&
      moment.duration(this.ruleObj.endTime).asMinutes() > currentMinutes
    )
  }

  isEffectiveThisDaysOfWeek(): boolean {
    return this.ruleObj.daysOfWeek.includes(moment().weekday())
  }

  async update(fieldsToUpdate: Partial<RuleObj>): Promise<any> {
    const newObj = await storage.updateRuleById(this._id, {
      ...this.ruleObj,
      ...fieldsToUpdate,
    })
    this.ruleObj = newObj
    return this.ruleObj
  }

  async getUsage(): Promise<QuotaUsage> {
    this.usage = await storage.getOrCreateQuotaUsage(this._id)
    return this.usage
  }

  remove() {
    return storage.removeRule(this.ruleObj)
  }

  doesMatch(tab: chrome.tabs.Tab, visit?: Visit): boolean {
    if (visit && visit.ytDetails) {
      return this.ruleObj.matchers.some(matcher =>
        ruleMatcher.matchTab(matcher, tab, visit.ytDetails.snippet)
      )
    }

    return this.ruleObj.matchers.some(matcher =>
      ruleMatcher.matchTab(matcher, tab)
    )
  }
}

export default Rule
