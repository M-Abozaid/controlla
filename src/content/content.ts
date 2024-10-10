import $ from 'jquery'
import * as JQuery from 'jquery'
import { YTCategories } from '../types/index'
import { getVideoIdFromURL } from '../common/utils'
import { Logger } from '../common/logger'
import getYTVideos from '../common/getYTVideos'

// Extend jQuery type to include our custom methods
type VideoElement = JQuery.Node & {
  videoId?: string
  attr(attributeName: string): string | undefined
  attr(attributeName: string, value: string): JQuery.Node
  prop(propertyName: string): any
  find(selector: string): JQuery.Node
  hover(handlerIn: () => void, handlerOut?: () => void): JQuery.Node
  css(propertyName: string, value?: string): JQuery.Node
  append(content: string): JQuery.Node
}

class YouTubeContentFilter {
  private static YOUTUBE_REGEX = /youtube\.com\//
  private static YOUTUBE_HOME_REGEX = /youtube\.com\/$/
  private static YOUTUBE_WATCH_REGEX = /youtube\.com\/watch\?/
  private static VIDEO_CHUNK_SIZE = 50
  private static CHECK_INTERVAL_MS = 6000

  private badVideos: VideoElement[] = []
  private goodVideos: gapi.client.youtube.Video[] = []
  private keywordSearch: string[] = []

  constructor() {
    Logger.debug('YouTubeContentFilter initialized')
    this.setupEventListeners()
  }

  private setupEventListeners(): void {
    Logger.debug('Setting up event listeners')
    this.setupVisibilityChangeListener()
    this.setupChromeRuntimeListener()
    this.setupWindowFocusListeners()
    this.setupDocumentInteractionListeners()
  }

  private setupVisibilityChangeListener(): void {
    const visibilityChange = 'visibilitychange'
    document.addEventListener(
      visibilityChange,
      () => {
        Logger.debug(
          `Visibility changed: ${document.hidden ? 'hidden' : 'visible'}`
        )
        chrome.runtime.sendMessage({ hidden: document.hidden })
      },
      false
    )
  }

  private setupChromeRuntimeListener(): void {
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      Logger.debug('Chrome runtime message received', request)

      if (request.newVisit) {
        sendResponse({ msg: 'got it' })
        return
      }

      if (request.hidden) {
        this.handleHiddenRequest(sendResponse)
      } else {
        sendResponse({ msg: 'got it' })
      }

      return true
    })
  }

  private handleHiddenRequest(sendResponse: (response: any) => void): void {
    this.sleep(10).then(() => {
      Logger.debug('Handling hidden request', {
        hidden: document.hidden,
        focus: document.hasFocus(),
        href: location.href,
      })
      sendResponse({
        hidden: document.hidden,
        focus: document.hasFocus(),
        href: location.href,
      })
    })
  }

  private setupWindowFocusListeners(): void {
    $(window).on({
      focus: () => {
        Logger.debug('Window gained focus')
        chrome.runtime.sendMessage({ focus: true })
      },
      blur: () => {
        Logger.debug('Window lost focus')
        chrome.runtime.sendMessage({ focus: false })
      },
    })
  }

  private setupDocumentInteractionListeners(): void {
    $(document).ready(() => {
      document.body.addEventListener('click', () => {
        Logger.debug('Document body clicked')
        chrome.runtime.sendMessage({ message: 'click' })
      })

      document.body.addEventListener('keypress', () => {
        Logger.debug('Keypress detected')
        chrome.runtime.sendMessage({ message: 'keypress' })
      })
    })
  }

  async start(): Promise<void> {
    Logger.info('Starting YouTube content filter')
    await this.checkYoutube()
    setInterval(
      () => this.checkYoutube(),
      YouTubeContentFilter.CHECK_INTERVAL_MS
    )
  }

  private async checkYoutube(): Promise<void> {
    Logger.debug(`Checking YouTube page: ${window.location.href}`)

    if (
      this.matchRegex(window.location.href, YouTubeContentFilter.YOUTUBE_REGEX)
    ) {
      Logger.debug('Processing home page videos')
      await this.processFeedVideos()
    }

    if (
      this.matchRegex(
        window.location.href,
        YouTubeContentFilter.YOUTUBE_WATCH_REGEX
      )
    ) {
      Logger.debug('Processing watch page video')
      await this.processWatchPageVideo()
    }
  }

  private matchRegex(str: string, regex: RegExp): boolean {
    return regex.test(str)
  }

  private async processFeedVideos(): Promise<void> {
    const videos = $(
      'ytd-rich-item-renderer, ytd-compact-video-renderer, ytm-shorts-lockup-view-model-v2'
    ).toArray() as VideoElement[]
    Logger.debug(`Found ${videos.length} video elements`)

    for (
      let i = 0;
      i < videos.length;
      i += YouTubeContentFilter.VIDEO_CHUNK_SIZE
    ) {
      const videoChunk = videos.slice(
        i,
        i + YouTubeContentFilter.VIDEO_CHUNK_SIZE
      )
      const processableVideos = this.filterProcessableVideos(videoChunk)

      Logger.debug(
        `Processing video chunk: ${processableVideos.length} processable videos`
      )

      if (processableVideos.length === 0) continue

      const videoIds = this.extractVideoIds(processableVideos)
      Logger.debug('Extracted video IDs', videoIds)

      const videoDetails = await this.fetchVideoDetails(videoIds)

      await this.processVideoChunk(processableVideos, videoDetails)
    }
  }

  private filterProcessableVideos(videos: VideoElement[]): VideoElement[] {
    return videos.filter(v => {
      const el = $(v) as VideoElement
      const url = this.extractVideoUrl(el)
      const id = url ? getVideoIdFromURL(url) : null

      if (!id || el.attr('tr-allowed') || el.attr('tr-video-id') === id) {
        Logger.debug('Video not processable', {
          id,
          el,
          allowed: el.attr('tr-allowed'),
          videoId: el.attr('tr-video-id'),
        })
        return false
      }

      el.attr('tr-video-id', id)
      this.coverVideo(el)
      return true
    })
  }

  private extractVideoUrl(el: VideoElement): string | null {
    let url = null
    if (el.prop('tagName') === 'A') {
      url = el.attr('href')
    }
    if (!url) {
      url = $(el.find('a#thumbnail')[0]).attr('href')
    }

    if (!url) {
      url = $(el.find('a')[0]).attr('href')
    }

    if (!url) {
      console.warn('No video ID found', { url }, el)
    }
    return url
  }

  private extractVideoIds(videos: VideoElement[]): string[] {
    return videos
      .map(v => {
        const el = $(v) as VideoElement
        const url = this.extractVideoUrl(el)
        const id = url ? getVideoIdFromURL(url) : null
        el.videoId = id
        return id
      })
      .filter(Boolean)
  }

  private async fetchVideoDetails(
    ids: string | string[]
  ): Promise<{ items: gapi.client.youtube.Video[] }> {
    try {
      const videoIds = Array.isArray(ids) ? ids : [ids]
      Logger.debug('Fetching video details for IDs', videoIds)

      const { items = [] } = await getYTVideos(videoIds)
      Logger.debug('Fetched video details', items)

      return { items }
    } catch (error) {
      Logger.error('Error fetching video details', error)
      return { items: [] }
    }
  }

  private async processVideoChunk(
    videos: VideoElement[],
    videoDetails: { items: gapi.client.youtube.Video[] }
  ): Promise<void> {
    for (const videoEl of videos) {
      const id = $(videoEl).attr('tr-video-id')
      if (!id) {
        Logger.debug('Skipping video with no ID')
        continue
      }

      const videoDetail = videoDetails.items.find(vid => vid.id === id)
      if (!videoDetail) {
        Logger.debug('No video detail found, allowing video', { id })
        this.allowVideo(videoEl)
        continue
      }

      await this.processVideoElement(videoEl, videoDetail)
    }
  }

  private async processVideoElement(
    videoEl: VideoElement,
    videoDetail: gapi.client.youtube.Video
  ): Promise<void> {
    return new Promise(resolve => {
      Logger.debug('Processing video element', {
        title: videoDetail.snippet.title,
        channelTitle: videoDetail.snippet.channelTitle,
      })

      chrome.runtime.sendMessage(
        { msg: 'checkVideo', snippet: videoDetail.snippet },
        response => {
          if (response.allowVid) {
            Logger.debug('Video allowed', { title: videoDetail.snippet.title })
            this.allowVideo(videoEl)
          } else {
            Logger.debug('Video blocked', { title: videoDetail.snippet.title })
            this.blockVideo(videoEl)
          }
          resolve()
        }
      )
    })
  }

  private blockVideo(videoEl: VideoElement): void {
    this.badVideos.push(videoEl)
    videoEl.find('a').attr('href', 'javascript:void(0)')
    videoEl.find('img').attr('src', '')

    videoEl.hover(() => {
      setTimeout(() => {
        videoEl.find('img, video').attr('src', '')
      }, 2)
    })
  }

  private async processWatchPageVideo(): Promise<void> {
    const videoId = getVideoIdFromURL(window.location.href)

    if (videoId && !$(`#tracker-video-info-${videoId}`)[0]) {
      try {
        Logger.debug('Processing watch page video', { videoId })
        const videoDetails = await this.fetchVideoDetails([videoId])
        this.addVideoInfo(videoDetails.items[0])
      } catch (error) {
        Logger.error('Error adding video details', error)
      }
    }
  }

  private coverVideo(el: VideoElement): void {
    if (el.find('.tracker-video-cover')[0]) return

    if (el.prop('tagName') !== 'A') {
      el.css('position', 'relative')
    }

    el.append(`
      <div class="tracker-video-cover" style="
        width: 100%;
        height: 100%;
        position: absolute;
        background-color: var(--yt-spec-general-background-a);
        z-index: 1000;
        top: 0;
      "></div>
    `)
  }

  private allowVideo(el: VideoElement): void {
    if (!el) return
    $(el)
      .find('div.tracker-video-cover')
      .remove()
  }

  private addVideoInfo(details: gapi.client.youtube.Video): void {
    if ($(`#tracker-video-info-${details.id}`)[0]) return

    $('.tk-video-info').remove()
    $('#description-inline-expander > yt-formatted-string').append(`
      <table id="tracker-video-info-${details.id}" class="tk-video-info">
        <tr>
          <th>Category</th>
          <th>Tags</th>
          <th>Published At</th>
        </tr>
        <tr>
          <td>${Object.keys(YTCategories).find(
            key => YTCategories[key].toString() === details.snippet.categoryId
          ) || 'Unknown'}</td>
          <td style="max-width:250px;">${details.snippet.tags?.join(', ') ||
            'No tags'}</td>
          <td>${details.snippet.publishedAt}</td>
        </tr>
      </table>
    `)
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

// Initialize and start the content filter
const youtubeFilter = new YouTubeContentFilter()
youtubeFilter.start()

export {} // Ensure this is a module
