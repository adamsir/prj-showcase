<template>
  <component is="div" class="component">
    <div v-if="!product">
      loading
    </div>
    <div v-if="product">
      <!-- @todo product detail -->
      <detail
        :title="product.title"
        :desc="product.description"
        :images="product.img"
        :price="product.price"
        :currencySymbol="country.symbol"
        :sheet="product.sheet"
        :reference="product"
        @eventOutput="onEventOutput"
      />
    </div>
  </component>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import Detail from '../templates/Detail'

export default {
  data () {
    return {
      loading: false,
    }
  },
  components: {
    Detail
  },
  computed: {
    ...mapState({
      country: state => state.countries.current,
    }),
    ...mapGetters('products', [
      'getProdBySlug',
      'getSheetById',
    ]),
    product() {
      let product = this.getProdBySlug(this.$route.params.slug)
      let sheet = null

      if (product && product['id']) {
        sheet = this.getSheetById(product.id)
        product.sheet = sheet
      }

      

      return product
    }
  },
  methods: {
    ...mapActions('cart', [
      'addProductToCart'
    ]),
    onEventOutput(value) {
      this.addProductToCart(value)
    }
  },
  beforeRouteEnter (to, from, next) {
    next((vm) => {
      
    });
  },
  mounted() {
  }
}
</script>

<style lang="scss" scoped>
.component {

}
</style>
