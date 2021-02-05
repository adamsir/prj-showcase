<template>
  <component is="div">
    <div class="columns">
      <f-input 
        v-for="(field, index) in form" :key="index"
        v-show="field.enabled"
        :name="field.name"
        :value="field.value"
        :label="field.label"
        :type="field.type"
        :placeholder="field.placeholder" 
        :required="field.required"
        className="column col-6 col-xs-12"
        formName="form"
        @eventOutput="onEventOutput"
      />
      <div class="column col-3 col-xs-12 flex-end">
        <a-btn v-if="shouldValidate" @click="onClicked">Validate VAT</a-btn>
      </div>
    </div>
  </component>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import Button from '../atoms/Button'
import Input from './FormInput'

export default {
  components: {
    'a-btn': Button,
    'f-input': Input,
  },
  computed: {
    ...mapState({
      form: state => state.business.form,
      country: state => state.countries.current
    }),
    shouldValidate() {
      return this.country.region === 'EU'
    }
  },
  methods: {
    ...mapActions({
      'update': 'business/update',
      'verify': 'business/sendData',
    }),
    onEventOutput(value) {
      this.update(value)
    },
    onClicked() {
      this.verify()
    }
  }
}
</script>
