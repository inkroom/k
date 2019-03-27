import Vue from 'vue'
import Vuex from 'vuex'

import {
  createPersistedState,
  createSharedMutations
} from 'vuex-electron'

import modules from './modules'

Vue.use(Vuex)

let res = {};

if (process.env.NODE_ENV === 'development') {
  res = {
    modules,
    plugins: [
      createPersistedState(),
    ],
    strict: process.env.NODE_ENV !== 'production'
  }
} else {
  res = {
    modules,
    plugins: [
      createPersistedState(),
      // createSharedMutations()
    ],
    strict: process.env.NODE_ENV !== 'production'
  }
}
console.log(res);
export default new Vuex.Store(res);