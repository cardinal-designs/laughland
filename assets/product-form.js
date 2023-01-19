customElements.define('product-form', class ProductForm extends HTMLElement {
  constructor() {
    super();   

    this.form = this.querySelector('form');
    this.form.addEventListener('submit', this.onSubmitHandler.bind(this));
    this.cartDrawer = document.querySelector('cart-drawer');
    this.container = this.closest(".product__info-wrapper")

    this.setName();

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

    if ( name != "" && !storedProductName.toLowerCase().includes("to go pen") ) {
      this.container.querySelector('#product__title_id').innerHTML = `<span class="stylized">${name}'s</span><br> ${storedProductName.replace(/[^\p{L}\p{N}\p{P}\p{Z}^$\n]/gu, '')}`
    }

  }

  createSubscriptionWidget() {
    if( typeof window.ReChargeWidget != 'undefined' ) {
      console.log("ReCharge widget is available!")
      // const config = {
      //   productId: Number(this.dataset.productId),
      //   injectionParent: ".product-sticky-bar__inner",
      // }
      // window.ReChargeWidget.createWidget(config);
      
      this.modifySubscriptionWidget();

      //remove loading circle when ready
      this.container.querySelector(".subscription-wrapper .loading-overlay__spinner").classList.add("hidden")
      this.container.querySelector(".subscription-wrapper form.visually-hidden").classList.remove("visually-hidden")
    } else {
      console.log("waiting on ReCharge")
      
      setTimeout(() => {
        this.createSubscriptionWidget()
      }, 2000)
    }
  }

  modifySubscriptionWidget(){
    const subWidget = this.container.querySelectorAll(".rc-widget")
    
    subWidget.forEach(widget => {
      const widgetOptions = widget.querySelectorAll(".rc_widget__option")
      console.log(widget)

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

        if( option.querySelector(".rc-selling-plans")) {
          // grab from page then inject subscription details
          const cloneSubDetails = this.container.querySelector(".subscription-details").cloneNode(true)
          const firstEl = cloneSubDetails.querySelectorAll("dl")[0]
          const secondEl = cloneSubDetails.querySelectorAll("dl")[1]

          option.insertBefore(firstEl, option.querySelector(".rc-selling-plans"))
          option.appendChild(secondEl)
        }

        const subOfferPrice = this.getSubPrice()
        console.log(subOfferPrice)
        // option.querySelector("[data-price-subsave]").innerHTML = subOfferPrice
        console.log(option.querySelector("[data-price-subsave]"))
        option.querySelector("[data-price-subsave]").innerHTML = `${subOfferPrice}`
      })  
    })

  }

  getSubPrice() {
    const cookies = ['redirect_ut', 'redirect_ut_direct', 'shareasaleShopifySSCID', 'redirect_paceline', 'redirect_sweatcoin', 'redirect_miles', 'redirect_studentbeans']

    let subscriptionCookie = cookies.filter( cookieName => this.getCookie(cookieName) != null )
    let subPrice = ''

    switch(subscriptionCookie[0]) {
      case 'redirect_ut':
        subPrice = '$9 USD'
        break;
      case 'redirect_ut_direct':
        subPrice = '$9 USD'
        break
      case 'redirect_paceline':
        subPrice = '$29 USD'
        break
      case 'redirect_sweatcoin':
        subPrice = '$9.95 USD'
        break
      case 'redirect_miles':
        subPrice = '$9 USD'
        break
      case 'redirect_studentbeans':
        subPrice = '$9 USD'
        break
      default:
        subPrice = '$19 USD'
        break
    }

    return subPrice
  }

  onSubmitHandler(evt) {
    evt.preventDefault();
    
    const submitButton = this.querySelector('[type="submit"]');

    submitButton.setAttribute('disabled', true);
    submitButton.classList.add('loading');

    const body = JSON.stringify({
      ...JSON.parse(serializeForm(this.form)),
      sections: this.getSectionsToRender().map((section) => section.section),
      sections_url: window.location.pathname
    });

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
        this.cartDrawer.open();
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