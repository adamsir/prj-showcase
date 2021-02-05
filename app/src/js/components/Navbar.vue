<template>
  <section class="navbar-wrapper" :class="{ 'has-mobile-menu' : isMobileMenuVisible }">
    <div class="container grid-lg">
      <header class="navbar" :class="{ 'is-ready' : isReady }">
        <div class="navbar-section cheeseburger-area">
          <div class="cheeseburger" @click="isMobileMenuVisible = !isMobileMenuVisible" :class="{ 'role-close' : isMobileMenuVisible }">
            <div class="part top"></div>
            <div class="part middle"></div>
            <div class="part bottom"></div>
          </div>
        </div>
        <section class="navbar-section logo-area">
          <!-- <router-link v-if="$route.name && $route.name.length > 0 && $route.name != 'index'" to="/" tag="a"><span class="logo"></span></router-link> -->
          <a href="//Project.io"><span class="logo"></span></a>
        </section>
  
        <section class="navbar-section">
          <div class="navbar-menu">
            <!-- Mobile -->
            <div class="navbar-menu-basket show-md">
              <button @click="toggleBasketPopup" class="btn btn-action btn-cart" :class="{ 'with-dot' : !isCartEmpty }">
                            <span v-show="!isCartEmpty" class="count">{{ cartQuantity }}</span>
                          </button>
            </div>
            <!-- Tablet/Desktop -->
            <!-- <div class="hide-md">Desktop</div> -->
            <div class="menu-area">
              <div class="menu-body">
                <a href="//Project.io" class="btn btn-link btn-nav">Home</a>
                <a href="/" class="btn btn-link btn-nav active">Shop</a>
                <a href="//blog.Project.io" class="btn btn-link btn-nav">Blog</a>
                <a href="//Project.io/support" class="btn btn-link btn-nav">Support</a>
                <a href="//wiki.Project.io" class="btn btn-link btn-nav">Wiki</a>
                <a href="/admin" v-if="isUserAdmin" class="btn btn-link btn-nav navbar-user">Admin</a>
                <a href="/user/profile/" v-if="isUserAuth" class="btn btn-link btn-nav navbar-user">My profile</a>
                <a href="/user/logout/" v-if="isUserAuth" class="btn btn-link btn-nav">Logout</a>
                <a href="/user/login/" v-if="!isUserAuth" class="btn btn-link btn-nav">Log in</a>
              </div>
            </div>
          </div>
        </section>
      </header>
    </div>
  </section>
</template>

<script>
  import {
    mapGetters,
    mapActions
  } from 'vuex';
  
  export default {
    data() {
      return {
        isReady: false,
        isMobileMenuVisible: false
      }
    },
    components: {},
    computed: {
      ...mapGetters(['isUserAuth', 'isUserAdmin', 'showBasketPopup', 'cartItems', 'isCountryConfirmed']),
      cartQuantity() {
        let total = 0;
        let items = this.cartItems;
        items.map(item => {
          total += item.quantity;
        });
        return total;
      },
      isCartEmpty() {
        return this.cartItems.length === 0;
      }
    },
    methods: {
      ...mapActions(['toggleBasketPopup'])
    },
    mounted() {
      setTimeout(
        () => {
          this.isReady = true;
        }, 200
      )
    }
  }
</script>

<style lang="scss" scoped>
  .navbar-menu-basket {
    transition: transform 0.3s cubic-bezier(0.41, 0.03, 0.33, 1.04);
  }
  
  .has-mobile-menu .navbar-menu-basket {
    transform: translateX(200%) skewX(8deg);
  }
  
  body.page .navbar-menu-basket {
    display: none !important;
  }
</style>
