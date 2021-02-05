<template>
  <component is="div">
    <a-card>
      <template v-slot:header>
        Shipping
      </template>
      <template v-slot:body>
        <!-- @todo atomize -->
        <div class="form-group form-choice d-p-b">
          <label v-for="(item, index) in shippingAll" :key="index"
            :class="{ active : selectedShipping === item.id }"
            class="form-radio">
            <input type="radio" 
              v-model="selectedShipping" 
              :value="item.id" 
              :checked="selectedShipping === item.id"
              name="gender">
            <i class="form-icon icon icon-check"></i>

            <div class="form-choice-body d-flex d-space-between">
              <!-- @todo atomize -->
              <div class="h4" v-text="item.name"></div>
              <Price :value="item.price" :valueSuffix="country.symbol" />
            </div>

            <div class="form-choice-body">
              <!-- @todo atomize -->
              <p v-text="item.description"></p>
            </div>
          </label>
        </div>
      </template>
    </a-card>
  </component>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
import Card from '../atoms/Card.vue'
import Products from '../organisms/ProductsList.vue'
import Price from '../atoms/Price'

export default {
  name: 'home',
  components: {
    'a-card': Card,
    Products,
    Price
  },
  computed: {
    ...mapState({
      country: state => state.countries.current,
    }),
    ...mapGetters({
      shippingCurrent: 'shipping/current',
      shippingAll: 'shipping/all',
    }),
    selectedShipping: {
      get () {
        return this.shippingCurrent.id
      },
      set (id) {
        this.sendData(id)
      }
    }
  },
  methods: {
    ...mapActions('shipping', [
      'sendData'
    ]),
  }
}
</script>
