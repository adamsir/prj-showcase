import Vue from 'vue';
import Raven from 'raven-js';
import RavenVue from 'raven-js/plugins/vue';
import Notifications from 'vue-notification';
import VueRouter from 'vue-router';
import store from './store_new';
import AppEntry from './components/views/Entry.vue';
import { RoutesMap } from './app-routes';

const isProduction = process.env.NODE_ENV === "production";

let errorTrackerMiddleware = {
  captureException(e) {
    console.error(e)
  }
}

if (isProduction) {
  errorTrackerMiddleware = Raven
    .config('https://35d331628b91455ca9d1aa9c77ddb3c6@sentry.io/1249852')
    .addPlugin(RavenVue, Vue)
    .install();
}

export const errorTracker = errorTrackerMiddleware;

// Vue config
Vue.config.silent = true;
Vue.config.productionTip = false;

// Vue filters
Vue.filter('price', (value) => {
  return `${value} EUR`;
});

Vue.directive('focus', {
  // When the bound element is inserted into the DOM...
  inserted: function (el) {
    // Focus the element
    el.focus()
  }
});
Vue.filter('lowercase', function (value) {
  if (!value) return '';
  return value.toLowerCase();
});

// Vue router
Vue.use(VueRouter);
export const router = new VueRouter({
  mode: 'history',
  routes: RoutesMap,
  scrollBehavior (to, from, savedPosition) {
    return { x: 0, y: 0 }
  }
});

// Form validations
/* @todo fixme */
/* Vue.use(VeeValidate); */

// Notifications
Vue.use(Notifications);

// Vue Eshop instance
const app = new Vue({
  el: '#cart',
  store,
  router,
  render: h => h(AppEntry)
});
