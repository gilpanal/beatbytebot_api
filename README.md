# bunchofsongs_api
GrpahQL API for bunchofsongs project

## SUMMARY:
This is the endpoint for the web application: https://github.com/gilpanal/bunchofsongs
It is also recommended to run the bot project to test the API properly, as the creation of new entries at the DB requires of a first input from a Telegram channel/group processed by the bot.

## REQUIREMENTS:
- Node.js (v14)
- Firebase Project and Database: https://firebase.google.com/docs/admin/setup#set-up-project-and-service-account
- Telegram Bot Token: https://core.telegram.org/bots#6-botfather

## HOW TO RUN IT LOCALLY:
1. ```git clone https://github.com/gilpanal/bunchofsongs_api.git```
2. ```cd bunchofsongs_api```
3. ```npm i```
4. Rename the file `src/config_template.js` to `src/config.js` and fill it with the proper info. See Note 1,2 below.
5. ```npm start```
6. Go to http://127.0.0.1:8080

NOTES:
1.- See: https://firebase.google.com/docs/admin/setup#initialize-sdk

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

## EXAMPLES OF REQUESTS:

###### A. Get all song names and other data
```
{
  songs{id, title, photo_url}
}
```
###### B1. Get song info by Id
```
{
  songInfoById(songId:-1001315827508){doc_url}
}
```
###### B2. Get song info by Id and user logged
```
{
  songInfoById(songId:-1001315827508, userInfo: { id: 165123,
    first_name: "firstname",
    username: "username",
    photo_url: "https://t.me/i/userpic/320/photo.jpg",
    auth_date: 21367123,
    hash: "hash"}){doc_url, user_permission}
}
```

###### C. Get all tracks from song by Id
```
{
  tracks(songId: -1001315827508){ message {audio {title}}, file_path}
}
```

###### D. Edit message caption to "delete" in chat by Id and completely remove at DB
```
{
  deleteMessage(chat_id:-1001315827508,message_id:316, track_id:"AgADIAYAAgfkUFI_1590273380", userInfo: { id: 165123,
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

###### E. Get file link by id
```
{
  getFileLink(file_id:"AwACAgQAAx0CTm3vNAADBl69xdoTbd6fsZ7TgVTthlf-wZJmAAKzBgACvdfxUZiZdihOfhpSGQQ"){result {file_path}}
}
```
###### F. Get songs by collection name
```
{
  collection(collectionName:"munsell"){id, title, photo_url}
}
```

## MORE INFO:

Wiki: https://github.com/gilpanal/bunchofsongs_bot/wiki

Project Dev Board: https://github.com/gilpanal/bunchofsongs_bot/projects/1