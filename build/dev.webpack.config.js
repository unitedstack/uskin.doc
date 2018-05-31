/**
 * @PengJiyuan
 */
const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WriteFilePlugin = require('write-file-webpack-plugin');
const lessToJs = require('less-var-parse');
const entrys = require('./entry');

let entry = {};

entrys
  .filter(function(m) {
    return fs.statSync(path.join('../pages', m)).isDirectory();
  })
  .forEach(function(m) {
    entry[m] = ['../pages/' + m + '/index.jsx'];
  });

let themer = lessToJs(fs.readFileSync(path.join(__dirname, '../theme/index.less'), 'utf8'));

let webpackConfig = {

  mode: 'development',

  context: __dirname,

  entry: entry,

  output: {
    path: path.resolve(__dirname, '../static'),
    filename: '[name].min.js',
    publicPath: '/static/'
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
    }]
  },

  optimization: {
    splitChunks: {
      cacheGroups: {
        vendors: {
          chunks: 'all',
          test: /[\\/]node_modules[\\/]/,
          name:"dll",
          minChunks: 1,
          maxInitialRequests: 5,
          minSize: 0,
          priority:100
        }
      }
    }
  },

  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].min.css',
      chunkFilename: '[id].css'
    }),
    new WriteFilePlugin()
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
  },

  devServer: {
    contentBase: path.join(__dirname, '../static'),
    compress: true,
    port: 8888,
    inline: true,
    stats: {
      assets: true,
      chunks: false,
      chunkModules: false,
      chunkOrign: false,
      modules: false,
      moduleTrace: false,
      reasons: false,
      source: false
    }
  },

  devtool: 'cheap-source-map'
};

const pluginHtmls = entrys.map(id => new HtmlWebpackPlugin({
  chunks: ['dll', id],
  filename: (id === 'home' ? 'index' : id) + ".html",
  inject: true,
  template: path.resolve(__dirname, '../public/index.html')
}));

webpackConfig.plugins = webpackConfig.plugins.concat(pluginHtmls);

module.exports = webpackConfig;
