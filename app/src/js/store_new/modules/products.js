import * as constants from '@/shared/constants'
import * as cookies from 'js-cookie'
import { IProduct } from "../schemas"
import * as api from "@/api/shop"


async function bindData(dispatchParams = null) {
  const params = dispatchParams ? dispatchParams : ''
  const data = await api.getData(`get-products/${params}`)
  const sheetsData = await api.getData('get-product-sheets')
  const schema = IProduct

  let countries = []
  let country = {}
  let sheets = {}

  let products = {
    all: [],
    collections: {
      home: {
        main: [],
        misc: [],
      },
      upsell: {
        main: [],
        misc: [],
      },
    },
  }

  /* save all products */
  products.all = data.products

  /* save all countries */
  countries = data.countries

  /* save guessed country, if cart exists, this will be ommited */
  country = data.country

  /* save all product sheets */
  sheets = sheetsData

  /* save collections */
  products.all.forEach((item) => {
    let product = {...schema, ...item};
    
    if (product.show_on_homepage) {
      // match Main products
      if (!product.is_accessories) {
        products.collections.home.main.push(product)
      } else {
        products.collections.home.misc.push(product)
      }
    }
  })

  return {
    'products': products,
    'countries': countries,
    'country': country,
    'sheets': sheets
  }
}

function getChildrenProducts(reference, data) {
  let collection = []
  let result = []

  /* get children ids from a single product in cart */
  Object.values(data).forEach(item => {
    const children = item.children

    Object.values(children).forEach(item => {
      collection.push(item.id)
    })
  })

  /* if children ids exists, find their full reference of a product */
  if (collection.length > 0) {
    /* unique collection ids only */
    collection = Array.from(new Set(collection))

    /* find product children relatives */
    collection.forEach(id => {
      let product = {}
      product = reference.find(item => item.id === id)

      /* do not use hidden products (hidden means show_on_homepage false)  */
      if (!product.show_on_homepage) {
        return false
      }

      result.push(product)
    })
  }

  return result
}

const state = {
  all: [],
  collections: {
    home: {
      main: [],
      misc: [],
    },
    upsell: {
      main: [],
      misc: [],
    },
  },
  sheets: {}
};

/* Mutations changes the value of the store property */
const mutations = {
  setProductsAll (state, data) {
    state.all = data.all
    state.collections.home = data.collections.home
  },

  setProductsUpsell (state, data) {
    const collection = getChildrenProducts(state.all, data)
    state.collections.upsell.misc = collection
  },

  setProductSheets (state, data) {
    state.sheets = data
  },

  setCountry (state, data) {
    state.country = data;
  },
}

const actions = {
  async getAllProducts ({ commit, rootState }, dispatchParams) {
    const data = await bindData(dispatchParams)
    commit('setProductsAll', data.products)
    commit('setProductsUpsell', rootState.cart.items)
    commit('setProductSheets', data.sheets)
    commit('countries/setAllCountries', data.countries, { root: true })

    if (!cookies.get(constants.UUID)) {
      commit('countries/setCountryCurrent', data.country, { root: true })
    }

    commit('loading/app', false, { root: true })
    commit('loading/country', false, { root: true })
  },
}

const getters = {
  all: state => state.all,
  collections: state => state.collections,
  getProdById: state => id => {
    return state.all.find(item => item.id === id)
  },
  getProdBySlug: state => slug => {
    return state.all.find(item => item.slug === slug)
  },
  getSheetById: state => id => {
    return state.sheets[id]
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
