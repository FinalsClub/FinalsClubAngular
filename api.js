var utils = require('./utils');
var models = require('./models');


//GET routes
app.get('/topics', utils.isLoggedIn, function(req, res) {
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
app.put('/sign_up', utils.isLoggedIn, function(req, res){
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

app.post('/leave_group', utils.isLoggedIn, function(req, res){
  models.User.findOne({_id: app.get('user')._id })
            .exec(function(err, user){
              user.groups.splice(user.groups.indexOf(req.body.group_id), 1);
              user.save(function(){
                models.Group.findOne({_id: req.body.group_id})
                            .exec(function(err, group){
                                group.users.splice(group.users.indexOf(user._id), 1);
                                group.save(function(){
                                  res.send(201);
                                });
                            });
              });
            });
});

app.post('/groups', utils.isLoggedIn, function(req, res){
  models.Course.findOne({name: req.body.course_id}).exec(function(err, course) {
    if (course === null) {
      var newCourse = new models.Course({
        school_id: app.get('user').school_id,
        name: req.body.course_id
      });
      newCourse.save(function() {
       req.body.course_id = newCourse._id;
       utils.createNewGroup(req.body, res, newCourse);
      });
    } else {
      req.body.course_id = course._id;
      utils.createNewGroup(req.body, res, course);
    }
 });             
});

app.put('/groups/:group_id/delete', utils.isLoggedIn, utils.isGroupMember, function(req, res){
  models.Group.findOne({_id: req.params.group_id})
              .populate('users')
              .exec(function(err, group){
                group.hidden = true;
                group.save(function() {
                  utils.deleteGroupUsers(group.users, group._id, 0, res);
                });
              });  
});

app.put('/groups/:group_id', utils.isLoggedIn, utils.isGroupMember, function(req, res){
  models.Group.findOne({_id: req.params.group_id}).exec(function(err, group){
    group.next_meeting = req.body.meeting;
    group.save(function(){
      res.send(200);
    });
  });
});

app.post('/requests', utils.isLoggedIn, function(req, res){
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

app.post('/members', utils.isLoggedIn, function(req, res){

  models.Group.findOne({_id: req.body.group_id}).exec(function(err, group){
    if (group.users.indexOf(req.body.user_id) === -1) {
      group.users.push(req.body.user_id);
      group.save(function(){
        models.User.findOne({_id: req.body.user_id})
                   .exec(function(err, user){
                      user.groups.push(req.body.group_id);
                      user.save(function(){
                        if(req.body.request_id){
                           models.Request.findOne({_id: req.body.request_id})
                                         .remove()
                                         .exec(function(err) {
                                           group.requests.splice(group.requests.indexOf(req.body.request_id),1);
                                           group.save(function() {
                                             res.send(201);                                                     
                                           });
                                         }); 
                        } else {
                          res.send(201);
                        }
                      });
                   });
      });
    } else {
      res.send(401);
    }
  });
});



app.post('/topics', utils.isLoggedIn, function(req, res){
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

app.put('/topics', utils.isLoggedIn, function(req, res) {
  models.Topic.findOne({_id: req.body.topic_id}).exec(function(err, topic) {
    console.log("CARDS: ", req.body.cards);
    topic.flashcards = req.body.cards;
    topic.save(function() {
      console.log("EDITED TOPIC: ", JSON.stringify(topic.flashcards));
      res.send(200);
    });
  });
});

app.put('/requests/:id', utils.isLoggedIn, function(req, res) {
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

app.put('/delete_flashcards', utils.isLoggedIn, function(req, res){
  models.Topic.findOne({_id: req.body.topic_id}).exec(function(err, topic) {
    topic.flashcards.splice(req.body.index, 1);
    topic.save(function(){
      res.send(200);
    });
  });
});



