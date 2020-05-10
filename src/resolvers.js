const baseURL = process.env.FIREBASE_DATABASE_URL;
const songProfile = require("./songProfile");

const resolvers = {
    Query: {
      songs: async () => {
        const data = await fetch(`${baseURL}/songs.json`);
        const dataJson = await data.json(); 
        const keys = Object.keys(dataJson);
        const mapsKeys = keys.map(function(item) {
          const songsData = dataJson[item];
          const graphqlSongs = songProfile(songsData);
          return graphqlSongs;
        });
        return mapsKeys;
      },
      tracks: async (root, {songId}) => {  
        const data = await fetch(`${baseURL}/songs/${songId}/tracks.json`);        
        const dataJson = await data.json();      
        return dataJson;
      },
      deleteMessage: async (root, {chat_id, message_id}) => {          
        const data = await fetch(`https://api.telegram.org/bot${process.env.BOT_TOKEN}/deleteMessage?chat_id=${chat_id}&message_id=${message_id}`);        
        const dataJson = await data.json();              
        return dataJson;
      },
      getFileLink: async (root, {file_id}) =>{
        console.log(file_id)
        const data = await fetch(`https://api.telegram.org/bot${process.env.BOT_TOKEN}/getFile?file_id=${file_id}`);        
        const dataJson = await data.json();   
        console.log(dataJson)
        return dataJson;
      }
    }
  };

  module.exports = resolvers;