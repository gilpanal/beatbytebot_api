const trackProfile = (data, file_path) => {
  return {
    id: data.id,
    message: data.message,
    file_path: file_path
  }
}
module.exports = trackProfile