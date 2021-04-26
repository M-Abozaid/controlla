
import keeper from './keeper';
import tracker from './tracker';
import storage from '../common/storage';

const TICK_LENGTH = 1000;

function run() {

    try {

        void tracker.run();
        void storage.init();
        setInterval(keeper.run, TICK_LENGTH);
    } catch (error) {
        console.error('Error in background.ts' , error)
    }
}

run();
