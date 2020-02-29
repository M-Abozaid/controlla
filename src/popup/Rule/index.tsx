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
      <ProgressBar
        now={quotaPercentage}
        label={`${quotaPercentage} %`}
        animated
      />
    </div>
  )
}

export default Rule
