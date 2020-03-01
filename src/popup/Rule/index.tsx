import * as React from 'react'
import './styles.scss'
import { ProgressBar } from 'react-bootstrap'
import TimerIcon from '@material-ui/icons/Timer'
import { ButtonGroup, Button } from '@material-ui/core'
import DateRangeIcon from '@material-ui/icons/DateRange'

// interface RuleProps {
//   quotaTime: number
//   timeOfDay: QuotaTime
//   daysOfWeek: number[]
// }

const Rule = ({ ruleTitle, quotaTime, timeOfDay, daysOfWeek }) => {
  const quotaPercentage = (timeOfDay.quota / quotaTime) * 100

  return (
    <div className='rule__main'>
      <h4 className='rule__title'>{ruleTitle}</h4>

      <div>
        <ProgressBar
          className='rule__progress-bar'
          now={quotaPercentage}
          label={`${quotaPercentage} %`}
          animated
        />
        <span className='rule__progress-time'>{quotaTime}</span>
      </div>

      <div className='rule__time-day'>
        <TimerIcon />
        <span>Start: {timeOfDay.startTime}</span>
        <span>End: {timeOfDay.endTime}</span>
        <span>Quota: {timeOfDay.quota} m</span>
      </div>

      <div className='rule__days-week'>
        <DateRangeIcon />
        <ButtonGroup
          size='small'
          aria-label='small outlined button group'
          color='primary'
        >
          {[0, 1, 2, 3, 4, 5, 6].map(number => {
            if (daysOfWeek.includes(number)) {
              return (
                <Button className='rule__days-week--active'>{number}</Button>
              )
            } else {
              return <Button>{number}</Button>
            }
          })}
        </ButtonGroup>
      </div>
    </div>
  )
}

export default Rule
