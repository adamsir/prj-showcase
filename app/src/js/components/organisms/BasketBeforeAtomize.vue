<!-- @todo atomize -->
<template>
  <component is="div" class="basket">
    <div class="basket-mobile show-md">
      <div class="basket-mobile-action">
        <button @click="toggleBasketPopup" class="btn btn-action btn-cart" :class="{ 'with-dot' : items.length > 0 }">
          <span v-show="items.length > 0" class="count">
            <span v-if="itemsCount > 9" v-text="`${9}+`"></span>
            <span v-else v-text="itemsCount"></span>
          </span>
        </button>
      </div>
      <div class="basket-mobile-footer" v-if="checkout.show">
        <a-btn v-if="countryConfirmed" :to="checkout.link" :loading="isLoading" type="wide">
          <span v-show="!isLoading">Continue</span>
          <span v-show="isLoading">Processing</span>
        </a-btn>
        <a-btn v-if="!countryConfirmed" @click="showCountryDialog(true)" :loading="isLoading" type="wide">
          <span v-show="!isLoading">Continue</span>
          <span v-show="isLoading">Processing</span>
        </a-btn>
      </div>
    </div>

    <div class="o-basket">
      <div class="cart-wrapper">
        <div v-if="items.length < 1" class="card">
          <div class="card-body text-center">
            <cart-empty>
              <div class="mb-1">
                <span>This is your cart.</span>
              </div>
              Add Project to make this cart happier.
            </cart-empty>
          </div>
        </div>

        <div v-if="items.length > 0" class="cart" :class="{ 'active' : basketPopupVisible }">
          <div class="cart-inner box box-sidebar panel column">
            <div class="panel-header between">
              <div class="panel-title">Cart summary</div>
              <button @click="toggleBasketPopup" class="btn btn-clear show-md"></button>
            </div>
            <div class="notification-tray">
              <!---->
              <!---->
              <!---->
              <!---->
            </div>
            <div class="panel-body notEmpty" :class="{ 'loading' : isLoading }">
              <div v-show="items.length > 0" class="cart-block">
                <ul class="cart-list">
                  <li class="cart-item" v-for="(item, index) in items" :key="index">
                    <span class="item-title" v-text="item.title"></span>
                    <m-counter :quantity="item.quantity" @update="onItemUpdate($event, item)"></m-counter>
                    <div class="item-price">
                      <price :value="item.price" :valueSuffix="country.symbol" :inherit="true"></price>
                    </div>
                  </li>
                </ul>
              </div>

              <div v-if="!items.length > 0 || !token"class="cart-block">
                <div class="loading loading-sm"></div>
              </div>

              <!-- @todo atomize -->
              <div v-if="items.length > 0 && token" class="cart-block">
                <div>
                  <div>Country</div>
                  <a-select :data="country.id" :options="countries" placeholder="Country guessing..." :inherit="true" @select="onCountrySelect"></a-select>
                </div>
                <div v-if="provinces">
                  <div>Province</div>
                  <a-select :data="provinceCurrent" :options="provinces" placeholder="Please specify" :inherit="true" @select="onProvinceSelect"></a-select>
                </div>
                <div>
                  <div v-text="shipping.name"></div>
                  <div><strong v-text="shipping.delivery_info"></strong></div>
                </div>
                <div>
                  <div>Shipping price</div>
                  <div>
                    <price :value="shipping.price" :valueSuffix="country.symbol" :inherit="true"></price>
                  </div>
                </div>
                <div>
                  <span class="text-bold">Leaves warehouse within 2 business days.</span>
                </div>
              </div>

              <div v-if="items.length > 0 && token" class="cart-block cart-block-footer price-block">
                <div v-if="discount">
                  <div>Discount</div>
                  <div v-text="discount"></div>
                </div>
                <div v-show="subtotal !== total">
                  <div>Subtotal</div>
                  <div>
                    <a-loader :loading="priceLoading">
                      <price :value="subtotal" :valueSuffix="country.symbol" :inherit="true"></price>
                    </a-loader>
                  </div>
                </div>
                <div class="highlight">
                  <div>
                    Total <small v-text="totalInfo"></small>
                    <!-- <a-tooltip :text="tooltip"></a-tooltip> -->
                  </div>
                  <div>
                    <a-loader :loading="priceLoading">
                      <price :value="total" :valueSuffix="country.symbol" :inherit="true"></price>
                    </a-loader>
                  </div>
                </div>
              </div>

            </div>
            <div class="panel-footer" v-if="checkout.show">
              <a-btn v-if="countryConfirmed" :to="checkout.link" :loading="isLoading" type="wide">
                <span v-show="!isLoading">Continue</span>
                <span v-show="isLoading">Processing</span>
              </a-btn>
              <a-btn v-if="!countryConfirmed" @click="showCountryDialog(true)" :loading="isLoading" type="wide">
                <span v-show="!isLoading">Continue</span>
                <span v-show="isLoading">Processing</span>
              </a-btn>
            </div>
          </div>
        </div>
        <CustomerInfo></CustomerInfo>
      </div>
    </div>
  </component>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
/* import ABox from '../atoms/Box.vue' */
import Button from '../atoms/Button'
import Select from '../atoms/Select'
import Loader from '../atoms/Loader'
import Tooltip from '../atoms/Tooltip'

/* @todo atomize */
import Price from '../atoms/Price'

import FormInputList from '../molecules/FormInputList'

/* @todo atomize */
import CustomerInfo from '../mix/CustomerInfo'
import CartEmpty from '../CartEmpty'

/* helper */
import { isMobile } from '../../shared/utils'

export default {
  data() {
    return {
      basketPopupVisible: false
    }
  },
  components: {
    'a-btn': Button,
    'a-select': Select,
    'a-tooltip': Tooltip,
    'a-loader': Loader,
    'm-counter': FormInputList,
    CustomerInfo,
    Price,
    CartEmpty,
  },
  watch: {
    itemsCount(newVal) {
      if (newVal == 1) {
        this.showBasketPopup()
      }
      if (newVal == 0) {
        this.hideBasketPopup()
      }
    },
    $route (to, from) {
      this.hideBasketPopup()
    }
  },
  computed: {
    ...mapState({
      countries: state => state.countries.all, 
      country: state => state.countries.current,
      countryConfirmed: state => state.countries.confirmed,
      dialogVisible: state => state.countries.dialogVisible,
      provinces: state => state.countries.provinces,
      provinceCurrent: state => state.countries.provinceCurrent.code,
      items: state => state.cart.items,
      discount: state => state.cart.discount,
      subtotal: state => state.cart.values.subtotal,
      total: state => state.cart.values.total,
      totalInfo: state => state.cart.values.info, 
      token: state => state.cart.accessToken,
      appLoading: state => state.loading.app,
      countryLoading: state => state.loading.country,
      priceLoading: state => state.loading.price,
      curr: state => state.shipping.current,
      credentials: state => state.credentials,
      productsAll: state => state.products.all
    }),
    ...mapGetters({
      shipping: 'shipping/current',
    }),
    checkout() {
      const currentPath = this.$route.name
      let ref = {
        link: '',
        show: true
      }

      switch (currentPath) {
        case 'checkout:upsell':
          ref.link = 'checkout:shipping'
          break
        case 'checkout:shipping':
          ref.link = 'checkout:billing'
          break
        case 'checkout:billing':
          ref.link = ''
          ref.show = false
          break
      
        default:
          ref.link = 'checkout:upsell'
          ref.show = this.items.length > 0
          break
      }

      return ref
    },
    itemsCount() {
      let items = this.items
      let count = 0

      items.forEach(item => {
        count += item.quantity
      })

      return count
    },
    isLoading() {
      let res = false
      if (this.countryLoading) {
        res = true
      }

      return res
    },
    popupRendered() {
      return isMobile()
    }
  },
  methods: {
    ...mapActions({
      'sendData': 'cart/sendData',
      'addProductToCart': 'cart/addProductToCart',
      'updateProductToCart': 'cart/updateProductToCart',
      'removeProductFromCart': 'cart/removeProductFromCart',
      'showCountryDialog': 'countries/showDialog',
    }),
    onCountrySelect(event) {
      const requestData = { country: event }

      this.sendData(requestData)
    },
    onProvinceSelect(event) {
      const requestData = { state: this.provinces[event].name }
      this.sendData(requestData)
    },
    onItemUpdate(event, item) {
      this.updateProductToCart({
        id: item.id,
        quantity: event
      })
    },
    showBasketPopup() {
      if (!isMobile()) return false

      this.basketPopupVisible = true
      document.body.classList.add('show-basket-popup')
    },
    hideBasketPopup() {
      if (!isMobile()) return false

      this.basketPopupVisible = false
      document.body.classList.remove('show-basket-popup')
    },
    toggleBasketPopup() {
      this.basketPopupVisible = !this.basketPopupVisible

      if (this.basketPopupVisible) {
        this.showBasketPopup()
      } else {
        this.hideBasketPopup()
      }
    },
  },
}
</script>

<style lang="scss" scoped>
  .basket {
    @media (min-width: 841px) {
      position: sticky;
      top: 3rem;
    }
  }
</style>

<style lang="scss" scoped>
  /* legacy styles */
  .isEmpty.box .panel-body {
    height: 302px;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
  }
  .panel-body {
    transition: filter 0.2s ease;
  }
  .panel-body.loading {
    .cart-block {
      opacity: 0.2
    }
  }
</style>
