const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const EMR_User = mongoose.model('emr-users');
//const NursingAssessmentModel = mongoose.model('assessmentModel'); // not working for embedding collection
const NursingAssessmentModel = require('./NursingAssessmentModel');


//Create Schema
const MasterPainSchema = new Schema({ 
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
    painID: {type: String, default: ''},
    userType: {type: String, default: ''},
    datetime: 	{type: String, default:''},
	date:	{type: String, default:''},
    time:		 {type: String, default: ''},
    painScale:  {type: String, default: ''},
    painScore:  {type: String, default: ''},
    onset:  {type: String, default: ''},
    location:   {type: String, default: ''},
    duration:   {type: String, default: ''},
    characteristics:    {type: String, default: ''},
    associatedSymp:     {type: String, default: ''},
    aggravatingFact:    {type: String, default: ''},
    relievingFact:  {type: String, default: ''},
    painIntervene:  {type: String, default: ''},
    responseIntervene:  {type: String, default: ''},
    siteofpain: {type: String, default: ''}

});

mongoose.model('masterPain', MasterPainSchema, 'master-pain');