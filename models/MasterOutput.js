const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const EMR_User = mongoose.model('emr-users');
//const NursingAssessmentModel = mongoose.model('assessmentModel'); // not working for embedding collection
const NursingAssessmentModel = require('./NursingAssessmentModel');


// Create Schema
const MasterOutputSchema = new Schema({
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
	outputID:	 {type: String, default:''},
	userType:	 {type: String, default:''},
	datetime: 	{type: String, default:''},
	date:	{type: String, default:''},
	time:		 {type: String, default: ''},
	urineamt:	 {type: String, default: ''},
	urineass:	 {type: String, default: ''},
	stoolamt:		 {type: String, default: ''},
    stoolass:   {type: String, default: ''},		
    vomitamt:   {type: String, default: ''},
    vomitass:	 {type: String, default: ''},
	bloodamt:	 {type: String, default: ''},
	diaper:		 {type: String, default: ''},
    otheramt:   {type: String, default: ''},
    otherass:   {type: String, default: ''},

});

mongoose.model('masterOutput', MasterOutputSchema, 'master-output');
