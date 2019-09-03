const express = require('express');
const router = express.Router();
const {ensureAuthenticated, ensureGuest} = require('../helpers/auth');
const logger = require('../helpers/logger');


router.get('/', (req, res) =>{
	res.render('index/split-login', {layout: false});
});

router.get('/assets*', (req, res, next) =>{
	res.status(403).send('Access forbidden');
	
});


/*
 * /^\/protected\/.*$/
 * /^\/assets\/+\.(js|css)$
 * */

/*router.get('/', (req, res) =>{
 res.render('index/welcome');
 });*/

router.get('/about', (req, res) =>{
	res.render('index/about');
});


router.get('/dashboard', ensureAuthenticated, (req, res) =>{
	
	/*
	 req.logger.info('Calling from index.js/dashboard');
	 req.logger.error('Calling from index.js/dashboard');
	 console.log(res.locals.mylogger);
	 */
	/*
	 logger.user(`${req.user._id} logged in!`);
	 logger.info('Just for info only');
	 logger.error('Error!!!');
	 */
	/*logger.consoleLogger.info('Calling from index.js/dashboard');
	 
	 req.user  = {
	 _id: '5ac75afef745cd06d8b696c2',
	 azure_oid: 'd2748722-3843-466f-9919-d65544c03b01',
	 firstName: 'chewph',
	 userType: "",
	 email: 'chewph@gmail.com',
	 };
	 res.locals.user = req.user;*/
	/*logger.userLogger.user(`${req.user._id} logged in!`);
	 logger.errorLogger.error(`Error from user ${req.user._id}!`);*/
	res.render('index/dashboard');
});

router.get('/dashboardTabs', (req, res) =>{
	res.render('index/dashboardTabs');
});

/*router.get('/dashboard', ensureAuthenticated, (req, res) =>{
 res.render('index/dashboard');
 });*/

router.get('/logout', (req, res) =>{
	req.logout();
	res.redirect('/');
});

/*
 router.get('/dashboard', ensureAuthenticated, (req, res) => {
 res.render('index/dashboard');
 });
 router.get('/about', (req, res) => {
 res.render('index/about');
 });*/

module.exports = router;
