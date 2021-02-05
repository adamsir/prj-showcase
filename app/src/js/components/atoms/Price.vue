<template>
  <div class="price">
    <!-- @todo atom -->
    <div class="value-primary" :class="{ 'inherit' : inherit }" v-text="`${value} ${valueSuffix}`"></div>
  </div>
</template>

<script>
  export default {
    props: {
      value: {
        type: Number,
        default: null
      },
      valueSuffix: {
        type: String,
        default: "EUR"
      },
      inherit: {
        type: Boolean,
        default: false
      }
    }
  };
</script>

<style scoped lang="scss">
  .value-primary {
    font-size: 16px;
    font-family: Project;
    color: #000;
    font-weight: 300;
  }
  .inherit {
    font: inherit;
  }
</style>

