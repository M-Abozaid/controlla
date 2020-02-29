import * as React from 'react'
import './styles.scss'
import { ProgressBar } from 'react-bootstrap'
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
          className='progress__bar'
          now={quotaPercentage}
          label={`${quotaPercentage} %`}
          animated
        />
        <span className='progress__bar--time'>{quotaTime}</span>
      </div>
    </div>
  )
}

export default Rule
