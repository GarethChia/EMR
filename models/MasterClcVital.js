const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const EMR_User = mongoose.model('emr-users');
//const NursingAssessmentModel = mongoose.model('assessmentModel'); // not working for embedding collection
const NursingAssessmentModel = require('./NursingAssessmentModel');


// Create Schema
const MasterClcVitalSchema = new Schema({
	patientID:  {type: String, required: true},
	userID: {
		type: Schema.Types.ObjectId,
		ref: 'emr-users' 	// collection name in mongodb
	},
	nursingAssessmentID: {
		type: Schema.Types.ObjectId,
		ref: 'nursing-assessment'
	},
	datetime: 	{type: String, default:''},
	date:	{type: String, default:''},
	time:	{type: String, default:''},

	studentName: 	{type: String, default:''},

	clcvitalID:	 {type: String, default:''},
	userType:	 {type: String, default:''},

	heartRate:	 {type: String, default: ''},
	resp:		 {type: String, default: ''},
	sbp:		 {type: String, default: ''},
	dbp:		 {type: String, default: ''},
	bloodp: 	 {type: String, default: ''},
});

mongoose.model('masterClcVital', MasterClcVitalSchema, 'master-clcvital');