const webpack = require('webpack')
const merge = require('webpack-merge')
const isProd = process.env.NODE_ENV === 'production'
const baseConfig = isProd ? require('./webpack.base.prod.config') : require('./webpack.base.dev.config')

let config = require('../config')

switch (process.env.NODE_ENV) {
  case 'development':
    config = config.development
    break
  case 'production':
    config = config.production
    break
}

module.exports = merge(baseConfig, {
  target: 'node',

  devtool: '#source-map',

  entry: path.resolve(__dirname, './../src/entry-server.js'),

  output: {
    filename: 'server-bundle.js',
    libraryTarget: 'commonjs2'
  },

  externals: nodeExternals({
    whitelist: /\.css$/
  }),

  plugins: [
    new webpack.DefinePlugin({
      'VUE_ENV': '"server"',
      ...config.vars
    }),
    new VueSSRClientPlugin()
  ]
})