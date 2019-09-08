const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const EMR_User = mongoose.model('emr-users');
const PatientMasterModel = mongoose.model('patient');
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

//HistoryTaking model
const MasterHistory = mongoose.model('masterHistoryTrack');
const MasterMDP = mongoose.model('masterMDP');
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
	console.log('\nFrom listPatientMaster user:');
	console.log(req.user);
	PatientMasterModel.find({user: req.user._id}) // req.user_id is assigned to user, which is then used by find
	.then(patients => {
		//toaster.setErrorMessage(' ', 'Error listing master patient records');
		// To check if user has admin rights here
		res.render('master/master-list-patients', {
			patients: patients,
			showMenu: false
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

		new MasterBraden({
			patientID: req.session.patient.patientID,
			bradenID: bradenID,
			date: req.body.dateBraden,
			datetime: datetime,
			sensePerc: req.body.sensePerc,
			moisture: req.body.moisture,
			activity: req.body.activity,
			mobility: req.body.mobility,
			nutrition: req.body.nutrition,
			fns: req.body.fns,
			total: total,


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

	MasterBraden.findOne({ bradenID: req.params.bradenID }).then(editBraden => {
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

//another history
// Open HistoryTaking page
// router.get('/HistoryTaking', ensureAuthenticated, (req, res) => {
// 	StudentHistory.find({user: req.user.id, patientID: req.session.patient.patientID})
// 	.then(newHistory => {
// 		MasterHistory.findOne().then(newMasterHistory => {
// 			res.render('HistoryTaking/student/add_HistoryTaking', {
// 				newMasterHistory: newMasterHistory,
// 				newHistory: newHistory,
// 				patient: req.session.patient,
// 				showMenu: true
// 			});
// 		});
// 	})
// })
// Open HistoryTakng page
router.get('/HistoryTaking', ensureAuthenticated, ensureAuthorised, (req, res) => {
	MasterHistory.findOne({ historyId: req.params.historyId})
	.then(newHistory => {
		res.render('HistoryTaking/master/add_HistoryTaking', {
			newHistory: newHistory,
			patient: req.session.patient,
			showMenu: true
		});
	})
})
//Add HistoryTaking
router.post('/add-history', ensureAuthenticated, ensureAuthorised, (req, res) => {
	historyId = (new standardID('AAA0000')).generate();
	new MasterHistory({
		user: req.user.id,
		patientID: req.session.patient.patientID,
		chiefComp: req.body.chiefComp,
		historyPresent: req.body.historyPresent,
		allergy: req.body.allergy,
		medicalH: req.body.medicalH,
		surgicalH: req.body.surgicalH,
		familyH: req.body.familyH,
		socialH: req.body.socialH,
		travelH: req.body.travelH,
		historyId: req.body.historyId
	}).save();
	res.redirect('/master/HistoryTaking');//PROBLEM(saved but no output)
})

// Single info of HistoryTaking by ID
// router.get('/add-history/:historyId', ensureAuthenticated, ensureAuthorised, (req, res) => {
// 	MasterHistory.find({ patientID: req.session.patient.patientID}).then(newHistory => {
// 		MasterHistory.findOne({ historyId: req.params.historyId}).then(editHistory => {
// 			res.render('HistoryTaking/master/add_HistoryTaking', {
// 				newHistory: newHistory,
// 				editHistory: editHistory,
// 				patient: req.session.patient,
// 				showMenu: true
// 			});
// 		})
// 	})
// })

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
router.get('/edit-history/:historyId', ensureAuthenticated, (req, res) => {
	
	MasterHistory.findOne({
		patientID: req.params.patientID		// gets current patient
	})
	.then(retrievedPatient => {
		if(JSON.stringify(retrievedPatient.user._id) === JSON.stringify(req.user.id)) {
			NursingAssessmentModel.findById(retrievedPatient.nursingAssessmentID,{
				// new way of calling method
			}).then(assessment => {
				//let toaster = new Toaster('Retrieving nursing assessment record');
				req.session.assessment = assessment; // save to session for saving updated info
				res.render('master/HistoryTaking', {
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


// saves edited/updated History form
router.put('/edit-history/:historyId/:patientID/:nursingAssessmentID', ensureAuthenticated, (req, res) => {
	console.log('Assessment id: ' + req.session.assessment._id);
	
	// Todo: check authorised user
	MasterHistory.findByIdAndUpdate(
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
			toaster.setSuccessMessage(' ', 'History Taking Updated');
			res.render('master/HistoryTaking', {
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
});

//END HISTORY


//open fall page
router.get('/fall', ensureAuthenticated, ensureAuthorised, (req, res) => {
	MasterFall.find({ patientID: req.session.patient.patientID }).then(newFall => {
		res.render('charts/master/charts-Fall', {
			newFall: newFall,
			patient: req.session.patient,
			showMenu: true
		});
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

	new MasterFall({
		patientID: req.session.patient.patientID,
		fallID: fallid,
		date: req.body.dateFall,
		datetime: datetime,
		history: req.body.history,
		secondary: req.body.secondary,
		ambu: req.body.ambu,
		ivhl: req.body.ivhl,
		gait: req.body.gait,
		mental: req.body.mental,
		totalmf: totalmf,


	}).save();

	res.redirect('/master/fall');
})

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
		
		MasterFall.findOne({ fallID: req.params.fallID }).then(editFall => {
			editFall.date = req.body.dateFall,
			editFall.datetime = datetime,
			editFall.history = req.body.history,
			editFall.secondary = req.body.secondary,
			editFall.ambu = req.body.ambu,
			editFall.ivhl = req.body.ivhl,
			editFall.gait = req.body.gait,
			editFall.mental = req.body.mental,
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
	datetime = moment(req.bodyiv, 'DD/MM/YYYY').format('MM/DD/YYYY') + " " + req.body.timeiv;

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
		responseIntervene: req.body.responseIntervene
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
		editPain.responseIntervene = req.body.responseIntervene

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
	datetime = moment(req.body.dateOxy, 'DD/MM/YYYY').format('MM/DD/YYYY') + " " + req.body.timeOxy;

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
	MasterMDP.find({user: req.user.id, patientID: req.session.patient.patientID})
	.then(newMDP => {
		res.render('mdp-notes/master/mdp', {
			newMDP: newMDP,
			patient: req.session.patient,
			showMenu: true
		});
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
		date: moment(req.body.dateMDP, 'DD/MM/YYYY').format('YYYY-MM-DD'),
		time: req.body.timeMDP,
		datetime: datetime,
		selectUser: req.body.selectUser,
		healthProvider: req.body.healthProvider,
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
	MasterMDP.find({ patientID: req.session.patient.patientID}).sort({'datetime':1}).then(newMDP => {
		MasterMDP.findOne({ mdpID: req.params.mdpID}).then(editMDP => {
			editMDP.date = moment(editMDP.date, 'YYYY-MM-DD').format('DD/MM/YYYY');
			res.render('mdp-notes/master/mdp', {
				newMDP: newMDP,
				editMDP: editMDP,
				patient: req.session.patient,
				showMenu: true
			});
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

		editMDP.save();
	});
	res.redirect("/master/mdp");
})

module.exports = router;