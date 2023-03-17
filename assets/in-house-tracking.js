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

function setGoogleTag(affiliate_source, effective_landing_page) {
  gtag('set', 'user_properties', {
    affiliate_source: affiliate_source,
    effective_landing_page: effective_landing_page
  });
}

document.cookie = "in_house_first_land=true; expires=Thu, 18 Dec 2013 12:00:00 UTC; path=/";
