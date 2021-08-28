import React, { useState,  } from 'react'
import {
  Form,
} from 'react-bootstrap'

import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'
import { Matcher, MatcherType } from '../../types'
import SelectYTCat from '../AddRule/SelectYTCat'


export interface Props {
  matcher: Matcher;
  onMatcherUpdated: (matcher: Matcher) => void;
}

const MatcherForm = ({ matcher, onMatcherUpdated }) => {

  console.log('matcher ', matcher)
  const [type, setMatcherType] = React.useState(matcher.type || MatcherType.URL)
  const [value, setMatcherValue] = useState(matcher.value || '')
  const [showYTCategory, setShowYTCategory] = useState(false)




  const handleMatcherTypeChange = event => {
    const newMatcherType = event.target?.value
    setMatcherType(newMatcherType)
    if (newMatcherType === MatcherType.URL) {
      setShowYTCategory(false)
      const convMatcherValue =
        newMatcherType === MatcherType.URL
          ? new RegExp(newMatcherType)
          : newMatcherType
      setMatcherValue(convMatcherValue)
    } else if (newMatcherType === MatcherType.YT_CATEGORY) setShowYTCategory(true)
    else {
      setShowYTCategory(false)
      setMatcherValue('')
    }
    onMatcherUpdated({ type:newMatcherType, value })
  }

  const handleValueChange = (newValue) => {
    if (newValue === MatcherType.URL) {
      setShowYTCategory(false)
      const convMatcherValue =
        newValue === MatcherType.URL
          ? new RegExp(newValue)
          : newValue
      setMatcherValue(convMatcherValue)
    } else {
      setMatcherValue(newValue)
    }
    console.log('set matcher value ', newValue)
    onMatcherUpdated({ type, value:newValue })
}
  return ( <div
    className='add-rule__form'
  >
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

    {showYTCategory ? (
      <SelectYTCat setMatcherValue={handleValueChange} />
    ) : (
      <Form.Control
        className='macher-type__input'
        type='text'
        required
        placeholder='Matcher Value'
        name='urlRegex'
        value={value}
        onChange={evt=>handleValueChange(evt.target.value)}
      />
    )}
    </div> );
}

export default MatcherForm;


