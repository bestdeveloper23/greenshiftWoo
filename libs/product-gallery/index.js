"use strict";
document.addEventListener('DOMContentLoaded', function () {

    const galleries = document.getElementsByClassName('gspb-product-image-gallery');

    for (let i = 0; i < galleries.length; i++) {
        const gallery = galleries[i];
        const disableMobileVertical = gallery.classList.contains('disable-mobile-vertical');
        let direction = (window.innerWidth < 576 && disableMobileVertical) ? 'horizontal' : gallery.getAttribute('data-direction');

        gspbGenerateSliderThumbs(gallery, direction);
        window.addEventListener('resize', function () {
            direction = (window.innerWidth < 576 && disableMobileVertical) ? 'horizontal' : gallery.getAttribute('data-direction');
            if (disableMobileVertical) {
                gspbGenerateSliderThumbs(gallery, direction);
            }
        });

        if (gallery.closest('.product')) {
            const variationsObj = gallery.closest('.product').querySelector('.variations_form.cart') !== null ? JSON.parse(gallery.closest('.product').querySelector('.variations_form.cart').getAttribute('data-product_variations')) : '';

            if (variationsObj.length) {
                if (gallery.closest('.product').querySelector('.variations_form.cart') !== null) {
                    gallery.closest('.product').querySelector('.variations_form.cart').addEventListener('change', () => changeImageByVariation('change'));
                }
                if (gallery.closest('.product').querySelector('.reset_variations') !== null) {
                    gallery.closest('.product').querySelector('.reset_variations').addEventListener('click', () => changeImageByVariation('click'));
                }

                function changeImageByVariation(event) {
                    if (event === 'click') {
                        const gsswatches = document.getElementsByClassName('gs-var-selector');
                        if (gsswatches.length) {
                            for (let i = 0; i < gsswatches.length; i++) {
                                const labels = gsswatches[i].getElementsByClassName('gs-var-label');
                                const inputs = gsswatches[i].getElementsByClassName('gs-var-input');

                                for (let b = 0; b < labels.length; b++) {
                                    labels[b].classList.remove('gshidden');
                                }

                                for (let b = 0; b < inputs.length; b++) {
                                    inputs[b].checked = false;
                                }
                            }
                        }
                        setTimeout(mainFunc, 100);
                    } else mainFunc();

                    function mainFunc() {
                        const currentVariationId = gallery.closest('.product').querySelector('input.variation_id').getAttribute('value');
                        const currentVariation = variationsObj.filter((e) => {
                            return parseInt(e.variation_id) === parseInt(currentVariationId);
                        });

                        if (galleries.length) {
                            if (currentVariation.length) {

                                const single_src = currentVariation[0].image.src;
                                const thumb_src = currentVariation[0].image.gallery_thumbnail_src;
                                const srcset = currentVariation[0].image.srcset || '';

                                for (let i = 0; i < galleries.length; i++) {
                                    const mainImg = galleries[i].querySelector('.gspb-gallery-full .swiper-slide-main-image img');
                                    const thumbImg = galleries[i].querySelector('.gspb-gallery-thumb .swiper-slide-main-image img');

                                    if (galleries[i].querySelector('.slide-variation-images') !== null) {

                                        galleries[i].classList.add('slide-variation-images-selector');
                                        const thumbSlides = galleries[i].querySelectorAll('.gspb-gallery-thumb .swiper-wrapper > div');
                                        const mainSlides = galleries[i].querySelectorAll('.gspb-gallery-full .swiper-wrapper > div');

                                        // Loop through each swiper slide
                                        thumbSlides.forEach((slide, index) => {
                                            if(index != 0){
                                                if (slide.classList.contains('slide-variation-' + currentVariationId)) {
                                                    slide.classList.remove('slide-variation-hidden');
                                                    slide.classList.add('swiper-slide');
                                                    mainSlides[index].classList.remove('slide-variation-hidden');
                                                    mainSlides[index].classList.add('swiper-slide');
                                                } else {
                                                    slide.classList.remove('swiper-slide');
                                                    slide.classList.add('slide-variation-hidden');
                                                    mainSlides[index].classList.remove('swiper-slide');
                                                    mainSlides[index].classList.add('slide-variation-hidden');
                                                }
                                            }
                                        });

                                        if (mainImg) {
                                            mainImg.setAttribute('src', single_src);
                                            mainImg.setAttribute('url', single_src);
                                            mainImg.setAttribute('srcset', srcset);
                                        }
                                        if (thumbImg) {
                                            thumbImg.setAttribute('src', thumb_src);
                                        }
                                        galleries[i].querySelector('.gspb-gallery-thumb').swiper.update();
                                        galleries[i].querySelector('.gspb-gallery-full').swiper.update();
                                        galleries[i].querySelector('.gspb-gallery-full').swiper.slideTo(0);

                                    } else {
                                        // Get all elements with class .swiper-slide
                                        const thumbSlidesImages = galleries[i].querySelectorAll('.gspb-gallery-thumb .swiper-slide img');

                                        let matchingSlideIndex = -1;

                                        // Loop through each swiper slide
                                        thumbSlidesImages.forEach((slide, index) => {
                                            // Check if the slide has a data-url attribute
                                            const dataUrl = slide.getAttribute('data-main-featured-image-src');
                                            if (dataUrl) {
                                                // If the data-url matches the provided url, set the index and exit the loop
                                                if (dataUrl === single_src) {
                                                    matchingSlideIndex = index;
                                                }
                                            }
                                        });

                                        if (matchingSlideIndex !== -1) {
                                            if (typeof galleries[i].querySelector('.gspb-gallery-full').swiper !== 'undefined') {
                                                galleries[i].querySelector('.gspb-gallery-full').swiper.slideTo(matchingSlideIndex);
                                            }
                                        } else {
                                            if (mainImg) {
                                                mainImg.setAttribute('src', single_src);
                                                mainImg.setAttribute('url', single_src);
                                                mainImg.setAttribute('srcset', srcset);
                                            }
                                            if (thumbImg) {
                                                thumbImg.setAttribute('src', thumb_src);
                                            }
                                            if (typeof galleries[i].querySelector('.gspb-gallery-full').swiper !== 'undefined') {
                                                galleries[i].querySelector('.gspb-gallery-full').swiper.slideTo(1);
                                            }
                                        }
                                    }

                                }

                            } else {
                                for (let i = 0; i < galleries.length; i++) {
                                    const mainImg = galleries[i].querySelector('.gspb-gallery-full .swiper-slide-main-image img');
                                    const thumbImg = galleries[i].querySelector('.gspb-gallery-thumb .swiper-slide-main-image img');

                                    if (mainImg) {
                                        mainImg.setAttribute('src', mainImg.getAttribute('data-main-featured-image-src'));
                                        mainImg.setAttribute('url', mainImg.getAttribute('data-main-featured-image-src'));
                                        mainImg.setAttribute('srcset', mainImg.getAttribute('data-main-featured-image-srcset'));
                                    }
                                    if (thumbImg) {
                                        thumbImg.setAttribute('src', thumbImg.getAttribute('data-main-featured-image-src'));
                                    }

                                    if (galleries[i].querySelector('.slide-variation-images') !== null) {
                                        galleries[i].classList.remove('slide-variation-images-selector');

                                        const thumbSlides = galleries[i].querySelectorAll('.gspb-gallery-thumb .swiper-wrapper > div');
                                        const mainSlides = galleries[i].querySelectorAll('.gspb-gallery-full .swiper-wrapper > div');

                                        // Loop through each swiper slide
                                        thumbSlides.forEach((slide, index) => {
                                            slide.classList.remove('slide-variation-hidden');
                                            slide.classList.add('swiper-slide');
                                            mainSlides[index].classList.remove('slide-variation-hidden');
                                            mainSlides[index].classList.add('swiper-slide');
                                        });
                                        galleries[i].querySelector('.gspb-gallery-thumb').swiper.update();
                                        galleries[i].querySelector('.gspb-gallery-full').swiper.update();
                                        galleries[i].querySelector('.gspb-gallery-full').swiper.slideTo(0);

                                    }

                                }
                            }
                        }
                    }
                }
            }
        }
    }

}, false);

const gspbGenerateSliderThumbs = (gallery, direction) => {
    const swipergallery = gallery.querySelector('.gspb-gallery-thumb');
    if (swipergallery) {
        let slidesPerView = parseFloat(swipergallery.dataset.slidesperview);
        let slidesPerViewMD = parseFloat(swipergallery.dataset.slidesperviewmd);
        let slidesPerViewSM = parseFloat(swipergallery.dataset.slidesperviewsm);
        let slidesPerViewXS = parseFloat(swipergallery.dataset.slidesperviewxs);
        let spaceBetween = parseInt(swipergallery.dataset.spacebetween);
        let spaceBetweenMD = parseInt(swipergallery.dataset.spacebetweenmd);
        let spaceBetweenSM = parseInt(swipergallery.dataset.spacebetweensm);
        let spaceBetweenXS = parseInt(swipergallery.dataset.spacebetweenxs);
        let swiperobj = swipergallery.swiper;
        if (swiperobj !== undefined) {
            swiperobj.destroy();
        }
        const fullSlider = gallery.querySelector('.gspb-gallery-full');
        let swiperFullobj = fullSlider.swiper;
        if (swiperFullobj !== undefined) {
            swiperFullobj.destroy();
        }

        const swiperThumb = new Swiper(swipergallery, {
            loop: false,
            spaceBetween: spaceBetween,
            slidesPerView: slidesPerView,
            freeMode: false,
            watchSlidesProgress: true,
            direction: direction,
            noSwiping: true,
            noSwipingClass: 'swiper-no-swiping',
            breakpoints: {
                236: {
                    slidesPerView: slidesPerViewXS ? slidesPerViewXS : slidesPerView,
                    spaceBetween: spaceBetweenXS ? spaceBetweenXS : spaceBetween
                },
                576: {
                    slidesPerView: slidesPerViewSM ? slidesPerViewSM : slidesPerView,
                    spaceBetween: spaceBetweenSM ? spaceBetweenSM : spaceBetween
                },
                768: {
                    slidesPerView: slidesPerViewMD ? slidesPerViewMD : slidesPerView,
                    spaceBetween: spaceBetweenMD ? spaceBetweenMD : spaceBetween
                },
                992: {
                    spaceBetween,
                    slidesPerView
                }
            },
        });
        let btnright = '';
        let btnleft = '';
        let currentparentSwiper = gallery.closest('.gs-slider-root');
        if (!currentparentSwiper) {
            currentparentSwiper = gallery.closest('.gspb_row');
        }
        if (currentparentSwiper) {
            btnright = currentparentSwiper.querySelector('.gs-slider-custom-btn-right');
            btnleft = currentparentSwiper.querySelector('.gs-slider-custom-btn-left');
        }
        const swiperFull = new Swiper(fullSlider, {
            loop: false,
            spaceBetween: 0,
            grabCursor: true,
            thumbs: {
                swiper: swiperThumb,
            },
            navigation: { nextEl: btnright || gallery.querySelector('.swiper-button-next'), prevEl: btnleft || gallery.querySelector('.swiper-button-prev') },
        });
    }
}

const lighboxwoogallaries = document.getElementsByClassName('gspb_product_gallery_lightbox');
if (lighboxwoogallaries.length) {
    let arraylight = Array.from(lighboxwoogallaries);
    arraylight.forEach(item => {
        new SimpleLightbox({ elements: item.querySelectorAll('.imagelink'), videoRegex: new RegExp(/\.mp4|youtube.com|vimeo.com/) });
    });
}