import { RuleObj, QuotaUsage } from '../types/index'
import Rule from '../common/rule'
import { rules, quotaUsage } from './data'
import PounchDB from 'pouchdb'
import pounchDBFind from 'pouchdb-find'

PounchDB.plugin(pounchDBFind)

class Storage {
  rulesDB = new PounchDB('rules')
  quotaUsageDB = new PounchDB('quotaUsage')
  visitsDB = new PounchDB('visits')

  constructor() {}

  async getRuleById(ruleId: string): Promise<Rule> {
    const ruleDoc: RuleObj = await this.rulesDB.get(ruleId)
    return new Rule(ruleDoc._id, ruleDoc)
  }

  async getRuleObjById(ruleId: string): Promise<RuleObj> {
    const ruleDoc: RuleObj = await this.rulesDB.get(ruleId)
    return ruleDoc
  }

  async getRules(): Promise<Rule[]> {
    const dbResponse = await this.rulesDB.find({ selector: {} })
    const rulesDocs: RuleObj[] = dbResponse.rows.filter(
      d => d.language !== 'query'
    )
    return rulesDocs.map(r => new Rule(r._id, r))
  }

  updateRuleById(ruleId: string, ruleObj: RuleObj) {
    return this.updateDoc(this.rulesDB, ruleId, ruleObj)
  }

  deleteRuleById(ruleId: string) {
    return this.rulesDB.remove(ruleId)
  }
  createRule(rule: RuleObj, update?: boolean): Promise<any> {
    return this.rulesDB.put(rule)
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
    return rules.map(r => new Rule(r._id, r))
  }

  closeOpenVisit() {}
  getOpenVisit(tabId) {}
  createVisit() {}

  async updateDoc(db, _id: string, fieldsToUpdate: object): Promise<any> {
    const doc = await db.get(_id)
    if (!doc) {
      console.error('trying to update none existing doc')
      return
    }

    return db.put({
      ...doc,
      ...fieldsToUpdate,
    })
  }

  async init() {
    await this.rulesDB.createIndex({ index: { fields: ['matcher.type'] } })
    await this.quotaUsageDB.createIndex({ index: { fields: ['ruleId'] } })
    await this.visitsDB.createIndex({
      index: { fields: ['tabId', 'leftTime'] },
    })
  }
}

export default new Storage()
