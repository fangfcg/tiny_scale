import Vue from 'vue'
import Vuex from 'vuex'
import admin from './api/admin'

Vue.use(Vuex)

const state = {
  admin: admin,
  compData: [{text: '您好！'}, {text: '请您稍等，我为您转接更专业的负责人员'}, {text: '这个是我们公司的官网'}, {text: '这是我们公司的最新产品'}]
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
