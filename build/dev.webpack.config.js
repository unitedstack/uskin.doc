/**
 * @PengJiyuan
 */
const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const lessToJs = require('less-var-parse');
const manifestJson = require('./manifest.json');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

// show webpack bundle analyze
const showMeMore = process.env.npm_config_showmemore;

let entry = {};
fs.readdirSync('./applications')
  .filter(function(m) {
    return fs.statSync(path.join('./applications', m)).isDirectory();
  })
  .forEach(function(m) {
    entry[m] = ['babel-polyfill', './applications/' + m + '/index.jsx'];
  });

let themer = lessToJs(fs.readFileSync(path.join(__dirname, './theme/index.less'), 'utf8'));

let webpackConfig = {

  mode: 'development',

  context: __dirname,

  entry: entry,

  output: {
    path: path.resolve(__dirname, 'public/dist'),
    filename: '[name].min.js',
    publicPath: '/public/dist'
  },

  module: {
    rules: [{
      test: /\.jsx?$/,
      exclude: /node_modules|moment|ufec/,
      use: {
        loader: 'babel-loader',
        options: {
          cacheDirectory: true
        }
      }
    }, {
      test: /\.less|css$/,
      use: [
        MiniCssExtractPlugin.loader,
        'css-loader',
        {
          loader: 'postcss-loader',
          options: {
            plugins: function() {
              return [autoprefixer];
            }
          }
        }, {
          loader: 'less-loader',
          options: {
            sourceMap: true,
            modifyVars: themer
          }
        }
      ]
    }, {
      test: /\.(woff|svg|eot|ttf|otf)\??.*$/,
      use: [
        {
          loader: 'file-loader',
          options: {
            limit: 1000,
            name: '/fonts/[hash:8].icon.[ext]'
          }
        }
      ]
    }],
    noParse: [
      /moment/g
    ]
  },

  // only show valid/invalid and errors
  // deal with verbose output
  stats: {
    assets: true,
    colors: true,
    warnings: true,
    errors: true,
    errorDetails: true,
    entrypoints: true,
    version: true,
    hash: false,
    timings: true,
    chunks: false,
    chunkModules: false,
    children: false
  },

  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].min.css'
    }),
    new webpack.DllReferencePlugin({
      context: path.join(__dirname, '..'),
      manifest: manifestJson
    })
  ],

  resolve: {
    extensions: ['.jsx', '.js', 'json'],
    modules: [
      path.resolve(__dirname, '../'),
      'node_modules'
    ],
    alias: {
      'react': 'node_modules/react',
      'react-dom': 'node_modules/react-dom',
      'moment': 'client/libs/moment'
    }
  },

  devtool: 'cheap-source-map',

  watch: true
};

if(showMeMore) {
  webpackConfig.plugins.push(new BundleAnalyzerPlugin());
}

module.exports = webpackConfig;
