jQuery(document).ready(function(){
  jQuery('.Review_Slider').slick({
    centerMode: true,
    dots: true,
    arrows: true,
    prevArrow: $('.prev-slide'),
    nextArrow: $('.next-slide'),
    centerPadding: '28%',
    appendArrows:$(".slick_arrow"),
    // prevArrow:'<span class="Slick-Prev"></span>',
    // nextArrow:'<span class="Slick-Next"></span>',
    // appendDots: $('.slick_dots'),
    slidesToShow: 1,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          arrows: false,
          centerMode: true,
          centerPadding: '40px',
          slidesToShow: 3
        }
      },
      {
        breakpoint: 480,
        settings: {
          arrows: false,
          centerMode: true,
          centerPadding: '40px',
          slidesToShow: 1
        }
      }
    ]
  });
});