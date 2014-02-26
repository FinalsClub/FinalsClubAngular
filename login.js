var models = require('./models');

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
