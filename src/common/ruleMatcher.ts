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
    console.log('match url ', matcher)

    if (matcher.type !== MatcherType.URL) return false

    console.log('match url ', matcher)
    if (matcher.value instanceof RegExp) {
      console.log('regex t')
      return matcher.value.test(url)
    }

    return url.includes(matcher.value)
  }

  matchTab(
    matcher,
    tab: chrome.tabs.Tab,
    snippet?: gapi.client.youtube.VideoSnippet
  ): boolean {
    console.log('matching ',  matcher)
    switch (matcher.type) {
      case MatcherType.URL:
        console.log('matcvhing url ', matcher)
        return this.matchURL(matcher, tab.url)
      case MatcherType.YT_CATEGORY:
      case MatcherType.YT_TITLE:
      case MatcherType.YT_CHANNEL:
        return this.matchVideoSnippet(matcher, snippet)
      default:
        console.log('defalut ', matcher.type, MatcherType.URL)
        break
    }
  }
}

export default new RuleMatcher()
