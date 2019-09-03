const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Shema
const GoogleUser = new Schema({
	googleID:{
		type:String,
		required: true
	},
	firstName: {
		type: String
	},
	lastName: {
		type: String
	},
	email:{
		type: String,
		required: true
	},
});

// Create collection and add schema
mongoose.model('google-users',  GoogleUser , 'google-users');