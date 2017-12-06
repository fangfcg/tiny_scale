import Vue from 'vue'
import Vuex from 'vuex'
import Chat from './api/operator'

Vue.use(Vuex)

const state = {
  chat: Chat
}

const mutations = {
  getNext (state) {
    state.chat.getNext()
  },
  initSock (state) {
    state.chat.initSock()
  },
  sendMsg (state, msg) {
    state.chat.sendMsg(msg)
  },
  endService (state) {
    console.log('fcgendservice')
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
