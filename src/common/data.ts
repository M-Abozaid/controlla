import { RuleObj, MatcherType, QuotaUsage } from '../types'

const rules: RuleObj[] = [
  {
    _id: 'someuuid',
    matcher: {
      type: MatcherType.URL,
      value: /^chess\.com/,
    },
    daysOfWeek: [1, 2, 3],
    startTime: '00:00',
    endTime: '23:59',
    activeQuota: 27,
    visibilityQuota: 10,
  },
  {
    _id: 'someuuid',
    matcher: {
      type: MatcherType.URL,
      value: /^twitter\.com/,
    },
    daysOfWeek: [0, 1],
    startTime: '00:00',
    endTime: '23:59',
    activeQuota: 30,
    visibilityQuota: 10,
  },
  {
    _id: 'someuuid',
    matcher: {
      type: MatcherType.URL,
      value: /^facebook\.com/,
    },
    daysOfWeek: [0, 1, 6],
    startTime: '00:00',
    endTime: '23:59',
    activeQuota: 25,
    visibilityQuota: 10,
  },
]

const quotaUsage: QuotaUsage[] = [
  {
    ruleId: 'someuuid',
    _id: 'someuuid',
    activeUsage: 5,
    visibilityUsage: 5,
  },
]

export { rules, quotaUsage }
