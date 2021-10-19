import { Matcher, MatcherType } from '../types'

class RuleMatcher {
  matchVideoTitle(matcher: Matcher, title: string): boolean {
    if (matcher.type !== MatcherType.YT_TITLE) return false

    if (matcher.value instanceof RegExp) {
      return matcher.value.test(title)
    }

    return title.toLowerCase().includes(matcher.value.toLowerCase())
  }

  matchVideoCategory(matcher: Matcher, categoryId: string): boolean {
    if (matcher.type !== MatcherType.YT_CATEGORY) return false

    return matcher.value.includes(categoryId)
  }

  matchChannel(matcher: Matcher, channel) {
    if (matcher.type !== MatcherType.YT_CHANNEL) return false

    if (matcher.value instanceof RegExp) {
      return matcher.value.test(channel)
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

    if (matcher.value instanceof RegExp) {
      return matcher.value.test(url)
    }

    return url.includes(matcher.value)
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
    switch (matcher.type) {
      case MatcherType.URL:
        return this.matchURL(matcher, tab)
      case MatcherType.YT_CATEGORY:
      case MatcherType.YT_TITLE:
      case MatcherType.YT_CHANNEL:
      case MatcherType.YT_TAGS:
        return this.matchVideoSnippet(matcher, snippet)
      default:
        break
    }
  }
}
const ruleMatcher = new RuleMatcher()
;(window as any).ruleMatcher = ruleMatcher

export default ruleMatcher
