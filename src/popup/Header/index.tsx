import React, { useState } from 'react'
import './styles.scss'
import SettingsIcon from '@material-ui/icons/Settings'
import Add from '@material-ui/icons/Add'
import AddRule from '../AddRule'

const Header = () => {
  const [showAddRuleModal, toggleAddRuleModal] = useState(false)

  return (
    <>
      <div className='header__main'>
        <div className='header__title'>
          <span>Controlla</span>
        </div>

        <div>
          <div className='header__button'>
            <Add onClick={() => toggleAddRuleModal(true)} />
          </div>

          <div className='header__button'>
            <SettingsIcon />
          </div>
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
