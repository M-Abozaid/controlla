enum MatcherType {
    'YT_CATEGORY',
    'URL',
    'YT_CHANNEL',
    'YT_TITLE',
}
interface Rule {
    id?: string,
    matcher:{
        type: MatcherType,
        value: string | RegExp
    },
    startTime: string,
    endTime: string,
    daysOfWeek: number[]
}


const myRule: Rule = {
    matcher:{
        type: MatcherType.URL,
        value: 'something'
    },
    startTime:'something',
    endTime:'sdsd',
    daysOfWeek: [2]
}

interface Visit {
    
}

class Keeper{
    constructor(private storage, ){

        // this.getSettings
    }





}