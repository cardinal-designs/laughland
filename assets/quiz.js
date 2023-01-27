customElements.define('formula-quiz', class FormulaQuiz extends HTMLElement {
  static get observedAttributes() {
    return ["data-state"];
  }
  constructor() {
    super();  

    this.close = this.querySelector(".quiz__close")
    this.headlines = this.querySelectorAll(".quiz__headline")
    this.quizCards = this.querySelectorAll(".form__step-wrapper")

    this.currentStep = this.dataset.state

    this.back = this.querySelector("[data-form-back]")
    this.next = this.querySelector("[data-form-next]")
    this.submit = this.querySelector("[data-form-submit]")

    this.form = this.querySelector(".quiz__form")

    console.log(this.close)
    this.addEventListener('keyup', (evt) => evt.code === 'Escape' && this.closeQuiz.bind(this))
    this.bindEvents();
  }

  bindEvents() {
    this.back.addEventListener('click', this.changeFormStep.bind(this, -1))
    this.next.addEventListener('click', this.changeFormStep.bind(this, 1))

    this.close.addEventListener('click', this.closeQuiz.bind(this))
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (newValue !== oldValue && oldValue != null ) {
      this.querySelector(`.quiz__headline[data-step="${ oldValue }"`).classList.remove('active')
      this.querySelector(`.quiz__headline[data-step="${ newValue }"`).classList.add('active')

      this.querySelector(`.form__step-wrapper[data-step="${ oldValue }"`).classList.remove('active')
      this.querySelector(`.form__step-wrapper[data-step="${ newValue }"`).classList.add('active')

      if( newValue == 5 ){
        this.next.classList.toggle('hidden')
        this.submit.classList.remove('hidden')
      }
      if ( newValue == 4 && oldValue == 5 ){
        this.next.classList.toggle('hidden')
        this.submit.classList.add('hidden')
      }
    }
  }

  closeQuiz() {
    this.querySelector('.quiz').style.transitionDelay = '.2s'
    this.querySelector('.quiz').setAttribute('aria-hidden', 'true')
    document.querySelector('.page-transition__content').style.transform = 'translate(-50%, 50%)'
    setTimeout(() => {
      document.querySelector('.page-transition').classList.toggle('visible');
      document.querySelector('.sticky-footer__button').classList.toggle('hide')
      document.querySelector('.page-transition__content').style.removeProperty('transform')
      this.querySelector('.quiz').style.removeProperty('transition-delay')
    }, 900)
  }

  changeFormStep(x) {
    let currentState = this.dataset.state
    if ( x === 1  && currentState < 5 ){
      let newState = ++currentState
      this.setAttribute('data-state', newState )
    } else if ( x === -1 && currentState > 1) {
      let newState = --currentState
      this.setAttribute('data-state', newState )
    }
  }

  validateFormStep() {

  }
})