const outputPath = path.resolve(__dirname, '../dist')

module.exports = {
  development: {
    outputPath: outputPath,
    publicPath: '/dist/',
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
    publicPath: '/dist/',
    filename: '[name].[chunkhash].js',
    chunkFilename: '[name].[chunkhash].chunk.js',
    vars: {
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }
  }
}