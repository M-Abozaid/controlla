import React, { useState, useRef, useEffect } from 'react'
import './styles.scss'
import TimeRangeSlider from 'react-time-range-slider'
import {
  Modal,
  Button,
  Form,
  Spinner,
  ButtonGroup,
  Overlay,
  Tooltip,
} from 'react-bootstrap'
import { mapDayNumber, getActiveTab } from '../Services'

import storage from '../../common/storage'
import { MatcherType } from '../../types'

// get host name url
function extractHostname(url) {
  var hostname
  //find & remove protocol (http, ftp, etc.) and get hostname

  if (url.indexOf('//') > -1) {
    hostname = url.split('/')[2]
  } else {
    hostname = url.split('/')[0]
  }

  //find & remove port number
  hostname = hostname.split(':')[0]
  //find & remove "?"
  hostname = hostname.split('?')[0]

  return hostname
}

function escapeRegExp(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')
}

interface AddRule {
  onRuleAdded: Function
  onHide: Function
}

const AddRule = ({ onRuleAdded, onHide }) => {
  useEffect(() => {
    async function getActiveTabAsync() {
      const activeTab = await getActiveTab()
      const activeTabUrl = extractHostname(activeTab.url)
      const HostRegexEscaped = escapeRegExp(activeTabUrl)
      setRegexUrl(HostRegexEscaped)
    }

    getActiveTabAsync()
  }, [])

  // submitting the from
  const [submittingFrom, setSubmittingFrom] = useState(false)

  // time input control
  const timeRangeInitial = {
    start: '00:00',
    end: '23:59',
  }
  const [timeRange, setTimeRange] = useState({ ...timeRangeInitial })
  const timeRangeChange = time => {
    setTimeRange(time)
    setTimeInputs({ start: timeRange.start, end: timeRange.end, quotaTime })
  }

  // const initialTimeInputs = {
  //   start: '',
  //   end: '',
  //   quotaTime: '',
  // }
  const [timeInputs, setTimeInputs] = useState({
    ...timeRangeInitial,
    quotaTime: '1',
  })
  const { start, end, quotaTime } = timeInputs
  const handleTimeInputChange = e => {
    setTimeInputs({ ...timeInputs, [e.target.name]: e.target.value })
    if (e.target.name !== 'quotaTime')
      setTimeRange({ ...timeRange, [e.target.name]: e.target.value })
  }

  // regex url
  const [regexUrl, setRegexUrl] = useState('')

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

  return (
    <>
      {/* Modal */}

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
          {/* Input From */}

          <Form
            className='add-rule__form'
            onSubmit={async e => {
              e.preventDefault()
              let daysCount = 0

              const startTimeParsed = parseInt(start.substring(0, 2))
              const endTimeParsed = parseInt(end.substring(0, 2))

              Object.keys(daysOfWeek).map(
                day => !daysOfWeek[day] && daysCount++
              )

              if (daysCount === 7) {
                !showOverlay && setShowOverlay(true)
                setTimeout(() => !showOverlay && setShowOverlay(false), 2000)
              } else if (startTimeParsed > endTimeParsed) {
                !showOverlay && setShowOverlay(true)
                setTimeout(() => !showOverlay && setShowOverlay(false), 2000)
              } else {
                setSubmittingFrom(true)

                const convDaysOfWeek = Object.keys(daysOfWeek).map(day => {
                  if (daysOfWeek[day]) return parseInt(day)
                })

                const convRegexUrl = new RegExp(regexUrl)

                await storage.createRule({
                  matcher: {
                    type: MatcherType.URL,
                    value: convRegexUrl,
                  },
                  daysOfWeek: convDaysOfWeek,
                  startTime: start,
                  endTime: end,
                  activeQuota: parseInt(quotaTime),
                  visibilityQuota: Infinity,
                })

                onRuleAdded()
                onHide()
                setSubmittingFrom(false)
                setTimeInputs({ ...timeRangeInitial, quotaTime: '1' })
                setDaysOfWeek(initialDaysOfWeek)
              }
            }}
          >
            {/* regex url */}

            <Form.Control
              className='regex__input'
              type='text'
              required
              placeholder='Regex'
              name='urlRegex'
              value={regexUrl}
              onChange={e => setRegexUrl(e.target.value)}
            />

            {/* Time inputs */}

            <div className='time__input-group'>
              <Form.Control
                type='time'
                required
                placeholder='Start'
                name='start'
                value={start}
                onChange={e => handleTimeInputChange(e)}
              />

              <Form.Control
                type='time'
                required
                placeholder='End'
                name='end'
                value={end}
                onChange={e => handleTimeInputChange(e)}
              />

              <Form.Control
                required
                min='1'
                type='number'
                placeholder='Quota'
                name='quotaTime'
                value={quotaTime}
                onChange={e => handleTimeInputChange(e)}
              />
            </div>

            <div className='time-range__slider'>
              start {timeRange.start} end {timeRange.end}
              <TimeRangeSlider
                disabled={false}
                format={24}
                maxValue={'23:59'}
                minValue={'00:00'}
                name={'time_range'}
                onChangeStart={console.log}
                onChangeComplete={console.log}
                onChange={timeRangeChange}
                step={5}
                value={timeRange}
              />
            </div>

            {/* Days of the Week */}

            <ButtonGroup
              className='week__button-group'
              aria-label='button-group'
            >
              {Object.keys(daysOfWeek).map((number, idx) => (
                <Button
                  key={idx}
                  variant={daysOfWeek[number] ? 'primary' : 'light'}
                  onClick={() =>
                    setDaysOfWeek({
                      ...daysOfWeek,
                      [number]: !daysOfWeek[number],
                    })
                  }
                >
                  {mapDayNumber(parseInt(number))}
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

            {/* Submit Button */}

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
              {props => (
                <Tooltip id='overlay' {...props}>
                  You have to choose at least one day or End time must be after
                  Start Time
                </Tooltip>
              )}
            </Overlay>

            {/*  */}
          </Form>
        </Modal.Body>
      </Modal>
    </>
  )
}

export default AddRule
