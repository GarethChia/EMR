const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const EMR_User = mongoose.model('emr-users');
//const NursingAssessmentModel = mongoose.model('assessmentModel'); // not working for embedding collection
const NursingAssessmentModel = require('./NursingAssessmentModel');


// Create Schema
const MasterMotorStrengthSchema = new Schema({
	patientID:  {type: String, require: true},
	userID: {
		type: Schema.Types.ObjectId,
		ref: 'emr-users' 	// collection name in mongodb
	},
	nursingAssessmentID: {
		type: Schema.Types.ObjectId,
		ref: 'nursing-assessment'
	},
	motorstrengthID:	 {type: String, default:''},
	userType:	 {type: String, default:''},
	datetime: 	{type: String, default:''},
	date:	{type: String, default:''},
	time:		 {type: String, default: ''},
	strengthrightarm:	 {type: String, default: ''},
	strengthleftarm:	 {type: String, default: ''},
	strengthrightleg:		 {type: String, default: ''},
	strengthleftleg:		 {type: String, default: ''},
	totalms: 	{type: String, default: ''},
	splitstrengthrightarm:	 {type: String, default: ''},
	splitstrengthleftarm:	 {type: String, default: ''},
	splitstrengthrightleg:		 {type: String, default: ''},
	splitstrengthleftleg:		 {type: String, default: ''},
});

mongoose.model('masterMotorStrength', MasterMotorStrengthSchema, 'master-motorstrength');