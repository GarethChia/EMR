const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const EMR_User = mongoose.model('emr-users');
//const NursingAssessmentModel = mongoose.model('assessmentModel'); // not working for embedding collection
const NursingAssessmentModel = require('./NursingAssessmentModel');


// Create Schema
const MasterNeuroSchema = new Schema({
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
	neuroID:	 {type: String, default:''},
	userType:	 {type: String, default:''},
	datetime: 	{type: String, default:''},
	date:	{type: String, default:''},
	time:		 {type: String, default: ''},
	siteOfInjury:	{type: String, default: ''},
	colourLeft: {type: String, default: ''},
	colourRight:	{type: String, default: ''},
	temperatureLeft:	{type: String, default: ''},
	temperatureRight:	{type: String, default: ''},
	capillaryRefillLeft:	{type: String, default: ''},
	capillaryRefillRight:	{type: String, default: ''},	
	peripheralPulseLeft: {type: String, default: ''},
	peripheralPulseRight:	{type: String, default: ''},
	edemaLeft:	{type: String, default: ''},
	edemaRight:	{type: String, default: ''},
	movementLeft:	{type: String, default: ''},
	movementRight: {type: String, default: ''},
	sensationLeft:	{type: String, default: ''},
	sensationRight: {type: String, default: ''},
	painScale:	{type: String, default: ''},
	// painRight:	{type: String, default: ''},
	numericalRatingScaleLeft:	{type: String, default: ''},
	numericalRatingScaleRight:	{type: String, default: ''},
	// verbalDescriptiveScaleLeft:		{type: String, default: ''},
	// verbalDescriptiveScaleRight:	{type: String, default: ''},
	characteristicLeft: 	{type: String, default: ''},
	characteristicRight:	{type: String, default: ''}
});

mongoose.model('masterNeuro', MasterNeuroSchema, 'master-neuro');