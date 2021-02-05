import * as constants from '@/shared/constants'
import * as cookies from 'js-cookie'
import * as api from "@/api/shop"

// Initial state
const state = {
  all: [],
  current: null,
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
  updateCurrent({ commit }, data) {
    commit('setCurrent', data)
  }
}

const getters = {
  all: state => state.all,
  current: state => {
    return state.all.find(item => item.id === state.current)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
}
