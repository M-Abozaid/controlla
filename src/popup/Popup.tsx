import React, { useEffect, useState } from 'react'

import './Popup.scss'
import Header from './Header'
import TabsPanel from './TabsPanel'
import AddRule from './AddRule'

import storage from '../common/storage'

const Popup = () => {
  const [showAddRuleModal, toggleAddRuleModal] = useState(false)

  useEffect(() => {
    async function initStorage() {
      await storage.init()
      console.log('storage initialized')
    }
    initStorage()
  }, [])

  return (
    <div className='popupContainer'>
      {showAddRuleModal && (
        <AddRule
          onRuleAdded={() => null}
          onHide={() => toggleAddRuleModal(false)}
        />
      )}
      <Header onAdd={() => toggleAddRuleModal(true)} />
      <div className='tabs-panel'>
        <TabsPanel />
      </div>
    </div>
  )
}
export default Popup
