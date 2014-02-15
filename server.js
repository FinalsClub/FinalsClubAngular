
//require dependencies
var express = require('express');

//set up server
var port = 8080;
var app = express();
app.listen(port);
console.log('Listening on port ' + port);  

//sets up templating engine as jade
app.engine('jade', require('jade').__express);

//defines routes for serving single page app
var routes = [
  '/',
  '/login',
  '/groups/:id/flashcards',
  '/groups/:id/flashcards/:lecture_id',
  '/groups/:id/flashcards/:lecture_id/edit',
  '/groups/search',
  '/groups/new',
  '/groups/:id/members',
  '/groups/:id/communications'
];

//goes through routes and serves layout page
for(var i = 0; i < routes.length; i++) {
  app.get(routes[i], function(req, res) {
    res.render('layout.jade');
  });
}

