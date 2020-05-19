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
###### B. Get song info by Id
```
{
  songInfoById(songId:-1001315827508){doc_url}
}
```

###### C. Get all tracks from song by Id
```
{
  tracks(songId: -1001315827508){ message {audio {title}}, file_path}
}
```

###### D. Delete message in chat by Id
```
{
  deleteMessage(chat_id:-479857559,message_id:148) {
    ok
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