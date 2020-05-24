# bunchofsongs_api
GrpahQL API for bunchofsongs project

## HOW TO RUN IT LOCALLY:
1. ```npm i```
2. ``` Copy the content of ".env_template" to ".env" file and fill with it with proper info```
3. ```npm start```

**NOTE:** A Firebase Database and a Telegram Bot are required to fully start the project locally

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
  songInfoById(songId:-1001315827508, userInfo: { id: ID,
    first_name: "firstname",
    username: "username",
    photo_url: "https://t.me/i/userpic/320/photo.jpg",
    auth_date: AUTH_DATE,
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
  deleteMessage(chat_id:-1001315827508,message_id:316, track_id:"AgADIAYAAgfkUFI_1590273380", userInfo: UserInfo! ) {
    ok
  }
}

Where UserInfo is something like:

{ id: ID,
  first_name: "firstname",
  username: "username",
  photo_url: "https://t.me/i/userpic/320/photo.jpg",
  auth_date: AUTH_DATE,
  hash: "hash"
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