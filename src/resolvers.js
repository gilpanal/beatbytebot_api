const songProfile = require('./songProfile')
const trackProfile = require('./trackProfile')
const MODE = process.env.MODE
const baseURL = (MODE === 'PROD') ? process.env.PROD_FIREBASE_DATABASE_URL : process.env.DEV_FIREBASE_DATABASE_URL
const BOT_TOKEN = (MODE === 'PROD') ? process.env.PROD_BOT_TOKEN : process.env.DEV_BOT_TOKEN
const API_TEL = 'https://api.telegram.org/'
const API_BOT = API_TEL + 'bot'

const resolvers = {
  Query: {
    songs: async () => {
      const data = await fetch(`${baseURL}/songs.json`)
      const dataJson = await data.json()
      const keys = Object.keys(dataJson)
      const mapsKeys = keys.map(async (item) => {
        const songsData = dataJson[item]        
        let photo_url = null           
        if(songsData.photo){          
          const photoInfo = await fetch(`${API_BOT + BOT_TOKEN}/getFile?file_id=${songsData.photo}`)          
          const photoJson = await photoInfo.json()    
          photo_url =`${API_TEL}file/bot${BOT_TOKEN}/${photoJson.result.file_path}`           
        }               
        const graphqlSongs = songProfile(songsData, photo_url, null)        
        return graphqlSongs
      })
      return mapsKeys
    },
    songInfoById: async (root, { songId }) => {
      const data = await fetch(`${baseURL}/songs/${songId}.json`)
      const dataJson = await data.json()
      let doc_url = null 
      if(dataJson.document){          
        const docInfo = await fetch(`${API_BOT + BOT_TOKEN}/getFile?file_id=${dataJson.document.file_id}`)          
        const docJson = await docInfo.json()    
        doc_url =`${API_TEL}file/bot${BOT_TOKEN}/${docJson.result.file_path}`           
      }
      const graphqlSong = songProfile(dataJson, null, doc_url)      
      return graphqlSong
    },
    tracks: async (root, { songId }) => {
      const data = await fetch(`${baseURL}/songs/${songId}/tracks.json`)
      const dataJson = await data.json()
      if(!dataJson) return null
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
    deleteMessage: async (root, { chat_id, message_id }) => {
      const data = await fetch(`${API_BOT + BOT_TOKEN}/deleteMessage?chat_id=${chat_id}&message_id=${message_id}`)
      const dataJson = await data.json()
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