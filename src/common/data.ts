import { QuotaUsage } from '../popup/types/index';

import { Rule, MatcherType } from '../popup/types';

const rules: Rule[] = [
  {
    id: 'someuuid',
    matcher: {
      type: MatcherType.URL,
      value: /^chess\.com/
    },
    daysOfWeek: [1, 2, 3],
    startTime: '00:00',
    endTime: '23:59',
    activeQuota: 27,
    visibilityQuota: 10,
  }
]

const quotaUsage: QuotaUsage[] = [
  {
    id: 'someuuid',
    activeUsage: 5,
    visibilityUsage: 5,
  }
]

export { rules, quotaUsage }
