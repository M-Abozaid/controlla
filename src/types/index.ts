export enum MatcherType {
  'YT_CATEGORY'='YT_CATEGORY',
  'URL'='URL',
  'YT_CHANNEL'='YT_CHANNEL',
  'YT_TITLE'='YT_TITLE',
}

export interface Matcher {
  type: MatcherType
  value: string | RegExp
}
export interface RuleObj {
  _id?: string
  _rev?: string
  matcher: {
    type: MatcherType
    value: string | RegExp
  }
  startTime: string
  endTime: string
  daysOfWeek: number[]
  activeQuota: any
  visibilityQuota?: number
}

export interface QuotaUsage {
  _id?: string
  _rev?: string
  ruleId: string
  activeUsage: number
  visibilityUsage: number
}

interface Visibility {
  time: string | Date
  hidden?: boolean
  focus?: boolean
}

interface OneEvent {
  time: string | Date
}

interface OneAudibleState {
  time: string | Date
  audible: boolean
}

export interface Visit {
  url: string
  tabId: number
  _id?: string
  _rev?: string
  visitTime: string | Date
  title: string
  audible: boolean
  visibility: Visibility[]
  click: OneEvent[]
  keypress: OneEvent[]
  audibleState?: OneAudibleState[]
  leftTime?: string | Date
  ytDetails?: gapi.client.youtube.Video
  ytVideoId?: string
}
