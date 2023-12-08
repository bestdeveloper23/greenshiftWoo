function gspb_ajax_woo_cart_loading(el) {
	if (typeof wc_cart_fragments_params === 'undefined') {
		return false;
	}
	const widgetCartContent = el.querySelector(".widget_shopping_cart");
	widgetCartContent.classList.add('loaded', 're_loadingbefore');

	const request = new XMLHttpRequest();
	request.open('POST', wc_cart_fragments_params.wc_ajax_url.toString().replace('%%endpoint%%', 'get_refreshed_fragments'), true);
	request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
	request.timeout = wc_cart_fragments_params.request_timeout;
	request.responseType = 'json';
	request.onload = function () {
		if (this.status >= 200 && this.status < 400) {
			let data = this.response;
			if (data && data.fragments) {
				widgetCartContent.innerHTML = data.fragments["div.widget_shopping_cart_content"];
				widgetCartContent.classList.remove("re_loadingbefore");
			}

		} else {
			// Response error
		}
	};
	request.onerror = function () {
		// Connection error
	};
	request.send('time=' + new Date().getTime());
}

const menuCartBtn = document.querySelectorAll('.gspb-menu-cart-btn-panel-open');
for (let i = 0; i < menuCartBtn.length; i++) {
	const widget = document.querySelector('#gspb-woo-cart-panel');
	let div = document.createElement('div');
	div.appendChild(widget);
	document.body.appendChild(div);

	menuCartBtn[i].addEventListener('click', (e) => {
		e.preventDefault();

		if (!widget.classList.contains('active')) {
			widget.classList.add('active');
			document.body.classList.add('scrollhidden');
		}
		gspb_ajax_woo_cart_loading(widget);
	})
}

//close the sliding panel
const closeSlidingPanel = document.querySelectorAll('.gspb-sslide-panel');
for (let i = 0; i < menuCartBtn.length; i++) {
	closeSlidingPanel[i].addEventListener('click', (e) => {
		const widget = document.querySelector('#gspb-woo-cart-panel')
		if (e.target.classList.contains('gspb-sslide-panel') || e.target.classList.contains('close-panel-svg')) {
			widget.classList.remove('active');
			document.body.classList.remove('scrollhidden');
			widget.querySelector('.widget_shopping_cart').innerHTML = '';
		}
	})
}