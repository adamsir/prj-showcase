<template>
  <component class="a-box">
    <div class="a-box-header">
      <slot name="header"></slot>
    </div>
    <div class="a-box-body">
      <slot name="body"></slot>
    </div>
    <div class="a-box-footer">
      <slot name="footer"></slot>
    </div>
  </component>
</template>

<script>
export default {
}
</script>
