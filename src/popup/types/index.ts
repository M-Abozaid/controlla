import { QuotaUsage } from './index';
/* Quota */

export enum MatcherType {
  'YT_CATEGORY',
  'URL',
  'YT_CHANNEL',
  'YT_TITLE',
}

export interface Matcher {
  type: MatcherType,
  value: string | RegExp
}
export interface Rule {
  id?: string,
  matcher: {
    type: MatcherType,
    value: string | RegExp
  },
  startTime: string,
  endTime: string,
  daysOfWeek: number[],
  activeQuota: any,
  visibilityQuota?: number,
}

export interface QuotaUsage {
  id?: string,
  activeUsage: number,
  visibilityUsage: number
}