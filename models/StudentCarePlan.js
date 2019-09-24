const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const EMR_User = mongoose.model('emr-users');
const NursingAssessmentModel = require('./NursingAssessmentModel');

// Create Schema
const StudentCarePlanSchema = new Schema({
    patientID: {type: String, require: true},
    studentPatientID: {type: String, require: true},
    user: {
      type: Schema.Types.ObjectId,
      ref: 'emr-users' 	// collection name in mongodb
    },
    createdBy: {type: String},
    /*nursingAssessmentID: {
      type: Schema.Types.ObjectId,
      ref: 'nursing-assessment'
    },*/
    carePlanID: {type: String, default: ''},
    date:	{type: String, default:''},
    time:		 {type: String, default: ''},
    datetime: {type: String, default: ''},
    categoryOfNursingIssues: {type: String, default:''},
    problemIdentified: {type: String, default:''},
    assessment: {type: String, default:''},
    goalAndExpectedOutcomes: {type: String, default: ''},
    interventions: {type: String, default: ''},
    rationale: {type: String, default: ''},
    evaluations: {type: String, default: ''}
});

mongoose.model('studentCarePlan', StudentCarePlanSchema, 'student-CarePlan');