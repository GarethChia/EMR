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
const StudentMDP = mongoose.model('studentMDP');
const MasterMDP = mongoose.model('masterMDP');
//HistoryTaking
const MasterHistory = mongoose.model('masterHistoryTrack');
const StudentHistory = mongoose.model('studentHistoryTrack');
const moment = require('moment');
const alertMessage = require('../helpers/messenger');
const {ensureAuthenticated, ensureAuthorised} = require('../helpers/auth');
const toaster = require('../helpers/Toaster');

// imports standardID
const standardID = require('standardid');

/*function setAlertMessage(res, message, icon, dismissable){
 let alert = res.flashMessenger.success(message);
 alert.titleIcon = icon;
 alert.canBeDismissed = dismissable;
 }*/

// Shows list of student patient documents
router.get('/list-patients', ensureAuthenticated, (req, res) => {
	console.log('\nStudent list patient:');
	console.log(req.user);
	
	/*
	 1. Retrieve all patient records belonging to this particular student
	 2. Retrieve all master records for students to customise
	 * Note: All master patient records are retrieved in current version. In future, may only retrieve those that
	 * belong to a particular tutorial group or other criteria.
	 */
	/*PatientStudentModel.find({user: req.user._id}) // req.user_id is self generated
	 .then(studentPatients => {
	 res.render('student/student-list-patients', {
	 studentPatients: studentPatients
	 });
	 });*/
	
	PatientStudentModel.find({user: req.user._id}) // req.user_id is self generated
	.then(studentPatients => {
		PatientMasterModel.find()
		.then(patients => {
			res.render('student/student-list-patients', {
				patients: patients,
				studentPatients: studentPatients,
				toaster: req.session.toaster,
				showMenu: false
			});
			req.session.toaster = null; // reset toaster
		})
	});
});

// Retrieve and show master patient record to let Student customise
router.get('/customise/:patientID', ensureAuthenticated, (req, res) => {
	PatientMasterModel.findOne({
		patientID: req.params.patientID
	})
	.then(patient => {
		req.session.patient = patient; // Master record!!!
		/*console.log(`User id: ${req.user.id}`);
		 console.log(`Patient created by user id: ${patient.user._id}`);*/
		res.render('student/customise-patient', { // calls handlebars
			patient: patient,
			showMenu: false		// hides patient menu
		});
	});
});


// Retrieve and show customised patient record for student to edit own record
router.get('/showown/:recordID/:patientID', ensureAuthenticated, (req, res) => {
	userType = req.user.userType == 'student';
	// enable edit of nursing assessment here
	console.log(`Patient ID from Show Own: ${req.params.patientID}`);
	PatientStudentModel.findOne({
		recordID: req.params.recordID
	})
	.populate('user')
	.then(retrievedPatient => {
		// check if logged in user is owner of this patient record
		if(JSON.stringify(retrievedPatient.user._id) !== JSON.stringify(req.user.id)) {
			/*let alert = res.flashMessenger.success('Only allowed to edit own record');
			 alert.titleIcon = 'far fa-thumbs-up';
			 alert.canBeDismissed = true;*/
			//alertMessage.flashMessage(res, 'Only allowed to edit own record', 'fas fa-exclamation', true);
			toaster.setErrorMessage(' ', 'Only allowed to edit own record');
			res.redirect('/student/list-patients');
		} else {
			req.session.patient = retrievedPatient;
			res.render('student/student-edit-patient', { // calls handlebars
				recordID: req.params.recordID,
				patient: retrievedPatient,
				userType: userType,
				showMenu: true
			});
		}
	});
});


// Save student edited patient record, selected from Student Records table at the top
router.put('/save-student-edited-patient/:recordID', ensureAuthenticated, (req, res) => {
	PatientStudentModel.findOne({
		recordID: req.params.recordID
	})
	.populate('user')
	.then(studentPatient => {
		if(JSON.stringify(studentPatient.user._id) !== JSON.stringify(req.user.id)) {
			//alertMessage.flashMessage(res, 'Only allowed to edit own record', 'fas fa-exclamation', true);
			toaster.setErrorMessage(' ', 'Only allowed to edit own record');
			res.redirect('/student/list-patients');
		} else {
			// New values Biography
			//studentPatient.nric = req.body.nric;
			//studentPatient.familyName = req.body.familyName;
			//studentPatient.givenName = req.body.givenName;
			studentPatient.dateCreated = moment(new Date(), 'DD/MM/YYYY', true)
			.format();
			studentPatient.dob = moment(req.body.dob, 'DD/MM/YYYY', true)
			.format();
			studentPatient.gender = req.body.gender;
			studentPatient.weight = req.body.weight;
			studentPatient.height = req.body.height;
			studentPatient.address = req.body.address;
			studentPatient.postalCode = req.body.postalCode;
			studentPatient.mobilePhone = req.body.mobilePhone;
			studentPatient.homePhone = req.body.homePhone;
			studentPatient.officePhone = req.body.officePhone;
			// admission
			studentPatient.ward = req.body.ward;
			studentPatient.bed = req.body.bed;
			studentPatient.admDate = moment(req.body.admDate, 'DD/MM/YYYY', true)
			.format();
			studentPatient.policeCase = req.body.policeCase;
			studentPatient.admFrom = req.body.admFrom;
			studentPatient.modeOfArr = req.body.modeOfArr;
			studentPatient.accompBy = req.body.accompBy;
			studentPatient.caseNotes = req.body.caseNotes;
			studentPatient.xRaysCD = req.body.xRaysCD;
			studentPatient.prevAdm = req.body.prevAdm;
			studentPatient.condArr = req.body.condArr;
			studentPatient.otherCond = req.body.otherCond;
			studentPatient.ownMeds = req.body.ownMeds;
			studentPatient.unableAssess = req.body.unableAssess;
			studentPatient.adviceMeds = req.body.adviceMeds;
			// psycho-social
			studentPatient.emgName = req.body.emgName;
			studentPatient.emgRel = req.body.emgRel;
			studentPatient.emgMobile = req.body.emgMobile;
			studentPatient.emgHome = req.body.emgHome;
			studentPatient.emgOffice = req.body.emgOffice;
			
			studentPatient.careName = req.body.careName;
			studentPatient.careRel = req.body.careRel;
			studentPatient.careOccu = req.body.careOccu;
			studentPatient.careMobile = req.body.careMobile;
			studentPatient.careHome = req.body.careHome;
			studentPatient.careOffice = req.body.careOffice;
			
			studentPatient.accomodation = req.body.accomodation;
			studentPatient.hospConcerns = req.body.hospConcerns;
			studentPatient.spiritConcerns = req.body.spiritConcerns;
			studentPatient.prefLang = req.body.prefLang;
			studentPatient.otherLang = req.body.otherLang;
			
			
			studentPatient.save()
			.then(patient => {
				//alertMessage.flashMessage(res, 'Patient record successfully saved', 'far fa-thumbs-up', true);
				toaster.setSuccessMessage(' ', 'Patient (' + patient.givenName + ' ' + patient.familyName + ') Customised' +
					' Record Updated');
				//res.redirect('/student/list-patients');
				res.render('student/student-edit-patient', { // calls student-edie-patient.handlebars
					patient: patient,
					toaster,
					showMenu: true
				});
			});
		}
	});
});


// Save student customised master patient document to PatientStudent collection
// When student selects from Master Records table at the bottom
router.put('/save-customised-patient/:patientID', ensureAuthenticated, (req, res) => {
	/*console.log('\n/User in req: ===========');
	 console.log(req.user);*/
	recordID = req.params.patientID + '-' + (new standardID('S0000')).generate();
	console.log(recordID); 
	let patient = req.session.patient;
	console.log ('========== Nursing Assessment ID: ' +  patient.nursingAssessmentID);
	NursingAssessmentModel.findById(patient.nursingAssessmentID)
	.then(assessment => {
		new NursingAssessmentModel({
			// Neurosensory
			mentalStatus: assessment.mentalStatus,
			mentalOthers: assessment.mentalOthers,
			orientedTo: assessment.orientedTo,
			hearing: assessment.hearing,
			hearingOthers: assessment.hearingOthers,
			hearingUnable: assessment.hearingUnable,
			vision: assessment.vision,
			visionOthers: assessment.visionOthers,
			visionUnable: assessment.visionUnable,
			speech: assessment.speech,
			
			// Respiratory
			breathingPattern: assessment.breathingPattern,
			breathingRemarks: assessment.breathingRemarks,
			breathingPresence: assessment.breathingPresence, // none required
			cough: assessment.cough,
			sputum: assessment.sputum,
			
			// Circulatory
			pulse: assessment.pulse,
			cirPresence: assessment.cirPresence,
			oedema: assessment.odema,
			extremities: assessment.extremities,
			pacemaker: assessment.pacemaker,
			paceMakerManu: assessment.paceMakerManu,
			
			// Gastrointestinal
			dietType: assessment.dietType,
			dietOthers: assessment.dietOthers,
			fluidRestriction: assessment.fluidRestriction,
			fluidSpecify: assessment.fluidSpecify,
			fluidUnable: assessment.fluidUnable,
			oralCavity: assessment.oralCavity,
			oralCavityPresence: assessment.oralCavityPresence,
			oralCavityOthers: assessment.oralCavityOthers,
			
			// Elimination
			bowel: assessment.bowel,		// none required
			bowelOthers: assessment.bowelOthers,
			urinaryAppearance: assessment.urinaryAppearance,
			urinaryRemarks: assessment.urinaryRemarks,
			urinaryPresence: assessment.urinaryPresence,	// none required
			urinaryOthers: assessment.urinaryOthers,
			adaptiveAids: assessment.adaptiveAids,		// none required
			catType: assessment.catType,
			catSize: assessment.catSize,
			dayLastChanged: assessment.dayLastChanged,
			
			// Sleep
			sleep: assessment.sleep,
			sleepSpecify: assessment.sleepSpecify,
			
			// Pain Assessment
			painPresent: assessment.painPresent,
			painScale: assessment.painScale,
			behavioural: assessment.behavioural,
			onset: assessment.onset,
			location: assessment.location,
			characteristic: assessment.characteristic,
			symptoms: assessment.symptoms,
			factors: assessment.factors,
			treatment: assessment.treatment,
		}).save()
		.then(assessment => {
			console.log('New Assessment saved : ' + assessment);
			EMR_User.findById(req.user._id)	// findById is Mongoose utility method
			.then(user => {
				/*console.log('\n/addPatient user found: ===========');
				 console.log(user);
				 */
				new PatientStudentModel({
					recordID: recordID,
					patientID: req.params.patientID,
					user: user._id,
					nursingAssessmentID: assessment._id,
					nric: req.body.nric,
					
					familyName: req.body.familyName,
					givenName: req.body.givenName,
					dob: moment(req.body.dob, 'DD/MM/YYYY', true).format(),
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
					admDate: moment(req.body.admDate, 'DD/MM/YYYY', true).format(),
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
				})
				.save()
				.then(user => {
					MasterVital.find({ patientID: req.params.patientID }).then(vitalData => {
						MasterPain.find({ patientID: req.params.patientID }).then(painData => {
							MasterOxygen.find({ patientID: req.params.patientID }).then(oxyData => {
								MasterWH.find({ patientID: req.params.patientID }).then(whData => {
									
									vitalData.forEach(vital => {
										new MasterVital({
											patientID: recordID,
											vitalID: (new standardID('AAA0000')).generate(),
											userID: req.user.id,
											date: vital.date,
											time: vital.time,
											datetime: vital.datetime,
											temp: vital.temp,
											tempRoute: vital.tempRoute,
											heartRate: vital.heartRate,
											resp: vital.resp,
											sbp: vital.sbp,
											dbp: vital.dbp,
											sbpArterial: vital.sbpArterial,
											dbpArterial: vital.dbpArterial,
											bPressure: vital.bPressure,
											arterialBP: vital.arterialBP,
											bpLocation: vital.bpLocation,
											bpMethod: vital.bpMethod,
											patientPosition: vital.patientPosition,
											userType: req.user.userType
										}).save();
									})

									painData.forEach(pain => {
										new MasterPain({
											patientID: recordID,
											painID: (new standardID('AAA0000')).generate(),
											userType: req.user.userType,
											datetime: pain.datetime,
											date: pain.date,
											time: pain.time,
											painScale: pain.painScale,
											painScore: pain.painScore,
											onset: pain.onset,
											location: pain.location,
											duration: pain.duration,
											characteristics: pain.characteristics,
											associatedSymp: pain.associatedSymp,
											aggravatingFact: pain.aggravatingFact,
											relievingFact: pain.relievingFact,
											painIntervene: pain.painIntervene,
											responseIntervene: pain.responseIntervene
										}).save();
									})

									oxyData.forEach(oxy => {
										new MasterOxygen({
											patientID: recordID,
											oxygenID: (new standardID('AAA0000')).generate(),
											userType: req.user.userType,
											datetime: oxy.datetime,
											date: oxy.date,
											time: oxy.time,
											o2Device: oxy.o2Device,
											humidifier: oxy.humidifier,
											o2Amt: oxy.o2Amt,
											fio2: oxy.fio2,
											spo2: oxy.spo2
										}).save();
									})

									whData.forEach(wh => {
										new MasterWH({
											patientID:recordID,
											whID: (new standardID('AAA0000')).generate(),
											userType: req.user.userType,
											datetime: wh.datetime,
											date: wh.date,
											time: wh.time,
											height: wh.height,
											heightEst: wh.heightEst,
											weight: wh.weight,
											weightEst: wh.weightEst,
											bsa: wh.bsa,
											bmi: wh.bmi
										}).save();
									})
								}).then(vitalSuccess => {
									DoctorOrders.find({ patientID: req.params.patientID }).then(docOrders => {
										docOrders.forEach(orders => {
											new DoctorOrders({
												patientID: recordID,
												orderID: (new standardID('AAA0000')).generate(),
												userType: req.user.userType,
												datetime: orders.datetime,
												date: orders.date,
												time: orders.time,
												orders: orders.orders,
												status: orders.status,
												uploadUrl: orders.uploadUrl
											}).save();
										})
									}).then(orders => {
										MasterIO.find({ patientID: req.params.patientID }).then(ioDatas => {
											MasterEnteral.find({ patientID: req.params.patientID }).then(enteralDatas => {
												MasterIV.find({ patientID: req.params.patientID }).then(ivDatas => {
													MasterOutput.find({ patientID: req.params.patientID }).then(outputDatas => {
														
														ioDatas.forEach(io => {
															new MasterIO({
																patientID: recordID,
																ioID: (new standardID('AAA0000')).generate(),
																date: io.date,
																time: io.time,
																datetime: io.datetime,
																intakefood: io.intakefood,
																foodtype: io.foodtype,
																foodportion: io.foodportion,
																fluidtype: io.fluidtype,
																fluidportion: io.fluidportion
															}).save();
														})

														enteralDatas.forEach(enteral => {
															new MasterEnteral({
																patientID: recordID,
																enteralID: (new standardID('AAA0000')).generate(),
																date: enteral.date,
																time: enteral.time,
																datetime: enteral.datetime,
																enteralfeed: enteral.enteralfeed,
																formula: enteral.formula,
																feedamt: enteral.feedamt,
																flush: enteral.flush	
															}).save();
														})

														ivDatas.forEach(iv => {
															new MasterIV({
																patientID: recordID,
																ivID: (new standardID('AAA0000')).generate(),
																date: iv.date,
																time: iv.time,
																datetime: iv.datetime,
																coninf: iv.coninf,
																conamt: iv.conamt,
																intinf: iv.intinf,
																amtinf: iv.amtinf,
																ivflush: iv.ivflush
															}).save();
														})

														outputDatas.forEach(output => {
															new MasterOutput({
																patientID: recordID,
																outputID: (new standardID('AAA0000')).generate(),
																date: output.date,
																time: output.time,
																datetime: output.datetime,
																urineamt: output.urineamt,
																urineass: output.urineass,
																stoolamt: output.stoolamt,
																stoolass: output.stoolass,
																vomitamt: output.vomitamt,
																vomitass: output.vomitass,
																bloodamt: output.bloodamt,
																diaper: output.diaper,
																otheramt: output.otheramt,
																otherass: output.otherass
															}).save();
														})
													}).then(ioSuccess => {
														MasterBraden.find({ patientID: req.params.patientID }).then(bradenData => {
															bradenData.forEach(braden => {
																new MasterBraden({
																	patientID: recordID,
																	bradenID: (new standardID('AAA0000')).generate(),
																	date: braden.date,
																	datetime: braden.datetime,
																	sensePerc: braden.sensePerc,
																	moisture: braden.moisture,
																	activity: braden.activity,
																	mobility: braden.mobility,
																	nutrition: braden.nutrition,
																	fns: braden.fns,
																	total: braden.total
																}).save();
															})
														}).then(bradenSuccess => {
															MasterFall.find({ patientID: req.params.patientID }).then(fallData => {
																fallData.forEach(fall => {
																	new MasterFall({
																		patientID: recordID,
																		fallID: (new standardID('AAA0000')).generate(),
																		date: fall.date,
																		datetime: fall.datetime,
																		history: fall.history,
																		secondary: fall.secondary,
																		ambu: fall.ambu,
																		ivhl: fall.ivhl,
																		gait: fall.gait,
																		mental: fall.mental,
																		totalmf: fall.totalmf
																	}).save();
																})
															}).then(newStudentPatient => {
																
																/*let alert = res.flashMessenger.success('New student patient record added');
																 alert.titleIcon = 'far fa-thumbs-up';
																 alert.canBeDismissed = true;
																 */
																//req.session.patient = newStudentPatient;
																//alertMessage.flashMessage(res, 'New student patient record added', 'far fa-thumbs-up', true);
																toaster.setSuccessMessage(' ', 'New Customised Record Created From Master');
																req.session.toaster = toaster;
																res.redirect('/student/list-patients');
																// redirect will activate router while render activates specific handlebar
															});
														})
													})
												})
											})
										})
									})
								})
							})
						})
					})
				})
			});
		});
	});
});

// shows the add patient form
router.get('/add-patient', (req, res) => {
	res.render('master/master-add-patient');	// handlebar!!
});


router.get('/search', (req, res) => {
	res.render('story/search');
})

router.post('/getStory', (req, res) => {
	Story.find({title: req.body.title})
	.populate('user') // select Story.*, User.* from Story, User where Story.user.id = User.user.id
	.then(stories => {
		console.log('\n\n====== find() from /getStory ======');
		/*		console.log(stories[0].title);
		 console.log(stories[0].user.lastName);*/
		
		stories.forEach(function(story){
			console.log('============================');
			console.log(story.title);
			console.log(story.body);
			console.log(story.user.firstName);
			console.log(story.user.lastName);
		});
		res.render('story/list', {
			stories: stories
		});
	});

// Accessing object returned by Mongoose find() and findOne() methods
	/*	Story.findOne({title: req.body.title})
	 .populate('user') // select Story.*, User.* from Story, User where Story.user.id = User.user.id
	 .then(story => {
	 console.log('\n\n====== findOne() from /getStory ======');
	 console.log(`Title: ${story.title} || Name: ${story.user.lastName}`);
	 });
	 
	 Story.find({title: req.body.title})
	 .populate('user') // select Story.*, User.* from Story, User where Story.user.id = User.user.id
	 .then(story => {
	 console.log('\n\n====== find() from /getStory ======');
	 console.log(story[0].user.lastName);
	 });*/
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

// Edit Story Form
/*router.get('/edit/:id', ensureAuthenticated, (req, res) =>{
 Story.findOne({
 _id: req.params.id
 })
 .then(story =>{
 if(story.user != req.user.id) {
 res.redirect('/stories');
 } else {
 res.render('stories/edit', {
 story: story
 });
 }
 });
 });*/

/*
 // Stories Index
 router.get('/', (req, res) =>{
 Story.find({status: 'public'})
 .populate('user') // select Story.*, User.* from Story, User where Story.user.id = User.user.id
 .then(stories =>{
 res.render('stories/index', {
 stories: stories
 });
 });
 });
 
 // Add Story Form
 router.get('/add', ensureAuthenticated, (req, res) =>{
 res.render('stories/add');
 });
 
 // Process Add Story
 router.post('/', (req, res) =>{
 let allowComments;
 
 if(req.body.allowComments) {
 allowComments = true;
 } else {
 allowComments = false;
 }
 
 const newStory = {
 title: req.body.title,
 body: req.body.body,
 status: req.body.status,
 allowComments: allowComments,
 user: req.user.id
 };
 
 // Create Story
 new Story(newStory)
 .save()
 .then(story =>{
 res.redirect(`/stories/show/${story.id}`);
 });
 });
 */

//Updates chart according to date specified
router.get('/chart/update/:recordID', ensureAuthenticated, (req, res) => {
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

	MasterVital.find({ date: { $gte: fromDate, $lte: toDate }, patientID: req.params.recordID }, {datetime: 1, temp: 1, sbp: 1, dbp: 1, resp: 1, heartRate: 1,  _id: 0})
		.sort({"datetime": 1}).then(vitalInfo => {
			MasterPain.find({ date: { $gte: fromDate, $lte: toDate }, patientID: req.params.recordID }, {datetime: 1, painScore: 1, _id: 0})
				.sort({"datetime": 1}).then(painInfo => {
					MasterOxygen.find({ date: { $gte: fromDate, $lte: toDate }, patientID: req.params.recordID }, {datetime: 1, spo2: 1, _id: 0})
						.sort({"datetime": 1}).then(o2Info => {
						res.send({vital: vitalInfo, pain: painInfo, oxygen: o2Info});
			})
		})
	})
})

//View chart (temperature, heart rate/oxygen, and blood pressure only for now)
router.get('/chart/:recordID', ensureAuthenticated, (req, res) => {
	userType = req.user.userType == 'student';
	var today = new Date();
	var dd = String(today.getDate()).padStart(2, '0');
	var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
	var yyyy = today.getFullYear();
	var today = yyyy + '-' + mm + '-' + dd;
	
	MasterVital.find({ date: { $gte: "", $lte: today }, patientID: req.params.recordID })
		.sort({"datetime": 1}).then(info => {
			MasterPain.find({ date: {$gte: "", $lte: today }, patientID: req.params.recordID })
			.sort({"datetime": 1}).then(painInfo => {
				MasterOxygen.find({date: { $gte: "", $lte: today }, patientID: req.params.recordID })
				.sort({"datetime": 1}).then(oxyInfo => {
					res.render('charts/master/charts', {
						recordID: req.params.recordID,
						userType: userType,
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
 router.get('/vital/:recordID', ensureAuthenticated, (req, res) => {
	userType = req.user.userType == 'student';
	MasterVital.find({ patientID: req.params.recordID }).sort({'datetime':1}).then(vitalData => {
		MasterPain.find({ patientID: req.params.recordID }).sort({'datetime':1}).then(painData => {
			MasterOxygen.find({ patientID: req.params.recordID }).sort({'datetime':1}).then(oxyData => {
				MasterWH.find({ patientID: req.params.recordID }).sort({'datetime':1}).then(whData => {

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
						recordID: req.params.recordID,
						userType: userType,
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
router.get('/vital/:recordID/:vitalID', ensureAuthenticated, (req, res) => {
	userType = req.user.userType == 'student';
	MasterVital.find({ patientID: req.params.recordID }).sort({'datetime':1}).then(newVital => {
		MasterVital.findOne({ vitalID: req.params.vitalID }).then(editVital => {

			//Changes date format to DD/MM/YYYY
			editVital.date = moment(editVital.date, 'YYYY-MM-DD').format('DD/MM/YYYY');
			res.render('charts/master/charts-vital', {
				recordID: req.params.recordID,
				userType: userType,
				newVital: newVital,
				editVital: editVital,
				patient: req.session.patient,
				showMenu: true
			})
		})
	})
})

//Edit vital information
router.put('/edit-vital/:recordID/:vitalID', ensureAuthenticated, (req,res) => {
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
	res.redirect('/student/vital/' + req.params.recordID);
})

//Get single pain info
router.get('/pain/:recordID/:painID', ensureAuthenticated, (req, res) => {
	userType = req.user.userType == 'student';
	MasterPain.find({ patientID: req.params.recordID }).sort({'datetime':1}).then(painData => {
		MasterPain.findOne({ painID: req.params.painID }).then(editPain => {

			//Changes date format to DD/MM/YYYY
			editPain.date = moment(editPain.date, 'YYYY-MM-DD').format('DD/MM/YYYY');
			res.render('charts/master/charts-vital', {
				recordID: req.params.recordID,
				userType: userType,
				painData: painData,
				editPain: editPain,
				patient: req.session.patient,
				showMenu: true
			})
		})
	})
})

//Edit pain info
router.put('/edit-pain/:recordID/:painID', ensureAuthenticated, (req, res) => {
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
	res.redirect('/student/vital/' + req.params.recordID);
})

//Get single oxygen information
router.get('/oxygen/:recordID/:oxygenID', ensureAuthenticated, (req, res) => {
	userType = req.user.userType == 'student';
	MasterOxygen.find({ patientID: req.params.recordID }).sort({'datetime':1}).then(oxyData => {
		MasterOxygen.findOne({ oxygenID: req.params.oxygenID }).then(editOxy => {

			//Changes date format to DD/MM/YYYY
			editOxy.date = moment(editOxy.date, 'YYYY-MM-DD').format('DD/MM/YYYY');
			res.render('charts/master/charts-vital', {
				recordID: req.params.recordID,
				userType: userType,
				oxyData: oxyData,
				editOxy: editOxy,
				patient: req.session.patient,
				showMenu: true
			})
		})
	})
})

//Update oxygen information
router.put('/edit-oxygen/:recordID/:oxygenID', ensureAuthenticated, (req, res) => {
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
	res.redirect('/student/vital/' + req.params.recordID);
})

//Get single weight & height information
router.get('/wh/:recordID/:whID', ensureAuthenticated, (req, res) => {
	userType = req.user.userType == 'student';
	MasterWH.find({ patientID: req.params.recordID }).sort({'datetime':1}).then(whData => {
		MasterWH.findOne({ whID: req.params.whID }).then(editWh => {

			//Changes date format to DD/MM/YYYY
			editWh.date = moment(editWh.date, 'YYYY-MM-DD').format('DD/MM/YYYY');
			res.render('charts/master/charts-vital', {
				recordID: req.params.recordID,
				userType: userType,
				whData: whData,
				editWh: editWh,
				patient: req.session.patient,
				showMenu: true
			})
		})
	})
})

//Edit weight & height information
router.put('/edit-wh/:recordID/:whID', ensureAuthenticated, (req, res) => {
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
	res.redirect('/student/vital/' + req.params.recordID);
})

//Starting route for doctor's orders
router.get('/doctor/orders/:recordID', ensureAuthenticated, (req, res) => {
	userType = req.user.userType == 'student';
	DoctorOrders.find({ patientID: req.params.recordID }).sort({'datetime':1}).then(docOrders => {
		res.render('doctors/doctors-orders', {
			recordID: req.params.recordID,
			userType: userType,
			docOrders: docOrders,
			patient: req.session.patient,
			showMenu: true
		})
	})
})

//Get single doctor's orders
router.get('/doctor/orders/:recordID/:orderID', ensureAuthenticated, (req, res) => {
	userType = req.user.userType == 'student';
	DoctorOrders.find({ patientID: req.params.recordID }).sort({'datetime':1}).then(docOrders => {
		DoctorOrders.findOne({ orderID: req.params.orderID }).then(editOrder => {

			editOrder.date = moment(editOrder.date, 'YYYY-MM-DD').format('DD/MM/YYYY');
			res.render('doctors/doctors-orders', {
				recordID: req.params.recordID,
				userType: userType,
				docOrders: docOrders,
				editOrder: editOrder,
				patient: req.session.patient,
				showMenu: true
			})
		})
	})
})

//Load IO page
router.get('/io/:recordID', ensureAuthenticated, (req, res) => {
	userType = req.user.userType == 'student';
	MasterIO.find({ patientID: req.params.recordID }).sort({'datetime':1}).then(newIO => {
		MasterEnteral.find({ patientID: req.params.recordID }).sort({'datetime':1}).then(newenteral => {
			MasterIV.find({ patientID: req.params.recordID }).sort({'datetime':1}).then(newiv => {	
				MasterOutput.find({ patientID: req.params.recordID }).sort({'datetime':1}).then(newoutput => {			

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
						recordID: req.params.recordID,
						userType: userType,
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

//get single io info
router.get('/io/:recordID/:ioID', ensureAuthenticated, (req, res) => {
	userType = req.user.userType == 'student';
	MasterIO.find({ patientID: req.params.recordID }).sort({'datetime':1}).then(newIO => {
		MasterIO.findOne({ ioID: req.params.ioID }).then(editIO => {

			editIO.date = moment(editIO.date, 'YYYY-MM-DD').format('DD/MM/YYYY');
			res.render('charts/master/charts-io', {
				recordID: req.params.recordID,
				userType: userType,
				newIO: newIO,
				editIO: editIO,
				patient: req.session.patient,
				showMenu: true			
			})
		})
	})
})

//edit IO informations
router.put('/edit-io/:recordID/:ioID', ensureAuthenticated, (req,res) => {
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
	res.redirect('/student/io/' + req.params.recordID);
})

//Get single enteral info
router.get('/enteral/:recordID/:enteralID', ensureAuthenticated, (req, res) => {
	userType = req.user.userType == 'student';
	MasterEnteral.find({ patientID: req.params.recordID }).sort({'datetime':1}).then(newenteral => {
		MasterEnteral.findOne({ enteralID: req.params.enteralID }).then(editenteral => {

			//Changes date format to DD/MM/YYYY
			editenteral.date = moment(editenteral.date, 'YYYY-MM-DD').format('DD/MM/YYYY');
			res.render('charts/master/charts-io', {
				recordID: req.params.recordID,
				userType: userType,
				newenteral: newenteral,
				editenteral: editenteral,
      		})
    	})
  	})
})

//Edit Enteral info
router.put('/edit-enteral/:recordID/:enteralID', ensureAuthenticated, (req, res) => {
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
	res.redirect('/student/io/' + req.params.recordID);
})

//Get single iv info
router.get('/iv/:recordID/:ivID', ensureAuthenticated, (req, res) => {
	userType = req.user.userType == 'student';
	MasterIV.find({ patientID: req.params.recordID }).sort({'datetime':1}).then(newiv => {
		MasterIV.findOne({ ivID: req.params.ivID }).then(editiv => {

			//Changes date format to DD/MM/YYYY
			editiv.date = moment(editiv.date, 'YYYY-MM-DD').format('DD/MM/YYYY');
			res.render('charts/master/charts-io', {
				recordID: req.params.recordID,
				userType: userType,
				newiv: newiv,
				editiv: editiv,
      		})
    	})
  	})
})

//Edit IV info
router.put('/edit-iv/:recordID/:ivID', ensureAuthenticated, (req, res) => {
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
	res.redirect('/student/io/' + req.params.recordID);
})

//Get single output info
router.get('/output/:recordID/:outputID', ensureAuthenticated, (req, res) => {
	userType = req.user.userType == 'student';
	MasterOutput.find({ patientID: req.params.recordID }).sort({'datetime':1}).then(newoutput => {
		MasterOutput.findOne({ outputID: req.params.outputID }).then(editoutput => {

			//Changes date format to DD/MM/YYYY
			editoutput.date = moment(editoutput.date, 'YYYY-MM-DD').format('DD/MM/YYYY');
			res.render('charts/master/charts-io', {
				recordID: req.params.recordID,
				userType: userType,
				newoutput: newoutput,
				editoutput: editoutput,
				patient: req.session.patient,
				showMenu: true	
      		})
    	})
  	})
})

//Edit output info
router.put('/edit-output/:recordID/:outputID', ensureAuthenticated, (req, res) => {
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
	res.redirect('/student/io/' + req.params.recordID);
})

//open route to braden page
router.get('/braden/:recordID', ensureAuthenticated, (req, res) => {
	userType = req.user.userType == 'student';
	MasterBraden.find({ patientID: req.params.recordID }).then(newBraden => {
		res.render('charts/master/charts-braden', {
			recordID: req.params.recordID,
			userType: userType,
			newBraden: newBraden,
			patient: req.session.patient,
			showMenu: true
		})
  	})
})

//get single braden info
router.get('/braden/:recordID/:bradenID', ensureAuthenticated, (req, res) => {
	userType = req.user.userType == 'student';
	MasterBraden.find({ patientID: req.params.recordID }).then(newBraden => {
		MasterBraden.findOne({ bradenID: req.params.bradenID }).then(editBraden => {
			res.render('charts/master/charts-braden', {
				recordID: req.params.recordID,
				userType: userType,
				newBraden: newBraden,
				editBraden: editBraden,
				patient: req.session.patient,
				showMenu: true			
			})
		})
	})
})

//Edit braden information
router.put('/edit-braden/:recordID/:bradenID', ensureAuthenticated, (req,res) => {
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
	res.redirect('/student/braden/' + req.params.recordID);
})

//open fall page
router.get('/fall/:recordID', ensureAuthenticated, (req, res) => {
	userType = req.user.userType == 'student';
	MasterFall.find({ patientID: req.params.recordID }).then(newFall => {
		res.render('charts/master/charts-Fall', {
			recordID: req.params.recordID,
			userType: userType,
			newFall: newFall,
			patient: req.session.patient,
			showMenu: true
		});
	})
})
// Open HistoryTakng page
router.get('/HistoryTaking/:recordID', ensureAuthenticated, (req, res) => {
	userType = req.user.userType == 'student';
	StudentHistory.find({ user: req.user.id, patientID: req.params.recordID})
	.then(newHistory => {
		StudentHistory.findOne({ patientID: req.params.recordID})
		.then(editHistory => {
			if (editHistory == null)
			{
				res.render('HistoryTaking/student/add_HistoryTaking', {
					recordID:req.params.recordID,
					newHistory: newHistory,
					userType: userType,
					patient: req.session.patient,
					showMenu: true,
				});
			}
			else
			{
				console.log("History Taking is not empty: "+editHistory);
				res.render('HistoryTaking/student/add_HistoryTaking', {
					newHistory: newHistory,
					userType: userType,
					patient: req.session.patient,
					showMenu: true,
					editHistory: editHistory
				});
			}
			
			
		})	
	})
})

//Add HistoryTaking
router.post('/add-history/:recordID', ensureAuthenticated, (req, res) => {
	historyId = (new standardID('AAA0000')).generate();
	new StudentHistory({
		user: req.user.id,
		patientID: req.params.recordID,
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
		res.redirect('/student/HistoryTaking/' +req.params.recordID );
})
//One HistoryTaking by ID
router.get('/HistoryTaking/:recordID', ensureAuthenticated, (req,res) => {
	StudentHistory.find({ patientID: req.params.recordID}).then(newHistory => {
		StudentHistory.findOne({ patientID: req.params.recordID }).then(editHistory =>{
			res.render('HistoryTaking/student/add_HistoryTaking',{
				newHistory:newHistory,
				editHistory: editHistory,
				patient: req.session.patient,
				showMenu: true
			})
		
		});
	})
})

//Edit the HistoryTaking
router.put('/edit-history/:recordID', ensureAuthenticated, (req,res) => {
	StudentHistory.findOne({ patientID: req.params.recordID}).then(editHistory => {
		
		editHistory.chiefComp = req.body.chiefComp,
		editHistory.historyPresent = req.body.historyPresent,
		editHistory.allergy = req.body.allergy,
		editHistory.medicalH = req.body.medicalH,
		editHistory.surgicalH = req.body.surgicalH,
		editHistory.familyH = req.body.familyH,
		editHistory.socialH = req.body.socialH,
		editHistory.travelH = req.body.travelH

		editHistory.save();
	});
	res.redirect("/student/HistoryTaking/" + req.params.recordID);
})
	
// // Open HistoryTakng page
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
// // Add HistoryTaking
// router.post('/addHistory', ensureAuthenticated,(req, res) => {
// 	historyId = (new standardID('AAA0000')).generate();
// 	new StudentHistory({
// 		user: req.user.id,
// 		patientID: req.session.patient.patientID,
// 		userType: req.user.userType,
// 		chiefComp: req.body.chiefComp,
// 		historyPresent: req.body.historyPresent,
// 		allergy: req.body.allergy,
// 		medicalH: req.body.medicalH,
// 		surgicalH: req.body.surgicalH,
// 		familyH: req.body.familyH,
// 		socialH: req.body.socialH,
// 		travelH: req.body.travelH,
// 		historyId: historyId
// 	}).save();
// 	res.redirect('/student/HistoryTaking');
// })
// //Edit HistoryTaking
// router.put('/edit-history/:historyId', ensureAuthenticated, (req,res) => {
// 	StudentHistory.findOne({ historyId: req.params.historyId}).then(editHistory => {
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
// 	res.redirect("/student/add_HistoryTaking");
// })
//get single fall info
router.get('/fall/:recordID/:fallID', ensureAuthenticated, (req, res) => {
	userType = req.user.userType == 'student';
	MasterFall.find({ patientID: req.params.recordID }).then(newFall => {
		MasterFall.findOne({ fallID: req.params.fallID }).then(editFall => {
			res.render('charts/master/charts-fall', {
				recordID: req.params.recordID,
				userType: userType,
				newFall: newFall,
				editFall: editFall,
				patient: req.session.patient,
				showMenu: true			
			})
		})
	})
})

//Edit fall information
router.put('/edit-fall/:recordID/:fallID', ensureAuthenticated, (req,res) => {
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
	res.redirect('/student/fall/' + req.params.recordID);
})

// mdp page
router.get('/mdp/:recordID', ensureAuthenticated, (req, res) => {
	userType = req.user.userType == 'student';
	StudentMDP.find({user: req.user.id, patientID: req.session.patient.patientID}).sort({'datetime':1})
	.then(newMDP => { // mdp that they have created
		MasterMDP.find({patientID: req.session.patient.patientID}).then(newMasterMDP => {
			res.render('mdp-notes/student/mdp', {
				recordID: req.params.recordID,
				newMasterMDP: newMasterMDP,
				newMDP: newMDP,
				userType: userType,
				patient: req.session.patient,
				showMenu: true
			});
		});
	})
})
// add MDP page
router.post('/add-mdp/:recordID', ensureAuthenticated,(req, res) => {
	mdpID = (new standardID('AAA0000')).generate();
	datetime = moment(req.body.dateMDP, 'DD/MM/YYYY').format('MM/DD/YYYY') + " " + req.body.timeMDP;
	new StudentMDP({
		patientID: req.session.patient.patientID,
		studentPatientID: req.params.recordID,
		user: req.user.id,
		createdBy: req.user.firstName,
		mdpID: mdpID,
		date: moment(req.body.dateMDP, 'DD/MM/YYYY').format('YYYY-MM-DD'),
		time: req.body.timeMDP,
		datetime: datetime,
		selectUser: req.body.selectUser,
		healthProvider: req.body.healthProvider,
		progressNotes: req.body.progressNotes
	}).save();
	res.redirect('/student/mdp/'+req.params.recordID);
})
// delete MDP page
router.delete('/del-mdp/:recordID/:mdpID', ensureAuthenticated, (req, res) => {
	StudentMDP.deleteOne({mdpID: req.params.mdpID}, function(err) {
		if (err) {
			console.log("cannot delete mdp details");
		}
	});
	res.redirect('/student/mdp/'+ req.params.recordID);
})

// get single MDP info
router.get('/mdp/:recordID/:mdpID', ensureAuthenticated, (req, res) => {
	StudentMDP.find({ patientID: req.session.patient.patientID}).sort({'datetime':1}).then(newMDP => {
		StudentMDP.findOne({ mdpID: req.params.mdpID}).then(editMDP => {
			console.log("Hiiii: "+ editMDP);
			editMDP.date = moment(editMDP.date, 'YYYY-MM-DD').format('DD/MM/YYYY');
			res.render('mdp-notes/student/mdp', {
				newMDP: newMDP,
				editMDP: editMDP,
				patient: req.session.patient,
				showMenu: true
			});
		})
	})
})

// edit MDP informations
router.put('/edit-mdp/:recordID/:mdpID', ensureAuthenticated, (req,res) => {
	datetime = moment(req.body.dateMDP, 'DD/MM/YYYY').format('MM/DD/YYYY') + " " + req.body.timeMDP;

	StudentMDP.findOne({ mdpID: req.params.mdpID}).then(editMDP => {
		editMDP.date = moment(req.body.dateMDP, 'DD/MM/YYYY').format('YYYY-MM-DD'),
		editMDP.time = req.body.timeMDP,
		editMDP.datetime = datetime,
		editMDP.selectUser = req.body.selectUser,
		editMDP.healthProvider = req.body.healthProvider,
		editMDP.progressNotes = req.body.progressNotes

		editMDP.save().then(editMDP => {
			res.redirect("/student/mdp/"+editMDP.studentPatientID);
		});
	});
	
})

module.exports = router;