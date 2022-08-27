/* eslint-disable @typescript-eslint/prefer-regexp-exec */
import { Visit } from 'types'

import storage from '../common/storage'
import keeper from './keeper'
import AwaitLock from 'await-lock'

class Tracker {
  lock = new AwaitLock()
  private async handleTabRemoved(tabId) {
    try {
      const openVisit = storage.getOpenVisit(tabId)
      if (openVisit) {
        await storage.closeOpenVisit(openVisit)
      }
    } catch (error) {
      console.error(error)
    }
  }
  run(): void {
    chrome.tabs.onRemoved.addListener(async tabId => {
      await this.handleTabRemoved(tabId)
    })

    chrome.tabs.onUpdated.addListener(
      async (tabId, { status, url, title, audible } = {}, tab) => {
        try {
          await this.lock.acquireAsync()
          const openVisit = storage.getOpenVisit(tabId)

          // if loading and url
          if (status === 'loading' && url && url.indexOf('http') === 0) {
            // if no openVisit create new
            if (!openVisit) {
              await storage.createVisitFromTab(tab)
              await keeper.controlTab(tab, false)
            } else {
              // if the url is the same do nothing
              if (this.isUrlTheSame(openVisit.url, url)) {
                console.log('TAB CHANGE same video ')
                return
              }

              // else url is different from openVisit close openVisit
              await storage.closeOpenVisit(openVisit)

              // create new
              await storage.createVisitFromTab(tab)
              await keeper.controlTab(tab, false)
            }
          }

          if (openVisit) {
            if (title) {
              openVisit.title = title
            }

            if (audible) {
              openVisit.audible = true
            }

            if (audible !== undefined) {
              openVisit.audibleState.push({
                time: new Date(),
                audible,
              })
            }

            if (status === 'complete') {
              openVisit.status = 'complete'

              chrome.tabs.sendMessage(
                tabId,
                {
                  hidden: 'hidden',
                },
                response => {
                  if (!window.chrome.runtime.lastError) {
                    if (response && openVisit.url === response.href) {
                      if (response.hidden !== undefined) {
                        openVisit.visibility.push({
                          time: new Date(),
                          hidden: response.hidden,
                          focus: response.focus,
                        })
                      }
                    }
                  }
                }
              )
            }
          }
        } catch (error) {
          console.error(error)
        } finally {
          this.lock.release()
        }
      }
    )
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      if (request.msg === 'checkVideo') {
        keeper.isYTVideoAllowed(request.snippet).then(allowVid => {
          sendResponse({
            allowVid,
          })
        })

        return true
      } else {
        if (request.message === 'getVisits') {
          sendResponse({
            visits: storage.visits,
          })
          return true
        }

        const openVisit = storage.getOpenVisit(sender.tab.id)

        // console.log("got event ", request, openVisit);
        if (openVisit && request.hidden !== undefined) {
          openVisit.visibility.push({
            time: new Date(),
            hidden: request.hidden,
          })
        }

        if (openVisit && request.focus !== undefined) {
          openVisit.visibility.push({
            time: new Date(),
            focus: request.focus,
          })
        }

        if (openVisit && request.message === 'keypress') {
          openVisit.keypress.push({
            time: new Date(),
          })
        }
        if (openVisit && request.message === 'click') {
          openVisit.click.push({
            time: new Date(),
          })
        }

        try {
          storage.updateVisit(openVisit).then()
        } catch (error) {
          console.error(error)
        }

        sendResponse({
          farewell: 'goodbye',
        })
      }

      return true
    })
  }
  isUrlTheSame(firstUrl: string, secondUrl: string): boolean {
    if (
      firstUrl.includes('youtube.com/watch?v=') &&
      secondUrl.includes('youtube.com/watch?v=')
    ) {
      return (
        firstUrl.match(/watch\?v=(.{11})/)[1] ===
        secondUrl.match(/watch\?v=(.{11})/)[1]
      )
    } else {
      return firstUrl === secondUrl
    }
  }
}
// some test coding
const tracker = new Tracker()
export default tracker
