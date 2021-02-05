<template>
  <component is="div" class="container grid-lg">
    <div class="columns">
      <!-- Main slot (for ex. router-view) -->
      <div class="column col-8 col-md-12">
        <slot name="main"></slot>
      </div>
      <!-- Aside slot (for ex. cart) -->
      <div class="column col-4 col-md-12">
        <slot name="aside"></slot>
      </div>
    </div>
    <!-- Default slot -->
    <slot></slot>
  </component>
</template>

<script>
export default {
  components: {}
}
</script>
