import settings from './settings'

const saveVisit = async visit => {
  // console.log('save visit ', visit)
  delete visit._id
  try {
    const rawResponse = await fetch(`${settings.apiUrl}/data`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      // json object to sent to the authentication url
      body: JSON.stringify(visit),
    })
  } catch (error) {
    console.error('Error sending request', error)
  }
}

export default saveVisit
