import { Keeper } from './keeper';
import Tracker from "./tracker";
import storage from '../common/storage';



(async()=>{
    const tracker = new Tracker()
    tracker.run()

    const keeper = new Keeper()
    
    await storage.init()
    setInterval(keeper.run, 6000)
})()


