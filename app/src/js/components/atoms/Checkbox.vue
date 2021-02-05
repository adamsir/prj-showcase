<template>
  <component is="div" class="a-checkbox">
    <label :for="name" class="form-checkbox">
      <input type="checkbox" :id="name" v-model="model" @input="onChange"> 
      <!-- <i class="form-icon"></i> -->
      <i class="form-icon" :class="{ 'icon icon-collapser icon-arrow-up' : !native }"></i>
      <span v-html="label"></span>
    </label>
  </component>
</template>

<script>
export default {
  data() {
    return {
      model: this.checked
    }
  },
  props: {
    name: {
      type: String,
      default: () => {
        return Math.random().toString()
      }
    },
    checked: {
      type: Boolean,
      default: false
    },
    label: {
      type: String,
      default: "This is atom-checkbox"
    },
    native: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    onChange(e) {
      this.$emit('check', e.target.checked)
    }
  }
}
</script>

<style lang="scss" scoped>
  .icon-collapser {
    border: none;
  }
</style>
