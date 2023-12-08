"use strict";
/* tabs script*/
const $tabs = document.getElementsByClassName('gspb-tabs-wrapper');
for (let i = 0; i < $tabs.length; i++) {
	const accordionNode = $tabs[i];
	const tabsLength = accordionNode.querySelectorAll('.gspb-tabs-titles li').length;

	accordionNode.addEventListener('click', function (ev) {
		ev.preventDefault()
		if (!ev.target.matches('.gspb-tabs-title')) return;
		else {
			const newTabName = ev.target.closest('li').getAttribute('aria-controls')

			for (let i = 0; i < tabsLength; i++) {
				accordionNode.querySelectorAll('.gspb-tabs-titles li')[i].classList.remove('active')
				accordionNode.parentNode.querySelectorAll('.gspb-tabs-panel')[i].classList.remove('active')
			}

			accordionNode.parentNode.querySelector('#' + newTabName).classList.add('active')
			accordionNode.querySelector('[aria-controls=' + newTabName + ']').classList.add('active')
		}
	}, false);
}