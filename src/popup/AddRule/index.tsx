import React, { useState, useRef, useEffect } from 'react'
import './styles.scss'
import { MatcherType, YTCategories } from '../../types'
import storage from '../../common/storage'

import TimeRangeSlider from 'react-time-range-slider'
import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'

import SelectYTCat from './SelectYTCat'

import {
  Modal,
  Button,
  Form,
  Spinner,
  ButtonGroup,
  Overlay,
  Tooltip,
} from 'react-bootstrap'
import { getActiveTab, extractHostname, escapeRegExp } from '../Services'
import moment from 'moment'
//
interface AddRule {
  onRuleAdded: () => void
  onHide: ()=> void
}

const AddRule = ({ onRuleAdded, onHide }) => {
  useEffect(() => {
    async function getActiveTabAsync() {
      const [activeTab] = await getActiveTab()
      const firstActiveTabUrl = extractHostname(activeTab.url)
      setActiveTabUrl(firstActiveTabUrl)
      setMatcherValue(escapeRegExp(firstActiveTabUrl))
    }

    getActiveTabAsync()
  }, [])

  // active tab url
  const [activeTabUrl, setActiveTabUrl] = useState('')
  const escapedActiveTab = escapeRegExp(activeTabUrl)

  // matcher type and handler
  const [matcherType, setmatcherType] = React.useState(MatcherType.URL)
  const handleMatcherChange = event => {
    const newMatcher = event.target.value
    setmatcherType(newMatcher)
    if (newMatcher === MatcherType.URL) {
      setShowYTCategory(false)
      setMatcherValue(escapedActiveTab)
    } else if (newMatcher === MatcherType.YT_CATEGORY) setShowYTCategory(true)
    else {
      setShowYTCategory(false)
      setMatcherValue('')
    }
  }

  // matcher value and show yt category
  const [matcherValue, setMatcherValue] = useState('')

  const [showYTCategory, setShowYTCategory] = useState(false)

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
      if(!showOverlay) {
         setShowOverlay(true)
        }
      setTimeout(() => !showOverlay && setShowOverlay(false), 2000)
    } else if (startTimeParsed > endTimeParsed) {
      if(!showOverlay) {
        setShowOverlay(true)
       }
      setTimeout(() => !showOverlay && setShowOverlay(false), 2000)
    } else {
      setSubmittingFrom(true)

      const convDaysOfWeek = Object.keys(daysOfWeek).map(day => {
        if (daysOfWeek[day]) return parseInt(day, 10)
      })

      const convMatcherValue =
        matcherType === MatcherType.URL
          ? new RegExp(matcherValue)
          : matcherValue

      await storage.createRule({
        matcher: {
          type: matcherType,
          value: convMatcherValue,
        },
        daysOfWeek: convDaysOfWeek,
        startTime: start,
        endTime: end,
        activeQuota: parseInt(activeQuota, 10) * 60000,
        visibilityQuota: parseInt(visibilityQuota, 10) * 60000,
      })

      onHide()
      onRuleAdded()
      setSubmittingFrom(false)
      setQuotaTime(quotaTimeInitial)
      setDaysOfWeek(initialDaysOfWeek)
      setTimeRange({ ...timeRangeInitial })
    }
  }

  return (
    <>
      <Modal
        size='lg'
        show
        centered
        onHide={onHide}
        aria-labelledby='contained-modal-title-vcenter'
      >
        <Modal.Header className='modal__header' closeButton>
          <Modal.Title id='contained-modal-title-vcenter'>Add Rule</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form
            className='add-rule__form'
            onSubmit={async e => await handleFormSubmitting(e)}
          >
            <div className='matcher-type__main'>
              <span>Matcher Type</span>
              <Select
                className='matcher-type__select'
                labelId='select-label'
                value={matcherType}
                onChange={handleMatcherChange}
              >
                {Object.keys(MatcherType).map(matcher => (
                  <MenuItem key={matcher} value={matcher}>
                    {matcher}
                  </MenuItem>
                ))}
              </Select>
            </div>

            {showYTCategory ? (
              <SelectYTCat setMatcherValue={setMatcherValue} />
            ) : (
              <Form.Control
                className='macher-type__input'
                type='text'
                required
                placeholder='Matcher Value'
                name='urlRegex'
                value={matcherValue}
                onChange={(e: any) => setMatcherValue(e.target.value)}
              />
            )}

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
        </Modal.Body>
      </Modal>
    </>
  )
}

export default AddRule
