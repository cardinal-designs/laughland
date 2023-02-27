$('.Instagram_Slider').slick({
  dots: true,
  infinite: false,
  speed: 300,
  slidesToShow: 5,
  slidesToScroll: 2,
  dots: false,
  appendArrows:$(".slick_pagination .slick_arrow_insta"),
  prevArrow:'<span class="Slick-Prev"></span>',
  nextArrow:'<span class="Slick-Next"></span>',
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 3,
        infinite: true,
      }
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 2
      }
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1
      }
    }
  ]
});

function realReviewSlider() {

  if (window.matchMedia("(max-width: 991px)").matches) {  
    $('.Images_List').slick({
      slidesToShow: 1,
      slidesToScroll: 1,
      dots: true,
      arrows: false  
    }); 
  } 
  else {
    $('.Images_List').slick('unslick');
  }
  
}

$(document).ready(function() {
  realReviewSlider();
})

$(window).on('resize orientationchange', function() {
  realReviewSlider();
})