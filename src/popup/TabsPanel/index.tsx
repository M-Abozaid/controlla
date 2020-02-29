import React, { useState } from 'react'
import { Tabs, Tab } from 'react-bootstrap'
import Rule from '../Rule'

import { selectQuotaRules } from '../utils'
import data from '../data'

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
          {selectQuotaRules(data[0]).map(quotaRule => (
            <Rule
              quotaTime={quotaRule.quotaTime}
              timeOfDay={quotaRule.timeOfDay}
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
