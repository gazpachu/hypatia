module.exports = require('./webpack.config.js')({
  isProduction: false,
  devtool: 'cheap-eval-source-map',
  cssFileName: '[name].[hash].css'
});
