
const { gql } = require('apollo-server')
const typeDefs = gql`
  type MessageInfo {
    id: String!
    date: String!   
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
  type PhotoInfo {
    big_file_id: String!
    big_file_unique_id: String!
    small_file_id: String!
    small_file_unique_id: String!
  }
  type SongInfo {
    id: String!
    title: String!
    photo: PhotoInfo
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
    songInfoById(songId: Float!): SongInfo,
    tracks(songId: Float!): [TrackInfo], 
    deleteMessage(chat_id: Float!, message_id: Int!): TelBasicApiResponse,  
    getFileLink(file_id: String!): TelFileApiResponse
  }`
module.exports = typeDefs