document.addEventListener('DOMContentLoaded', registerDropdownButtonEvents);

function registerDropdownButtonEvents(){
	console.log('=======Activated Student list tableMouseOverEvents()');
	const rows = document.getElementById('patientStudentList')
	.getElementsByTagName('tbody')[ 0 ].getElementsByTagName('tr');
	
	for(let i = 0; i < rows.length; i++) {
		let row = rows[ i ];
		row.addEventListener('mouseenter', () =>{
			//console.log(`Before block: ${row.cells[ 5 ].firstElementChild.style}`);
			row.cells[9].firstElementChild.style.display = 'block';
			//console.log(`After block: ${row.cells[ 5 ].firstElementChild.style}`);
		});
		
		row.addEventListener('click', () => {
			row.cells[9].firstElementChild.style.display = 'block';
		});
		
		row.addEventListener('mouseleave', () =>{
			/*	let dropdown = M.Dropdown.getInstance(document.querySelector('#dropdown-button'));
			 console.log(`Dropdown open status: ${dropdown.isOpen}`);*/
			row.cells[9].firstElementChild.style.display = 'none';
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






