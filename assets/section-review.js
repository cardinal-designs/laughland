jQuery(document).ready(function(){
  jQuery('.Review_Slider').slick({
    centerMode: true,
    dots: true,
    prevArrow: $('.prev-slide'),
    nextArrow: $('.next-slide'),
    centerPadding: '28%',
    appendArrows:$(".Arrows"), // Class For Arrows Buttons
    prevArrow:'<span class="Slick-Prev"></span>',
    nextArrow:'<span class="Slick-Next"></span>',
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