import * as React from 'react'
import './styles.scss'
import { ProgressBar } from 'react-bootstrap'
import TimerIcon from '@material-ui/icons/Timer'
import { ButtonGroup, Button } from '@material-ui/core'
import DateRangeIcon from '@material-ui/icons/DateRange'
import { getRuleTitle } from '../Services'

interface RuleProps {
  ruleTitle: RegExp | string
  activeQuota: number
  visibilityQuota: number
  startTime: string
  endTime: string
  daysOfWeek: number[]
}

const Rule: React.FC<RuleProps> = ({
  ruleTitle,
  activeQuota,
  visibilityQuota,
  startTime,
  endTime,
  daysOfWeek,
}) => {
  const quotaPercentage = Math.round((20 / activeQuota) * 100)

  return (
    <div className='rule__main'>
      <h4 className='rule__title'>{getRuleTitle(ruleTitle)}</h4>

      <div>
        <ProgressBar
          className='rule__progress-bar'
          now={quotaPercentage}
          label={`${quotaPercentage} %`}
        />
        <span className='rule__progress-time'>{activeQuota}</span>
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
          aria-label='small outlined button group'
          color='primary'
        >
          {[0, 1, 2, 3, 4, 5, 6].map((number, idx) => {
            if (daysOfWeek.includes(number)) {
              return (
                <Button key={idx} className='rule__days-week--active'>
                  {number}
                </Button>
              )
            } else {
              return <Button key={idx}>{number}</Button>
            }
          })}
        </ButtonGroup>
      </div>
    </div>
  )
}

export default Rule
