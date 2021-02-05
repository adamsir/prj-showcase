import * as constants from '@/shared/constants'
import * as cookies from 'js-cookie'
import * as api from "@/api/shop"

// Initial state
const state = {
  form: [
    {
      name: 'vat_id',
      label: "VAT ID",
      type: 'text',
      placeholder: '',
      required: false,
      value: '',
      enabled: true
    },
  ]
}


const mutations = {
  updateSchema(state, data) {
    const form = {
      formName: data.formName,
      formData: {
        key: data.formData.key,
        value: data.formData.value,
      }
    }

    // select form array as scope state object
    let scope = state[form.formName]
    // select matching index object from the scope
    let item = scope.findIndex(item => item.name === form.formData.key)
    // if unexpected object from api
    if (item < 0) return false
    // update value for the item
    state[form.formName][item].value = form.formData.value
    // update availability of the field
    let enabled = true
    if (data.disabled) {
      enabled = false
    }
    state[form.formName][item].enabled = enabled
  }
}

const actions = {
  update({ commit }, value) {
    commit('updateSchema', value)
  },
  sendData({ commit, rootState }) {
    let requestData = {
      country: rootState.countries.current.id,
    }

    /* append form fields into request object */
    Object.values(state).forEach((match, index) => {
      match.forEach((field, index) => {
        requestData[field.name] = field.value
      })
    })

    api.post('verify_vat_id', requestData).then((data) => {
      console.log(data)
    })
  }
}

const getters = {}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
}
