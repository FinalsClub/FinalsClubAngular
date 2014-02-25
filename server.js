
//require dependencies

var express = require('express');
var models = require('./models');
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var auth = require('./authentication.js');
var sharejs = require('share').server;

var rtg;
var redis;
if (process.env.REDISTOGO_URL) {
  rtg = require('url').parse(process.env.REDISTOGO_URL);
  redis = require('redis').createClient(rtg.port, rtg.hostname);
  redis.auth(rtg.auth.split(':')[1]);  
} else {
  rtg = {
    hostname: null,
    port: null,
    auth: ''
  };
  redis = require('redis').createClient(6379, 'localhost');
}
var RedisStore = require('connect-redis')(express);
var sessionStore = new RedisStore({client: redis});

//set up server
var port = Number(process.env.PORT || 5000);;
var app = express();

//attach share JS server to app
var options = {db: {type: 'redis', hostname: rtg.hostname, port: rtg.port, auth: rtg.auth.split(':')[1] || null},  browserChannel: {cors: "*"}};
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
app.use(express.session({ secret: process.env.CLIENT_SECRET  || 'cats4life', store: sessionStore}));
app.use(passport.initialize())
app.use(passport.session());

passport.serializeUser(function(user, done) {
 done(null, user._id);
});

passport.deserializeUser(function(id, done) {
 models.User.findById(id, function(err, user){
     if(!err) done(null, user);
     else done(err, null)
 })
});


//-------------------------LOG IN ROUTES -----------------------------//
app.set('user', null);

app.get('/log_in', function(req, res) {
  res.render('users/log_in.jade');
})

app.get('/sign_up', function(req, res) {
  models.School.find().exec(function(err, schools) {
    res.render('users/sign_up.jade', {schools: JSON.stringify(schools)});
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
    req.user.email ? res.redirect('/') : res.redirect('/sign_up?id='+req.user.id);
  });

//----------------------STATIC ROUTES--------------------------//

app.get('/', isLoggedIn, function(req, res) {  
  models.Group.find({_id: {$in: app.get('user').groups}})
              .populate('users')
              .exec(function(err, groups) {
                res.render('groups/groups.jade', {user: app.get('name'), image: app.get('user').image, groups: JSON.stringify(groups)});                
              });
});

app.get('/groups/new', isLoggedIn, function(req, res) {
  models.Course.find({ school_id: app.get('user').school_id })
              .exec(function(err, courses){
                res.render('groups/create-group.jade', {user: app.get('name'), image: app.get('user').image, courses: JSON.stringify(courses) });
              })
});

app.get('/groups/search', isLoggedIn, function(req, res) {
  models.Group.find()
              .populate('users course_id')
              .exec(function(err, groups) {
                res.render('groups/find-group.jade', {user: app.get('name'), image: app.get('user').image, user_groups: req.user.groups, groups: JSON.stringify(groups)});    
              });    
});

app.get('/join_group', isLoggedIn, function(req, res) {
  models.Group.findOne({_id: req.query['group_id']}).exec(function(err, group) {
    res.render('groups/join-group.jade', {user: app.get('name'), image: app.get('user').image, group: group});    
  });  
}); 

app.get('/groups/:group_id/requests', isLoggedIn, isGroupMember, function(req, res) {
  models.Request.find({group_id: req.params.group_id, ignored: false})
                .populate('user_id group_id')
                .exec(function(err, requests) {
                  res.render('groups/requests.jade', {user: app.get('name'), image: app.get('user').image, requests: JSON.stringify(requests)});               
                });        
});

app.get('/leave_group/:group_id', isLoggedIn, isGroupMember, function(req, res) {
  models.Group.findOne({_id: req.params.group_id}).exec(function(err, group) {
    res.render('groups/leave-group.jade', {user: app.get('name'), image: app.get('user').image, group: group.name});    
  });  
});

app.get('/groups/:group_id/flashcards', isLoggedIn, isGroupMember, function(req, res){
  models.Group.findOne({_id: req.params.group_id})
              .populate('topics')
              .exec(function(err, group){
                res.render('topics/topics.jade', {user: app.get('name'), image: app.get('user').image, group_name: group.name, group_id: group._id, topics: JSON.stringify(group.topics)});               
              });
});

app.get('/groups/:group_id/topics/new', isLoggedIn, isGroupMember, function(req, res){
  models.Group.findOne({_id: req.params.group_id}).exec(function(err, group){
    res.render('topics/topics_new.jade', {user: app.get('name'), image: app.get('user').image, group: group.name});               
  });
});

app.get('/groups/:group_id/flashcards/:topic_id', isLoggedIn, isGroupMember, function(req, res){  
  models.Topic.findOne({_id: req.params.topic_id})
                .populate('group_id')
                .exec(function(err, topic){
                  res.render('flashcards/flashcards.jade', {user: app.get('name'), image: app.get('user').image, group_name: topic.group_id.name, group_id: topic.group_id._id, topic: JSON.stringify(topic), flashcards: JSON.stringify(topic.flashcards)});               
                });
});

app.get('/groups/:group_id/flashcards/:topic_id/edit', isLoggedIn, isGroupMember, function(req, res) {
  models.Topic.findOne({_id: req.params.topic_id})
        .populate('group_id')
        .exec(function(err, topic) {
          res.render('flashcards/edit_flashcards.jade', {user: app.get('name'), image: app.get('user').image, group_name: topic.group_id.name, topic: JSON.stringify(topic), flashcards: JSON.stringify(topic.flashcards)});
        });
});


//--------------------------- API -----------------------------//

//GET routes

app.get('/topics', isLoggedIn, function(req, res) {
  if (req.query['id']) {
    //return topic with its parent group name
    models.Topic.findOne({ _id: req.query['id'] })
                  .populate('group_id', 'name')
                  .exec(function(err, topic) {
                    res.send(200, JSON.stringify(topic));
                  });

  } 
});

//POST routes

app.put('/sign_up', isLoggedIn, function(req, res){
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
});

app.post('/leave_group', isLoggedIn, function(req, res){
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
                            });
              });
            });
});


app.post('/groups', isLoggedIn, function(req, res){
  models.Course.findOne({name: req.body.course_id}).exec(function(err, course) {
    if (course === null) {
      var newCourse = new models.Course({
        school_id: app.get('user').school_id,
        name: req.body.course_id
      });
      newCourse.save(function() {
       req.body.course_id = newCourse._id;
       createNewGroup(req.body, res, newCourse);
      });
    } else {
      req.body.course_id = course._id;
      createNewGroup(req.body, res, course);
    }
 });             
});

app.post('/requests', isLoggedIn, function(req, res){
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

app.post('/members', isLoggedIn, function(req, res){

  models.Group.findOne({_id: req.body.group_id}).exec(function(err, group){
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


app.post('/leave_group', isLoggedIn, function(req, res){
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

app.post('/topics', isLoggedIn, function(req, res){
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

app.put('/topics', isLoggedIn, function(req, res) {
  models.Topic.findOne({_id: req.body.topic_id}).exec(function(err, topic) {
    console.log("CARDS: ", req.body.cards);
    topic.flashcards = req.body.cards;
    topic.save(function() {
      console.log("EDITED TOPIC: ", JSON.stringify(topic.flashcards));
      res.send(200);
    });
  });
});

app.put('/requests/:id', isLoggedIn, function(req, res) {
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

app.put('/delete_flashcards', isLoggedIn, function(req, res){
  models.Topic.findOne({_id: req.body.topic_id}).exec(function(err, topic) {
    topic.flashcards.splice(req.body.index, 1);
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
};

function isGroupMember(req, res, next) {
  if (app.get('user').groups.indexOf(req.params.group_id) === -1) {
    res.send(401, "You don't belong to that group.");
    res.redirect('/');
  } else {
    return next();  
  }
}

function createNewGroup(data, response, course) {
  var group = new models.Group(data);
  group.users.push(app.get('user')._id);
  group.save(function(){
    models.User.findOne({_id : app.get('user')._id})
               .exec(function(err, user){
                 user.groups.push(group._id);
                 user.save(function() {
                   course.groups.push(group._id);
                   course.save(function() {
                     response.send(201);                                                                            
                   });
                 });
               });
  });
};