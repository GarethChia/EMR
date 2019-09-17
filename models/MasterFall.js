const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const EMR_User = mongoose.model('emr-users');
//const NursingAssessmentModel = mongoose.model('assessmentModel'); // not working for embedding collection
const NursingAssessmentModel = require('./NursingAssessmentModel');


// Create Schema
const MasterFallSchema = new Schema({
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
	fallID:	 {type: String, default:''},
	history:	 {type: String, default: ''},
	secondary:	 {type: String, default: ''},
	ambu:		 {type: String, default: ''},
	ivhl:		 {type: String, default: ''},
	gait: 		 {type: String, default: ''},
	mental:		 {type: String, default: ''},
	
	historySplit:	 {type: String, default: ''},
	secondarySplit:	 {type: String, default: ''},
	ambuSplit:		 {type: String, default: ''},
	ivhlSplit:		 {type: String, default: ''},
	gaitSplit: 		 {type: String, default: ''},
	mentalSplit:		 {type: String, default: ''},
	
	totalmf:		 {type: String, default: ''},
	by:	 {type: String, default: ''}
});

mongoose.model('masterFall', MasterFallSchema, 'master-fall');