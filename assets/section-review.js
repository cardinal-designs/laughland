var swiper = new Swiper(".mySwiper", {
  slidesPerView: 3,
  spaceBetween: 30,
  centeredSlides: true,
  navigation: {
    nextEl: '.carousel-next',
    prevEl: '.carousel-prev',
  },
  pagination: {
    el: '.carousel-pagination',
    type: 'bullets',
  },
});
