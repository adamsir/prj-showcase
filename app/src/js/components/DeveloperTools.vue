<template>
  <div class="pane hide-sm" :class="{ 'open' : paneOpen }">
<!--     <div class="pane-inner">
      <div @click="togglePane" class="pane-header">
        <span v-show="!paneOpen">▲</span>
        <span v-show="paneOpen">▼</span>
      </div>
      <div v-show="paneOpen" class="pane-body">
        <button @click="clearCart" :disabled="apiPending" class="btn btn-link">Clear Basket</button>
        <button @click="addRandomProduct" :disabled="apiPending" class="btn btn-link">Add random product</button>
        <button @click="bindCountryModal" :disabled="apiPending" class="btn btn-link">Change country</button>
      </div>
    </div> -->
  </div>
</template>

<script>
import {
  mapGetters,
  mapActions
} from 'vuex';
import * as cookies from 'js-cookie';

const cookieName = '__eshopPaneOpen';

export default {
  data() {
    return {
      paneOpen: false
    }
  },
  computed: {
    /* ...mapGetters(['products', 'cartItems', 'apiPending']) */
  },
  methods: {
    /* ...mapActions(['clearCart', 'addToCart', 'bindCountryModal']), */
    togglePane() {
      this.paneOpen = !this.paneOpen;

      if (this.paneOpen) {
        cookies.set(cookieName, "1")
      } else {
        cookies.set(cookieName, "0")
      }
    },
    addRandomProduct() {
      const products = this.products;
      const cartItems = this.cartItems;

      let randomItem = products[Math.floor(Math.random() * products.length)];
      let item = cartItems.find((p) => p.id === randomItem.id);
      if (item) {
        item.quantity += 1;
        randomItem = item;
      }

      this.addToCart(randomItem)
    },
  },
  mounted() {
    let paneCookie = cookies.get(cookieName);
    if (paneCookie && paneCookie == "1" ) {
      this.paneOpen = true;
    }
  }
}
</script>

<style lang="scss" scoped>
  .pane {
    position: fixed;
    bottom: 0;
    left: 0;
    padding: 0;
    margin: 1.2rem;
    box-shadow: 0 1px 0px 3px #00000014;
    z-index: 9999;
    background: #fff;
    border-radius: 4px;
    border: 1px solid #5757ff;
  }
  .pane.open {
    width: 300px;
    height: auto;
  }


  .pane-inner {
    position: relative;
    min-height: 100%;
  }

  .pane-header {
    padding: 0.45rem 0.7rem;
    font-weight: 500;
    color: #fff;
    background: #5658ff;
    border-top: 1px solid transparent;
    cursor: pointer;
    user-select: none;
  }

  .pane-body {
    min-height: 165px;

    button {
      display: block;
    }
  }

  .pane.open .pane-header {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    border-color: #5658ff;
  }
</style>
