import React, { useState, useEffect } from 'react'
import './styles.scss'
import { Tabs, Tab, Spinner } from 'react-bootstrap'
import Rule from '../Rule'
import AddRule from '../AddRule'

import storage from '../../common/storage'
import { getActiveTab } from '../Services'

const TabsPanel = () => {
  useEffect(() => {
    async function getRules() {
      const activeTab = await getActiveTab()
      const rules = await storage.getMatchingRules(activeTab)

      const getMatchedRules = rules.map(rule => rule.ruleObj)
      console.log('matched rules from tabs', getMatchedRules)

      setMatchedRules(getMatchedRules)
      setTimeout(() => setLoading(false), 500)
    }

    getRules()
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
  } else if (!matchedRules.length) {
    return (
      <div className='tabs-panel__main'>
        <p>No Rules.. horray</p>
        <AddRule />
      </div>
    )
  } else {
    return (
      <Tabs
        className='tabs-panel__main'
        id='contolled-tabs'
        activeKey={tabKey}
        onSelect={(k: React.SetStateAction<string>) => setTabKey(k)}
      >
        <Tab eventKey='rules' title='Rules &#9997;'>
          <div>
            {matchedRules.map((quotaRule, idx) => (
              <Rule
                key={idx}
                ruleTitle={quotaRule.matcher.value}
                activeQuota={quotaRule.activeQuota}
                visibilityQuota={quotaRule.visibilityQuota}
                startTime={quotaRule.startTime}
                endTime={quotaRule.endTime}
                daysOfWeek={quotaRule.daysOfWeek}
              />
            ))}
          </div>
          <AddRule />
        </Tab>

        <Tab eventKey='stats' title='Stats &#9783;'>
          <div>Stats</div>
        </Tab>
      </Tabs>
    )
  }
}

export default TabsPanel
