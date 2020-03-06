import React, { useState } from 'react'
import './styles.scss'
import AddRule from '../AddRule'

import { Settings, Add } from '@material-ui/icons'
import { Tooltip, Zoom, Drawer, Switch } from '@material-ui/core'

const Header = () => {
  const [showAddRuleModal, toggleAddRuleModal] = useState(false)

  const [drawerOpen, setDrawerOpen] = useState(false)

  const [toggleColor, setToggleColor] = useState(true)

  return (
    <>
      <div className={`header__main ${toggleColor ? 'blue' : 'black'}`}>
        <div className='header__title'>
          <span>Controlla</span>
        </div>

        <div>
          <div className='header__button'>
            <Tooltip
              TransitionComponent={Zoom}
              TransitionProps={{ timeout: 300 }}
              title='Add Rule'
              arrow
            >
              <Add onClick={() => toggleAddRuleModal(true)} />
            </Tooltip>
          </div>

          <div className='header__button'>
            <Tooltip
              TransitionComponent={Zoom}
              TransitionProps={{ timeout: 300 }}
              title='Settings'
              arrow
            >
              <Settings onClick={() => setDrawerOpen(true)} />
            </Tooltip>
          </div>

          {/* <Drawer
            anchor='bottom'
            open={drawerOpen}
            onClose={() => setDrawerOpen(false)}
          >
            <span>Header Color</span>
            <Switch
              checked={toggleColor}
              color={toggleColor ? 'primary' : 'secondary'}
              onChange={() => setToggleColor(!toggleColor)}
            />
          </Drawer> */}
        </div>
      </div>

      <div>
        {showAddRuleModal && (
          <AddRule
            onRuleAdded={() => null}
            onHide={() => toggleAddRuleModal(false)}
          />
        )}
      </div>
    </>
  )
}
export default Header
