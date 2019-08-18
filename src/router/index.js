import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const HomeView = () => import('../views/Home.view.vue')
const DetailView = () => import('../views/Detail.view.vue')

export function createRouter () {
  return new Router({
    mode: 'history',
    routes: [
      { path: '/', component: HomeView },
      { path: '/detail', component: DetailView }
    ]
  })
}