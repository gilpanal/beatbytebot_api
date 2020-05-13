/* https://medium.com/mehak-vohra/using-graphql-to-query-your-firebase-realtime-database-a6e6cbd6aa3a */
/* https://github.com/heroku-examples/graphql-rent-api/blob/master/server.js */
const http = require('http')
const express = require('express')
const { ApolloServer } = require('apollo-server-express')
const firebase = require('firebase')
require('dotenv').config()
const port = process.env.PORT || 8080

const app = express()

const typeDefs = require('./typeDefs')
const resolvers = require('./resolvers')
const firebaseClient = firebase.initializeApp({
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.FIREBASE_DATABASE_URL,
    projectId: process.env.FIREBASE_PROJECT_ID
})
const server = http.createServer(app)
const graphqlServer = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    return {
        headers: req.headers,
        firebaseClient
    }
  },
  playground: true,
  introspection: true
})

app.get('/', (req, res) => {
  res.redirect('/graphql')
})

graphqlServer.applyMiddleware({
  app
})

server.listen(port, () => {
  console.log(`GraphQL Server running on port ${port}`)
})