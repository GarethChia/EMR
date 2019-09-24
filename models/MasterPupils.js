const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const EMR_User = mongoose.model('emr-users');
//const NursingAssessmentModel = mongoose.model('assessmentModel'); // not working for embedding collection
const NursingAssessmentModel = require('./NursingAssessmentModel');


// Create Schema
const MasterPupilsSchema = new Schema({
	patientID:  {type: String, require: true},
	userID: {
		type: Schema.Types.ObjectId,
		ref: 'emr-users' 	// collection name in mongodb
	},
	nursingAssessmentID: {
		type: Schema.Types.ObjectId,
		ref: 'nursing-assessment'
	},
	pupilsID:	 {type: String, default:''},
	userType:	 {type: String, default:''},
	datetime: 	{type: String, default:''},
	date:	{type: String, default:''},
	time:		 {type: String, default: ''},
	sizeright:	 {type: String, default: ''},
	sizeleft:	 {type: String, default: ''},
	reactionright:		 {type: String, default: ''},
    reactionleft:		 {type: String, default: ''},

});

mongoose.model('masterPupils', MasterPupilsSchema, 'master-pupils');