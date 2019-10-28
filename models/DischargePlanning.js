const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const EMR_User = mongoose.model('emr-users');


//Create Schema
const DischargePlanning = new Schema({
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
    dischargePlanningID:    {type: String, default: ''},
    datetime:   {type: String, default: ''},
    date:   {type: String, default: ''},
    time:   {type: String, default: ''},
    dischargeCondition: {type: String, default: ''},
    dischargeTo: {type: String, default: ''},
    dischargeToOthersSpecify: {type: String, default: ''},
    accompaniedBy: {type: String, default: ''},
    accompaniedByOthersSpecify: {type: String, default: ''},
    modeOfTransport: {type: String, default: ''},
    modeOfTransportOthersSpecify: {type: String, default: ''},
    removalOf: [String],
    checkedAndReturned: [String], // checklist
    checkedAndReturnedAppliancesSpecify: {type: String, default: ''},
    checkedAndReturnedOthersSpecify: {type: String, default: ''},
    adviceGivenOn: [String], // checklist
    // Follow-up Appointment
    followUpAppointment:	 [String],
    followUpAppointmentDD: {type: String, default: ''},
    followUpAppointmentOthersSpecify: {type: String, default: ''},
    appointmentDate: {type: String, default: ''},
    appointmentTime: {type: String, default: ''},
    clinic: {type: String, default:''},
    nameOfDoctor: {type: String, default: ''},
    memoGiven: {type: String, default: ''},
    remarks: {type: String, default: ''},
    // Special Instructions
    specialInstructions:    [String],
    specialInstructionsSpecify: {type: String, default: ''},
    // Referrals
    referrals:	 [String],
    referralsOthersSpecify: {type: String, default: ''},
    // Medications
    medications:	 [String],
    medicalCertificateNo: {type: String, default: ''},
    // Medik Awas
    medikAwas:  [String],
    // Discharge Teaching/ Instructions
    dischargeTeachingInstructions:  [String],
    // Hospital Inpatient Discharge Summary
    hospitalInpatientDischargeSummary:  [String],
    // Medical Certificate No
    medicalCertificateNo:   [String],
    // Feedback form
    feedbackForm:   [String]
});

mongoose.model('dischargePlanning', DischargePlanning, 'discharge-planning');