import * as React from 'react'
import * as ReactDOM from 'react-dom'
import AddRule from './addRule'

chrome.tabs.query({ active: true, currentWindow: true }, tab => {
  ReactDOM.render(
    <AddRule onRuleAdded={() => null} />,
    document.getElementById('AddRule')
  )
})
