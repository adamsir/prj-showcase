<template>
  <component is="div">
    <router-link v-if="to" 
      :to="{ name: to }" 
      tag="a"
      :class="extraClass"
      :disabled="disabled ? disabled : loading"
      class="btn btn-primary">
      <slot></slot>
    </router-link>

    <button v-else 
      @click="click" 
      :class="extraClass"
      :disabled="disabled ? disabled : loading"
      class="btn btn-primary">
      <slot></slot>
    </button>

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
    loading: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
  },
  computed: {
    extraClass() {
      let names = {
        loading: this.loading,
      }

      switch (this.type) {
        case 'wide':
          names['btn-block'] = true
          break;
      
        default:
          break;
      }

      return names
    }
  },
  methods: {
    click(event) {
      this.$emit("click", event)
    },
  }
}
</script>

<style lang="scss" scoped>

</style>
