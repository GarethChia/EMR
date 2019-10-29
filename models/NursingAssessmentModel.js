const mongoose = require('mongoose');
const Schema = mongoose.Schema;


// Create Schema
const NursingAssessmentSchema = new Schema({
	
	// Neurosensory
	mentalStatus: [String],
	mentalOthers: {type: String, default: ''},
	orientedTo: [String],
	hearing: {type: String, default: ''},
	hearingOthers: {type: String, default: ''},
	hearingUnable: {type: String, default: ''},
	vision: {type: String, default: ''},
	visionOthers: {type: String, default: ''},
	visionUnable: {type: String, default: ''},
	speech: {type: String, default: ''},
	
	
	// Respiratory
	breathingPattern: [String],
	breathingRemarks: {type: String, default:''},
	breathingPresence: [String], 	// none required
	cough: {type: Boolean},
	sputum: {type: Boolean},
	
	// Circulatory
	pulse: {type: String, default: ''},
	cirPresence: [String],
	oedema: {type: String, default: ''},
	extremities: [String],
	pacemaker: {type: Boolean},
	pacemakerManu: {type: String, default: ''},
	
	// Gastrointestinal
	dietType: {type: String, default: ''},
	dietOthers: {type: String, default: ''},
	fluidRestriction: {type: Boolean},
	fluidSpecify: {type: String, default: ''},
	fluidUnable: {type: String, default: ''},
	oralCavity: [String],
	dentures: [String],
	oralCavityPresence: [String],
	oralCavityOthers: {type: String, default: ''},
	
	// Elimination
	bowel: [String],		// none required
	bowelOthers: {type: String, default: ''},
	urinaryAppearance: {type: String, default: ''},
	urinaryRemarks: {type: String, default: ''},
	urinaryPresence: [String],	// none required
	urinaryOthers: {type: String, default: ''},
	adaptiveAids: [String],		// none required
	catType: {type: String, default: ''},
	catSize: {type: String, default: ''},
	dayLastChanged: {type: String, default: ''},
	
	// Sleep
	sleep: {type: Boolean},
	sleepSpecify: {type: String, default: ''},
	
	// Pain Assessment
	painPresent: {type: Boolean},
	painScale: {type: String, default: ''},
	painScore: {type: String, default: ''},
	duration: {type: String, default: ''},
	onset: {type: String, default: ''},
	location: {type: String, default: ''},
	characteristic: {type: String, default: ''},
	symptoms:{type: String, default: ''},
	factors: {type: String, default: ''},
	treatment: {type: String, default: ''}
	
});

// Create collection and add schema
mongoose.model('assessmentModel', NursingAssessmentSchema, 'nursing-assessment');
// 'assessmentModel is name of the model that is used to identify the model when 'requiring' it in other JS files
// 'nursing-assessment is name of collection in mongodb, in this case the collection is shared by both master and student
module.export = NursingAssessmentSchema;

/*
var PerSchema = new mongoose.Schema({
	siteAdmin: {type: Boolean, default: false}
});

var UserSchema = mongoose.Schema({
	fname: String,
	lname: String,
	permissions: { type: PerSchema, default: PerSchema },
});
Test it with Mongoose v4.4.3

var User = mongoose.model('User', UserSchema);

function setUser() {
	var u = new User({
		fname: 'asa',
		lname: 'dddd'
	});
	
	u.save(function(err) {
		if (err)
			console.log(err);
		else
			console.log('save user successfully');
	});
}
Result is

{
	"_id" : ObjectId("56c68321a548be98198ebb71"),
	"fname" : "asa",
	"lname" : "dddd",
	"permissions" : {
	"_id" : ObjectId("56c68321a548be98198ebb70"),
		"siteAdmin" : false
},
	"__v" : 0
}*/
