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
  },
  endService (state) {
    state.chat.endService()
  },
  changeCard (state, userid) {
    state.chat.changeCard(userid)
  }
}

export default new Vuex.Store({
  state,
  mutations
})
