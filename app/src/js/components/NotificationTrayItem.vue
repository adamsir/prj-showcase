<template>
  <component is="div" class="panel">
    <!-- @todo grid as template -->
    <div class="container grid-lg">
      <div class="columns">
        <div class="column col-12">
          <slot></slot>
        </div>
      </div>
    </div>
  </component>
</template>

<script>
export default {
  
}
</script>

<style lang="scss" scoped>
  .panel {
    padding: 1rem;
  }
</style>
