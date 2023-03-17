customElements.define('product-form', class ProductForm extends HTMLElement {
  constructor() {
    super();   

    this.form = this.querySelector('form');
    this.form.addEventListener('submit', this.onSubmitHandler.bind(this));
    this.cartDrawer = document.querySelector('cart-drawer');
    this.container = this.closest(".product__info-wrapper")
    this.productId = this.dataset.productId

    this.stickyBar = document.querySelector(`sticky-product-bar[data-id="${ this.productId }"]`)

    this.setName();
    this.setVariant();

    this.createSubscriptionWidget();
  }

  getCookie(cname) {
    // const value = `; ${document.cookie}`;
    // const parts = value.split(`; ${name}=`);
    // if (parts.length === 2) return parts.pop().split(';').shift();

    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return null;
  }

  setName() {
    // // REMOVE BEFORE PRODUCTION
    // document.cookie = "firstname=Jackie"
    // document.cookie = "lastname=Valori"
    const first_name = getCookie('firstname') || ""
    const last_name = getCookie('lastname') || ""
    const storedProductName = this.container?.querySelector('#product__title_id')?.innerHTML

    const name = `${first_name}${ last_name != "" ? ' ' + last_name : ''}`

    if ( name != "" && !storedProductName?.toLowerCase().includes("to go pen") ) {
      this.container.querySelector('#product__title_id').innerHTML = `<span class="stylized">${name}'s</span><br> ${storedProductName.replace(/[^\p{L}\p{N}\p{P}\p{Z}^$\n]/gu, '')}`
    }

  }

  setVariant() {
    let strength = getCookie('strength')
    console.log(strength)
    let inputValue
    switch (strength){
      case 'sensitive':
        inputValue = '🍃 Gentle (ID: 19-2)'
        break;
      case 'medium':
        inputValue = '✨ Everyday (ID: 8-16)'
        break;
      case 'strong':
        inputValue = '🔥 Super Strength (ID: 8-17)'
        break;
      default: 
        inputValue = '✨ Everyday (ID: 8-16)'
        break;
    }

    this.querySelector(`input[value="${inputValue}"]`).click()
    if(document.querySelector(`[data-formula-type] [data-variant-title="${inputValue}"]`)){
      document.querySelector(`[data-formula-type] [data-variant-title="${inputValue}"]`).classList.remove("hidden")
      if(document.querySelector(`[data-sticky-formula]`)) document.querySelector(`[data-sticky-formula]`).innerHTML = document.querySelector(`[data-formula-type] [data-variant-title="${inputValue}"]`).innerHTML.split(":")[0]
    }

    if(variantIngredients){
      let variantIngredientList = variantIngredients.find((v) => v.id == inputValue)

      let ingredientCards = document.querySelectorAll("[data-ingredient]")
      ingredientCards.forEach((ingredient, i) => {
        if( variantIngredientList.ingredients.includes(ingredient.dataset.ingredient)) {
          ingredient.classList.remove("hidden")
        } else {
          ingredient.classList.add("hidden")
        }
        if( i == ingredientCards.length - 1) {
          ingredient.closest('.swiper').classList.add('update')
        }
      })
    }

    
  }

  createSubscriptionWidget() {
    this.waitForRecharge('.subscription-wrapper [data-widget]').then(() => {
      console.log('recharge ready')
      this.modifySubscriptionWidget('.subscription-wrapper .rc-widget');

      this.updateStickyBar(this.querySelector(".rc_widget__option__input:checked").value, this.querySelector(".rc_widget__option__input:checked").nextElementSibling.querySelector(".updated-price").innerHTML || this.querySelector(".rc_widget__option__input:checked").nextElementSibling.querySelector(".rc-option__price").innerHTML)

      //remove loading circle when ready
      this.container.querySelector(".subscription-wrapper .loading-overlay__spinner").classList.add("hidden")
      this.container.querySelector(".subscription-wrapper product-form.visually-hidden").classList.remove("visually-hidden")
      this.stickyBar.querySelector("[data-sticky-atc]").removeAttribute('disabled')

      // observe input selection to update sticky bar
      this.rechargeOptions = this.querySelector(".rc-template")
      const observer = new MutationObserver(this.observeForm.bind(this))
      observer.observe(this.rechargeOptions, {attributes: true, childList: true, subtree: true})
    })
  }

  updateStickyBar(selection, price) {
    if( selection == 'onetime' ){
      this.stickyBar.querySelector('[data-sticky-onetime]').classList.add('selected')
      this.stickyBar.querySelector('[data-sticky-subsave]').classList.remove('selected')
    } else if ( selection == 'subsave' ) {
      this.stickyBar.querySelector('[data-sticky-subsave]').classList.add('selected')
      this.stickyBar.querySelector('[data-sticky-onetime]').classList.remove('selected')
    }

    this.stickyBar.querySelector(".sticky__price").innerHTML = price
  }

  updateStickySellingPlans(e) {
    const controller = this.stickyBar.querySelector(`select#${e.target.id}_sticky `)
    controller.value = e.target.value
  }

  observeForm(mutationList, observer) {
    mutationList.forEach((mutation) => {
      if( mutation.type == 'attributes' && mutation.attributeName == 'class' && mutation.target.classList.contains('rc-option--active')) {
        
        let productSelection = mutation.target.querySelector("input").value
        let selectionPrice = mutation.target.querySelector(".updated-price")?.innerHTML || mutation.target.querySelector(".rc-option__price").innerHTML

        this.updateStickyBar(productSelection, selectionPrice)
      }
    })
  }

  waitForRecharge(selector) {
    return new Promise(resolve => {
      if (document.querySelector(selector)) {
          return resolve(document.querySelector(selector));
      }

      const observer = new MutationObserver(mutations => {
          if (document.querySelector(selector)) {
              resolve(document.querySelector(selector));
              observer.disconnect();
          }
      });

      observer.observe(document.body, {
          childList: true,
          subtree: true
      });
  });
  }

  modifySubscriptionWidget(widgetSelector){
    const widget = document.querySelector(widgetSelector)
    const subOfferPrice = this.getSubPrice()

    const widgetOptions = widget.querySelectorAll(".rc_widget__option")

    widgetOptions.forEach((option) => {

      // Global widget changes
      const customEl = document.createElement("div")
      customEl.setAttribute('class', 'rc-custom-radio-button')
      option.querySelector(".rc_widget__option__selector label").appendChild(customEl)

      const textEl = document.createElement("span")
      textEl.innerHTML = "&#8212;"
      option.querySelector(".rc_widget__option__selector label").insertBefore(textEl, option.querySelector(".rc_widget__option__selector label > span:nth-of-type(2)"))

      // Subscription option only changes
      // Exit if this is the One Time option
      if (option.getAttribute("data-option-onetime") != null) {
        return
      }

      option.querySelector(".rc-selling-plans__label")?.classList.remove("visually-hidden");

      if( option.querySelector(".rc-selling-plans") ) {
        // grab from page then inject subscription details
        const cloneSubDetails = this.container.querySelector(".subscription-details").cloneNode(true)
        const firstEl = cloneSubDetails.querySelectorAll("dl")[0]
        const secondEl = cloneSubDetails.querySelectorAll("dl")[1]

        option.insertBefore(firstEl, option.querySelector(".rc-selling-plans"))
        option.appendChild(secondEl)

        const newSubPrice = document.createElement("span")
        newSubPrice.setAttribute('class', 'updated-price')
        newSubPrice.innerHTML = subOfferPrice
  
        option.querySelector("[data-price-subsave]").classList.add('visually-hidden')
        option.querySelector(".rc_widget__option__selector label").appendChild(newSubPrice)
      }
    })

    const stickyBar = document.querySelector(`sticky-product-bar[data-id="${ this.productId }"]`)
    stickyBar.querySelector(".sticky__price").innerHTML = subOfferPrice

    const dropdownCopy = this.querySelector("[name='selling_plan'").cloneNode(true)
    dropdownCopy.setAttribute("data-control-id", dropdownCopy.id)
    dropdownCopy.id = dropdownCopy.id + "_sticky"
    dropdownCopy.setAttribute('name', dropdownCopy.getAttribute("name") + "_sticky")
    stickyBar.querySelector("[data-sticky-subsave").appendChild(dropdownCopy)

    this.querySelector("[name='selling_plan'").addEventListener("change", function(e){
      this.updateStickySellingPlans(e)
    }.bind(this))

  }

  getSubPrice() {
    const cookies = ['redirect_ut', 'redirect_ut_direct', 'shareasaleShopifySSCID', 'redirect_paceline', 'redirect_sweatcoin', 'redirect_miles', 'redirect_studentbeans']

    let subscriptionCookie = cookies.filter( cookieName => this.getCookie(cookieName) != null )
    let subPrice = ''

    switch(subscriptionCookie[0]) {
      case 'redirect_ut':
        subPrice = '$9'
        break;
      case 'redirect_ut_direct':
        subPrice = '$9'
        break
      case 'redirect_paceline':
        subPrice = '$29'
        break
      case 'redirect_sweatcoin':
        subPrice = '$9.95'
        break
      case 'redirect_miles':
        subPrice = '$9'
        break
      case 'redirect_studentbeans':
        subPrice = '$9'
        break
      default:
        subPrice = '$19'
        break
    }

    return subPrice
  }

  onSubmitHandler(evt) {
    evt.preventDefault();
    
    document.cookie = "directcheckout=true;path=/";

    const submitButton = this.querySelector('[type="submit"]');

    submitButton.setAttribute('disabled', true);
    submitButton.classList.add('loading');

    const body = JSON.stringify({
      ...JSON.parse(serializeForm(this.form)),
      sections: this.getSectionsToRender().map((section) => section.section),
      sections_url: window.location.pathname
    });

    if(submitButton.dataset.dsicountCode){
      if(submitButton.dataset.dsicountCode != "") document.cookie = `productDiscountCode=${submitButton.dataset.dsicountCode}`;
    }

    return;

    fetch(`${routes.cart_add_url}`, { ...fetchConfig('javascript'), body })
      .then((response) => response.json())
      .then((parsedState) => {

        this.getSectionsToRender().forEach((section => {
          const elementToReplace =
            document.getElementById(section.id).querySelector(section.selector) || document.getElementById(section.id);

          elementToReplace.innerHTML =
            this.getSectionInnerHTML(parsedState.sections[section.section], section.selector);

        }));
      })
      .catch((e) => {
        console.error(e);
      })
      .finally(() => {
        submitButton.classList.remove('loading');
        submitButton.removeAttribute('disabled');
        // this.cartDrawer.open();
        document.querySelector('.page-transition').classList.toggle('visible');
        window.location = '/cart'
      });
  }

  getSectionsToRender() {
    return [
      {
        id: 'cart-drawer__content',
        section: document.getElementById('cart-drawer__content').dataset.id,
        selector: '.cart-drawer__content',
      },
      {
        id: 'cart-icon-bubble',
        section: 'cart-icon-bubble',
        selector: '.shopify-section'
      }
    ];
  }

  getSectionInnerHTML(html, selector) {
    return new DOMParser()
      .parseFromString(html, 'text/html')
      .querySelector(selector).innerHTML;
  }

  handleErrorMessage(errorMessage = false) {
    this.errorMessageWrapper = this.errorMessageWrapper || this.querySelector('.product-form__error-message-wrapper');
    this.errorMessage = this.errorMessage || this.errorMessageWrapper.querySelector('.product-form__error-message');

    this.errorMessageWrapper.toggleAttribute('hidden', !errorMessage);

    if (errorMessage) {
      this.errorMessage.textContent = errorMessage;
    }
  }
});

customElements.define('sticky-product-bar', class StickyProductBar extends HTMLElement {
  constructor() {
    super()

    this.container = this.closest('.product-sticky-bar')
    this.productId = this.dataset.id
    this.onetime = this.querySelector("[data-sticky-onetime")
    this.subsave = this.querySelector("[data-sticky-subsave")
    this.mainForm = document.querySelector(`product-form[data-product-id="${ this.productId}"]`)
    this.atc = this.querySelector("[data-sticky-atc]")
    this.open = this.container.querySelector("[data-sticky-open]")
    this.close = this.container.querySelector("[data-sticky-close]")

    this.waitForEl("sticky-product-bar [data-plans-dropdown").then(() => {
      this.sellingPlans = this.querySelector("[data-plans-dropdown]")
      this.sellingPlans.addEventListener("change", function(e){
        this.updateSellingPlans(e)
      }.bind(this))
    })

    this.bindEvents()
  }

  bindEvents() {
    this.open.addEventListener("click", this.openStickyBar.bind(this))
    this.close.addEventListener("click", this.closeStickyBar.bind(this))

    this.onetime.addEventListener('click', function(e){
      document.querySelector(`product-form[data-product-id="${ this.productId}"] [data-label-onetime]`).click()
    }.bind(this))

    this.subsave.addEventListener('click', function(e){
      document.querySelector(`product-form[data-product-id="${ this.productId}"] [data-label-subsave]`).click()
    }.bind(this))

    this.atc.addEventListener('click', function(e){
      e.preventDefault();
      this.atc.setAttribute("disabled", "true")
      document.querySelector(`product-form[data-product-id="${ this.productId}"] button[type="submit"]`).click()
    }.bind(this))
  }

  openStickyBar() {
    slideDown(this.parentElement)
    this.open.setAttribute("aria-hidden", "true")
  }

  closeStickyBar() {
    slideUp(this.parentElement)
    this.open.setAttribute("aria-hidden", "false")
  }

  updateSellingPlans(e) {
    const controller = document.querySelector(`product-form[data-product-id="${ this.productId}"] select#${e.target.dataset.controlId} `)
    controller.value = e.target.value
  }

  waitForEl(selector) {
    return new Promise(resolve => {
      if (document.querySelector(selector)) {
          return resolve(document.querySelector(selector));
      }

      const observer = new MutationObserver(mutations => {
          if (document.querySelector(selector)) {
              resolve(document.querySelector(selector));
              observer.disconnect();
          }
      });

      observer.observe(document.body, {
          childList: true,
          subtree: true
      });
  });
  }
})
