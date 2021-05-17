import { Visit } from 'types';
import getYTVideos from '../common/getYTVideos';
import saveVisit from '../common/saveVisit';
import storage from '../common/storage';
import keeper from './keeper';
import { v4 as uuidv4 } from 'uuid';

class Tracker {

    private async handleTabRemoved(tabId) {
        console.log('%ctracker.ts line:10 object', 'color: #007acc;');
        try {
            const openVisit = storage.getOpenVisit(tabId);
            console.log('%ctracker.ts line:13 object', 'color: #007acc;', );
            if (openVisit) {
                await storage.closeOpenVisit(openVisit);
                openVisit.leftTime = new Date();
                console.log('%ctracker.ts line:17 object', 'color: #007acc;',);
                await saveVisit(openVisit);
                console.log('%ctracker.ts line:19 object', 'color: #007acc;');
            }
        } catch (error) {
            console.error(error);
        }
    }
    run(): void {

        chrome.tabs.onRemoved.addListener(async (tabId)=>{
            await this.handleTabRemoved(tabId);
        });

        chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
            // const openVisit = visits.find(v => {
            //   return v.tabId === tabId && v.leftTime === undefined;
            // });
            // console.log("CHANGE ", changeInfo.status)
            console.log('%ctracker.ts line:36 changeInfo', 'color: #007acc;', changeInfo.status, changeInfo.url ,changeInfo);
            // a new visit // refreshes are not taken into account
            const openVisit = storage.getOpenVisit(tabId);
            if (openVisit) {
                console.log('openvisit ', openVisit.url, openVisit.status)
                if (tab.url.includes('youtube.com/watch?v=')) {
                    // eslint-disable-next-line @typescript-eslint/prefer-regexp-exec
                    const vidId = tab.url.match(/watch\?v=(.{11})/)[1];

                    if (openVisit.url.includes('youtube.com/watch?v=')) {
                        const openVisitVideoID = openVisit.url.match(/watch\?v=(.{11})/)[1];
                        if (vidId === openVisitVideoID && changeInfo.status === 'loading' && changeInfo.url && changeInfo.url.indexOf('http') === 0) {
                            console.log('same video ')
                            return
                        }
                    }
                }
            }


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
                    _id: uuidv4(),
                    status: 'loading'
                };

                if (!openVisit) {
                    console.log('Create new visit')
                    storage.createVisit(newVisit);
                    if (tab.url.includes('youtube.com/watch?v=')) {
                        // eslint-disable-next-line @typescript-eslint/prefer-regexp-exec
                        const vidId = tab.url.match(/watch\?v=(.{11})/)[1];
                        const ytDetails = await getYTVideos([vidId]);
                        [newVisit.ytDetails] = ytDetails.items;
                        newVisit.ytVideoId = vidId;
                    }
                    await keeper.controlTab(tab, false)
                } else {

                    console.log('status loading openvisit status', openVisit.status)
                    // if openvisit and openvisit is loading do nothing;
                    if (openVisit && openVisit.status === 'loading') {
                        console.log('Do nothing')
                        return
                    }

                    // if no openvist create with status loading
                    if (openVisit && openVisit.status === 'complete') {
                        console.log('close previous ', openVisit)
                        await storage.closeOpenVisit(openVisit);
                        openVisit.leftTime = new Date();
                        saveVisit(openVisit);
                        console.log('Cretea nwe ', newVisit)
                        storage.createVisit(newVisit);
                        if (tab.url.includes('youtube.com/watch?v=')) {
                            // eslint-disable-next-line @typescript-eslint/prefer-regexp-exec
                            const vidId = tab.url.match(/watch\?v=(.{11})/)[1];
                            const ytDetails = await getYTVideos([vidId]);
                            [newVisit.ytDetails] = ytDetails.items;
                            newVisit.ytVideoId = vidId;
                        }
                        await keeper.controlTab(tab, false)
                    }
                }





            } else if (changeInfo.title || 'audible' in changeInfo || changeInfo.status === 'complete') {

                console.log('change info 2')
                if (openVisit) {

                    if (changeInfo.title) {
                        openVisit.title = changeInfo.title;
                    }

                    if (changeInfo.audible) {
                        openVisit.audible = true;
                    }

                    if ('audible' in changeInfo ) {
                        console.log('audible state changed ', openVisit)
                        openVisit.audibleState.push({
                            time: new Date(),
                            audible: changeInfo.audible,
                        });
                    }

                    if (changeInfo.status === 'complete') {
                        console.log('complete visit', openVisit.url , openVisit.status)
                        openVisit.status = 'complete'

                        try {
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
                                                });
                                            }
                                        }
                                    }
                                },
                            );
                        } catch (error) {
                            console.error(error);
                        }
                    }
                }

            }
        });
        chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
            // const openVisit = visits.find(v => {
            //     return v.tabId === sender.tab.id && v.leftTime === undefined;
            // });


            if (request.msg === 'checkVideo') {
                keeper.isYTVideoAllowed(request.snippet).then(allowVid => {
                    sendResponse({
                        allowVid,
                    });
                });

                return true;
            } else {

                if (request.message === 'getVisits') {
                    sendResponse({
                        visits: storage.visits,
                    });
                    return true;
                }

                const openVisit = storage.getOpenVisit(sender.tab.id)


                    // console.log("got event ", request, openVisit);
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

                    try {

                        storage.updateVisit(openVisit).then(r => {
                            console.log('Visit updated ')
                        })
                    } catch (error) {
                        console.error(error);
                    }


                    sendResponse({
                        farewell: 'goodbye',
                    });

            }


            return true;
        });
    }

}

const tracker = new Tracker();
export default tracker;
