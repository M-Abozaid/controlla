import keeper from './keeper'
import tracker from './tracker'
import storage from '../common/storage'

const TICK_LENGTH = 1000

function run() {
  try {
    void tracker.run()
    void storage.init()
    setInterval(keeper.run, TICK_LENGTH)
  } catch (error) {
    console.error('Error in background.ts', error)
  }
}

run()

chrome.webRequest.onBeforeSendHeaders.addListener(
  function(details) {
    // console.log('onBeforeSendHeaders', details)
    // eslint-disable-next-line @typescript-eslint/prefer-for-of
    for (let i = 0; i < details.requestHeaders.length; ++i) {
      if (details.requestHeaders[i].name === 'Authentication') {
        console.log('Authentication Header:', details.requestHeaders[i].value)
        break
      }
    }
  },
  {
    urls: ['<all_urls>'],
  },
  ['requestHeaders']
)
