jQuery(document).ready(function($){  
  
  jQuery(window).scroll(function(){
    var sticky = jQuery('.template-404 .outer-header-wrapper, .template-page .outer-header-wrapper, .template-customers\/login .outer-header-wrapper'),
        scroll = jQuery(window).scrollTop();

    if (scroll >= 50){
        sticky.addClass('scrolled');
    }
    else {
        sticky.removeClass('scrolled');
    }
  });

  var header_padding = jQuery('outer-header-wrapper'),

    console.log($header_padding);
  
});