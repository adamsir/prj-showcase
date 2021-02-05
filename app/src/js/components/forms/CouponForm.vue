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
        :errors="field.errors"
        className="column col-6 col-xs-12"
        formName="form"
        @eventOutput="onEventOutput"
      />
      <div class="column col-3 col-xs-12 flex-start">
        <a-btn @click="onClicked">Apply</a-btn>
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
      form: state => state.coupon.form,
    }),
  },
  methods: {
    ...mapActions({
      'update': 'coupon/update',
      'verify': 'coupon/sendData',
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

