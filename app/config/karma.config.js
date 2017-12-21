var webpackConfig = require('./webpack.test')

module.exports = function(config) {
  config.set({
    files: [
      // use a polyfill for function.prototype.bind which is missing from PhantomJS
      '../../node_modules/phantomjs-polyfill/bind-polyfill.js',
      // path pattern for specifications
      '../../source/**/*.spec.js'
    ],
    // frameworks to use in test files
    frameworks: ['mocha', 'chai-sinon'],

    preprocessors: {
      // application files
      '../../source/**/*[^\.spec].js': ['webpack'],
      // '../../test/**/*[^\.spec].js': ['webpack'],
      // test files
      '../../source/**/*.spec.js': ['webpack']
    },
    reporters: ['spec'],
    webpack: webpackConfig,
    webpackMiddleware: {
      noInfo: true
    },
    browsers: ['PhantomJS']
  })
}
