<template>
  <component class="card">
    <div class="card-header h4">
      <slot name="header"></slot>
    </div>
    <div class="card-body d-no-pb">
      <slot name="body"></slot>
    </div>
    <div class="card-footer">
      <slot name="footer"></slot>
    </div>
  </component>
</template>

<script>
export default {
}
</script>

<style lang="scss" scoped>
  .card-header {
    padding-bottom: 0;
  }
</style>
