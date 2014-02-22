
//require dependencies
var express = require('express');
var models = require('./models');
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var config = require('./oauth.js');
var auth = require('./authentication.js');
var sharejs = require('share').server;
var redis = require('redis');
var RedisStore = require('connect-redis')(express);

//set up server
var port = 8080;
var app = express();

var options = {db: {type: 'redis'},  browserChannel: {cors: "*"}};
sharejs.attach(app, options);

app.listen(port);
console.log('Listening on port ' + port);  

//sets up templating engine as jade
app.engine('jade', require('jade').__express);

//configures static asset delivery
app.use(express.static(__dirname + '/public'));

//configures passport js
app.use(express.cookieParser());
app.use(express.bodyParser());
app.use(express.session({ secret: 'keyboard cat' , store: new RedisStore({ host: 'localhost', port: 6379 })}));
app.use(passport.initialize())
app.use(passport.session());

passport.serializeUser(function(user, done) {
 console.log('serializeUser: ' + user)
 done(null, user._id);
});

passport.deserializeUser(function(id, done) {
 models.User.findById(id, function(err, user){
     console.log(user)
     if(!err) done(null, user);
     else done(err, null)
 })
});


//-------------------------LOG IN ROUTES -----------------------------//
app.set('user', null);

app.get('/log_in', function(req, res) {
  res.render('log_in.jade');
})

app.get('/sign_up', function(req, res) {
  models.School.find().exec(function(err, schools) {
    res.render('sign_up.jade', {schools: JSON.stringify(schools)});
  });
})

app.get('/log_out', function(req, res) {
  req.logout();
  app.set('user', null);
  app.set('name', null);
  res.redirect('/log_in');
});

//FB routes
app.get('/auth/facebook', passport.authenticate('facebook'));

app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/log_in' }),
  function(req, res) {
    app.set('user', req.user);
    app.set('name', app.get('user').first_name + " " + app.get('user').last_name);
    if (req.user.email) {
      res.redirect('/');
    } else {
      res.redirect('/sign_up?id='+req.user.id);
    }
  });

//----------------------STATIC ROUTES--------------------------//


app.get('/', isLoggedIn, function(req, res) {  
  models.User.find({ _id: app.get('user')._id})
             .populate('groups')
             .exec(function(err, userG) {              
              res.render('groups.jade', {user: app.get('name'), image: app.get('user').image, groups: JSON.stringify(userG[0].groups)});
             })
});

app.get('/groups/new', isLoggedIn, function(req, res) {
  models.Course.find({ school_id: app.get('user').school_id })
              .exec(function(err, courses){
                res.render('create-group.jade', {user: app.get('name'), image: app.get('user').image, courses: JSON.stringify(courses) });
              })
});

app.get('/groups/search', isLoggedIn, function(req, res) {
  models.Group.find()
              .populate('users course_id')
              .exec(function(err, groups) {
                res.render('find-group.jade', {user: app.get('name'), image: app.get('user').image, groups: JSON.stringify(groups)});    
              });    
});

app.get('/join_group', isLoggedIn, function(req, res) {
  models.Group.findOne({_id: req.query['group_id']}).exec(function(err, group) {
    res.render('join-group.jade', {user: app.get('name'), image: app.get('user').image, group: group});    
  });  
}); 

app.get('/groups/:id/requests', isLoggedIn, function(req, res) {
  if (app.get('user').groups.indexOf(req.params.id) === -1) {
    res.send(401, "You don't belong to that group.");
    res.redirect('/');
  } else {
    models.Request.find({group_id: req.params.id, ignored: false})
                  .populate('user_id group_id')
                  .exec(function(err, requests) {
                    res.render('requests.jade', {user: app.get('name'), image: app.get('user').image, requests: JSON.stringify(requests)});               
                  });        
  }
});

app.get('/leave_group/:id', isLoggedIn, function(req, res) {
  if (app.get('user').groups.indexOf(req.params.id) === -1) {
    res.send(401, "You don't belong to that group.");
    res.redirect('/');
  } else {
    models.Group.findOne({_id: req.params.id}).exec(function(err, group) {
      res.render('leave-group.jade', {user: app.get('name'), image: app.get('user').image, group: group});    
    });  
  }  
});

app.get('/groups/:id/flashcards', isLoggedIn, function(req, res){
  if (app.get('user').groups.indexOf(req.params.id) === -1) {
    res.send(401, "You don't belong to that group.");
    res.redirect('/');
  } else {
    models.Group.findOne({_id: req.params.id})
                .populate('topics')
                .exec(function(err, group){
                  res.render('topics.jade', {user: app.get('name'), image: app.get('user').image, group_name: group.name, group_id: group._id, topics: JSON.stringify(group.topics)});               
                });
  }
});

app.get('/groups/:id/topics/new', isLoggedIn, function(req, res){
  if (app.get('user').groups.indexOf(req.params.id) === -1) {
    res.send(401, "You don't belong to that group.");
    res.redirect('/');
  } else {
    models.Group.findOne({_id: req.params.id}).exec(function(err, group){
      res.render('topics_new.jade', {user: app.get('name'), image: app.get('user').image, group: group.name});               
    });
  }
});

app.get('/groups/:group_id/flashcards/:topic_id', isLoggedIn, function(req, res){  
  if (app.get('user').groups.indexOf(req.params.group_id) === -1) {
    res.send(401, "You don't belong to that group.");
    res.redirect('/');
  } else {
    models.Topic.findOne({_id: req.params.topic_id})
                  .populate('group_id')
                  .exec(function(err, topic){
                    res.render('flashcards.jade', {user: app.get('name'), image: app.get('user').image, group_name: topic.group_id.name, group_id: topic.group_id._id, topic: JSON.stringify(topic), flashcards: JSON.stringify(topic.flashcards)});               
                  });
  }
});

app.get('/groups/:group_id/flashcards/:topic_id/edit', isLoggedIn, function(req, res) {
  if (app.get('user').groups.indexOf(req.params.group_id) === -1) {
    res.send(401, "You don't belong to that group.");
    res.redirect('/');
  } else {
    models.Topic.findOne({_id: req.params.topic_id})
          .populate('group_id')
          .exec(function(err, topic) {
            res.render('edit_flashcards.jade', {user: app.get('name'), image: app.get('user').image, group_name: topic.group_id.name, topic: JSON.stringify(topic), flashcards: JSON.stringify(topic.flashcards)});
          });
  }
});


//--------------------------- API -----------------------------//

//GET routes

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

app.get('/topics', function(req, res) {
  if (req.query['id']) {
    //return topic with its parent group name
    models.Topic.findOne({ _id: req.query['id'] })
                  .populate('group_id', 'name')
                  .exec(function(err, topic) {
                    console.log("TOPIC: ", JSON.stringify(topic));
                    res.send(200, JSON.stringify(topic));
                  });

  } else if (req.query['group_id']) {
    //return topic with their parent group name
    models.Topic.find({ group_id: req.query['group_id'] })
                  .populate('group_id', 'name')
                  .exec(function(err, topics) {
                    res.send(200, JSON.stringify(topics));
                  });      
  }
});

app.get('/communications', function(req, res) {
  if (req.query['group_id']) {
    models.Communication.find({group_id: req.query['group_id']})
                        .populate('user_id')
                        .exec(function(err, communications) {
                          res.send(200, JSON.stringify(communications));
                        });
  }
});

app.get('/courses', function(req, res) {
  if (req.query['school_id']) {
    models.Course.find({ school_id: req.query['school_id'] })
                 .exec(function(err, courses) {
                   res.send(200, JSON.stringify(courses));
                 });
  }
});

app.get('/schools', function(req, res) {
  models.School.find()
               .exec(function(err, schools) {
                res.send(200, JSON.stringify(schools));
               });
});

//------------------------POST routes-----------------------------//

app.post('/leave_group', function(req, res){
  models.User.findOne({_id: app.get('user')._id })
            .exec(function(err, user){
              user.groups.splice(user.groups.indexOf(req.body.group_id), 1);
              user.save(function(){
                models.Group.findOne({_id: req.body.group_id})
                            .exec(function(err, group){
                                group.users.splice(group.users.indexOf(user._id));
                                group.save(function(){
                                  res.send(201)
                                });
                            })
              });
            })
});


app.post('/groups', function(req, res){
  var group = new models.Group(req.body);
  group.users.push(app.get('user')._id);
  
  group.save(function(){
    models.User.findOne({
      _id : app.get('user')._id
    }).exec(function(err, user){
      user.groups.push(group._id);
      user.save(function() {
        models.Course.findOne({_id: group.course_id})
                     .exec(function(err, course) {
                       course.groups.push(group._id);
                       course.save(function() {
                         console.log(course, group);
                         res.send(201);                                                
                       });
                     });
      });
    });
  });
});

app.post('/requests', function(req, res){
  if (app.get('user').groups.indexOf(req.body.group_id) === -1) {
    var request = new models.Request(req.body);
    request.user_id = app.get('user')._id
    request.save(function(){
      models.Group.findOne({_id : request.group_id})
                  .exec(function(err, group){
                    group.requests.push(request._id);
                    console.log("Request: ", request);
                    group.save(function() {
                      res.send(201);                    
                    });
                  });
    });
  } else {
    res.send(401, "You are already in that group.");
  }
  
});

app.post('/members', function(req, res){

  models.Group.findOne({_id: req.body.group_id})
              .exec(function(err, group){
                if (group.users.indexOf(req.body.user_id) === -1) {
                  group.users.push(req.body.user_id);
                  group.save(function(){
                    models.User.findOne({_id: req.body.user_id})
                               .exec(function(err, user){
                                  user.groups.push(req.body.group_id);
                                  user.save(function(){
                                     models.Request.findOne({_id: req.body.request_id})
                                                   .remove()
                                                   .exec(function(err) {
                                                     group.requests.splice(group.requests.indexOf(req.body.request_id),1);
                                                     group.save(function() {
                                                       res.send(201);                                                     
                                                     });
                                                   }); 
                                  });
                               });
                  });
                } else {
                  res.send(401);
                }
              });
});


app.post('/leave_group', function(req, res){
  models.User.findOne({_id: app.get('user')._id })
            .exec(function(err, user){
              user.groups.splice(user.groups.indexOf(req.body.group_id), 1);
              user.save(function(){
                models.Group.findOne({_id: req.body.group_id})
                            .exec(function(err, group){
                                group.users.splice(group.users.indexOf(user._id));
                                group.save(function(){
                                  res.send(201)
                                });
                            })
              });
            })
});

app.post('/topics', function(req, res){
  var topic = new models.Topic(req.body);
  topic.save(function(){
    models.Group.findOne({_id: topic.group_id})
                .exec(function(err, group){
                  group.topics.push(topic._id);
                  group.save(function(){
                    console.log('NEW TOPIC: ', topic)
                    console.log('GROUP: ', group)
                    res.send(201);
                  });
                });
  });
});

app.put('/topics', function(req, res) {
  models.Topic.findOne({_id: req.body.topic_id}).exec(function(err, topic) {
    topic.flashcards = req.body.cards;
    topic.save(function() {
      console.log("EDITED TOPIC: ", JSON.stringify(topic.title), JSON.stringify(topic.flashcards));
      res.send(200);
    });
  });
});

app.put('/sign_up', function(req, res){
  models.User.findOne({ _id: app.get('user')._id }, function(err, user){
    user.email = req.body.email;
    user.school_id = req.body.school._id;
    user.phone_number = req.body.phone_number;
    user.intensity = req.body.intensity;
    user.save(function(err, user){
      console.log(user);
      res.send(200);
    });
  });
})

app.put('/requests/:id', function(req, res) {
  models.Request.findOne({ _id: req.params.id })
                .exec(function(err, request) {
                  request.ignored = true;
                  request.save(function() {
                    models.Group.findOne({ _id: request.group_id }).exec(function(err, group) {
                     group.requests.splice(group.requests.indexOf(request._id),1);
                     group.save(function() {
                       res.send(200);      
                     });
                    });
                  });
                });
});

app.put('/delete_flashcards', function(req, res){
  models.Topic.findOne({_id: req.body.topic_id}).exec(function(err, topic) {
    topic.flashcards.splice(req.body.index, 1);
    topic.save(function(){
      res.send(200);
    });
  });
});

// deleting flashcards!
app.put('/delete_flashcards', function(req, res){
  models.Topic.findOne({_id: req.body.topic_id}).exec(function(err, topic) {
    for(var i = 0; i < topic.flashcards.length; i++){
      if(topic.flashcards[i] === req.body.card){
        console.log("deleting card ", topic.flashcards[i]);
        topic.flashcards.splice(i, 1);
      }
    }
    topic.save(function(){
      res.send(200);
    });
  });
});
//----------------------helper functions-------------------------//

function isLoggedIn(req, res, next) {

  if (req.isAuthenticated()) {
    app.set('user', req.user);
    app.set('name', app.get('user').first_name + " " + app.get('user').last_name);
    return next();
  }
  res.send(401, "User must log in.");
  res.redirect('/log_in');
}

