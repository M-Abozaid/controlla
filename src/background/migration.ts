// // @ts-nocheck
// import storage from '../common/storage';


// const migrateRules = async () => {
//   const allRules = await storage.getRules()


//   /* tslint:disable-next-line */
//   return Promise.all(allRules.filter(rule=> !Array.isArray(rule.ruleObj.matcher)).map(rule => rule.update({matcher:null, matchers:[rule.ruleObj.matcher]})))

// }

// export const migrate = async() => {
//   await storage.init('background')

//   console.log('Migrate rules ...')
//   await migrateRules()
//   console.log('rules migrated')
// }