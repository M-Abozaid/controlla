import React, { useState } from 'react'
import './styles.scss'

import MButton from '@material-ui/core/Button'
import GavelIcon from '@material-ui/icons/Gavel'
import { Modal, Button, Form, Spinner, ButtonGroup } from 'react-bootstrap'

interface AddButton {}

const AddButton = () => {
  // show modal
  const [show, setShow] = useState(false)
  const toggleShow = () => setShow(!show)

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

  return (
    <>
      {/* AddRule Button */}

      <div className='add-rule__main'>
        <MButton
          className='add-rule__button'
          variant='contained'
          color='primary'
          startIcon={<GavelIcon />}
          onClick={toggleShow}
        >
          Add Rule
        </MButton>
      </div>

      {/* Modal */}

      <Modal
        size='lg'
        show={show}
        centered
        onHide={toggleShow}
        aria-labelledby='contained-modal-title-vcenter'
      >
        <Modal.Header className='modal__header' closeButton>
          <Modal.Title id='contained-modal-title-vcenter'>Add Rule</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {/* Input From */}

          <Form
            className='add-rule__form'
            onSubmit={e => {
              e.preventDefault()
              setTimeout(() => {
                setShow(false)
                setSubmittingFrom(false)
                setTimeInputs(initialTimeInputs)
                setDaysOfWeek(initialDaysOfWeek)
              }, 1000)
            }}
          >
            {/* Time inputs */}

            <div className='time__input-group'>
              <Form.Control
                type='text'
                placeholder='Start'
                name='startTime'
                value={startTime}
                onChange={e => handleTimeInputChange(e)}
              />

              <Form.Control
                type='text'
                placeholder='End'
                name='endTime'
                value={endTime}
                onChange={e => handleTimeInputChange(e)}
              />

              <Form.Control
                type='text'
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
                  {number}
                </Button>
              ))}
            </ButtonGroup>

            {/* Submit Button */}

            <Button
              className='submit__button'
              variant='danger'
              type='submit'
              block
              onClick={() => !submittingFrom && setSubmittingFrom(true)}
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

            {/*  */}
          </Form>
        </Modal.Body>
      </Modal>
    </>
  )
}

export default AddButton
