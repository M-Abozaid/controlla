import * as React from 'react'
import './styles.scss'
import { ProgressBar } from 'react-bootstrap'
import TimerIcon from '@material-ui/icons/Timer'
import { QuotaTime } from '../types'

interface RuleProps {
  quotaTime: number
  timeOfDay: QuotaTime
  daysOfWeek: number[]
}

const Rule: React.FC<RuleProps> = ({ quotaTime, timeOfDay, daysOfWeek }) => {
  const quotaPercentage = (timeOfDay.quota / quotaTime) * 100

  return (
    <div className='rule__main'>
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
    </div>
  )
}

export default Rule
