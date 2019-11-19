const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const EMR_User = mongoose.model('emr-users');


//Create Schema
const MasterAppointmentSchema = new Schema({
    patientID:  {type: String, require: true},	
	// userID: {
	// 	type: Schema.Types.ObjectId,
	// 	ref: 'emr-users' 	// collection name in mongodb
	// },
	// nursingAssessmentID: {
	// 	type: Schema.Types.ObjectId,
	// 	ref: 'nursing-assessment'
    // },
    appointmentID:    {type: String, default: ''},
    datetime:   {type: String, default: ''},
    date:   {type: String, default: ''},
    time:   {type: String, default: ''},
    // 7
    // Follow-up Appointment
    followUpAppointment: {type: String, default: ''},
    followUpAppointmentSpecify: {type: String, default: ''},
    clinic: {type: String, default:''},
    nameOfDoctor: {type: String, default: ''},
    memoGiven: {type: Boolean}, // radio button
    remarks: {type: String, default: ''}
});

mongoose.model('masterAppointment', MasterAppointmentSchema, 'master-appointment');