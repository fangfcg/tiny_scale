import Vue from 'vue'
import Vuex from 'vuex'
import Chat from './api/client'

Vue.use(Vuex)

const state = {
  a: 1,
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
  },
  leaveMsg (state, msg) {
    state.chat.leaveMsg(msg)
  },
  sendRate (state, rate) {
    state.chat.sendRate(rate)
  }
}

export default new Vuex.Store({
  state,
  mutations
})
