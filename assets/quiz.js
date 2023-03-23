customElements.define('formula-quiz', class FormulaQuiz extends HTMLElement {
  static get observedAttributes() {
    return ["data-state"];
  }
  constructor() {
    super();  

    this.open = document.querySelectorAll("[data-open-quiz]")
    this.close = this.querySelector(".quiz__close")
    this.headlines = this.querySelectorAll(".quiz__headline")
    this.quizCards = this.querySelectorAll(".form__step-wrapper")

    this.currentStep = this.dataset.state
    this.allInputs = this.querySelectorAll(`.form__step-wrapper input`)

    // this.inputs = this.querySelectorAll(`.form__step-wrapper[data-step='${this.currentStep}'] input`)
    // this.inputNames = []
    // Array.from(this.inputs).forEach((i) => {if (!this.inputNames.includes(i.name)) this.inputNames.push(i.name)})
    // console.log(this.inputNames)

    this.setInputs(this.currentStep)

    this.back = this.querySelector("[data-form-back]")
    this.next = this.querySelector("[data-form-next]")
    this.submit = this.querySelector("[data-form-submit]")

    this.form = this.querySelector(".quiz__form")

    this.addEventListener('keyup', (evt) => evt.code === 'Escape' && this.closeQuiz.bind(this))

    this.allInputs.forEach((input) => {
      input.addEventListener('change', function(e){
        if(this.validateFormStep(this.inputs) == true) {
          this.next.removeAttribute('disabled')
        } else {
          this.next.setAttribute('disabled', 'true')
        }
      }.bind(this))
    })

    this.bindEvents();
  }

  bindEvents() {
    this.open.forEach((button) => {
      button.addEventListener("click", function(e){
        e.preventDefault();
        if(document.querySelector("body").classList.contains("Menu_Open")) {
          document.querySelector("menu-drawer").closeMenuDrawer()
        }
        document.querySelector('.sticky-footer__button')?.click()
      } )
    })
    this.back.addEventListener('click', this.changeFormStep.bind(this, -1))
    this.next.addEventListener('click', this.changeFormStep.bind(this, 1))
    this.close.addEventListener('click', this.closeQuiz.bind(this))
    this.submit.addEventListener('click', function(e){
      this.submitForm(e)
    }.bind(this))
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
    let newState = currentState
    if ( x === 1  && currentState < 5 ){
      newState = ++currentState
    } else if ( x === -1 && currentState > 1) {
      newState = --currentState
    }

    this.setAttribute('data-state', newState )

    this.setInputs(newState)
    if(this.validateFormStep(this.inputs) == true) {
      this.next.removeAttribute('disabled')
    } else {
      this.next.setAttribute('disabled', 'true')
    }
  }

  setInputs(step) {
    this.inputs = this.querySelectorAll(`.form__step-wrapper[data-step='${step}'] input`)
    this.inputNames = []
    Array.from(this.inputs).forEach((i) => {if (!this.inputNames.includes(i.name)) this.inputNames.push(i.name)})
  }

  validateFormStep(inputs) {
    let validationCheck = true
    for( const value of this.inputNames.values()){
      const i = this.querySelector(`[name='${value}']`)
      if( i.getAttribute('type') == 'checkbox' || i.getAttribute('type') == 'radio' ) {

        if(this.querySelector(`[name='${value}']:checked`)?.value == "" || this.querySelector(`[name='${value}']:checked`)?.value == undefined ){
          validationCheck = false
          break
        }
      } else {

        if(this.querySelector(`[name='${value}']`)?.value == "" || this.querySelector(`[name='${value}']`)?.value == undefined ){
          validationCheck = false
          break
        }
      }
    }
    return validationCheck
  }

  submitForm(e) {
    e.preventDefault();
    this.submit.classList.add("loading")
    // Check for email field
    // If we need more validation, we can add that. Currently email is the only required field
    if( this.querySelector('#ourformbutforklaviyo').value == ''){
      this.querySelector('#ourformbutforklaviyo').focus();
      this.querySelector('.form-error-message').classList.remove('hidden')
      this.submit.classList.remove("loading")
    } else {
      //prep data for submit
      let contactForm = new FormData(document.querySelector('#contact_form'))
      let klaviyoForm = document.querySelector("#email_signup")

      let sensitivity = document.querySelector('input[name="sensitivity"]:checked')?.value || 'medium'

      let formula_translate = {
        'mild' : 'strong',
        'medium': 'medium',
        'very': 'sensitive'
      }

      klaviyoForm.querySelector("#k_id_email").value = this.querySelector('#ourformbutforklaviyo').value
      klaviyoForm.querySelector("#k_id_firstname").value = this.querySelector('#first_name').value
      klaviyoForm.querySelector("#k_id_lastname").value = this.querySelector('#last_name').value
      klaviyoForm.querySelector("#klaviyo_form_sensitivity").value = formula_translate[sensitivity]

      let goals = ""
      this.querySelectorAll("[name='goals']:checked")?.forEach((goal) => {  goals == "" ? goals = goal.value : goals = goals + ", " + goal.value })

      klaviyoForm.querySelector("#klaviyo_form_goals").value = goals
      klaviyoForm.querySelector("#klaviyo_form_brush_times").value = this.querySelector("[name='brushtimes']:checked")?.value || ""
      klaviyoForm.querySelector("#klaviyo_form_cavities").value = this.querySelector("[name='cavities']:checked")?.value || ""
      klaviyoForm.querySelector("#klaviyo_form_shade").value = this.querySelector("[name='shade']:checked")?.value || ""
      klaviyoForm.querySelector("#klaviyo_form_stain").value = this.querySelector("[name='stain']:checked")?.value || ""
      klaviyoForm.querySelector("#klaviyo_form_previous_use").value = this.querySelector("[name='previous_use']:checked")?.value || ""

      let klaviyoFormData = new FormData(klaviyoForm)
      // for (var [key, value] of klaviyoFormData.entries()) { 
      //   console.log(key, value);
      // }

      // submit
      klaviyoForm.querySelector(".klaviyo_submit_button").click()

      // handle redirect

      document.cookie =  "strength=" + formula_translate[sensitivity] + "; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/;"
      document.cookie = "firstname=" + document.querySelector('#first_name').value + "; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/;"
      document.cookie = "lastname=" + document.querySelector('#last_name').value + "; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/;"

      let ut = getCookie('redirect_ut')
      let ut_direct = getCookie('redirect_ut_direct')

      setTimeout(function(){
        console.log(document.cookie)
  
        if (ut == 'true' && ut_direct != 'true') {
          window.location = '/products/at-home-whitening-kit'
        } else {
          window.location = '/products/at-home-whitening-kit'
        }
      }, 1000);

    }
  }
})