
const flashMessage = function setAlertMessage(res, message, icon, dismissable){
	let alert = res.flashMessenger.success(message);
	alert.titleIcon = icon;
	alert.canBeDismissed = dismissable;
};

module.exports = {flashMessage};