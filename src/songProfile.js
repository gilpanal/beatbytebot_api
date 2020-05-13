const songProfile = (data, photo_url, doc_url) => {
  return {
    id: data.id,
    title: data.title,
    description: data.description,
    type: data.type,
    tracks: data.tracks,
    photo: data.photo,
    document: data.document,
    photo_url: photo_url,
    doc_url: doc_url,  
  }
}
module.exports = songProfile