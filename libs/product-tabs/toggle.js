"use strict";

/* toggle script*/
const $toggles = document.getElementsByClassName('gspb-toggle-link');
for (let i = 0; i < $toggles.length; i++) {
	const toggleNode = $toggles[i];

	toggleNode.addEventListener('click', function (ev) {
		ev.preventDefault();
			const sh = ev.target.closest('.gspb-toggle-wrap').querySelector('.gspb-toggle-content').scrollHeight;
			ev.target.closest('.gspb-toggle-wrap').classList.toggle('active');
			ev.target.closest('.gspb-toggle-wrap').querySelector('.gspb-toggle-content').style.maxHeight = ev.target.closest('.gspb-toggle-wrap').classList.contains('active') ? sh + 'px' : 0 + 'px';
	}, false);
}