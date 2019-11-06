const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const EMR_User = mongoose.model('emr-users');


//Create Schema
const StudentAppointmentSchema = new Schema({
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
    appointmentID:    {type: String, default: ''},
    datetime:   {type: String, default: ''},
    date:   {type: String, default: ''},
    time:   {type: String, default: ''},
    // 7
    adviceGivenOn: [String], // checklist
    // Follow-up Appointment
    followUpAppointment: {type: String, default: ''},
    followUpAppointmentSpecify: {type: String, default: ''},
    appointmentDate: {type: String, default: ''},
    appointmentTime: {type: String, default: ''},
    clinic: {type: String, default:''},
    nameOfDoctor: {type: String, default: ''},
    memoGiven: {type: Boolean}, // radio button
    remarks: {type: String, default: ''},
    // Special Instructions
    specialInstructionsSpecify: {type: String, default: ''},
    // Referrals
    referrals:	 {type: String, default: ''},
    referralsSpecify: {type: String, default: ''},
    // Medical Cert No
    medicalCertificateNo: {type: String, default: ''},
});

mongoose.model('studentAppointment', StudentAppointmentSchema, 'student-appointment');