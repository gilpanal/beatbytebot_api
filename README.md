# bunchofsongs_api
GrpahQL API for bunchofsongs project

## Summary:
This is the endpoint for the web application: https://github.com/gilpanal/bunchofsongs
It is also recommended to run the bot project to test the API properly, as the creation of new entries at the DB requires of a first input from a Telegram channel/group processed by the bot. You can also grab the file `testDB.json` at `test` folder https://raw.githubusercontent.com/gilpanal/bunchofsongs_api/master/test/testDB.json and directly import into Firebase DB to simulate the Bot input.

## Requirements:
- Node.js (v14)
- Firebase Project and Database: https://firebase.google.com/docs/admin/setup#set-up-project-and-service-account
- Telegram Bot Token: https://core.telegram.org/bots#6-botfather

## How to run it locally:
1. ```git clone https://github.com/gilpanal/bunchofsongs_api.git```
2. ```cd bunchofsongs_api```
3. ```npm i```
4. Rename the file `src/config_template.js` to `src/config.js` and fill it with the proper info. See Notes 1,2 below.
5. ```npm start```
6. Go to http://127.0.0.1:8080

#### NOTES:

1.- How to get the JSON key: https://firebase.google.com/docs/admin/setup#initialize-sdk

2.- For MODE='DEV' it's enough by changing the following values:

>      const DEV_FIREBASE_API_KEY = <private_key_id>
>      const DEV_FIREBASE_AUTH_DOMAIN = '127.0.0.1'
>      const DEV_FIREBASE_DATABASE_URL = 'https://<YOUR_PROJECT>.firebaseio.com'
>      const DEV_FIREBASE_PROJECT_ID = <project_id>
>      const DEV_BOT_TOKEN = <BOT_TOKEN>

3.- For the Firebase Database rules, change to:

>     {
>       "rules": {
>         ".read": true,
>         ".write": true,
>         "songs": {
>           ".indexOn": ["collection"]
>         }
>       }
>     }

4.- For Telegram User Info, check widget documentation:https://core.telegram.org/widgets/login

## How to test it:

##### A. Get all song names and other data
```
{
  songs{id, title, photo_url}
}
```
##### B1. Get song info by Id
```
{
  songInfoById(songId:-455452954){title, doc_url}
}
```
##### B2. Get song info by Id and user logged
```
{
  songInfoById(songId:-1001476711416, userInfo: { id: 165123,
    first_name: "firstname",
    username: "username",
    photo_url: "https://t.me/i/userpic/320/photo.jpg",
    auth_date: 21367123,
    hash: "hash"}){doc_url, user_permission}
}
```

##### C. Get all tracks from song by Id
```
{
  tracks(songId:-455452954){ message {voice {mime_type}, audio {title}}, file_path}
}
```

##### D. Edit message caption to "delete" in chat by Id and completely remove at DB
```
{
  deleteMessage(chat_id:-1001476711416,message_id:3, track_id:"AgADOwcAAk_K6FI_1591545625", userInfo: { id: 165123,
  first_name: "firstname",
  username: "username",
  photo_url: "https://t.me/i/userpic/320/photo.jpg",
  auth_date: 21367123,
  hash: "hash"
} ) {
    ok, result {message_id}, description
  }
}

```

##### E. Get file link by id
```
{
  getFileLink(file_id:"AwACAgQAAx0CWATT-AADA17dDxn-A5N27TXJbV8otSzl_LDpAAI7BwACT8roUtCoJ11NuxV3GgQ"){result {file_path}}
}
```
##### F. Get songs by collection name
```
{
  collection(collectionName:"munsell"){id, title, photo_url}
}
```
##### G. Send audio file from web app
Go to http://127.0.0.1:8080/testFileUploadForm and complete the form with the proper information:
- Chat Id: the id of the channel or group. In exmaple: -455452954, -1001476711416
- User info: produced by Telegram Login Widget. See Note 4 above. In example:
>     {
>	      "id": 12345678,
>	      "first_name": "first_name",
>	      "username": "username",
>	      "photo_url": "https://t.me/i/userpic/320/photo.jpg",
>	      "auth_date": 1590105664,
>	      "hash": "hash_code"
>     }
- File data: choose a valid audio file from your browser.
Open the Developer Console Tools from your browser

## More info:

Wiki: https://github.com/gilpanal/bunchofsongs_bot/wiki

Project Dev Board: https://github.com/gilpanal/bunchofsongs_bot/projects/1
