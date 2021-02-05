const state = {
  app: false,
  country: false,
  basket: false,
  orderSubmit: false,
  price: false,
}

const mutations = {
  app (state, data) {
    state.app = data
    if (state.app) {
      document.body.classList.add('app-loading')
    } else {
      document.body.classList.remove('app-loading')
    }
  },

  country (state, data) {
    state.country = data
  },

  basket (state, data) {
    state.basket = data
  },

  orderSubmit (state, data) {
    state.orderSubmit = data
  },

  price (state, data) {
    state.price = data
  }

}

const actions = {}

const getters = {}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
}
