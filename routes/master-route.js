const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const EMR_User = mongoose.model('emr-users');
const PatientMasterModel = mongoose.model('patient');
const PatientStudentModel = mongoose.model('patientStudent');
const NursingAssessmentModel = mongoose.model('assessmentModel');
const MasterVital = mongoose.model('masterVital');
const MasterBraden = mongoose.model('masterBraden');
const MasterEnteral = mongoose.model('masterEnteral');
const MasterIV= mongoose.model('masterIV');
const MasterIO = mongoose.model('masterIO');
const MasterOutput = mongoose.model('masterOutput');
const MasterFall = mongoose.model('masterFall');
const MasterOxygen = mongoose.model('masterOxygen');
const MasterPain = mongoose.model('masterPain');
const MasterWH = mongoose.model('masterWh');
const DoctorOrders = mongoose.model('doctorsOrders');
const MasterHistory = mongoose.model('masterHistoryTrack');
// MDP
const MasterMDP = mongoose.model('masterMDP');
const StudentMDP = mongoose.model('studentMDP');
// Care Plan
const StudentCarePlan = mongoose.model('studentCarePlan');
const MasterDiabetic = mongoose.model('masterDiabetic');
const MasterNeuro = mongoose.model('masterNeuro');
// CLC
const MasterGcs = mongoose.model('masterGcs');
const MasterClcVital = mongoose.model('masterClcVital');
const MasterPupils = mongoose.model('masterPupils');
const MasterMotorStrength = mongoose.model('masterMotorStrength');
//Feeding Regime & Schedule
const MasterFeedingRegime = mongoose.model('masterFeedingRegime');
const MasterScheduleFeed = mongoose.model('masterScheduleFeed');
// Discharge Planning
const MasterDischargePlanning = mongoose.model('masterDischargePlanning');

const moment = require('moment');
const csrf = require('csurf');
const alertMessage = require('../helpers/messenger');
const {ensureAuthenticated, ensureAuthorised} = require('../helpers/auth');
const toaster = require('../helpers/Toaster');
const multer = require('multer');

// imports standardID
const standardID = require('standardid');

// setup csrf protection
const csrfProtection = csrf({cookie: true});


// Shows list of master patient documents
router.get('/list-patients', ensureAuthenticated, ensureAuthorised, (req, res) => {

	studentIDs = [];
	studentNames = [];
	
	console.log('\nFrom listPatientMaster user:');
	console.log(req.user);
	PatientMasterModel.find({user: req.user._id}) // req.user_id is assigned to user, which is then used by find
	.then(patients => {

		PatientStudentModel.find({masterID: req.user._id}) // req.user_id is self generated
		.then(studentPatients => {
				
			/*EMR_User.findById({})	// findById is Mongoose utility method
			.then(user => {*/
				//toaster.setErrorMessage(' ', 'Error listing master patient records');
				// To check if user has admin rights here
				res.render('master/master-list-patients', {
					patients: patients,
					studentPatients: studentPatients,
					showMenu: false
				});
			//});
			
		});
	})
});

// shows the add patient form
router.get('/add-patient', ensureAuthenticated, (req, res) => {
	res.render('master/master-add-patient');	// handlebar!!
});

// Retrieves existing patient master page to edit
router.get('/edit/:patientID', ensureAuthenticated, ensureAuthorised, (req, res) => {
	PatientMasterModel.findOne({
		patientID: req.params.patientID			// gets current user
	})
	.populate('user')							// gets user from emr-users collection
	.then(patient => {
		// check if logged in user is owner of this patient record
		if(JSON.stringify(patient.user._id) === JSON.stringify(req.user.id)) {
			req.session.patient = patient;				// adds object to session
			res.render('master/master-edit-patient', { // calls handlebars
				patient: patient,
				showMenu: true							// shows menu using unless
			});
		} else {
			console.log('Invalid User: not allowed to edit patient');
			//alertMessage.flashMessage(res, 'User that created record is different from this user', 'fas
			// fa-exclamation', true);
			toaster.setErrorMessage('User that created record is different from this user');
		}
	});
});

// Saves/update edited master patient record
router.put('/save-edited-patient/:patientID', ensureAuthenticated, ensureAuthorised, (req, res) => {
	PatientMasterModel.findOne({
		patientID: req.params.patientID
	})
	.then(patient => {
		// New values Biography
		patient.nric = req.body.nric;
		patient.familyName = req.body.familyName;
		patient.givenName = req.body.givenName;
		patient.dateCreated = moment(new Date(), 'DD/MM/YYYY', true)
		.format();
		patient.dob = moment(req.body.dob, 'DD/MM/YYYY', true)
		.format();
		patient.gender = req.body.gender;
		patient.weight = req.body.weight;
		patient.height = req.body.height;
		patient.address = req.body.address;
		patient.postalCode = req.body.postalCode;
		patient.mobilePhone = req.body.mobilePhone;
		patient.homePhone = req.body.homePhone;
		patient.officePhone = req.body.officePhone;
		// admission
		patient.ward = req.body.ward;
		patient.bed = req.body.bed;
		patient.admDate = moment(req.body.admDate, 'DD/MM/YYYY', true)
		.format();
		patient.policeCase = req.body.policeCase;
		patient.admFrom = req.body.admFrom;
		patient.modeOfArr = req.body.modeOfArr;
		patient.accompBy = req.body.accompBy;
		patient.caseNotes = req.body.caseNotes;
		patient.xRaysCD = req.body.xRaysCD;
		patient.prevAdm = req.body.prevAdm;
		patient.condArr = req.body.condArr;
		patient.otherCond = req.body.otherCond;
		patient.ownMeds = req.body.ownMeds;
		patient.unableAssess = req.body.unableAssess;
		patient.adviceMeds = req.body.adviceMeds;
		// psycho-social
		patient.emgName = req.body.emgName;
		patient.emgRel = req.body.emgRel;
		patient.emgMobile = req.body.emgMobile;
		patient.emgHome = req.body.emgHome;
		patient.emgOffice = req.body.emgOffice;
		
		patient.careName = req.body.careName;
		patient.careRel = req.body.careRel;
		patient.careOccu = req.body.careOccu;
		patient.careMobile = req.body.careMobile;
		patient.careHome = req.body.careHome;
		patient.careOffice = req.body.careOffice;
		
		patient.accomodation = req.body.accomodation;
		patient.hospConcerns = req.body.hospConcerns;
		patient.spiritConcerns = req.body.spiritConcerns;
		patient.prefLang = req.body.prefLang;
		patient.otherLang = req.body.otherLang;
		
		
		patient.save()
		.then(patient => {
			/*let alert = res.flashMessenger.success('Patient record successfully saved');
			 alert.titleIcon = 'far fa-thumbs-up';
			 alert.canBeDismissed = true;*/
			//alertMessage.flashMessage(res, 'Patient record successfully saved', 'far fa-thumbs-up', true);
			toaster.setSuccessMessage(' ', 'Patient (' + patient.givenName + ' ' + patient.familyName + ') Master Record' +
				' Updated');
			res.render('master/master-edit-patient', {
				patient: patient,
				toaster,
				showMenu: true
			});
			/*
			 alert.addMessage('Another message');
			 alert.addMessage('Yet another message');
			 alert.addMessage('Yet another another message');
			 
			 let anotherAlert = res.flashMessenger.info('Information message');
			 anotherAlert.canBeDismissed = true;
			 res.flashMessenger.add(anotherAlert);
			 
			 anotherAlert = res.flashMessenger.danger('Dangerous message');
			 anotherAlert.canBeDismissed = true;
			 res.flashMessenger.add(anotherAlert);
			 
			 req.flash('error_msg', 'Video idea added');
			 */
			
			//res.redirect('/master/list-patients'); // call router's URL
		});
	});
});

// saves new master patient document
router.post('/add-patient', ensureAuthenticated, ensureAuthorised, (req, res) => {
	console.log('\n/User in req: ===========');
	console.log(req.user);
	EMR_User.findById(req.user._id)	// findById is Mongoose utility method
	.then((user) => { // callback function that receives user object from find
		/*console.log('\n/addPatient user found: ===========');
		 console.log(user);*/
		
		// Create empty Nursing Assessment first
		new NursingAssessmentModel({})
		.save()
		.then(assessment => {
			//console.log ('========> Assessment created:  ' + assessment._id);
			new PatientMasterModel({
				patientID: (new standardID('AAA0000')).generate(),
				nric: req.body.nric,
				user: user._id,
				nursingAssessmentID: assessment._id,
				// embed Nursing Assessment collection
				/*nursingAssessmentEmbed: assessment,*/
				familyName: req.body.familyName,
				givenName: req.body.givenName,
				dob: moment(req.body.dob, 'DD/MM/YYYY', true)
				.format(),
				gender: req.body.gender,
				weight: req.body.weight,
				height: req.body.height,
				address: req.body.address,
				postalCode: req.body.postalCode,
				mobilePhone: req.body.mobilePhone,
				homePhone: req.body.homePhone,
				officePhone: req.body.officePhone,
				
				ward: req.body.ward,
				bed: req.body.bed,
				admDate: moment(req.body.admDate, 'DD/MM/YYYY', true)
				.format(),
				policeCase: req.body.policeCase,
				admFrom: req.body.admFrom,
				modeOfArr: req.body.modeOfArr,
				accompBy: req.body.accompBy,
				caseNotes: req.body.caseNotes,
				xRaysCD: req.body.xRaysCD,
				prevAdm: req.body.prevAdm,
				condArr: req.body.condArr,
				otherCond: req.body.otherCond,
				ownMeds: req.body.ownMeds,
				unableAssess: req.body.unableAssess,
				adviceMeds: req.body.adviceMeds,
				
				emgName: req.body.emgName,
				emgRel: req.body.emgRel,
				emgMobile: req.body.emgMobile,
				emgHome: req.body.emgHome,
				emgOffice: req.body.emgOffice,
				
				careName: req.body.careName,
				careRel: req.body.careRel,
				careOccu: req.body.careOccu,
				careMobile: req.body.careMobile,
				careHome: req.body.careHome,
				careOffice: req.body.careOffice,
				
				accomodation: req.body.accomodation,
				hospConcerns: req.body.hospConcerns,
				spiritConcerns: req.body.spiritConcerns,
				prefLang: req.body.prefLang,
				otherLang: req.body.otherLang
			}).save()
			.then((newPatient) => {
				console.log('New Patient user id: ' + newPatient.user._id);
				console.log('New Patient name: ' + newPatient.givenName);
				req.session.patient = newPatient;
				toaster.setSuccessMessage(' ', 'New Patient Master Record Added');
				res.render('master/master-edit-patient', {
					patient: newPatient,
					toaster,
					showMenu: true
				});
				/*let alert = res.flashMessenger.success('New patient master record added');
				 alert.titleIcon = 'far fa-thumbs-up';
				 alert.canBeDismissed = true;*/
				//alertMessage.flashMessage(res, 'New patient master record added', 'far fa-thumbs-up', true);
				
				//res.redirect('/master/list-patients');
				// redirect will activate router while render activates specific handlebar
				/*.then(newPatient =>{
				
				 })*/
				
			})
		});
	});
	
});


// shows the master nursing assessment form
/*router.get('/show-nursing-assessment/:patientID', ensureAuthenticated, ensureAuthorised, (req, res) =>{
 res. ('master/master-edit-nursing-assessment',{
 patient: req.session.patient	// from session
 });	// handlebar!!
 });*/


// retrieves the  nursing assessment record to edit
//:patientID may be unncessary in this case because patient object is stored in session
router.get('/show-nursing-assessment/:patientID', ensureAuthenticated, (req, res) => {
	
	PatientMasterModel.findOne({
		patientID: req.params.patientID		// gets current patient
	})
	.then(retrievedPatient => {
		if(JSON.stringify(retrievedPatient.user._id) === JSON.stringify(req.user.id)) {
			NursingAssessmentModel.findById(retrievedPatient.nursingAssessmentID,{
				// new way of calling method
			}).then(assessment => {
				//let toaster = new Toaster('Retrieving nursing assessment record');
				req.session.assessment = assessment; // save to session for saving updated info
				res.render('master/master-edit-nursing-assessment', {
					assessment: assessment,
					patient: retrievedPatient,
					user: req.user,
					showMenu: true
				});
			});
		}else {
			console.log('User that created record is different from this user');
			//alertMessage.flashMessage(res, 'User that created record is different from current user', 'fas fa-exclamation',
			// true);
			toaster.setErrorMessage(' ', 'User that created record is different from this user');
			res.redirect('/master/list-patients');
		}
	});
});


// saves edited/updated nursing assessment form
router.put('/save-nursing-assessment/:patientID/:nursingAssessmentID', ensureAuthenticated, (req, res) => {
	console.log('Assessment id: ' + req.session.assessment._id);
	
	// Todo: check authorised user
	NursingAssessmentModel.findByIdAndUpdate(
		// the id of the item to find
		req.params.nursingAssessmentID,
		req.body, // will default all boolean radio buttons to false even if no selection is made
		{new: true},
		// the callback function
		(err, assessment) => {
			// Handle any possible database errors
			if (err) {
				return res.status(500).send(err);
			}
			//alertMessage.flashMessage(res, 'Nursing assessment updated', 'far fa-thumbs-up', true);
			toaster.setSuccessMessage(' ', 'Nursing Assessment Updated');
			res.render('master/master-edit-nursing-assessment', {
				assessment: assessment,
				patient: req.session.patient,
				user: req.user,
				toaster,
				showMenu: true
			});
			/*if (req.user.userType === 'staff'){
			
			} else {
				res.redirect('/student/list-patients');
			}*/
			
		}
	);
/*
	NursingAssessmentModel.findOne({
		_id: req.params.nursingAssessmentID
	})
	.then(assessment => {
		
		// Neurosensory
		assessment.mentalStatus = req.body.mentalStatus;
		assessment.mentalOthers = req.body.mentalOthers;
		assessment.orientedTo = req.body.orientedTo;
		assessment.hearing = req.body.hearing;
		assessment.hearingOthers = req.body.hearingOthers;
		assessment.hearingUnable = req.body.hearingUnable;
		assessment.vision = req.body.vision;
		assessment.visionOthers = req.body.visionOthers;
		assessment.visionUnable = req.body.visionUnable;
		assessment.speech = req.body.speech;
		
		// Respiratory
		assessment.breathingPattern = req.body.breathingPattern;
		assessment.breathingRemarks = req.body.breathingRemarks;
		assessment.breathingPresence = req.body.breathingPresence; // none required
		assessment.cough = req.body.cough;
		assessment.sputum = req.body.sputum;
		
		// Circulatory
		assessment.pulse = req.body.pulse;
		assessment.cirPresence = req.body.cirPresence;
		assessment.oedema = req.body.odema;
		assessment.extremities = req.body.extremities;
		assessment.pacemaker = req.body.pacemaker;
		assessment.paceMakerManu = req.body.paceMakerManu;
		
		// Gastrointestinal
		assessment.dietType = req.body.dietType;
		assessment.dietOthers = req.body.dietOthers;
		assessment.fluidRestriction = req.body.fluidRestriction;
		assessment.fluidSpecify = req.body.fluidSpecify;
		assessment.fluidUnable = req.body.fluidUnable;
		assessment.oralCavity = req.body.oralCavity;
		assessment.oralCavityPresence = req.body.oralCavityPresence;
		assessment.oralCavityOthers = req.body.oralCavityOthers;
		
		// Elimination
		assessment.bowel = req.body.bowel;		// none required
		assessment.bowelOthers = req.body.bowelOthers;
		assessment.urinaryAppearance = req.body.urinaryAppearance;
		assessment.urinaryRemarks = req.body.urinaryRemarks;
		assessment.urinaryPresence = req.body.urinaryPresence;	// none required
		assessment.urinaryOthers = req.body.urinaryOthers;
		assessment.adaptiveAids = req.body.adaptiveAids;		// none required
		assessment.catType = req.body.catType;
		assessment.catSize = req.body.catSize;
		assessment.dayLastChanged = req.body.dayLastChanged;
		
		// Sleep
		assessment.sleep = req.body.sleep;
		assessment.sleepSpecify = req.body.sleepSpecify;
		
		// Pain Assessment
		assessment.painPresent = req.body.painPresent;
		assessment.painScale = req.body.painScale;
		assessment.behavioural = req.body.behavioural;
		assessment.onset = req.body.onset;
		assessment.location = req.body.location;
		assessment.characteristic = req.body.characteristic;
		assessment.symptoms = req.body.symptoms;
		assessment.factors = req.body.factors;
		assessment.treatment = req.body.treatment;
		
		assessment.save().then((assessment) => {
			alertMessage.flashMessage(res, 'Nursing assessment updated', 'far fa-thumbs-up', true);
			res.render('master/master-edit-nursing-assessment', {
				assessment: assessment,
				patient: req.session.patient,
				user: req.user
			});
		});
	});
*/
});

// Show Single Story
router.get('/show/:id', (req, res) => {
	Story.findOne({
		_id: req.params.id
	})
	.populate('user')
	.populate('comments.commentUser')
	.then(story => {
		if(story.status === 'public') {
			res.render('stories/show', {
				story: story
			});
		} else {
			if(req.user) {		// check if user is logged in
				if(req.user.id === story.user._id) {
					res.render('stories/show', {
						story: story
					});
				} else {
					res.redirect('/stories');
				}
			} else {
				res.redirect('/stories');
			}
		}
	});
});

router.get('/io', ensureAuthenticated, ensureAuthorised, (req, res) => {
	MasterIO.find({ patientID: req.session.patient.patientID }).sort({'datetime':1}).then(newIO => {
		MasterEnteral.find({ patientID: req.session.patient.patientID }).sort({'datetime':1}).then(newenteral => {
			MasterIV.find({ patientID: req.session.patient.patientID }).sort({'datetime':1}).then(newiv => {	
				MasterOutput.find({ patientID: req.session.patient.patientID }).sort({'datetime':1}).then(newoutput => {			

					iosample = [];
					iosampleDate = [];
					let ioFlow = Object.assign([], newIO);
					let enteralFlow = Object.assign([], newenteral);
					let ivFlow = Object.assign([], newiv);
					let outputFlow = Object.assign([], newoutput);
					ioCount = -1;
					enteralCount = -1;
					ivCount = -1;
					outputCount = -1;
					ionoRecord = 'No existing record';

					newIO.forEach(io => {
						if (!(iosample.includes(io.datetime))) {
							iosample.push(io.datetime);
							iosampleDate.push(io.date);
						}
					});

					newenteral.forEach(enteral => {
						if (!(iosample.includes(enteral.datetime))){
							iosample.push(enteral.datetime);
							iosampleDate.push(enteral.date);
						}
					});

					newiv.forEach(iv => {
						if (!(iosample.includes(iv.datetime))) {
							iosample.push(iv.datetime);
							iosampleDate.push(iv.date);
						}
					});

					newoutput.forEach(output => {
						if (!(iosample.includes(output.datetime))) {
							iosample.push(output.datetime);
							iosampleDate.push(output.date);
						}
					});
		
						
					iosample.sort();
					iosampleDate.sort();

					for (i = 0; i < iosample.length; i++) {
						

						//Counter for empty data
						//.length here refers to last index of the array
						if (ioCount !== (ioFlow.length - 1)) {
							ioCount++;
						}

						if (enteralCount !== (enteralFlow.length - 1)) {
							enteralCount++;
						}

						if (ivCount !== (ivFlow.length - 1)) {
							ivCount++;
						}

						if (outputCount !== (outputFlow.length - 1)) {
							outputCount++;
						}
						

						//Insert empty data when value doesnt match
						//Count here does the index count of flow array
						if(ioFlow !='') 
						{
							if (iosample[i] < ioFlow[ioCount].datetime) {
								ioFlow.splice(ioCount, 0, {datetime: ''});
							} else if (iosample[i] > ioFlow[ioCount].datetime) {
								ioFlow.splice(ioCount + 1, 0, {datetime: ''});
							}
						} 
						else
						{
							ioFlow.push({datetime: '', intakefood: ionoRecord});
						}

						if(enteralFlow !='') 
						{
							if (iosample[i] < enteralFlow[enteralCount].datetime) {
								enteralFlow.splice(enteralCount, 0, {datetime: ''});
							} else if (iosample[i] > enteralFlow[enteralCount].datetime) {
								enteralFlow.splice(enteralCount + 1, 0, {datetime: ''});
							}
						} 
						else
						{
							enteralFlow.push({datetime: '', enteralfeed: ionoRecord});
						}

						if(ivFlow !='') 
						{
							if (iosample[i] < ivFlow[ivCount].datetime) {
								ivFlow.splice(ivCount, 0, {datetime: ''});
							} else if (iosample[i] > ivFlow[ivCount].datetime) {
								ivFlow.splice(ivCount + 1, 0, {datetime: ''});
							}
						} 
						else 
						{
							ivFlow.push({datetime: '', ivflush: ionoRecord});
						}

						if(outputFlow !='')
						{
							if (iosample[i] < outputFlow[outputCount].datetime) {
								outputFlow.splice(outputCount, 0, {datetime: ''});
							} else if (iosample[i] > outputFlow[outputCount].datetime) {
								outputFlow.splice(outputCount + 1, 0, {datetime: ''});
							}
						}
						else 
						{
							outputFlow.push({datetime: '', otherass: ionoRecord});
						}
					};

					res.render('charts/master/charts-io', {
						iodateVal: iosample,
						ioFlow: ioFlow,
						enteralFlow: enteralFlow,
						ivFlow: ivFlow,
						outputFlow:outputFlow,
						newIO: newIO,
						newenteral: newenteral,
						newiv: newiv,
						newoutput: newoutput,
						patient: req.session.patient,
						showMenu: true
          			})
				})
			})
		});
	})
})

// open route to IO page
// router.get('/io', ensureAuthenticated, ensureAuthorised, (req, res) => {
// 	MasterIO.find({ patientID: req.session.patient.patientID }).then(newIO => {
// 		MasterEnteral.find({ patientID: req.session.patient.patientID }).then(newenteral => {
// 			MasterIV.find({ patientID: req.session.patient.patientID }).then(newiv => {	
// 				MasterOutput.find({ patientID: req.session.patient.patientID }).then(newoutput => {			
		
		
// 		res.render('charts/master/charts-io', {
// 		newIO: newIO,
// 		newenteral: newenteral,
// 		newiv: newiv,
// 		newoutput: newoutput,
// 		patient: req.session.patient,
// 		showMenu: true

// 						})
// 					})
// 				})
// 			});
// 		})
// 	})


//add io info
router.post('/add-io', ensureAuthenticated, ensureAuthorised, (req, res) => {
	ioID = (new standardID('AAA0000')).generate();
	datetime = moment(req.body.dateIO, 'DD/MM/YYYY').format('MM/DD/YYYY') + " " + req.body.timeIO;
	
	new MasterIO({
		patientID: req.session.patient.patientID,
		ioID: ioID,
		date:	moment(req.body.dateIO, 'DD/MM/YYYY').format('YYYY-MM-DD'),
		time: req.body.timeIO,
		datetime: datetime,
		intakefood: req.body.intakefood,
		foodtype: req.body.foodtype,
		foodportion: req.body.foodportion,
		fluidtype: req.body.fluidtype,
		fluidportion: req.body.fluidportion,

	}).save();

	res.redirect('/master/io');
})

//Delete IO information
router.delete('/del-io/:ioID', ensureAuthenticated, ensureAuthorised, (req, res) => {
	MasterIO.deleteOne({ioID: req.params.ioID}, function(err) {
		if (err) {
			console.log('cannot delete ipo details');
		}
	});
	res.redirect('/master/io');
})

//edit IO informations
router.put('/edit-io/:ioID', ensureAuthenticated, ensureAuthorised, (req,res) => {
	datetime = moment(req.body.dateIO, 'DD/MM/YYYY').format('MM/DD/YYYY') + " " + req.body.timeIO;

	MasterIO.findOne({ ioID: req.params.ioID }).then(editIO => {
		editIO.date = moment(req.body.dateIO, 'DD/MM/YYYY').format('YYYY-MM-DD'),
		editIO.time = req.body.timeIO,
		editIO.datetime = datetime,
		editIO.intakefood = req.body.intakefood,
		editIO.foodtype = req.body.foodtype,
		editIO.foodportion = req.body.foodportion,
		editIO.fluidtype = req.body.fluidtype,
		editIO.fluidportion = req.body.fluidportion,

		editIO.save();
	});
	res.redirect('/master/io');
})

//get single io info
router.get('/io/:ioID', ensureAuthenticated, ensureAuthorised, (req, res) => {
	MasterIO.find({ patientID: req.session.patient.patientID }).sort({'datetime':1}).then(newIO => {
		MasterIO.findOne({ ioID: req.params.ioID }).then(editIO => {

			editIO.date = moment(editIO.date, 'YYYY-MM-DD').format('DD/MM/YYYY');
			res.render('charts/master/charts-io', {
				newIO: newIO,
				editIO: editIO,
				patient: req.session.patient,
				showMenu: true			
			})
		})
	})
})

//Get single output info
router.get('/output/:outputID', ensureAuthenticated, ensureAuthorised, (req, res) => {
	MasterOutput.find({ patientID: req.session.patient.patientID }).sort({'datetime':1}).then(newoutput => {
		MasterOutput.findOne({ outputID: req.params.outputID }).then(editoutput => {

			//Changes date format to DD/MM/YYYY
			editoutput.date = moment(editoutput.date, 'YYYY-MM-DD').format('DD/MM/YYYY');
			res.render('charts/master/charts-io', {
				newoutput: newoutput,
				editoutput: editoutput,
				patient: req.session.patient,
				showMenu: true	
      		})
    	})
  	})
})

//add output info
router.post('/add-output', ensureAuthenticated, ensureAuthorised, (req, res) => {
	outputID = (new standardID('AAA0000')).generate();
	datetime = moment(req.body.dateoutput, 'DD/MM/YYYY').format('MM/DD/YYYY') + " " + req.body.timeoutput;


	new MasterOutput({
		patientID: req.session.patient.patientID,
		outputID: outputID,
		date: moment(req.body.dateoutput, 'DD/MM/YYYY').format('YYYY-MM-DD'),
		time: req.body.timeoutput,
		datetime: datetime,
		urineamt: req.body.urineamt,
		urineass: req.body.urineass,
		stoolamt: req.body.stoolamt,
		stoolass: req.body.stoolass,
		vomitamt: req.body.vomitamt,
		vomitass: req.body.vomitass,
		bloodamt: req.body.bloodamt,
		diaper: req.body.diaper,
		otheramt: req.body.otheramt,
		otherass: req.body.otherass,

	}).save();

	res.redirect('/master/io');
})

//Delete output information
router.delete('/del-output/:outputID', ensureAuthenticated, ensureAuthorised, (req, res) => {
	MasterOutput.deleteOne({outputID: req.params.outputID}, function(err) {
		if (err) {
			console.log('cannot delete Output details');
		}
	});
	res.redirect('/master/io');
})

//open route to braden page
router.get('/braden', ensureAuthenticated, ensureAuthorised, (req, res) => {
	MasterBraden.find({ patientID: req.session.patient.patientID}).then(newBraden => {
		res.render('charts/master/charts-braden', {
			newBraden: newBraden,
			patient: req.session.patient,
			showMenu: true	
		})
  	})
})

//get single braden info
router.get('/braden/:bradenID', ensureAuthenticated, ensureAuthorised, (req, res) => {

	MasterBraden.find({ patientID: req.session.patient.patientID }).then(newBraden => {
		MasterBraden.findOne({ bradenID: req.params.bradenID }).then(editBraden => {
			res.render('charts/master/charts-braden', {
				newBraden: newBraden,
				editBraden: editBraden,
				patient: req.session.patient,
				showMenu: true			
			})
		})
	})
})

//add braden info
router.post('/add-braden', ensureAuthenticated, ensureAuthorised, (req, res) => {
		bradenID = (new standardID('AAA0000')).generate();
		datetime = moment(req.body.dateBraden, 'DD/MM/YYYY').format('MM/DD/YYYY') + " ";

		total = parseInt(req.body.sensePerc.slice(-1)) 
		+ parseInt(req.body.moisture.slice(-1)) 
		+ parseInt(req.body.activity.slice(-1))
		+ parseInt(req.body.mobility.slice(-1)) 
		+ parseInt(req.body.nutrition.slice(-1)) 
		+ parseInt(req.body.fns.slice(-1));

		splitSensePerc = removeNumber.removeNumberFunction(req.body.sensePerc);
		splitMoisture = removeNumber.removeNumberFunction(req.body.moisture);
		splitActivity = removeNumber.removeNumberFunction(req.body.activity);
		splitMobility = removeNumber.removeNumberFunction(req.body.mobility);
		splitNutrition = removeNumber.removeNumberFunction(req.body.nutrition);
		splitFns = removeNumber.removeNumberFunction(req.body.fns);


		new MasterBraden({
			patientID: req.session.patient.patientID,
			bradenID: bradenID,
			date: req.body.dateBraden,
			datetime: datetime,
			sensePercSplit: splitSensePerc,
			moistureSplit: splitMoisture,
			activitySplit: splitActivity,
			mobilitySplit: splitMobility,
			nutritionSplit: splitNutrition,
			fnsSplit: splitFns,
			total: total,

			sensePerc: req.body.sensePerc,
			activity:	req.body.activity,
			moisture: req.body.moisture,
			mobility: req.body.mobility,
			nutrition: req.body.nutrition,
			fns: req.body.fns,

			


		}).save();
	
		res.redirect('/master/braden');
})

//Delete braden information
router.delete('/del-braden/:bradenID', ensureAuthenticated, ensureAuthorised, (req, res) => {
	MasterBraden.deleteOne({bradenID: req.params.bradenID}, function(err) {
		if (err) {
			console.log("cannot delete braden record");
		}
	});
	res.redirect('/master/braden');
})

//Edit braden information
router.put('/edit-braden/:bradenID', ensureAuthenticated, ensureAuthorised, (req,res) => {
	datetime = moment(req.body.dateBraden, 'DD/MM/YYYY').format('MM/DD/YYYY') + " ";
	total = parseInt(req.body.sensePerc.slice(-1)) + parseInt(req.body.moisture.slice(-1)) + parseInt(req.body.activity.slice(-1))+ parseInt(req.body.mobility.slice(-1)) 
		+ parseInt(req.body.nutrition.slice(-1)) + parseInt(req.body.fns.slice(-1));

	splitSensePerc = removeNumber.removeNumberFunction(req.body.sensePerc);
	splitMoisture = removeNumber.removeNumberFunction(req.body.moisture);
	splitActivity = removeNumber.removeNumberFunction(req.body.activity);
	splitMobility = removeNumber.removeNumberFunction(req.body.mobility);
	splitNutrition = removeNumber.removeNumberFunction(req.body.nutrition);
	splitFns = removeNumber.removeNumberFunction(req.body.fns);

	MasterBraden.findOne({ bradenID: req.params.bradenID }).then(editBraden => {
		editBraden.sensePercSplit = splitSensePerc,
		editBraden.moistureSplit = splitMoisture,
		editBraden.activitySplit = splitActivity,
		editBraden.mobilitySplit = splitMobility,
		editBraden.nutritionSplit = splitNutrition,
		editBraden.fnsSplit = splitFns,

		editBraden.date = req.body.dateBraden,
		editBraden.datetime = datetime,
		editBraden.sensePerc = req.body.sensePerc,
		editBraden.moisture = req.body.moisture,
		editBraden.activity = req.body.activity,
		editBraden.mobility = req.body.mobility,
		editBraden.nutrition = req.body.nutrition,
		editBraden.fns = req.body.fns,
		editBraden.total = total,

		editBraden.save();
	});
	res.redirect('/master/braden');
})

// Open HistoryTakng page
router.get('/HistoryTaking', ensureAuthenticated, ensureAuthorised, (req, res) => {
	MasterHistory.find({user:{'$ne':req.user.id}, masterpatientID: req.session.patient.patientID})
	.then(newHistory => {//(other record)
		MasterHistory.findOne({ patientID: req.session.patient.patientID})
		.then(newOtherHistory =>{ //(your own record)
			// console.log("Yikes: " + newOtherHistory.length);
			// console.log("Yikes: " + req.user);
			MasterHistory.findOne({patientID: req.session.patient.patientID})
			.then(editHistory => {
			// if(editHistory == null){
			// 	res.render('HistoryTaking/master/add_HistoryTaking', {
			// 		newHistory: newHistory,
			// 		editHistory: editHistory,
			// 		patient: req.session.patient,
			// 		currentName: req.user.firstName,
			// 		//newOtherHistory:newOtherHistory,
			// 		showMenu: true
			// 	});
			//}
			// else
			// {
				//console.log("History is not empty: "+editHistory);
				res.render('HistoryTaking/master/add_HistoryTaking', {
					newHistory: newHistory,
					editHistory: editHistory,
					checkifEmpty: true,
					patient: req.session.patient,
					currentName: req.user.firstName,
					newOtherHistory:newOtherHistory,
					showMenu: true
				});
			//}
	 		})
		})
	})
})

//Add HistoryTaking
router.post('/add-history', ensureAuthenticated, ensureAuthorised, (req, res) => {
	historyId = (new standardID('AAA0000')).generate();
	new MasterHistory({
		user: req.user.id,
		by: req.user.firstName,
		masterpatientID: req.session.patient.patientID,
		patientID: req.session.patient.patientID,
		chiefComp: req.body.chiefComp,
		historyPresent: req.body.historyPresent,
		allergy: req.body.allergy,
		medicalH: req.body.medicalH,
		surgicalH: req.body.surgicalH,
		familyH: req.body.familyH,
		socialH: req.body.socialH,
		travelH: req.body.travelH,
		historyId: historyId
	}).save();
		res.redirect('/master/HistoryTaking');
})

	
//One HistoryTaking by ID
router.get('/HistoryTaking/:historyId/:name', ensureAuthenticated, ensureAuthorised, (req,res) => {
	MasterHistory.find({ user:{'$ne':req.user.id}, masterpatientID: req.session.patient.patientID}).then(newHistory => {
		MasterHistory.findOne({ patientID: req.session.patient.patientID})
		.then(newOtherHistory =>{//(your own record) you need this (if you only put in the /HistoryTaking, this route do not know the newOtherHistory)
			MasterHistory.findOne({ historyId: req.params.historyId }).then(editHistory =>{		
				var name = req.params.name;
				res.render('HistoryTaking/master/add_HistoryTaking',{
					newHistory:newHistory,
					editHistory: editHistory,
					patient: req.session.patient,
					checkifEmpty: false,
					currentName: req.user.firstName,
					newOtherHistory: newOtherHistory,	
					by: name,
					showMenu: true
				})
			});
		});
	})
})

//Edit the HistoryTaking
router.put('/edit-history/:historyId/:name', ensureAuthenticated, ensureAuthorised, (req,res) => {
	MasterHistory.findOne({ patientID:  req.session.patient.patientID,historyId: req.params.historyId}).then(editHistory => {
		editHistory.chiefComp = req.body.chiefComp,
		editHistory.historyPresent = req.body.historyPresent,
		editHistory.allergy = req.body.allergy,
		editHistory.medicalH = req.body.medicalH,
		editHistory.surgicalH = req.body.surgicalH,
		editHistory.masterpatientID = req.session.patient.patientID,
		editHistory.patientID = req.session.patient.patientID,
		editHistory.familyH = req.body.familyH,
		editHistory.socialH = req.body.socialH,
		editHistory.travelH = req.body.travelH

		editHistory.save();
	});
	res.redirect("/master/HistoryTaking");
})
	

// editHistory
// router.put('/edit-history/:historyId', ensureAuthenticated, ensureAuthorised, (req,res) => {

// 	MasterHistory.findOne({ historyId: req.params.historyId}).then(editHistory => {
// 		editHistory.chiefComp = req.body.chiefComp,
// 		editHistory.historyPresent = req.body.chiefComp,
// 		editHistory.allergy = req.body.allergy,
// 		editHistory.medicalH = req.body.medicalH,
// 		editHistory.surgicalH = req.body.surgicalH,
// 		editHistory.familyH = req.body.familyH,
// 		editHistory.socialH = req.body.socialH,
// 		editHistory.travelH = req.body.travelH

// 		editHistory.save();
// 	});
// 	res.redirect("/master/edit-history");
// })


//HAVENT UPDATE HISTORY
// router.get('/edit-history/:historyId', ensureAuthenticated, (req, res) => {
	
// 	MasterHistory.findOne({
// 		patientID: req.params.patientID		// gets current patient
// 	})
// 	.then(retrievedPatient => {
// 		if(JSON.stringify(retrievedPatient.user._id) === JSON.stringify(req.user.id)) {
// 			NursingAssessmentModel.findById(retrievedPatient.nursingAssessmentID,{
// 				// new way of calling method
// 			}).then(assessment => {
// 				//let toaster = new Toaster('Retrieving nursing assessment record');
// 				req.session.assessment = assessment; // save to session for saving updated info
// 				res.render('master/HistoryTaking', {
// 					assessment: assessment,
// 					patient: retrievedPatient,
// 					user: req.user,
// 					showMenu: true
// 				});
// 			});
// 		}else {
// 			console.log('User that created record is different from this user');
// 			//alertMessage.flashMessage(res, 'User that created record is different from current user', 'fas fa-exclamation',
// 			// true);
// 			toaster.setErrorMessage(' ', 'User that created record is different from this user');
// 			res.redirect('/master/list-patients');
// 		}
// 	});
// });


// // saves edited/updated History form
// router.put('/edit-history/:historyId/:patientID/:nursingAssessmentID', ensureAuthenticated, (req, res) => {
// 	console.log('Assessment id: ' + req.session.assessment._id);
	
// 	// Todo: check authorised user
// 	MasterHistory.findByIdAndUpdate(
// 		// the id of the item to find
// 		req.params.nursingAssessmentID,
// 		req.body, // will default all boolean radio buttons to false even if no selection is made
// 		{new: true},
// 		// the callback function
// 		(err, assessment) => {
// 			// Handle any possible database errors
// 			if (err) {
// 				return res.status(500).send(err);
// 			}
// 			//alertMessage.flashMessage(res, 'Nursing assessment updated', 'far fa-thumbs-up', true);
// 			toaster.setSuccessMessage(' ', 'History Taking Updated');
// 			res.render('master/HistoryTaking', {
// 				assessment: assessment,
// 				patient: req.session.patient,
// 				user: req.user,
// 				toaster,
// 				showMenu: true
// 			});
// 			/*if (req.user.userType === 'staff'){
			
// 			} else {
// 				res.redirect('/student/list-patients');
// 			}*/
			
// 		}
// 	);
// });

//END HISTORY


//open fall page
router.get('/fall', ensureAuthenticated, ensureAuthorised, (req, res) => {
	MasterFall.find({ patientID: req.session.patient.patientID }).then(newFall => {
		res.render('charts/master/charts-fall', {
			newFall: newFall,
			patient: req.session.patient,
			showMenu: true
		})
	})
})


//get single fall info
router.get('/fall/:fallID', ensureAuthenticated, ensureAuthorised, (req, res) => {

	MasterFall.find({ patientID: req.session.patient.patientID }).then(newFall => {
		MasterFall.findOne({ fallID: req.params.fallID }).then(editFall => {
			res.render('charts/master/charts-fall', {
				newFall: newFall,
				editFall: editFall,
				patient: req.session.patient,
				showMenu: true			
			})
		})
	})
})


//add fall info
router.post('/add-fall', ensureAuthenticated, ensureAuthorised, (req, res) => {
	fallid = (new standardID('AAA0000')).generate();
	datetime = moment(req.body.dateFall, 'DD/MM/YYYY').format('MM/DD/YYYY') + " ";

	totalmf = parseInt(req.body.history.slice(-2))
	+ parseInt(req.body.secondary.slice(-2)) 
	+ parseInt(req.body.ambu.slice(-2))
	+ parseInt(req.body.ivhl.slice(-2)) 
	+ parseInt(req.body.gait.slice(-2)) 
	+ parseInt(req.body.mental.slice(-2));
	//splitting to display only the sting value w/o (+0)
	splitHistory = removeNumber.removeNumberFunction(req.body.history);
	splitSecondary = removeNumber.removeNumberFunction(req.body.secondary);	
	splitAmbu = removeNumber.removeNumberFunction(req.body.ambu);
	splitIvhl = removeNumber.removeNumberFunction(req.body.ivhl);
	splitGait = removeNumber.removeNumberFunction(req.body.gait);
	splitMental = removeNumber.removeNumberFunction(req.body.mental);
	
	new MasterFall({
		patientID: req.session.patient.patientID,
		fallID: fallid,
		date: req.body.dateFall,
		datetime: datetime,

		history: req.body.history,
		secondary: req.body.secondary,
		ivhl: req.body.ivhl,
		gait: req.body.gait,
		mental: req.body.mental,
		ambu: req.body.ambu,
		
		historySplit: splitHistory,
		secondarySplit: splitSecondary,
		ambuSplit: splitAmbu,
		ivhlSplit: splitIvhl,
		gaitSplit: splitGait,
		mentalSplit: splitMental,


		totalmf: totalmf,


	}).save();

	res.redirect('/master/fall');
})
//Remove function
var removeNumber = {
    removeNumberFunction: function(str) {
		var i;
		var text = "";
        var res = str.split(" ");
		for (i = 0; i < res.length; i++) {
			
			if (!(res[i] == "+" || isNaN(res[i]) == false || res[i].charAt(0) == "+")){
			text += res[i] + " ";
			}
		}
		
		return text;
    }
};

//Delete fall information
router.delete('/del-fall/:fallID', ensureAuthenticated, ensureAuthorised, (req, res) => {
	MasterFall.deleteOne({fallID: req.params.fallID}, function(err) {
		if (err) {
			console.log("cannot delete morse fall record");
		}
	});
	res.redirect('/master/fall');
})

//Edit fall information
router.put('/edit-fall/:fallID', ensureAuthenticated, ensureAuthorised, (req,res) => {
	datetime = moment(req.body.dateFall, 'DD/MM/YYYY').format('MM/DD/YYYY') + " ";

		totalmf = parseInt(req.body.history.slice(-2))
		+ parseInt(req.body.secondary.slice(-2)) 
		+ parseInt(req.body.ambu.slice(-2))
		+ parseInt(req.body.ivhl.slice(-2)) 
		+ parseInt(req.body.gait.slice(-2)) 
		+ parseInt(req.body.mental.slice(-2));

		splitHistory = removeNumber.removeNumberFunction(req.body.history);
		splitSecondary = removeNumber.removeNumberFunction(req.body.secondary);	
		splitAmbu = removeNumber.removeNumberFunction(req.body.ambu);
		splitIvhl = removeNumber.removeNumberFunction(req.body.ivhl);
		splitGait = removeNumber.removeNumberFunction(req.body.gait);
		splitMental = removeNumber.removeNumberFunction(req.body.mental);

		MasterFall.findOne({ fallID: req.params.fallID }).then(editFall => {
			editFall.date = req.body.dateFall,
			editFall.datetime = datetime,
			editFall.history = req.body.history,
			editFall.secondary = req.body.secondary,
			editFall.ambu = req.body.ambu,
			editFall.ivhl = req.body.ivhl,
			editFall.gait = req.body.gait,
			editFall.mental = req.body.mental,

			editFall.historySplit = splitHistory,
			editFall.secondarySplit = splitSecondary,
			editFall.ambuSplit = splitAmbu,
			editFall.ivhlSplit = splitIvhl,
			editFall.gaitSplit = splitGait,
			editFall.mentalSplit = splitMental,

			editFall.totalmf = totalmf
		
			editFall.save();
	});
	res.redirect('/master/fall');
})

//Edit output info
router.put('/edit-output/:outputID', ensureAuthenticated, ensureAuthorised, (req, res) => {
	datetime = moment(req.body.dateoutput, 'DD/MM/YYYY').format('MM/DD/YYYY') + " " + req.body.timeoutput;

	MasterOutput.findOne({ outputID: req.params.outputID }).then(editoutput => {

		editoutput.date = moment(req.body.dateoutput, 'DD/MM/YYYY').format('YYYY-MM-DD'),
		editoutput.time = req.body.timeoutput,
		editoutput.datetime = datetime,
		editoutput.urineamt = req.body.urineamt,
		editoutput.urineass = req.body.urineass,
		editoutput.stoolamt = req.body.stoolamt,
		editoutput.stoolass = req.body.stoolass,
		editoutput.vomitamt = req.body.vomitamt,
		editoutput.vomitass = req.body.vomitass,
		editoutput.bloodamt = req.body.bloodamt,
		editoutput.diaper = req.body.diaper,
		editoutput.otheramt = req.body.otheramt,
		editoutput.otherass = req.body.otherass,


		editoutput.save();
	})
	res.redirect('/master/io');
})

//Get single enteral info
router.get('/enteral/:enteralID', ensureAuthenticated, ensureAuthorised, (req, res) => {
	MasterEnteral.find({ patientID: req.session.patient.patientID }).sort({'datetime':1}).then(newenteral => {
		MasterEnteral.findOne({ enteralID: req.params.enteralID }).then(editenteral => {

			//Changes date format to DD/MM/YYYY
			editenteral.date = moment(editenteral.date, 'YYYY-MM-DD').format('DD/MM/YYYY');
			res.render('charts/master/charts-io', {
				newenteral: newenteral,
				editenteral: editenteral,
      		})
    	})
  	})
})

//add enteral info
router.post('/add-enteral', ensureAuthenticated, ensureAuthorised, (req, res) => {
	enteralID = (new standardID('AAA0000')).generate();
	datetime = moment(req.body.dateenteral, 'DD/MM/YYYY').format('MM/DD/YYYY') + " " + req.body.timeenteral;


	new MasterEnteral({
		patientID: req.session.patient.patientID,
		enteralID: enteralID,
		date: moment(req.body.dateenteral, 'DD/MM/YYYY').format('YYYY-MM-DD'),
		time: req.body.timeenteral,
		datetime: datetime,
		enteralfeed: req.body.enteralfeed,
		formula: req.body.formula,
		feedamt: req.body.feedamt,
		flush: req.body.flush,

	}).save();

	res.redirect('/master/io');
})

//Delete Enteral information
router.delete('/del-enteral/:enteralID', ensureAuthenticated, ensureAuthorised, (req, res) => {
	MasterEnteral.deleteOne({enteralID: req.params.enteralID}, function(err) {
		if (err) {
			console.log('cannot delete Enteral details');
		}
	});
	res.redirect('/master/io');
})

//Edit Enteral info
router.put('/edit-enteral/:enteralID', ensureAuthenticated, ensureAuthorised, (req, res) => {
	datetime = moment(req.body.dateenteral, 'DD/MM/YYYY').format('MM/DD/YYYY') + " " + req.body.timeenteral;

	MasterEnteral.findOne({ enteralID: req.params.enteralID }).then(editenteral => {
		editenteral.date = moment(req.body.dateenteral, 'DD/MM/YYYY').format('YYYY-MM-DD'),
		editenteral.time = req.body.timeenteral,
		editenteral.datetime = datetime,
		editenteral.enteralfeed = req.body.enteralfeed,
		editenteral.formula = req.body.formula,
		editenteral.feedamt = req.body.feedamt,
		editenteral.flush = req.body.flush,

		editenteral.save();
	})
	res.redirect('/master/io');
})

//Get single iv info
router.get('/iv/:ivID', ensureAuthenticated, ensureAuthorised, (req, res) => {
	MasterIV.find({ patientID: req.session.patient.patientID }).sort({'datetime':1}).then(newiv => {
		MasterIV.findOne({ ivID: req.params.ivID }).then(editiv => {

			//Changes date format to DD/MM/YYYY
			editiv.date = moment(editiv.date, 'YYYY-MM-DD').format('DD/MM/YYYY');
			res.render('charts/master/charts-io', {
				newiv: newiv,
				editiv: editiv,
      		})
    	})
  	})
})

//add iv info
router.post('/add-iv', ensureAuthenticated, ensureAuthorised, (req, res) => {
	ivID = (new standardID('AAA0000')).generate();
	datetime = moment(req.body.dateiv, 'DD/MM/YYYY').format('MM/DD/YYYY') + " " + req.body.timeiv;


	new MasterIV({
		patientID: req.session.patient.patientID,
		ivID: ivID,
		date: moment(req.body.dateiv, 'DD/MM/YYYY').format('YYYY-MM-DD'),
		time: req.body.timeiv,
		datetime: datetime,
		coninf: req.body.coninf,
		conamt: req.body.conamt,
		intinf: req.body.intinf,
		amtinf: req.body.amtinf,
		ivflush: req.body.ivflush,

	}).save();

	res.redirect('/master/io');
})

//Delete iv information
router.delete('/del-iv/:ivID', ensureAuthenticated, ensureAuthorised, (req, res) => {
	MasterIV.deleteOne({ivID: req.params.ivID}, function(err) {
		if (err) {
			console.log('cannot delete IV details');
		}
	});
	res.redirect('/master/io');
})

//Edit IV info
router.put('/edit-iv/:ivID', ensureAuthenticated, ensureAuthorised, (req, res) => {
	datetime = moment(req.body.dateiv, 'DD/MM/YYYY').format('MM/DD/YYYY') + " " + req.body.timeiv;

	MasterIV.findOne({ ivID: req.params.ivID }).then(editiv => {

		editiv.datetime = datetime,
		editiv.date = moment(req.body.dateiv, 'DD/MM/YYYY').format('YYYY-MM-DD'),
		editiv.time = req.body.timeiv,
		editiv.coninf = req.body.coninf,
		editiv.conamt = req.body.conamt,
		editiv.intinf = req.body.intinf,
		editiv.amtinf = req.body.amtinf,
		editiv.ivflush = req.body.ivflush,


		editiv.save();
	})
	res.redirect('/master/io');
})

//Updates chart according to date specified
router.get('/chart/update', ensureAuthenticated, ensureAuthorised, (req, res) => {
	var fromDate = req.query.fromDate;
	var today = new Date();
	var dd = String(today.getDate()).padStart(2, '0');
	var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
	var yyyy = today.getFullYear();
	var today = yyyy + '-' + mm + '-' + dd;

	//Check for fromDate value
	if (req.query.fromDate == "" || req.query.fromDate == null) {
		var fromDate = req.query.fromDate;
	} else {
		var fromDate = moment(req.query.fromDate, 'DD/MM/YYYY').format('YYYY-MM-DD');
	}

	//Check for toDate value
	if (req.query.toDate == "" || req.query.toDate == null) {
		var toDate = today;
	} else {
		var toDate = moment(req.query.toDate, 'DD/MM/YYYY').format('YYYY-MM-DD');
	}

	MasterVital.find({ date: { $gte: fromDate, $lte: toDate }, patientID: req.session.patient.patientID }, {datetime: 1, temp: 1, sbp: 1, dbp: 1, resp: 1, heartRate: 1,  _id: 0})
		.sort({"datetime": 1}).then(vitalInfo => {
			MasterPain.find({ date: { $gte: fromDate, $lte: toDate }, patientID: req.session.patient.patientID }, {datetime: 1, painScore: 1, _id: 0})
				.sort({"datetime": 1}).then(painInfo => {
					MasterOxygen.find({ date: { $gte: fromDate, $lte: toDate }, patientID: req.session.patient.patientID }, {datetime: 1, spo2: 1, _id: 0})
						.sort({"datetime": 1}).then(o2Info => {
						res.send({vital: vitalInfo, pain: painInfo, oxygen: o2Info});
			})
		})
	})
})

//View chart (temperature, heart rate/oxygen, and blood pressure only for now)
router.get('/chart', ensureAuthenticated, ensureAuthorised, (req, res) => {
	var today = new Date();
	var dd = String(today.getDate()).padStart(2, '0');
	var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
	var yyyy = today.getFullYear();
	var today = yyyy + '-' + mm + '-' + dd;
	
	MasterVital.find({ date: { $gte: "", $lte: today }, patientID: req.session.patient.patientID })
		.sort({"datetime": 1}).then(info => {
			MasterPain.find({ date: {$gte: "", $lte: today }, patientID: req.session.patient.patientID })
			.sort({"datetime": 1}).then(painInfo => {
				MasterOxygen.find({date: { $gte: "", $lte: today }, patientID: req.session.patient.patientID })
				.sort({"datetime": 1}).then(oxyInfo => {
					res.render('charts/master/charts', {
						oxyVal: oxyInfo,
						painVal: painInfo,
						chartVal: info,
						patient: req.session.patient,
						showMenu: true
				})
			});
		})
	})
})

//Vital chart information
router.get('/vital', ensureAuthenticated, ensureAuthorised, (req, res) => {
	MasterVital.find({ patientID: req.session.patient.patientID }).sort({'datetime':1}).then(vitalData => {
		MasterPain.find({ patientID: req.session.patient.patientID }).sort({'datetime':1}).then(painData => {
			MasterOxygen.find({ patientID: req.session.patient.patientID }).sort({'datetime':1}).then(oxyData => {
				MasterWH.find({ patientID: req.session.patient.patientID }).sort({'datetime':1}).then(whData => {

					sample = [];
					sampleDate = [];
					let vitalFlow = Object.assign([], vitalData);
					let painFlow = Object.assign([], painData);
					let oxyFlow = Object.assign([], oxyData);
					let whFlow = Object.assign([], whData);
					vitalCount = -1;
					painCount = -1;
					oxyCount = -1;
					whCount = 0;
					colCount = 0;
					noRecord = 'No existing record';

					vitalData.forEach(vital => {
						if (!(sample.includes(vital.datetime))) {
							sample.push(vital.datetime);
							sampleDate.push(vital.date);
						}
					});
					
					painData.forEach(pain => {
						if (!(sample.includes(pain.datetime))) {
							sample.push(pain.datetime);
							sampleDate.push(pain.date);
						}
					});
	
					oxyData.forEach(oxy => {
						if (!(sample.includes(oxy.datetime))) {
							sample.push(oxy.datetime);
							sampleDate.push(oxy.date);
						}
					});

					// whData.forEach(wh => {
					// 	if (!(sample.includes(wh.datetime))) {
					// 		sample.push(wh.datetime);
					// 		sampleDate.push(wh.date);
					// 	}
					// })

					sample.sort();
					sampleDate.sort();

					for (i = 0; i < sample.length; i++) {
	
						//Counter for empty data
						//.length here refers to last index of the array
						if (vitalCount !== (vitalFlow.length - 1)) {
							vitalCount++;
						}
						if (painCount !== (painFlow.length - 1)) {
							painCount++;
						}
						if (oxyCount !== (oxyFlow.length - 1)) {
							oxyCount++;
						}
	
						//Insert empty data when value doesnt match
						//Count here does the index count of flow array
						if (vitalFlow != '') {
							if (sample[i] < vitalFlow[vitalCount].datetime) {
								vitalFlow.splice(vitalCount, 0, {datetime: ''});
							} else if (sample[i] > vitalFlow[vitalCount].datetime) {
								vitalFlow.splice(vitalCount + 1, 0, {datetime: ''});
							}
						} else {
							vitalFlow.push({datetime: '', bPressure: noRecord});
						}
						
						if (painFlow != '') {
							if (sample[i] < painFlow[painCount].datetime) {
								painFlow.splice(painCount, 0, {datetime: ''});
							} else if (sample[i] > painFlow[painCount].datetime) {
								painFlow.splice(painCount + 1, 0, {datetime: ''});
							}
						} else {
							painFlow.push({datetime: '', characteristics: noRecord});
						}
	
						if (oxyFlow != '') {
							if (sample[i] < oxyFlow[oxyCount].datetime) {
								oxyFlow.splice(oxyCount, 0, {datetime: ''});
							} else if (sample[i] > oxyFlow[oxyCount].datetime) {
								oxyFlow.splice(oxyCount + 1, 0, {datetime: ''});
							}
						} else {
							oxyFlow.push({datetime: '', o2Amt: noRecord});
						}

						if (whFlow != '') {

							//Does the colspan counter for weight and height
							if (sampleDate[i] != whFlow[whCount].date) {	//If dont match
								colCount++;
								if (whFlow[whCount].date != '') {	//If current index is not empty
									whFlow.splice(whCount, 0, {date: ''});	//Adds empty date in current index
									// console.log('1', sampleDate[i+1], whFlow[whCount]);
									if (sampleDate[i+1] == whFlow[whCount + 1].date) { //If the next index matches the next i
										whCount++;
										colCount--;
									}
								} else if (whFlow[whCount + 1] == null) {	//So it doesn't give an error when it's null
								console.log('ensures that no error happens when whCount+1 is null');
							}
							else if (sampleDate[i+1] == whFlow[whCount + 1].date) {	//If the next index matches next i
								whFlow[whCount].colspan = colCount//Inserts colspan in current index
								whCount++;	//Moves to the next index
								colCount = 0;	//Resets column count to 0
							}
						} else { //If current whcount matches current i
							colCount++;	//Adds column count by 1
							if (sampleDate[i+1] != whFlow[whCount].date) {	//If the next index does not match current i
								whFlow[whCount].colspan = colCount;	//Inserts colspan in current index
								whCount++;	//Moves to the next index
								colCount = 0;	//Resets column count to 0 
								if (whFlow[whCount] == null) {	//If the current index is null
									whFlow.splice(whCount, 0, {date: ''});	//Adds empty date when it is null
								}
							}
						}
						whFlow[whCount].colspan = colCount;
						} else {
							whFlow.push({date: '', heightEst: noRecord});
						}
					};
					
					res.render('charts/master/charts-vital', {
						dateVal: sample,
						vitalFlow: vitalFlow,
						painFlow: painFlow,
						oxyFlow: oxyFlow,
						whFlow: whFlow,
						newVital: vitalData,
						painData: painData,
						oxyData: oxyData,
						whData: whData,
						patient: req.session.patient,
						showMenu: true
					})
				})
			})
		});
	})
})


//Get single vital information
router.get('/vital/:vitalID', ensureAuthenticated, ensureAuthorised, (req, res) => {
	MasterVital.find({ patientID: req.session.patient.patientID }).sort({'datetime':1}).then(newVital => {
		MasterVital.findOne({ vitalID: req.params.vitalID }).then(editVital => {

			//Changes date format to DD/MM/YYYY
			editVital.date = moment(editVital.date, 'YYYY-MM-DD').format('DD/MM/YYYY');
			res.render('charts/master/charts-vital', {
				newVital: newVital,
				editVital: editVital,
				patient: req.session.patient,
				showMenu: true
			})
		})
	})
})

//Add vital information
router.post('/add-vital', ensureAuthenticated, ensureAuthorised, (req, res) => {
	vitalid = (new standardID('AAA0000')).generate();
	datetime = moment(req.body.dateVital, 'DD/MM/YYYY').format('MM/DD/YYYY') + " " + req.body.timeVital;
	bPressure = req.body.sbp + "/" + req.body.dbp;
	abPressure = req.body.sbpArterial + "/" + req.body.dbpArterial;

	new MasterVital({
		patientID: req.session.patient.patientID,
		vitalID: vitalid,
		userID: req.user.id,
		date: moment(req.body.dateVital, 'DD/MM/YYYY').format('YYYY-MM-DD'),
		time: req.body.timeVital,
		datetime: datetime,
		temp: req.body.temp,
		tempRoute: req.body.tempRoute,
		heartRate: req.body.heartRate,
		resp: req.body.resp,
		sbp: req.body.sbp,
		dbp: req.body.dbp,
		sbpArterial: req.body.sbpArterial,
		dbpArterial: req.body.dbpArterial,
		bPressure: bPressure,
		arterialBP: abPressure,
		bpLocation: req.body.bpLocation,
		bpMethod: req.body.bpMethod,
		patientPosition: req.body.patientPosition,
		userType: req.user.userType
	}).save();

	res.redirect('/master/vital');
})

//Edit vital information
router.put('/edit-vital/:vitalID', ensureAuthenticated, ensureAuthorised, (req,res) => {
	datetime = moment(req.body.dateVital, 'DD/MM/YYYY').format('MM/DD/YYYY') + " " + req.body.timeVital;
	bPressure = req.body.sbp + "/" + req.body.dbp;
	abPressure = req.body.sbpArterial + "/" + req.body.dbpArterial;

	MasterVital.findOne({ vitalID: req.params.vitalID }).then(editVital => {
		editVital.date = moment(req.body.dateVital, 'DD/MM/YYYY').format('YYYY-MM-DD'),
		editVital.time = req.body.timeVital,
		editVital.datetime = datetime,
		editVital.temp = req.body.temp,
		editVital.tempRoute = req.body.tempRoute,
		editVital.heartRate = req.body.heartRate,
		editVital.resp = req.body.resp,
		editVital.sbp = req.body.sbp,
		editVital.dbp = req.body.dbp,
		editVital.sbpArterial = req.body.sbpArterial,
		editVital.dbpArterial = req.body.dbpArterial,
		editVital.bPressure = bPressure,
		editVital.arterialBP = abPressure,
		editVital.bpLocation = req.body.bpLocation,
		editVital.bpMethod = req.body.bpMethod,
		editVital.patientPosition = req.body.patientPosition

		editVital.save();
	});
	res.redirect('/master/vital');
})

//Delete vital information
router.delete('/del-vitals/:vitalID', ensureAuthenticated, ensureAuthorised, (req, res) => {
	MasterVital.deleteOne({vitalID: req.params.vitalID}, function(err) {
		if (err) {
			console.log('cannot delete vitals');
		}
	});
	res.redirect('/master/vital');
})

//Get single pain info
router.get('/pain/:painID', ensureAuthenticated, ensureAuthorised, (req, res) => {
	MasterPain.find({ patientID: req.session.patient.patientID }).sort({'datetime':1}).then(painData => {
		MasterPain.findOne({ painID: req.params.painID }).then(editPain => {
			//Changes date format to DD/MM/YYYY
			editPain.date = moment(editPain.date, 'YYYY-MM-DD').format('DD/MM/YYYY');
			res.render('charts/master/charts-vital', {
				painData: painData,
				editPain: editPain,
				patient: req.session.patient,
				showMenu: true
			})
		})
	})
})


//Add pain information
router.post('/add-pain', ensureAuthenticated, ensureAuthorised, (req, res) => {
	painid = (new standardID('AAA0000')).generate();
	datetime = moment(req.body.datePain, 'DD/MM/YYYY').format('MM/DD/YYYY') + " " + req.body.timePain;

	new MasterPain({
		patientID: req.session.patient.patientID,
		painID: painid,
		userType: req.user.userType,
		datetime: datetime,
		date: moment(req.body.datePain, 'DD/MM/YYYY').format('YYYY-MM-DD'),
		time: req.body.timePain,
		painScale: req.body.painScale,
		painScore: req.body.painScore,
		onset: req.body.onset,
		location: req.body.location,
		duration: req.body.duration,
		characteristics: req.body.characteristics,
		associatedSymp: req.body.associatedSymp,
		aggravatingFact: req.body.aggravatingFact,
		relievingFact: req.body.relievingFact,
		painIntervene: req.body.painIntervene,
		responseIntervene: req.body.responseIntervene,
		siteofpain: req.body.siteofpain
	}).save();

	res.redirect('/master/vital');

})

//Edit pain info
router.put('/edit-pain/:painID', ensureAuthenticated, ensureAuthorised, (req, res) => {
	datetime = moment(req.body.datePain, 'DD/MM/YYYY').format('MM/DD/YYYY') + " " + req.body.timePain;

	MasterPain.findOne({ painID: req.params.painID }).then(editPain => {
		editPain.datetime = datetime,
		editPain.date = moment(req.body.datePain, 'DD/MM/YYYY').format('YYYY-MM-DD'),
		editPain.time = req.body.timePain,
		editPain.painScale = req.body.painScale,
		editPain.painScore = req.body.painScore,
		editPain.onset = req.body.onset,
		editPain.location = req.body.location,
		editPain.duration = req.body.duration,
		editPain.characteristics = req.body.characteristics,
		editPain.associatedSymp = req.body.associatedSymp,
		editPain.aggravatingFact = req.body.aggravatingFact,
		editPain.relievingFact = req.body.relievingFact,
		editPain.painIntervene = req.body.painIntervene,
		editPain.responseIntervene = req.body.responseIntervene,
		editPain.siteofpain = req.body.siteofpain

		editPain.save();
	})
	res.redirect('/master/vital');
})

//Delete pain info
router.delete('/del-pain/:painID', ensureAuthenticated, ensureAuthorised, (req, res) => {
	MasterPain.deleteOne({ painID: req.params.painID }, function(err) {
		if(err) {
			console.log('cannot delete pain info');
		}
	})
	res.redirect('/master/vital');
})

//Get single oxygen information
router.get('/oxygen/:oxygenID', ensureAuthenticated, ensureAuthorised, (req, res) => {
	MasterOxygen.find({ patientID: req.session.patient.patientID }).sort({'datetime':1}).then(oxyData => {
		MasterOxygen.findOne({ oxygenID: req.params.oxygenID }).then(editOxy => {

			//Changes date format to DD/MM/YYYY
			editOxy.date = moment(editOxy.date, 'YYYY-MM-DD').format('DD/MM/YYYY');
			res.render('charts/master/charts-vital', {
				oxyData: oxyData,
				editOxy: editOxy,
				patient: req.session.patient,
				showMenu: true
			})
		})
	})
})

//Add oxygen information
router.post('/add-oxygen', ensureAuthenticated, ensureAuthorised, (req, res) => {
	oxygenid = (new standardID('AAA0000')).generate();
	datetime = moment(req.body.dateOxy, 'DD/MM/YYYY').format('MM/DD/YYYY') + " " + req.body.timeDischargePlanning;

	new MasterOxygen({
		patientID: req.session.patient.patientID,
		oxygenID: oxygenid,
		userType: req.user.userType,
		datetime: datetime,
		date: moment(req.body.dateOxy, 'DD/MM/YYYY').format('YYYY-MM-DD'),
		time: req.body.timeOxy,
		o2Device: req.body.oxyDevice,
		humidifier: req.body.humidifier,
		o2Amt: req.body.oxyAmt,
		fio2: req.body.fiOxy,
		spo2: req.body.spOxy
	}).save();

	res.redirect('/master/vital');
})

//Update oxygen information
router.put('/edit-oxygen/:oxygenID', ensureAuthenticated, ensureAuthorised, (req, res) => {
	datetime = moment(req.body.dateOxy, 'DD/MM/YYYY').format('MM/DD/YYYY') + " " + req.body.timeOxy;

	MasterOxygen.findOne({ oxygenID: req.params.oxygenID }).then(editOxy => {
		editOxy.datetime = datetime,
		editOxy.date = moment(req.body.dateOxy, 'DD/MM/YYYY').format('YYYY-MM-DD'),
		editOxy.time = req.body.timeOxy,
		editOxy.o2Device = req.body.oxyDevice,
		editOxy.humidifier = req.body.humidifier,
		editOxy.o2Amt = req.body.oxyAmt,
		editOxy.fio2 = req.body.fiOxy,
		editOxy.spo2 = req.body.spOxy

		editOxy.save();
	})
	res.redirect('/master/vital');
})

//Delete oxygen information
router.delete('/del-oxygen/:oxygenID', ensureAuthenticated, ensureAuthorised, (req, res) => {
	MasterOxygen.deleteOne({ oxygenID: req.params.oxygenID }, function(err) {
		if(err) {
			console.log('cannot delete oxygen information');
		}
	});
	res.redirect('/master/vital');
})

//Get single weight & height information
router.get('/wh/:whID', ensureAuthenticated, ensureAuthorised, (req, res) => {
	MasterWH.find({ patientID: req.session.patient.patientID }).sort({'datetime':1}).then(whData => {
		MasterWH.findOne({ whID: req.params.whID }).then(editWh => {

			//Changes date format to DD/MM/YYYY
			editWh.date = moment(editWh.date, 'YYYY-MM-DD').format('DD/MM/YYYY');
			res.render('charts/master/charts-vital', {
				whData: whData,
				editWh: editWh,
				patient: req.session.patient,
				showMenu: true
			})
		})
	})
})

       
//Add weight & height information
router.post('/add-wh', ensureAuthenticated, ensureAuthorised, (req, res) => {
	whid = (new standardID('AAA0000')).generate();
	datetime = moment(req.body.dateWh, 'DD/MM/YYYY').format('MM/DD/YYYY') + " " + req.body.timeWh;

	new MasterWH({
		patientID: req.session.patient.patientID,
		whID: whid,
		userType: req.user.userType,
		datetime: datetime,
		date: moment(req.body.dateWh, 'DD/MM/YYYY').format('YYYY-MM-DD'),
		time: req.body.timeWh,
		height: req.body.height,
		heightEst: req.body.heightEst,
		weight: req.body.weight,
		weightEst: req.body.weightEst,
		bsa: req.body.bsa,
		bmi: req.body.bmi
	}).save();

	res.redirect('/master/vital');
})

//Edit weight & height information
router.put('/edit-wh/:whID', ensureAuthenticated, ensureAuthorised, (req, res) => {
	console.log("hey")
	datetime = moment(req.body.dateWh, 'DD/MM/YYYY').format('MM/DD/YYYY') + " " + req.body.timeWh;

	MasterWH.findOne({ whID: req.params.whID }).then(editWH => {
		editWH.datetime = datetime,
		editWH.date = moment(req.body.dateWh, 'DD/MM/YYYY').format('YYYY-MM-DD'),
		editWH.time = req.body.timeWh,
		editWH.height = req.body.height,
		editWH.heightEst = req.body.heightEst,
		editWH.weight = req.body.weight,
		editWH.weightEst = req.body.weightEst,
		editWH.bsa = req.body.bsa,
		editWH.bmi = req.body.bmi

		editWH.save();
	})
	res.redirect('/master/vital');
})

//Delete weight & height information
router.delete('/del-wh/:whID', ensureAuthenticated, ensureAuthorised, (req, res) => {
	MasterWH.deleteOne({ whID: req.params.whID }, function(err) {
		if (err) {
			console.log('cannot delete weight & height information');
		}
	})
	res.redirect('/master/vital');
})

//Picture upload settings
var storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, './public/assets/img/upload/')
	},
	filename: function (req, file, cb) {
		var ext = file.mimetype.split('/')[1];
		// console.log('file settings: ', file);
		cb(null, file.fieldname + '-' + Date.now() + '.' + ext);
	}
})

//Ensures only picture format can be uploaded
var fileFilter = (req, file, cb) => {
	if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg') {
		cb(null, true);
	} else {
		cb(null, false);
	}
}

//Declare upload with settings for picture upload
var upload = multer({ storage: storage, fileFilter: fileFilter });

//Starting route for doctor's orders
router.get('/doctor/orders', ensureAuthenticated, ensureAuthorised, (req, res) => {
	DoctorOrders.find({ patientID: req.session.patient.patientID}).sort({'datetime':1}).then(docOrders => {
		res.render('doctors/doctors-orders', {
			docOrders: docOrders,
			patient: req.session.patient,
			showMenu: true
		})
	})
})

router.get('/doctor/orders/:orderID', ensureAuthenticated, ensureAuthorised, (req, res) => {
	DoctorOrders.find({ patientID: req.session.patient.patientID}).sort({'datetime':1}).then(docOrders => {
		DoctorOrders.findOne({ orderID: req.params.orderID }).then(editOrder => {

			editOrder.date = moment(editOrder.date, 'YYYY-MM-DD').format('DD/MM/YYYY');
			res.render('doctors/doctors-orders', {
				docOrders: docOrders,
				editOrder: editOrder,
				patient: req.session.patient,
				showMenu: true
			})
		})
	})
})

//Doctor's adding of orders
router.post('/doctor/orders/add-order', upload.single('photo') , ensureAuthenticated, ensureAuthorised, (req, res) => {
	orderid = (new standardID('AAA0000')).generate();
	datetime = moment(req.body.dateOrder, 'DD/MM/YYYY').format('MM/DD/YYYY') + " " + req.body.timeOrder;
	uploadUrl = '';

	if (req.body.photoName != '') {
		uploadUrl = req.file.filename;
	}

	new DoctorOrders({
		patientID: req.session.patient.patientID,
		orderID: orderid,
		userType: req.user.userType,
		datetime: datetime,
		date: moment(req.body.dateOrder, 'DD/MM/YYYY').format('YYYY-MM-DD'),
		time: req.body.timeOrder,
		orders: req.body.orders,
		status: req.body.status,
		uploadUrl: uploadUrl
	}).save();
	
	res.redirect('/master/doctor/orders');
})

router.put('/doctor/orders/edit-order/:orderID', upload.single('photo'), ensureAuthenticated, ensureAuthorised, (req ,res) => {
	datetime = moment(req.body.dateOrder, 'DD/MM/YYYY').format('MM/DD/YYYY') + " " + req.body.timeOrder;
	uploadUrl = '';

	if (req.body.photoName != '') {
		uploadUrl = req.file.filename;
	}

	DoctorOrders.findOne({ orderID: req.params.orderID }).then(editOrder => {
		editOrder.datetime = datetime,
		editOrder.date = moment(req.body.dateOrder, 'DD/MM/YYYY').format('YYYY-MM-DD'),
		editOrder.time = req.body.timeOrder,
		editOrder.orders = req.body.orders,
		editOrder.status = req.body.status
		if (req.body.photoName != '') {
			editOrder.uploadUrl = uploadUrl
		}

		editOrder.save();
	});

	res.redirect('/master/doctor/orders');
})

router.delete('/doctor/orders/del-order/:orderID', ensureAuthenticated, ensureAuthorised, (req, res) => {
	DoctorOrders.deleteOne({ orderID: req.params.orderID }, function(err) {
		if (err) {
			console.log('cannot delete order');
		} else {
			console.log('deleting: ', req.params.orderID);
		}
	})
	res.redirect('/master/doctor/orders');
})

// MDP page
router.get('/mdp', ensureAuthenticated, ensureAuthorised, (req, res) => {
	MasterMDP.find({user: req.user.id, patientID: req.session.patient.patientID}).sort({'datetime':1})
	.then(newMDP => { // mdp that they have created

		MasterMDP.find({user:{'$ne':req.user.id} , patientID: req.session.patient.patientID}).sort({'datetime':1})
		.then(newOtherMasterMDP => {  // mdp that is created by other users

			StudentMDP.aggregate( // show the latest record created by each student
			[
				{"$sort": {
					'datetime': -1
				}},
				{ "$match" : { 'patientID' : req.session.patient.patientID } },
				{ "$group": { '_id' : "$createdBy",  "doc": {"$first":"$$ROOT"}}},
				{"$replaceRoot": {"newRoot": "$doc"}},
				{"$sort": {
					'datetime': -1,
					'createdBy': 1
				}}
			])
			.then(newOtherStudentMDP => {

				res.render('mdp-notes/master/mdp', {
					newMDP: newMDP,
					newOtherMasterMDP: newOtherMasterMDP,
					newOtherStudentMDP: newOtherStudentMDP,
					patient: req.session.patient,
					showMenu: true,
				});
			})
		})
	})
})
// add MDP page
router.post('/add-mdp', ensureAuthenticated, ensureAuthorised, (req, res) => {
	mdpID = (new standardID('AAA0000')).generate();
	datetime = moment(req.body.dateMDP, 'DD/MM/YYYY').format('MM/DD/YYYY') + " " + req.body.timeMDP;
	new MasterMDP({
		patientID: req.session.patient.patientID,
		user: req.user.id,
		//nursingAssessmentID: patient.nursingAssessmentID,
		mdpID: mdpID,
		createdBy: req.user.firstName,
		date: moment(req.body.dateMDP, 'DD/MM/YYYY').format('YYYY-MM-DD'),
		time: req.body.timeMDP,
		datetime: datetime,
		selectUser: req.body.selectUser,
		nameOfHealthProvider: req.body.nameOfHealthProvider,
		progressNotes: req.body.progressNotes
	}).save();
	res.redirect('/master/mdp');
})
// delete MDP page
router.delete('/del-mdp/:mdpID', ensureAuthenticated, ensureAuthorised, (req, res) => {
	MasterMDP.deleteOne({mdpID: req.params.mdpID}, function(err) {
		if (err) {
			console.log("cannot delete mdp details");
		}
	});
	res.redirect('/master/mdp');
})

// get single MDP info
router.get('/mdp/:mdpID', ensureAuthenticated, ensureAuthorised, (req, res) => {
	MasterMDP.find({ patientID: req.session.patient.patientID, user: req.user.id}).sort({'datetime':1})
	.then(newMDP => {

		MasterMDP.find({user:{'$ne':req.user.id} , patientID: req.session.patient.patientID}).sort({'datetime':1})
		.then(newOtherMasterMDP => { 

			MasterMDP.findOne({ mdpID: req.params.mdpID})
			.then(editMDP => {
				
				editMDP.date = moment(editMDP.date, 'YYYY-MM-DD').format('DD/MM/YYYY');

				StudentMDP.aggregate(
				[
					{"$sort": {
						'datetime': -1
					}},
					{ "$match" : { 'patientID' : req.session.patient.patientID } },
					{ "$group": { '_id' : "$createdBy",  "doc": {"$first":"$$ROOT"}}},
					{"$replaceRoot": {"newRoot": "$doc"}},
					{"$sort": {
						'datetime': -1,
						'createdBy': 1
					}}
				]
				).then(newOtherStudentMDP => { 
					res.render('mdp-notes/master/mdp', {
						newMDP: newMDP,
						newOtherMasterMDP: newOtherMasterMDP,
						newOtherStudentMDP: newOtherStudentMDP,
						editMDP: editMDP,
						patient: req.session.patient,
						showMenu: true
					});
				});
			})
		})
	})
})

// edit MDP informations
router.put('/edit-mdp/:mdpID', ensureAuthenticated, ensureAuthorised, (req,res) => {
	datetime = moment(req.body.dateMDP, 'DD/MM/YYYY').format('MM/DD/YYYY') + " " + req.body.timeMDP;

	MasterMDP.findOne({ mdpID: req.params.mdpID}).then(editMDP => {
		editMDP.date = moment(req.body.dateMDP, 'DD/MM/YYYY').format('YYYY-MM-DD'),
		editMDP.time = req.body.timeMDP,
		editMDP.datetime = datetime,
		editMDP.selectUser = req.body.selectUser,
		editMDP.healthProvider = req.body.healthProvider,
		editMDP.progressNotes = req.body.progressNotes
		editMDP.nameOfHealthProvider = req.body.nameOfHealthProvider,
		editMDP.save();
	});
	res.redirect("/master/mdp");
})

//Load Diabetic page
router.get('/diabetic', ensureAuthenticated, ensureAuthorised, (req, res) => {
	MasterDiabetic.find({ patientID: req.session.patient.patientID }).sort({'datetime':1}).then(newDiabetic => {

					diabeticsample = [];
					diabeticsampleDate = [];
					let diabeticFlow = Object.assign([], newDiabetic);
					
					diabeticCount = -1;
					
					diabeticnoRecord = 'No existing record';

					newDiabetic.forEach(diabetic => {
						//if (!(diabeticsample.includes(diabetic.datetime))) {
							diabeticsample.push(diabetic.datetime);
							diabeticsampleDate.push(diabetic.date);
						//}
					});
					diabeticsample.sort();
					diabeticsampleDate.sort();

					for (i = 0; i < diabeticsample.length; i++) {
						

						//Counter for empty data
						//.length here refers to last index of the array
						if (diabeticCount !== (diabeticFlow.length - 1)) {
							diabeticCount++;
						}
						//Insert empty data when value doesnt match
						//Count here does the index count of flow array
						if(diabeticFlow !='') 
						{
							if (diabeticsample[i] < diabeticFlow[diabeticCount].datetime) {
								diabeticFlow.splice(diabeticCount, 0, {datetime: ''});
							} else if (diabeticsample[i] > diabeticFlow[diabeticCount].datetime) {
								diabeticFlow.splice(diabeticCount + 1, 0, {datetime: ''});
							}
						} 
						else
						{
							diabeticFlow.push({datetime: '', poc: diabeticnoRecord});
						}

						
					};
					res.render('charts/master/charts-diabetic', {
						// recordID: req.params.recordID,
						// userType: userType,
						diabeticdateVal: diabeticsample,
						diabeticFlow: diabeticFlow,
						newDiabetic: newDiabetic,
						patient: req.session.patient,
						showMenu: true
        			})
	})
})

//get single Diabetic info
router.get('/diabetic/:diabeticID', ensureAuthenticated, ensureAuthorised, (req, res) => {
	// MasterBraden.find({ patientID: req.session.patient.patientID }).then(newBraden => {
	MasterDiabetic.find({ patientID: req.session.patient.patientID }).sort({'datetime':1}).then(newDiabetic => {
		MasterDiabetic.findOne({ diabeticID: req.params.diabeticID }).then(editDiabetic => {

			editDiabetic.date = moment(editDiabetic.date, 'YYYY-MM-DD').format('DD/MM/YYYY');
			res.render('charts/master/charts-diabetic', {
				// azureId: req.user.azure_oid,
				newDiabetic: newDiabetic,
				editDiabetic: editDiabetic,
				patient: req.session.patient,
				showMenu: true			
			})
		})
	})
})
//add diabetic info
router.post('/add-diabetic', ensureAuthenticated,ensureAuthorised, (req, res) => {
	diabeticID = (new standardID('AAA0000')).generate();
	datetime = moment(req.body.dateDiabetic, 'DD/MM/YYYY').format('MM/DD/YYYY') + " "+ req.body.timeDiabetic;

	splitpoc = req.body.poc.slice(0,2);

	new MasterDiabetic({
			// patientID: req.session.patient.patientID,
			patientID: req.session.patient.patientID,
			diabeticID: diabeticID,
			date: moment(req.body.dateDiabetic, 'DD/MM/YYYY').format('YYYY-MM-DD'),
			time: req.body.timeDiabetic,
			datetime: datetime,
			poc: req.body.poc,
			bgl: req.body.bgl,
			insulintype: req.body.insulintype,
			insulinamt: req.body.insulinamt,
			hypoagent: req.body.hypoagent,
			splitpoc: splitpoc,

	}).save();

	res.redirect('/master/diabetic');
})

//Edit diabetic information
router.put('/edit-diabetic/:diabeticID', ensureAuthenticated,ensureAuthorised, (req,res) => {
	datetime = moment(req.body.dateDiabetic, 'DD/MM/YYYY').format('MM/DD/YYYY') + " "+ req.body.timeDiabetic;
	splitpoc = req.body.poc.slice(0,2);

	MasterDiabetic.findOne({ diabeticID: req.params.diabeticID }).then(editDiabetic => {
		editDiabetic.date = moment(req.body.dateDiabetic, 'DD/MM/YYYY').format('YYYY-MM-DD'),
		editDiabetic.time = req.body.timeDiabetic,
		editDiabetic.datetime = datetime,
		editDiabetic.poc = req.body.poc,
		editDiabetic.bgl = req.body.bgl,
		editDiabetic.insulintype = req.body.insulintype,
		editDiabetic.insulinamt = req.body.insulinamt,
		editDiabetic.hypoagent = req.body.hypoagent,
		editDiabetic.splitpoc = splitpoc,

		editDiabetic.save();
	});
	res.redirect('/master/diabetic');
})
//Delete diabetic information
router.delete('/del-diabetic/:diabeticID', ensureAuthenticated, ensureAuthorised, (req, res) => {
	MasterDiabetic.deleteOne({diabeticID: req.params.diabeticID}, function(err) {
		if (err) {
			console.log('cannot delete diabetic details');
		}
	});
	res.redirect('/master/diabetic');
})

//END OF DIABETIC
// Care Plan
router.get('/CarePlan', ensureAuthenticated, ensureAuthorised, (req, res) => { // to display the students who has created their care plan

	StudentCarePlan.aggregate([ // display students who has created their care plan
		{"$sort": {
			'datetime': -1
		}},
		{ "$match" : { 'patientID' : req.session.patient.patientID } },
		{ "$group": { '_id' : "$createdBy", "doc": {"$first": "$$ROOT"}}},
		{"$replaceRoot": {"newRoot": "$doc"}},
		{"$sort": {
			'datetime': -1	
		}}
	])
	.then(studentCarePlanName => {
		res.render('care-plan/master/care-plan', {
			studentCarePlanName: studentCarePlanName,
			recordID: req.params.recordID,
			//userType: req.user.userType,
			patient: req.session.patient,
			showMenu: true
		});
	});
})

router.get('/CarePlan/:name', ensureAuthenticated, ensureAuthorised, (req, res) => {
	//userType = req.user.userType == 'student';
	var name = req.params.name;
	console.log("name: "+ name);
	StudentCarePlan.aggregate([ // display students who has created their care plan
		{"$sort": {
			'datetime': -1,
		}},
		{ "$match" : { 'patientID' : req.session.patient.patientID } },
		{ "$group": { '_id' : "$createdBy", "doc": {"$first": "$$ROOT"}}},
		{"$replaceRoot": {"newRoot": "$doc"}},
		{"$sort": {
			'datetime': -1	
		}}
	])
	.then(studentCarePlanName => {
		/*StudentCarePlan.find({patientID: req.session.patient.patientID, createdBy: name}).sort({'datetime': 1})
		.then(newCarePlan => {*/
		StudentCarePlan.aggregate([ // display students who has created their care plan
			{"$sort": {
				'datetime': -1
			}},
			{ "$match" : { 'patientID' : req.session.patient.patientID, 'createdBy': req.params.name } },
			{ "$group": { 
				'_id' : {
					"createdBy":"$createdBy",
					"categoryOfNursingIssues":"$categoryOfNursingIssues"
				}, 
				"doc": {
					"$first": "$$ROOT"
				}
			}},
			{"$replaceRoot": {"newRoot": "$doc"}},
			{"$sort": {
				'datetime': -1,
				'categoryOfNursingIssues': 1
			}}
		])
		.then(newCarePlan => {
			console.log("newCarePlan: "+ JSON.stringify(newCarePlan));

			res.render('care-plan/master/care-plan', {
				name: req.params.name,
				newCarePlan: newCarePlan,	
				studentCarePlanName: studentCarePlanName,
				recordID: req.params.recordID,
				//userType: userType,
				patient: req.session.patient,
				showMenu: true
			});
		})
	});
})

// get single Care Plan info
router.get('/CarePlan/:name/:carePlanID', ensureAuthenticated, ensureAuthorised, (req, res) => {
	//userType = req.user.userType == 'student';
	
	StudentCarePlan.aggregate([ // display students who has created their care plan
		{"$sort": {
			'datetime': -1
		}},
		{ "$match" : { 'patientID' : req.session.patient.patientID } },
		{ "$group": { '_id' : "$createdBy", "doc": {"$first": "$$ROOT"}}},
		{"$replaceRoot": {"newRoot": "$doc"}},
		{"$sort": {
			'datetime': -1	
		}}
	])
	.then(studentCarePlanName => {
		/*StudentCarePlan.find({ patientID: req.session.patient.patientID, createdBy: req.params.name}).sort({'datetime':1})
		.then(newCarePlan => {*/
		StudentCarePlan.aggregate([ // display students who has created their care plan
			{"$sort": {
				'datetime': -1
			}},
			{ "$match" : { 'patientID' : req.session.patient.patientID, 'createdBy': req.params.name  } },
			{ "$group": { 
				'_id' : {
					"createdBy":"$createdBy",
					"categoryOfNursingIssues":"$categoryOfNursingIssues"
				}, 
				"doc": {
					"$first": "$$ROOT"
				}
			}},
			{"$replaceRoot": {"newRoot": "$doc"}},
			{"$sort": {
				'datetime': -1,
				'categoryOfNursingIssues': 1	
			}}
		])
		.then(newCarePlan => {
			console.log("newCarePlan: "+ JSON.stringify(newCarePlan));
			StudentCarePlan.findOne({ carePlanID: req.params.carePlanID })
			.then(editCarePlan => {
				
				editCarePlan.date = moment(editCarePlan.date, 'YYYY-MM-DD').format('DD/MM/YYYY');
				
				res.render('care-plan/master/care-plan', {
					studentCarePlanName: studentCarePlanName,
					name: req.params.name,
					//userType: userType,
					recordID: req.params.recordID,
					newCarePlan: newCarePlan,
					editCarePlan: editCarePlan,
					patient: req.session.patient,
					showMenu: true
				});
			});
		});
	});
})

//Load Neurovascular page
router.get('/neuro', ensureAuthenticated, ensureAuthorised, (req, res) => {
	MasterNeuro.find({ patientID: req.session.patient.patientID }).sort({'datetime':1}).then(newNeuro => {
		// Right arm
		MasterNeuro.find({ patientID: req.session.patient.patientID, siteOfInjury: "Right Arm" }).sort({'datetime':1}).then(newNeuroRightArm => {

			// Left arm
			MasterNeuro.find({ patientID: req.session.patient.patientID, siteOfInjury: "Left Arm" }).sort({'datetime':1}).then(newNeuroLeftArm => {

				// Right leg
				MasterNeuro.find({ patientID: req.session.patient.patientID, siteOfInjury: "Right Leg" }).sort({'datetime':1}).then(newNeuroRightLeg => {

					// Left leg
					MasterNeuro.find({ patientID: req.session.patient.patientID, siteOfInjury: "Left Leg" }).sort({'datetime':1}).then(newNeuroLeftLeg => {
						
						// right arm
						var rightArmNeuroFlowLength = 0;
						// left arm
						var leftArmNeuroFlowLength = 0;
						// right leg
						var rightLegNeuroFlowLength = 0;
						// left leg
						var leftLegNeuroFlowLength = 0;

						// Right Arm
						if (!(isNaN(newNeuroRightArm.length)))
						{
							rightArmNeuroFlowLength = newNeuroRightArm.length
						}
						rightArmNeuroFlowLength = rightArmNeuroFlowLength * 2; // rowspan to merge same site of injury on right arm

						//Left Arm
						if (!(isNaN(newNeuroLeftArm.length)))
						{
							leftArmNeuroFlowLength = newNeuroLeftArm.length
						}
						leftArmNeuroFlowLength = leftArmNeuroFlowLength * 2; // rowspan to merge same site of injury on left arm
						
						// Right Leg
						if (!(isNaN(newNeuroRightLeg.length)))
						{
							rightLegNeuroFlowLength = newNeuroRightLeg.length
						}
						rightLegNeuroFlowLength = rightLegNeuroFlowLength * 2; // rowspan to merge same site of injury on right leg

						//Left Leg
						if (!(isNaN(newNeuroLeftLeg.length)))
						{
							leftLegNeuroFlowLength = newNeuroLeftLeg.length
						}
						leftLegNeuroFlowLength = leftLegNeuroFlowLength * 2; // rowspan to merge same site of injury on left arm
						
						/*console.log("rightArmNeuroFlowLength: "+ rightArmNeuroFlowLength);
						console.log("leftArmNeuroFlowLength: " + leftArmNeuroFlowLength);
						console.log("rightLegNeuroFlowLength: " +rightLegNeuroFlowLength);
						console.log("leftLegNeuroFlowLength: "+leftLegNeuroFlowLength)*/
						

						neurosample = [];
						neurosampleDate = [];
						let neuroFlow = Object.assign([], newNeuro);
									
						neuroCount = -1;
									
						neuronoRecord = 'No existing record';

						newNeuro.forEach(neuro => {
							// if (!(neurosample.includes(neuro.datetime))) {
								neurosample.push(neuro.datetime);
								neurosampleDate.push(neuro.date);
							// }
						});
						neurosample.sort();
						neurosampleDate.sort();

						for (i = 0; i < neurosample.length; i++) {
							

							//Counter for empty data
							//.length here refers to last index of the array
							if (neuroCount !== (neuroFlow.length - 1)) {
								neuroCount++;
							}
							//Insert empty data when value doesnt match
							//Count here does the index count of flow array
							if(neuroFlow !='') 
							{
								if (neurosample[i] < neuroFlow[neuroCount].datetime) {
									neuroFlow.splice(neuroCount, 0, {datetime: ''});
								} else if (neurosample[i] > neuroFlow[neuroCount].datetime) {
									neuroFlow.splice(neuroCount + 1, 0, {datetime: ''});
								}
							} 
							else
							{
								neuroFlow.push({datetime: '', poc: neuronoRecord});
							}

							
						};
						res.render('charts/master/charts-neuro', {
							// recordID: req.params.recordID,
							// userType: userType,
							neurodateVal: neurosample,
							neuroFlow: neuroFlow,
							newNeuro: newNeuro,
							patient: req.session.patient,
							newNeuroRightArm: newNeuroRightArm,
							newNeuroLeftArm: newNeuroLeftArm,
							newNeuroRightLeg: newNeuroRightLeg,
							newNeuroLeftLeg: newNeuroLeftLeg,
							rightArmRowSpan: rightArmNeuroFlowLength,
							leftArmRowSpan: leftArmNeuroFlowLength,
							rightLegRowSpan: rightLegNeuroFlowLength,
							leftLegRowSpan: leftLegNeuroFlowLength,
							showMenu: true
						})
					})
				})
			})
		})
	})
})

//get single Neurovascular info
router.get('/neuro/:neuroID', ensureAuthenticated, ensureAuthorised, (req, res) => {
	MasterNeuro.find({ patientID: req.session.patient.patientID }).sort({'datetime':1}).then(newNeuro => {
		// Right arm
		MasterNeuro.find({ patientID: req.session.patient.patientID, siteOfInjury: "Right Arm" }).sort({'datetime':1}).then(newNeuroRightArm => {
			// Left arm
			MasterNeuro.find({ patientID: req.session.patient.patientID, siteOfInjury: "Left Arm" }).sort({'datetime':1}).then(newNeuroLeftArm => {
				// Right leg
				MasterNeuro.find({ patientID: req.session.patient.patientID, siteOfInjury: "Right Leg" }).sort({'datetime':1}).then(newNeuroRightLeg => {
					// Left leg
					MasterNeuro.find({ patientID: req.session.patient.patientID, siteOfInjury: "Left Leg" }).sort({'datetime':1}).then(newNeuroLeftLeg => {
						MasterNeuro.findOne({ neuroID: req.params.neuroID }).then(editNeuro => {
							// right arm
							var rightArmNeuroFlowLength = 0;
							// left arm
							var leftArmNeuroFlowLength = 0;
							// right leg
							var rightLegNeuroFlowLength = 0;
							// left leg
							var leftLegNeuroFlowLength = 0;

							// Right Arm
							if (!(isNaN(newNeuroRightArm.length)))
							{
								rightArmNeuroFlowLength = newNeuroRightArm.length
							}
							rightArmNeuroFlowLength = rightArmNeuroFlowLength * 2; // rowspan to merge same site of injury on right arm

							//Left Arm
							if (!(isNaN(newNeuroLeftArm.length)))
							{
								leftArmNeuroFlowLength = newNeuroLeftArm.length
							}
							leftArmNeuroFlowLength = leftArmNeuroFlowLength * 2; // rowspan to merge same site of injury on left arm
							
							// Right Leg
							if (!(isNaN(newNeuroRightLeg.length)))
							{
								rightLegNeuroFlowLength = newNeuroRightLeg.length
							}
							rightLegNeuroFlowLength = rightLegNeuroFlowLength * 2; // rowspan to merge same site of injury on right leg

							//Left Leg
							if (!(isNaN(newNeuroLeftLeg.length)))
							{
								leftLegNeuroFlowLength = newNeuroLeftLeg.length
							}
							leftLegNeuroFlowLength = leftLegNeuroFlowLength * 2; // rowspan to merge same site of injury on left arm
							
							/*console.log("rightArmNeuroFlowLength: "+ rightArmNeuroFlowLength);
							console.log("leftArmNeuroFlowLength: " + leftArmNeuroFlowLength);
							console.log("rightLegNeuroFlowLength: " +rightLegNeuroFlowLength);
							console.log("leftLegNeuroFlowLength: "+leftLegNeuroFlowLength)*/

							editNeuro.date = moment(editNeuro.date, 'YYYY-MM-DD').format('DD/MM/YYYY');
							res.render('charts/master/charts-neuro', {
								// azureId: req.user.azure_oid,
								newNeuro: newNeuro,
								editNeuro: editNeuro,
								patient: req.session.patient,
								newNeuroRightArm: newNeuroRightArm,
								newNeuroLeftArm: newNeuroLeftArm,
								newNeuroRightLeg: newNeuroRightLeg,
								newNeuroLeftLeg: newNeuroLeftLeg,
								rightArmRowSpan: rightArmNeuroFlowLength,
								leftArmRowSpan: leftArmNeuroFlowLength,
								rightLegRowSpan: rightLegNeuroFlowLength,
								leftLegRowSpan: leftLegNeuroFlowLength,
								showMenu: true			
							})
						})
					})
				})
			})
		})
	})
})
//add Neurovascular info
router.post('/add-neuro', ensureAuthenticated,ensureAuthorised, (req, res) => {
	neuroID = (new standardID('AAA0000')).generate();
	datetime = moment(req.body.dateNeuro, 'DD/MM/YYYY').format('MM/DD/YYYY') + " "+ req.body.timeNeuro;

	//splitpoc = req.body.poc.slice(0,2);

	new MasterNeuro({
		patientID: req.session.patient.patientID,
		neuroID: neuroID,
		// userType: ,
		datetime: datetime,
		date: moment(req.body.dateNeuro, 'DD/MM/YYYY').format('YYYY-MM-DD'),
		time: req.body.timeNeuro,
		siteOfInjury: req.body.siteOfInjury,
		colourLeft: req.body.leftColour,
		colourRight: req.body.rightColour,
		temperatureLeft: req.body.leftTemperature,
		temperatureRight: req.body.rightTemperature,
		capillaryRefillLeft: req.body.leftCapillaryRefill,
		capillaryRefillRight: req.body.rightCapillaryRefill,
		peripheralPulseLeft: req.body.leftPeripheralPulse,
		peripheralPulseRight: req.body.rightPeripheralPulse,
		edemaLeft: req.body.leftEdema,
		edemaRight: req.body.rightEdema,
		movementLeft: req.body.leftMovement,
		movementRight: req.body.rightMovement,
		sensationLeft: req.body.leftSensation,
		sensationRight: req.body.rightSensation,
		painScale: req.body.painScale,
		numericalRatingScaleLeft: req.body.numericalRatingScaleLeft,
		numericalRatingScaleRight: req.body.numericalRatingScaleRight,
		characteristicLeft: req.body.leftCharacteristic,
		characteristicRight: req.body.rightCharacteristic
	}).save();

	res.redirect('/master/neuro');
})

//Edit Neurovascular information
router.put('/edit-neuro/:neuroID', ensureAuthenticated,ensureAuthorised, (req,res) => {
	datetime = moment(req.body.dateNeuro, 'DD/MM/YYYY').format('MM/DD/YYYY') + " "+ req.body.timeNeuro;
	//splitpoc = req.body.poc.slice(0,2);

	MasterNeuro.findOne({ neuroID: req.params.neuroID }).then(editNeuro => {
		editNeuro.date = moment(req.body.dateNeuro, 'DD/MM/YYYY').format('YYYY-MM-DD'),
		editNeuro.time = req.body.timeNeuro,
		editNeuro.datetime = datetime,
		editNeuro.siteOfInjury = req.body.siteOfInjury,
		editNeuro.colourLeft = req.body.leftColour,
		editNeuro.colourRight = req.body.rightColour,
		editNeuro.temperatureLeft = req.body.leftTemperature,
		editNeuro.temperatureRight = req.body.rightTemperature,
		editNeuro.capillaryRefillLeft = req.body.leftCapillaryRefill,
		editNeuro.capillaryRefillRight = req.body.rightCapillaryRefill,
		editNeuro.peripheralPulseLeft = req.body.leftPeripheralPulse,
		editNeuro.peripheralPulseRight = req.body.rightPeripheralPulse,
		editNeuro.edemaLeft = req.body.leftEdema,
		editNeuro.edemaRight = req.body.rightEdema,
		editNeuro.movementLeft = req.body.leftMovement,
		editNeuro.movementRight = req.body.rightMovement,
		editNeuro.sensationLeft = req.body.leftSensation,
		editNeuro.sensationRight = req.body.rightSensation,
		editNeuro.painScale = req.body.painScale,
		editNeuro.numericalRatingScaleLeft = req.body.numericalRatingScaleLeft,
		editNeuro.numericalRatingScaleRight = req.body.numericalRatingScaleRight,
		editNeuro.characteristicLeft = req.body.leftCharacteristic,
		editNeuro.characteristicRight = req.body.rightCharacteristic
		editNeuro.save();
	});
	res.redirect('/master/neuro');
})
//Delete Neurovascular information
router.delete('/del-neuro/:neuroID', ensureAuthenticated, ensureAuthorised, (req, res) => {
	MasterNeuro.deleteOne({neuroID: req.params.neuroID}, function(err) {
		if (err) {
			console.log('cannot delete Neurovascular details');
		}
	});
	res.redirect('/master/neuro');
})

//END OF Neurovascular

//start of CLC

router.get('/clc', ensureAuthenticated, ensureAuthorised, (req, res) => {
	MasterGcs.find({ patientID: req.session.patient.patientID }).sort({'datetime':1}).then(newGcs => {
		MasterClcVital.find({ patientID: req.session.patient.patientID }).sort({'datetime':1}).then(newclcvital => {
			MasterPupils.find({ patientID: req.session.patient.patientID }).sort({'datetime':1}).then(newpupils => {	
				MasterMotorStrength.find({ patientID: req.session.patient.patientID }).sort({'datetime':1}).then(newmotorstrength => {			

					clcsample = [];
					clcsampleDate = [];
					let gcsFlow = Object.assign([], newGcs);
					let clcvitalFlow = Object.assign([], newclcvital);
					let pupilsFlow = Object.assign([], newpupils);
					let motorstrengthFlow = Object.assign([], newmotorstrength);
					gcsCount = -1;
					clcvitalCount = -1;
					pupilsCount = -1;
					motorstrengthCount = -1;
					ionoRecord = 'No existing record';

					newGcs.forEach(gcs => {
						if (!(clcsample.includes(gcs.datetime))) {
							clcsample.push(gcs.datetime);
							clcsampleDate.push(gcs.date);
						}
					});
					newclcvital.forEach(clcvital => {
						if (!(clcsample.includes(clcvital.datetime))) {
							clcsample.push(clcvital.datetime);
							clcsampleDate.push(clcvital.date);
						}
					});
					newpupils.forEach(pupils => {
						if (!(clcsample.includes(pupils.datetime))){
							clcsample.push(pupils.datetime);
							clcsampleDate.push(pupils.date);
						}
					});

					newmotorstrength.forEach(motorstrength => {
						if (!(clcsample.includes(motorstrength.datetime))) {
							clcsample.push(motorstrength.datetime);
							clcsampleDate.push(motorstrength.date);
						}
					});
		
						
					clcsample.sort();
					clcsampleDate.sort();

					for (i = 0; i < clcsample.length; i++) {
						

						//Counter for empty data
						//.length here refers to last index of the array
						if (gcsCount !== (gcsFlow.length - 1)) {
							gcsCount++;
						}

						if (clcvitalCount !== (clcvitalFlow.length - 1)) {
							clcvitalCount++;
						}

						if (pupilsCount !== (pupilsFlow.length - 1)) {
							pupilsCount++;
						}

						if (motorstrengthCount !== (motorstrengthFlow.length - 1)) {
							motorstrengthCount++;
						}
						

						//Insert empty data when value doesnt match
						//Count here does the index count of flow array
						if(gcsFlow !='') 
						{
							if (clcsample[i] < gcsFlow[gcsCount].datetime) {
								gcsFlow.splice(gcsCount, 0, {datetime: ''});
							} else if (clcsample[i] > gcsFlow[gcsCount].datetime) {
								gcsFlow.splice(gcsCount + 1, 0, {datetime: ''});
							}
						} 
						else
						{
							gcsFlow.push({datetime: '', eyeopen: ionoRecord});
						}

						if(clcvitalFlow !='') 
						{
							if (clcsample[i] < clcvitalFlow[clcvitalCount].datetime) {
								clcvitalFlow.splice(clcvitalCount, 0, {datetime: ''});
							} else if (clcsample[i] > clcvitalFlow[clcvitalCount].datetime) {
								clcvitalFlow.splice(clcvitalCount + 1, 0, {datetime: ''});
							}
						} 
						else
						{
							clcvitalFlow.push({datetime: '', heartRate: ionoRecord});
						}

						if(pupilsFlow !='') 
						{
							if (clcsample[i] < pupilsFlow[pupilsCount].datetime) {
								pupilsFlow.splice(pupilsCount, 0, {datetime: ''});
							} else if (clcsample[i] > pupilsFlow[pupilsCount].datetime) {
								pupilsFlow.splice(pupilsCount + 1, 0, {datetime: ''});
							}
						} 
						else 
						{
							pupilsFlow.push({datetime: '', sizeright: ionoRecord});
						}

						if(motorstrengthFlow !='')
						{
							if (clcsample[i] < motorstrengthFlow[motorstrengthCount].datetime) {
								motorstrengthFlow.splice(motorstrengthCount, 0, {datetime: ''});
							} else if (clcsample[i] > motorstrengthFlow[motorstrengthCount].datetime) {
								motorstrengthFlow.splice(motorstrengthCount + 1, 0, {datetime: ''});
							}
						}
						else 
						{
							motorstrengthFlow.push({datetime: '', strengthrightarm: ionoRecord});
						}
					};

					res.render('charts/master/charts-clc', {
						clcsampleDate: clcsample,
						gcsFlow: gcsFlow,
						clcvitalFlow: clcvitalFlow,
						pupilsFlow: pupilsFlow,
						motorstrengthFlow: motorstrengthFlow,
						newGcs: newGcs,
						newpupils: newpupils,
						newclcvital: newclcvital,
						newmotorstrength: newmotorstrength,
						patient: req.session.patient,
						showMenu: true
          			})
				})
			})
		});
	})
})


//add gcs info
router.post('/add-gcs', ensureAuthenticated, ensureAuthorised, (req, res) => {
	gcsID = (new standardID('AAA0000')).generate();
	datetime = moment(req.body.dateGcs, 'DD/MM/YYYY').format('MM/DD/YYYY') + " " + req.body.timeGcs;
	
	totalgcs = parseInt(req.body.eyeopen.slice(-1))
	+ parseInt(req.body.bestverbal.slice(-1)) 
	+ parseInt(req.body.bestmotor.slice(-1));

	spliteyeopen = removeNumber.removeNumberFunction(req.body.eyeopen);
	splitbestverbal = removeNumber.removeNumberFunction(req.body.bestverbal);
	splitbestmotor = removeNumber.removeNumberFunction(req.body.bestmotor);

	new MasterGcs({
		patientID: req.session.patient.patientID,
		gcsID: gcsID,
		date:	moment(req.body.dateGcs, 'DD/MM/YYYY').format('YYYY-MM-DD'),
		time: req.body.timeGcs,
		datetime: datetime,
		eyeopen: req.body.eyeopen,
		bestverbal: req.body.bestverbal,
		bestmotor: req.body.bestmotor,

		spliteyeopen:spliteyeopen,
		splitbestverbal:splitbestverbal,
		splitbestmotor:splitbestmotor,

		totalgcs: totalgcs,

	}).save();

	res.redirect('/master/clc');
})

//Delete gcs information
router.delete('/del-gcs/:gcsID', ensureAuthenticated, ensureAuthorised, (req, res) => {
	MasterGcs.deleteOne({gcsID: req.params.gcsID}, function(err) {
		if (err) {
			console.log('cannot delete GCS details');
		}
	});
	res.redirect('/master/clc');
})

//edit gcs informations
router.put('/edit-gcs/:gcsID', ensureAuthenticated, ensureAuthorised, (req,res) => {
	datetime = moment(req.body.dateGcs, 'DD/MM/YYYY').format('MM/DD/YYYY') + " " + req.body.timeGcs;
	
	totalgcs = parseInt(req.body.eyeopen.slice(-1))
	+ parseInt(req.body.bestverbal.slice(-1)) 
	+ parseInt(req.body.bestmotor.slice(-1));

	spliteyeopen = removeNumber.removeNumberFunction(req.body.eyeopen);
	splitbestverbal = removeNumber.removeNumberFunction(req.body.bestverbal);
	splitbestmotor = removeNumber.removeNumberFunction(req.body.bestmotor);

	MasterGcs.findOne({ gcsID: req.params.gcsID }).then(editGcs => {
		editGcs.date = moment(req.body.dateGcs, 'DD/MM/YYYY').format('YYYY-MM-DD'),
		editGcs.time = req.body.timeGcs,
		editGcs.datetime = datetime,
		editGcs.eyeopen = req.body.eyeopen,
		editGcs.bestverbal = req.body.bestverbal,
		editGcs.bestmotor = req.body.bestmotor,
		editGcs.totalgcs = totalgcs,

		editGcs.spliteyeopen = spliteyeopen,
		editGcs.splitbestverbal = splitbestverbal,
		editGcs.splitbestmotor = splitbestmotor,
		editGcs.save();
	});
	res.redirect('/master/clc');
})

//get single gcs info
router.get('/clc-gcs/:gcsID', ensureAuthenticated, ensureAuthorised, (req, res) => {
	MasterGcs.find({ patientID: req.session.patient.patientID }).sort({'datetime':1}).then(newGcs => {
		MasterGcs.findOne({ gcsID: req.params.gcsID }).then(editGcs => {

			editGcs.date = moment(editGcs.date, 'YYYY-MM-DD').format('DD/MM/YYYY');
			res.render('charts/master/charts-clc', {
				newGcs: newGcs,
				editGcs: editGcs,
				patient: req.session.patient,
				showMenu: true			
			})
		})
	})
})
//clc vital
//add clcvital info
router.post('/add-clcvital', ensureAuthenticated, ensureAuthorised, (req, res) => {
	clcvitalID = (new standardID('AAA0000')).generate();
	datetime = moment(req.body.dateclcvital, 'DD/MM/YYYY').format('MM/DD/YYYY') + " " + req.body.timeclcvital;
	
	bloodp = req.body.sbp + "/" + req.body.dbp;
	new  MasterClcVital({
		patientID: req.session.patient.patientID,
		clcvitalID: clcvitalID,
		date:	moment(req.body.dateclcvital, 'DD/MM/YYYY').format('YYYY-MM-DD'),
		time: req.body.timeclcvital,
		datetime: datetime,
		heartRate: req.body.heartRate,
		resp: req.body.resp,
		sbp: req.body.sbp,
		dbp: req.body.dbp,
		bloodp: bloodp,

	}).save();

	res.redirect('/master/clc');
})

//Delete clcvital information
router.delete('/del-clcvital/:clcvitalID', ensureAuthenticated, ensureAuthorised, (req, res) => {
	MasterClcVital.deleteOne({clcvitalID: req.params.clcvitalID}, function(err) {
		if (err) {
			console.log('cannot delete Vital details');
		}
	});
	res.redirect('/master/clc');
})

//edit clcvital informations
router.put('/edit-clcvital/:clcvitalID', ensureAuthenticated, ensureAuthorised, (req,res) => {
	datetime = moment(req.body.dateclcvital, 'DD/MM/YYYY').format('MM/DD/YYYY') + " " + req.body.timeclcvital;
	bloodp = req.body.sbp + "/" + req.body.dbp;

	MasterClcVital.findOne({ clcvitalID: req.params.clcvitalID }).then(editclcvital => {
		editclcvital.date = moment(req.body.dateclcvital, 'DD/MM/YYYY').format('YYYY-MM-DD'),
		editclcvital.time = req.body.timeclcvital,
		editclcvital.datetime = datetime,
		editclcvital.heartRate = req.body.heartRate,
		editclcvital.resp = req.body.resp,
		editclcvital.sbp = req.body.sbp,
		editclcvital.dbp = req.body.dbp,
		editclcvital.bloodp = bloodp,

		editclcvital.save();
	});
	res.redirect('/master/clc');
})

//get single clcvital info
router.get('/clc-vital/:clcvitalID', ensureAuthenticated, ensureAuthorised, (req, res) => {
	MasterClcVital.find({ patientID: req.session.patient.patientID }).sort({'datetime':1}).then(newclcvital => {
		MasterClcVital.findOne({ clcvitalID: req.params.clcvitalID }).then(editclcvital => {

			editclcvital.date = moment(editclcvital.date, 'YYYY-MM-DD').format('DD/MM/YYYY');
			res.render('charts/master/charts-clc', {
				newclcvital: newclcvital,
				editclcvital: editclcvital,
				patient: req.session.patient,
				showMenu: true			
			})
		})
	})
})

//start PUPILS
//add pupils info
router.post('/add-pupils', ensureAuthenticated, ensureAuthorised, (req, res) => {
	pupilsID = (new standardID('AAA0000')).generate();
	datetime = moment(req.body.datepupils, 'DD/MM/YYYY').format('MM/DD/YYYY') + " " + req.body.timepupils;
	
	new  MasterPupils({
		patientID: req.session.patient.patientID,
		pupilsID: pupilsID,
		date:	moment(req.body.datepupils, 'DD/MM/YYYY').format('YYYY-MM-DD'),
		time: req.body.timepupils,
		datetime: datetime,
		sizeright: req.body.sizeright,
		sizeleft: req.body.sizeleft,
		reactionright: req.body.reactionright,
		reactionleft: req.body.reactionleft,

	}).save();

	res.redirect('/master/clc');
})

//Delete pupils information
router.delete('/del-pupils/:pupilsID', ensureAuthenticated, ensureAuthorised, (req, res) => {
	MasterPupils.deleteOne({pupilsID: req.params.pupilsID}, function(err) {
		if (err) {
			console.log('cannot delete Pupils details');
		}
	});
	res.redirect('/master/clc');
})

//edit pupils informations
router.put('/edit-pupils/:pupilsID', ensureAuthenticated, ensureAuthorised, (req,res) => {
	datetime = moment(req.body.datepupils, 'DD/MM/YYYY').format('MM/DD/YYYY') + " " + req.body.timepupils;

	MasterPupils.findOne({ pupilsID: req.params.pupilsID }).then(editpupils => {
		editpupils.date = moment(req.body.datepupils, 'DD/MM/YYYY').format('YYYY-MM-DD'),
		editpupils.time = req.body.timepupils,
		editpupils.datetime = datetime,
		editpupils.sizeright = req.body.sizeright,
		editpupils.sizeleft = req.body.sizeleft,
		editpupils.reactionright = req.body.reactionright,
		editpupils.reactionleft = req.body.reactionleft,

		editpupils.save();
	});
	res.redirect('/master/clc');
})

//get single pupils info
router.get('/clc-pupils/:pupilsID', ensureAuthenticated, ensureAuthorised, (req, res) => {
	MasterPupils.find({ patientID: req.session.patient.patientID }).sort({'datetime':1}).then(newpupils => {
		MasterPupils.findOne({ pupilsID: req.params.pupilsID }).then(editpupils => {

			editpupils.date = moment(editpupils.date, 'YYYY-MM-DD').format('DD/MM/YYYY');
			res.render('charts/master/charts-clc', {
				newpupils: newpupils,
				editpupils: editpupils,
				patient: req.session.patient,
				showMenu: true			
			})
		})
	})
})
//start motor strength
//add motor strength info
router.post('/add-motorstrength', ensureAuthenticated, ensureAuthorised, (req, res) => {
	motorstrengthID = (new standardID('AAA0000')).generate();
	datetime = moment(req.body.datemotorstrength, 'DD/MM/YYYY').format('MM/DD/YYYY') + " " + req.body.timemotorstrength;
	
	totalms = parseInt(req.body.strengthrightarm.slice(-1))
	+ parseInt(req.body.strengthleftarm.slice(-1)) 
	+ parseInt(req.body.strengthrightleg.slice(-1))
	+ parseInt(req.body.strengthleftleg.slice(-1));

	// splitstrengthrightarm = removeNumber.removeNumberFunction(req.body.strengthrightarm);
	// splitstrengthleftarm = removeNumber.removeNumberFunction(req.body.strengthleftarm);
	// splitstrengthrightleg = removeNumber.removeNumberFunction(req.body.strengthrightleg);
	// splitstrengthleftleg = removeNumber.removeNumberFunction(req.body.strengthleftleg);
	
	new  MasterMotorStrength({
		patientID: req.session.patient.patientID,
		motorstrengthID: motorstrengthID,
		date:	moment(req.body.datemotorstrength, 'DD/MM/YYYY').format('YYYY-MM-DD'),
		time: req.body.timemotorstrength,
		datetime: datetime,
		strengthrightarm: req.body.strengthrightarm,
		strengthleftarm: req.body.strengthleftarm,
		strengthrightleg: req.body.strengthrightleg,
		strengthleftleg: req.body.strengthleftleg,

		// splitstrengthrightarm: splitstrengthrightarm,
		// splitstrengthleftarm: splitstrengthleftarm,
		// splitstrengthrightleg: splitstrengthrightleg,
		// splitstrengthleftleg: splitstrengthleftleg,
		
		totalms: totalms,

	}).save();

	res.redirect('/master/clc');
})

//Delete motor strength information
router.delete('/del-motorstrength/:motorstrengthID', ensureAuthenticated, ensureAuthorised, (req, res) => {
	MasterMotorStrength.deleteOne({motorstrengthID: req.params.motorstrengthID}, function(err) {
		if (err) {
			console.log('Cannot delete Motor Strength details');
		}
	});
	res.redirect('/master/clc');
})

//edit motorstrength informations
router.put('/edit-motorstrength/:motorstrengthID', ensureAuthenticated, ensureAuthorised, (req,res) => {
	datetime = moment(req.body.datemotorstrength, 'DD/MM/YYYY').format('MM/DD/YYYY') + " " + req.body.timemotorstrength;
	
	totalms = parseInt(req.body.strengthrightarm.slice(-1))
	+ parseInt(req.body.strengthleftarm.slice(-1)) 
	+ parseInt(req.body.strengthrightleg.slice(-1))
	+ parseInt(req.body.strengthleftleg.slice(-1));

	// splitstrengthrightarm = removeNumber.removeNumberFunction(req.body.strengthrightarm);
	// splitstrengthleftarm = removeNumber.removeNumberFunction(req.body.strengthleftarm);
	// splitstrengthrightleg = removeNumber.removeNumberFunction(req.body.strengthrightleg);
	// splitstrengthleftleg = removeNumber.removeNumberFunction(req.body.strengthleftleg);

	MasterMotorStrength.findOne({ motorstrengthID: req.params.motorstrengthID }).then(editmotorstrength => {
		editmotorstrength.date = moment(req.body.datemotorstrength, 'DD/MM/YYYY').format('YYYY-MM-DD'),
		editmotorstrength.time = req.body.timemotorstrength,
		editmotorstrength.datetime = datetime,
		editmotorstrength.strengthrightarm = req.body.strengthrightarm,
		editmotorstrength.strengthleftarm = req.body.strengthleftarm,
		editmotorstrength.strengthrightleg = req.body.strengthrightleg,
		editmotorstrength.strengthleftleg = req.body.strengthleftleg,
		editmotorstrength.totalms = totalms,
		
		// editmotorstrength.splitstrengthrightarm = splitstrengthrightarm,
		// editmotorstrength.splitstrengthleftarm = splitstrengthleftarm,
		// editmotorstrength.splitstrengthrightleg = splitstrengthrightleg,
		// editmotorstrength.splitstrengthleftleg = splitstrengthleftleg,
		

		editmotorstrength.save();
	});
	res.redirect('/master/clc');
})

//get single motor strength info
router.get('/clc-motorstrength/:motorstrengthID', ensureAuthenticated, ensureAuthorised, (req, res) => {
	MasterMotorStrength.find({ patientID: req.session.patient.patientID }).sort({'datetime':1}).then(newmotorstrength => {
		MasterMotorStrength.findOne({ motorstrengthID: req.params.motorstrengthID }).then(editmotorstrength => {

			editmotorstrength.date = moment(editmotorstrength.date, 'YYYY-MM-DD').format('DD/MM/YYYY');
			res.render('charts/master/charts-clc', {
				newmotorstrength: newmotorstrength,
				editmotorstrength: editmotorstrength,
				patient: req.session.patient,
				showMenu: true			
			})
		})
	})
})
//FEEDING REGIME
// Open Feeding regime page
router.get('/FeedingRegime', ensureAuthenticated, ensureAuthorised, (req, res) => {
	MasterFeedingRegime.find({user:{'$ne':req.user.id}, masterpatientID: req.session.patient.patientID})
	.then(newFeeding => {//(other record)
		MasterFeedingRegime.findOne({ patientID: req.session.patient.patientID})
		.then(newOtherFeeding =>{ //(your own record)
			// console.log("Yikes: " + newOtherHistory.length);
			// console.log("Yikes: " + req.user);
			//MasterFeedingRegime.findOne({patientID: req.session.patient.patientID})
			//.then(editFeeding => {
			MasterScheduleFeed.find({ masterpatientID: req.session.patient.patientID })	
			.then(newOtherScheduleFeed =>{	
				res.render('charts/master/charts-feeding-regime', {
					newFeeding: newFeeding,
					//editFeeding: editFeeding,
					newOtherScheduleFeed: newOtherScheduleFeed,
					checkifEmpty: true,
					patient: req.session.patient,
					currentName: req.user.firstName,
					newOtherFeeding:newOtherFeeding,
					showMenu: true
				});
			//}
			 //})
			})
		})
	})
})

//Add Feeding
router.post('/add-feeding-regime', ensureAuthenticated, ensureAuthorised, (req, res) => {
	feedID = (new standardID('AAA0000')).generate();
	datetime = moment(req.body.dateFeeding, 'DD/MM/YYYY').format('MM/DD/YYYY') + " " + req.body.timeFeeding;
	
	console.log("Feeding Regime ADD NEW");
	
	new MasterFeedingRegime({
		// user: req.user.id,
		patientID: req.session.patient.patientID,
		date:moment(req.body.dateFeeding, 'DD/MM/YYYY').format('YYYY-MM-DD'),
		time: req.body.timeFeeding,
		datetime: datetime,
		typeofFormula: req.body.typeofFormula,
		enteralFeed: req.body.enteralFeed,
		ordersFeed: req.body.ordersFeed,
		masterpatientID: req.session.patient.patientID,
		by: req.user.firstName,
		feedID: feedID,
	}).save();
		res.redirect('/master/FeedingRegime');
})

	
//One Feeding Regime by ID
router.get('/FeedingRegime/:feedID/:name', ensureAuthenticated, ensureAuthorised, (req,res) => {
	
	MasterFeedingRegime.find({ user:{'$ne':req.user.id}, masterpatientID: req.session.patient.patientID})
	.then(newFeeding => {
		MasterFeedingRegime.findOne({ patientID: req.session.patient.patientID})
		.then(newOtherFeeding =>{//(your own record) you need this (if you only put in the /HistoryTaking, this route do not know the newOtherHistory)
			MasterFeedingRegime.findOne({ feedID: req.params.feedID }).then(editFeeding =>{
				
				var name = req.params.name;
				
				editFeeding.date = moment(editFeeding.date, 'YYYY-MM-DD').format('DD/MM/YYYY');

				res.render('charts/master/charts-feeding-regime',{
					newFeeding:newFeeding,
					editFeeding: editFeeding,
					newOtherFeeding:newOtherFeeding,
					patient: req.session.patient,
					checkifEmpty: false,
					currentName: req.user.firstName,
					by: name,
					showMenu: true
				})
			})
		});
	})
})

//Edit the FeedingRegime
router.put('/edit-feeding-regime/:feedID/:name', ensureAuthenticated, ensureAuthorised, (req,res) => {
	datetime = moment(req.body.dateFeeding, 'DD/MM/YYYY').format('MM/DD/YYYY') + " " + req.body.timeFeeding;

	MasterFeedingRegime.findOne({ patientID:  req.session.patient.patientID,feedID: req.params.feedID})
	.then(editFeeding => {
		
		editFeeding.date = moment(req.body.dateFeeding, 'DD/MM/YYYY').format('YYYY-MM-DD'),
		editFeeding.time = req.body.timeFeeding,
		editFeeding.datetime = datetime,
		editFeeding.masterpatientID = req.session.patient.patientID,
		editFeeding.patientID = req.session.patient.patientID,
		editFeeding.typeofFormula = req.body.typeofFormula,
		editFeeding.enteralFeed = req.body.enteralFeed,
		editFeeding.ordersFeed = req.body.ordersFeed,
		
		editFeeding.save();
	});
	res.redirect("/master/FeedingRegime");
})

//Schedule Feed
// Open Schedule Feed page
router.get('/ScheduleFeeding', ensureAuthenticated, ensureAuthorised, (req, res) => {

	MasterScheduleFeed.find({user:{'$ne':req.user.id}, masterpatientID: req.session.patient.patientID})
	.sort({'datetime': -1 }).then(newSchedule => {//(other record)
		// MasterScheduleFeed.findOne({ patientID: req.session.patient.patientID})
		// .then(newOtherScheduleFeed =>{ //(your own record)
			// console.log("Yikes: " + newOtherHistory.length);
			// console.log("Yikes: " + req.user);
			//MasterFeedingRegime.findOne({patientID: req.session.patient.patientID})
			//.then(editFeeding => {
				res.render('charts/master/charts-feeding-regime', {
					newSchedule: newSchedule,
					//editFeeding: editFeeding,
					checkifEmpty: true,
					patient: req.session.patient,
					currentName: req.user.firstName,
					// newOtherScheduleFeed: newOtherScheduleFeed,
					showMenu: true
				});
			//}
	 		//})
		})
	})
// })

//Add Schedule Feeding
router.post('/add-schedule', ensureAuthenticated, ensureAuthorised, (req, res) => {
	scheduleID = (new standardID('AAA0000')).generate();
	datetime = moment(req.body.dateSchedule, 'DD/MM/YYYY').format('MM/DD/YYYY') + " " + req.body.timeSchedule;
	
	console.log("Schedule ADD NEW");
	
	new MasterScheduleFeed({
		// user: req.user.id,
		patientID: req.session.patient.patientID,
		date:moment(req.body.dateSchedule, 'DD/MM/YYYY').format('YYYY-MM-DD'),
		time: req.body.timeSchedule,
		datetime: datetime,
		scheduleFeed: req.body.scheduleFeed,
		scheduleAmt: req.body.scheduleAmt,
		scheduleFlush: req.body.scheduleFlush,
		masterpatientID: req.session.patient.patientID,
		by: req.user.firstName,
		scheduleID: scheduleID,
	}).save();
		res.redirect('/master/ScheduleFeeding');
})

	
//One Schedule Feed by ID
router.get('/ScheduleFeeding/:scheduleID/:name', ensureAuthenticated, ensureAuthorised, (req,res) => {
	
	MasterScheduleFeed.find({ user:{'$ne':req.user.id}, masterpatientID: req.session.patient.patientID})
	.then(newSchedule => {
		MasterScheduleFeed.findOne({ patientID: req.session.patient.patientID})
		.sort({'datetime': -1 }).then(newOtherScheduleFeed =>{//(your own record) you need this (if you only put in the /HistoryTaking, this route do not know the newOtherHistory)
			MasterScheduleFeed.findOne({ scheduleID: req.params.scheduleID })
			.then(editSchedule =>{		
				var name = req.params.name;
				
				editSchedule.date = moment(editSchedule.date, 'YYYY-MM-DD').format('DD/MM/YYYY');

				res.render('charts/master/charts-feeding-regime',{
					newSchedule: newSchedule,
					editSchedule: editSchedule,
					newOtherScheduleFeed: newOtherScheduleFeed,
					patient: req.session.patient,
					checkifEmpty: false,
					currentName: req.user.firstName,
					by: name,
					showMenu: true
				})
			});
		});
	})
})

//Edit the Schedule Feed
router.put('/edit-schedule/:scheduleID/:name', ensureAuthenticated, ensureAuthorised, (req,res) => {
	datetime = moment(req.body.dateSchedule, 'DD/MM/YYYY').format('MM/DD/YYYY') + " " + req.body.timeSchedule;

	MasterScheduleFeed.findOne({ patientID:  req.session.patient.patientID,scheduleID: req.params.scheduleID})
	.then(editSchedule => {
		editSchedule.date = moment(req.body.dateSchedule, 'DD/MM/YYYY').format('YYYY-MM-DD'),
		editSchedule.time = req.body.timeSchedule,
		editSchedule.datetime = datetime,
		editSchedule.masterpatientID = req.session.patient.patientID,
		editSchedule.patientID = req.session.patient.patientID,
		editSchedule.scheduleFeed = req.body.scheduleFeed,
		editSchedule.scheduleAmt = req.body.scheduleAmt,
		editSchedule.scheduleFlush = req.body.scheduleFlush,
		
		editSchedule.save();
	});
	res.redirect("/master/ScheduleFeeding");
})
	
// Discharge Planning
router.get('/DischargePlanning', ensureAuthenticated, ensureAuthorised, (req, res) => {
	MasterDischargePlanning.find({patientID: req.session.patient.patientID}).sort({'datetime':1})
	.then(newDischargePlanning => { // discharge planning that they have created
		//console.log('req.session.user.patientID: '+ req.session.patient.patientID );
		res.render('discharge-planning/master/discharge-planning', {
			newDischargePlanning: newDischargePlanning,
			patient: req.session.patient,
			showMenu: true			
		})
	})
})
// Add Discharge Planning Record
router.post('/add-discharge-planning', ensureAuthenticated, (req, res) => {

	datetime = moment(req.body.dateDischargePlanning, 'DD/MM/YYYY').format('MM/DD/YYYY') + " " + req.body.timeDischargePlanning;
	dischargePlanningID = (new standardID('AAA0000')).generate();
	new MasterDischargePlanning({
		patientID: req.session.patient.patientID,
		dischargePlanningID: dischargePlanningID,
		datetime: datetime,
		date: moment(req.body.dateDischargePlanning, 'DD/MM/YYYY').format('YYYY-MM-DD'),
		time: req.body.timeDischargePlanning,
		// 1
		dischargeCondition: req.body.dischargeCondition,
		// 2
		dischargeTo: req.body.dischargeTo,
		dischargeToSpecify: req.body.dischargeToSpecify,
		// 3
		accompaniedBy: req.body.accompaniedBy,
		accompaniedBySpecify: req.body.accompaniedBySpecify,
		// 4
		modeOfTransport: req.body.modeOfTransport,
		modeOfTransportSpecify: req.body.modeOfTransportSpecify,
		// 5
		removalOf: req.body.removalOf,
		// 6
		checkedAndReturned: req.body.checkedAndReturned,
		checkedAndReturnedAppliancesSpecify: req.body.checkedAndReturnedAppliancesSpecify,
		checkedAndReturnedSpecify: req.body.checkedAndReturnedSpecify,
		// 7
		adviceGivenOn: req.body.adviceGivenOn,
		// Follow-up Appointment
		followUpAppointment: req.body.followUpAppointment,
		followUpAppointmentSpecify: req.body.followUpAppointmentSpecify,
		appointmentDate:  moment(req.body.appointmentDate, 'DD/MM/YYYY').format('YYYY-MM-DD'),
		appointmentTime: req.body.appointmentTime,
		clinic: req.body.clinic,
		nameOfDoctor: req.body.nameOfDoctor,
		memoGiven: req.body.memoGiven,
		remarks: req.body.remarks,
		// Special Instructions
		specialInstructionsSpecify: req.body.specialInstructionsSpecify,
		// Referrals
		referrals: req.body.referrals,
		referralsSpecify: req.body.referralsSpecify,
		// Medical Cert No
		medicalCertificateNo: req.body.medicalCertificateNo
	}).save();
	/*
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
    // 1
    dischargeCondition: {type: String, default: ''},
    // 2
    dischargeTo: {type: String, default: ''},
    dischargeToSpecify: {type: String, default: ''},
    // 3
    accompaniedBy: {type: String, default: ''},
    accompaniedBySpecify: {type: String, default: ''},
    // 4
    modeOfTransport: {type: String, default: ''},
    modeOfTransportSpecify: {type: String, default: ''},
    // 5
    removalOf: [String],
    // 6
    checkedAndReturned: [String], // checklist
    checkedAndReturnedAppliancesSpecify: {type: String, default: ''},
    checkedAndReturnedSpecify: {type: String, default: ''},
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
	*/
	res.redirect('/master/DischargePlanning');
});

// get single Discharge Planning info
router.get('/DischargePlanning/:dischargePlanningID', ensureAuthenticated, ensureAuthorised, (req, res) => {
	
	MasterDischargePlanning.find({patientID: req.session.patient.patientID}).sort({'datetime':1})
	.then(newDischargePlanning => {
		MasterDischargePlanning.findOne({dischargePlanningID: req.params.dischargePlanningID})
		.then(editDischargePlanning => {
			editDischargePlanning.date = moment(editDischargePlanning.date, 'YYYY-MM-DD').format('DD/MM/YYYY');
			
			if (editDischargePlanning.appointmentDate == "Invalid date") {
				editDischargePlanning.appointmentDate = "";
			}
			else {
				editDischargePlanning.appointmentDate = moment(editDischargePlanning.appointmentDate , 'YYYY-MM-DD').format('DD/MM/YYYY');
			}
			res.render('discharge-planning/master/discharge-planning', {
				editDischargePlanning: editDischargePlanning,
				newDischargePlanning: newDischargePlanning,
				patient: req.session.patient,
				showMenu: true
			});
		})
	});
});

// edit Discharge Planning
router.put('/edit-DischargePlanning/:dischargePlanningID', ensureAuthenticated, ensureAuthorised, (req,res) => {
	datetime = moment(req.body.dateDischargePlanning, 'DD/MM/YYYY').format('MM/DD/YYYY') + " " + req.body.timeDischargePlanning;

	MasterDischargePlanning.findOne({ dischargePlanningID: req.params.dischargePlanningID}).then(editDischargePlanning => {
		editDischargePlanning.date = moment(req.body.dateDischargePlanning, 'DD/MM/YYYY').format('YYYY-MM-DD'),
		editDischargePlanning.time = req.body.timeDischargePlanning,
		editDischargePlanning.datetime = datetime,
		// 1
		editDischargePlanning.dischargeCondition = req.body.dischargeCondition,
		// 2
		editDischargePlanning.dischargeTo = req.body.dischargeTo,
		editDischargePlanning.dischargeToSpecify = req.body.dischargeToSpecify,
		// 3
		editDischargePlanning.accompaniedBy = req.body.accompaniedBy,
		editDischargePlanning.accompaniedBySpecify = req.body.accompaniedBySpecify,
		// 4
		editDischargePlanning.modeOfTransport = req.body.modeOfTransport,
		editDischargePlanning.modeOfTransportSpecify = req.body.modeOfTransportSpecify,
		// 5
		editDischargePlanning.removalOf = req.body.removalOf,
		// 6
		editDischargePlanning.checkedAndReturned = req.body.checkedAndReturned,
		editDischargePlanning.checkedAndReturnedAppliancesSpecify = req.body.checkedAndReturnedAppliancesSpecify,
		editDischargePlanning.checkedAndReturnedSpecify = req.body.checkedAndReturnedSpecify,
		// 7
		editDischargePlanning.adviceGivenOn = req.body.adviceGivenOn,
		// Follow-up Appointment
		editDischargePlanning.followUpAppointment = req.body.followUpAppointment,
		editDischargePlanning.followUpAppointmentSpecify = req.body.followUpAppointmentSpecify,
		editDischargePlanning.appointmentDate = moment(req.body.appointmentDate, 'DD/MM/YYYY').format('YYYY-MM-DD'),
		editDischargePlanning.appointmentTime = req.body.appointmentTime,
		editDischargePlanning.clinic = req.body.clinic,
		editDischargePlanning.nameOfDoctor = req.body.nameOfDoctor,
		editDischargePlanning.memoGiven = req.body.memoGiven,
		editDischargePlanning.remarks = req.body.remarks,
		// Special Instructions
		editDischargePlanning.specialInstructionsSpecify = req.body.specialInstructionsSpecify,
		// Referrals
		editDischargePlanning.referrals = req.body.referrals,
		editDischargePlanning.referralsSpecify = req.body.referralsSpecify,
		// Medical Cert No
		editDischargePlanning.medicalCertificateNo = req.body.medicalCertificateNo

		editDischargePlanning.save();
	});
	res.redirect("/master/DischargePlanning");
})

module.exports = router;