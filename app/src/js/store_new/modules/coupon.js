import * as api from "@/api/shop"

// Initial state
const state = {
  form: [
    {
      name: 'coupon',
      label: "",
      type: 'text',
      placeholder: '',
      required: false,
      value: '',
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
  }
}

const actions = {
  update({ commit }, value) {
    commit('updateSchema', value)
  },
  sendData({ commit, rootState }, data) {
    let requestData = {}

    /* append form fields into request object */
    Object.values(state).forEach((match, index) => {
      match.forEach((field, index) => {
        requestData[field.name] = field.value
      })
    })

    api.post('cart', requestData).then((data) => {
      if (data.errors.length > 0) {
        data.errors.forEach(error => {
          let key = Object.keys(error)[0]
          let value = error[key][0]
          if (key !== 'coupon') return false

          let form = {
            formName: 'form',
            formData: {
              key: 'coupon'
            },
            errors: value
          }

          commit('updateSchema', form)
        })
      }

      /* update discount */
      commit('cart/setDiscount', data.discount_perc, { root: true })
      /* update prices */
      commit('cart/setValues', { subtotal: data.subtotal, total: data.total, info: data.total_price_tooltip }, { root: true })
      /* update shipping */
      commit('shipping/setAll', data.shipping_methods, { root: true })
      commit('shipping/setCurrent', data.shipping_method.id, { root: true })
      /* update payment methods */
      commit('payment/setAll', data.payment_methods, { root: true })
      commit('payment/setCurrent', data.payment_methods[0].id, { root: true })

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
