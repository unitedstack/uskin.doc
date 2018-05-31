/**
 * @PengJiyuan
 */
const path = require('path');
const webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {

  mode: 'production',

  resolve: {
    extensions: ['.js', '.jsx']
  },

  entry: {
    ustack: [
      'react',
      'react-dom',
      'rsvp'
    ]
  },

  output: {
    path: path.join(__dirname, 'public/dist'),
    filename: '[hash:6].[name].dll.js',
    library: '[name]_[hash]'
  },

  optimization: {
    minimizer: [
      new UglifyJsPlugin()
    ]
  },

  // {
  //   mangle: {
  //     except: ['[name]_[hash]', 'exports', 'require']
  //   },
  //   compress: {
  //     warnings: false
  //   }
  // }

  plugins: [
    new webpack.DllPlugin({
      path: path.join(__dirname, 'manifest.json'),
      name: '[name]_[hash]'
    })
  ]

};