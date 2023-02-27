jQuery(document).ready(function(){
  jQuery('.Review_Slider').slick({
    centerMode: true,
    dots: true,
    arrows: true,
    centerPadding: '28%',
    appendArrows:$(".slick_pagination .slick_arrow"),
    prevArrow:'<span class="Slick-Prev"></span>',
    nextArrow:'<span class="Slick-Next"></span>',
    appendDots: $('.slick_dots'),
    slidesToShow: 1,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          centerPadding: '20%'
        }
      },
      {
        breakpoint: 768,
        settings: {
          centerPadding: '5%'
        }
      },
      {
        breakpoint: 479,
        settings: {
          centerPadding: '12%'
        }
      }
    ]
  });
});