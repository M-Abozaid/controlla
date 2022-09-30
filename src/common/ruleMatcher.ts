import { Matcher, MatcherType } from '../types'
import adultSites from './adult'
class RuleMatcher {
  matchVideoTitle(matcher: Matcher, title: string): boolean {
    if (matcher.type !== MatcherType.YT_TITLE) return false

    if (matcher.isRegex) {
      return this.matchRegex(matcher.value, title)
    }

    return title.toLowerCase().includes(matcher.value.toLowerCase())
  }

  matchVideoCategory(matcher: Matcher, categoryId: string): boolean {
    if (matcher.type !== MatcherType.YT_CATEGORY) return false

    return matcher.value.includes(categoryId)
  }

  matchChannel(matcher: Matcher, channel) {
    if (matcher.type !== MatcherType.YT_CHANNEL) return false

    if (matcher.isRegex) {
      return this.matchRegex(matcher.value, channel)
    }

    return channel.toLowerCase().trim() === matcher.value.toLowerCase().trim()
  }

  matchYtTAGS(matcher: Matcher, tags: string[]): boolean {
    if (matcher.type !== MatcherType.YT_TAGS) return false
    if (!tags) return false
    return tags.some(tag => matcher.value.includes(tag))
  }

  matchURL(matcher: Matcher, { url }: chrome.tabs.Tab) {
    if (matcher.type !== MatcherType.URL) return false

    if (matcher.isRegex) {
      return this.matchRegex(matcher.value, url)
    }

    return url.includes(matcher.value.toString())
  }

  matchVideoSnippet(
    matcher: Matcher,
    { categoryId, channelTitle, title, tags }: gapi.client.youtube.VideoSnippet
  ): boolean {
    return (
      this.matchVideoTitle(matcher, title) ||
      this.matchChannel(matcher, channelTitle) ||
      this.matchVideoCategory(matcher, categoryId) ||
      this.matchYtTAGS(matcher, tags)
    )
  }
  matchTab(
    matcher,
    tab: chrome.tabs.Tab,
    snippet?: gapi.client.youtube.VideoSnippet
  ): boolean {
    if (snippet) {
      switch (matcher.type) {
        case MatcherType.YT_CATEGORY:
        case MatcherType.YT_TITLE:
        case MatcherType.YT_CHANNEL:
        case MatcherType.YT_TAGS:
          return this.matchVideoSnippet(matcher, snippet)
      }
    }
    switch (matcher.type) {
      case MatcherType.URL:
        return this.matchURL(matcher, tab)
      case MatcherType.ADULT:
        return this.matchAdult(matcher, tab)
      default:
        break
    }
  }
  matchRegex(matcherValue, value) {
    const regex = new RegExp(matcherValue)
    return regex.test(value)
  }

  matchAdult(matcher, { url }: chrome.tabs.Tab) {
    console.log(
      'match adult ',
      url,
      adultSites.some(pSite => {
        return url.includes(pSite)
      })
    )
    return adultSites.some(pSite => {
      return url.includes(pSite)
    })
  }
}
const ruleMatcher = new RuleMatcher()
;(window as any).ruleMatcher = ruleMatcher

export default ruleMatcher
