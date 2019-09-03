const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create schema
const EMRUser = new Schema({
	azure_oid:{
		type:String,
	},
	firstName: {
		type: String
	},
	lastName: {
		type: String
	},
	userType: {
		type: String
	},
	email:{
		type: String,
		required: true
	},
	homeURL: {
		type: String
	},
});

// Create collection and add schema
mongoose.model('emr-users',  EMRUser , 'emr-users');