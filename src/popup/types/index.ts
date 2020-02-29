/* Quota */

export interface QuoteTime {
  startTime: string
  endTime: string
  quote: number
}

export interface QuotaRule {
  daysOfweek: number[]
  timeOfDay: QuoteTime[]
}

export interface RuleObject {
  url?: RegExp
  categoryId?: string
  quotaRules: QuotaRule[]
}
