import React, { useState, useEffect } from 'react'
import './styles.scss'
import { Tabs, Tab } from 'react-bootstrap'
import Rule from '../Rule'
import { rules } from '../../common/data'
import AddRule from '../AddRule'

import storage from '../../common/storage'
import { getActiveTab } from '../Services'

const TabsPanel = () => {
  useEffect(() => {
    async function getRules() {
      const activeTab = await getActiveTab()
      const rules = await storage.getMatchingRules(activeTab.url)
      console.log('active tab and rules from tabsPanel', activeTab, rules)
      setMatchedRules(rules)
    }

    getRules()
  }, [])

  const [tabKey, setTabKey] = useState('rules')

  const [matchedRules, setMatchedRules] = useState([])

  return (
    <Tabs
      className='tabs-panel__main'
      id='contolled-tabs'
      activeKey={tabKey}
      onSelect={(k: React.SetStateAction<string>) => setTabKey(k)}
    >
      <Tab eventKey='rules' title='Rules &#9997;'>
        <div>
          {rules.map((quotaRule, idx) => (
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

export default TabsPanel
