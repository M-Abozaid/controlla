

const saveVisit = async (visit) => {

    console.log('save visit ', visit)
    delete visit._id
    visit.leftTime = new Date();
    const rawResponse = await fetch('http://localhost:36168/data', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        // json object to sent to the authentication url
        body: JSON.stringify(visit),
    });

}


export default saveVisit