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
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const lessToJs = require('less-var-parse');
const entrys = require('./entry');

// show webpack bundle analyze
const showMeMore = process.env.npm_config_showmemore;

let entry = {};

entrys
  .filter(function(m) {
    return fs.statSync(path.join('../pages', m)).isDirectory();
  })
  .forEach(function(m) {
    // babel-polyfill占地面积太大啦！
    // TODO: 手写polyfill
    entry[m] = [/*'babel-polyfill', */'../pages/' + m + '/index.jsx'];
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
    }]
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
    ],
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
      'react-router-dom': 'node_modules/react-router-dom',
      'uskin': 'uskin/index'
    }
  }
};

const pluginHtmls = entrys.map(id => new HtmlWebpackPlugin({
  chunks: ['dll', id],
  filename: (id === 'home' ? 'index' : id) + ".html",
  inject: true,
  template: path.resolve(__dirname, `../public/${id === 'docs' ? 'docs' : 'index'}.html`)
}));

webpackConfig.plugins = webpackConfig.plugins.concat(pluginHtmls);

if(showMeMore) {
  webpackConfig.plugins.push(new BundleAnalyzerPlugin());
}

module.exports = webpackConfig;
