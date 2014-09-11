// app/models/project.js

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var ProjectSchema   = new Schema({
	name: String,
    user: String,
    date: { type: Date, default: Date.now },
    comments: String,
    
                                 
    
    
});

module.exports = mongoose.model('Project', ProjectSchema);