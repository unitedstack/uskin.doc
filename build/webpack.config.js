/**
 * @PengJiyuan
 */
const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const os = require('os');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const lessToJs = require('less-var-parse');
const entrys = require('./entry');

let entry = {};

entrys
  .filter(function(m) {
    return fs.statSync(path.join('../pages', m)).isDirectory();
  })
  .forEach(function(m) {
    entry[m] = ['babel-polyfill', '../pages/' + m + '/index.jsx'];
  });

let themer = lessToJs(fs.readFileSync(path.join(__dirname, '../theme/index.less'), 'utf8'));

let webpackConfig = {

  mode: 'production',

  context: __dirname,

  entry: entry,

  output: {
    path: path.resolve(__dirname, '../static'),
    filename: '[hash:6].[name].min.js',
    publicPath: '.'
  },

  module: {
    rules: [{
      test: /\.jsx?$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader'
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
      use: {
        loader: 'file-loader',
        options: {
          limit: 1000,
          name: '/fonts/[hash:8].icon.[ext]'
        }
      }
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

  optimization: {
    minimizer: [
      new UglifyJSPlugin({
        parallel: os.cpus().length
      })
    ]
  },

  plugins: [
    new MiniCssExtractPlugin({
      filename: '[hash:6].[name].min.css',
      chunkFilename: '[id].css'
    })
  ],

  resolve: {
    extensions: ['.jsx', '.js', 'json'],
    modules: [
      path.resolve(__dirname, '..'),
      'node_modules'
    ],
    alias: {
      'react': 'node_modules/react',
      'react-dom': 'node_modules/react-dom',
      'react-router-dom': 'node_modules/react-router-dom'
    }
  }
};

const pluginHtmls = entrys.map(id => new HtmlWebpackPlugin({
  chunks: ["common", id],
  filename: id + ".html",
  inject: true,
  template: path.resolve(__dirname, '../public/index.html')
}));

webpackConfig.plugins = webpackConfig.plugins.concat(pluginHtmls);

module.exports = webpackConfig;
