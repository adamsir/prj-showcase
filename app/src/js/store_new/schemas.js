/* Interface for Country entity */
export const ICountry = {
  id: 0,
  name: "",
  symbol: "",
  isNativeCurrency: false,
  showVATPrices: false
}


/* Interface for Product entity */
export const IProduct = {
  id: null,
  img: [],
  img_hero: "",
  slug: "",
  price: null,
  stock: null,
  title: "",
  title_html: "",
  labels: "",
  children: [],
  attributes: [],
  default_attribute: {},
  amazon_url: "",
  multipack: [],
  multipack_id: [],
  description: "",
  is_preorder: false,
  is_insurance: false,
  is_accessories: false,
  show_on_homepage: false,
  show_on_accessories: false,
  quantity: 1,
}
