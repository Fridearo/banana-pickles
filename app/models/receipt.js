// app/models/receipt.js

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var ReceiptSchema   = new Schema({
	name: String,
    date: { type: Date, default: Date.now },
    comments: String,
    project: String,
                                 
    
    
});

module.exports = mongoose.model('Receipt', ReceiptSchema);