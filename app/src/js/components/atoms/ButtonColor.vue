<template>
  <component is="button" class="btn btn-action btn-color circle radio as-radio active white">
    <i class="icon icon-check"></i>
  </component>
</template>

<script>
/**
 * Used as main page navigation in templates.
 */
export default {
  status: "prototype",
  release: "1.0.0",
  props: {
    /**
     * The html element name used for the button.
     */
    to: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: ''
    },
  },
  methods: {
    /* click(event) {
      this.$emit("click", event)
    }, */
  }
}
</script>

<style lang="scss" scoped>

</style>
