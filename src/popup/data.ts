
import { Rule, MatcherType } from './types';
const data: Rule[] = [
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

export default data
