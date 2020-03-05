import * as React from 'react'
import './styles.scss'
import { getRuleTitle, mapDayNumber } from '../Services'

import { ProgressBar, ButtonGroup, Button } from 'react-bootstrap'
import TimerIcon from '@material-ui/icons/Timer'
import DateRangeIcon from '@material-ui/icons/DateRange'
import Rule from '../../common/rule'

interface RuleProps {
  rule: Rule
}

const RuleComponent: React.FC<RuleProps> = ({ rule }) => {
  const { activeUsage } = rule.usage
  const { activeQuota, startTime, endTime, daysOfWeek } = rule.ruleObj
  const restQuota = activeQuota - activeUsage
  const quotaPercentage = Math.round((activeUsage / activeQuota) * 100)

  const daysNumber = [0, 1, 2, 3, 4, 5, 6]

  return (
    <div className='rule__main'>
      <h4 className='rule__title'>
        {getRuleTitle(rule.ruleObj.matcher.value)}
      </h4>

      <div onClick={() => {}} className='remove__rule'>
        &#10007;
      </div>

      <div>
        <ProgressBar
          className='rule__progress-bar'
          now={quotaPercentage}
          label={`${quotaPercentage} %`}
        />
        <span className='rule__progress-time'>{Math.floor(restQuota)} m</span>
      </div>

      <div className='rule__time-day'>
        <TimerIcon />
        <span>Start: {startTime}</span>
        <span>End: {endTime}</span>
        <span>Quota: {activeQuota} m</span>
      </div>

      <div className='rule__days-week'>
        <DateRangeIcon />
        <ButtonGroup
          className='rule__days-week--group'
          aria-label='days-of-week-gruop'
        >
          {daysNumber.map((number, idx) => (
            <Button
              key={idx}
              size='sm'
              variant={daysOfWeek.includes(number) ? 'primary' : 'light'}
            >
              {mapDayNumber(number)}
            </Button>
          ))}
        </ButtonGroup>
      </div>
    </div>
  )
}

export default RuleComponent
