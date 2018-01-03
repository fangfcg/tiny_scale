import Vue from 'vue'
import Vuex from 'vuex'
import Chat from './api/operator'

Vue.use(Vuex)

const state = {
  chat: Chat
  // selfData: [{text: '你好！'}, {text: '谢谢你！'}, {text: '不客气！'}, {text: '这个是一个测试数据'}],
  // compData: [{text: '您好！'}, {text: '请您稍等，我为您转接更专业的负责人员'}, {text: '这个是我们公司的官网'}, {text: '这是我们公司的最新产品'}]
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
  },
  getLeaveMessageList (state) {
    state.chat.getLeaveMessageList()
  },
  customGetLeaveMsg (state, msgId) {
    state.chat.customGetLeaveMsg(state, msgId)
  },
  customReplyMsg (state, msg) {
    state.chat.customReplyMsg(state, msg)
  },
  changeStatus (state, command) {
    state.chat.changeStatus(command)
  },
  getSelfReply (state) {
    state.chat.getSelfReply()
  },
  getCompReply (state) {
    state.chat.getCompReply()
  },
  setSelfReply (state, data) {
    state.chat.setSelfReply(data)
  }
}

export default new Vuex.Store({
  state,
  mutations
})
