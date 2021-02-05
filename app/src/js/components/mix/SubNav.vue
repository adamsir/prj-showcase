<!-- @todo atomize -->
<template>
  <component is="div" class="component">
    <div class="steps-container">
      <div class="container grid-lg">
        <div class="columns">
          <div class="column col-12">
            <div class="component-body">
              <div v-if="!isEmpty" class="step-holder">
                <ul class="stepper" :class="stepClassName">
                  <router-link to="/" tag="li" class="stepper-item first">
                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg"
                      xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="20px" height="25px"
                      viewBox="0 0 140.625 250.039" enable-background="new 0 0 140.625 250.039" xml:space="preserve"
                      class="">
                      <g>
                        <g>
                          <g>
                            <g>
                              <path fill="#8D8E8F" d="M114.844,4.727l-3.125-0.625c-27.5-5.469-55.312-5.469-82.812,0l-3.281,0.625
                        C10.781,7.695,0,20.82,0,35.977v114.688c0,19.062,5.156,37.812,14.688,54.219l17.188,29.375
                        c5.625,9.688,16.25,15.781,27.656,15.781h21.562c11.406,0,22.031-6.094,27.656-15.938l17.656-30.625
                        c9.219-16.25,14.219-34.844,14.219-53.438V35.977C140.625,20.82,129.844,7.695,114.844,4.727z M127.812,150.039
                        c0,16.406-4.375,32.812-12.656,47.188l-17.5,30.469c-3.438,5.938-9.688,9.688-16.562,9.688H59.531
                        c-6.875,0-13.281-3.75-16.719-9.531l-17.031-29.375c-8.438-14.375-12.969-30.938-12.969-47.812V35.977
                        c0-9.062,6.406-17.031,15.312-18.75l3.281-0.625c12.969-2.656,25.938-3.906,38.906-3.906s25.938,1.25,38.906,3.906l3.281,0.625
                        c8.906,1.719,15.312,9.688,15.312,18.75V150.039z"></path>
                            </g>
                          </g>
                          <path fill="#8D8E8F" d="M117.188,50.977v48.438c0,1.719-1.406,3.125-3.125,3.125h-87.5c-1.719,0-3.125-1.406-3.125-3.125V50.977
                    c0-1.719,1.406-3.125,3.125-3.125h87.5C115.781,47.852,117.188,49.258,117.188,50.977z"></path>
                        </g>
                        <path fill="#8D8E8F" d="M117.188,117.539v14.062c0,1.719-1.406,3.125-3.125,3.125H79.688c-1.719,0-3.125-1.406-3.125-3.125v-14.062
                  c0-1.719,1.406-3.125,3.125-3.125h34.375C115.781,114.414,117.188,115.82,117.188,117.539z"></path>
                        <path fill="#8D8E8F" d="M64.062,118.008v14.062c0,1.719-1.406,3.125-3.125,3.125H26.562c-1.719,0-3.125-1.406-3.125-3.125v-14.062
                  c0-1.719,1.406-3.125,3.125-3.125h34.375C62.656,114.883,64.062,116.289,64.062,118.008z"></path>
                      </g>
                    </svg> <span>Products</span>
                  </router-link>
                  <router-link :to="{ name: 'checkout:upsell' }" tag="li" class="stepper-item">
                    <div data-initial="1" class="avatar stepper-avatar"></div>
                    <span>Accessories</span>
                  </router-link>
                  <router-link :to="{ name: 'checkout:shipping' }" tag="li" class="stepper-item" style="">
                    <div data-initial="2" class="avatar stepper-avatar"></div>
                    <span>Shipping</span>
                  </router-link>
                  <router-link :to="{ name: 'checkout:billing' }" tag="li" class="stepper-item">
                    <div data-initial="3" class="avatar stepper-avatar"></div>
                    <span>Billing</span>
                  </router-link>
                </ul>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </component>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'

export default {
  computed: {
    ...mapGetters({
      isEmpty: 'cart/isEmpty'
    }),
    stepClassName() {
      const currentPath = this.$route.name
      let stepName = ''

      switch (currentPath) {
        case 'checkout:upsell':
          stepName = 'in-1'
          break
        case 'checkout:shipping':
          stepName = 'in-2'
          break
        case 'checkout:billing':
          stepName = 'in-3'
          break
      
        default:
          stepName = ''
          break
      }

      return stepName
    }
  },
}
</script>

<style lang="scss" scoped>
  /* @todo move this to scss file */
  .component-body {
    height: 1.3rem;
  }
  .avatar {
    transition: all 0.2s ease-in;
  }
</style>
