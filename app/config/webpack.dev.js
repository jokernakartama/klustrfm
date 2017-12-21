var path = require('path')
var webpackConfig = require('./webpack.common')
var merge = require('webpack-merge')
var webpack = require('webpack')
var FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
var HtmlWebpackPlugin = require('html-webpack-plugin')
// paths 
var rootDir = path.join(__dirname, '../../');
var buildPath = path.join(rootDir, 'build');
var sourcePath = path.join(rootDir, 'source');
var config = require('../config/server.config')
// add hot-reload related code to entry chunks
Object.keys(webpackConfig.entry).forEach(function (name) {
  webpackConfig.entry[name] = [path.join(__dirname, '../client.js')].concat(webpackConfig.entry[name])
})


var plugins = [
  // injects built files in html file
  new HtmlWebpackPlugin({
    template: path.join(sourcePath, 'index.html'),
    path: buildPath,
    filename: 'index.html',
    inject: true,
    minify: {
      removeComments: true
    }
  }),
  new webpack.LoaderOptionsPlugin({
      debug: true,
  }),
  // shows module path names in hot module replacement info instead of numbers 
  new webpack.NamedModulesPlugin(),
  // shows neat logs in console, logs in webpack-dev-middleware and webpack-hot-middleware must be disabled
  new FriendlyErrorsPlugin({
    compilationSuccessInfo: {
      messages: ['You application is running here http://localhost:' + config.port],
    }
  }),
  // reloads the page, when the changes in file has been saved
  new webpack.HotModuleReplacementPlugin()
]


var rules = [
  { test: /\.css$/, loaders: ['style-loader', 'css-loader'] },
  { test: /\.scss$/, loaders: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader', 'import-glob-loader'] },
  { test: /\.sass$/, loaders: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader', 'import-glob-loader'] },
  { test: /\.less$/, loaders: ['style-loader', 'css-loader', 'less-loader', 'sass-loader', 'import-glob-loader'] },
  { test: /\.styl$/, loaders: ['style-loader', 'css-loader', 'stylus-loader', 'import-glob-loader'] },
]


module.exports =  merge(webpackConfig, {
  devtool: 'cheap-module-eval-source-map',
  module: {
    rules
  },
  plugins,
})
