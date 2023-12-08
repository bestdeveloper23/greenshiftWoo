const gspbWooReviewLinks = document.querySelectorAll('.woocommerce-review-link');
gspbWooReviewLinks.forEach(link => {
    link.addEventListener('click', function() {
        let tabs = document.querySelectorAll('.gspb-tabs-titles li');
        if(tabs.length > 0) {
            tabs.forEach(tab => {
                tab.classList.remove('active');
                if(tab.getAttribute('aria-controls') === 'tab-reviews') {
                    tab.classList.add('active');
                }
            });
            document.querySelector('#tab-reviews').classList.add('active');
        }
        let toggles = document.querySelectorAll('.gspb-toggle-wrap');
        if(toggles.length > 0) {
            toggles.forEach(toggle => {
                toggle.classList.remove('active');
                if(toggle.querySelector('.gspb-toggle-link').getAttribute('href') === '#toggle-reviews') {
                    toggle.classList.add('active');
                    const sh = toggle.querySelector('.gspb-toggle-content').scrollHeight;
                    toggle.querySelector('.gspb-toggle-content').style.maxHeight = sh + 'px';
                }
            });
        }
        if(document.querySelector('.gspb-section-wrap')){
            let reviewsBlock = document.querySelector('#reviews');
            reviewsBlock.scrollIntoView({behavior: "smooth"});
        }
    });
});
