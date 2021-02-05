/* Main entry-point */
import Index from './components/views/Index.vue'

/* Order entry-point */
import Checkout from './components/views/Checkout.vue'

/* Children pages of our entry-point as templates (props-based) */
import HomePage from './components/pages/HomePage.vue'
import ProductPage from './components/pages/ProductPage.vue'
import UpsellPage from './components/pages/UpsellPage.vue'
import ShippingPage from './components/pages/ShippingPage.vue'
import BillingPage from './components/pages/BillingPage.vue'


import * as constants from '@/shared/constants';
import * as cookies from 'js-cookie';

function verifyCheckoutGuard (to, from, next) {
  const shouldContinue = cookies.get(constants.ALLOW_CHECKOUT) && cookies.get(constants.UUID)

  if (shouldContinue) {
    next()
  } else {
    // clean up history, if some part exists
    cookies.remove(constants.ALLOW_CHECKOUT)
    cookies.remove(constants.UUID)
    next('/')
  }
}

function orderGuard (to, from, next) {
  const orderDetail = cookies.get(constants.ORDER_DETAIL_URL)

  if (orderDetail) {
    window.location.href = orderDetail
    cookies.remove(constants.ORDER_DETAIL_URL)
  } else {
    next()
  }
}

export const RoutesMap = [
  { path: '/', meta: {}, component: Index, beforeEnter: orderGuard,
    children: [
      { path: '/', name: 'home', component: HomePage },
      { path: '/product/:slug', name: 'product', component: ProductPage },
      { path: '/make-order/', component: Checkout, beforeEnter: verifyCheckoutGuard, alias: ['/make-order/1/'],
        children: [
          { path: '1', meta: { name: 'checkout' }, name: 'checkout:upsell', component: UpsellPage },
          { path: '2', meta: { name: 'checkout' }, name: 'checkout:shipping', component: ShippingPage },
          { path: '3', meta: { name: 'checkout' }, name: 'checkout:billing', component: BillingPage },
        ] 
      },
    ] 
  },
];
