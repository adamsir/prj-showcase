<template>
  <component :is="wrapper" class="wrapper">
    <div class="cart-action">
      <button class="btn btn-trigger first" @click="decrease">-</button>
      <input
        :id="id"
        :disabled="disabled"
        :type="type"
        :hover="hover"
        :focus="focus"
        :value="currentInputValue"
        :placeholder="placeholder"
        :min="this.min"
        :max="this.max"
        @keydown.up.native.prevent="increase"
        @keydown.down.native.prevent="decrease"
        @input="setCurrentValue($event.target.value)"
        @focus="onFocus($event.target.value)"
        class="input-number"
      />
      <button class="btn btn-trigger last" @click="increase">+</button>
    </div>

    <div class="spinner" :class="{ 'has-anim' : anim }">
      <span v-text="currentInputValue"></span>
    </div>
  </component>
</template>

<script>
/* import debounce from '../../shared/debounce' */
/**
 * Form Inputs are used to allow users to provide text input when the expected
 * input is short. Form Input has a range of options and supports several text
 * formats including numbers. For longer input, use the `FormTextarea` element.
 */

export default {
  name: "InputNumber",
  status: "review",
  release: "1.0.0",
  props: {
    /**
     * The type of the form input field.
     * `text, number, email`
     */
    type: {
      type: String,
      default: "number",
      validator: value => {
        return value.match(/(text|number|email)/)
      },
    },
    /**
     * Text value of the form input field.
     */
    value: {
      type: Number,
      default: 1,
    },
    /**
     * Min value of the form input field.
     */
    min: {
      type: Number,
      default: 0,
    },
    /**
     * Max value of the form input field.
     */
    max: {
      type: Number,
      default: 25,
    },
    /**
     * The placeholder value for the form input field.
     */
    placeholder: {
      type: String,
      default: null,
    },
    /**
     * The html element name used for the wrapper.
     * `div, section`
     */
    wrapper: {
      type: String,
      default: "div",
      validator: value => {
        return value.match(/(div|section)/)
      },
    },
    /**
     * Unique identifier of the form input field.
     */
    id: {
      type: String,
      default: null,
    },
    /**
     * The width of the form input field.
     * `auto, expand`
     */
    width: {
      type: String,
      default: "expand",
      validator: value => {
        return value.match(/(auto|expand)/)
      },
    },
    /**
     * Whether the form input field is disabled or not.
     * `true, false`
     */
    disabled: {
      type: Boolean,
      default: false,
    },
    /**
     * Manually trigger input field’s hover state.
     * `true, false`
     */
    hover: {
      type: Boolean,
      default: false,
    },
    /**
     * Manually trigger input field’s focus state.
     * `true, false`
     */
    focus: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    setCurrentValue(newValue) {
      const oldValue = this.currentValue
      const value = this._validate(newValue)
      this.currentValue = value

      if (value === 0) {
        this.$emit("update", value)
      } 

      this.triggerAnim()
    },
    triggerAnim() {
      const value = this.currentValue

      if (value < this.max && value > this.min) {
        this.anim = true
        setTimeout(() => {
          this.anim = false
        }, 400)
      }
    },
    increase() {
      const value = this.currentValue
      const newValue = value + 1
      this.setCurrentValue(newValue)
      this.$emit("update", newValue)
    },
    decrease() {
      const value = this.currentValue
      const newValue = value - 1
      this.setCurrentValue(newValue)
      this.$emit("update", newValue)
    },
    _validate(value) {
      let newValue = value === undefined ? value : Number(value)

      if (newValue !== undefined) {
        if (isNaN(newValue)) {
          return this.currentValue
        }
      }

      if (newValue >= this.max) newValue = this.max
      if (newValue <= this.min) newValue = this.min

      return newValue
    },
  },
  data() {
    return {
      currentValue: 1,
      anim: false,
    }
  },
  watch: {
    value: {
      immediate: true,
      handler(value) {
        let newValue = this._validate(value)
        this.currentValue = newValue
      },
    },
  },
  computed: {
    currentInputValue() {
      return this.currentValue
    },
  },
}
</script>

<style lang="scss" scoped>
$element-height: 20px;

.wrapper {
  position: relative;

  .input-holder {
    display: flex;
    justify-content: flex-start;
  }

  .btn {
    &:first-child {
      border-right: 0;
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
    }
    &:last-child {
      border-left: 0;
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
    }
  }
}

input {
  /* @include form-input-style; */
}

.input-number {
  width: $element-height;
  height: $element-height;
  padding: 0;
  text-align: center;
  border-radius: 0;
  color: #fff;
  border: none;
  box-shadow: 0 0 0 1px #ddd;
}

.outline.btn {
  width: $element-height;
  height: $element-height;
  padding: 0;

  & > span {
    /* line-height correction due to 1px border */
    position: relative;
    top: -0.1rem;
  }
}

.spinner {
  position: absolute;
  top: 0;
  left: $element-height;
  width: $element-height;
  height: 100%;
  text-align: center;
  font-size: 12px;
  font-family: Roboto;
  overflow: hidden;
  transition: opacity 0.4s ease-in-out;

  &.out {
    opacity: 0;
  }
}

.spinner span {
  position: relative;
  top: 3px;
}

.spinner.has-anim span {
  animation: spin 0.4s forwards ease-in-out;
}

@keyframes spin {
  0% {
    top: -0.1rem;
    opacity: 0.2;
  }
  20% {
    top: -0.2rem;
    opacity: 0.1;
  }
  50% {
    top: -100vh;
    left: -100vw;
  }
  75% {
    top: 0.6rem;
    left: 0;
  }
  90% {
    top: 0.1rem;
    opacity: 0.3;
  }
  100% {
    top: 0;
    opacity: 1;
  }
}
</style>

