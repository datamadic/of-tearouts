'use strict';

var target = document.querySelector('.drop-target');

target.addEventListener('dragover', function (evnt) {
	evnt.preventDefault();
	console.log('over', evnt);
});

target.addEventListener('drop', function (evnt) {
	evnt.preventDefault();
	console.log('drop', evnt);
});