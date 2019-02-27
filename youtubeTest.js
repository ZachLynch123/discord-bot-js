const searchYoutube = require('youtube-api-v3-search');
const keys = require('./keys');

let title = ''
let videoId = ''


module.exports = setOptions = (query) => {
  
  const options = {
    q: query,
    part: 'snippet',
    type: 'video'
  }
  searchYoutube(keys.youtubeApi, options)
    .then(res => {      
      title = res.items[0].snippet.title;
      videoId = res.items[0].id.videoId;

      module.exports.title = title;
module.exports.videoId = videoId;
    })
    .catch(e => console.log(e))
}




