var models = require('./models');

module.exports.isLoggedIn = function(req, res, next) {
  if (req.isAuthenticated()) {
    app.set('user', req.user);
    app.set('name', app.get('user').first_name + " " + app.get('user').last_name);
    return next();
  } else if (req.url === '/') {
    return res.render('splashpage.jade');
  }
  res.send(401, "User must log in.");
  res.redirect('/log_in');
};

module.exports.isGroupMember = function(req, res, next) {
  if (app.get('user').groups.indexOf(req.params.group_id) === -1) {
    res.send(401, "You don't belong to that group.");
    res.redirect('/');
  } else {
    return next();  
  }
}

module.exports.createNewGroup = function(data, response, course) {
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