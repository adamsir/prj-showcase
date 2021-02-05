import * as constants from '@/shared/constants'
import * as cookies from 'js-cookie'
import * as api from "@/api/shop"

// Initial state
const state = {
  address: [
    {
      name: 'email',
      label: 'Email',
      type: 'email',
      placeholder: 'for ex. your@email.com',
      required: true,
      value: '',
      enabled: true,
      errors: [] 
    },
    {
      name: 'full_name',
      label: 'Full name',
      type: 'text',
      placeholder: 'for ex. Satoshi Nakamoto',
      required: true,
      value: '',
      enabled: true,
      errors: [] 
    },
    {
      name: 'phone',
      label: 'Phone',
      type: 'tel',
      placeholder: 'for ex. Satoshi Nakamoto',
      required: false,
      value: '',
      enabled: true,
      errors: [] 
    },
    {
      name: 'street',
      label: 'Address line 1',
      type: 'text',
      placeholder: '',
      required: true,
      value: '',
      enabled: true,
      errors: [] 
    },
    {
      name: 'street2',
      label: 'Address line 2',
      type: 'text',
      placeholder: '',
      required: false,
      value: '',
      enabled: true,
      errors: [] 
    },
    {
      name: 'street3',
      label: 'Address line 3',
      type: 'text',
      placeholder: '',
      required: false,
      value: '',
      enabled: true,
      errors: [] 
    },
    {
      name: 'city',
      label: 'City',
      type: 'text',
      placeholder: '',
      required: true,
      value: '',
      enabled: true,
      errors: [] 
    },
    {
      name: 'postal_code',
      label: 'Postal/ZIP code',
      type: 'text',
      placeholder: '',
      required: true,
      value: '',
      enabled: true,
      errors: [] 
    },
    {
      name: 'company_name',
      label: 'Company name',
      type: 'text',
      placeholder: '',
      required: false,
      value: '',
      tooltip: ['Extra fees', 'Providing a company name may cause extra fees in this country.'],
      enabled: true,
      errors: [],
    },
    {
      name: 'comment',
      label: 'Comment',
      type: 'textarea',
      placeholder: 'Please do not submit delivery details into this field. This information will not be marked on the package.',
      required: false,
      value: '',
      enabled: true,
      errors: [] 
    },
    {
      name: 'country',
      label: 'Country',
      type: 'select',
      placeholder: '',
      required: false,
      value: '',
      options: [],
      enabled: true,
      errors: [] 
    },
    {
      name: 'state',
      label: 'State/Province',
      type: 'select',
      placeholder: '',
      required: true,
      value: '',
      options: [],
      enabled: true,
      errors: []
    },
  ],
  shipping_address: [
    {
      name: 'shipping_full_name',
      label: 'Full name',
      type: 'text',
      placeholder: 'for ex. Satoshi Nakamoto',
      required: true,
      value: '',
      enabled: true,
      errors: [] 
    },
    {
      name: 'shipping_company_name',
      label: 'Company name',
      type: 'text',
      placeholder: '',
      required: false,
      value: '',
      tooltip: ['Extra fees', 'Providing a company name may cause extra fees in this country.'],
      enabled: true,
      errors: [] ,
    },
    {
      name: 'shipping_street',
      label: 'Address line 1',
      type: 'text',
      placeholder: '',
      required: true,
      value: '',
      enabled: true,
      errors: [] 
    },
    {
      name: 'shipping_street2',
      label: 'Address line 2',
      type: 'text',
      placeholder: '',
      required: false,
      value: '',
      enabled: true,
      errors: [] 
    },
    {
      name: 'shipping_street3',
      label: 'Address line 3',
      type: 'text',
      placeholder: '',
      required: false,
      value: '',
      enabled: true,
      errors: [] 
    },
    {
      name: 'shipping_city',
      label: 'City',
      type: 'text',
      placeholder: '',
      required: true,
      value: '',
      enabled: true,
      errors: [] 
    },
    {
      name: 'shipping_postal_code',
      label: 'Postal/ZIP code',
      type: 'text',
      placeholder: '',
      required: true,
      value: '',
      enabled: true,
      errors: [] 
    },
    {
      name: 'country',
      label: 'Country',
      type: 'select',
      placeholder: '',
      required: false,
      value: '',
      options: [],
      tooltip: ['', 'Please note that shipping and billing addresses must be located within the same country.'],
      enabled: true,
      readonly: true,
      errors: []
    },
    {
      name: 'state',
      label: 'State/Province',
      type: 'select',
      placeholder: '',
      required: true,
      value: '',
      options: [],
      tooltip: ['', 'Please note that shipping and billing addresses must be located within the same province.'],
      enabled: true,
      readonly: true,
      errors: []
    },
  ],
  agreement: [
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
      required: false,
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
