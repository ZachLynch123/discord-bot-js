var https = require('https');

var options = {
  'method': 'GET',
  'hostname': 'api.imgur.com',
  'path': '/3/gallery/hot/viral/week/1{{page}}?showViral=true&mature=false&album_previews=false',
  'headers': {
    'Authorization': 'Client-ID'
  }
};

var req = https.request(options, function (res) {
  var chunks = [];

  res.on("data", function (chunk) {
    chunks.push(chunk);
  });

  res.on("end", function (chunk) {
    var body = Buffer.concat(chunks);
    // const json = body.toString();
    const json = JSON.parse(body);
    console.log(json.data[0]);

  });

  res.on("error", function (error) {
    console.error(error);
  });
});

req.end();