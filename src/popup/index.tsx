import * as React from 'react'
import * as ReactDOM from 'react-dom'
import Popup from './Popup'
import { getActiveTab } from './Services'
import storage from '../common/storage'
import { MatcherType } from '../types'
(async ()=>{

  console.log('init>>>>>>>')
  await storage.init()
  const activeTab = await getActiveTab()
  const rules = await storage.getMatchingRules(activeTab)

  
  const newRule = await storage.createRule({
    matcher: {
        type: MatcherType.URL,
        value: /^https:\/\/facebook\.com/,
      },
      daysOfWeek: [0, 1],
      startTime: '00:00',
      endTime: '23:59',
      activeQuota: 30,
      visibilityQuota: 10,
  })
  console.log('new rule ', newRule.isEffectiveNow())
 
  
  


  // updating rule 
   const result = await newRule.update({
    startTime: '10:00',
    endTime: '11:59',
    activeQuota: 30,
   })

   console.log('ruls upatedd ', result)

  console.log('got rules>>>>>>>>>>>>>> ', rules)

})()
chrome.tabs.query({ active: true, currentWindow: true }, tab => {
  ReactDOM.render(<Popup />, document.getElementById('popup'))
})

