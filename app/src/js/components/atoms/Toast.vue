<template>
  <component is="div" class="toast" :class="typeClass">
    <slot></slot>
  </component>
</template>

<script>
export default {
  props: {
    type: {
      type: String,
      default: ''
    }
  },
  computed: {
    typeClass() {
      let res
      switch (this.type) {
        case 'error':
          res = 'toast-error'
          break;
      
        default:
          res = ''
          break;
      }

      return res
    }
  }
}
</script>
