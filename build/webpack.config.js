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
const lessToJs = require('less-var-parse');
const manifestJson = require('./manifest.json');

let language = process.env.npm_config_lang || process.env.language;

// Default language
if (!language) {
  language = 'zh-CN';
}

let entry = {};
fs.readdirSync('./applications')
  .filter(function(m) {
    return fs.statSync(path.join('./applications', m)).isDirectory();
  })
  .forEach(function(m) {
    entry[m] = ['babel-polyfill', './applications/' + m + '/index.jsx'];
  });

let themer = lessToJs(fs.readFileSync(path.join(__dirname, './theme/index.less'), 'utf8'));

module.exports = {

  mode: 'production',

  context: __dirname,

  entry: entry,

  output: {
    path: path.resolve(__dirname, './public/dist'),
    filename: '[hash:6].' + language + '.[name].min.js',
    publicPath: '/public/dist',
    chunkFilename: '[hash:6].' + language + '.[id].bundle.js'
  },

  module: {
    rules: [{
      test: /\.jsx?$/,
      exclude: /node_modules|moment|ufec/,
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
  }
};
