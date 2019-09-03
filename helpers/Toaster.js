class Toaster {
	
	constructor(message, title, closeButton, success=false, error=false, warning=false, info=false){
		this.message = message;
	}
	
	setSuccessMessage(message, title){
		this.success = true;
		this.title = title;
		this.message = message;
	}
	
	setErrorMessage(message, title){
		this.closeButton = true;
		this.error = true;
		this.title = title;
		this.timeOut = '100000';
		this.message = message;
	}
	
	setInfoMessage(message, title){
		this.info = true;
		this.title = title;
		this.message = message;
	}
	
	setMessage(message){
		this.message = message;
	}
	
	message(){
		return this.message;
	}
	
}

const toaster = new Toaster('');
module.exports = toaster;