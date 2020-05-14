/* https://medium.com/mehak-vohra/using-graphql-to-query-your-firebase-realtime-database-a6e6cbd6aa3a */
/* https://github.com/heroku-examples/graphql-rent-api/blob/master/server.js */
const http = require('http')
const express = require('express')
const { ApolloServer } = require('apollo-server-express')
const firebase = require('firebase')
require('dotenv').config()
const port = process.env.PORT || 8080
const MODE = process.env.MODE
const FIREBASE_API_KEY = (MODE === 'PROD') ? process.env.PROD_FIREBASE_API_KEY : process.env.DEV_FIREBASE_API_KEY
const FIREBASE_AUTH_DOMAIN = (MODE === 'PROD') ? process.env.PROD_FIREBASE_AUTH_DOMAIN : process.env.DEV_FIREBASE_AUTH_DOMAIN
const FIREBASE_DATABASE_URL = (MODE === 'PROD') ? process.env.PROD_FIREBASE_DATABASE_URL : process.env.DEV_FIREBASE_DATABASE_URL
const FIREBASE_PROJECT_ID = (MODE === 'PROD') ? process.env.PROD_FIREBASE_PROJECT_ID : process.env.DEV_FIREBASE_PROJECT_ID

const app = express()

const typeDefs = require('./typeDefs')
const resolvers = require('./resolvers')
const firebaseClient = firebase.initializeApp({
    apiKey: FIREBASE_API_KEY,
    authDomain: FIREBASE_AUTH_DOMAIN,
    databaseURL: FIREBASE_DATABASE_URL,
    projectId: FIREBASE_PROJECT_ID
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