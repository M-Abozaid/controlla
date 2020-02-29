
import chromep from 'chrome-promise';

export async function getActiveTab():Promise<chrome.tabs.Tab>{
    
    const activeTab = await chromep.tabs.query({currentWindow: true, active: true})
    return activeTab[0]

}