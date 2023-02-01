jQuery(document).ready(function($){  
  
  jQuery(window).scroll(function(){
    var sticky = jQuery('.template-404 .outer-header-wrapper, .template-page .outer-header-wrapper'),
        scroll = jQuery(window).scrollTop();

    if (scroll >= 50){
        sticky.addClass('scrolled');
    }
    else {
        sticky.removeClass('scrolled');
    }
  });
  
});