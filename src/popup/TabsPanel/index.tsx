import React, { useState } from 'react'
import { Tabs, Tab } from 'react-bootstrap'
import Rule from '../Rule'
import { rules } from '../../common/data'

const TabsPanel = () => {
  const [key, setKey] = useState('rules')

  return (
    <Tabs
      id='contolled-tabs'
      activeKey={key}
      onSelect={(k: React.SetStateAction<string>) => setKey(k)}
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
      </Tab>

      <Tab eventKey='stats' title='Stats &#9783;'>
        <div>Stats</div>
      </Tab>
    </Tabs>
  )
}

export default TabsPanel
