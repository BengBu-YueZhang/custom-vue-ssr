const path = require('path')
const outputPath = path.resolve(__dirname, '../dist')

module.exports = {
  development: {
    outputPath: outputPath,
    publicPath: '/',
    filename: '[name].js',
    chunkFilename: '[name].chunk.js',
    vars: {
      'process.env': {
        'NODE_ENV': JSON.stringify('development')
      }
    }
  },
  production: {
    outputPath: outputPath,
    publicPath: '',
    filename: '[name].[chunkhash].js',
    chunkFilename: '[name].[chunkhash].chunk.js',
    vars: {
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }
  }
}
