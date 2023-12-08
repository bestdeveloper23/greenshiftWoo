const gsResetVariationsBtn = document.querySelector('.variations_form .reset_variations');
if(gsResetVariationsBtn !== null) {
    document.addEventListener('click', (ev) => {
        if (!ev.target.matches('.reset_variations')) return;
        else {
            const gsswatches = document.getElementsByClassName('gs-var-selector');
    
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
    })
}

const gsSwatches = document.getElementsByClassName('gs-var-input');
if(gsSwatches !== null && gsSwatches.length) {
    for (let i = 0; i < gsSwatches.length; i++) {
        let attr = gsSwatches[i].closest('.gs-var-selector').getAttribute('data-attribute');
        gsSwatches[i].addEventListener("click", (e) => {
            if(e.currentTarget.checked) {
                const newValue = e.currentTarget.value;
                const select = e.currentTarget.parentNode.parentNode.querySelector("select[name="+attr+"]");
                select.value = newValue;
                select.dispatchEvent(new Event("change"));
                jQuery("select[name="+attr+"]").trigger("change");
            }
        });
    }
}

jQuery('.variations_form').on('woocommerce_update_variation_values', function () {
    const gsswatches = document.getElementsByClassName('gs-var-selector');

    for (let i = 0; i < gsswatches.length; i++) {
        const labels = gsswatches[i].getElementsByClassName('gs-var-label')
        const variationselect = gsswatches[i].previousSibling;

        for (let b = 0; b < labels.length; b++) {
            labels[b].classList.remove('gshidden');
            // console.log(variationselect.querySelector('option[value="' + labels[b].getAttribute('data-value') + '"]').value);
            if (variationselect.querySelector('option[value="' + labels[b].getAttribute('data-value') + '"]') === null) {
                labels[b].classList.add('gshidden');
            }
        }

    }
});