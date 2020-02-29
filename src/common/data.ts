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
    quota: 27
  }
]

const quotaUsage: QuotaUsage[] = [
  {
    id: 'someuuid',
    amount: 3
  }
]

export { rules, quotaUsage }
