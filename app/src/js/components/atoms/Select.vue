<template>
  <component is="div" class="a-select">
    <!-- @todo change class in scss to atomic methodology -->
    <div class="form-select-holder" :class="{ 'inline' : inherit }">
      <span v-if="!model" class="form-select-placeholder" v-text="placeholder"></span>
      <select class="form-select" v-model="model" :autofocus="focus" :disabled="readonly">
        <option v-for="(option, index) in options" 
          :key="index"
          :value="option.id" 
          :selected="option.id === model">{{ option.name }}
        </option>
      </select>
    </div>
  </component>
</template>

<script>
export default {
  data() {
    return {}
  },
  props: {
    data: {
      type: Number,
      default: null
    },
    options: {
      type: Array,
      default: [
        {
          id: 1,
          name: "First option"
        },
        {
          id: 2,
          name: "Second option"
        },
        {
          id: 3,
          name: "Third option"
        },
      ]
    },
    placeholder: {
      type: String,
      default: "Please select"
    },
    inherit: {
      type: Boolean,
      default: false
    },
    readonly: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    model: {
      get() {
        return this.data
      },
      set(val) {
        this.data = val
        this.$emit('select', val)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .inline .form-select:focus {
    box-shadow: none;
  }
</style>
