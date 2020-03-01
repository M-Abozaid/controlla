import React from 'react'
import './styles.scss'
import Button from '@material-ui/core/Button'
import GavelIcon from '@material-ui/icons/Gavel'

interface AddButton {}

const AddButton = () => {
  return (
    <div className='add-rule__main'>
      <Button
        className='add-rule__button'
        variant='contained'
        color='secondary'
        startIcon={<GavelIcon />}
        onClick={() => alert('hi there')}
      >
        Add Rule
      </Button>
    </div>
  )
}

export default AddButton
