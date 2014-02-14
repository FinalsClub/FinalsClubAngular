
var http = require('http');
var url = require('url');
var models = require("./models");
var fs = require('fs');
var path = require('path');

var port = 8080;
var ip = "127.0.0.1";

//creates server on local port 8080
var server = http.createServer(function(request, response) {
  reqMethods[request.method](request, response);
});
server.listen(port, ip);

//sends response back to client
var sendResponse = function(status, headers, obj, resp) {
  resp.writeHead(status, headers);
  resp.end(obj);
}

//sets up request method control structure
var reqMethods = {
  'GET': function(req, res) {
    var kara = new models.User({first_name: "Kara"});
    kara.save(function(err, kara) {
      models.User.find({ first_name: "Kara" }, function(err, users) {
        sendResponse(200, defaultHeaders, JSON.stringify(users), res);
      });      
    });
    // if (req.url === "/") {
    //   fs.readFile(path.join(process.cwd() + "/index.html"), function(err, text) {
    //     sendResponse(200, defaultHeaders, text, res);         
    //   });
    // }

  },
  'OPTIONS': function(req, res) {
    sendResponse(200, defaultHeaders, null, res); 
  },
  'POST': function(req, res) {
    //process req data with callbacks here
    sendResponse(201, defaultHeaders, null, res); 
  },
  'PUT': function(req, res) {
    sendResponse(200, defaultHeaders, null, res); 
  },
  'DELETE': function(req, res) {
    sendResponse(200, defaultHeaders, null, res); 
  }
}


var defaultHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10 // Seconds.
};