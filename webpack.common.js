const path = require('path');
const webpack = require('webpack');
const WebpackBar = require('webpackbar');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { VueLoaderPlugin } = require("vue-loader");

function resolve(dir) {
  return path.join(__dirname, "project_eshop/src", dir)
}

/* Webpack Constants */
const FINGERPRINT = Date.now();
const PATH_ROOT = __dirname + '/project_eshop/'
const PATH_SRC = path.resolve(PATH_ROOT, 'src/');
const PATH_DIST = path.resolve(PATH_ROOT, 'static/');
const PATH_JS = PATH_SRC + 'js/app.js';
const PATH_TEMPLATES = PATH_ROOT + '/templates/'

const cleanPaths = [
  'css',
  'js'
];

const cleanOptions = {
  root: PATH_DIST,
  exclude: [''],
  watch: false
}

const config = {
  stats: "errors-only",
  context: path.resolve(__dirname, 'project_eshop'),
  entry: {
    polyfills: '@babel/polyfill/noConflict',
    css: PATH_SRC + '/scss/style.scss',
    app: PATH_SRC + '/js/app.js',
    misc: PATH_SRC + '/js/misc.js',
  },
  output: {
    path: path.resolve(__dirname, 'project_eshop/static/dist'),
    publicPath: '/static/dist/',
    filename: (chunkData) => {
      return chunkData.chunk.name === 'misc' ? '[name].js': 'js/[name].[hash].bundle.js';
    },
  },
  resolve: {
    extensions: ['*', '.js', '.vue', '.scss', '.css', '.html'],
    alias: {
      vue$: 'vue/dist/vue.js',
      "@": resolve("js")
    },
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
            'scss': [
              'vue-style-loader',
              'css-loader',
              'sass-loader'
            ],
            'sass': [
              'vue-style-loader',
              'css-loader',
              'sass-loader?indentedSyntax'
            ]
          }
        }
      },
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
        }
      },
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'url-loader?limit=10000&minetype=application/font-woff&publicPath=../&name=./fonts/[hash].[ext]'
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'img/[name].[ext]',
              publicPath: '../'
            }
          }
        ]
      },
      {
        test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'file-loader?publicPath=../&name=./fonts/[hash].[ext]'
      },
      {
        test: /\.(scss|css)$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader'
        ]
      }
    ],
  },
  plugins: [
    new WebpackBar(),
    new CleanWebpackPlugin({
      dry: false,
      verbose: false
    }),
    new VueLoaderPlugin(),
    new MiniCssExtractPlugin({
      filename: `css/[name].[hash].css`
    }),
    new HtmlWebpackPlugin({
      alwaysWriteToDisk: true,
      inject: true,
      template: 'templates/webpack_base.html',
      filename: path.resolve(__dirname, 'project_eshop/templates/base.html')
      /* fingerprint: FINGERPRINT */
    }),
    new HtmlWebpackHarddiskPlugin({
      outputPath: path.resolve(__dirname, 'project_eshop/templates/')
    }),
  ],
};

module.exports = config
