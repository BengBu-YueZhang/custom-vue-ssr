import { createApp } from './app'

export default context => {

  return new Promise((resolve, reject) => {
    const { app, router, store } = createApp()

    const { url } = context
    const { fullPath } = router.resolve(url).route

    if (fullPath !== url) {
      return reject({ url: fullPath })
    }

    router.push(url)

    router.onReady(() => {
      const matchedComponents = router.getMatchedComponents()

      if (!matchedComponents.length) {
        return reject({ code: 404 })
      }

      Promise.all(matchedComponents.map(({ asyncData }) => asyncData && asyncData({
        store,
        route: router.currentRoute
      }))).then(() => {
        context.state = {
          serverRendered: true,
          store: store.state,
        }
        resolve(app)
      }).catch(reject)

    }, reject)
  })
}
