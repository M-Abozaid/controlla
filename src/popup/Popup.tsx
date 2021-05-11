import React, { useEffect, useState } from 'react'
import './Popup.scss'
import Header from './Header'
import TabsPanel from './TabsPanel'

import storage from '../common/storage'

const Popup = () => {
  const [hasStorageInit, setHasStorageInit] = useState(false)

  useEffect(() => {
    async function initStorage() {
      await storage.init('popup')
      setHasStorageInit(true)
      console.log('storage initialized')
    }
    initStorage()
  }, [])

  return (
    <div className='popupContainer'>
      <Header />
      <div className='tabs-panel'>
        {
          hasStorageInit && <TabsPanel />
        }
      </div>
    </div>
  )
}
export default Popup
