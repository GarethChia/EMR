document.addEventListener('DOMContentLoaded', initMasterPatientList);

function initMasterPatientList(){
	registerDropdownButtonEvents();
	initFloatButtons();
}

function initFloatButtons(){
	M.FloatingActionButton.init(document.querySelector('.fixed-action-btn'), {});
}

function registerDropdownButtonEvents(){
	console.log('=======Activated tableMouseOverEvents()');
	const rows = document.getElementById('patientMasterList')
	.getElementsByTagName('tbody')[ 0 ].getElementsByTagName('tr');
	
	for(let i = 0; i < rows.length; i++) {
		let row = rows[ i ];
		row.addEventListener('mouseenter', () =>{
			//console.log(`Before block: ${row.cells[ 5 ].firstElementChild.style}`);
			row.cells[8].firstElementChild.style.display = 'block';
			//console.log(`After block: ${row.cells[ 5 ].firstElementChild.style}`);
		});
		
		row.addEventListener('click', () => {
			row.cells[8].firstElementChild.style.display = 'block';
		});
		
		row.addEventListener('mouseleave', () =>{
			/*	let dropdown = M.Dropdown.getInstance(document.querySelector('#dropdown-button'));
			 console.log(`Dropdown open status: ${dropdown.isOpen}`);*/
			row.cells[8].firstElementChild.style.display = 'none';
		});
	}
}

/*document.getElementById('go')
.addEventListener('click', () =>{
	console.log('Go clicked');
	const rows = document.getElementById('patientMasterList')
	.getElementsByTagName('tbody')[ 0 ].getElementsByTagName('tr');
	
	let dropdown = M.Dropdown.getInstance(document.querySelector('#dropdown-button'));
	console.log(dropdown);
	rows[ 1 ].cells[ 5 ].firstElementChild.style.display = 'none';
});*/




