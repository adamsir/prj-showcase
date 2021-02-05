import { ICountry } from "../schemas"


const state = {
  all: [],
  current: {},
  provinces: null,
  provinceCurrent: { code: '', name: ''},
  confirmed: false,
  dialogVisible: false,
};

/* Mutations changes the value of the store property */
const mutations = {
  setAllCountries(state, data) {
    state.all = data
  },
  setCountryCurrent(state, data) {
    state.current = data
  },
  setProvinces(state, data) {
    // transform data for @atom/select
    let provinces = {}
    Object.entries(data).forEach(([key, value]) => {
      provinces[key] = { id: key, name: value }
    });

    if (Object.keys(provinces).length > 0) {
      state.provinces = provinces
    } else {
      state.provinces = null
    }
  },
  setProvinceCurrent(state, data) {
    let province = { code: '', name: '' }
    province.name = data
    // if provinces list is provided
    if (state.provinces) {
      Object.entries(state.provinces).forEach(([key, value]) => {
        if (province.name === value.name) {
          province.code = value.id
        }
      })
    }
    state.provinceCurrent = province
  },
  setConfirmed(state, data) {
    state.confirmed = data
    state.dialogVisible = false
  },
  setDialogVisibility(state, data) {
    state.dialogVisible = data
  }
}

const actions = {
  showDialog({ commit }, data) {
    commit('setDialogVisibility', data)
  }
}

const getters = {
  all: state => state.all,
  current: state => state.current,
  confirmed: state => state.confirmed,
  provinces: state => state.provinces,
  provinceCurrent: state => state.provinceCurrent,
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
