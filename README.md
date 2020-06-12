# beatbytebot_api
GrpahQL API for beatbytebot project

## Summary:
This is the endpoint for the web application: https://github.com/gilpanal/beatbytebot_webapp. It is also recommended to run the bot project to test the API properly (https://github.com/gilpanal/beatbytebot), as the creation of new entries at the DB requires of a first input from a Telegram channel/group processed by the bot. 
As an alternative you can also grab the file `testDB.json` at `test` folder https://raw.githubusercontent.com/gilpanal/beatbytebot_api/master/test/testDB.json and directly import into Firebase DB to simulate the Bot input.

## Demo:
If you want to see a real example just follow these steps:
1. In Telegram, create a new channel or group
2. Add the bot called "bunchofsongsbot" as an admin to the chat
3. Record something or attach an audio file
4. Visit: https://sheltered-meadow-50218.herokuapp.com/ and check the content was successfully created
5. Visit https://bunchofsongs.web.app/ to actually listen to your audio tracks
6. To test the API go to https://bunchofsongsapi.herokuapp.com/graphql and check the examples at: [How to test it](#how-to-test-it)

Current Bot features: https://github.com/gilpanal/beatbytebot/wiki/Current-Features

## Requirements:
- Node.js (v14)
- Firebase Project and Database: https://firebase.google.com/docs/admin/setup#set-up-project-and-service-account
- Telegram Bot Token: https://core.telegram.org/bots#6-botfather

## How to run it locally:
1. ```git clone https://github.com/gilpanal/beatbytebot_api.git```
2. ```cd beatbytebot_api```
3. ```npm i```
4. Rename the file `src/config_template.js` to `src/config.js` and fill it with the proper info. See Notes 1,3 below.
4. Rename the file `src/auth/account_template.js` to `src/auth/account_dev.js` and fill it with the proper info. See Notes 2,3 below.
5. ```npm start```
6. Go to http://127.0.0.1:8080

#### NOTES:

1.- To collect the right information related to Firebase for `config.js` check: https://github.com/gilpanal/beatbytebot_api/wiki/Firebase-Setup

2.- To collect the right information related to Firebase for `account_dev.js` check: https://github.com/gilpanal/beatbytebot_bot/wiki/Firebase-Setup

3.- `config.js` is meant to control different environments or modes. If `MODE='PROD'` is used another file is required inside `auth` folder => You need to create `account.json`.

4.- For Telegram User Info, check widget documentation: https://core.telegram.org/widgets/login

## How to test it:

To can check out the live environment: https://bunchofsongsapi.herokuapp.com/graphql and run some of the following example queries. In case you are running the project locally you need to adapt the queries with the info from your Firebase DB.

##### A. Get all song names and other data
```
{
  songs{id, title, description, collection}
}
```
##### B1. Get song info by Id
```
{
  songInfoById(songId:-1001301741667){title, description, collection}
}
```
##### B2. Get song info by Id and user logged (See Note 4 above for User Info)
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
  tracks(songId:-1001301741667){ message {voice {mime_type}, audio {title}}, file_path}
}
```

##### D. Edit message caption to "delete" in chat by Id and completely remove at DB (See Note 4 above for User Info)
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
  getFileLink(file_id:"CQACAgQAAx0CTZcAAWMAA1Fe4S8ImeOKUngKa63rbzuArgjdvQAC6gUAArd0CVMmguTUvBPN6RoE"){result {file_path}}
}
```
##### F. Get songs by collection name
```
{
  collection(collectionName:"munsell"){id, title, description}
}
```
##### G. Send audio file from web app (See Note 4 above for User Info)
Go to http://127.0.0.1:8080/testFileUploadForm or https://bunchofsongsapi.herokuapp.com/testFileUploadForm and complete the form with the proper information:
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

Open the Developer Console Tools from your browser to check the response

##### H. Get audio file  (raw data) from web app

Go to `/fileDownload` and add the `file_path` (see example **E**) to the URL like these examples:
- http://127.0.0.1:8080/fileDownload?<file_path>
- https://bunchofsongsapi.herokuapp.com/fileDownload?music/file_403.mp3

## More info:

Wiki: https://github.com/gilpanal/beatbytebot_api/wiki

Project Dev Board: https://github.com/gilpanal/beatbytebot_api/projects/1
