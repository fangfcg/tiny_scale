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
  sendMsg (state, msg, isPicture) {
    state.chat.sendMsg(msg, isPicture)
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
    state.chat.customGetLeaveMsg(msgId)
  },
  customReplyMsg (state, msg, id) {
    state.chat.customReplyMsg(msg, id)
  },
  changeStatus (state, command) {
    state.chat.changeStatus(command)
  },
  crossServe (state, operatorId) {
    state.chat.crossServe(operatorId)
  },
  getSelfReply (state) {
    state.chat.getSelfReply()
  },
  getCompReply (state) {
    state.chat.getCompReply()
  },
  renewReply (state) {
    state.chat.renewReply()
  },
  initData (state) {
    state.chat.initData()
  }
}

export default new Vuex.Store({
  state,
  mutations
})
