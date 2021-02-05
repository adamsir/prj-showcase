import * as constants from '@/shared/constants'
import * as cookies from 'js-cookie'
import * as api from "@/api/shop"

// Initial state
const state = {
  form: [
    {
      name: 'duties',
      label: "I understand that I am responsible for paying customs duties, local taxes, and other related fee, if applicable.",
      type: 'checkbox',
      placeholder: '',
      required: true,
      value: false,
      enabled: true,
      errors: []
    },
    {
      name: 'terms',
      label: 'I agree with the <a href=/static/shared/about/terms-conditions.pdf target=_blank>Terms and conditions</a> and <a href=/static/shared/privacy-policy.pdf target=_blank>Privacy policy</a> and consent to data processing to create my order.',
      type: 'checkbox',
      placeholder: '',
      required: true,
      value: false,
      enabled: true,
      errors: []
    },
    {
      name: 'newsletter',
      label: 'Let me know about important security updates, product development and special offers via email.',
      type: 'checkbox',
      placeholder: '',
      required: true,
      value: false,
      enabled: true,
      errors: []
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
    // append errors if available without update of the field value
    if (data.errors) {
      state[form.formName][item].errors = data.errors
      return false
    }
    // update value for the item
    state[form.formName][item].value = form.formData.value
    // update availability of the field
    let enabled = true
    if (data.disabled) {
      enabled = false
    }
    state[form.formName][item].enabled = enabled
    // add options if available
    if (data.formData.options) {
      state[form.formName][item].options = data.formData.options
    }
  }
}

const actions = {
  update({ commit }, data) {
    commit('updateSchema', data)
  },
}

const getters = {}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
}
