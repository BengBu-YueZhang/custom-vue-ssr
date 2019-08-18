const path = require('path')
const VueLoaderPlugin = require('vue-loader/lib/plugin')

let config = require('../config')

switch (process.env.NODE_ENV) {
  case 'development':
    config = config.development
    break
  case 'production':
    config = config.production
    break
}

module.exports = {

  output: {
    path: config.outputPath,
    publicPath: config.publicPath,
    filename: config.filename,
    chunkFilename: config.chunkFilename
  },

  resolve: {
    extensions: ['.js', '.vue'],
    alias: {
      '@': path.resolve(__dirname, '../src')
    }
  },

  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.(js|vue)$/,
        loader: 'eslint-loader',
        exclude: /node_modules/
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        options: {
          presets: ['@babel/preset-env'],
          plugins: [
            // import()
            '@babel/plugin-syntax-dynamic-import'
          ]
        }
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?\S*)?$/,
        use: [{
          loader: 'url-loader',
          options: {
            limit: 1024,
            name: './static/img/[name].[hash:7].[ext]'
          }
        }]
      },
      {
        test: /\.(woff|woff2|eot|ttf|svg)$/,
        exclude: /node_modules/,
        use: [{
          loader: 'url-loader',
          options: {
            limit: 1024,
            name: './static/font/[name].[hash].[ext]'
          }
        }]
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: './static/media/[name].[hash:7].[ext]'
        }
      }
    ]
  },

  plugins: [
    new VueLoaderPlugin()
  ]
}