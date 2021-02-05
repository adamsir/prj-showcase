import * as constants from '@/shared/constants'
import * as cookies from 'js-cookie'
import * as api from "@/api/shop"
import { router } from '@/app'

function navigationGuard (items) {
  if (items.length > 0) {
    if (!cookies.get(constants.ALLOW_CHECKOUT)) {
      cookies.set(constants.ALLOW_CHECKOUT, true)
    }
  }
  // redirect when cart becomes empty
  if (items.length === 0) {
    cookies.remove(constants.ALLOW_CHECKOUT)
    // make redirect on checkout only
    if (router.history.current.meta.name === 'checkout') {
      router.push('/')
    }
  }
}

function updateCredentials({ dispatch }, { data: data, form }) {
  Object.keys(data[form]).forEach((key, index) => {
    if (key === 'country') {
      return false
    }

    if (!data[form][key]) {
      return false
    }

    const formField = {
      formName: form,
      formData: {
        key: key,
        value: data[form][key]
      }
    }

    dispatch('credentials/update', formField, { root: true })
  })
}

function patchCredentialField({ dispatch }, { data: data, form: form, field: field, disabled: disabled, errors: errors }) {
  // disable state/province fields when provinces aren't provided
  const formField = {
    errors: errors,
    disabled: disabled,
    formName: form,
    formData: {
      key: field,
      value: data
    }
  }
  dispatch('credentials/update', formField, { root: true })
}

function handleApiErrors({ commit, dispatch }, apiErrors) {
  let errors = []
  apiErrors.forEach(error => {
    let key = Object.keys(error)[0]
    let value = error[key][0]
    let scope

    if (key.startsWith('shipping')) {
      scope = 'shipping_address'
    } else {
      if (key == "terms" || key == "duties") {
        scope = 'agreement'
      } else {
        scope = 'address'
      }
    }

    errors.push({ field: key, msg: value, scope: scope })
  })

  // fill form errors with normalized errors
  errors.forEach(item => {
    let field = item.field
    let form = item.scope
    let msg = item.msg
    dispatch('credentials/update', { errors: msg, formName: form, formData: { key: field, value: false }}, { root: true })
  })

  commit('setErrors', errors)

  // scroll to top
  window.scrollBy({ 'behavior': 'smooth', 'left': 0, 'top': -window.scrollY });
}

// Initial state
const state = {
  accessToken: "",
  items: [],
  values: {
    subtotal: null,
    total: null,
    info: '',
  },
  discount: null,
  errors: null
}


const mutations = {
  setAccessToken (state, data) {
    state.accessToken = data
    cookies.set(constants.UUID, data)
  },

  pushProductToCart (state, data) {
    state.items.push(data)
  },

  deleteProductFromCart (state, data) {
    state.items = state.items.filter((item) => item.id !== data.id);
  },

  updateItemQuantity (state, data) {
    const cartItem = state.items.find(item => item.id === data.id)
    cartItem.quantity = data.quantity
  },

  incrementItemQuantity (state, { id }) {
    const cartItem = state.items.find(item => item.id === id)
    cartItem.quantity++
  },

  decrementItemQuantity (state, { id }) {
    const cartItem = state.items.find(item => item.id === id)
    cartItem.quantity--
  },

  setCheckoutStatus (state, data) {
    state.checkoutStatus = data
  },

  setProducts (state, data) {
    state.items = data
  },

  setValues (state, data) {
    state.values = data
  },

  setDiscount (state, data) {
    state.discount = data
  },

  setErrors (state, data) {
    state.errors = data
  }
}

const actions = {
  getAllData ({ state, commit, rootState, dispatch }) {
    commit('loading/app', true, { root: true })

    if (cookies.get(constants.UUID)) {
      commit('setAccessToken', cookies.get(constants.UUID))
    } else {
      cookies.remove(constants.ALLOW_CHECKOUT)
      dispatch('products/getAllProducts', null, { root: true })
      return false;
    }

    api.getData('cart').then((data) => {
      /* check the situation, when cart is invalid */
      /* @todo send better api format when token is invalid */
      if (data.invalid) { /* invalid cart */
        router.go('/')
        cookies.remove(constants.UUID)
        cookies.remove(constants.ALLOW_CHECKOUT)
        
        return false
      }
      /* update country and shippings */
      commit('countries/setCountryCurrent', data.address.country, { root: true })
      commit('countries/setProvinces', data.provinces, { root: true })
      commit('countries/setProvinceCurrent', data.address.state, { root: true })
      commit('countries/setConfirmed', data.is_country_confirmed, { root: true })
      commit('shipping/setAll', data.shipping_methods, { root: true })
      commit('shipping/setCurrent', data.shipping_method.id, { root: true })
      commit('shipping/setDifferent', data.is_different_shipping, { root: true })

      /* update payment methods */
      commit('payment/setAll', data.payment_methods, { root: true })
      commit('payment/setCurrent', data.payment_methods[0].id, { root: true })
      
      // update all credential fields
      updateCredentials({ dispatch }, { data: data, form: 'address' })
      if (data.shipping_address) {
        updateCredentials({ dispatch }, { data: data, form: 'shipping_address' })
      }

      // patch selected fields
      const noProvinces = Object.keys(data.provinces).length === 0
      patchCredentialField({ dispatch }, { data: data.address.email, form: 'address', field: 'email', disabled: true })
      patchCredentialField({ dispatch }, { data: data.address.state, form: 'address', field: 'state', disabled: noProvinces })
      patchCredentialField({ dispatch }, { data: data.address.state, form: 'shipping_address', field: 'state', disabled: noProvinces })
      patchCredentialField({ dispatch }, { data: data.address.country.id, form: 'address', field: 'country' })
      patchCredentialField({ dispatch }, { data: data.address.country.id, form: 'shipping_address', field: 'country' })
      
      // business value-added
      if (data.address.vat_id) {
        dispatch('business/update', {formName: 'form', formData: { key: 'vat_id', value: data.address.vat_id }}, { root: true })
      }

      // hide duties checkbox
      /* @todo refactor */
      const hideDutiesAgreement = data.address.country.region === 'EU'
      dispatch('credentials/update', { disabled: hideDutiesAgreement, formName: 'agreement', formData: { key: 'duties', value: false }}, { root: true })


      /* set subtotal, total */
      commit('setValues', { subtotal: data.subtotal, total: data.total, info: data.total_price_tooltip })
      /* set discount */
      commit('setDiscount', data.discount_perc)
      /* set cart products */
      commit('setProducts', data.items)
      /* set country-specific products by id */
      dispatch('products/getAllProducts', data.address.country.id, { root: true })
      /* validate checkout */
      navigationGuard(state.items)
    }).catch(e => { console.log(e) })

  },

  /* @todo update all states (condider it) */
  sendData ({ state, commit, dispatch }, requestData) {
    // handle unconfirmed country
    if (requestData['isCountryConfirmed']) {
      commit('countries/setConfirmed', true, { root: true })
    }

    // when country is changed
    if (requestData['country']) {
      commit('loading/country', true, { root: true })
      commit('setErrors', null)
    }

    api.post('cart', requestData).then(data => {
      /* @todo dyi - handle Cart access token */
      if (!cookies.get(constants.UUID)) {
        commit('setAccessToken', data.token)
      }

      // patch selected fields
      const noProvinces = Object.keys(data.provinces).length === 0
      patchCredentialField({ dispatch }, { data: data.address.state, form: 'address', field: 'state', disabled: noProvinces })
      patchCredentialField({ dispatch }, { data: data.address.state, form: 'shipping_address', field: 'state', disabled: noProvinces })
      patchCredentialField({ dispatch }, { data: data.address.country.id, form: 'address', field: 'country' })
      patchCredentialField({ dispatch }, { data: data.address.country.id, form: 'shipping_address', field: 'country' })

      // hide duties checkbox
      /* @todo refactor */
      const hideDutiesAgreement = data.address.country.region === 'EU'
      dispatch('credentials/update', { disabled: hideDutiesAgreement, formName: 'agreement', formData: { key: 'duties', value: false }}, { root: true })

      /* update country and shippings */
      commit('countries/setCountryCurrent', data.address.country, { root: true })
      commit('countries/setProvinces', data.provinces, { root: true })
      commit('countries/setProvinceCurrent', data.address.state, { root: true })
      commit('countries/setConfirmed', data.is_country_confirmed, { root: true })
      commit('shipping/setAll', data.shipping_methods, { root: true })
      commit('shipping/setCurrent', data.shipping_method.id, { root: true })
      commit('shipping/setDifferent', data.is_different_shipping, { root: true })

      /* update payment methods */
      commit('payment/setAll', data.payment_methods, { root: true })
      commit('payment/setCurrent', data.payment_methods[0].id, { root: true })

      /* set subtotal, total */
      commit('setValues', { subtotal: data.subtotal, total: data.total, info: data.total_price_tooltip })
      /* set cart products */
      commit('setProducts', data.items)
      /* set country-specific products by id */
      dispatch('products/getAllProducts', data.address.country.id, { root: true })
    }).catch(e => { console.log(e) })
  },

  addProductToCart ({ state, commit, dispatch }, product) {
    //commit('setCheckoutStatus', null)

    const cartItem = state.items.find(item => item.id === product.id)
    let requestData = { id: product.id, quantity: 1 }

    if (!cartItem) {
      commit('pushProductToCart', product)
    } else {
      commit('incrementItemQuantity', cartItem)
      requestData['quantity'] = cartItem.quantity
    }

    commit('loading/price', true, { root: true})

    api.post("cart", requestData).then(data => {
      /* @todo dyi - handle Cart access token */
      if (!cookies.get(constants.UUID)) {
        commit('setAccessToken', data.token)
      }

      // hide duties checkbox
      /* @todo refactor */
      const hideDutiesAgreement = data.address.country.region === 'EU'
      dispatch('credentials/update', { disabled: hideDutiesAgreement, formName: 'agreement', formData: { key: 'duties', value: false }}, { root: true })

      /* update country and shippings */
      commit('countries/setCountryCurrent', data.address.country, { root: true })
      commit('shipping/setAll', data.shipping_methods, { root: true })
      commit('shipping/setCurrent', data.shipping_method.id, { root: true })
      commit('shipping/setDifferent', data.is_different_shipping, { root: true })

      /* update payment methods */
      commit('payment/setAll', data.payment_methods, { root: true })
      commit('payment/setCurrent', data.payment_methods[0].id, { root: true })

      /* if api returns a new token, update the token */
      if (data.token) {
        commit('setAccessToken', data.token)
      }
      /* update country confirmation */
      commit('countries/setConfirmed', data.is_country_confirmed, { root: true })
      /* set subtotal, total */
      commit('setValues', { subtotal: data.subtotal, total: data.total, info: data.total_price_tooltip })
      /* set upsell products */
      commit('products/setProductsUpsell', data.items, { root: true })
      commit('loading/price', false, { root: true})
    }).catch(e => {
      commit('loading/price', false, { root: true})
    })

    /* validate checkout */
    navigationGuard(state.items)
  },

  /* @todo merge logic add/remove action methods into this method */
  updateProductToCart ({ state, commit }, product) {
    //commit('setCheckoutStatus', null)

    const cartItem = state.items.find(item => item.id === product.id)
    let requestData = { id: product.id, quantity: product.quantity }

    if (product.quantity > 0) {
      commit('updateItemQuantity', requestData)
    } else {
      commit('deleteProductFromCart', product);
    }

    commit('loading/price', true, { root: true})

    api.post("cart", requestData).then(data => {
      /* @todo dyi - handle Cart access token */
      if (!cookies.get(constants.UUID)) {
        commit('setAccessToken', data.token)
      }
      /* update country and shippings */
      commit('countries/setCountryCurrent', data.address.country, { root: true })
      commit('shipping/setAll', data.shipping_methods, { root: true })
      commit('shipping/setCurrent', data.shipping_method.id, { root: true })
      commit('shipping/setDifferent', data.is_different_shipping, { root: true })
      /* if api returns a new token, update the token */
      if (data.token) {
        commit('setAccessToken', data.token)
      }
      /* update country confirmation */
      commit('countries/setConfirmed', data.is_country_confirmed, { root: true })
      /* set subtotal, total */
      commit('setValues', { subtotal: data.subtotal, total: data.total, info: data.total_price_tooltip })
      /* set upsell products */
      commit('products/setProductsUpsell', data.items, { root: true })
      commit('loading/price', false, { root: true})
    }).catch(e => {
      commit('loading/price', false, { root: true})
    })

    /* validate checkout */
    navigationGuard(state.items)
  },

  removeProductFromCart ({ state, commit }, product) {
    const cartItem = state.items.find(item => item.id === product.id)
    let requestData = { id: product.id, quantity: 1 }

    if (product.quantity <= 1) {
      commit('deleteProductFromCart', cartItem);
      requestData['quantity'] = 0
    } else {
      commit('decrementItemQuantity', cartItem);
      requestData['quantity'] = cartItem.quantity
    }

    commit('loading/price', true, { root: true})

    api.post("cart", requestData).then(data => {
      /* handle Cart access token */
      if (!cookies.get(constants.UUID)) {
        commit('setAccessToken', data.token)
      }
      /* set subtotal, total */
      commit('setValues', { subtotal: data.subtotal, total: data.total, info: data.total_price_tooltip })
      /* set upsell products */
      commit('products/setProductsUpsell', data.items, { root: true })
      commit('loading/price', false, { root: true})
    }).catch(e => { console.log(e) })

    /* validate checkout */
    navigationGuard(state.items)
  },

  processOrder ({ state, commit, rootState, rootGetters, dispatch }) {
    const forms = {
      ...rootState.credentials
    }

    let order = {
      is_different_shipping: rootState.shipping.different,
      payment_method: rootGetters['payment/current'].code,
    }

    /* append form fields into order object */
    Object.values(forms).forEach((match, index) => {
      match.forEach((field, index) => {
        order[field.name] = field.value
      })
    })

    commit('loading/orderSubmit', true, { root: true })

    /* post Order */
    api.post("cart", order).then(order => {
      let redirectPath

      if (order.errors.length > 0) {
        // if everything is fine, but gateway is unavailable for some reason
        if (order.errors.length === 1 && Object.keys(order.errors[0])[0] === 'gateway_error') {
          redirectPath = `/order/${state.accessToken}`
        } else {
          handleApiErrors({commit, dispatch}, order.errors)
          commit('loading/orderSubmit', false, { root: true })
        }
      } else {
        redirectPath = order.redirect_to
      }

      if (redirectPath) {
        cookies.set(constants.ORDER_DETAIL_URL, `/order/${state.accessToken}`)
        cookies.remove(constants.ALLOW_CHECKOUT)
        cookies.remove(constants.UUID)
        window.location.href = redirectPath
      }

    }).catch(e => { console.log(e) })
  }
}

const getters = {
  items: state => state.items,
  isEmpty: state => state.items.length < 1,
  freeOrder: state => state.values.total === 0,
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
}
