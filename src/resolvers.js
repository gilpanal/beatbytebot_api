const { createHash, createHmac } = require('crypto')
const songProfile = require('./songProfile')
const trackProfile = require('./trackProfile')
const MODE = process.env.MODE
const baseURL = (MODE === 'PROD') ? process.env.PROD_FIREBASE_DATABASE_URL : process.env.DEV_FIREBASE_DATABASE_URL
const BOT_TOKEN = (MODE === 'PROD') ? process.env.PROD_BOT_TOKEN : process.env.DEV_BOT_TOKEN
const API_TEL = 'https://api.telegram.org/'
const API_BOT = API_TEL + 'bot'

/* https://gist.github.com/Pitasi/574cb19348141d7bf8de83a0555fd2dc */
const secret = createHash('sha256').update(BOT_TOKEN).digest()

const checkSignature = ({ hash, ...data }) => {
  const checkString = Object.keys(data)
    .sort()
    .map(k => (`${k}=${data[k]}`))
    .join('\n')
  const hmac = createHmac('sha256', secret)
    .update(checkString)
    .digest('hex')
  return hmac === hash
}
const getSongs = async (data) => {
  const dataJson = await data.json()
  
  return new Promise((resolve) => {   
    const keys = Object.keys(dataJson)
    const mapsKeys = keys.map(async (item) => {
      const songsData = dataJson[item]
      let photo_url = null
      if (songsData.photo) {
        const photoInfo = await fetch(`${API_BOT + BOT_TOKEN}/getFile?file_id=${songsData.photo}`)
        const photoJson = await photoInfo.json()
        if(photoJson.ok){
          photo_url = `${API_TEL}file/bot${BOT_TOKEN}/${photoJson.result.file_path}`
        }
      }
      const graphqlSongs = songProfile(songsData, photo_url, null)
      return graphqlSongs
    })
    resolve(mapsKeys)

  })


}

const resolvers = {
  Query: {
    songs: async () => {
      const data = await fetch(`${baseURL}/songs.json`)
      const dataJson = await getSongs(data)
      return dataJson      
    },
    collection: async (root, { collectionName }) => {
      const data = await fetch(`${baseURL}/songs.json?orderBy="collection"&equalTo="${collectionName}"`)
      const dataJson = await getSongs(data)
      return dataJson 
    },
    songInfoById: async (root, { songId, userInfo }) => {
      const data = await fetch(`${baseURL}/songs/${songId}.json`)
      const dataJson = await data.json()
      let doc_url = null
      let user_permission = false
      if (dataJson) {
        if(dataJson.document){
          const docInfo = await fetch(`${API_BOT + BOT_TOKEN}/getFile?file_id=${dataJson.document.file_id}`)
          const docJson = await docInfo.json()
          if(docJson.ok){
            doc_url = `${API_TEL}file/bot${BOT_TOKEN}/${docJson.result.file_path}`
          }
        }       
        if(userInfo){                   
          const isValid = await checkSignature(userInfo)
          if(isValid){
            const getChatMember = await fetch(`${API_BOT + BOT_TOKEN}/getChatMember?chat_id=${songId}&user_id=${userInfo.id}`)
            const memberJson = await getChatMember.json()
            if(memberJson.ok){
              user_permission = memberJson.result.status === 'creator' || memberJson.result.status === 'administrator'
            }         
          }         
        }
        const graphqlSong = songProfile(dataJson, null, doc_url, user_permission)
        return graphqlSong
      } else {
        return null
      }      
    },
    tracks: async (root, { songId }) => {
      const data = await fetch(`${baseURL}/songs/${songId}/tracks.json`)
      const dataJson = await data.json()
      if (!dataJson) return null
      const keys = Object.keys(dataJson)
      const mapsKeys = keys.map(async (item) => {
        const tracksData = dataJson[item]
        const audio = tracksData.message.audio || tracksData.message.voice
        const fileInfo = await fetch(`${API_BOT + BOT_TOKEN}/getFile?file_id=${audio.file_id}`)
        const fileInfoJson = await fileInfo.json()
        const graphqlTracks = trackProfile(tracksData, `${API_TEL}file/bot${BOT_TOKEN}/${fileInfoJson.result.file_path}`)
        return graphqlTracks
      })
      return mapsKeys
    },
    deleteMessage: async (root, { chat_id, message_id, track_id, userInfo }) => {  
      let dataJson = {ok:false}
      const isValid = await checkSignature(userInfo)   
      if(isValid){
        const getChatMember = await fetch(`${API_BOT + BOT_TOKEN}/getChatMember?chat_id=${chat_id}&user_id=${userInfo.id}`)
        const memberJson = await getChatMember.json()        
        if(memberJson.ok){
          const user_permission = memberJson.result.status === 'creator' || memberJson.result.status === 'administrator'
          if(user_permission){
            // Only works for channels, not groups
            const data = await fetch(`${API_BOT + BOT_TOKEN}/editMessageCaption?chat_id=${chat_id}&message_id=${message_id}&caption=delete`)            
            dataJson = await data.json()                     
            // will delete from DB independently of message still exists in Telegram
            const rmDB = await fetch(`${baseURL}/songs/${chat_id}/tracks/${track_id}.json`, { method: 'delete' })  
            dataJson.ok = rmDB.ok                                
          }
        }         
      } else {
        dataJson.description = 'Telegram user not valid'
      }                
      return dataJson
    },
    getFileLink: async (root, { file_id }) => {
      const data = await fetch(`${API_BOT + BOT_TOKEN}/getFile?file_id=${file_id}`)
      const dataJson = await data.json()
      return dataJson
    }
  }
}

module.exports = resolvers