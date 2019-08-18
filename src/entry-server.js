import createApp from './main.js'

export default context => {
  return new Promise((resolve, reject) => {
    const { app, router, store } = createApp()
    const { url } = context
    const { fullPath } = router.resolve(url).route

    if (fullPath !== url) {
      return reject({ code: 404 })
    }

    const Components = router.getMatchedComponents(router.match(url))
    Components[0].data = function data() {
      return {
        title: 'fuck'
      }
    }

    router.push(url)

    router.onReady(() => {
      const matchedComponents = router.getMatchedComponents()

      if (!matchedComponents.length) {
        return reject({ code: 404 })
      }

      const promises = matchedComponents.map(component => {
        const p = []
        let fetchPromise = new Promise(resolve => {
          if (component.fetch) {
            component.fetch({
              store,
              route: router.currentRoute
            }).then(resolve).catch(reject)
          } else {
            resolve()
          }
        })
        p.push(fetchPromise)

        let asyncDataPromise = new Promise(resolve => {
          if (component.asyncData) {
            component.asyncData({
              store,
              route: router.currentRoute
            }).then((result) => {
              // console.log('app.$options', app.$options.data)
              // console.log('result>>>>>>', result)
              console.log(typeof component.data)
              console.log(component.data.length)
              console.log(component.data)
              // console.log(component.data())
              component.data = function data() {
                return Object.assign(component.data(), result)
              }
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
        context.state = {
          serverRendered: true,
          state: store.state
        }
        resolve(app)
      }).catch(reject)
    }, reject)
  })
}