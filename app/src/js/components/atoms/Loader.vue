<template>
  <component is="div" class="slot" :class="{ 'active' : loading }">
    <div v-if="loading" class="slot-loading">
      <div class="loading"></div>
    </div>
    <div v-else class="slot-item">
      <slot></slot>
    </div>
  </component>
</template>

<script>
export default {
  props: {
    loading: {
      type: Boolean,
      default: true
    }
  },
}
</script>

<style lang="scss" scoped>
  .slot.active {
    height: 17px;
  }
  .slot-loading {
    display: inline-block;
    margin: 0 0.3rem;
    height: 17px;
  }
  .slot-item {
    transition: 0.4s cubic-bezier(0, 1.11, 0.58, 1);
  }
  .is-loading {
    opacity: 0;
  }
</style>
