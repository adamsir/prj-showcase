<template>
  <component is="div" class="component">
    <div class="columns">
      <div v-for="(item, index) in data" :key="index" :class="gridClass">
        <Product
          v-if="!item.is_accessories"
          class="list__item"
          :title="item.title_html"
          :desc="item.description"
          :images="[item.img[0]]"
          :price="item.price"
          :priceLoading="countryLoading"
          :currencySymbol="country.symbol"
          :slug="{ name: 'product', params: { slug: item.slug } }"
          :reference="item"
          @eventOutput="onEventOutput"
        />

        <ProductSmall
          v-if="item.is_accessories"
          :title="item.title_html"
          :desc="item.description"
          :images="[item.img[0]]"
          :price="item.price"
          :priceLoading="countryLoading"
          :currencySymbol="country.symbol"
          :slug="{ name: 'product', params: { slug: item.slug } }"
          :reference="item"
          @eventOutput="onEventOutput"
        />

      </div>
    </div>
  </component>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import Product from '../molecules/ProductBox'
import ProductSmall from '../molecules/ProductBoxSmall'

export default {
  components: {
    Product,
    ProductSmall,
  },
  props: {
    data: {
      type: Array,
      default: []
    },
    gridClass: {
      type: String,
      default: 'column'
    }
  },
  computed: mapState({
    country: state => state.countries.current,
    countryLoading: state => state.loading.country,
  }),
  methods: {
    ...mapActions('cart', [
      'addProductToCart'
    ]),
    onEventOutput(value) {
      this.addProductToCart(value)
    }
  }
}
</script>
