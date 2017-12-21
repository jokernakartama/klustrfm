var webpack = require('webpack')
var path = require('path')
// Extracts all css files in one
var ExtractTextPlugin = require('extract-text-webpack-plugin');
// Adds vendor prefixes in css
var autoprefixer = require('autoprefixer')
var nodeEnv = process.env.NODE_ENV || 'development'
var isProduction = nodeEnv === 'production'
// paths 
var rootDir = path.join(__dirname, '../../');
var nodeModulesPath = path.join(rootDir, 'node_modules');
var jsSourcePath = path.join(rootDir, 'source/js');
var buildPath = path.join(rootDir, 'build');
var sourcePath = path.join(rootDir, 'source');


var rules = [
  {
    test: /\.(js|jsx)$/,
    include: jsSourcePath,
    exclude: /node_modules/,
    use: [
      'babel-loader',
      'eslint-loader',
    ],
  }
]

var plugins = [
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: JSON.stringify(nodeEnv),
    },
  }),
  new webpack.LoaderOptionsPlugin({
    options: {
      postcss: [
        autoprefixer({
          browsers: [
            'last 3 version',
            'ie >= 10',
          ],
        }),
      ],
      context: sourcePath,
    },
  }),
  // prevents Webpack from outputting anything into a bundle on errors
  new webpack.NoEmitOnErrorsPlugin()
];


module.exports = {
  devtool: false,
  context: jsSourcePath,
  entry: {
    app: path.join(jsSourcePath, 'main.js')
  },
  output: {
    path: buildPath,
    publicPath: '/',
    filename: 'app.js',
  },
  module: {
    rules
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    alias: {
      '@': path.resolve(sourcePath, 'styles'),
      '#': path.resolve(sourcePath, 'static'),
      '~': path.resolve(sourcePath, 'js')
    },
    modules: [
      nodeModulesPath,
      jsSourcePath,
    ],
  },
  plugins,
};