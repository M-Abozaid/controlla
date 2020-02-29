/* Quota */

export interface QuotaTime {
  startTime: string
  endTime: string
  quota: number
}

export interface QuotaRule {
  daysOfWeek: number[]
  quotaTime: number
  timeOfDay: QuotaTime
}

export interface RuleObject {
  url?: RegExp
  categoryId?: string
  quotaRules: QuotaRule[]
}
