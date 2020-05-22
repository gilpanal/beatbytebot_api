const songProfile = (data, photo_url, doc_url, user_permission) => {
  return {
    id: data.id,
    title: data.title,
    description: data.description,
    collection: data.collection,
    type: data.type,
    tracks: data.tracks,
    photo: data.photo,
    document: data.document,
    photo_url: photo_url,
    doc_url: doc_url, 
    user_permission: user_permission, 
  }
}
module.exports = songProfile