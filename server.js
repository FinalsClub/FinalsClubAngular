
var http = require('http');
var url = require('url');
var querystring = require('querystring');
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
  resp.end(JSON.stringify(obj));
}

//sets up request method control structure
var reqMethods = {
  'GET': function(req, res) {
    var pathname = url.parse(req.url).pathname;
    var params = querystring.parse(url.parse(req.url).query);
    
    if (pathname === "/groups" && params['user_id']) {
      
      //return groups for that user, along with that group's nested models
      models.User.findOne({ _id: params['user_id'] })
                 .populate('users')
                 .populate('requests')
                 .populate('communications')
                 .exec(function(err, groups) {
                   sendResponse(200, defaultHeaders, groups, res);            
                 });
      
    } else if (pathname === "/groups"){
      
      //return all groups with their users
      models.Group.find()
                  .populate('users')
                  .exec(function(err, groups) {
                    sendResponse(200, defaultHeaders, groups, res);            
                  });
      
    } else if (pathname === "/users" && params['id']) {

      //return user
      models.User.findOne({_id: params['id']}, function(err, user) {
        sendResponse(200, defaultHeaders, user, res);                    
      });

    } else if (pathname === '/lectures' && params['id']) {
      
      //return lecture with its parent group name
      models.Lecture.findOne({ _id: params['id'] }).populate('group_id', 'name').exec(function(err, lecture) {
        sendResponse(200, defaultHeaders, lecture, res);        
      });
      
    } else if (pathname === '/lectures' && params['group_id']) {
      
      //return lectures with their parent group name
      models.Lecture.find({ group_id: params['group_id'] })
                    .populate('group_id', 'name')
                    .exec(function(err, lectures) {
                      sendResponse(200, defaultHeaders, lectures, res);        
                    });      
    } else {
      sendResponse(404, defaultHeaders, null, res);
    }


    // if (req.url === '/groups') {
    //   //return all groups
    //   models.Group.find(function(err, groups) {
    //     sendResponse(200, defaultHeaders, groups, res);
    //   });
    // } 
    
    
    
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