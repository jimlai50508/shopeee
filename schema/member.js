var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var memberSchema = new Schema({
    username: {
    	type: String, 
    	index: {unique: true},
        required: true
    },
    password: String,
    email: {
        type: String, 
        index: {unique: true}
    },
    active: Boolean,
    activeToken: {
    	type: String, 
    	index: {unique: true}
    },
    registerTime: Number,
    registerDate: Date,	
    favorite: [],
    order: []
});

var member = mongoose.model('members', memberSchema );

module.exports = member;