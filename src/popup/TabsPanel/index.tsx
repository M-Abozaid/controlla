import React, { useState, useEffect } from 'react'
import './styles.scss'
import { Tabs, Tab, Spinner } from 'react-bootstrap'
import RuleComponent from '../Rule'

import storage from '../../common/storage'
import { getActiveTab } from '../Services'

const TabsPanel = () => {
  async function getRules() {
    const activeTab = await getActiveTab()
    const rules = await storage.getMatchingRules(activeTab)

    await Promise.all(rules.map(r => r.getUsage()))
    console.log('matched rules from tabs', rules)

    setMatchedRules(rules)
    setTimeout(() => setLoading(false), 500)
  }

  useEffect(() => {
    getRules()
    storage.on('new_rule', getRules)
    const intervalId = setInterval(getRules, 6000)
    return () => clearInterval(intervalId)
  }, [])

  const [loading, setLoading] = useState(true)

  const [tabKey, setTabKey] = useState('rules')

  const [matchedRules, setMatchedRules] = useState([])

  if (loading) {
    return (
      <Spinner
        className='tabs-panel__spinner'
        animation='grow'
        variant='primary'
      />
    )
  }

  if (!matchedRules.length) {
    return (
      <div className='tabs-panel__main'>
        <p>No Rules.. horray</p>
      </div>
    )
  }

  return (
    <Tabs
      className='tabs-panel__main'
      id='contolled-tabs'
      activeKey={tabKey}
      onSelect={(k: React.SetStateAction<string>) => setTabKey(k)}
    >
      <Tab eventKey='rules' title='Rules &#9997;'>
        <div>
          {matchedRules.map((rule, idx) => (
            <RuleComponent key={idx} rule={rule} />
          ))}
        </div>
      </Tab>

      <Tab eventKey='stats' title='Stats &#9783;'>
        <div>Stats</div>
      </Tab>
    </Tabs>
  )
}

export default TabsPanel
