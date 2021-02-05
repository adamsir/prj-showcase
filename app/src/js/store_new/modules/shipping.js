import * as constants from '@/shared/constants'
import * as cookies from 'js-cookie'
import * as api from "@/api/shop"

// Initial state
const state = {
  all: {},
  current: null,
  different: false,
}


const mutations = {
  setAll (state, data) {
    state.all = data
  },

  setCurrent (state, data) {
    state.current = data
  },

  setDifferent (state, data) {
    state.different = data
  }
}

const actions = {
  sendData ({ commit }, id) {
    const requestData = {
      shipping_method: id
    }
    /* sync current shipping id before sync with server to enhance user experience */
    commit('setCurrent', id)

    api.post('cart', requestData).then(data => {
      /* update shipping */
      commit('setAll', data.shipping_methods)
      commit('setCurrent', data.shipping_method.id)
      /* set subtotal, total */
      commit('cart/setValues', { subtotal: data.subtotal, total: data.total, info: data.total_price_tooltip }, { root: true })
    }).catch(e => { console.log(e) })
  },
  updateDifferent({ commit }, data) {
    commit('setDifferent', data)
  }
}

const getters = {
  all: state => state.all,
  current: state => {
    const all = Object.values(state.all)
    return all.find(item => item.id === state.current)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
}
