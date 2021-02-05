<template>
  <component is="div" class="d-m-b">
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
        :tooltip="field.tooltip"
        :readonly="field.readonly"
        :errors="field.errors"
        className="column col-12"
        formName="agreement"
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
      form: state => state.credentials.agreement
    }),
  },
  methods: {
    ...mapActions({
      'update': 'credentials/update',
    }),
    onEventOutput(value) {
      this.update(value)
    }
  },
}
</script>
