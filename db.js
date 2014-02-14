
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
    first_name: String,
    last_name: String,
    email: String,
    password_digest: String,
    password_salt: String,
    auth_token: String,
    school_id: Number,
    facebook_id: String,
    phone_number: Number,
    intensity: String
    image: String,
    created_at: Date
  });
  
  //creates user model
  var User = mongoose.model('User', userSchema);
  
  //creates school schema
  var schoolSchema = mongoose.Schema({
    name: String,
    type: String,
    domain: String
  });
  
  //creates school model
  var School = mongoose.model('School', schoolSchema);
  
  //creates course schema
  var courseSchema = mongoose.Schema({
    school_id: Number,
    name: String,
    term: String,
    instructor: String,
    created_at: Date
  });
  
  //creates course model
  var Course = mongoose.model('Course', courseSchema);
  
  //creates group schema
  var groupSchema = mongoose.Schema({
    name: String,
    course_id: Number,
    intensity: String,
    motto: String,
    entry_question: String,
    description: String,
    open: Boolean,
    next_meeting: Date,
    created_at: Date
  });
  
  //creates group model
  var Group = mongoose.model('Group', groupSchema);
  
  //creates lecture schema
  var lectureSchema = mongoose.Schema({
    group_id: Number,
    title: String,
    lecture_date: Date,
    updated_at: Date
  });
  
  //creates lecture model
  var Lecture = mongoose.model('Lecture', lectureSchema);
  
  //creates flashcard schema
  var flashcardSchema = mongoose.Schema({
    group_id: Number,
    lecture_id: Number,
    term: String,
    definition: String,
    created_at: Date,
    updated_at: Date
  });
  
  //creates flashcard model
  var Flashcard = mongoose.model('Flashcard', flashcardSchema);
  
  //creates group assignment (user-group join table) schema
  var groupAssignmentSchema = mongoose.Schema({
    user_id: Number,
    group_id: Number,
    entry_answer: String,
    approved: Boolean,
    ignored: Boolean
  });
  
  //creates group assignment model
  var GroupAssignment = mongoose.model('GroupAssignment', groupAssignmentSchema);
  
  //creates communication schema
  var communicationSchema = mongoose.Schema({
    group_id: Number,
    user_id: Number,
    subject: String,
    body: String,
    created_at: Date
  });
  
  //creates communication model
  var Communication = mongoose.model('Communication', communicationSchema);
  
  //creates rsvp schema
  var rsvpSchema = mongoose.Schema({
    group_id: Number,
    user_id: Number,
    proposed_time: Date,
    duration: Number,
    available: Boolean,
    resolved: Boolean
  });
  
  //creates rsvp model
  var Rsvp = mongoose.model('Rsvp', rsvpSchema);
  
});
