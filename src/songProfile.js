function songProfile(data) {
    return {
      id: data.id,
      name: data.name,
      lyrics: data.lyrics,
      tracks: data.tracks,
      photo: data.photo,
      description: data.description
    };
  }
module.exports = songProfile;