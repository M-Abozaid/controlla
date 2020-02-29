import * as React from 'react'
import './styles.scss'
import TabsPanel from '../TabsPanel'

import data from '../data'
import { getRuleTitle } from '../utils'

interface AppProps {}

interface AppState {}

export default class RulePage extends React.Component<AppProps, AppState> {
  constructor(props: AppProps, state: AppState) {
    super(props, state)
  }

  render() {
    return (
      <div className='rule-page__main'>
        <h3 className='rule-page__title'>{getRuleTitle(data[0])}</h3>
        <TabsPanel />
      </div>
    )
  }
}
