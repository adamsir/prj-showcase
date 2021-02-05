/*  Enable Storybook, please run this command
    yarn add -D @storybook/vue @storybook/addons @storybook/addon-notes @storybook/addon-knobs @storybook/addon-actions
*/

import Vue from 'vue';
import Token from './TokenBox.vue'

export default { title: 'Tokens/Colors' };

export const overview = () => ({
  components: { Token },
  template: `
    <div class="d-flex">
      <token color="#019e4b">Primary #019e4b</token>
      <token color="#232323">Secondary #232323</token>
      <token color="#fff">Background #fff</token>
    </div>
  `
});
