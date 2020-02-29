import * as React from 'react'
import './Popup.scss'
import Header from './Header'
import RulePage from './RulePage'

interface AppProps {}

interface AppState {}

export default class Popup extends React.Component<AppProps, AppState> {
  constructor(props: AppProps, state: AppState) {
    super(props, state)
  }

  componentDidMount() {
    chrome.runtime.sendMessage({ popupMounted: true })
  }

  render() {
    return (
      <div className='popupContainer'>
        <Header />
        <RulePage />
      </div>
    )
  }
}
