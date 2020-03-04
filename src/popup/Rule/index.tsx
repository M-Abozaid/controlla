import * as React from 'react'
import './styles.scss'
import { getRuleTitle, mapDayNumber } from '../Services'

import { ProgressBar } from 'react-bootstrap'
import TimerIcon from '@material-ui/icons/Timer'
import { ButtonGroup, Button } from '@material-ui/core'
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

      <div>
        <ProgressBar
          className='rule__progress-bar'
          now={quotaPercentage}
          label={`${quotaPercentage} %`}
        />
        <span className='rule__progress-time'>{restQuota} m</span>
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
          size='small'
          color='primary'
          aria-label='small outlined button group'
        >
          {daysNumber.map((number, idx) => (
            <Button
              key={idx}
              className={
                daysOfWeek.includes(number) ? 'rule__days-week--active' : ''
              }
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
