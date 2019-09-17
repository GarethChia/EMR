const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const EMR_User = mongoose.model('emr-users');
//const NursingAssessmentModel = mongoose.model('assessmentModel'); // not working for embedding collection
const NursingAssessmentModel = require('./NursingAssessmentModel');


// Create Schema
const MasterBradenSchema = new Schema({
	patientID:  {type: String, require: true},
	nric:  {type: String, default: ''},
	familyName: {type: String, default: ''},
	givenName:  {type: String, default: ''},
	userID: {
		type: Schema.Types.ObjectId,
		ref: 'emr-users' 	// collection name in mongodb
	},
	nursingAssessmentID: {
		type: Schema.Types.ObjectId,
		ref: 'nursing-assessment'
	},
	datetime:	{type: String, default:''},
	date:	{type: String, default:''},
	studentName: {type: String, default:''},
	bradenID:	 {type: String, default:''},
	sensePerc:	 {type: String, default: ''},
	activity:	 {type: String, default: ''},
	moisture:		 {type: String, default: ''},
	mobility:		 {type: String, default: ''},
	nutrition: 		 {type: String, default: ''},
	fns:		 {type: String, default: ''},

	sensePercSplit:	 {type: String, default: ''},
	activitySplit:	 {type: String, default: ''},
	moistureSplit:		 {type: String, default: ''},
	mobilitySplit:		 {type: String, default: ''},
	nutritionSplit: 		 {type: String, default: ''},
	fnsSplit:		 {type: String, default: ''},
	total:		 {type: String, default: ''},
	by:	{type: String, default: ''}
	
});

mongoose.model('masterBraden', MasterBradenSchema, 'master-braden');