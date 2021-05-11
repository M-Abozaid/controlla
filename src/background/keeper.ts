
import { QuotaUsage, Visit } from '../types/index';
import storage from '../common/storage';
import chromePromise  from 'chrome-promise';
import ruleMatcher from '../common/ruleMatcher';
import Rule from 'common/Rule';



const ytVideoURLRegex = /youtube.com\/watch\?v=/;
const TICK_LENGTH = 1000;
const VISIT_ACTIVE_THRESHOLD = 60*1000;
export class Keeper {

    private incrementQuota(rules: Rule[]) {
        return Promise.all(rules.map(rule => {

            return storage.incrementOrAddUsage(rule._id, TICK_LENGTH);
        }));
    }

    controlTab = async (tab: chrome.tabs.Tab, shouldIncrementQuota=true): Promise<void> => {

        const rules = await storage.getRules();

        const effectiveRules = rules.filter(r => r.isEffectiveNow());

        if (!effectiveRules.length) return;

        let matchingRules = [];

        const visit: Visit = storage.getOpenVisit(tab.id);

        if (!visit) {
            console.warn('No visit ', tab)
            return
        };

        if (!this.isVisitActive(visit)) return;

        // if this is a youtube tab
        if (ytVideoURLRegex.test(tab.url)) {

            // console.log('Visit ', visit)
            if (!visit || !visit.ytDetails) {
                return;
            }
            matchingRules = effectiveRules.filter(
                r => ruleMatcher.matchTab(r.ruleObj.matcher, tab, visit.ytDetails.snippet),
            );
        } else {
            matchingRules = effectiveRules.filter(
                r => ruleMatcher.matchURL(r.ruleObj.matcher, tab),
            );

        }

        if (!matchingRules.length) return;

        if(shouldIncrementQuota){
            // update Quota
            await this.incrementQuota(matchingRules);
        }


        const [tabExpired, visibilityExpired] = await this.quotaCheck(matchingRules);

        if (tabExpired) {
            this.hideTab(tab).then(() => {
                try {
                    console.log('Tab expired ', matchingRules)
                    this.removeTab(tab);
                } catch (error) {
                    console.error('Error Removing tab', error)
                }
            }).catch(error => {
                console.error(error)
            });

        } else if (visibilityExpired) {
            this.hideTab(tab);
        }

    };

    async quotaCheck(rules: Rule[]): Promise<boolean[]> {

        let tabRemoved = false;
        const result = [false, false];

        await Promise.all(rules.map(async rule => {
            if (tabRemoved) return;
            const usage = await storage.getQuotaUsage(rule._id);
            if (tabRemoved) return;
            if (this.compareActiveQuota(usage, rule)) {
                result[0] = true;
                tabRemoved = true;
            }
            if (this.compareVisibilityQuota(usage, rule)) {
                result[1] = true;
            }
        }));

        return result;

    }

    run = (): void => {
        try {

            chromePromise.tabs.query({ active: true }).then(async activeTabs=>{
                for (const tab of activeTabs) {
                    try {

                        await this.controlTab(tab);
                    } catch (error) {
                        console.error(error);
                    }
                }
            }).catch(err=>{
                // eslint-disable-next-line no-console
                console.error('error getting tabs ', err);
            });
        } catch (error) {
            console.error("Error running keeper", error);
        }
    };

    compareActiveQuota({ activeUsage }: QuotaUsage, { ruleObj: { activeQuota } }: Rule): boolean {

        return activeUsage >= activeQuota;

    }

    compareVisibilityQuota({ visibilityUsage }: QuotaUsage,
                           { ruleObj: { visibilityQuota } }: Rule): boolean {

        return visibilityUsage  >= visibilityQuota;

    }

    removeTab(tab: chrome.tabs.Tab){

        chrome.tabs.get(tab.id, (tabFound) => {
            if (chrome.runtime.lastError) {
                console.log(chrome.runtime.lastError.message);
            } else {
                console.log('%ckeeper.ts line:129 tab', 'color: #007acc;', tab);
                if (tabFound) {
                    console.log('%ckeeper.ts line:131 remove tab', 'color: #007acc;', tabFound);
                    chrome.tabs.remove(tab.id, (err) => {
                        if (err) console.error('Error removing tab', err);
                    });
                }
            }

        })



    }

    async hideTab(tab: chrome.tabs.Tab): Promise<any> {
        try {
            const [newTab] = await chromePromise.tabs.query({
                url: 'chrome://newtab/',
                windowId: tab.windowId,
            });
            if (newTab) {
                return await chromePromise.tabs.update(newTab.id, { active: true });
            }
            return await chromePromise.tabs.create({ windowId: tab.windowId });
        } catch (error) {
            console.error('Error hiding tab', error)
        }
    }

    async isYTVideoAllowed(video: gapi.client.youtube.VideoSnippet): Promise<boolean> {

        const YTRules = await storage.getRules();

        const matchingRules = YTRules.filter(rule =>
            (rule.isEffectiveNow() && ruleMatcher.matchVideoSnippet(rule.ruleObj.matcher, video)));

        const [disallowed] = await this.quotaCheck(matchingRules);

        return !disallowed;

    }

    isVisitActive(visit: Visit): boolean {
        const activeThresholdAgo = new Date(Date.now()- VISIT_ACTIVE_THRESHOLD)
        // check if audio is playing
        if (visit.audibleState?.length &&
            visit.audibleState[visit.audibleState.length - 1].audible) {
                return true
            }
        // check last visibility
        if (visit.visibility.length &&
            visit.visibility[visit.visibility.length - 1].focus &&
            visit.visibility[visit.visibility.length - 1].time > activeThresholdAgo) {
                return true
        }

        if (visit.click.length &&
             visit.click[visit.click.length - 1].time > activeThresholdAgo) {
                return true
        }

        if (visit.visitTime > activeThresholdAgo) {
            return true;
        }
        // check last click
        return false;
    }

}

const keeper = new Keeper();
(window as any).keeper = keeper;
export default keeper;
