document.addEventListener("click", (e) => {
    // Check if the clicked element matches the selector
    if (e.target.matches(".gspb-product-quick-view-box-button")) {
      e.preventDefault();
      e.target.parentNode.parentNode.querySelector('.gspb-product-quick-view-popup').classList.add('active');
    }
  
    // Check if the clicked element matches the selector
    if (e.target.matches(".gspb-product-quick-view-close")) {
      e.preventDefault();
      e.target.parentNode.parentNode.classList.remove('active');
    }
});