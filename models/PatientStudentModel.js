const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const EMR_User = mongoose.model('emr-users');


// Create Schema
const PatientStudentSchema = new Schema({
	recordID: {type: String, require: true},  // Unique id of student and patient ID 'SXXXX-patientID
	patientID:  {type: String, require: true},
	user: {
		type: Schema.Types.ObjectId,
		ref: 'emr-users'
	},
	nursingAssessmentID: {
		type: Schema.Types.ObjectId,
		ref: 'nursing-assessment'
	},
	nric:  {type: String, default: ''},
	familyName: {type: String, default: ''},
	givenName:  {type: String, default: ''},
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
	otherLang:	 {type: String},
	notes: {type: String},
	
	masterID:  {type: Schema.Types.ObjectId, require: true}
});

// Create collection and add schema
mongoose.model('patientStudent', PatientStudentSchema, 'patient-student');
// patientStudent is name of the model used to when requiring module from other JS files
// patient-student is document name in MongoDB