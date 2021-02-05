<template>
  <component is="div" :class="className">
    <div class="form-group" :class="{ 'required' : required, 'has-error': showErrors }">
      <a-checkbox :checked="model" :label="label" :name="name" @check="onChecked" v-if="isCheckbox" :readonly="readonly"></a-checkbox>

      <!-- checkbox already contains label tag -->
      <label v-if="!isCheckbox && label" class="form-label" :for="name">
        <span v-text="label" class="text-label"></span>
        <span v-if="tooltip" class="tooltip tooltip-help tooltip-top" :data-tooltip="tooltip[1]" v-text="tooltip[0]"></span>
      </label>
      <input class="form-input" @blur="onBlur" @input="onChange" v-model="model" :type="type" :id="name" :name="name" :placeholder="placeholder" v-if="isRegularInput" :disabled="readonly">
      <textarea class="form-input" @blur="onBlur" @input="onChange" v-model="model" :id="name" :name="name" :placeholder="placeholder" rows="1" v-if="isTextarea" :disabled="readonly"></textarea>
      <a-select :data="model" :options="options" @select="onSelect" v-if="isSelect" :readonly="readonly"></a-select>

      <p v-if="showErrors && !isCheckbox" v-html="errorMsg" class="form-input-hint"></p>
    </div>
  </component>
</template>

<script>
import Checkbox from '../atoms/Checkbox.vue'
import Select from '../atoms/Select'

const Validate = {
  email(value) {
    let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    return re.test(value);
  },
  empty(value) {
    let containsWhitespace = /^\s+$/g.test(value)
    return !value || !value.length > 0 || containsWhitespace
  }
}

export default {
  data() {
    return {
      model: this.value,
      valid: true,
      errorMsg: null
    }
  },
  components: {
    'a-select': Select,
    'a-checkbox': Checkbox,
  },
  watch: {
    value(newValue) {
      this.model = newValue
    },
    errors(newErrorMsg) {
      this.errorMsg = newErrorMsg
      console.log(this.type, this.name)
    }
  },
  methods: {
    onChange(event) {
      this.model = event.target.value
      let validator = {
        empty: true,
        valid: false,
        msg: ''
      }

      if (this.type === 'email') {
        validator.valid = Validate.email(this.model)
        if (!validator.valid) {
          validator.msg = 'Please enter a valid email.'
        }
      }

      const ref = {
        name: this.name,
        value: this.model,
        valid: validator.valid
      }

      this.errorMsg = validator.msg

      /* console.clear()
      console.table(ref) */
    },
    onBlur(e) {
      this.model = event.target.value
      let validator = {
        empty: true,
        valid: false,
        msg: ''
      }
      
      if (Validate.empty(this.model) && this.required) {
        validator.msg = 'This field is required'
        validator.valid = false
      }

      if (this.type === 'email') {
        validator.valid = Validate.email(this.model)
        if (!validator.valid) {
          validator.msg = 'Please enter a valid email.'
        }
      }

      const ref = {
        name: this.name,
        value: this.model,
        valid: validator.valid
      }

      this.errorMsg = validator.msg

      /* console.clear()
      console.table(ref) */
      ref['form'] = this.formName
      const emitted = {
        formName: this.formName,
        formData: {
          key: this.name,
          value: this.model
        }
      }
      this.emitValue(emitted)
    },
    onSelect(event) {
      const emitted = {
        formName: this.formName,
        formData: {
          key: this.name,
          value: event
        }
      }
      this.emitValue(emitted)
    },
    onChecked(event) {
      const emmited = {
        formName: this.formName,
        formData: {
          key: this.name,
          value: event
        }
      }
      // if checked, remove error
      if (event) {
        this.errorMsg = ''
      }
      this.emitValue(emmited)
    },
    emitValue(val) {
      this.$emit('eventOutput', val)
    }
  },
  props: {
    name: {
      type: String,
      default: () => {
        return Math.random().toString()
      }
    },
    value: {
      type: String,
      default: ''
    },
    label: {
      type: String,
      default: 'Default label'
    },
    type: {
      type: String,
      default: 'text'
    },
    placeholder: {
      type: String,
      default: ''
    },
    required: {
      type: Boolean,
      default: false
    },
    className: {
      type: String,
      default: ''
    },
    formName: {
      type: String,
      default: ''
    },
    tooltip: {
      type: Object,
      default: null,
    },
    options: {
      type: Array,
      default: []
    },
    readonly: {
      type: Boolean,
      default: false
    },
    errors: {
      type: String,
      default: ''
    }
  },
  computed: {
    isRegularInput() {
      let res = true

      switch (this.type) {
        case 'select':
          res = false
          break;
        case 'textarea':
          res = false
          break;
        case 'checkbox':
          res = false
          break;
      
        default:
          break;
      }

      return res
    },
    isTextarea() {
      return this.type === 'textarea'
    },
    isSelect() {
      return this.type === 'select'
    },
    isCheckbox() {
      return this.type === 'checkbox'
    },
    showErrors() {
      let res = false

      if (this.errorMsg) {
        res = true
      }

      return res
    }
  }
}
</script> 
