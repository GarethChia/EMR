const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const EMR_User = mongoose.model('emr-users');
//const NursingAssessmentModel = mongoose.model('assessmentModel'); // not working for embedding collection
const NursingAssessmentModel = require('./NursingAssessmentModel');


// Create Schema
const MasterDiabeticSchema = new Schema({
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
	diabeticID:	 {type: String, default:''},
	userType:	 {type: String, default:''},
	datetime: 	{type: String, default:''},
	date:	{type: String, default:''},
	time:		 {type: String, default: ''},
	poc:	 {type: String, default: ''},
	bgl:	 {type: String, default: ''},
	insulintype:		 {type: String, default: ''},
    insulinamt:   {type: String, default: ''},		
	hypoagent:   {type: String, default: ''},	
	splitpoc:	 {type: String, default: ''},

	
});

mongoose.model('masterDiabetic', MasterDiabeticSchema, 'master-diabetic');