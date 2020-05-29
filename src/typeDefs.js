
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
    file_unique_id: String!
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
    user_permission: Boolean
  }
  type Result {
    message_id: String
    chat: Chat
    date: Int
    audio: AudioVoice
    voice: AudioVoice
  }
  type TelBasicApiResponse {
    ok: Boolean!
    result: Result
    error_code: Int
    description: String
  }
  type TelApiFileResult {
    file_path: String!
  }
  type TelFileApiResponse {
    ok: Boolean!
    result: TelApiFileResult
    error_code: Int
    description: String!
  }
  input UserInfo {
    auth_date: Int!
    first_name: String!
    hash: String!
    id: Int!
    photo_url: String
    username: String
  }
  type Query {
    songs: [SongInfo],
    collection(collectionName: String!): [SongInfo],
    songInfoById(songId: Float!, userInfo: UserInfo): SongInfo,
    tracks(songId: Float!): [TrackInfo], 
    deleteMessage(chat_id: Float!, message_id: Int!, track_id: String!, userInfo: UserInfo!): TelBasicApiResponse,  
    getFileLink(file_id: String!): TelFileApiResponse
  }`
module.exports = typeDefs