import Vue from 'vue'

import App from './App'
import store from './store'
import ElementUI from 'element-ui';
import 'element-theme-dark';

Vue.use(ElementUI);



if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  components: { App },
  store,
  template: '<App/>'
}).$mount('#app')
