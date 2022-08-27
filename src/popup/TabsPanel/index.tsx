import React, { useState, useEffect } from 'react'
import './styles.scss'
import { Tabs, Tab, Spinner, Button } from 'react-bootstrap'
import RuleComponent from '../Rule'

import storage from '../../common/storage'
import { getActiveTab } from '../Services'
import Rule from '../../common/Rule'

interface TabsPanelProps {
  showAllRules?: boolean
}
const TabsPanel = ({ showAllRules }: TabsPanelProps) => {
  async function getRules() {
    let rules: Rule[] = []
    if (showAllRules) {
      rules = await storage.getRules()
    } else {
      const [activeTab] = await getActiveTab()
      console.log('Active tab', activeTab, Date.now())
      rules = await storage.getMatchingRules(activeTab)
    }

    await Promise.all(rules.map(r => r.getUsage()))
    console.log('matched rules from tabs', rules)

    setMatchedRules(rules)
    setLoading(false)
  }

  useEffect(() => {
    getRules()
    storage.on('new_rule', getRules)
    storage.on('rule_removed', getRules)
    const intervalId = setInterval(getRules, 6000)
    return () => clearInterval(intervalId)
  }, [])

  const [loading, setLoading] = useState(true)

  const [tabKey, setTabKey] = useState('rules')

  const [matchedRules, setMatchedRules] = useState<Rule[]>([])

  if (loading) {
    return (
      <Spinner
        className='tabs-panel__spinner'
        animation='grow'
        variant='primary'
      />
    )
  }

  const downloadString = (text, fileType, fileName) => {
    const blob = new Blob([text], { type: fileType })

    const a = document.createElement('a')
    a.download = fileName
    a.href = URL.createObjectURL(blob)
    a.dataset.downloadurl = [fileType, a.download, a.href].join(':')
    a.style.display = 'none'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    setTimeout(function() {
      URL.revokeObjectURL(a.href)
    }, 1500)
  }

  const exportRules = async () => {
    const rules = await storage.getRules()

    downloadString(
      JSON.stringify(rules.map(r => r.ruleObj)),
      'application/json',
      'rules.json'
    )
  }

  const importRules = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    input.onchange = async e => {
      if (
        e.target &&
        (e.target as HTMLInputElement).files &&
        (e.target as any).files[0]
      ) {
        const file = (e.target as any).files[0]
        const text = await file.text()
        const rules = JSON.parse(text)
        console.log('rules', rules)
        await Promise.all(rules.map(rule => storage.createRule(rule)))
      }
    }
    input.click()
  }
  return (
    <Tabs
      className='tabs-panel__main'
      id='contolled-tabs'
      activeKey={tabKey}
      onSelect={(k: React.SetStateAction<string>) => setTabKey(k)}
    >
      <Tab eventKey='rules' title='Rules &#9997;'>
        <Button onClick={exportRules}>Export JSON</Button>

        <Button onClick={importRules}>Import JSON</Button>
        {!matchedRules.length && (
          <div className='tabs-panel__main'>
            <p>No Rules.. horray</p>
          </div>
        )}
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
