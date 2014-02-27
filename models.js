
var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');

var uristring =
process.env.MONGOLAB_URI ||
process.env.MONGOHQ_URL ||
'mongodb://localhost/test';


mongoose.connect(uristring);

var db = mongoose.connection;

autoIncrement.initialize(db);

db.on('error', function (err) {
  console.log("Error: " + err);
});

var userSchema = mongoose.Schema({
  first_name: String,
  last_name: String,
  email: String,
  auth_token: String,
  school_id: { type: Number, ref: 'School' },
  facebook:  {
    id: Number,
    token: String
  },
  phone_number: Number,
  groups: [{type: Number, ref: 'Group'}],
  intensity: String,
  image: String,
  created_at: Date
});

userSchema.plugin(autoIncrement.plugin, 'User');
    
var schoolSchema = mongoose.Schema({
  name: String,
  domain: String,
  courses: [{type: Number, ref: 'Course'}]
});

schoolSchema.plugin(autoIncrement.plugin, 'School');

var courseSchema = mongoose.Schema({
  school_id: {type: Number, ref: 'School'},
  name: String,
  term: String,
  instructor: String,
  groups: [{type: Number, ref: 'Group'}],
  created_at: Date
});

courseSchema.plugin(autoIncrement.plugin, 'Course');

var groupSchema = mongoose.Schema({
  name: String,
  course_id: {type: Number, ref: 'Course'},
  intensity: String,
  motto: String,
  entry_question: String,
  description: String,
  open: Boolean,
  next_meeting: Date, 
  created_at: Date,
  hidden: Boolean,
  users: [{type: Number, ref: 'User'}],
  topics: [{type: Number, ref: 'Topic'}],
  requests: [{type: Number, ref: "Request"}]
});

groupSchema.plugin(autoIncrement.plugin, 'Group');
  
var topicSchema = mongoose.Schema({
  group_id: {type: Number, ref: 'Group'},
  title: String,
  topic_date: Date,
  updated_at: Date,
  flashcards: []
});

topicSchema.plugin(autoIncrement.plugin, 'Topic');
    
var requestSchema = mongoose.Schema({
  group_id: {type: Number, ref: 'Group'},
  user_id: {type: Number, ref: 'User'},
  entry_answer: String,
  ignored: Boolean,
  created_at: Date
});

requestSchema.plugin(autoIncrement.plugin, 'Request');

var self = module.exports = {
  db: db,
  User: mongoose.model('User', userSchema),
  School: mongoose.model('School', schoolSchema),
  Course: mongoose.model('Course', courseSchema),
  Group: mongoose.model('Group', groupSchema),
  Topic: mongoose.model('Topic', topicSchema),
  Request: mongoose.model('Request', requestSchema)
};
    