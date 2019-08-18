const fs = require('fs')
const path = require('path')
const LRU = require('lru-cache')
const express = require('express')
const compression = require('compression')
const resolve = file => path.resolve(__dirname, file)
const { createBundleRenderer } = require('vue-server-renderer')

const isProd = process.env.NODE_ENV === 'production'

const app = express()

function createRenderer (bundle, options) {
  try {
    return createBundleRenderer(bundle, Object.assign(options, {
      cache: new LRU({
        max: 1000,
        maxAge: 1000 * 60 * 15
      }),
      runInNewContext: false
    }))
  } catch (error) {
    console.log(error)
  }
}

let renderer
let readyPromise
const templatePath = resolve('./src/index.template.html')
if (isProd) {
  const template = fs.readFileSync(templatePath, 'utf-8')
  const bundle = require('./dist/vue-ssr-server-bundle.json')
  const clientManifest = require('./dist/vue-ssr-client-manifest.json')
  renderer = createRenderer(bundle, {
    template,
    clientManifest
  })
} else {
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
app.use('/dist', serve('./dist', true))
app.use('/public', serve('./public', true))

function render (req, res) {

  res.setHeader("Content-Type", "text/html")

  const handleError = err => {
    if (err.url) {
      res.redirect(err.url)
    } else if(err.code === 404) {
      res.status(404).send('404 | Page Not Found')
    } else {
      res.status(500).send('500 | Internal Server Error')
    }
  }

  const context = {
    url: req.url,
    title: ''
  }

  renderer.renderToString(context, (err, html) => {
    if (err) {
      return handleError(err)
    }
    res.send(html)
  })
}

app.get('/api/detail', (req, res) => {
  return res.send({
    msg: 'success',
    data: [
      'https://img3.doubanio.com/view/photo/l/public/p2502651183.webp',
      'https://img1.doubanio.com/view/photo/l/public/p2399705738.webp',
      'https://img3.doubanio.com/view/photo/l/public/p2504091813.webp',
      'https://img3.doubanio.com/view/photo/l/public/p2504091825.webp'
    ]
  })
})

app.get('*', isProd ? render : (req, res) => {
  readyPromise.then(() => render(req, res))
})

const port = process.env.PORT || 8080

app.listen(port)
