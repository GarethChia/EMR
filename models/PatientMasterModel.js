const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const EMR_User = mongoose.model('emr-users');
//const NursingAssessmentModel = mongoose.model('assessmentModel'); // not working for embedding collection
const NursingAssessmentModel = require('./NursingAssessmentModel');


// Create Schema
const PatientMasterSchema = new Schema({
	patientID:  {type: String, require: true},
	nric:  {type: String, default: ''},
	familyName: {type: String, default: ''},
	givenName:  {type: String, default: ''},
	user: {
		type: Schema.Types.ObjectId,
		ref: 'emr-users' 	// collection name in mongodb
	},
	nursingAssessmentID: {
		type: Schema.Types.ObjectId,
		ref: 'nursing-assessment'
	},
	// embed NursingAssessment collection
	/*
	nursingAssessmentEmbed:{
		type: NursingAssessmentModel, default: NursingAssessmentModel
	},
	*/
	dateCreated: {type: Date, default: Date.now},
	dob: 		 {type: Date},
	gender:		 {type: String},
	weight:		 {type: Number},
	height:		 {type: Number},
	address: 	 {type: String, default: ''},
	postalCode:	 {type: String, default: ''},
	mobilePhone: {type: String, default: ''},
	homePhone: 	 {type: String, default: ''},
	officePhone: {type: String, default: ''},
	
	ward:	 	{type: String, default: ''},
	bed:		{type: String, default: ''},
	admDate:	{type: Date},
	policeCase:	{type: Boolean},
	admFrom:	{type: String, default: ''},
	modeOfArr:	{type: String},
	accompBy:	{type: String, default: ''},
	caseNotes:	{type: Number, default: 0},
	xRaysCD:	{type: Number, default: 0},
	prevAdm:	{type: String, default: ''},
	condArr:	[String],
	otherCond:	{type: String, default: ''},
	ownMeds: 	{type: Boolean},
	unableAssess: {type: String, default: ''},
	adviceMeds:	 {type: String, default: ''},
	
	emgName:	 {type: String, default: ''},
	emgRel:		 {type: String, default: ''},
	emgMobile:	 {type: String, default: ''},
	emgHome:	 {type: String, default: ''},
	emgOffice:	 {type: String, default: ''},
	
	careName:	 {type: String, default: ''},
	careRel:	 {type: String, default: ''},
	careOccu:	 {type: String, default: ''},
	careMobile:	 {type: String, default: ''},
	careHome:	 {type: String, default: ''},
	careOffice:	 {type: String, default: ''},
	
	accomodation: {type: String},
	hospConcerns: [String],
	spiritConcerns: {type: String},
	prefLang:	 [String],
	otherLang:	 {type: String}
	
});

// Create collection and add schema
mongoose.model('patient', PatientMasterSchema, 'patient-master');
// 'patient is name of the model that is used to identify the model when 'requiring' it in other JS files
// 'patient-master is name of collection in mongodb