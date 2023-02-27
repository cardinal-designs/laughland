$('.Images_List').slick({
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
      breakpoint: 769,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 2,
        centerMode: true,
        centerPadding: '10%',
        infinite: true,
        arrow: false
      }
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
        centerMode: true,
        centerPadding: '15%',
        infinite: true
      }
    }
  ]
});