import React, { useState, useRef, useEffect } from 'react'
import './styles.scss'
import storage from '../common/storage'

import TimeRangeSlider from 'react-time-range-slider'

import {
  Button,
  Form,
  Spinner,
  ButtonGroup,
  Overlay,
  Tooltip,
  Modal,
} from 'react-bootstrap'
import { getActiveTab, extractHostname, escapeRegExp } from '../popup/Services'
import moment from 'moment'
import MatcherForm from './matcherForm'
import { Matcher, MatcherType } from '../types'
import { Add } from '@material-ui/icons'
import { Grid } from '@material-ui/core'
//
interface AddRule {
  onRuleAdded: () => void
}

const AddRule = ({ onRuleAdded }) => {
  useEffect(() => {
    async function getActiveTabAsync() {
      const [activeTab] = await getActiveTab()
      const firstActiveTabUrl = extractHostname(activeTab.url)
      setActiveTabUrl(firstActiveTabUrl)
      console.log('Set matchers ', firstActiveTabUrl)
      setMatchers([
        {
          type: MatcherType.URL,
          value: new RegExp(escapeRegExp(firstActiveTabUrl)),
        },
      ])
    }

    getActiveTabAsync()
  }, [])

  // active tab url
  const [activeTabUrl, setActiveTabUrl] = useState('')
  const escapedActiveTab = escapeRegExp(activeTabUrl)

  const [matchers, setMatchers] = useState([] as Matcher[])

  // submitting the from
  const [submittingFrom, setSubmittingFrom] = useState(false)

  // time input control
  const timeRangeInitial = {
    start: '00:00',
    end: '23:59',
  }
  const [timeRange, setTimeRange] = useState({ ...timeRangeInitial })
  const { start, end } = timeRange

  const quotaTimeInitial = { activeQuota: '', visibilityQuota: '' }
  const [quotaTime, setQuotaTime] = useState(quotaTimeInitial)
  const { activeQuota, visibilityQuota } = quotaTime
  const handleQuotaChange = e =>
    setQuotaTime({ ...quotaTime, [e.target.name]: e.target.value })

  const [priority, setPriority] = useState(1)
  // days of the week
  const initialDaysOfWeek = {
    0: false,
    1: false,
    2: false,
    3: false,
    4: false,
    5: false,
    6: false,
  }
  const allDaysOfWeekOn = {
    0: true,
    1: true,
    2: true,
    3: true,
    4: true,
    5: true,
    6: true,
  }
  const [daysOfWeek, setDaysOfWeek] = useState(initialDaysOfWeek)

  const [allWeekOn, setAllWeekOn] = useState(false)
  const handleAllWeek = () => {
    if (allWeekOn) {
      setDaysOfWeek(initialDaysOfWeek)
      setAllWeekOn(false)
    } else {
      setDaysOfWeek(allDaysOfWeekOn)
      setAllWeekOn(true)
    }
  }

  const updateMatcher = (update, i) => {
    console.log('update matcher ', update, i)
    matchers[i] = { ...matchers[i], ...update }
    setMatchers([...matchers])
  }

  const addMatcher = () => {
    setMatchers([
      ...matchers,
      { type: MatcherType.URL, value: new RegExp(escapedActiveTab) },
    ])
  }
  // form validation
  const addButtonTarget = useRef(null)
  const [showOverlay, setShowOverlay] = useState(false)

  // form submittion
  const handleFormSubmitting = async e => {
    e.preventDefault()
    let daysCount = 0

    const startTimeParsed = parseInt(start.substring(0, 2), 10)
    const endTimeParsed = parseInt(end.substring(0, 2), 10)

    Object.keys(daysOfWeek).map(day => !daysOfWeek[day] && daysCount++)

    if (daysCount === 7) {
      if (!showOverlay) {
        setShowOverlay(true)
      }
      setTimeout(() => !showOverlay && setShowOverlay(false), 2000)
    } else if (startTimeParsed > endTimeParsed) {
      if (!showOverlay) {
        setShowOverlay(true)
      }
      setTimeout(() => !showOverlay && setShowOverlay(false), 2000)
    } else {
      setSubmittingFrom(true)

      const convDaysOfWeek = Object.keys(daysOfWeek).map(day => {
        if (daysOfWeek[day]) return parseInt(day, 10)
      })

      console.log('create rule ', matchers)
      await storage.createRule({
        matchers,
        daysOfWeek: convDaysOfWeek,
        startTime: start,
        endTime: end,
        activeQuota: parseInt(activeQuota, 10) * 60000,
        visibilityQuota: parseInt(visibilityQuota, 10) * 60000,
        priority,
      })

      onRuleAdded()
      setSubmittingFrom(false)
      setQuotaTime(quotaTimeInitial)
      setDaysOfWeek(initialDaysOfWeek)
      setTimeRange({ ...timeRangeInitial })
    }
  }

  return (
    <>
      <Grid container direction='row' spacing={2}>
        <Grid item xs={12}>
          <h2>Add Rule.</h2>

          <Form
            className='add-rule__form'
            onSubmit={async e => await handleFormSubmitting(e)}
          >
            <Grid>
              <Form.Control
                required
                min='1'
                type='number'
                placeholder='Priority'
                name='priority'
                value={priority.toString()}
                // eslint-disable-next-line radix
                onChange={e => setPriority(parseInt(e.target.value))}
              />
            </Grid>
            {matchers.map((matcher, i) => (
              <MatcherForm
                key={i}
                matcher={matcher}
                onMatcherUpdated={update => updateMatcher(update, i)}
              ></MatcherForm>
            ))}

            <Add onClick={() => addMatcher()} />
            <div className='start-end__time'>
              <span>{timeRange.start}</span>
              <span>{timeRange.end}</span>
            </div>

            <div className='time-range__slider'>
              <TimeRangeSlider
                disabled={false}
                format={24}
                maxValue={'23:59'}
                minValue={'00:00'}
                name={'time_range'}
                onChangeStart={console.log}
                onChangeComplete={console.log}
                onChange={setTimeRange}
                step={5}
                value={timeRange}
              />
            </div>

            <div className='quota__time-gruop'>
              <Form.Control
                required
                min='0'
                type='number'
                placeholder='Active Quota'
                name='activeQuota'
                value={activeQuota}
                onChange={e => handleQuotaChange(e)}
              />

              <Form.Control
                required
                min='0'
                type='number'
                placeholder='Visibility Quota'
                name='visibilityQuota'
                value={visibilityQuota}
                onChange={e => handleQuotaChange(e)}
              />
            </div>

            <ButtonGroup
              className='week__button-group'
              aria-label='button-group'
            >
              {Object.keys(daysOfWeek).map((num, idx) => (
                <Button
                  key={idx}
                  variant={daysOfWeek[num] ? 'primary' : 'light'}
                  onClick={() =>
                    setDaysOfWeek({
                      ...daysOfWeek,
                      [num]: !daysOfWeek[num],
                    })
                  }
                >
                  {moment(parseInt(num, 10), 'd').format('dd')}
                </Button>
              ))}

              <Button
                style={{ marginLeft: '5px' }}
                variant={allWeekOn ? 'outline-secondary' : 'primary'}
                onClick={handleAllWeek}
              >
                {allWeekOn ? '-' : '+'}
              </Button>
            </ButtonGroup>

            <Button
              className='submit__button'
              variant='danger'
              type='submit'
              block
              ref={addButtonTarget}
            >
              {submittingFrom ? (
                <Spinner
                  as='span'
                  animation='border'
                  size='sm'
                  role='status'
                  aria-hidden='true'
                />
              ) : (
                <span>Submit</span>
              )}
            </Button>

            <Overlay
              target={addButtonTarget.current}
              show={showOverlay}
              placement='top'
            >
              <Tooltip id='overlay'>
                You have to choose at least one day
              </Tooltip>
            </Overlay>
          </Form>
        </Grid>
      </Grid>
    </>
  )
}

export default AddRule
