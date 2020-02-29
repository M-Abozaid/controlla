import { RuleObject } from '../types'

/* 
@input: rule object
@output: the title of the rule 
*/
export const getRuleTitle = (rule: RuleObject) => {
  if (rule.url) return `Url: ${rule.url}`.match(/[^\\\/\^\$]/gi)
}
