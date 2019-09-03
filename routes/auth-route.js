const express = require('express');
const router = express.Router();
const passport = require('passport');

router.get('/google', passport.authenticate('google', {scope: [ 'profile', 'email' ]}));

//router.get('/azure', passport.authenticate('azuread-openidconnect', {scope: ['profile', 'email']}));
router.get('/azure', passport.authenticate('azuread-openidconnect'));

router.post('/azure/callback',
	passport.authenticate('azuread-openidconnect', {failureRedirect: '/logout'}), (req, res) => {
		console.log('\nAzure call back user=========');
		console.log(req.user);
		
		/*let email = req.user.email;
		 let addpos = email.indexOf('@') + 1;
		 let dotpos = email.indexOf('.');
		 console.log(`Position of @: ${addpos}`);
		 console.log(`Position of first .: ${dotpos}`);
		 
		 console.log(`Email domain: ${email.substring(addpos, dotpos)}`);*/
		
		console.log(`********** Azure call back, ${req.user.userType} logged in ***************`);
		
		// need redirect to different paths based on user type
		//res.redirect('/master/list-patients'); // calls master router /master/list-patients
		res.redirect(req.user.homeURL);
	});

router.get('/google/callback',
	passport.authenticate('google', {failureRedirect: '/'}), (req, res) => {
		res.redirect('/dashboard');
	});

router.get('/verify', (req, res) => {
	if(req.user) {
		console.log(req.user);
	} else {
		console.log('Not Auth');
	}
});


module.exports = router;