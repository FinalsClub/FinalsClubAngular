
var http = require('http');
var url = require('url');

var port = 8080;
var ip = '127.0.0.1';

//creates server on local port 8080
http.createServer(requestHandler).listen(port, ip);

//sends response back to client
var sendResponse = function(status, headers, obj, resp) {
  resp.writeHead(status, headers);
  resp.end(obj);
}

//sets up request method control structure
var reqMethods = {
  'GET': function(req, res) {
    //control flow here to replace'null' with res obj depending on req.url (parse with url module)    
    sendResponse(200, defaultHeaders, null, res); 
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

//routes request to control flow for that method
var requestHandler = function(request, response) {
  reqMethods[request.method](request, response);
};

var defaultHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10 // Seconds.
};