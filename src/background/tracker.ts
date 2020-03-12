import { Visit } from 'types';
import getYTVideos from '../common/getYTVideos';
import saveVisit from '../common/saveVisit';
import storage from '../common/storage';
import keeper from './keeper';

class Tracker {

    run() {

        chrome.tabs.onRemoved.addListener(async tabId => {
            const openVisit = await storage.getOpenVisit(tabId)
            await storage.closeOpenVisit(openVisit)
            openVisit.leftTime = new Date();
            saveVisit(openVisit);
        });

        chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
            // const openVisit = visits.find(v => {
            //   return v.tabId === tabId && v.leftTime === undefined;
            // });
            const openVisit = await storage.getOpenVisit(tabId)
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
                // visits.push(newVisit);
                // incrementAndCheck(true);

                // if (openVisit) {
                //   // close open visits
                //   // console.log('close open visits ', openVisit)

                //   openVisit.leftTime = new Date();
                //   save(openVisit);
                // } else {
                //   console.log('how could that even happen unless in the beginning ');
                // }


                // add new visit
                //   visits.push(newVisit);
                await storage.createVisit(newVisit)
                // console.log('run keeperrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr')
                // keeper.run()
                // incrementAndCheck(true);
                // keeper.isYTVideoAllowed(newVisit.ytDetails.snippet)
                if (openVisit) {

                    console.log('close open visit ', openVisit)
                    await storage.closeOpenVisit(openVisit)
                    openVisit.leftTime = new Date();
                    saveVisit(openVisit);
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

            storage.getOpenVisit(sender.tab.id).then(openVisit => {


                if (openVisit && (request.hidden !== undefined)) {
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
                    keeper.isYTVideoAllowed(request.snippet).then(allowVid => {
                        sendResponse({
                            allowVid,
                        });
                    });

                    return true;
                }
                sendResponse({
                    farewell: 'goodbye',
                });

            })


            return true;
        });
    }

}
export default Tracker