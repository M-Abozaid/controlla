import * as React from 'react'
import './styles.scss'

interface AppProps {}

interface AppState {}

export default class Header extends React.Component<AppProps, AppState> {
  constructor(props: AppProps, state: AppState) {
    super(props, state)
  }

  render() {
    return (
      <div className='header__main'>
        <div className='header__title'>
          <span>Controlla</span>
        </div>
        <div className='settings__button'>
          <i className='fas fa-cog'></i>
        </div>
      </div>
    )
  }
}
