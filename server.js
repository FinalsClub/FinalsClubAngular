
//require dependencies
var express = require('express');
var models = require("./models");

//set up server
var port = 8080;
var app = express();
app.listen(port);
console.log('Listening on port ' + port);  

//sets up templating engine as jade
app.engine('jade', require('jade').__express);

//configures static asset delivery
app.use(express.static(__dirname + '/public'));

//defines routes for serving single page app
var routes = [
  '/',
  '/log_in',
  '/sign_up',
  '/groups/:id/flashcards',
  '/groups/:id/flashcards/:lecture_id',
  '/groups/:id/flashcards/:lecture_id/edit',
  '/groups/search',
  '/groups/new',
  '/groups/:id/members',
  '/groups/:id/communications'
];

//goes through routes and serves layout page for each
for(var i = 0; i < routes.length; i++) {
  app.get(routes[i], function(req, res) {
    res.render('layout.jade');
  });
}

//api routes

app.get('/groups', function(req, res) {
  if (req.query['user_id']) {    
    //return groups for that user
    models.User.findOne({ _id: req.query['user_id'] })
               .populate('groups')
               .exec(function(err, user) {
                 res.send(200, JSON.stringify(user.groups));            
               });  
  } else {
    //return all groups with their users
    models.Group.find()
                .populate('users')
                .exec(function(err, groups) {
                  res.send(200, JSON.stringify(groups));
                });
  }
});

app.get('/users', function(req, res) {
  if (req.query['id']) {
    //return user
    models.User.findOne({_id: req.query['id']}, function(err, user) {
      res.send(200, JSON.stringify(user));
    });
  }
});

app.get('/lectures', function(req, res) {
  if (req.query['id']) {
    //return lecture with its parent group name
    models.Lecture.findOne({ _id: req.query['id'] })
                  .populate('group_id', 'name')
                  .exec(function(err, lecture) {
                    res.send(200, JSON.stringify(lecture));
                  });

  } else if (req.query['group_id']) {
    //return lectures with their parent group name
    models.Lecture.find({ group_id: req.query['group_id'] })
                  .populate('group_id', 'name')
                  .exec(function(err, lectures) {
                    res.send(200, JSON.stringify(lectures));
                  });      
  }
});