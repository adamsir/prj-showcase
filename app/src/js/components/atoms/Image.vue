<template>
  <component :is="entity" 
    @click="click" 
    :src="src" 
    :class="type"
    class="img-responsive img-fit-cover"> 
      <slot></slot>
  </component>
</template>

<script>
/**
 * Used as main product image.
 */
export default {
  name: "Image",
  status: "prototype",
  release: "1.0.0",
  props: {
    /**
     * The html element name used for the image.
     */
    entity: {
      type: String,
      default: "img",
    },
    type: {
      type: String,
      default: null,
    },
    src: {
      type: String,
      default: 'data:image/png;base64, iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mMsrwcAAXMA+FpHAHEAAAAASUVORK5CYII='
    }
  },
  methods: {
    click(event) {
      this.$emit("click", event)
    },
  },
}
</script>

<style lang="scss" scoped>
  .img {
    max-width: 100%;
  }
</style>
