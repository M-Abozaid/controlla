import { Visit } from '../types';
import { RuleObj, QuotaUsage } from '../types/index'
import Rule from './rule'
import { rules, quotaUsage } from './data'
import PounchDB from 'pouchdb'
import pounchDBFind from 'pouchdb-find'
import ruleMatcher from './ruleMatcher';

declare var window;
PounchDB.plugin(pounchDBFind)

class Storage {
  rulesDB = new PounchDB('rules')
  quotaUsageDB = new PounchDB('quotaUsage')
  visitsDB = new PounchDB('visits')
  ytVideoURLRegex = /youtube.com\/watch\?v=/;
  constructor() {}

  async getRuleById(ruleId: string): Promise<Rule> {
    const ruleDoc: RuleObj = await this.rulesDB.get(ruleId)
    return new Rule(ruleDoc)
  }

  async getRuleObjById(ruleId: string): Promise<RuleObj> {
    const ruleDoc: RuleObj = await this.rulesDB.get(ruleId)
    return ruleDoc
  }

  async getRules(): Promise<Rule[]> {
    const dbResponse = await this.rulesDB.find({ selector: {} })
    const rulesDocs: RuleObj[] = dbResponse.docs.filter(
      d => d.daysOfWeek 
    )
    console.log('got rules docs ', rulesDocs)
    return rulesDocs.map(r => new Rule(r))
  }

  updateRuleById(ruleId: string, ruleObj: RuleObj) {
    return this.updateOrCreateDoc(this.rulesDB,  ruleObj, ruleId)
  }

  deleteRuleById(ruleId: string) {
    return this.rulesDB.remove(ruleId)
  }
  async createRule(rule: RuleObj, ): Promise<Rule> {
    const newRule = await this.rulesDB.post(rule)
    return this.getRuleById(newRule.id)
  }

  /**
   * @param ruleId
   * returns the active usage for a given rule
   */
  getActiveUsage(ruleId: string): number {
    return quotaUsage[0].activeUsage
  }

  /**
   * @param ruleId string
   * returns the visibility usage for a given rule
   */
  getVisibilityUsage(ruleId: string): number {
    return quotaUsage[0].activeUsage
  }

  async getUsage(ruleId: string): Promise<QuotaUsage> {
    const dbResponse = await this.quotaUsageDB.find({ selector: { ruleId } })
    return dbResponse[0]
  }

  createUsage(usage: QuotaUsage, update?: boolean): Promise<any> {
    return this.quotaUsageDB.put(usage)
  }

  incrementQuotaUsage(ruleId: string) {}

  resetQuotaUsage(ruleId: string) {}

  getYTRules(): Rule[] {
    return rules.map(r => new Rule(r))
  }

  closeOpenVisit(visit) {
      return this.updateOrCreateDoc(this.visitsDB, {leftTime: new Date() }, visit._id)
  }

  getOpenVisit(tabId) {
      return  this.visitsDB.find({
            selector:{
                tabId: tabId,
                leftTime:{$exists:false}
            }
        })
  }
  createVisit(visit:Visit) {

    return this.visitsDB.post(visit)
  }

  async updateOrCreateDoc(db, fieldsToUpdate: object, _id?: string): Promise<any> {
      let newDoc
      if(!_id){
        newDoc = await db.post(fieldsToUpdate)
        return db.get(newDoc._id || newDoc.id)
      }
    const doc = await db.get(_id)
    if (!doc) {
      console.log('trying to update none existing doc')
      newDoc = await db.post(fieldsToUpdate)
      return db.get(newDoc._id || newDoc.id)
    }

    const updatedDoc = await db.put({
      ...doc,
      ...fieldsToUpdate,
    })
    return db.get(updatedDoc._id || updatedDoc.id)
  }

  async getMatchingRules(tab):Promise<Rule[]>{

    const rules = await this.getRules()
    
    console.log('rules ', rules)
    if (this.ytVideoURLRegex.test(tab.url)) {
        const openVisit:Visit = await this.getOpenVisit(tab.id)
        return rules.filter(rule=> ruleMatcher.matchTab(rule.ruleObj.matcher, tab, openVisit.ytDetails.snippet)) 
    }
    return rules.filter(rule=> ruleMatcher.matchTab(rule.ruleObj.matcher, tab)) 
    
  }
  async init() {
    await this.rulesDB.createIndex({ index: { fields: ['matcher.type'] } })
    await this.quotaUsageDB.createIndex({ index: { fields: ['ruleId'] } })
    await this.visitsDB.createIndex({
      index: { fields: ['tabId', 'leftTime', 'visitTime'] },
    })

    window.rulesDB = this.rulesDB
    window.visitsDB = this.visitsDB
    window.quotaUsageDB = this.quotaUsageDB
  }
}

export default new Storage()
