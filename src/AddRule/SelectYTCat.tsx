import React, { useState, useEffect } from 'react'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import MenuItem from '@material-ui/core/MenuItem'
import Menu from '@material-ui/core/Menu'

import Checkbox from '@material-ui/core/Checkbox'
import InputLabel from '@material-ui/core/InputLabel'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'

import { YTCategories } from '../types'
import { FormControlLabel } from '@material-ui/core'

const ITEM_HEIGHT = 48
const ITEM_PADDING_TOP = 8

const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
  getContentAnchorEl: null,
  anchorOrigin: {
    vertical: 'bottom' as const,
    horizontal: 'center' as const,
  },
  transformOrigin: {
    vertical: 'top' as const,
    horizontal: 'center' as const,
  },
  variant: 'menu' as const,
}
const useStyles = makeStyles(theme => ({
  formControl: {
    margin: theme.spacing(1),
    width: 300,
  },
  indeterminateColor: {
    color: '#f50057',
  },
  selectAllText: {
    fontWeight: 500,
  },
  selectedAll: {
    backgroundColor: 'rgba(0, 0, 0, 0.08)',
    '&:hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.08)',
    },
  },
  root: {
    '& .MuiSelect-selectMenu': {
      whiteSpace: 'initial !important',
    },
    '& .MuiInputBase-root ': {
      width: '100%',
    },
  },
  menuPaper: {
    maxHeight: 'initial !important',
  },
}))

interface SelectYTCatProps {
  setMatcherValue: (value: any) => void
}

const options = Object.keys(YTCategories).filter(
  key => !isNaN(Number(YTCategories[key]))
)

const values = options.map(option => YTCategories[option])

const SelectYTCat: React.FC<SelectYTCatProps> = ({ setMatcherValue }) => {
  const classes = useStyles()
  const [selected, setSelected] = useState<string[]>([])
  const isAllSelected = options.length > 0 && selected.length === options.length

  const handleChange = event => {
    const value = event.target.value
    if (value[value.length - 1] === 'all') {
      setSelected(
        selected.length ===
          Object.keys(YTCategories).filter(
            key => !isNaN(Number(YTCategories[key]))
          ).length
          ? []
          : options.map(o => YTCategories[o])
      )
      return
    }
    setSelected(value)
    setMatcherValue(value)
  }

  const handleCheckboxChange = (e, value) => {
    let newSelected
    if (e.target.checked) {
      if (selected.includes(value)) return
      newSelected = [...selected, value]
    } else {
      newSelected = [...selected.filter(v => v !== value)]
    }
    setSelected(newSelected)
    setMatcherValue(newSelected)
  }

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelected([])
      setMatcherValue([])
    } else {
      setSelected(values)
      setMatcherValue(values)
    }
  }
  return (
    <div className={classes.root}>
      <FormControlLabel
        control={
          <Checkbox
            classes={{ indeterminate: classes.indeterminateColor }}
            checked={isAllSelected}
            indeterminate={
              selected.length > 0 &&
              selected.length <
                Object.keys(YTCategories).filter(
                  key => !isNaN(Number(YTCategories[key]))
                ).length
            }
            onChange={toggleSelectAll}
          />
        }
        label='Select all'
      />

      {Object.keys(YTCategories)
        .filter(key => !isNaN(Number(YTCategories[key])))
        .map(option => (
          <FormControlLabel
            key={YTCategories[option]}
            control={
              <Checkbox
                checked={selected.indexOf(YTCategories[option]) > -1}
                onChange={e => handleCheckboxChange(e, YTCategories[option])}
              />
            }
            label={option}
          />
        ))}
      {/* </Select> */}
    </div>
  )
}

export default SelectYTCat

/**
 *
 <div className={classes.root}>
      <InputLabel id='mutiple-select-label'>Multiple Select</InputLabel>
      <Select
        labelId='mutiple-select-label'
        multiple
        value={selected}
        onChange={handleChange}
        renderValue={s => {
          console.log('render label ')
          return (s as string[]).length
            ? (s as string[])
                .map(value => options.find(o => YTCategories[o] === value))
                .join(', ')
            : 'Select youtube categories'
        }}
        placeholder={'Select youtube categories'}
        MenuProps={{ ...MenuProps, classes: { paper: classes.menuPaper } }}
      >
      <MenuItem
        value='all'
        classes={{
          root: isAllSelected ? classes.selectedAll : '',
        }}
      >
        <ListItemIcon>
          <Checkbox
            classes={{ indeterminate: classes.indeterminateColor }}
            checked={isAllSelected}
            indeterminate={
              selected.length > 0 &&
              selected.length <
                Object.keys(YTCategories).filter(
                  key => !isNaN(Number(YTCategories[key]))
                ).length
            }
          />
        </ListItemIcon>
        <ListItemText
          classes={{ primary: classes.selectAllText }}
          primary='Select All'
        />
      </MenuItem>
      {Object.keys(YTCategories)
        .filter(key => !isNaN(Number(YTCategories[key])))
        .map(option => (
          <MenuItem key={YTCategories[option]} value={YTCategories[option]}>
            <ListItemIcon>
              <Checkbox
                checked={selected.indexOf(YTCategories[option]) > -1}
                onChange={e => handleCheckboxChange(e, YTCategories[option])}
              />
            </ListItemIcon>
            <ListItemText primary={option} />
          </MenuItem>
        ))}
      </Select>
    </div>
 */
