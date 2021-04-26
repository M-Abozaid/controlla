import React, { useEffect } from 'react'
import './Popup.scss'
import Header from './Header'
import TabsPanel from './TabsPanel'

import storage from '../common/storage'

const Popup = () => {
  useEffect(() => {
    async function initStorage() {
      await storage.init('popup')
      console.log('storage initialized')
    }
    initStorage()
  }, [])

  return (
    <div className='popupContainer'>
      <Header />
      <div className='tabs-panel'>
        <TabsPanel />
      </div>
    </div>
  )
}
export default Popup
