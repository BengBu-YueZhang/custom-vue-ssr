const fs = require('fs')
const path = require('path')
const LRU = require('lru-cache')
const compress = require('koa-compress')
const Koa = require('koa')
const Router = require('koa-router')
const resolve = file => path.resolve(__dirname, file)
const { createBundleRenderer } = require('vue-server-renderer')
const koaStatic = require('koa-static')

const isProd = process.env.NODE_ENV === 'production'

const app = new Koa()
const router = new Router()

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

const serve = (path, cache) => koaStatic(resolve(path), {
    maxAge: cache && isProd ? 1000 * 60 * 60 * 24 * 30 : 0
  }
)

app.use(compress())
app.use(serve('./dist', true))
app.use(serve('./public', true))

async function render (ctx) {
  if (ctx.url.indexOf('api') > -1) return

  ctx.set("Content-Type", "text/html")

  const handleError = err => {
    if (err.url) {
      ctx.redirect(err.url)
    } else if(err.code === 404) {
      ctx.response.status = 404
      ctx.response.body = '404 | Page Not Found'
    } else {
      ctx.response.status = 500
      ctx.response.body = '500 | Internal Server Error'
    }
  }

  const context = {
    url: ctx.url,
    title: ''
  }

  await renderer.renderToString(context).then(html => {
    ctx.body = html
  }).catch(err => {
    handleError(err)
  })
}

router.get('/api/detail', async (ctx) => {
  ctx.type = 'json'
  ctx.status = 200
  ctx.body = {
    msg: 'success',
    data: [
      'https://i.loli.net/2019/08/18/oQwqrHnGOJbNKLC.png',
      'https://i.loli.net/2019/08/18/DeI7hV5Mp6rcbK4.png',
      'https://i.loli.net/2019/08/18/YTuSmfAlytIqgwd.png',
      'https://i.loli.net/2019/08/18/sQvkjf6TI2mUOp1.png'
    ]
  }
})

router.get('*', isProd ? render : (ctx) => {
  readyPromise.then(() => render(ctx))
})

app.use(router.routes())
app.use(router.allowedMethods())

const port = process.env.PORT || 8080

app.listen(port)

