<template>
  <component :is="entity" class="a-brand">
    <router-link :to="nextRoute" class="a-brand-link">
      <h1 class="a-brand-title text-style-brand" v-html="title"></h1>
    </router-link>
  </component>
</template>

<script>

export default {
  props: {
    entity: {
      type: String,
      default: "div"
    },
    nextRoute: {
      type: [String, Object],
      default: ""
    },
    title: {
      type: String,
      default: "Project <span>Model T</span>"
    }
  }  
}
</script>

<style lang="scss" scoped>
  .a-brand {
    &-link {
      text-decoration: none;
    }
    &-title {
      font-family: "Project", "Roboto", sans-serif;
      font-size: 1.1rem;
      color: #232323;
      font-weight: 500;
      text-transform: capitalize;
      margin: 0;
    }
  }
</style>

<style lang="scss">
  .text-style-brand span {
    font-family: "Roboto", sans-serif;
    font-weight: 300;
    font-size: 1.025rem;
  }
</style>
