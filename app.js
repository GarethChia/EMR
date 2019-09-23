const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');

const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const passport = require('passport');
const flash = require('connect-flash');
const FlashMessenger = require('flash-messenger');
const helmet = require('helmet');
const lusca = require('lusca');
const webpush = require('web-push');
const fs = require('fs');
const https = require('https');

// Load Models
require('./models/User');
require('./models/Google-User');
require('./models/EMR-User');
require('./models/NursingAssessmentModel');
require('./models/PatientMasterModel');
require('./models/PatientStudentModel');
require('./models/MasterVital');
require('./models/MasterPain');
require('./models/MasterWH');
require('./models/DoctorsOrders');
require('./models/MasterBraden');
require('./models/MasterFall');
require('./models/MasterIO');
require('./models/MasterEnteral');
require('./models/MasterIV');
require('./models/MasterOutput');
require('./models/MasterOxygen');
require('./models/MasterMDP');
require('./models/StudentMDP');
require('./models/MasterHistoryTracking');
require('./models/StudentHistoryTracking');
require('./models/StudentCarePlan');
require('./models/MasterDiabetic');

// load keys
const key = fs.readFileSync('./server.key');
const cert = fs.readFileSync( './server.cert' );
var options = {
  key: key,
  cert: cert
};

// Passport Config
const authenticate = require('./config/passport');
//authenticate.googleOauth2(passport);
authenticate.azureAD(passport);

// load routes
const index = require('./routes/index');
const user = require('./routes/user');
const auth = require('./routes/auth-route');
const masterRoute = require('./routes/master-route');
const studentRoute = require('./routes/student-route');

// Load Keys
const keys = require('./config/keys');

// Handlebars Helpers
const {
	truncate,
	stripTags,
	formatDate,
	formatDatetime,
	getAge,
	select,
	editIcon,
	checkOpt,
	isResulted,
	checked,
	resetExceptNone,
	setRadioButton,
	assessmentSaveLink
} = require('./helpers/hbs');

// Map global promises
mongoose.Promise = global.Promise;
// Mongoose Connect
mongoose.connect(keys.mongoURI)
.then(() => console.log('MongoDB Connected'))
.catch(err => console.log(err));

const User = mongoose.model('USERS');
const EMR_User = mongoose.model('emr-users');
const PatientMasterModel = mongoose.model('patient');
const PatientStudentModel = mongoose.model('patientStudent');

const app = express();

// Handlebars Middleware
app.engine('handlebars', exphbs({
	helpers: {
		truncate: truncate,
		stripTags: stripTags,
    formatDate,
		formatDate: formatDate,
		formatDatetime: formatDatetime,
		getAge: getAge,
		select: select,
		editIcon: editIcon,
		checkOpt: checkOpt,
		isResulted: isResulted,
		checked: checked,
		resetExceptNone: resetExceptNone,
		setRadioButton: setRadioButton,
		assessmentSaveLink: assessmentSaveLink
	},
	defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

app.use(helmet());

// Body parser middleware
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//Method Override Middelware
app.use(methodOverride('_method'));

app.use(cookieParser());
app.use(session({
	secret: 'emr-s3cr3t-SIT-SHS',
	resave: true,
	secure: true,
	httpOnly: true,
	saveUninitialized: false,
	/*cookie:{ _expires: (15 * 60 * 1000) },*/
	store: new MongoStore({
		mongooseConnection: mongoose.connection,
		ttl: 2 * 24 * 60 * 60,	 /* In seconds */
		useNewUrlParser: true,
	})
}));

/*app.use(lusca({
	csrf: true,
	csp: {
		policy: {
			'default-src': '\'self\'',
			'img-src': '*'
		}
	},
	xframe: 'SAMEORIGIN',
	p3p: 'ABCDEF',
	hsts: {maxAge: 31536000, includeSubDomains: true, preload: true},
	xssProtection: true,
	nosniff: true,
	referrerPolicy: 'same-origin'
}));*/

// Initialise messaging middlewares
app.use(flash());
app.use(FlashMessenger.middleware);

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());


// Set static folder
app.use(express.static(path.join(__dirname, 'public')));
//app.use(express.static(path.join(__dirname, 'node_modules')));


// Set global vars
app.use((req, res, next) =>{
	res.locals.user = req.user || null;
	res.locals.mylogger = 'This is my logger'; // mylogger is made available to all handlebar templates
	res.locals.success_msg = req.flash('success_msg');
	res.locals.error_msg = req.flash('error_msg');
	res.locals.error = req.flash('error');
	next();
});


// Use Routes
app.use('/', index);
app.use('/user', user);
app.use('/auth', auth);
app.use('/master', masterRoute);
app.use('/student', studentRoute);
// app.use('/chart', chartRoute);


const port = process.env.PORT || 443;
https.createServer(options, app).listen(443, () =>{
	console.log(`Server started on port ${port}`)
});
/*
app.listen(80, () =>{
	console.log(`Server started on port ${port}`)
});
*/

