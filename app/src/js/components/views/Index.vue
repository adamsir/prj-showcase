<template>
  <component is="div" class="component">
    <component v-if="loading">
      <div class="loading loading-lg loading-screen"></div>
    </component>
    <component v-else>
      <modal></modal>
      <SubNav></SubNav>
      <layout>
        <template v-slot:main>
          <router-view></router-view>
        </template>
        <template v-slot:aside>
          <basket></basket>
        </template>
      </layout>
    </component>
  </component>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import Layout from "../layouts/BaseLayout"
import Basket from "../organisms/BasketBeforeAtomize"
import SubNav from '../mix/SubNav'
import Modal from '../templates/Modal'

export default {
  components: {
    Layout,
    Basket,
    SubNav,
    Modal
  },
  computed: {
    ...mapState({
      loading: state => state.loading.app
    })
  },
  async beforeMount() {
    await this.$store.dispatch('cart/getAllData')
  }
}
</script>
