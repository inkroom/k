import Vue from 'vue'

import App from './App'
import store from './store'
import ElementUI from 'element-ui';
import  'element-theme-dark';

import helpers from './plugins';
import * as filters from './filters';

Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})



Vue.use(ElementUI);

Vue.helper = Vue.prototype.$helper = helpers;

//实现广播机制
Vue.prototype.$eventHub= Vue.prototype.$eventHub || new Vue()

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  components: { App },
  store,
  template: '<App/>'
}).$mount('#app')
