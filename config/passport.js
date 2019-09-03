const GoogleStrategy = require('passport-google-oauth20').Strategy;
const OIDCStrategy = require('passport-azure-ad').OIDCStrategy;

const mongoose = require('mongoose');
const keys = require('./keys');
const config = require('./azure-config');


// Load user model
const User = mongoose.model('google-users');
const EMRUser = mongoose.model('emr-users');

function googleOauth2(passport){
	passport.use(
		new GoogleStrategy({
			clientID: keys.googleClientID,
			clientSecret: keys.googleClientSecret,
			callbackURL: '/auth/google/callback',
			proxy: true
		}, (accessToken, refreshToken, profile, done) =>{
			// console.log(accessToken);
			
			console.log('Google Profile =============');
			console.log(profile);
			
			const newUser = {
				googleID: profile.id,
				firstName: profile.name.givenName,
				lastName: profile.name.familyName,
				email: profile.emails[ 0 ].value,
			};
			
			// Check for existing user
			User.findOne({
				googleID: profile.id
			})
				.then(user =>{
					if(user) {
						// Return user
						done(null, user);
					} else {
						// Create user
						new User(newUser)
							.save()
							.then(user => done(null, user));
					}
				})
		})
	);
	
	passport.serializeUser((user, done) =>{
		/*console.log('\nFrom serializeUser-------------');
		console.log(user);*/
		done(null, user.id);
	});
	
	passport.deserializeUser((id, done) =>{
		/*console.log('\nFrom deserializeUser-------------');
		console.log(id);*/
		User.findById(id)
			.then(user => done(null, user));
	});
}

// checks for presence of 'mymail' in emaill address which signifies student account
function getUserType(email){
	let domain = email.substring(email.indexOf('@') + 1, email.indexOf('.'));
	
	if ((domain === 'mymail') || (domain === 'nypcloudhotmail')){
		console.log('===============> Student login');
		return 'student';
	} else if ((domain === 'nyp') || (domain === 'gmail')) {
		console.log('===============> Staff login');
		return 'staff';
	}
};

function getHomeURL(userType){
	if (userType === 'staff'){
		return '/master/list-patients';
	} else {
		return '/student/list-patients';
	}
	
}

function azureAD(passport){
	passport.use(
		new OIDCStrategy({
			identityMetadata: config.creds.identityMetadata,
			clientID: config.creds.clientID,
			responseType: config.creds.responseType,
			responseMode: config.creds.responseMode,
			redirectUrl: config.creds.redirectUrl,
			allowHttpForRedirectUrl: config.creds.allowHttpForRedirectUrl,
			clientSecret: config.creds.clientSecret,
			validateIssuer: config.creds.validateIssuer,
			isB2C: config.creds.isB2C,
			issuer: config.creds.issuer,
			passReqToCallback: config.creds.passReqToCallback,
			scope: config.creds.scope,
			loggingLevel: config.creds.loggingLevel,
			nonceLifetime: config.creds.nonceLifetime,
			nonceMaxAmount: config.creds.nonceMaxAmount,
			useCookieInsteadOfSession: config.creds.useCookieInsteadOfSession,
			cookieEncryptionKeys: config.creds.cookieEncryptionKeys,
			clockSkew: config.creds.clockSkew,
		}, (iss, sub, profile, accessToken, refreshToken, done) =>{
			if(!profile.oid) {
				return done(new Error("No oid found"), null);
			}
			
			let email = profile._json.email;
			
			if (email === undefined) {
				email = profile.upn;
			}

			let userType = getUserType(email);
			console.log(`Logged in user email: ${email}`);
			
			const newUser = {
				azure_oid: profile.oid,
				firstName: profile.displayName,
				lastName: profile.name.familyName,
				userType,
				email,
				homeURL: getHomeURL(userType)
			};
			
			// Find user record in own table
			EMRUser.findOne({
				azure_oid: profile.oid
			})
				.then(user =>{
					if(user) {
						// Return user
						done(null, user);
					} else {
						// Create user in users collection
						new EMRUser(newUser)
							.save()
							.then(user => done(null, user));
					}
				})
			// asynchronous verification, for effect...
			/*process.nextTick(function () {
			 findByOid(profile.oid, function(err, user) {
			 if (err) {
			 return done(err);
			 }
			 if (!user) {
			 // "Auto-registration"
			 users.push(profile);
			 return done(null, profile);
			 }
			 return done(null, user);
			 });
			 });*/
		})
	);
	passport.serializeUser(function(user, done){
		/*console.log('\nFrom serializeUser-------------');
		console.log(user);*/
		done(null, user);
	});
	
	passport.deserializeUser(function(user, done){
		EMRUser.findById(user._id)
			.then((user) => {
				/*console.log('\nFound user from deserializeUser-------------');
				console.log(user);*/
				done(null, user);
			})
			.catch((done) => {
				console.log(done);
			});
	});

// array to hold logged in users
	/*const users = [];
	 
	 const findByOid = function(oid, fn){
	 for(let i = 0, len = users.length; i < len; i++) {
	 let user = users[ i ];
	 log.info('we are using user: ', user);
	 if(user.oid === oid) {
	 return fn(null, user);
	 }
	 }
	 return fn(null, null);
	 };*/
}


module.exports = {googleOauth2, azureAD};


