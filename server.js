
//require dependencies
var express = require('express');
var models = require('./models');
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var config = require('./oauth.js');

//set up server
var port = 8080;
var app = express();
app.listen(port);
console.log('Listening on port ' + port);  

//sets up templating engine as jade
app.engine('jade', require('jade').__express);

//configures static asset delivery
app.use(express.static(__dirname + '/public'));

//configures passport js
app.use(express.cookieParser());
app.use(express.bodyParser());
app.use(express.session({ secret: 'keyboard cat' }));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
 console.log('serializeUser: ' + user._id)
 done(null, user._id);
});
passport.deserializeUser(function(id, done) {
 models.User.findById(id, function(err, user){
     console.log(user)
     if(!err) done(null, user);
     else done(err, null)
 })
});

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
  app.get(routes[i], isLoggedIn, function(req, res) {
    res.render('index.jade');
  });
}

//FB login routes
app.get('/auth/facebook', passport.authenticate('facebook'));

app.get('/auth/facebook/callback',
  passport.authenticate('facebook'),
  function(req, res) {
   res.send("logged in!");
  }
);

app.get('/log_out', function(req, res) {
  req.logout();
  res.send("logged out!");
});

//------------------ API --------------------//

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
                 });e
  }
});

app.get('/schools', function(req, res) {
  models.School.find()
               .exec(function(err, schools) {
                res.send(200, JSON.stringify(schools));
               });
});



//POST routes

// app.post('/log_in', passport.authenticate('local'), function(req, res) {
//   res.send(200, JSON.stringify(req.user));
// });

app.post('/users', function(req, res){

});

app.post('/groups', function(req, res){

});

app.post('/requests', function(req, res){

});

app.post('/new_member', function(req, res){

});

//helper functions

function isLoggedIn(req, res, next) {

  if (req.isAuthenticated())
    return next();

  res.send(401, "User must log in.");
}


passport.use(new FacebookStrategy(
  {
   clientID: config.clientID,
   clientSecret: config.clientSecret,
   callbackURL: config.callbackURL
  },
  // facebook will send back the token and profile
  function(token, refreshToken, profile, done) {
    process.nextTick(function() {  
      // find the user in the database based on their facebook id
      models.User.findOne({ 'facebook.id' : profile.id }, function(err, user) {
        // if there is an error, stop everything and return that error
        if (err) { return done(err); }

        // if the user is found, then log them in
        if (user) {
          return done(null, user);
        } else {
          // if there is no user found with that facebook id, create them
          var newUser = new  models.User();
          
          // set all of the facebook information in our user model
          newUser.facebook.id    = profile.id; // set the users facebook id                 
          newUser.facebook.token = token; // we will save the token that facebook provides to the user                  

          // save our user to the database
          newUser.save(function(err) {
            if (err) { throw err; }
            return done(null, newUser);
          });
        } 
      });
    });
  })
);