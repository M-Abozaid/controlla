import * as React from 'react'
import './styles.scss'

import TabsPanel from '../TabsPanel'

import data from '../data'
import { getRuleTitle } from '../utils'

interface MainPageProps {}

interface MainPageState {}

export default class MainPage extends React.Component<
  MainPageProps,
  MainPageState
> {
  constructor(props: MainPageProps, state: MainPageState) {
    super(props, state)
  }

  render() {
    return (
      <div className='main-page'>
        <h4 className='main-page__title'>{getRuleTitle(data[0])}</h4>
        <div className='main-page__tabs'>
          <TabsPanel />
        </div>
      </div>
    )
  }
}
