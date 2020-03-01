import chromep from 'chrome-promise'

export async function getActiveTab(): Promise<chrome.tabs.Tab> {
  const activeTab = await chromep.tabs.query({
    currentWindow: true,
    active: true,
  })
  return activeTab[0]
}

/* 
@input: rule title as a regex
@output: the title of the rule as a string 
*/
export const getRuleTitle = (ruleTitle: RegExp | string) =>
  `${ruleTitle}`.match(/[^\\\/\^\$]/gi)

/* 
@input: a number repres. a day
@output: a one letter str reprs. the same day
*/
export const mapDayNumber = (index: number): string =>
  ['S', 'M', 'T', 'W', 'T', 'F', 'S'][index]
