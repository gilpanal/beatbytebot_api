/* https://medium.com/mehak-vohra/using-graphql-to-query-your-firebase-realtime-database-a6e6cbd6aa3a */
/* https://github.com/heroku-examples/graphql-rent-api/blob/master/server.js */
/* https://stackoverflow.com/a/53002980 */

const http = require('http')
const express = require('express')
const path = require('path')
const multer = require('multer')()
const { ApolloServer } = require('apollo-server-express')
const firebase = require('firebase')
const { FIREBASE_API_KEY, FIREBASE_AUTH_DOMAIN, FIREBASE_DATABASE_URL, FIREBASE_PROJECT_ID } = require('./config')

const port = process.env.PORT || 8080

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

const { checkSignature, fileUpload } = require('./helpers')

app.use( (req, res, next)  => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  next()
})

app.use(express.static('test'))

app.get('/testFileUploadForm', (req, res) => {
  res.sendFile(path.join(__dirname + '../../test/testForm.html'))
})

app.get('/', (req, res) => {
  res.redirect('/graphql')
})

app.post('/fileUpload', multer.single('audio'), async (req, res) => {

  let uploadResponse = { ok: false, result: null, error: 401, description: 'Unauthorized' }
  const user_info = req.body && req.body.user_info
  let userJson = null
  try {
    userJson = JSON.parse(user_info)   
  } catch (error){
    uploadResponse.error = 400
    uploadResponse.description = 'Bad Request'    
  } finally {
    if (userJson) { 
      const userValid = await checkSignature(userJson)
      if (userValid) {    
        uploadResponse = await fileUpload(req)  
      }
    }
    res.json(uploadResponse)
  }
      
})

graphqlServer.applyMiddleware({
  app
})

server.listen(port, () => {
  console.log(`GraphQL Server running on port ${port}`)
})