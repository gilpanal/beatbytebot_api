
const { gql } = require("apollo-server");
const typeDefs = gql`
  type TrackInfo {
    id: String
    link: String!   
  }
  type SongInfo {
    id: String!
    name: String!
    email: String!
    photo: String
    description: String
    tracks: [TrackInfo]
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
    tracks(songId: Float!): [TrackInfo], 
    deleteMessage(chat_id: Float!, message_id: Int!): TelBasicApiResponse,  
    getFileLink(file_id: String!): TelFileApiResponse
  }`;
module.exports = typeDefs;