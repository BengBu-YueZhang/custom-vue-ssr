import Vue from 'vue'
import { createApp } from './app'

Vue.mixin({
  beforeRouteUpdate (to, from, next) {
    const { asyncData } = this.$options
    if (asyncData) {
      asyncData({
        store: this.$store,
        route: to
      }).then(next).catch(next)
    } else {
      next()
    }
  }
})

const { app, router, store } = createApp()

if (window.__INITIAL_STATE__ && window.__INITIAL_STATE__.store) {
  store.replaceState(window.__INITIAL_STATE__.store)
}

router.onReady(() => {
  router.beforeResolve((to, from, next) => {
    const matched = router.getMatchedComponents(to)
    const prevMatched = router.getMatchedComponents(from)

    let diffed = false
    // 判断渲染是否来自服务端
    let serverRendered = false

    if (window.__INITIAL_STATE__ && window.__INITIAL_STATE__.serverRendered === true) {
      serverRendered = !!window.__INITIAL_STATE__.serverRendered
      window.__INITIAL_STATE__.serverRendered = false
    }

    const activated = matched.filter((c, i) => {
      return diffed || (diffed = (prevMatched[i] !== c))
    })

    const asyncDataHooks = activated.map(c => c.asyncData).filter(_ => _)

    if (!asyncDataHooks.length) {
      return next()
    }

    Promise.all(asyncDataHooks.map(hook => {
      // 如果来自服务端渲染，不在重复执行asyncData
      if (!serverRendered) {
        return hook({ store, route: to })
      } else {
        return Promise.resolve()
      }
    })).then(() => {
      next()
    }).catch(next)
  })

  app.$mount('#app')
})
