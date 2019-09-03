const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model('USERS');
const {ensureAuthenticated, ensureGuest} = require('../helpers/auth');

router.post('/add', (req, res) =>{
	const newUser = {
		firstName: req.body.firstName,
		lastName: req.body.lastName
	};
	
	// Create Story
	new User(newUser)
	.save()
	.then(user =>{
		console.log(user);
		res.render('user/showUserAdded', { user: user})
	});
});

router.get('/add' , (req, res) => {
	res.render('user/add');
});

module.exports = router;