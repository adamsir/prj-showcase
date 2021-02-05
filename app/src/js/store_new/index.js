import Vue from 'vue'
import Vuex from 'vuex'
import createLogger from 'vuex/dist/logger'
import cart from './modules/cart'
import products from './modules/products'
import countries from './modules/countries'
import shipping from './modules/shipping'
import loading from './modules/loading'
import payment from './modules/payment' /* @todo consider merge forms */
import business from './modules/business' /* @todo consider merge forms */
import coupon from './modules/coupon' /* @todo consider merge forms */
import credentials from './modules/credentials' /* @todo consider merge forms */

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  modules: {
    cart,
    products,
    countries,
    shipping,
    payment,
    loading,
    business,
    coupon,
    credentials,
  },
  strict: debug,
  plugins: debug ? [createLogger()] : []
})
