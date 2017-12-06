// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import client from './client.vue'
import store from '../../clientStore.js'

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#client',
  store,
  render: h => h(client)
})
