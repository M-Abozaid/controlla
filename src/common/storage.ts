import { Visit } from '../types';
import { RuleObj, QuotaUsage } from '../types/index'
import Rule from './rule'
import { rules, quotaUsage } from './data'
import PounchDB from 'pouchdb'
import pounchDBFind from 'pouchdb-find'
import ruleMatcher from './ruleMatcher';
import { EventEmitter } from 'events';

declare var window;
PounchDB.plugin(pounchDBFind)

class Storage extends EventEmitter {
    rulesDB = new PounchDB<RuleObj>('rules')
    quotaUsageDB = new PounchDB<QuotaUsage>('quotaUsage')
    visitsDB = new PounchDB<Visit>('visits')

    ytVideoURLRegex = /youtube.com\/watch\?v=/;
    constructor() {
        super()
    }

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
        return rulesDocs.map(r => new Rule(r))
    }

    updateRuleById(ruleId: string, ruleObj: RuleObj) {
        return this.updateOrCreateDoc(this.rulesDB, ruleObj, ruleId)
    }

    removeRule(ruleObj) {
        return this.rulesDB.remove(ruleObj)
    }
    async createRule(rule: RuleObj, ): Promise<Rule> {
        const newRule = await this.rulesDB.post(rule)
        this.emit('new_rule', newRule)
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




    createUsage(usage: QuotaUsage, update?: boolean): Promise<any> {
        return this.quotaUsageDB.put(usage)
    }




    getYTRules(): Rule[] {
        return rules.map(r => new Rule(r))
    }

    closeOpenVisit(visit: Visit) {
        return this.updateOrCreateDoc(this.visitsDB, { leftTime: new Date() }, visit._id)
    }

    async getOpenVisit(tabId) {
        const dbResponse = await this.visitsDB.find({
            selector: {
                tabId: tabId,
                leftTime: { $exists: false }
            }
        })
        return dbResponse.docs[0]
    }
    createVisit(visit: Visit) {

        return this.visitsDB.post(visit)
    }

    async updateOrCreateDoc(db, fieldsToUpdate: object, _id?: string): Promise<any> {
        let newDoc
        if (!_id) {
            newDoc = await db.post(fieldsToUpdate)
            return db.get(newDoc._id || newDoc.id)
        }
        const doc = await db.get(_id)
        if (!doc) {
            newDoc = await db.post(fieldsToUpdate)
            return db.get(newDoc._id || newDoc.id)
        }

        const updatedDoc = await db.put({
            ...doc,
            ...fieldsToUpdate,
        })
        return db.get(updatedDoc._id || updatedDoc.id)
    }

    async getMatchingRules(tab: chrome.tabs.Tab): Promise<Rule[]> {

        const rules = await this.getRules()

        if (this.ytVideoURLRegex.test(tab.url)) {
            const visit = await this.getOpenVisit(tab.id)
            console.log('got open visit ', visit)
            return rules.filter(rule => ruleMatcher.matchTab(rule.ruleObj.matcher, tab, visit.ytDetails.snippet))
        }
        return rules.filter(rule => ruleMatcher.matchTab(rule.ruleObj.matcher, tab))

    }

    async incrementOrAddUsage(ruleId: string): Promise<QuotaUsage> {
        const result = await this.quotaUsageDB.find({ selector: { ruleId, day: new Date().getDate() } })

        const usage = result.docs[0]
        if (!usage) {
            // create usage
            const newUsage = {
                ruleId,
                day: new Date().getDate(),
                activeUsage: 0,
                visibilityUsage: 0,
            }
            const response = await this.quotaUsageDB.post(newUsage)
            return this.quotaUsageDB.get(response.id)
        }
        if (usage.day !== new Date().getDate()) {
            // update usage 
            usage.day = new Date().getDate();
            usage.activeUsage = usage.activeUsage + 0.1
            usage.visibilityUsage = usage.visibilityUsage + 0.1
            await this.quotaUsageDB.put(usage)
            return usage
        }

        usage.activeUsage = usage.activeUsage + 0.1
        usage.visibilityUsage = usage.visibilityUsage + 0.1
        await this.quotaUsageDB.put(usage)
        return usage
    }



    async getQuotaUsage(ruleId) {
        const result = await this.quotaUsageDB.find({ selector: { ruleId, day: new Date().getDate() } })

        const usage = result.docs[0]
        if (!usage) {
            // create usage
            const newUsage = {
                ruleId,
                day: new Date().getDate(),
                activeUsage: 0,
                visibilityUsage: 0,
            }
            const response = await this.quotaUsageDB.post(newUsage)
            return this.quotaUsageDB.get(response.id)
        }
        return usage
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
