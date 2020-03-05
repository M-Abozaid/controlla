import React from 'react'
import MenuItem from '@material-ui/core/MenuItem'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'

export default function SimpleSelect() {
  const [matcherType, setmatcherType] = React.useState('URL')

  const handleChange = event => {
    setmatcherType(event.target.value)
  }

  return (
    <div>
      <FormControl>
        Matcher Type{' '}
        <Select
          labelId='select-label'
          value={matcherType}
          onChange={handleChange}
        >
          <MenuItem value='URL'>URL</MenuItem>
          <MenuItem value='YT_CATEGORY'>YT CATEGORY</MenuItem>
          <MenuItem value='YT_CHANNEL'>YT CHANNEL</MenuItem>
          <MenuItem value='YT_TITLE'>YT TITLE</MenuItem>
        </Select>
      </FormControl>
    </div>
  )
}
