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


  isMobile() {
    var check = false;
    (function(a){
      if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) 
        check = true;
    })(navigator.userAgent||navigator.vendor||window.opera);
    return check;
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
    document.querySelector(`[data-formula-type] [data-variant-title="${inputValue}"]`).classList.remove("hidden")
    document.querySelector(`[data-sticky-formula]`).innerHTML = document.querySelector(`[data-formula-type] [data-variant-title="${inputValue}"]`).innerHTML.split(":")[0]
  }

  createSubscriptionWidget() {
    if( typeof window.ReChargeWidget != 'undefined' ) {
      console.log("ReCharge widget is available!")
      
      this.waitForRecharge('.subscription-wrapper .rc-widget').then(() => {
        this.modifySubscriptionWidget('.subscription-wrapper .rc-widget');
        this.updateStickyBar(this.querySelector(".rc-option--active input").value, this.querySelector(".rc-option--active .updated-price").innerHTML ||this.querySelector(".rc-option--active .rc-option__price").innerHTML)
      })

      //remove loading circle when ready
      this.container.querySelector(".subscription-wrapper .loading-overlay__spinner").classList.add("hidden")
      this.container.querySelector(".subscription-wrapper product-form.visually-hidden").classList.remove("visually-hidden")
      this.stickyBar.querySelector("[data-sticky-atc]").removeAttribute('disabled')

      // observe input selection to update sticky bar
      this.rechargeOptions = this.querySelector(".rc-template")
      const observer = new MutationObserver(this.observeForm.bind(this))
      observer.observe(this.rechargeOptions, {attributes: true, childList: true, subtree: true})
    } else {
      console.log("waiting on ReCharge")
      
      setTimeout(() => {
        this.createSubscriptionWidget()
      }, 2000)
    }
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
