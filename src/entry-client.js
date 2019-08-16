import Vue from 'vue'
import { createApp } from './app'

const { app, router, store } = createApp()

if (window.__INITIAL_STATE__ && window.__INITIAL_STATE__.state) {
  store.replaceState(window.__INITIAL_STATE__.state)
}

router.onReady(() => {
  router.beforeResolve((to, from, next) => {
    const matched = router.getMatchedComponents(to)

    const prevMatched = router.getMatchedComponents(from)

    let diffed = false
    
    let serverRendered = false

    if (window.__INITIAL_STATE__ && window.__INITIAL_STATE__.serverRendered) {
      serverRendered = !!window.__INITIAL_STATE__.serverRendered
      window.__INITIAL_STATE__.serverRendered = false
    }

    const activatedComponents = matched.filter((c, i) => {
      return diffed || (diffed = (prevMatched[i] !== c))
    })

    if (!activatedComponents.length) {
      return next()
    }

    const promises = activatedComponents.map(component => {
      const p = []
      let fetchPromise = new Promise(resolve => {
        if (serverRendered) {
          component.$options.fetch && component.$options.fetch({
            store,
            route: router.currentRoute
          }).then(resolve).catch(reject)
        } else {
          resolve()
        }
      })
      p.push(fetchPromise)

      let asyncDataPromise = new Promise(resolve => {
        if (serverRendered && !component.$options.data) {
          component.$options.asyncData && component.$options.asyncData({
            store,
            route: router.currentRoute
          }).then((data) => {
            component.$options.data = Object.assign({}, component.$options.data, data)
            resolve()
          }).catch(reject)
        } else {
          resolve()
        }
      })
      p.push(asyncDataPromise)

      return Promise.all(p)
    })

    Promise.all(promises).then(() => {
      next()
    }).catch(next)
  })

  app.$mount('#app')
})