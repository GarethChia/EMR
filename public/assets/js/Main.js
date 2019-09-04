document.addEventListener('DOMContentLoaded', initMaterialzeCSS);

function initMaterialzeCSS(){
	initSideNav();
	initiScrollSpy();
	initDropdownMenu();
	initTabs();
	initDropdownButton();
}

function initSideNav(){
	const elem = document.querySelector('.sidenav');
	const sideNam = M.Sidenav.init(elem, {});
	$('.collapsible').collapsible();
}

function initiScrollSpy(){
	let options = {
		scrollOffset: 150,
		throttle: 10
	};
	const elem = document.querySelectorAll('.scrollspy');
	const instance = M.ScrollSpy.init(elem, options);
}

function initDropdownMenu(){
	let options = {
		constrainWidth: false,
		hover: true,
		coverTrigger: false,
		alignment: 'right',
	};
	const elem = document.querySelectorAll('.dropdown-trigger');
	const dropdownMenu = M.Dropdown.init(elem, options);
}

function initTabs(){
	const elem = document.querySelector('#main-tabs');
	const tabs = M.Tabs.init(elem, {swipeable: true});
}

function initDropdownButton(){
	let options = {
		constrainWidth: false,
		hover: true,
		//coverTrigger: false,
		
	};
	const elem = document.querySelector('#dropdown-button');
	M.Dropdown.init(elem, options);
}

function clear(id){
	document.getElementById(id).value = '';
}


function toggleCheck(id){
	let elem = document.getElementById(id);
	if(elem.checked === true) {
		elem.checked = false;
	} else {
		elem.checked = true;
	}
}


function check(id){
	document.getElementById(id).checked = true;
}

function unCheck(id){
	document.getElementById(id).checked = false;
}

function toggleCathether(catType, that){
	let thatCat = document.getElementById(that);
	
	// show/hide cathether info
	if(!thatCat.checked) {
		toggleHideShow(catType);
	} else if (!catType.checked){
		thatCat.checked = false;
	}
}

function toggleHideShow(id){
	let elem = document.getElementById(id);
	let display = elem.style.display;
	
	if(display === 'block') {
		elem.style.display = 'none';
	} else {
		elem.style.display = 'block';
	}
}

function show(id){
	document.getElementById(id).style.display = 'block';
}

function hide(id){
	document.getElementById(id).style.display = 'none';
}


function resetByName(groupName){
	const buttons = document.getElementsByName(groupName);
	
	buttons.forEach(function(button){
		button.checked = false;
	});
	
	/*for (let i = 0; i < buttons.length; i++) {
	 buttons[i].checked = false;
	 }*/
}


function resetExceptNone(groupName, noneId){
	const buttons = document.getElementsByName(groupName);
	
	buttons.forEach(function(button){
		if(button.id !== noneId) {
			button.checked = false;
			button.disabled = !button.disabled;
		}
	});
	
}


paceOptions = {
	// Configuration goes here. Example:
	document: true
};

$(function(){
	
	$.fn.dataTable.moment('DD/MM/YYYY');
	$.fn.dataTable.moment('DD/MM/YYYY HH:mm');
	
	$('#patientMasterList')
	.DataTable({
		"bLengthChange": false,
		"iDisplayLength": 7,
		"order": [ [ 6, "dsc" ] ],
		responsive: true,
		select: {
			style: 'single'
		},
		"columnDefs": [
			{orderable: false, targets: 8},
			{width: 35, targets: 8},
		]
	});
	
	
	$('#patientMasterForStudentList')
	.DataTable({
		"bLengthChange": false,
		"iDisplayLength": 7,
		"order": [ [ 6, "dsc" ] ],
		responsive: true,
		select: {
			style: 'single'
		}
	});
	
	
	$('#patientStudentList')
	.DataTable({
		"bLengthChange": false,
		"iDisplayLength": 7,
		"order": [ [ 2, "asc" ] ],
		responsive: true,
		select: {
			style: 'single'
		},
		"columnDefs": [
			{orderable: false, targets: 9},
		]
	});
	
});