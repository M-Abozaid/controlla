import React, { useState } from 'react'
import { Form } from 'react-bootstrap'

import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'
import { Matcher, MatcherType } from '../../types'
import SelectYTCat from '../SelectYTCat'
import ChipInput from 'material-ui-chip-input'
import { Button, Grid } from '@material-ui/core'
export interface Props {
  matcher: Matcher
  onMatcherUpdated: (matcher: Matcher) => void
}

const MatcherForm = ({ matcher, onMatcherUpdated }) => {
  console.log('matcher ', matcher)
  const [type, setMatcherType] = React.useState(matcher.type || MatcherType.URL)
  const [value, setMatcherValue] = useState(matcher.value)

  const [isRegex, setIsRegex] = useState(
    !matcher.value && type === MatcherType.URL
      ? true
      : typeof matcher.value !== 'string'
  )

  const handleMatcherTypeChange = event => {
    const newMatcherType = event.target?.value
    setMatcherType(newMatcherType)

    setMatcherValue(undefined)

    onMatcherUpdated({ type: newMatcherType, value })
  }

  const handleValueChange = newValue => {
    console.log('matcher value changed ', newValue)

    setMatcherValue(newValue)

    onMatcherUpdated({ type, value: newValue, isRegex })
  }

  const toggleIsRegex = () => {
    onMatcherUpdated({ type, value, isRegex: !isRegex })
    setIsRegex(!isRegex)
  }
  const getMatcherInput = () => {
    switch (type) {
      case MatcherType.YT_CATEGORY:
        return <SelectYTCat setMatcherValue={handleValueChange} />
      case MatcherType.YT_TAGS:
        return (
          <ChipInput
            defaultValue={value || []}
            onChange={chips => handleValueChange(chips)}
          />
        )
      default:
        return (
          <Form.Control
            className='macher-type__input'
            type='text'
            required
            placeholder='Matcher Value'
            name='urlRegex'
            value={value || ''}
            onChange={evt => handleValueChange(evt.target.value)}
          />
        )
    }
  }
  return (
    <div className='add-rule__form'>
      <div className='matcher-type__main'>
        <span>Matcher Type</span>
        <Select
          className='matcher-type__select'
          labelId='select-label'
          value={type}
          onChange={handleMatcherTypeChange}
        >
          {Object.keys(MatcherType).map(mt => (
            <MenuItem key={mt} value={mt}>
              {mt}
            </MenuItem>
          ))}
        </Select>
      </div>
      <Grid container>
        <Grid item xs={8}>
          {' '}
          {getMatcherInput()}
        </Grid>
        {matcher.type === MatcherType.URL && (
          <Grid item xs={4}>
            <Button
              onClick={toggleIsRegex}
              style={{ color: isRegex ? 'blue' : 'gray' }}
            >
              *
            </Button>
          </Grid>
        )}
      </Grid>
    </div>
  )
}

export default MatcherForm
