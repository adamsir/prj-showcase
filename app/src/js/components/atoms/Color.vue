<template>
  <div class="chip">
    <figure class="avatar avatar-sm" :style="{ 'background' : bg }"></figure>
    {{ text }}
  </div>
</template>

<script>
const props = {
  bg: String,
  text: String
}

export default {
  props
}
</script>
