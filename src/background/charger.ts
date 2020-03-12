import storage from '../common/storage'
import chromep from 'chrome-promise';

class Charger{

    async run(){

        const rules = await storage.getRules()
        const activeTabs = await chromep.tabs.query({ active: true })
        await Promise.all(activeTabs.map(t=>{
            
        }))

    }
}