const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const EMR_User = mongoose.model('emr-users');
//const NursingAssessmentModel = mongoose.model('assessmentModel'); // not working for embedding collection
const NursingAssessmentModel = require('./NursingAssessmentModel');


// Create Schema
const MasterVitalSchema = new Schema({
	patientID:  {type: String, required: true},
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
	datetime: 	{type: String, default:''},
	date:	{type: String, default:''},
	time:	{type: String, default:''},
	// admDate:	{type: Date},
	// dischargeDate: 	{type: Date},
	studentName: 	{type: String, default:''},
	// checkStudent:	 {type: String, default:''},
	vitalID:	 {type: String, default:''},
	userType:	 {type: String, default:''},
	// hour:  		 {type: String, default:''},
	// min: 		 {type: String, default:''},
	// finalmin: 	 {type: String, default: ''},
	// time:		 {type: String, default: ''},
	temp:		 {type: String, default: ''},
	tempRoute:	 {type: String, default: ''},
	heartRate:	 {type: String, default: ''},
	resp:		 {type: String, default: ''},
	sbp:		 {type: String, default: ''},
	dbp:		 {type: String, default: ''},
	sbpArterial:		 {type: String, default: ''},
	dbpArterial:		 {type: String, default: ''},
	bPressure:   {type: String, default: ''},
	arterialBP:	 {type: String, default: ''},
	bpLocation:	 {type: String, default: ''},
	bpMethod:	 {type: String, default: ''},
	patientPosition: {type: String, default: ''},
	
});

mongoose.model('masterVital', MasterVitalSchema, 'master-vital');