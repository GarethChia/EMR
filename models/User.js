const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Shema
const UserSchema = new Schema({
	firstName: {
		type: String
	},
	lastName: {
		type: String
	}
});

// Create collection and add schema
mongoose.model('USERS', UserSchema, 'user-collection');