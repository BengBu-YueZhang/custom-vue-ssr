const fs = require('fs')
const Koa = require('koa')
const Router = require('koa-router')
const router = new Router()
const LRU = require('lru-cache')
const { createBundleRenderer } = require('vue-server-renderer')

// 是否为生产环境
const isProd = process.env.NODE_ENV === 'production'

const app = new Koa()
// 静态html模版
const template = fs.readFileSync('./src/index.template.html', 'utf-8')

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
}

router.get('*', render)

app.use(router.routes(), router.allowedMethods())

app.listen(8080)
