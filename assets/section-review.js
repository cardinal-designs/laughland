var swiper = new Swiper(".mySwiper", {
  slidesPerView: 4,
  spaceBetween: 30,
  centeredSlides: true,
  navigation: {
    nextEl: '.carousel-next',
    prevEl: '.carousel-prev',
  },
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
});