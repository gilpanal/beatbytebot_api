const baseURL = process.env.FIREBASE_DATABASE_URL
const songProfile = require('./songProfile')
const trackProfile = require('./trackProfile')

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
    tracks: async (root, { songId }) => {
      const data = await fetch(`${baseURL}/songs/${songId}/tracks.json`)
      const dataJson = await data.json()
      const keys = Object.keys(dataJson)
      const mapsKeys = keys.map(async (item) => {
        const tracksData = dataJson[item]
        const audio = tracksData.message.audio || tracksData.message.voice
        const fileInfo = await fetch(`https://api.telegram.org/bot${process.env.BOT_TOKEN}/getFile?file_id=${audio.file_id}`)
        const fileInfoJson = await fileInfo.json()
        const graphqlTracks = trackProfile(tracksData, `https://api.telegram.org/file/bot${process.env.BOT_TOKEN}/${fileInfoJson.result.file_path}`)
        return graphqlTracks
      })
      return mapsKeys
    },
    deleteMessage: async (root, { chat_id, message_id }) => {
      const data = await fetch(`https://api.telegram.org/bot${process.env.BOT_TOKEN}/deleteMessage?chat_id=${chat_id}&message_id=${message_id}`)
      const dataJson = await data.json()
      return dataJson
    },
    getFileLink: async (root, { file_id }) => {
      const data = await fetch(`https://api.telegram.org/bot${process.env.BOT_TOKEN}/getFile?file_id=${file_id}`);
      const dataJson = await data.json()
      return dataJson
    }
  }
}

module.exports = resolvers