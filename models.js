
var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');

mongoose.connect('mongodb://localhost/test');

var db = mongoose.connection;

autoIncrement.initialize(db);

//log any connection errors to database
db.on('error', function (err) {
  console.log("Error: " + err);
});

//creates user schema
var userSchema = mongoose.Schema({
  first_name: String,
  last_name: String,
  email: String,
  password_digest: String,
  password_salt: String,
  auth_token: String,
  school_id: { type: Number, ref: 'School' },
  facebook:  {
    id: Number,
    token: String
  },
  phone_number: Number,
  groups: [{type: Number, ref: 'Group'}],
  rsvps: [{type: Number, ref: 'Rsvp'}],
  intensity: String,
  image: String,
  created_at: Date
});

userSchema.plugin(autoIncrement.plugin, 'User');
    
//creates school schema
var schoolSchema = mongoose.Schema({
  name: String,
  type: String,
  domain: String,
  courses: [{type: Number, ref: 'Course'}]
});

schoolSchema.plugin(autoIncrement.plugin, 'School');

    
//creates course schema
var courseSchema = mongoose.Schema({
  school_id: {type: Number, ref: 'School'},
  name: String,
  term: String,
  instructor: String,
  created_at: Date
});

courseSchema.plugin(autoIncrement.plugin, 'Course');

//creates group schema
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
  users: [{type: Number, ref: 'User'}],
  lectures: [{type: Number, ref: 'Lecture'}],
  communications: [{type: Number, ref: 'Communication'}],
  rsvps: [{type: Number, ref: "Rsvp"}],
  requests: [{type: Number, ref: "Request"}]
});

groupSchema.plugin(autoIncrement.plugin, 'Group');
  
  //creates lecture schema
var lectureSchema = mongoose.Schema({
  group_id: {type: Number, ref: 'Group'},
  title: String,
  lecture_date: Date,
  updated_at: Date,
  flashcards: []
});

lectureSchema.plugin(autoIncrement.plugin, 'Lecture');
  
//creates communication schema
var communicationSchema = mongoose.Schema({
  group_id: {type: Number, ref: 'Group'},
  user_id: {type: Number, ref: 'User'},
  subject: String,
  body: String,
  created_at: Date
});
  
communicationSchema.plugin(autoIncrement.plugin, 'Communication');

//creates rsvp schema
var rsvpSchema = mongoose.Schema({
  group_id: {type: Number, ref: 'Group'},
  user_id: {type: Number, ref: 'User'},
  proposed_time: Date,
  duration: Number,
  available: Boolean,
  created_at: Date
});

rsvpSchema.plugin(autoIncrement.plugin, 'Rsvp');
  
//creates request schema
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
  Lecture: mongoose.model('Lecture', lectureSchema),
  Communication: mongoose.model('Communication', communicationSchema),
  Rsvp: mongoose.model('Rsvp', rsvpSchema),
  Request: mongoose.model('Request', requestSchema)
};
    