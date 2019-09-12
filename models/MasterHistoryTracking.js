const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const EMR_User = mongoose.model('emr-users');
//const NursingAssessmentModel = mongoose.model('assessmentModel'); // not working for embedding collection
const NursingAssessmentModel = require('./NursingAssessmentModel');


// Create Schema
const MasterHistorySchema = new Schema({
	patientID:  {type: String, require: true},
	chiefComp: {type: String, default: ''},
	historyPresent:  {type: String, default: ''},
	user: {
		type: Schema.Types.ObjectId,
		ref: 'emr-users' 	// collection name in mongodb
    },
    //this is 
	nursingAssessmentID: {
		type: Schema.Types.ObjectId,
		ref: 'nursing-assessment'
	},
	allergy:	{type: String, default:''},
	medicalH:	{type: String, default:''},
	surgicalH: {type: String, default:''},
	familyH:	 {type: String, default:''},
	socialH:	 {type: String, default: ''},
    travelH:	 {type: String, default: ''},
	historyId:  {type: String, default:''},
	by: {type: String, default:''},
	masterpatientID:{type: String, default:''},
	
});

mongoose.model('masterHistoryTrack', MasterHistorySchema, 'master-historyTrack');