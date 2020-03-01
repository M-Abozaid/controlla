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
export const getRuleTitle = (ruleTitle: RegExp | string) => {
  return `${ruleTitle}`.match(/[^\\\/\^\$]/gi)
}
