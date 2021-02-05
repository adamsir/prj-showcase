<template>
  <component is="div">
    <div class="component">
      <div class="columns component-body">
        <div class="column col-md-4 col-sm-12">
          <div class="component-carousel">
            <!-- <carousel :data="images"></carousel> -->
            <!-- <img :src="images" alt="" class="img-responsive" loading="lazy"> -->
            <a-image :src="images" />
            <!-- <carousel v-else :data="images" :autoplay="false" :controls="false" :indicators="false"></carousel> -->
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
        <div class="column d-f-asc">
          <brand-title :title="title" :nextRoute="slug" class="d-m-b-small"></brand-title>
          <div class="columns">
            <div class="column">
              <a-btn v-if="!reference.no_stock" @click="onClicked(reference)">Add to cart</a-btn>
              <a-btn v-if="reference.no_stock" :disabled="true">Sold out</a-btn>
            </div>
            <div class="column d-f-asc">
              <div class="component-price">
                <a-loader :loading="priceLoading">
                  <Price :value="price" :valueSuffix="currencySymbol" />
                </a-loader>
              </div>
            </div>
          </div>
          <p class="component-desc" v-html="desc"></p>

          <button 
            v-if="multipack.id" 
            @click="showProductMultipack(multipack.visible ? product.id : reference.multipack_id)" 
            class="btn btn-action as-checkbox btn-multipack">
            <span class="item-span">
              <span v-if="multipack.visible">I want a single pack</span> 
              <span v-if="!multipack.visible">I want to save  with a 3-pack</span>
              <span class="icon icon-holder is-multipack">
                <i v-show="!multipack.visible" class="icon icon-product"></i>
                <i class="icon icon-product is-main"></i> 
                <i v-show="!multipack.visible" class="icon icon-product"></i>
              </span>
            </span>
          </button>

          <a v-if="reference.amazon_url" 
            :href="reference.amazon_url"
            target="_blank"
            class="btn btn-action as-checkbox btn-multipack">
            <span class="item-span">
              <span>Shop now at Amazon.com</span> 
              <span class="icon icon-holder">
                <i class="icon icon-amazon"></i> 
              </span>
            </span>
          </a>

        </div>
      </div>
<!-- 
      <div v-if="product.attributes">
        <ul class="menu">
          <li class="divider" data-content="Colors"></li>
          <li v-for="(subProduct, index) in product.attributes" :key="index" class="menu-item">
            <button class="btn btn-action btn-color circle radio as-radio" 
              @click="changeProductVariant(subProduct.id)"
              :class="[{'active' : selectedProductVariant === subProduct.id}, subProduct.name]">
              <i class="icon icon-check"></i>
            </button>
          </li>
        </ul>
      </div> -->



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
      multipack: {
        id: null,
        visible: false
      },
      selectedProductVariant: null,
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

      // multipack 
      if (this.reference.multipack_id) {
        this.multipack.id = this.reference.multipack_id
      }
    },
    showProductMultipack(id) {
      this.changeProductVariant(id)
      this.multipack.visible = !this.multipack.visible
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
    margin: 0 0 .8rem 0;

    &-body {
      padding: 1.2rem;
    }

    &-price {
      position: relative;
      text-align: right;
    }

    &-desc {
      /* copy-pasted margin value */
      margin: .8rem 0;
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

  .component-carousel {
    height: 300px;
    overflow: hidden;
    margin-bottom: 0.6rem;
  }
</style>

<style lang="scss">
  .btn.btn-multipack.as-checkbox {
    width: 240px;
    text-align: left;
  }
</style>



