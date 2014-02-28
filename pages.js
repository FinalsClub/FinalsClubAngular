var models = require('./models');
var utils = require('./utils');

app.get('/', utils.isLoggedIn, function(req, res) {  
  models.Group.find({_id: {$in: app.get('user').groups}})
              .populate('users')
              .exec(function(err, groups) {
                res.render('groups/groups.jade', {
                  user: app.get('name'),
                  image: app.get('user').image,
                  groups: JSON.stringify(groups),
                  user_token: app.get('user').facebook.token,
                  user_id: app.get('user')._id
                });                
              });
});

app.get('/users/:user_id/edit', utils.isLoggedIn, utils.isUser, function(req, res) {
  models.School.find().exec(function(err, schools) {
    res.render('users/edit_user.jade', {
      schools: JSON.stringify(schools),
      user: app.get('name'),
      image: app.get('user').image,
      user_obj: app.get('user'),
      user_id: app.get('user')._id
    });
  });
});

app.get('/groups/new', utils.isLoggedIn, function(req, res) {
  models.Course.find({ school_id: app.get('user').school_id })
              .exec(function(err, courses){
                res.render('groups/create-group.jade', {
                  user: app.get('name'),
                  image: app.get('user').image,
                  courses: JSON.stringify(courses),
                  user_token: app.get('user').facebook.token,
                  user_id: app.get('user')._id
                });
              });
});

app.get('/groups/search', utils.isLoggedIn, function(req, res) {
  models.Group.find({hidden: false})
              .populate('users course_id')
              .exec(function(err, groups) {
                  res.render('groups/find-group.jade', {
                    user: app.get('name'),
                    user_id: app.get('user')._id,
                    image: app.get('user').image,
                    user_groups: req.user.groups,
                    groups: JSON.stringify(groups),
                    user_token: app.get('user').facebook.token,
                    user_id: app.get('user')._id
                  });    
              });    
});

app.get('/join_group', utils.isLoggedIn, function(req, res) {
  models.Group.findOne({_id: req.query['group_id']}).exec(function(err, group) {
    res.render('groups/join-group.jade', {
      user: app.get('name'),
      image: app.get('user').image,
      group: group,
      user_token: app.get('user').facebook.token,
      user_id: app.get('user')._id
    });    
  });  
}); 

app.get('/groups/:group_id/requests', utils.isLoggedIn, utils.isGroupMember, function(req, res) {
  models.Request.find({group_id: req.params.group_id, ignored: false})
                .populate('user_id group_id')
                .exec(function(err, requests) {
                  res.render('groups/requests.jade', {
                    user: app.get('name'),
                    image: app.get('user').image,
                    requests: JSON.stringify(requests),
                    user_token: app.get('user').facebook.token,
                    user_id: app.get('user')._id                      
                  });               
                });        
});

app.get('/groups/:group_id/flashcards', utils.isLoggedIn, utils.isGroupMember, function(req, res){
  models.Group.findOne({_id: req.params.group_id})
              .populate('topics')
              .exec(function(err, group){
                if (group === null) {
                  res.send(404, 'Group does not exist.');
                } else {
                  res.render('topics/topics.jade', {
                    user: app.get('name'),
                    image: app.get('user').image,
                    group_name: group.name,
                    group_id: group._id,
                    topics: JSON.stringify(group.topics),
                    user_token: app.get('user').facebook.token,
                    user_id: app.get('user')._id                  
                  });                                 
                }
              });
});

app.get('/groups/:group_id/flashcards/:topic_id', utils.isLoggedIn, utils.isGroupMember, function(req, res){  
  models.Topic.findOne({_id: req.params.topic_id})
                .populate('group_id')
                .exec(function(err, topic){
                  res.render('flashcards/flashcards.jade', {
                    user: app.get('name'),
                    image: app.get('user').image,
                    group_name: topic.group_id.name,
                    group_id: topic.group_id._id,
                    topic: JSON.stringify(topic),
                    flashcards: JSON.stringify(topic.flashcards),
                    user_token: app.get('user').facebook.token,
                    user_id: app.get('user')._id
                  });               
                });
});

app.get('/groups/:group_id/flashcards/:topic_id/edit', utils.isLoggedIn, utils.isGroupMember, function(req, res) {
  models.Topic.findOne({_id: req.params.topic_id})
        .populate('group_id')
        .exec(function(err, topic) {
          res.render('flashcards/edit_flashcards.jade', {
            user: app.get('name'),
            image: app.get('user').image,
            group_name: topic.group_id.name,
            topic: JSON.stringify(topic),
            flashcards: JSON.stringify(topic.flashcards),
            pads: JSON.stringify(topic.pads),
            user_token: app.get('user').facebook.token,
            user_id: app.get('user')._id            
          });
        });
});

app.get('/groups/:group_id/edit', utils.isLoggedIn, utils.isGroupMember, function(req, res) {
  models.Course.find({ school_id: app.get('user').school_id })
            .exec(function(err, courses){
              models.Group.findOne({_id: req.params.group_id})
                          .exec(function(err, group){
                            res.render('groups/edit-group.jade', {
                              user: app.get('name'),
                              image: app.get('user').image,
                              group: JSON.stringify(group),
                              user_token: app.get('user').facebook.token,
                              user_id: app.get('user')._id,
                              courses: JSON.stringify(courses)                   
                            });
                          });
            });  
});