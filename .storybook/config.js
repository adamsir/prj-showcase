import { configure } from '@storybook/vue';
import Vue from 'vue';
import Vuex from 'vuex';
import '!style-loader!css-loader!sass-loader!../project_eshop/src/scss/style.scss'

Vue.use(Vuex);

configure(require.context('../project_eshop/src/js/components/', true, /\.stories\.js$/), module);
