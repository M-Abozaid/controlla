/* Quota */

export enum MatcherType {
  'YT_CATEGORY',
  'URL',
  'YT_CHANNEL',
  'YT_TITLE',
}
export interface Rule {
  id?: string,
  matcher:{
      type: MatcherType,
      value: string | RegExp
  },
  startTime: string,
  endTime: string,
  daysOfWeek: number[]
}
