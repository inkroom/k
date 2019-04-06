import Vue from 'vue'

import App from './App'
import store from './store'

import redis from '../redis/redis';
import db from '../datastore/index';

import ElementUI from "element-ui";

// import alert from './components/message';

// import "element-ui/lib/theme-chalk/index.css";

// import "../../theme/index.css";
import 'element-theme-dark';


console.log(require ('../../package.json'));

Vue.use(ElementUI);


if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.redis = Vue.prototype.$redis = redis;
Vue.db = Vue.prototype.$db = db;
// Vue.alert = Vue.prototype.$alert = alert;

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  components: { App },
  store,
  template: '<App/>'
}).$mount('#app')
