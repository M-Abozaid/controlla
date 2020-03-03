import { Matcher, MatcherType } from '../types'

class RuleMatcher {
  matchVideoSnippet(
    matcher: Matcher,
    { categoryId, channelTitle, title }: gapi.client.youtube.VideoSnippet
  ): boolean {
    return (
      this.matchVideoCategory(matcher, title) ||
      this.matchChannel(matcher, channelTitle) ||
      this.matchVideoCategory(matcher, categoryId)
    )
  }

  matchVideoTitle(matcher: Matcher, title: string): boolean {
    if (matcher.type !== MatcherType.YT_TITLE) return false

    if (matcher.value instanceof RegExp) {
      return matcher.value.test(title)
    }

    return title.includes(matcher.value)
  }

  matchVideoCategory(matcher: Matcher, categoryId: string): boolean {
    if (matcher.type !== MatcherType.YT_CATEGORY) return false
    return matcher.value === categoryId
  }

  matchChannel(matcher: Matcher, channel) {
    if (matcher.type !== MatcherType.YT_CHANNEL) return false

    if (matcher.value instanceof RegExp) {
      return matcher.value.test(channel)
    }

    return channel.includes(matcher.value)
  }

  matchURL(matcher: Matcher, url) {
    if (matcher.type !== MatcherType.URL) return false

    if (matcher.value instanceof RegExp) {
      return matcher.value.test(url)
    }

    return url.includes(matcher.value)
  }

  matchTab(
    matcher,
    tab: chrome.tabs.Tab,
    snippet?: gapi.client.youtube.VideoSnippet
  ): boolean {
    switch (matcher.type) {
      case MatcherType.URL:
        return this.matchURL(matcher, tab.url)
      case MatcherType.YT_CATEGORY:
      case MatcherType.YT_TITLE:
      case MatcherType.YT_CHANNEL:
        return this.matchVideoSnippet(matcher, snippet)
      default:
        break
    }
  }
}

export default new RuleMatcher()
