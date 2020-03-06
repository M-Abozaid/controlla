import { Matcher, MatcherType, YTCategories } from './../../types/index';
import chromep from 'chrome-promise'

export async function getActiveTab(): Promise<chrome.tabs.Tab> {
  const activeTab = await chromep.tabs
    .query({
      currentWindow: true,
      active: true,
    })
    .then(tabs => tabs)
    .catch(err => console.log(err))

  return activeTab[0]
}

/* 
@input: rule title as a regex
@output: the title of the rule as a string 
*/
export const getRuleTitle = (matcher: Matcher) => {

  if (matcher.type === MatcherType.YT_CATEGORY) {
    return YTCategories[<string>(matcher).value]
  }
  return `${matcher.value}`.match(/[^\\\/\^\$]/gi)

}

/* 
@input: a number repres. a day
@output: a one letter str reprs. the same day
*/
export const mapDayNumber = (index: number): string =>
  ['S', 'M', 'T', 'W', 'T', 'F', 'S'][index]

// get host name url
export function extractHostname(url) {
  var hostname
  //find & remove protocol (http, ftp, etc.) and get hostname

  if (url.indexOf('//') > -1) {
    hostname = url.split('/')[2]
  } else {
    hostname = url.split('/')[0]
  }

  //find & remove port number
  hostname = hostname.split(':')[0]
  //find & remove "?"
  hostname = hostname.split('?')[0]

  return hostname
}

export function escapeRegExp(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')
}
