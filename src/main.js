import Vue from 'vue'
import createStore from './store'
import createRouter from './router'
import { sync } from 'vuex-router-sync'

export default function createApp () {
  const store = createStore()
  const router = createRouter()
  sync(store, router)
  const app = new Vue({
    router,
    store,
    render: h => h(App)
  })
  return {
    app,
    router,
    store
  }
}
