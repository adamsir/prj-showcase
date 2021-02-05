<template>

  <div class="app-navbar">
    <section class="navbar-wrapper">
    <div class="container grid-lg">
        <header class="navbar">
            <section class="navbar-section">
                <a data-v-de5cd944="" href="//Project.io"><span data-v-de5cd944="" class="logo"></span></a>
            </section>

            <section class="navbar-section">
                <div data-v-de5cd944="" class="menu-area"><div data-v-de5cd944="" class="menu-body"><a data-v-de5cd944="" href="//Project.io" class="btn btn-link btn-nav">Home</a> <a data-v-de5cd944="" href="/" class="btn btn-link btn-nav active">Shop</a> <a data-v-de5cd944="" href="//blog.Project.io" class="btn btn-link btn-nav">Blog</a> <a data-v-de5cd944="" href="//Project.io/support" class="btn btn-link btn-nav">Support</a> <a data-v-de5cd944="" href="//wiki.Project.io" class="btn btn-link btn-nav">Wiki</a> <!----> <!----> <!----> <a data-v-de5cd944="" href="/user/login/" class="btn btn-link btn-nav">Log in</a></div></div>
            </section>
          </header>
      </div>
    </section>
  </div>

</template>

<script>
  import Navbar from './Navbar.vue';

  export default {
    components: {
      Navbar
    },
    beforeMount() {
      /* this.$store.dispatch('checkAuth'); */
    },
  }
</script>

<style lang="scss">

</style>

