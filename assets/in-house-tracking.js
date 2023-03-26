affiliate_cookie_options = ['redirect_ut', 'redirect_ut_direct', 'redirect_paceline', 'redirect_sweatcoin', 'redirect_miles', 'redirect_studentbeans']

// if user arrives at mylaughland.com?utm_affiliate_specific=cactus_media
// set cookie to cactus media, and google referral tag to cactus media
// if first time, set redirect to whatever it is.
// shareasaleShopifySSCID

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
  // if (getCookie("in_house_already_redirected") != 'true') {
  //   setCookie('in_house_already_redirected', 'true')
              
  var d = Math.random();
  if (d <= .5) {
    setGoogleLanding('homepage')
    // window.location.href = 'https://www.mylaughland.com'
  } else {
    setGoogleLanding('landing-page')
    window.location.href = 'https://www.mylaughland.com/pages/landing-page'
  }
  // }
}


function setInHouseTracked() {
  gtag('set', 'user_properties', {
    in_house_tracked: "true"
  });
}


function setLandingPageFlag(flag_value) {
  gtag('set', 'user_properties', {
    landing_page_flag: flag_value
  });
}


function setGoogleSourceDev(affiliate_source_dev) {
  gtag('set', 'user_properties', {
    affiliate_source_dev: affiliate_source_dev
  });
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


function setCookieAffiliate(cookie, affiliate) {
  setCookie(cookie, 'true')
  setGoogleSource(affiliate)
}


function setFirstTimeGtags(landing_page_flag, affiliate) {
  if (getCookie("in_house_tracked") != 'true') {
    setCookie('in_house_tracked', 'true')
    setInHouseTracked()
    setLandingPageFlag(landing_page_flag)
    setGoogleSourceDev(affiliate)
  }
}


function landingPageAction(current_page, query_params) {
  if (current_page == '/') {
    switch(query_params.utm_affiliate_specific) {
      case 'sweatcoin':
        setCookieAffiliate('redirect_sweatcoin', 'Sweatcoin')
        setFirstTimeGtags('true', 'Sweatcoin')
        redirectToLandingIfFirstTime()
        break;
      case 'product-direct':
        setCookieAffiliate('redirect_ut_direct', 'Direct To Product (misc)')
        setFirstTimeGtags('true', 'Direct To Product (misc)')
        redirectToLandingIfFirstTime()
        break;
      case 'paceline':
        setCookieAffiliate('redirect_paceline', 'Paceline')
        setFirstTimeGtags('true', 'Paceline')
        redirectToLandingIfFirstTime()
        break;
      case 'miles':
        setCookieAffiliate('redirect_miles', 'Miles')
        setFirstTimeGtags('true', 'Miles')
        redirectToLandingIfFirstTime()
        break;
      case 'utm_partner':
        setCookieAffiliate('utm_partner', 'UTM Partner')
        setFirstTimeGtags('true', 'UTM Partner')
        redirectToLandingIfFirstTime()
        break;
      case 'utm_gen_direct':
        setCookieAffiliate('utm_gen_direct', 'UTM Gen Direct')
        setFirstTimeGtags('true', 'UTM Gen Direct')
        redirectToLandingIfFirstTime()
        break;
      case 'cactus_media':
        setCookieAffiliate('redirect_ut', 'Cactus Media')
        setFirstTimeGtags('true', 'Cactus Media')
        redirectToLandingIfFirstTime()
        break;
      default:
        setFirstTimeGtags('true', 'NA')
        break;
    } 
  } else if (current_page == 'clear-affiliate-cookies') {
      clearAllAffiliateCookies()
      removeCookie('in_house_already_redirected')
  } else {
    setFirstTimeGtags('false', current_page)
  }
}

var current_page = window.location.pathname // last page in URL before query parameters

const query_params = new Proxy(new URLSearchParams(window.location.search), {
  get: (searchParams, prop) => searchParams.get(prop),
});

landingPageAction(current_page, query_params)
