import Vue from 'vue'
import App from './login.vue'
import router from '../../router/loginRouter.js'
import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import store from '../../loginStore.js'
import axios from 'axios'

Vue.use(Element)
Vue.config.productionTip = false
axios.defaults.withCredentials = true
Vue.prototype.$http = axios

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  render: h => h(App)
})
