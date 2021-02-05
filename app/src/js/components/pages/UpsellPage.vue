<template>
  <component is="div">
    <a-card>
      <template v-slot:header>
        Forgot something?
      </template>
      <template v-slot:body>
        <products :data="products" gridClass="column col-6 col-xs-12"></products>
      </template>
    </a-card>
  </component>
</template>

<script>
import { mapGetters, mapMutations, mapState, mapActions } from 'vuex'
import Card from '../atoms/Card.vue'
import Products from '../organisms/ProductsList.vue'

export default {
  components: {
    'a-card': Card,
    Products
  },
  computed: mapState({
    products: state => state.products.collections.upsell.misc,
  })
}
</script>
