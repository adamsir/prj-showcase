<template>
  <component is="div">
    <div class="component">
      <div class="columns component-body">
        <div class="column col-mx-auto">
          <div class="card-labels" v-text="reference.labels"></div>
          <div class="component-carousel">
            <!-- @todo atomize -->
            <img :src="images" alt="" class="a-image">
          </div>
          <ul v-if="product.attributes" class="color-picker">
            <li v-for="(subProduct, index) in product.attributes" :key="index" class="color-picker-item">
              <button class="btn btn-action btn-color circle radio as-radio" 
                @click="changeProductVariant(subProduct.id)"
                :class="[{'active' : selectedProductVariant === subProduct.id}, subProduct.name]">
                <i class="icon icon-check"></i>
              </button>
            </li>
          </ul>
        </div>
        <div class="column col-12">
          <!-- <brand-title :title="title" :nextRoute="slug"></brand-title> -->
          <div class="a-link-title">
            <router-link :to="slug" v-text="title"></router-link>
          </div>
          <p class="component-desc" v-html="desc"></p>
          <div class="columns">
            <div class="column col-6 text-left d-f-asc">
              <div class="component-price">
                <a-loader :loading="priceLoading">
                  <Price :value="price" :valueSuffix="currencySymbol" />
                </a-loader>
              </div>
            </div>
            <div class="column col-6 text-right">
              <a-btn v-if="!reference.no_stock" @click="onClicked(reference)">Add to cart</a-btn>
              <a-btn v-if="reference.no_stock" :disabled="true">Sold out</a-btn>
            </div>
          </div>
          <slot></slot>
        </div>
      </div>
    </div>
  </component>
</template>

<script>
import { mapGetters } from 'vuex'
/* @todo move these files into their respective folders */
import BrandTitle from '../TemplateBrandTitle'
import ButtonColor from '../atoms/ButtonColor'
import Price from '../atoms/Price'
import Image from '../atoms/Image'
import Button from '../atoms/Button'
import Loader from '../atoms/Loader'

export default {
  data() {
    return {
      product: this.reference,
      selectedProductVariant: null
    }
  },
  props: {
    reference: {
      type: Object,
      default: null
    },
    title: {
      type: String,
      default: ""
    },
    images: {
      type: Array,
      default: []
    },
    desc: {
      type: String,
      default: ""
    },
    price: {
      type: Number|String,
      default: null
    },
    priceLoading: {
      type: Boolean,
      default: false
    },
    slug: {
      type: String,
      default: ""
    },
    currencySymbol: {
      type: String,
      default: "EUR"
    }
  },
  components: {
    BrandTitle,
    Price,
    'a-btn': Button,
    'a-color': ButtonColor,
    'a-image': Image,
    'a-loader': Loader,
  },
  computed: {
    ...mapGetters('products', [
      'getProdById'
    ]),
  },
  methods: {
    onClicked(value) {
      this.$emit('eventOutput', value)
    },
    changeProductVariant(id) {
      const res = this.getProdById(id)
      this.reference = res;
      this.title = res.title_html
      this.images = [res.img_hero]
      this.desc = res.description
      this.price = res.price
      this.slug = { name: 'product', params: { slug: res.slug } }

      // select product
      this.selectedProductVariant = id
    }
  },
  beforeMount() {
    /* @todo refactor colors choosing */
    try {
      this.changeProductVariant(this.reference.id)
    } catch (error) {
      // do nothing
    }
  },
  beforeUpdate() {
    this.changeProductVariant(this.selectedProductVariant)
  }
}
</script>


<style lang="scss" scoped>
  .component {
    background: #fff;
    border: 1px solid #ececec;
    border-radius: 4px;
    margin-bottom: 0.8rem;

    &-body {
      padding: 1.2rem;
    }

    &-price {
      position: relative;
    }

    &-desc {
      /* copy-pasted margin value */
      margin: .8rem 0;
      font-size: 0.6rem;
      min-height: 80px;
    }

    &-title {
      font-family: "Project", "Roboto", sans-serif;
      font-size: 1.2rem;
      color: #232323;
      font-weight: 500;
      text-transform: capitalize;

      /* >>> = Vue Deep Selectors for v-html */
      >>> span {
        font-family: "Roboto", sans-serif;
        font-weight: 300;
        font-size: 1.025rem;
      }
    }
  }

  .component .color-picker {
    transform: scale(0.8);
    position: relative;
    top: 3px;
  }

  .component-carousel {
    height: 130px;
    overflow: hidden;
    margin-bottom: 0.6rem;
    width: auto;
    margin: auto;
  }

  /* @todo atomize */
  .a-image {
    display: block;
    height: 100%;
    max-width: 100%;
    margin: auto;
    object-fit: cover;
  }
  .a-link-title {
    margin: 0.6rem 0;
    text-align: center;
  }
  /* @todo atomize */

</style>

<style lang="scss" scoped>
  /* @todo atomize */
  .component-body {
    position: relative;
    padding-top: 2.4rem;
  }
  .card-labels {
    position: absolute;
    top: 23px;
    left: 50%;
    margin: 0;
    border-radius: 50px;
    font-size: 11px;
    font-weight: 500;
    box-shadow: 0px 2px 3px 1px #f3f3f3;
    border: 1px solid #e9e7e7;
    background: rgba(255, 255, 255, 0.9);
    transform: translateX(-50%);
    padding: 0.2rem 0.5rem 0.2rem 0.5rem;
    line-height: 1.2;
    color: #4e5153;
  }
</style>



