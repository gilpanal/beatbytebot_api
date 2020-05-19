
const { gql } = require('apollo-server')
const typeDefs = gql`
  type Chat {
    id: Float!
    title: String!
    type: String!
  }
  type FromGroup {
    first_name: String!
    id: Int!
    username: String!
  }
  type AudioVoice {
    durantion: Int!  
    file_id: String!
    file_size: Int!
    mime_type: String!
    performer: String
    title: String
  }
  type MessageInfo {
    message_id: String!
    date: String! 
    chat: Chat!
    from: FromGroup
    audio: AudioVoice
    voice: AudioVoice  
  }
  type TrackInfo {
    id: String!
    file_path: String!
    message: MessageInfo!  
  }
  type DocumentInfo {
    file_id: String!
    file_name: String!
    mime_type: String!
  }
  type SongInfo {
    id: String!
    title: String!
    photo: String
    collection: String
    description: String 
    tracks: TrackInfo
    document: DocumentInfo
    photo_url: String
    doc_url: String
  }
  type TelBasicApiResponse {
    ok: Boolean!
    result: Boolean!
    error_code: Int!
    description: String!
  }
  type TelApiFileResult {
    file_path: String!
  }
  type TelFileApiResponse {
    ok: Boolean!
    result: TelApiFileResult!
    error_code: Int!
    description: String!
  }
  type Query {
    songs: [SongInfo],
    collection(collectionName: String!): [SongInfo],
    songInfoById(songId: Float!): SongInfo,
    tracks(songId: Float!): [TrackInfo], 
    deleteMessage(chat_id: Float!, message_id: Int!): TelBasicApiResponse,  
    getFileLink(file_id: String!): TelFileApiResponse
  }`
module.exports = typeDefs