jQuery(document).ready(function(){
  jQuery('.Review_Slider').slick({
    centerMode: true,
    dots: true,
    prevArrow: $('.prev-slide'),
    nextArrow: $('.next-slide'),
    centerPadding: '28%',
    prevArrow: '<div class="news__arrow news__arrow_dir_left"></div>',
    nextArrow: '<div class="news__arrow news__arrow_dir_right"></div>',
    appendDots: $('.news__dots'),
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