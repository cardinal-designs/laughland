affiliate_cookie_options = ['redirect_ut', 'redirect_ut_direct', 'redirect_paceline', 'redirect_sweatcoin', 
          'redirect_miles', 'redirect_studentbeans']


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
  removeCookie('in_house_first_land')
}


function chooseLandingPage() {
  var d = Math.random();

  if (d <= .5) {
    return ['homepage', 'https://www.mylaughland.com']
  } else {
    return ['landing-page', 'https://www.mylaughland.com/pages/landing-page']
  }
}


function setGoogleTag(affiliate_source, effective_landing_page) {
  in_house_first_land = getCookie('in_house_first_land') // This should only be non true if this is a newly active GA session
  if (in_house_first_land != 'true') {
    setCookie('in_house_first_land', 'true')
    gtag('set', 'user_properties', {
      affiliate_source: affiliate_source,
      effective_landing_page: effective_landing_page
    });
  }
}

function landingPageAction(current_page) {
  switch(current_page) {
      case 'clear-affiliate-cookies':
        clearAllAffiliateCookies()
        break;
      case 'utm_gen':
        clearAllAffiliateCookies()
        setCookie('redirect_ut', 'true')
        landing = chooseLandingPage()
        setGoogleTag('Cactus Media', landing[0])
        window.location = landing[1]
      default:
        setGoogleTag('NA', 'homepage')
        // window.location = 'https://www.mylaughland.com'
        break
    }
}

broken_url = window.location.href.split('?')[0].split('/')
current_page = broken_url[broken_url.length - 1]
landingPageAction(current_page)

in_house_first_land = getCookie('in_house_first_land') // This should only be non true if this is a newly active GA session
if (in_house_first_land != 'true') {
  setCookie('in_house_first_land', 'true')
  
} else if (window.location.href.includes('clear-affiliate-cookies')) {
  console.log('hi there sir')
  clearAllAffiliateCookies()
}
