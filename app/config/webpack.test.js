var webpack = require('webpack')
var webpackConfig = require('./webpack.common')
var merge = require('webpack-merge')

delete webpackConfig.entry

var rules = [
  { test: /\.css$/, use: ['style-loader', 'css-loader'] },
  { test: /\.scss$/, use: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader', 'import-glob-loader'] },
  { test: /\.sass$/, use: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader', 'import-glob-loader'] },
  { test: /\.less$/, use: ['style-loader', 'css-loader', 'less-loader', 'sass-loader', 'import-glob-loader'] },
  { test: /\.styl$/, use: ['style-loader', 'css-loader', 'stylus-loader', 'import-glob-loader'] }
]

module.exports =  merge(webpackConfig, {
  devtool: 'inline-source-map',
  module: {
    rules,
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"testing"',
        BABEL_ENV: '"testing"'
      }
    })
  ]
})
