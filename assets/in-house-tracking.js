affiliate_cookie_options = ['redirect_ut', 'redirect_ut_direct', 'redirect_paceline', 'redirect_sweatcoin', 'redirect_miles', 'redirect_studentbeans']

// if user arrives at mylaughland.com?utm_affiliate_specific=cactus_media
// set cookie to cactus media, and google referral tag to cactus media
// if first time, set redirect to whatever it is.


function getCookie(cname) {
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


function setCookie(key, value) {
  var date = new Date();
  date.setFullYear(date.getFullYear() + 1);
  var expires = date.toUTCString();
  document.cookie = `${key}=${value}; expires=${expires}; path=/`;
}


function removeCookie(key) {
  document.cookie = `${key}=true;expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/;`
}


function clearAllAffiliateCookies(){
  affiliate_cookie_options.forEach((affiliate, index) => removeCookie(affiliate));
}


function redirectToLandingIfFirstTime() {
  // If I haven't redirected, redirect to random page and set landing page cookie.
  // Mark redirect in cookies so we don't redirect again if a user somehow goes back with the same utm params.
  if (getCookie("in_house_already_redirected") != 'true') {
    setCookie('in_house_already_redirected', 'true')
              
    var d = Math.random();
    if (d <= .5) {
      setGoogleLanding('homepage')
      // window.location.href = 'https://www.mylaughland.com'
    } else {
      setGoogleLanding('landing-page')
      window.location.href = 'https://www.mylaughland.com/pages/landing-page'
    }  
  }
}


function setGoogleSource(affiliate_source) {
  gtag('set', 'user_properties', {
    affiliate_source: affiliate_source
  });
}


function setGoogleLanding(effective_landing_page) {
  gtag('set', 'user_properties', {
    effective_landing_page: effective_landing_page
  });
}


function clearAndSetCookiesAffiliates(cookie, affiliate) {
  clearAllAffiliateCookies()
  setCookie(cookie, 'true')
  setGoogleSource(affiliate)
}


function landingPageAction(current_page, query_params) {
  if (current_page == '/') {
    switch(query_params.utm_affiliate_specific) {
      case 'cactus_media':
        clearAndSetCookiesAffiliates('redirect_ut', 'Cactus Media')
        redirectToLandingIfFirstTime()
        break;
      case 'sweatcoin':
        clearAndSetCookiesAffiliates('redirect_sweatcoin', 'Sweatcoin')
        redirectToLandingIfFirstTime()
        break;
      case 'product-direct':
        clearAndSetCookiesAffiliates('redirect_ut_direct', 'Direct To Product (misc)')
        redirectToLandingIfFirstTime()
        break;
      case 'paceline':
        clearAndSetCookiesAffiliates('redirect_paceline', 'Paceline')
        redirectToLandingIfFirstTime()
        break;
      case 'miles':
        clearAndSetCookiesAffiliates('redirect_miles', 'Miles')
        redirectToLandingIfFirstTime()
        break;
      case 'utm_partner':
        clearAndSetCookiesAffiliates('utm_partner', 'UTM Partner')
        redirectToLandingIfFirstTime()
        break;
      case 'utm_gen_direct':
        clearAndSetCookiesAffiliates('utm_gen_direct', 'UTM Gen Direct')
        redirectToLandingIfFirstTime()
        break;
      default:
        setGoogleSource('NA')
        setGoogleLanding("homepage")
        break;
    } 
  } else if (current_page == 'clear-affiliate-cookies') {
      clearAllAffiliateCookies()
      removeCookie('in_house_already_redirected')
  }
}

var current_page = window.location.pathname // last page in URL before query parameters

const query_params = new Proxy(new URLSearchParams(window.location.search), {
  get: (searchParams, prop) => searchParams.get(prop),
});

landingPageAction(current_page, query_params)
