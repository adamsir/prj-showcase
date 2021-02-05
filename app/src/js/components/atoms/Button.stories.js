import Vue from 'vue';
import MyButton from './Button.vue';

export default { title: 'Atoms/Buttons' };

export const primaryButton = () => ({
  components: { MyButton },
  template: '<my-button>Add to cart</my-button>'
});

export const linkButton = () => ({
  components: { MyButton },
  template: '<button class="btn btn-link">Link Button</button>'
});


