import Vue from 'vue'
import Vuex from 'vuex'
import {serverIp} from '../configs'

Vue.use(Vuex)

const state = {
  uploadId: '',
  serverIp: serverIp
}

const mutations = {
}

export default new Vuex.Store({
  state,
  mutations
})
