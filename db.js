
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/test');

var db = mongoose.connection;

//log any connection errors to database
db.on('error', function (err) {
  console.log("Error: " + err);
});

db.once('open', function() {
  
  //creates schema for users
  var userSchema = mongoose.Schema({
    _id: Number,
    first_name: String,
    last_name: String,
    email: String,
    password_digest: String,
    password_salt: String,
    auth_token: String,
    school_id: { type: Number, ref: 'School' },
    facebook_id: String,
    phone_number: Number,
    groups: [{type: Number, ref: 'Group'}],
    rsvps: [{type: Number, ref: 'Rsvp'}],
    intensity: String,
    image: String,
    created_at: Date
  });
  
  //creates user model
  var User = mongoose.model('User', userSchema);
  
  //creates school schema
  var schoolSchema = mongoose.Schema({
    _id: Number,
    name: String,
    type: String,
    domain: String,
    courses: [{type: Number, ref: 'Course'}]
  });
  
  //creates school model
  var School = mongoose.model('School', schoolSchema);
  
  //creates course schema
  var courseSchema = mongoose.Schema({
    _id: Number,
    school_id: {type: Number, ref: 'School'},
    name: String,
    term: String,
    instructor: String,
    created_at: Date
  });
  
  //creates course model
  var Course = mongoose.model('Course', courseSchema);
  
  //creates group schema
  var groupSchema = mongoose.Schema({
    _id: Number,
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
  
  //creates group model
  var Group = mongoose.model('Group', groupSchema);
  
  //creates lecture schema
  var lectureSchema = mongoose.Schema({
    _id: Number,
    group_id: {type: Number, ref: 'Group'},
    title: String,
    lecture_date: Date,
    updated_at: Date,
    flashcards: []
  });
  
  //creates lecture model
  var Lecture = mongoose.model('Lecture', lectureSchema);
  
  //creates communication schema
  var communicationSchema = mongoose.Schema({
    _id: Number,
    group_id: {type: Number, ref: 'Group'},
    user_id: {type: Number, ref: 'User'},
    subject: String,
    body: String,
    created_at: Date
  });
  
  //creates communication model
  var Communication = mongoose.model('Communication', communicationSchema);
  
  //creates rsvp schema
  var rsvpSchema = mongoose.Schema({
    _id: Number,
    group_id: {type: Number, ref: 'Group'},
    user_id: {type: Number, ref: 'User'},
    proposed_time: Date,
    duration: Number,
    available: Boolean
  });
  
  //creates rsvp model
  var Rsvp = mongoose.model('Rsvp', rsvpSchema);
  
  //creates request schema
  var requestSchema = mongoose.Schema({
    _id: Number,
    group_id: {type: Number, ref: 'Group'},
    user_id: {type: Number, ref: 'User'},
    entry_answer: String,
    ignored: Boolean
  });
  
  //creates rsvp model
  var Request = mongoose.model('Request', rsvpSchema);

});
