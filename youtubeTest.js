const searchYoutube = require('youtube-api-v3-search');
const keys = require('./keys');

class YoutubeSearch {
  constructor() {
    this.id = 'id_1'
  }
  

  set youtubeQuery(query) {
    const options = {
      q: query,
      part: 'snippet',
      type: 'video'
    }
  }

  get youtubeSearchTitle() {
    searchYoutube(keys.youtubeApi, options)
    .then(res => {
      this.title = res.items[0].snippet.title;
      return title
    })
  }
  get youtubeSearchVideoUrl() {
    searchYoutube(keys.youtubeApi, options)
    .then(res => {
      this.videoId = res.items[0].id.videoId;
      return videoId
    })
  }
}

module.exports = YoutubeSearch;



