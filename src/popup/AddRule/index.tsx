import React, { useState, useRef, useEffect } from 'react'
import './styles.scss'

import MButton from '@material-ui/core/Button'
import GavelIcon from '@material-ui/icons/Gavel'
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

interface AddRule {}

const AddRule = () => {
  useEffect(() => {
    async function getActiveTabAsync() {
      const activeTab = await getActiveTab()
      const activeTabUrl = extractHostname(activeTab.url)
      const HostRegexEscaped = escapeRegExp(activeTabUrl)
      console.log('host regex escaped', HostRegexEscaped)
      setRegexUrl(HostRegexEscaped)
    }

    getActiveTabAsync()
  }, [])

  // show modal
  const [showModal, setShowModal] = useState(false)
  const toggleShowModal = () => setShowModal(!showModal)

  // submitting the from
  const [submittingFrom, setSubmittingFrom] = useState(false)

  // time input control
  const initialTimeInputs = {
    startTime: '',
    endTime: '',
    quotaTime: '',
  }
  const [timeInputs, setTimeInputs] = useState(initialTimeInputs)
  const { startTime, endTime, quotaTime } = timeInputs
  const handleTimeInputChange = e =>
    setTimeInputs({ ...timeInputs, [e.target.name]: e.target.value })

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
  const [daysOfWeek, setDaysOfWeek] = useState(initialDaysOfWeek)

  // form validation
  const addButtonTarget = useRef(null)
  const [showOverlay, setShowOverlay] = useState(false)

  return (
    <>
      {/* AddRule Button */}

      <div className='add-rule__main'>
        <MButton
          className='add-rule__button'
          variant='contained'
          color='primary'
          startIcon={<GavelIcon />}
          onClick={toggleShowModal}
        >
          Add Rule
        </MButton>
      </div>

      {/* Modal */}

      <Modal
        size='lg'
        show={showModal}
        centered
        onHide={toggleShowModal}
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

              const startTimeParsed = parseInt(startTime.substring(0, 2))
              const endTimeParsed = parseInt(endTime.substring(0, 2))

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
                console.log(timeInputs)
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
                  startTime: startTime,
                  endTime: endTime,
                  activeQuota: parseInt(quotaTime),
                  visibilityQuota: 10,
                })

                setShowModal(false)
                setSubmittingFrom(false)
                setTimeInputs(initialTimeInputs)
                setDaysOfWeek(initialDaysOfWeek)

                // setTimeout(() => {
                //   setShowModal(false)
                //   setSubmittingFrom(false)
                //   setTimeInputs(initialTimeInputs)
                //   setDaysOfWeek(initialDaysOfWeek)
                // }, 1000)
              }
            }}
          >
            {/* regex url */}

            <Form.Control
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
                name='startTime'
                value={startTime}
                onChange={e => handleTimeInputChange(e)}
              />

              <Form.Control
                type='time'
                required
                placeholder='End'
                name='endTime'
                value={endTime}
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
