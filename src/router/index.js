import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const LoginView = () => import('../views/Login.view.vue')
const HomeView = () => import('../views/Home.view.vue')
const DetailView = () => import('../views/Detail.view.vue')

export default function createRouter () {
  return new Router({
    mode: 'history',
    routes: [
      {
        path: '/',
        component: HomeView
      },
      {
        path: '/login',
        component: LoginView
      },
      {
        path: '/detail/:id',
        component: DetailView
      }
    ]
  })
}
