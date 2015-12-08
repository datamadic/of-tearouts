var target = document.querySelector('.drop-target');

target.addEventListener('dragover', evnt => {
	evnt.preventDefault();
	console.log('over' , evnt);
});

target.addEventListener('drop', evnt => {
	evnt.preventDefault();
	console.log('drop' , evnt);

	window.opener.ocn.dispatch('drop-init', evnt.dataTransfer.getData('text/plain'));

});