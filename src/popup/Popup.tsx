import * as React from 'react'
import './Popup.scss'
import Header from './Header'
import TabsPanel from './TabsPanel'

const Popup = () => (
  <div className='popupContainer'>
    <Header />
    <div className='tabs-panel'>
      <TabsPanel />
    </div>
  </div>
)

export default Popup
