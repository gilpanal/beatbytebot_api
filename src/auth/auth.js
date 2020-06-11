/* https://firebase.google.com/docs/database/rest/auth?authuser=0 */

const { ACCOUNT_FILEPATH } = require('../config')
const { google } = require('googleapis')

let ERROR = null
let TOKEN = null

// Load the service account key JSON file.
const serviceAccount = require(ACCOUNT_FILEPATH)

const scopes = [
    "https://www.googleapis.com/auth/userinfo.email",
    "https://www.googleapis.com/auth/firebase.database"
]

const jwtClient = new google.auth.JWT(
    serviceAccount.client_email,
    null,
    serviceAccount.private_key,
    scopes
)

jwtClient.authorize((error, tokens) => {
    if (error) {
        ERROR = error        
    } else if (tokens.access_token === null) {
        ERROR = 'Provided service account does not have permission to generate access tokens'        
    } else {       
        TOKEN = tokens.access_token
    }
})

const authGoogleApi = () => {
    return {
        token: TOKEN,
        error: ERROR,       
    }
}

module.exports = authGoogleApi


