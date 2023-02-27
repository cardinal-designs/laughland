jQuery(document).ready(function(){
  jQuery('.Review_Slider').slick({
    centerMode: true,
    dots: true,
    arrows: true,
    prevArrow: $('.prev-slide'),
    nextArrow: $('.next-slide'),
    centerPadding: '28%',
    appendArrows:$(".slick_arrow"),
    appendDots: $('.slick_dots'),
    slidesToShow: 1,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          centerMode: true,
          centerPadding: '40px',
          slidesToShow: 3
        }
      },
      {
        breakpoint: 480,
        settings: {
          centerMode: true,
          centerPadding: '40px',
          slidesToShow: 1
        }
      }
    ]
  });
});