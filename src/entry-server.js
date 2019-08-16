import { createApp } from './main'

export default context => {
  return new Promise((resolve, reject) => {
    const { app, router, store } = createApp()
    const { url } = context
    const { fullPath } = router.resolve(url).route

    if (fullPath !== url) {
      return reject({ code: 404 })
    }

    router.onReady(() => {
      const matchedComponents = router.getMatchedComponents()

      if (!matchedComponents.length) {
        return reject({ code: 404 })
      }

      router.push(url)

      const promises = matchedComponents.map(component => {
        const p = []
        let fetchPromise = new Promise(resolve => {
          component.$options.fetch && component.$options.fetch({
            store,
            route: router.currentRoute
          }).then(resolve).catch(reject)
        })
        p.push(fetchPromise)
        let asyncDataPromise = new Promise(resolve => {
          component.$options.asyncData && component.$options.asyncData({
            store,
            route: router.currentRoute
          }).then((data) => {
            component.$options.data = Object.assign({}, component.$options.data, data)
            resolve()
          }).catch(reject)
        })
        p.push(asyncDataPromise)
        return Promise.all(p)
      })

      Promise.all(promises).then(() => {
        context.state = {
          serverRendered: true,
          state: store.state
        }
        resolve(app)
      }).catch(reject)
    }, reject)
  })
}