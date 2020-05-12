const baseURL = process.env.FIREBASE_DATABASE_URL
const songProfile = require('./songProfile')
const trackProfile = require('./trackProfile')
const API_TEL = 'https://api.telegram.org/'
const API_BOT = API_TEL + 'bot'

const resolvers = {
  Query: {
    songs: async () => {
      const data = await fetch(`${baseURL}/songs.json`)
      const dataJson = await data.json()
      const keys = Object.keys(dataJson)
      const mapsKeys = keys.map((item) => {
        const songsData = dataJson[item]
        const graphqlSongs = songProfile(songsData)
        return graphqlSongs
      })
      return mapsKeys
    },
    songInfoById: async (root, { songId }) => {
      const data = await fetch(`${baseURL}/songs/${songId}.json`)
      const dataJson = await data.json()
      const graphqlSong = songProfile(dataJson)      
      return graphqlSong
    },
    tracks: async (root, { songId }) => {
      const data = await fetch(`${baseURL}/songs/${songId}/tracks.json`)
      const dataJson = await data.json()
      const keys = Object.keys(dataJson)
      const mapsKeys = keys.map(async (item) => {
        const tracksData = dataJson[item]
        const audio = tracksData.message.audio || tracksData.message.voice
        const fileInfo = await fetch(`${API_BOT + process.env.BOT_TOKEN}/getFile?file_id=${audio.file_id}`)
        const fileInfoJson = await fileInfo.json()
        const graphqlTracks = trackProfile(tracksData, `${API_TEL}file/bot${process.env.BOT_TOKEN}/${fileInfoJson.result.file_path}`)
        return graphqlTracks
      })
      return mapsKeys
    },
    deleteMessage: async (root, { chat_id, message_id }) => {
      const data = await fetch(`${API_BOT+process.env.BOT_TOKEN}/deleteMessage?chat_id=${chat_id}&message_id=${message_id}`)
      const dataJson = await data.json()
      return dataJson
    },
    getFileLink: async (root, { file_id }) => {
      const data = await fetch(`${API_BOT+process.env.BOT_TOKEN}/getFile?file_id=${file_id}`)
      const dataJson = await data.json()
      return dataJson
    }
  }
}

module.exports = resolvers