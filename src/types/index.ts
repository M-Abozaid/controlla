export enum MatcherType {
  'URL' = 'URL',
  'YT_TITLE' = 'YT_TITLE',
  'YT_CHANNEL' = 'YT_CHANNEL',
  'YT_CATEGORY' = 'YT_CATEGORY',
  'YT_TAGS' = 'YT_TAGS',
  'ADULT' = 'ADULT',
}

export interface Matcher {
  type: MatcherType
  value: any
  isRegex?: boolean
}

export interface RuleObj {
  _id?: string
  _rev?: string
  name?: string
  matchers: Matcher[]
  startTime: string
  endTime: string
  daysOfWeek: number[]
  activeQuota: any
  visibilityQuota?: number
  priority?: number
}

export interface QuotaUsage {
  _id?: string
  _rev?: string
  ruleId: string
  activeUsage: number
  visibilityUsage: number
  day: string
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
  status?: string
}

export enum YTCategories {
  'Film & Animation' = '1',
  'Autos & Vehicles' = '2',
  'Music' = '10',
  'Pets & Animals' = '15',
  'Sports' = '17',
  'Short Movies' = '18',
  'Travel & Events' = '19',
  'Gaming' = '20',
  'Videoblogging' = '21',
  'People & Blogs' = '22',
  'Comedy' = '23',
  'Entertainment' = '24',
  'News & Politics' = '25',
  'Howto & Style' = '26',
  'Education' = '27',
  'Science & Technology' = '28',
  'Nonprofits & Activism' = '29',
  'Movies' = '30',
  'Anime/Animation' = '31',
  'Action/Adventure' = '32',
  'Classics' = '33',
  'Documentary' = '35',
  'Drama' = '36',
  'Family' = '37',
  'Foreign' = '38',
  'Horror' = '39',
  'Sci-Fi/Fantasy' = '40',
  'Thriller' = '41',
  'Shorts' = '42',
  'Shows' = '43',
  'Trailers' = '44',
}

export interface PauseControlUsage {
  day: string
  usage: number
}

export const test = 'TEST2'
