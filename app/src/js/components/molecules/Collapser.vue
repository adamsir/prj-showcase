<template>
  <component is="div">
    <div class="collapser collapser-lg d-no-bb" :class="{ 'active': active }">
      <div class="collapser-header has-form">
        <a-checkbox 
          :checked="active" 
          :label="label"
          :name="name"
          :native="native"
          @check="onChecked">
        </a-checkbox>
      </div>
      <div class="collapser-body" style="">
        <slot></slot>
      </div>
    </div>
  </component>
</template>

<script>
import Checkbox from '../atoms/Checkbox.vue'

export default {
  data() {
    return {
      active: this.open
    }
  },
  components: {
    'a-checkbox': Checkbox,
  },
  props: {
    open: {
      type: Boolean,
      default: false
    },
    label: {
      type: String,
      default: 'Label'
    },
    name: {
      type: String,
      default: ''
    },
    native: {
      type: Boolean,
      default: true
    },

  },
  methods: {
    onChecked(value) {
      this.active = value
      this.$emit('collapse', value)
    }
  }
}
</script>
