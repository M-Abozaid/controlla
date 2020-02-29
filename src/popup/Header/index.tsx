import * as React from 'react'
import './styles.scss'
import SettingsIcon from '@material-ui/icons/Settings'

interface HeaderProps {}

const Header: React.FC<HeaderProps> = () => (
  <div className='header__main'>
    <div className='header__title'>
      <span>Controlla</span>
    </div>
    <div className='settings__button'>
      <SettingsIcon />
    </div>
  </div>
)

export default Header
