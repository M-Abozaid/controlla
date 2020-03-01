import getYTVideos from 'common/getYTVideos';
import { Keeper } from './keeper';
import { Visit } from './../popup/types/index';
import chromep from 'chrome-promise';

class Tracker {
    storage = new Storage()
    keeper = new Keeper()
    constructor() {
    }


    run() {

        chrome.tabs.onRemoved.addListener(tabId => {
            this.storage.closeOpenVisit(tabId)
        });

        chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
            // const openVisit = visits.find(v => {
            //   return v.tabId === tabId && v.leftTime === undefined;
            // });
            const openVisit = this.storage.getOpenVisit(tabId)
            // console.log('status ', changeInfo, openVisit);
            // a new visit // refreshes are not taken into account
            if (changeInfo.status === 'loading' && changeInfo.url && changeInfo.url.indexOf('http') === 0) {
                const newVisit: Visit = {
                    visitTime: new Date(),
                    tabId,
                    url: tab.url,
                    title: tab.title,
                    audible: false,
                    visibility: [],
                    click: [],
                    keypress: [],
                    audibleState: [],

                };
                if (tab.url.includes('youtube.com/watch?v=')) {
                    const vidId = tab.url.match(/watch\?v=(.{11})/)[1];
                    const ytDetails = await getYTVideos(vidId);
                    [newVisit.ytDetails] = ytDetails.items;
                    newVisit.ytVideoId = vidId;
                }
                // add new visit
                //   visits.push(newVisit);
                await this.storage.createVisit()
                // incrementAndCheck(true);

                if (openVisit) {

                    this.storage.closeOpenVisit(tabId)
                } else {
                    console.log('how could that even happen unless in the beginning ');
                }
            } else if (openVisit) {

                if (changeInfo.title) {
                    openVisit.title = changeInfo.title;
                }

                if (changeInfo.audible) {
                    openVisit.audible = true;
                }

                if (Object.prototype.hasOwnProperty.call(changeInfo, 'audible')) {
                    openVisit.audibleState.push({
                        time: new Date(),
                        audible: changeInfo.audible,
                    });
                }

                if (changeInfo.status === 'complete') {
                    openVisit.audible = tab.audible;
                    chrome.tabs.sendMessage(
                        tabId,
                        {
                            hidden: 'hidden',
                        },
                        response => {
                            // console.log('response >>', response)

                            if (response && openVisit.url === response.href) {
                                if (response.hidden !== undefined) {
                                    openVisit.visibility.push({
                                        time: new Date(),
                                        hidden: response.hidden,
                                        focus: response.focus,
                                    });
                                }
                            }
                        },
                    );
                }

            }
        });
        chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
            // const openVisit = visits.find(v => {
            //     return v.tabId === sender.tab.id && v.leftTime === undefined;
            // });
            const openVisit = this.storage.getOpenVisit(sender.tab.id)

            // console.log('open visit in received message ' ,  openVisit)
            if (openVisit && request.hidden !== undefined) {
                openVisit.visibility.push({
                    time: new Date(),
                    hidden: request.hidden,
                });
            }

            if (openVisit && request.focus !== undefined) {
                openVisit.visibility.push({
                    time: new Date(),
                    focus: request.focus,
                });
            }

            if (openVisit && request.message === 'keypress') {
                openVisit.keypress.push({
                    time: new Date(),
                });
            }
            if (openVisit && request.message === 'click') {
                openVisit.click.push({
                    time: new Date(),
                });
            }

            if (request.msg === 'checkVideo') {
                this.keeper.isYTVideoAllowed(request.snippet).then(allowVid => {
                    console.log('vidoe allowed >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> ', allowVid);
                    sendResponse({
                        allowVid,
                    });
                });

                return true;
            }
            sendResponse({
                farewell: 'goodbye',
            });

            return false;
        });
    }

}
export default Tracker