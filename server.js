const fs = require('fs')
const express = require('express')
const path = require('path')
const LRU = require('lru-cache')
const compression = require('compression')
const { createBundleRenderer } = require('vue-server-renderer')
const resolve = file => path.resolve(__dirname, file)

// 是否为生产环境
const isProd = process.env.NODE_ENV === 'production'

const app = express()

// 静态html模版路径
const templatePath = path.resolve(__dirname, './src/index.template.html')

// vue-server-renderer的实例
let renderer = null
let readyPromise = null

const createRenderer = (serverBundle) => {
  return createBundleRenderer(serverBundle, {
    // 静态组件缓存
    cache: new LRU({
      max: 1000,
      maxAge: 1000 * 60 * 20
    }),
    runInNewContext: false
  })
}

const render = (req, res) => {
  res.setHeader('Content-Type', 'text/html')

  const context = {
    title: 'Vue SSR',
    url: req.url
  }

  const handleError = (err) => {
    if (err.code === 404) {
      res.status(404).send('404 | Page Not Found')
    } else {
      res.status(500).send('500 | Internal Server Error')
    }
  }
  
  renderer.renderToString(context, (err, html) => {
    if (!err) {
      res.send(html)
    } else {
      console.log('err>>>>>>>>>>>>', err)
      handleError(err)
    }
  })
}

if (isProd) {
  // 生产环境
  const template = fs.readFileSync(templatePath, 'utf-8')
  const bundle = require('./dist/vue-ssr-server-bundle.json')
  const clientManifest = require('./dist/vue-ssr-client-manifest.json')
  renderer = createRenderer(bundle, {
    template,
    clientManifest
  })
} else {
  // 开发环境
  readyPromise = require('./build/setup-dev-server')(
    app,
    templatePath,
    (bundle, options) => {
      renderer = createRenderer(bundle, options)
    }
  )
}

const serve = (path, cache) => express.static(resolve(path), {
  maxAge: cache && isProd ? 1000 * 60 * 60 * 24 * 30 : 0
})

app.use(compression({ threshold: 0 }))
// 静态文件管理
app.use('/dist', serve('./dist', true))
app.use('/public', serve('./public', true))

app.get('*', isProd ? render : (req, res) => {
  readyPromise.then(() => render(req, res))
})

app.listen(7071)
