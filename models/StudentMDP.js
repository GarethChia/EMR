const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const EMR_User = mongoose.model('emr-users');
const NursingAssessmentModel = require('./NursingAssessmentModel');

// Create Schema
const StudentMDPSchema = new Schema({
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
    mdpID: {type: String, default: ''},
    date:	{type: String, default:''},
    time:		 {type: String, default: ''},
    datetime: {type: String, default: ''},
    selectUser: {type: String, default:''},
    nameOfHealthProvider: {type: String, default:''},
    progressNotes: {type: String, default: ''}
});

mongoose.model('studentMDP', StudentMDPSchema, 'student-MDP');