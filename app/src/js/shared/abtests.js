import * as c from './constants';
import * as utils from './utils';
import * as cookies from 'js-cookie';

function getShortHash(obj) {
  return obj.split(0, obj.length/3)[0];
}



export function hook() {
/*   window.onbeforeunload = function () {
    cookies.remove(c.ABFLAG)
  }; */

  return new Promise((resolve, reject) => {
    let keyPattern = 'tid';
    let variants = c.AB_TESTS;
    let testHash = null;
    let windowSearch = window.location.search;
    let urlFallback = window.location.pathname;

    // prepare params
    let urlParams = windowSearch ? utils.getURLParams(window.location.search) : null;
    if ((!urlParams || urlParams.length == 0) && !cookies.get(c.ABFLAG)) {
      resolve(false);
    }

    // get hash of the test from urlParams
    let hasTestMatch = false;
    if (cookies.get(c.ABFLAG)) {
      testHash = cookies.get(c.ABFLAG);
      hasTestMatch = true;
    } else {
      testHash = urlParams.filter(value => value.key === keyPattern)[0].value;
      hasTestMatch = true;
    }

    // resolve url fallback
    if (windowSearch) {
      let otherParams = urlParams.filter(value => value.key !== keyPattern);
      if (otherParams && otherParams.length > 0) {
        let params = '?';
        otherParams.forEach((param)=> {
          params += `${param.key}=${param.value}&`
        });
        urlFallback += params;
      }
    }
    
    
    // compare the param hash with variants
    function matchTestByHash(matchHash) {
      return new Promise((resolve, reject) => {
        variants.filter(variant => {
          utils.sha256(variant.name).then((variantHash) => {
            let hash = getShortHash(variantHash);
            let test = matchHash === hash ? variant : null;
            if (test) {
              test['hash'] = hash;
              resolve(test);
            }
          });
        });
      });
    }
   
    matchTestByHash(testHash).then((res) => {
      let abCookie = cookies.get(c.ABFLAG);
      if (!abCookie || abCookie !== res.hash) {
        cookies.set(c.ABFLAG, res.hash, { expires: 90 });
      }
      if (hasTestMatch) {
        window.history.pushState({}, "Title", urlFallback)
      }
      resolve(res);
    });

  })
}

