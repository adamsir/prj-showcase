export function debounce(methods, delayDef = 500, options = {}) {
	return {
    created () {
    	const customDelay = typeof delayDef !== 'number'
      methods.forEach(m => {
        const delay = customDelay
        	? delayDef[m]
          : delayDef
        this[m] = _.debounce(this[m], delay, options)
      })
    }
  }
}

export function getDateFromNow(timeInMinutes) {
  return new Date(new Date().getTime() + timeInMinutes * 60 * 1000)
}
export const reducedMap = ((data, keys, fn) =>
  data.map(el =>
    keys.reduce((acc, key) => {
      acc[key] = el[key];
      return acc;
    }, {})
  )
);

// Removes duplicated objects from the array
export function removeDuplicates(myArr, prop) {
  return myArr.filter((obj, pos, arr) => {
      return arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos;
  });
}

// Removes the object described by id from the array
export function removeObj(obj, id) {
  let index = obj.map((item) => item.id).indexOf(id);
  
  obj.splice(index, 1);
}

// Add property to an object
export function extendObj(obj, prop) {
  obj.forEach(objItem => {
    prop.forEach(propItem => {
      objItem[propItem.name] = propItem.value;
    });
  });

  return obj;
}

// Convert JSON object to FormData
export function jsonToFormData(data) {
  const formData = new FormData();
  
  for (let key in data) {
    formData.append(key, data[key]);
  }
  
  return formData;
}

// Parse form errors array object
export function parseErrors(errors) {
  let err = {};
  let errorsMap = errors.map(key => key.error)

  for (let key in errorsMap) {
    Object.assign(err, errorsMap[key]);
  }

  return err;
}


// sha256 snippet
export function sha256(message) {

  function _getBuffer(message) {
    return new Promise((resolve, reject) => {
      if (!message) {
        reject('sha256: missing argument')
      }
      // encode as UTF-8
      const msgBuffer = new TextEncoder('utf-8').encode(message);                    
    
      // hash the message
      const hashBuffer = crypto.subtle.digest('SHA-256', msgBuffer);
    
      resolve(hashBuffer)
    });
  }

  return new Promise((resolve, reject) => {
    _getBuffer(message).then((hashBuffer) => {
      // convert ArrayBuffer to Array
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      
      // convert bytes to hex string                  
      const hash = hashArray.map(b => ('00' + b.toString(16)).slice(-2)).join('');
      resolve(hash);
    });
  })
}

// Get url params pairs
export function getURLParams(str) {
  let searchParams = new URLSearchParams(str);
  let params = [];

  // Display the key/value pairs
  for(let pair of searchParams.entries()) {
    let obj = {
      key: pair[0],
      value: pair[1]
    }
    params.push(obj);
  }

  return params;
}

// isMobile helper
export function isMobile() {
  return (/Android|iPhone|iPad|iPod|BlackBerry/i).test(navigator.userAgent || navigator.vendor || window.opera);
}

// userAgent helper
export function getUserAgent() {
  let ua = {
    userAgent: window.navigator.userAgent,
    viewport: {
      width: window.innerWidth,
      height: window.innerHeight,
    }
  }

  return ua;
}
