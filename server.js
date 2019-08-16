const fs = require('fs')
const Koa = require('koa')
const Router = require('koa-router')
const router = new Router()
const LRU = require('lru-cache')
const { createBundleRenderer } = require('vue-server-renderer')

// 是否为生产环境
const isProd = process.env.NODE_ENV === 'production'

const app = new Koa()

// 静态html模版路径
const templatePath = path.resolve(__dirname, './src/index.template.html')

// vue-server-renderer的实例
let renderer = null

const createRenderer = (serverBundle) => {
  return createBundleRenderer(serverBundle, {
    // 静态组件缓存
    cache: LRU({
      max: 1000,
      maxAge: 1000 * 60 * 20
    }),
    runInNewContext: false
  })
}

const context = {
  title: 'Vue SSR'
}

const render = (ctx) => {
  ctx.res.setHeader('Content-Type', 'text/html')
  renderer.renderToString(context, (err, html) => {
    if (!err) {
      res.send(html)
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

router.get('*', isProd ? render : (req, res) => {
  readyPromise.then(() => render(req, res))
})

app.use(router.routes(), router.allowedMethods())

app.listen(8080)
