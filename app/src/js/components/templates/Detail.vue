<template>
  <component is="div" class="t-detail">
    <!-- @TODO atomize -->
    <div class="card detail">
      <div class="card-header sticky">
        <!-- @TODO atomize layout as atom -->
        <div class="d-flex d-space-between card-header-inner d-f-center">
          <brand-title :title="title" class="card-header-title"></brand-title>
          <!-- @TODO atomize layout as atom -->
          <div class="price-button d-flex d-space-between d-f-center">
            <price :value="price" :valueSuffix="currencySymbol" class="price-button-text"></price>
            <a-btn v-if="!reference.no_stock" @click="onClicked(reference)">Add to cart</a-btn>
            <a-btn v-if="reference.no_stock" :disabled="true">Sold out</a-btn>
          </div>
        </div>
      </div>

      <div class="card-body">
        <div class="carousel-wrapper">
          <carousel :data="images"></carousel>
        </div>
        <!-- product colors -->
        <ul v-if="product.attributes" class="color-picker">
          <li v-for="(subProduct, index) in product.attributes" :key="index" class="color-picker-item">
            <button class="btn btn-action btn-color circle radio as-radio" 
              @click="changeProductVariant(subProduct.id)"
              :class="[{'active' : selectedProductVariant === subProduct.id}, subProduct.name]">
              <i class="icon icon-check"></i>
            </button>
          </li>
        </ul>
        <div class="d-flex-column-center d-m-b">
          <button 
            v-if="reference.multipack_id" 
            @click="showProductMultipack(multipack.visible ? product.id : reference.multipack_id)" 
            class="btn btn-action as-checkbox btn-multipack">
            <span class="item-span">
              <span v-if="reference.isMultipack">
                I want to save with multipack
              </span>
              <span v-if="!reference.isMultipack">
                I want a singlepack
              </span>
              <span class="icon icon-holder is-multipack">
                <i v-show="reference.isMultipack" class="icon icon-product"></i>
                <i class="icon icon-product is-main"></i> 
                <i v-show="reference.isMultipack" class="icon icon-product"></i>
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

        <div class="card-product-detail">
          <div v-html="sheet"></div>
        </div>
      </div>
    </div>
  </component>
</template>

<script>
import { mapGetters } from 'vuex'
import Button from '../atoms/Button'
import Price from '../atoms/Price'
import BrandTitle from '../TemplateBrandTitle'
import Carousel from '../Gallery.vue'

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
  components: {
    'a-btn': Button,
    Price,
    BrandTitle,
    Carousel,
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
    currencySymbol: {
      type: String,
      default: "EUR"
    },
    sheet: {
      type: String,
      default: ""
    },
  },
  computed: {
    ...mapGetters('products', [
      'getProdById',
      'getProdBySlug',
    ]),
  },
  methods: {
    changeProductVariant(id, changeSlug = true) {
      const res = this.getProdById(id)
      this.reference = res;
      this.title = res.title
      this.images = [res.img_hero]
      this.desc = res.description
      this.price = res.price
      this.slug = { name: 'product', params: { slug: res.slug } }

      // select product
      this.selectedProductVariant = id

      // multipack 
      if (this.reference.multipack_id) {
        this.multipack.id = this.reference.multipack_id
        if (this.reference.products_count == 1) {
          this.reference.isMultipack = true
        } else {
          this.reference.isMultipack = false
        }
      }

      // change product url
      if (changeSlug) {
        this.$router.push(this.slug)
      }
    },
    showProductMultipack(id) {
      this.changeProductVariant(id)
      this.multipack.visible = !this.multipack.visible
    },
    onClicked(value) {
      this.$emit('eventOutput', value)
    },
  },
  beforeMount() {
    /* @todo refactor colors choosing */
    try {
      this.changeProductVariant(this.reference.id, false)
    } catch (error) {
      // do nothing
    }
  }
}
</script>

<style lang="scss" scoped>
.carousel-wrapper {
  margin-bottom: 2.4rem;
  height: 300px;
}
.color-picker {
  margin-bottom: 1.2rem;
}
/* @todo move to css library */
.card-header {
  padding: 1.2rem;
}
.sticky {
  position: sticky;
  top: 60px;
  background: #fff;
  border-bottom: 1px solid #ececec;
  z-index: 2;
}
/* @todo as molecule(button, price) */
.price-button {
  .price-button-text {
    margin-right: .6rem;
  }
}
@media (max-width: 350px) {
  .carousel-wrapper {
    height: 200px;
  }
}
@media (max-width: 840px) {
  .card-header-inner {
    flex-direction: column;
    align-items: flex-start;

    .card-header-title {
      margin-bottom: .6rem;
    }

    .price-button .price-button-text {
      margin: 0;
      margin-left: 0.6rem;
      order: 1;
    }
  }
}
</style>

<style lang="scss">
/* @todo refactor [low-priority] */
  .detail .card-product-detail {
    margin-left: -1.2rem;
    margin-right: -1.2rem;
  }

  .detail .icons-block {
    display: flex;
    flex-wrap: wrap;
    width: 95%;
    margin: 0 auto;
  }
  .detail .icons-block > div, .detail .icons-block > a {
    width: 20%;
    text-align: center;
    margin: 0 0 1.6rem 0;
    color: #999;
    font-size: 0.6rem;
    color: #999;
  }
  .detail .icons-block > div img, .detail .icons-block > a img {
    margin: 0 0 0.4rem;
    height: 1.8rem;
  }
  .detail .icons-block > div > span, .detail .icons-block > a > span {
    display: block;
  }
  .detail article .content-block img {
    width: 135px;
  }
  .detail article .content-block .block-main {
    width: 44%;
  }
  .detail .card-product-detail article + article:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 0.05rem;
    background: #ececec;
  }
  .detail article .content-block, .detail .article .content-block {
    display: flex;
    justify-content: space-around;
    margin-bottom: 1.2rem;
  }
  .detail article .content-block ul {
    margin: 0;
    padding: 0;
  }
  .detail article .content-block ul li {
    list-style: none;
    margin: 0;
    color: #999;
    position: relative;
    padding: 0 0 0 0.8rem;
  }
  .detail article .content-block ul li:before {
    content: '';
    position: absolute;
    top: 0.45rem;
    left: 0;
    width: 0.4rem;
    height: 0.05rem;
    background: #999;
  }
  .detail .card-product-detail {
    border-top: 0.05rem solid #ececec;
  }

  .article-choice-wrapper {
    margin: -2.6rem -1.2rem 1.8rem -1.2rem;
    padding-bottom: 2rem;
    border-bottom: 1px solid #eeefee;
    padding: 0;
    text-align: center;
    display: flex;
    justify-content: center;

    .article-choice {
      padding: 0.4rem 1rem;
      border: 1px solid #fff;
      border-radius: 3px;
      text-decoration: none;
      margin: 6px 3px;
      color: #636363;
    }
  }

@media (max-width: 840px) {
  .article-choice-wrapper {
    flex-wrap: wrap;
    flex-direction: column;
  }
}
@media (min-width: 480px) {
  .detail article.is-large .content-block .block-main {
    width: 44%;
  }
  .detail article.is-large .content-block img {
    width: 200px;
  }
}
@media (max-width: 480px) {
  .detail article .content-block, .detail .article .content-block {
    flex-direction: column;
    text-align: left;
  }
  .detail article .content-block > div:not(.block-main), .detail .article .content-block > div:not(.block-main) {
    text-align: center;
  }
  .detail article .content-block img {
    width: auto;
    height: 130px;
    margin-bottom: 2rem;
  }
  .detail article .content-block .block-main {
    width: 100%;
  }
  .detail .icons-block > div {
    width: 50%;
  }
}
</style>
