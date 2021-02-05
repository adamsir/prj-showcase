<template>
  <div class="choice" :class="{ 'selected': selected }" @click="onClick(title)">
    <div class="choice-header">
      <i class="icon icon-check"></i>
      <span v-text="title"></span>
    </div>
  </div>
</template>

<script>

export default {
  name: "choicer",
  props: ['title', 'selected'],
  mounted() {
    //this.bindProps();
  },
  methods: {
    bindProps() {
      this.items = this.data;
    },
    onClick(event) {
      this.$emit("choiceupdate", event);
    }
  }
}
</script>

<style lang="scss" scoped>
  /* @todo apply scss vars with design tokens */
  $component-spacing: 2rem;
  $component-gutter: 1.2rem;
  $component-border: 1px solid #b8ead0;
  $component-radius: 50px;


  .choice {
    padding: 0.525rem 2rem;
    padding-left: 2.5rem;
    background: #fff;
    border: $component-border;
    border-radius: $component-radius;
    cursor: pointer;
    width: 100%;
    transition: box-shadow .2s ease;

    &:hover {
      &:not(.selected) {
        box-shadow: 0 0 0px 2px #ffffff;
      }
    }

    & + .choice {
      margin-top: $component-gutter;
    }

    &.selected {
      &, .icon {
        border-color: #01B757;
        color: #fff;
        background: #01B757;
      }
    }
  }

  .choice-header {
    position: relative;
  }

  .icon {
    padding: 12px;
    border: $component-border;
    border-color: #fff;
    color: #b8ead0;
    border-radius: 50%;
    position: absolute;
    top: -5px;
    left: -42px;
  }
</style>
