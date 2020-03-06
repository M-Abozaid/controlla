import React, { useState, useEffect } from 'react'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import MenuItem from '@material-ui/core/MenuItem'
import Menu from '@material-ui/core/Menu'

import { YTCategories } from '../../types'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      backgroundColor: theme.palette.background.paper,
    },
  })
)

interface SelectYTCatProps {
  setMatcherValue: Function
}

const SelectYTCat: React.FC<SelectYTCatProps> = ({ setMatcherValue }) => {
  useEffect(() => {
    setAnchorEl(document.body)
  }, [])

  const classes = useStyles()
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)

  const handleClickListItem = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const [choosenCategory, setChoosenCategory] = useState('')

  return (
    <div className={classes.root}>
      <List component='nav' aria-label='Device settings'>
        <ListItem
          button
          aria-haspopup='true'
          aria-controls='lock-menu'
          onClick={handleClickListItem}
          style={{ paddingLeft: '0px' }}
        >
          <ListItemText
            primary={choosenCategory || 'Select Youtube category'}
          />
        </ListItem>
      </List>
      <Menu
        open={Boolean(anchorEl)}
        onClose={handleClose}
        keepMounted
        PaperProps={{
          style: {
            maxHeight: 220,
            width: '100%',
          },
        }}
      >
        {Object.keys(YTCategories)
          .filter(key => !isNaN(Number(YTCategories[key])))
          .map(cat => (
            <MenuItem
              key={cat}
              value={YTCategories[cat]}
              onClick={(e: any) => {
                setMatcherValue(e.target.value)
                setChoosenCategory(cat)
                setAnchorEl(null)
              }}
            >
              {cat}
            </MenuItem>
          ))}
      </Menu>
    </div>
  )
}

export default SelectYTCat
