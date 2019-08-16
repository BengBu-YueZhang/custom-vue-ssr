const fs = require('fs')
const Koa = require('koa')
const Router = require('koa-router')
const serve = require('koa-static')
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
let readyPromise = null

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

const render = (ctx) => {
  ctx.set('Content-Type', 'text/html')

  const context = {
    title: 'Vue SSR'
  }

  const handleError = (err) => {
    if (err.code === 404) {
      ctx.response.status = 404
      ctx.response.body = 'Page Not Found'
    } else {
      ctx.response.status = 500
      ctx.response.body = 'Internal Server Error'
    }
  }
  
  renderer.renderToString(context, (err, html) => {
    if (!err) {
      ctx.response.status = 200
      ctx.response.body = html
    } else {
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

// 静态文件管理
app.use('/dist', serve(path.resolve(__dirname, './dist')))
app.use('/public', serve(path.resolve(__dirname, './public')))

router.get('*', isProd ? render : (ctx) => {
  readyPromise.then(() => render(ctx))
})

app.use(router.routes(), router.allowedMethods())

app.listen(8080)
