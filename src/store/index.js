import Vue from 'vue'
import Vuex from 'vuex'
import user from './moudels/user.moudels'

Vue.use(Vuex)

export function createStore () {
  return new Vuex.Store({
    modules: {
      user
    }
  })
}