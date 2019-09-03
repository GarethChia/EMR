const alertMessage = require('./messenger');


module.exports = {
	ensureAuthenticated: function(req, res, next){
		if(req.isAuthenticated()) {
			return next();
		}
		/*
		let alert = res.flashMessenger.danger('Access denied');
		alert.titleIcon = 'far fa-thumbs-down';
		alert.canBeDismissed = true;
		alertMessage.flashMessage(res, 'Access Denied', 'fas fa-exclamation', true);
		*/
		res.redirect('/');
	},
	//Todo: EnsureAuthorised staff and user
	ensureAuthorised: function(req, res, next){
		if(req.user.userType === 'staff') {
			return next();
		}
		/*let alert = res.flashMessenger.danger('Unauthorised to access requested function');
		alert.titleIcon = 'far fa-thumbs-down';
		alert.canBeDismissed = true;*/
		alertMessage.flashMessage(res, 'Unauthorised to access requested function', 'fas fa-exclamation', true);
		res.redirect('/');
	},
	
/*	ensureGuest: function(req, res, next){
		if(req.isAuthenticated()) {
			res.redirect('index/welcome');
		} else {
			return next();
		}
	}*/
}