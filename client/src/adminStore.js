import Vue from 'vue'
import Vuex from 'vuex'
import admin from './api/admin'

Vue.use(Vuex)

const state = {
  admin: admin
}

const mutations = {
  getGroupList (state) {
    state.admin.getGroupList()
  },
  getGroupInfo () {
    state.admin.getGroupInfo()
  },
  getOperatorInfo () {
    state.admin.getOperatorInfo()
  },
  getOperatorChatTotal () {
    state.admin.getOperatorChatTotal()
  },
  getOperatorChatLog () {
    state.admin.getOperatorChatLog()
  }
}

export default new Vuex.Store({
  state,
  mutations
})
