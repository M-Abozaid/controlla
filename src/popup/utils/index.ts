/* 
@input: rule object
@output: the title of the rule if url
*/
export const getRuleTitle = rule => {
  if (rule.url) return `${rule.url}`.match(/\w+/)
}
