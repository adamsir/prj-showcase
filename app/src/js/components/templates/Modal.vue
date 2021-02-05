<template>
  <component is="div">
    <div class="modal modal-primary" :class="{ 'active': dialogVisible }">
      <a class="modal-overlay"></a>
      <div class="modal-container">
        <div class="modal-header">
          <div class="modal-title text-center h3">Please select your location</div>
          <div class="text-center h4">To where are we shipping your order?</div>
        </div>
        <div class="modal-body">
          <div class="content">
            <div>
              <a-select :data="country.id" :options="countries" placeholder="Country guessing..." @select="onCountrySelect"></a-select>
            </div>
          </div>
        </div>
        <div class="modal-footer no-space">
          <button class="btn btn-primary btn-modal" @click="confirm">Confirm country</button>
        </div>
      </div>
    </div>
  </component>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import Select from '../atoms/Select'

export default {
  data() {
    return {
      data: { country: null, isCountryConfirmed: true },
    }
  },
  components: {
    'a-select': Select,
  },
  computed: {
    ...mapState({
      countries: state => state.countries.all, 
      country: state => state.countries.current,
      dialogVisible: state => state.countries.dialogVisible
    }),
  },
  methods: {
    ...mapActions({
      'sendData': 'cart/sendData',
    }),
    onCountrySelect(event) {
      this.data = { country: event, isCountryConfirmed: true }
    },
    confirm() {
      if (!this.data.country) {
        this.data.country = this.country.id
      }
      this.sendData(this.data)
      this.$router.push({name: 'checkout:upsell'})
    }
  }
}
</script>
