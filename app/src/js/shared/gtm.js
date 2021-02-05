import * as utils from './utils';

function preventEmptyObject(obj) {
  if ( !obj || Object.keys(obj).length == 0 ) { return false; }
}

function getEcommerceProducts(products) {

  products.forEach((product) => {
    product['name'] = product.title;
    product['brand'] = 'Project';
    product['category'] = !product.is_accessories ? 'Product' : 'Accessory';
  })

  let ecommerceProducts = utils.reducedMap(products, ['id', 'name', 'price', 'brand', 'category', 'list', 'position', 'quantity'])

  ecommerceProducts.map(item => {
    if (!item.list) {
      delete item.list
    }
    if (!item.position) {
      delete item.position
    }
    if (!item.quantity) {
      delete item.quantity
    }
  });

  return ecommerceProducts;
}

function getProductIDs(arr) {
  return arr.map(item => item['id']);
}

export function trackProductDetailImpression(productObj) {
  preventEmptyObject(productObj);

  if (!window.hasGTMImpression['productDetail']) {
    dataLayer.push({
      'pageType': 'detail',
      'currency': 'EUR',
      'productIds': productObj.id,
      'event': 'productDetail',
      'ecommerce': {
        'detail': {
          'actionField': {},
          'products': [{
            name: productObj.title,
            id: productObj.id,
            price: productObj.price,
            brand: 'Project',
            category: !productObj.is_accessories ? 'Product' : 'Accessory'
          }]
         }
       }
    });
  }
}

export function trackProductMoreInfoImpression(productObj) {
  preventEmptyObject(productObj);
  
  let impression = [{
    id: productObj.id,
    name: productObj.title,
    price: productObj.price,
    brand: 'Project',
    category: !productObj.is_accessories ? 'Product' : 'Accessory',
    position: productObj.position,
    list: 'Homepage'
  }];

  dataLayer.push({
    'pageType': 'detail',
    'currency': 'EUR',
    'event': 'productClick',
    'ecommerce': {
      'click': {
        'actionField': {'list': 'Homepage'},
        'products': impression
      },
    }
  });
}

/* homepage products impression */
export function trackProductsImpression(productsObj) {
  preventEmptyObject(productsObj);

  if (!window.hasGTMImpression['products']) {
    dataLayer.push({
      'pageType': 'products',
      'currency': 'EUR',
      'productIds': getProductIDs(productsObj),
      'event': 'productsImpression',
      'ecommerce': {
        'currencyCode': 'EUR',
        'impressions': getEcommerceProducts(productsObj)
      }
    });
  }
}

export function trackProductCartEventImpression(eventName = 'add', productObj) {
  preventEmptyObject(productObj);

  let actionFieldObject = {
    'currencyCode': 'EUR',
    [eventName]: {
      'products': [{
        name: productObj.title,
        id: productObj.id,
        price: productObj.price,
        brand: 'Project',
        category: !productObj.is_accessories ? 'Product' : 'Accessory'
      }]
    }
  }

  dataLayer.push({
    'event': eventName == 'add' ? 'addToCart' : 'removeFromCart',
    'ecommerce': actionFieldObject
  });
}

export function trackCheckoutImpression(productsObj, stepId) {
  preventEmptyObject(productsObj);

  let stepObj = {
    step: stepId,
    option: null
  };

  let pageType = '';

  /* Resolve checkout-step object */
  if (stepId === 1) {
    stepObj['step'] = 1;
    pageType = 'accessories';
  }

  if (stepId === 2) {
    stepObj['step'] = 2;
    pageType = 'shipping';
  }

  if (stepId === 3) {
    stepObj['step'] = 3;
    pageType = 'billing';
  }

  dataLayer.push({
    'pageType': pageType,
    'currency': 'EUR',
    'productIds': getProductIDs(productsObj),
    'event': 'checkout',
    'ecommerce': {
      'checkout': {
        'actionField': stepObj,
        'products': getEcommerceProducts(productsObj)
      }
    }
  });
}

export function trackChangeCountryOnCheckoutLastStep() {
  let event = {
    'pageType': 'billing',
    'event': 'change_country_make_order_3'
  }

  dataLayer.push(event);
} 
