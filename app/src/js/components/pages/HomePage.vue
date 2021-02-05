<template>
  <component is="div">
    <products :data="products" gridClass="column col-12"></products>
    <h4>Accessories</h4>
    <products :data="accessories" gridClass="column col-6 col-xs-12"></products>
  </component>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import Products from '../organisms/ProductsList.vue'

export default {
  name: 'home',
  components: {
    Products
  },
  computed: mapState({
    products: state => state.products.collections.home.main,
    accessories: state => state.products.collections.home.misc,
    country: state => state.countries.current,
    cart: state => state.cart.items
  }),
  created() {
    
  }
}
</script>

