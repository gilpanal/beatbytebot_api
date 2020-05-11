const songProfile = (data) => {
  return {
    id: data.id,
    title: data.title,
    document: data.document,
    tracks: data.tracks,
    photo: data.photo,
    description: data.description,
    type: data.type
  }
}
module.exports = songProfile