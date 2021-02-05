<template>
  <component is="span">
    <span :data-tooltip="text" class="tooltip tooltip-help tooltip-right">
      <slot></slot>
    </span>
  </component>
</template>

<script>
export default {
  props: {
    text: {
      type: String,
      default: 'Default tooltip text.'
    }
  }
}
</script>
