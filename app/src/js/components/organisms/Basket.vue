<template>
  <component is="div" class="o-basket sticky">
    <!-- atom box -->
    <a-box>
      <template v-slot:header>
        Cart Summary
      </template>
      <template v-slot:body>
        <div v-for="(item, index) in items" :key="index">
          <img :src="item.img[0]" alt="" width="50">
          <span v-text="item.title"></span>
          Quantity <span v-text="item.quantity"></span>
          <button @click="removeProductFromCart(item)">-</button>
          <button @click="addProductToCart(item)">+</button>
          <hr>
        </div>
      </template>
      <template v-slot:footer>
        <btn to="checkout">Checkout</btn>
      </template>
    </a-box>
    <!-- end atom box -->
  </component>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import ABox from '../atoms/Box.vue'
import Button from '../atoms/Button'

export default {
  components: {
    ABox,
    btn: Button,
  },
  computed: mapState({
    /* products: state => state.products.main,
    accessories: state => state.products.misc,*/
    country: state => state.countries.current, 
    items: state => state.cart.items
  }),
  methods: {
    ...mapActions('cart', [
      'addProductToCart',
      'removeProductFromCart',
    ]),
  },
  created() {
    
  }
}
</script>

<style lang="scss" scoped>
  .sticky {
    position: sticky;
    top: 3rem;
  }
</style>
