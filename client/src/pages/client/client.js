// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import client from './client.vue'
import store from '../../clientStore.js'
import { emoji } from '../../api/emoji.js'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

Vue.config.productionTip = false
Vue.prototype.emoji = emoji
Vue.use(ElementUI)
Vue.prototype.document = document

window.onbeforeunload = function (event) {
  var message = '确定要离开此网站吗？'
  event.returnValue = message
  return message
}

/* eslint-disable no-new */
new Vue({
  el: '#client',
  store,
  render: h => h(client)
})
