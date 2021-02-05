<template>
  <component is="div" class="counter">
    <div class="item">
      <input-number :value="quantity" @update="onItemUpdate" :max="limit" />
    </div>
  </component>
</template>

<script>
import InputNumber from '../atoms/InputNumber'
import debounce from '../../shared/debounce'
/**
 * Used to build the outer wrapper of a page, including the page title and
 * associated actions. Wrapper doesn’t provide customizable options.
 */
export default {
  name: "FormInputList",
  status: "review",
  release: "1.0.0",
  components: {
    InputNumber
  },
  props: {
    /**
     * The html element name used for the wrapper.
     */
    quantity: {
      type: Object,
      default: {
        quantity: 1
      }
    },
    limit: {
      type: Number,
      default: 100
    }
  },
  data() {
    return {
      limit: 1000,
    }
  },
  computed: {
    inputData() {
      let d = this.data

      return d
    },
  },
  methods: {
    onItemUpdate: debounce(function(event) {
      this.$emit("update", event)
    }, 200, { maxWait: 3000 })
  },
}
</script>

<style lang="scss" scoped>
</style>

