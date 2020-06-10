const songProfile = require('./songProfile')
const trackProfile = require('./trackProfile')
const { checkSignature, getSongsWithCovers } = require('./helpers')
const { API_BOT, BOT_TOKEN, FIREBASE_DATABASE_URL } = require('./config')

const resolvers = {
  Query: {
    songs: async () => {
      const data = await fetch(`${FIREBASE_DATABASE_URL}/songs.json`)
      const dataJson = await getSongsWithCovers(data)
      return dataJson      
    },
    collection: async (root, { collectionName }) => {
      const data = await fetch(`${FIREBASE_DATABASE_URL}/songs.json?orderBy="collection"&equalTo="${collectionName}"`)
      const dataJson = await getSongsWithCovers(data)
      return dataJson 
    },
    songInfoById: async (root, { songId, userInfo }) => {
      const data = await fetch(`${FIREBASE_DATABASE_URL}/songs/${songId}.json`)
      const dataJson = await data.json()
      let doc_url = null
      let user_permission = false
      if (dataJson) {
        if(dataJson.document){
          const docInfo = await fetch(`${API_BOT + BOT_TOKEN}/getFile?file_id=${dataJson.document.file_id}`)
          const docJson = await docInfo.json()
          if(docJson.ok){
            // TODO: doc_url = null || docJson.result.file_path
            doc_url = null
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
      const data = await fetch(`${FIREBASE_DATABASE_URL}/songs/${songId}/tracks.json`)
      const dataJson = await data.json()
      if (!dataJson) return null
      const keys = Object.keys(dataJson)
      const mapsKeys = keys.map(async (item) => {
        const tracksData = dataJson[item]
        const audio = tracksData.message.audio || tracksData.message.voice
        const fileInfo = await fetch(`${API_BOT + BOT_TOKEN}/getFile?file_id=${audio.file_id}`)
        const fileInfoJson = await fileInfo.json()
        const graphqlTracks = trackProfile(tracksData, fileInfoJson.result.file_path)
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
            const data = await fetch(`${API_BOT + BOT_TOKEN}/editMessageCaption?chat_id=${chat_id}&message_id=${message_id}&caption=delete`)            
            dataJson = await data.json()                     
            // will delete from DB independently of message still exists in Telegram
            const rmDB = await fetch(`${FIREBASE_DATABASE_URL}/songs/${chat_id}/tracks/${track_id}.json`, { method: 'delete' })  
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