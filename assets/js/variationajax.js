/* Wc add to cart version 2.2 */
jQuery( function( $ ) {

	// wc_add_to_cart_params is required to continue, ensure the object exists
	if ( typeof wc_add_to_cart_params === 'undefined' )
		return false;
	
	// Ajax add to cart
	$( document ).on( 'click', '.variations_form .single_add_to_cart_button', function(e) {
		
		e.preventDefault();
		e.stopPropagation();
		
		$variation_form = $( this ).closest( '.variations_form' );
		var var_id = $variation_form.find( 'input[name=variation_id]' ).val();
		var product_id = $variation_form.find( 'input[name=product_id]' ).val();
		var quantity = $variation_form.find( 'input[name=quantity]' ).val();
		
		//attributes = [];
		$( '.ajaxerrors' ).remove();
		var item = {},
			check = true;
			
			variations = $variation_form.find( 'select[name^=attribute]' );
			
			/* Updated code to work with radio button - mantish - WC Variations Radio Buttons - 8manos */ 
			if ( !variations.length) {
				variations = $variation_form.find( '[name^=attribute]:checked' );
			}
			
			/* Backup Code for getting input variable */
			if ( !variations.length) {
    			variations = $variation_form.find( 'input[name^=attribute]' );
			}
		
		variations.each( function() {
		
			var $this = $( this ),
				attributeName = $this.attr( 'name' ),
				attributevalue = $this.val(),
				index,
				attributeTaxName;
		
			$this.removeClass( 'error' );
		
			if ( attributevalue.length === 0 ) {
				index = attributeName.lastIndexOf( '_' );
				attributeTaxName = attributeName.substring( index + 1 );
		
				$this
					.addClass( 'required error' )
					.before( '<div class="ajaxerrors redcolor font80">Please select ' + attributeTaxName + '</div>' )
		
				check = false;
			} else {
				item[attributeName] = attributevalue;
			}
		
		} );
		
		if ( !check ) {
			return false;
		}
		
		var $thisbutton = $( this );

		if ( $thisbutton.is( '.variations_form .single_add_to_cart_button' ) ) {

			$thisbutton.removeClass( 'added' );
			$thisbutton.addClass( 'loading' );

			var data = {
				action: 'woocommerce_add_to_cart_variable_gspb',
			};

			$variation_form.serializeArray().map(function (attr) {
				if (attr.name !== 'add-to-cart') {
				    if (attr.name.endsWith('[]')) {
				        let name = attr.name.substring(0, attr.name.length - 2);
				        if (!(name in data)) {
				            data[name] = [];
				        }
				        data[name].push(attr.value);
				    } else {
				        data[attr.name] = attr.value;
				    }
				}
			});

			// Trigger event
			$( 'body' ).trigger( 'adding_to_cart', [ $thisbutton, data ] );

			// Ajax action
			$.post( wc_add_to_cart_params.ajax_url, data, function( response ) {

				if ( ! response ) {
					return;
				}

				if ( response.error && response.product_url ) {
					window.location = response.product_url;
					return;
				}

				// Redirect to cart option
				if ( wc_add_to_cart_params.cart_redirect_after_add === 'yes' ) {
					window.location = wc_add_to_cart_params.cart_url;
					return;
				}

				// Trigger event so themes can refresh other areas.
				$( document.body ).trigger( 'added_to_cart', [ response.fragments, response.cart_hash, $thisbutton ] );

			});

			return false;

		} else {
			
			return true;
		}

	});

});

if(document.querySelectorAll('.gspbgrid_item .variations_form.cart').length){
    document.querySelectorAll('.gspbgrid_item .variations_form.cart').forEach((form) => {
        form.addEventListener('change', () => gspbChangeImageByVariationLoop('change', form));
    });
}
if(document.querySelectorAll('.gspbgrid_item .reset_variations').length){
    document.querySelectorAll('.gspbgrid_item .reset_variations').forEach((resetbtn) => {
        resetbtn.addEventListener('click', () => gspbChangeImageByVariationLoop('click', resetbtn));
    });
}

function gspbChangeImageByVariationLoop(event, item) {
    const mainImg = item.closest('.gspbgrid_item').querySelector('.gspb-product-featured-image img');
    if (event === 'click') {
        const gsswatches = document.getElementsByClassName('gs-var-selector');
        if(gsswatches.length){
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
        let revertsrc = mainImg.getAttribute('data-main-src');
        if(revertsrc){
            mainImg.setAttribute('src', revertsrc);
            mainImg.setAttribute('srcset', mainImg.getAttribute('data-main-srcset'));
        }
    } else gspbmainFuncChangeImage(item);

    function gspbmainFuncChangeImage(item) {
        let variationsObj = JSON.parse(item.closest('.gspbgrid_item').querySelector('.variations_form.cart').getAttribute('data-product_variations'))
        const currentVariationId = item.closest('.gspbgrid_item').querySelector('input.variation_id').getAttribute('value');
        const currentVariation = variationsObj.filter((e) => {
            return parseInt(e.variation_id) === parseInt(currentVariationId);
        });

        if(mainImg){
            if (currentVariation.length) {
                const single_src = currentVariation[0].image.src;
                const srcset = currentVariation[0].image.srcset || '';
                const mainImgsrc = mainImg.getAttribute('src');
                const mainImgsrcset = mainImg.getAttribute('srcset');
                let datasrc = mainImg.getAttribute('data-main-src');
    
                if (mainImg) {
                    if(!datasrc){
                        mainImg.setAttribute('data-main-src', mainImgsrc); 
                        mainImg.setAttribute('data-main-srcset', mainImgsrcset); 
                    }
                    mainImg.setAttribute('src', single_src);
                    mainImg.setAttribute('srcset', srcset);
                }
            } else {
                let revertsrc = mainImg.getAttribute('data-main-src');
                if(revertsrc){
                    mainImg.setAttribute('src', revertsrc);
                    mainImg.setAttribute('srcset', mainImg.getAttribute('data-main-srcset'));
                }

            }
        }
    }
}