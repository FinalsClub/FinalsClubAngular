var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var User = require('./models').User;
var config = require('./oauth.js')

module.exports = passport.use(new FacebookStrategy(

  {
   clientID: process.env.clientID || config.clientID,
   clientSecret: process.env.clientSecret || config.clientSecret,
   callbackURL: process.env.callbackURL || config.callbackURL
  },
  // facebook will send back the token and profile
  function(token, refreshToken, profile, done) {
    process.nextTick(function() {  
      // find the user in the database based on their facebook id
      User.findOne({ 'facebook.id' : profile.id }, function(err, user) {
        // if there is an error, stop everything and return that error
        if (err) { return done(err); }

        // if the user is found, then log them in
        if (user) {
          user.facebook.token = token;
          user.save(function(err) {
            if (err) {throw err; } 
            return done(null, user);          
          })
        } else {
          // if there is no user found with that facebook id, create them
          var newUser = new User();
          
          // set all of the facebook information in our user model
          newUser.first_name = profile.name.givenName;
          newUser.last_name = profile.name.familyName;
          newUser.image = "https://graph.facebook.com/" + profile.id + "/picture";
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