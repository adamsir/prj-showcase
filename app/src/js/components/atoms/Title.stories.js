import Vue from 'vue';
import Title from './Title.vue';

export default { title: 'Atoms/Typography' };

export const overview = () => ({
  components: { Title },
  template: `
    <div>
    <h1>Hero Title</h1>
    <h2>Hero Title</h2>
    <h3>Hero Title</h3>
    <h4>Hero Title</h4>
    <h5>Hero Title</h5>
    <h6>Hero Title</h6>
    </div>
  `
});

