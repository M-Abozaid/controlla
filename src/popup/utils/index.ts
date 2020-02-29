import { RuleObject, QuotaRule } from '../types'

/* 
@input: rule object
@output: the title of the rule 
*/
export const getRuleTitle = (rule: RuleObject) => {
  if (rule.url) return `Url: ${rule.url}`.match(/[^\\\/\^\$]/gi)
}

/* 
@input: rule object
@output: an array of quota rules if any
*/
export const selectQuotaRules = (rule: RuleObject): QuotaRule[] => {
  if (rule.quotaRules.length) {
    return rule.quotaRules
  }
}
