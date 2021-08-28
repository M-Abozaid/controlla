import { Matcher, MatcherType, YTCategories } from './../../types/index';
import chromep from 'chrome-promise'

export function getActiveTab(): Promise<chrome.tabs.Tab[]> {
  return chromep.tabs
    .query({
      currentWindow: true,
      active: true,
    })


}

/*
@input: rule title as a regex
@output: the title of the rule as a string
*/
export const getRuleTitle = (matcher: Matcher) => {

  if (matcher.type === MatcherType.YT_CATEGORY) {
    return YTCategories[matcher.value as string]
  }
  return `${matcher.value as string}`.match(/[^\\\/\^\$]/gi).join('')

}

/*
@input: a number repres. a day
@output: a one letter str reprs. the same day
*/
export const mapDayNumber = (index: number): string =>
  ['S', 'M', 'T', 'W', 'T', 'F', 'S'][index]

// get host name url
export function extractHostname(url:string) {
  let hostname
  // find & remove protocol (http, ftp, etc.) and get hostname

  if (url.indexOf('//') > -1) {
    hostname = url.split('/')[2]
  } else {
    hostname = url.split('/')[0]
  }

  // find & remove port number
  hostname = hostname.split(':')[0]
  // find & remove "?"
  hostname = hostname.split('?')[0]

  return hostname
}

export function escapeRegExp(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')
}
