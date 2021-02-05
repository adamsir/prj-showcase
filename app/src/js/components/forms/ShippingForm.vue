<template>
  <component is="div">
    <div class="columns">
      <f-input 
        v-for="(field, index) in form" :key="index"
        v-show="field.enabled"
        :name="field.name"
        :value="resolveInputValueByName(field.name, field.value)"
        :label="field.label"
        :type="field.type"
        :placeholder="field.placeholder" 
        :required="field.required"
        :options="resolveInputOptionsByName(field.name, field.options)"
        :tooltip="field.tooltip"
        :readonly="field.readonly"
        :errors="field.errors"
        className="column col-6 col-xs-12"
        formName="shipping_address"
        @eventOutput="onEventOutput"
      />
    </div>

  </component>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import Input from './FormInput'

export default {
  components: {
    'f-input': Input
  },
  computed: {
    ...mapState({
      form: state => state.credentials.shipping_address,
      countries: state => state.countries.all,
      country: state => state.countries.current.id,
      provinces: state => state.countries.provinces,
      provinceCurrent: state => state.countries.provinceCurrent.code,
    }),
  },
  methods: {
    ...mapActions({
      'update': 'credentials/update',
      'sendData': 'cart/sendData'
    }),
    onEventOutput(value) {
      this.update(value)

      let data = value.formData
      if (data.key === 'country') {
        this.sendData({ country: data.value })
      }
      if (data.key === 'state') {
        this.sendData({ state: this.provinces[data.value].name })
      }
    },
    resolveInputValueByName(name, valueDefault) {
      let inputValue

      switch (name) {
        case 'country':
          inputValue = this.country
          break;
        case 'state':
          inputValue = this.provinceCurrent
          break;
      
        default:
          inputValue = valueDefault
          break;
      }

      return inputValue
    },
    resolveInputOptionsByName(name, valueDefault) {
      let inputValue

      switch (name) {
        case 'country':
          inputValue = this.countries
          break;
        case 'state':
          inputValue = this.provinces
          break;
      
        default:
          inputValue = valueDefault
          break;
      }

      return inputValue
    }
  },
}
</script>
