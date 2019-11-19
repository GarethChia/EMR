const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const EMR_User = mongoose.model('emr-users');
//const NursingAssessmentModel = mongoose.model('assessmentModel'); // not working for embedding collection
const NursingAssessmentModel = require('./NursingAssessmentModel');


// Create Schema
const MasterFeedingRegimeSchema = new Schema({
	patientID:  {type: String, require: true},
	userID: {
		type: Schema.Types.ObjectId,
		ref: 'emr-users' 	// collection name in mongodb
	},
	feedID:	 {type: String, default:''},
	userType:	 {type: String, default:''},
	datetime: 	{type: String, default:''},
	date:	{type: String, default:''},
	time:		 {type: String, default: ''},
	typeofFormula:		 {type: String, default: ''},
	enteralFeed:	 {type: String, default: ''},
	ordersFeed:	 {type: String, default: ''},
	masterpatientID:{type: String, default:''},
	by: {type: String, default:''},
});

mongoose.model('masterFeedingRegime', MasterFeedingRegimeSchema, 'master-feedingRegime');