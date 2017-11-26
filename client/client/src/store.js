import Vue from 'vue'
import Vuex from 'vuex'
import Chat from './api/client'

Vue.use(Vuex)

const state = {
  chat: Chat
}

const mutations = {
  callService (state) {
    state.chat.callService()
  },
  initSock (state) {
    state.chat.initSock()
  },
  sendMsg (state, msg) {
    state.chat.sendMsg(msg)
  }
}

export default new Vuex.Store({
  state,
  mutations
})
