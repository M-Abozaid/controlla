import React, { useEffect } from 'react'
import './Settings.scss'
// import Header from './Header'
import TabsPanel from '../popup/TabsPanel'

import storage from '../common/storage'

const Settings = () => {
  useEffect(() => {
    async function initStorage() {
      await storage.init()
      console.log('storage initialized')
    }
    initStorage()
  }, [])

  return (
    <div className='SettingsContainer'>
        {/* <TabsPanel showAllRules={true} ></TabsPanel> */}

    </div>
  )
}
export default Settings
