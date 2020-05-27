/* https://gist.github.com/Pitasi/574cb19348141d7bf8de83a0555fd2dc */

const { createHash, createHmac } = require('crypto')
const axios = require('axios')
const FormData = require('form-data')
const songProfile = require('./songProfile')
const { API_BOT, API_TEL, BOT_TOKEN, FIREBASE_DATABASE_URL } = require('./config')

const secret = createHash('sha256').update(BOT_TOKEN).digest()

const handleResponseFromTelegram = async (responseTelegram, chat_id) => {
  const data = responseTelegram.data.result
  const audio = data.audio || data.voice
  const track_id = audio.file_unique_id + '_' + data.date
  const uploadResponse = await insertTrackIntoDB(audio, chat_id, track_id, data)
  return uploadResponse
  
}
const insertTrackIntoDB = async (audio, chat_id, track_id, data) => {
  let uploadResponse = { ok: false, result: null, error: null, description: null }
  const url = `${FIREBASE_DATABASE_URL}/songs/${chat_id}/tracks/${track_id}.json`
  const body = { id: audio.file_id, message: data }
  await fetch(url, {
    method: 'PUT',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(res => res.json())
    .catch((error) => {        
      uploadResponse = { ok: false, result: null, error: 404, description: error }
    })
    .then((response) => {        
      uploadResponse = { ok: true, result: response, error: null, description: null }
    })  
  return uploadResponse
}

module.exports = {
  checkSignature: ({ hash, ...data }) => {
    const checkString = Object.keys(data)
      .sort()
      .map(k => (`${k}=${data[k]}`))
      .join('\n')
    const hmac = createHmac('sha256', secret)
      .update(checkString)
      .digest('hex')
    return hmac === hash
  },
  async getSongsWithCovers(data) {

    const dataJson = await data.json()

    return new Promise((resolve) => {
      const keys = Object.keys(dataJson)
      const mapsKeys = keys.map(async (item) => {
        const songsData = dataJson[item]
        let photo_url = null
        if (songsData.photo) {
          const photoInfo = await fetch(`${API_BOT + BOT_TOKEN}/getFile?file_id=${songsData.photo}`)
          const photoJson = await photoInfo.json()
          if (photoJson.ok) {
            photo_url = `${API_TEL}file/bot${BOT_TOKEN}/${photoJson.result.file_path}`
          }
        }
        const graphqlSongs = songProfile(songsData, photo_url, null)
        return graphqlSongs
      })
      resolve(mapsKeys)
    })
  },
  async fileUpload(req) {
    
    let uploadResponse = { ok: false, result: null, error: 400, description: 'Bad Request' }   

    if(req?.body?.chat_id && req?.file?.buffer) {
      
      let form = new FormData()
      form.append('chat_id', req.body.chat_id)
      form.append('audio', req.file.buffer, req.file.originalname)
      
      await axios.post(API_BOT + BOT_TOKEN + '/sendAudio', form, {
        headers: {
          'Content-Type': `multipart/form-data; boundary=${form._boundary}`
        }
      }).then(async (responseTelegram) => {
        uploadResponse = await handleResponseFromTelegram(responseTelegram, req.body.chat_id)      
      }).catch((err) => {  
        const error = err && err.response && err.response.data    
        uploadResponse = error
      })
    }       
    return uploadResponse
  } 
}