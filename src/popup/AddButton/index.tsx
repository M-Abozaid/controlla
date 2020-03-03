import React, { useState } from 'react'
import './styles.scss'
import { Modal, Button, Form, Row, Col, ButtonGroup } from 'react-bootstrap'
import MButton from '@material-ui/core/Button'
import GavelIcon from '@material-ui/icons/Gavel'

interface AddButton {}

const AddButton = () => {
  const [show, setShow] = useState(false)

  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)

  const daysNumber = [0, 1, 2, 3, 4, 5, 6]

  return (
    <>
      <div className='add-rule__main'>
        <MButton
          className='add-rule__button'
          variant='contained'
          color='primary'
          startIcon={<GavelIcon />}
          onClick={handleShow}
        >
          Add Rulee
        </MButton>
      </div>

      <Modal
        size='lg'
        show={show}
        centered
        onHide={handleClose}
        aria-labelledby='contained-modal-title-vcenter'
      >
        <Modal.Header className='modal__header' closeButton>
          <Modal.Title id='contained-modal-title-vcenter'>Add Rule</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form onSubmit={e => e.preventDefault()}>
            <Row>
              <Col>
                <Form.Group controlId='startTime'>
                  <Form.Control type='text' placeholder='Start' />
                </Form.Group>
              </Col>

              <Col>
                <Form.Group controlId='endTime'>
                  <Form.Control type='text' placeholder='End' />
                </Form.Group>
              </Col>

              <Col>
                <Form.Group controlId='quotaTime'>
                  <Form.Control type='text' placeholder='Quota' />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group controlId='daysOfWeek'>
              <ButtonGroup
                className='week__button-group'
                aria-label='button-group'
              >
                {daysNumber.map((number, idx) => (
                  <Button key={idx}>{number}</Button>
                ))}
              </ButtonGroup>
            </Form.Group>

            <Button variant='dark' type='submit' block>
              Submit
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  )
}

export default AddButton
