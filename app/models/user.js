// app/models/user.js

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var UserSchema   = new Schema({
	name: String,
    fname: String,
    lname: String,
    company:String,
    date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', UserSchema);
