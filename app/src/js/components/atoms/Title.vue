<template>
  <component :is="entity" @click="click" class="p" :class="type">
    <slot></slot>
  </component>
</template>

<script>
/**
 * Used as main product image.
 */
export default {
  name: "Paragraph",
  status: "prototype",
  release: "1.0.0",
  props: {
    /**
     * The html element name used for the image.
     */
    entity: {
      type: String,
      default: "p",
    },
    type: {
      type: String,
      default: null,
    },
  },
  methods: {
    click(event) {
      this.$emit("click", event)
    },
  },
}
</script>
