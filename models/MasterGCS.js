const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const EMR_User = mongoose.model('emr-users');
//const NursingAssessmentModel = mongoose.model('assessmentModel'); // not working for embedding collection
const NursingAssessmentModel = require('./NursingAssessmentModel');


// Create Schema
const MasterGcsSchema = new Schema({
	patientID:  {type: String, require: true},
	userID: {
		type: Schema.Types.ObjectId,
		ref: 'emr-users' 	// collection name in mongodb
	},
	nursingAssessmentID: {
		type: Schema.Types.ObjectId,
		ref: 'nursing-assessment'
	},
	gcsID:	 {type: String, default:''},
	userType:	 {type: String, default:''},
	datetime: 	{type: String, default:''},
	date:	{type: String, default:''},
	time:		 {type: String, default: ''},
	eyeopen:	 {type: String, default: ''},
	bestverbal:	 {type: String, default: ''},
	bestmotor:		 {type: String, default: ''},

	spliteyeopen:	 {type: String, default: ''},
	splitbestverbal:	 {type: String, default: ''},
	splitbestmotor:		 {type: String, default: ''},
    totalgcs:     {type: String, default: ''},
});

mongoose.model('masterGcs', MasterGcsSchema, 'master-gcs');