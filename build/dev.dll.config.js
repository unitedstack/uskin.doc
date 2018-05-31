/**
 * @PengJiyuan
 */
const path = require('path');
const webpack = require('webpack');

module.exports = {

  mode: 'development',

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
    filename: '[name].dll.js',
    library: '[name]_[hash]'
  },

  plugins: [
    new webpack.DllPlugin({
      path: path.join(__dirname, 'manifest.json'),
      name: '[name]_[hash]'
    })
  ],

  devtool: 'cheap-source-map'

};
