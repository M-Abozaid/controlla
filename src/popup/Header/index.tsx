import React, { useState } from 'react'
import './styles.scss'
import SettingsIcon from '@material-ui/icons/Settings'
import Add from '@material-ui/icons/Add'

interface HeaderProps {
  onAdd: any
}

const Header: React.FC<HeaderProps> = ({ onAdd }) => {
  return (
    <div className='header__main'>
      <div className='header__title'>
        <span>Controlla</span>
      </div>
      <div className='header__buttons'>
        <div className='header__button add__button'>
          <Add onClick={onAdd} />
        </div>
        <div className='header__button settings__button'>
          <SettingsIcon />
        </div>
      </div>
    </div>
  )
}
export default Header
