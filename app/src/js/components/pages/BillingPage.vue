<template>
  <component is="div">
    <a-card>
      <template v-slot:header>
        Your billing and delivery address
      </template>
      <template class="d-no-pt" v-slot:body>
        <a-toast v-if="errors" type="error">
          <strong>Please, check your order to continue.</strong>
          <div v-for="(item, index) in errors" :key="index">
            <div v-if="item.field === 'email'" v-html="item.msg"></div>
            <div v-if="item.field === '__all__'" v-html="item.msg"></div>
            <div v-if="item.field === 'terms'" v-html="'Ensure that you have agreed with Terms and conditions and privacy policy.'"></div>
            <div v-if="item.field === 'duties'" v-html="'Ensure that you have agreed with paying custom duties, local taxes, and other related fee.'"></div>
          </div>
        </a-toast>
        <billing-form></billing-form>
        <m-collapser :open="isVATProvided" name="vat" label="This order will be billed to a business" @collapse="">
          <business-form></business-form>
        </m-collapser>
        <m-collapser :open="isDifferentShipping" name="is_different_shipping" label="I want to ship to a different address" @collapse="setDifferentShipping">
          <shipping-form></shipping-form>
        </m-collapser>
        <m-collapser :open="false" name="coupon" label="I have a promo code" :native="false" @collapse="">
          <coupon-form></coupon-form>
        </m-collapser>
      </template>
    </a-card>
    <a-card>
      <template v-slot:header>
        <span v-if="!freeOrder">
          Choose payment method
        </span>
        <span v-if="freeOrder">
          Your order is free. No payment required.
        </span>
      </template>
      <template v-slot:body>
        <div class="d-p-b">
          <!-- @todo atomize -->
          <div v-if="!freeOrder" class="form-group form-choice d-p-b">
            <label v-for="(item, index) in paymentsAll" :key="index"
              :class="{ active : selectedPayment === item.id }"
              class="form-radio">
              <input type="radio" 
                v-model="selectedPayment" 
                :value="item.id" 
                :checked="selectedPayment === item.id"
                name="gender">
              <i class="form-icon icon icon-check"></i>

              <div class="form-choice-body d-flex d-space-between">
                <div class="h4" v-text="item.name"></div>
              </div>

              <div class="form-choice-body">
                <p v-text="item.provider"></p>
              </div>
            </label>
          </div>
          <agreement-form></agreement-form>
        </div>
      </template>
    </a-card>
    <div class="d-m-t columns">
      <div class="column col-6">
        <router-link :to="{ name: 'checkout:shipping' }" class="btn btn-link control back">Back to products</router-link>
      </div>
      <div class="column col-mx-auto">
        <a-btn @click="processOrder" :loading="isOrderProcessing" type="wide">
          <span v-show="!isOrderProcessing">
            Place order
            <span v-show="!freeOrder">
              and pay
            </span>
          </span>
          <span v-show="isOrderProcessing">Processing</span>
        </a-btn>
      </div>
    </div>
  </component>
</template>

<style scoped>
  .btn.loading {
    color: #fff;
  }
</style>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import Button from '../atoms/Button.vue'
import Card from '../atoms/Card.vue'
import Checkbox from '../atoms/Checkbox.vue'
import Toast from '../atoms/Toast.vue'
import Collapser from '../molecules/Collapser.vue'
import BillingForm from '../forms/BillingForm.vue'
import ShippingForm from '../forms/ShippingForm.vue'
import AgreementForm from '../forms/AgreementForm.vue'
import BusinessForm from '../forms/BusinessForm.vue'
import CouponForm from '../forms/CouponForm.vue'

export default {
  components: {
    'a-btn': Button,
    'a-card': Card,
    'a-checkbox': Checkbox,
    'a-toast': Toast,
    'm-collapser': Collapser,
    BillingForm,
    ShippingForm,
    AgreementForm,
    BusinessForm,
    CouponForm,
  },
  computed: {
    ...mapState({
      errors: state => state.cart.errors,
      isDifferentShipping: state => state.shipping.different,
      isVATProvided: state => state.business.form[0].value.length > 0,
      isOrderProcessing: state => state.loading.orderSubmit
    }),
    ...mapGetters({
      paymentCurrent: 'payment/current',
      paymentsAll: 'payment/all',
      freeOrder: 'cart/freeOrder'
    }),
    selectedPayment: {
      get () {
        return this.paymentCurrent.id
      },
      set (id) {
        this.updateCurrentPayment(id)
      }
    }
  },
  methods: {
    ...mapActions({
      'processOrder': 'cart/processOrder',
      'setDifferentShipping': 'shipping/updateDifferent',
      'updateCurrentPayment': 'payment/updateCurrent'
    }),
    onCollapsed(event) {
      
    }
  }
}
</script>
