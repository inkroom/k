import Vue from 'vue'

import App from './App'
import router from './router'
import store from './store'

import redis from '../redis/redis';
import db from '../datastore/index';

import ElementUI from "element-ui";
// import "element-ui/lib/theme-chalk/index.css";

// import "../../theme/index.css";
import 'element-theme-dark';
Vue.use(ElementUI);


if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.redis = Vue.prototype.$redis = redis;
Vue.db = Vue.prototype.$db = db;
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
