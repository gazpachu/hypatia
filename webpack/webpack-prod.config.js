module.exports = require('./webpack.config.js')({
  isProduction: true,
  devtool: 'source-map',
  jsFileName: 'app.[hash].js',
  cssFileName: 'app.[hash].css',
});
