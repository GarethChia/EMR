const moment = require('moment');
const age = require('s-age');

module.exports = {
	truncate: function(str, len){
		if(str.length > len && str.length > 0) {
			let new_str = str + " ";
			new_str = str.substr(0, len);
			new_str = str.substr(0, new_str.lastIndexOf(" "));
			new_str = (new_str.length > 0) ? new_str : str.substr(0, len);
			return new_str + '...';
		}
		return str;
	},
	stripTags: function(input){
		return input.replace(/<(?:.|\n)*?>/gm, '');
	},
	formatDate: function(date, format){
		return moment(date)
		.format(format);
	},
	formatDatetime: function(datetime){
		return moment(new Date(datetime))
		.format('DD/MM/YYYY HH:mm');
	},
	formatDatetime: function(datetime) {
		return moment(new Date(datetime))
		.format('DD/MM/YYYY HH:mm');
	},
	getAge: function(dob){
		return age(dob);
	},
	
	select: function(selected, options){
		return options.fn(this)
		.replace(new RegExp(' value=\"' + selected + '\"'), '$& selected="selected"')
		.replace(new RegExp('>' + selected + '</option>'), ' selected="selected"$&');
	},
	editIcon: function(storyUser, loggedUser, storyId, floating = true){
		if(storyUser === loggedUser) {
			if(floating) {
				return `<a href="/stories/edit/${storyId}" class="btn-floating halfway-fab red"><i class="fa fa-pencil"></i></a>`;
			} else {
				return `<a href="/stories/edit/${storyId}"><i class="fa fa-pencil"></i></a>`;
			}
		} else {
			return '';
		}
	},
	checkOpt: function(option) {
		if (option === 'Resulted' || option === 'Pending') {
			return 'checked';
		}
	},
	isResulted: function(status) {
		if (status === 'Resulted') {
			return 'visibility: visible';
		} else {
			return 'visibility: hidden';
		}
	},
	resetExceptNone: function(selected, value, noneValue) {
		//console.log('========= Selected in resetExceptNone ===== ' + value);
		if (selected){ // if it is not null
			for (let i=0; i < selected.length; i++) {
				if (selected[i] === noneValue){
					return 'disabled';
				} else {
					if (selected[i] === value) {
						return 'checked';
					}
				}
			}
		}
		return '';
	},
	
	checked: function(selected, value, disable = false) {
		if (selected){
			/*selectedValues.forEach((item) => {
				if (item === value) {
					console.log(`${item} : ${value}`);
					check = 'checked';
				}
			});
			return check;*/
			//console.log(`Entered checked => ${selected} : ${value}`);
			if (Array.isArray(selected)) {
				//console.log('None array');
				for (let i=0; i < selected.length; i++) {
					if(selected[ i ] === value) {
						return 'checked';
					}
				}
			} else {
				//console.log('Non-array');
				if (selected === value){
					//console.log(`Entered ${selected} === ${value}`);
					return 'checked';
				} else if (disable === true){
					return 'disabled';
				}
			}
			
		}
		return '';
	},
	
	setRadioButton(value, valueType) {
		//console.log(`========= value: ${value}   valueType: ${valueType}`);
		if(value !== undefined){
			if(value === valueType){
				//console.log('checked');
				return 'checked'
			} else {
				return ''
			}
		}else {
			return '';
		}
	},
	
	assessmentSaveLink: function(userType){
		if (userType === 'staff'){
			return '/master/save-nursing-assessment';
		} else if (userType === 'student'){
			return 'save student link';
		}
	}
};