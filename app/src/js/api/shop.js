import 'whatwg-fetch';
import * as cookies from 'js-cookie';
import * as c from '../shared/constants';
import { jsonToFormData } from '../shared/utils';

export function getData(endpoint) {
  return new Promise((resolve, reject) => {
    const request = {
      method: 'GET',
      credentials: 'same-origin',
    };

    fetch(`${c.API}/${endpoint}`, request)
    .then((res) => {
      resolve(res.json());
    }).catch(function(ex) {
      reject(ex);
    });
  });
}

export function post(endpoint, data) {
  return new Promise((resolve, reject) => {
    let isVerifiedRequest = cookies.get(c.CSRF) || null;

    const request = {
      method: 'POST',
      credentials: 'same-origin',
      body: jsonToFormData(data),
      headers: {
        'x-csrftoken': window.middlewareToken
      }
    };

    fetch(`${c.API}/${endpoint}/`, request)
    .then((res) => {
      resolve(res.json());
    }).catch(function(ex) {
      reject(ex);
    });

  });
}

export function generateCSRFToken(force = false) {
  return new Promise((resolve, reject) => {
    if (!cookies.get(c.CSRF) || force) {
      let expiration = new Date(new Date().getTime() + 5 * 60 * 1000);
      cookies.set(c.CSRF, window.middlewareToken, { expires: expiration });
      /* getData('get-hash').then(
        (res) => {
          resolve(res.hash);
        }
      ); */
      resolve(true);
    } else {
      resolve(cookies.get(c.CSRF));
    }
  });
}
