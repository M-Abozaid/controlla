import React, { useState } from 'react'
import { Tabs, Tab } from 'react-bootstrap'

const TabsPanel = () => {
  const [key, setKey] = useState('rules')

  return (
    <Tabs id='contolled-tabs' activeKey={key} onSelect={k => setKey(k)}>
      <Tab eventKey='rules' title='Rules &#9997;'>
        <div>array of rules</div>
      </Tab>
      <Tab eventKey='stats' title='Stats &#9783;'>
        <div>stats</div>
      </Tab>
    </Tabs>
  )
}

export default TabsPanel
