// multicaster.js
// ==============

var http = require('http');

module.exports = {
  get: function(url) {
    http.get(url, function(res) {
      console.log("Got response: " + res.statusCode);
      return res;
    }).on('error', function(e) {
      console.log("Got error: " + e.message);
    });
  },
  post: function(hostname, port, path, data) {
    var options = {
      hostname: hostname,
      port: port,
      path: path,
      method: 'POST'
    };

    var req = http.request(options, function(res) {
      console.log('STATUS: ' + res.statusCode);
      console.log('HEADERS: ' + JSON.stringify(res.headers));
      res.setEncoding('utf8');
      res.on('data', function (chunk) {
        console.log('BODY: ' + chunk);
      });
    });

    req.on('error', function(e) {
      console.log('problem with request: ' + e.message);
    });

    // write data to request body
    req.write(data);
    req.end();
  }
}

//get("http://www.google.com/index.html");
//post('www.google.com', 80, '/upload', 'helloworld');
