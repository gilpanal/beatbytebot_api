# bunchofsongs_api
GrpahQL API for bunchofsongs project

HOW TO RUN IT LOCALLY:
1. npm i
2. Modify ".env" file
3. npm start

NOTE: A Firebase Database and a Telegram Bot are required to fully start the project locally

EXAMPLES OF REQUESTS
A. Get all song names
{
  songs{name}
}

B. Get all tracks from song by Id
{
  tracks(songId: -479857559) {
    link
  }
}

C. Delete message in chat by Id

{
  deleteMessage(chat_id:-479857559,message_id:148) {
    ok
  }
}

D. Get file link by id
{
  getFileLink(file_id:"AwACAgQAAxkBAAOPXrXPJbTZBij5q6j0QnfOXo5ddG8AAvUHAALKlrFRTNmO66h3TtAZBA"){result {file_path}}
}