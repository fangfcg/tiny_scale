import Vue from 'vue'
import Vuex from 'vuex'
import Chat from './api/operator'

Vue.use(Vuex)

const state = {
  waitingNum: 5,
  customerNum: 3,
  todayNum: 3,
  customerArray: [{id: 12}, {id: 23}, {id: 34}],
  currentCustomer: -1,
  chat: Chat
}

const mutations = {
  customerNumChange (state, n) {
    state.customerNum += n
  },
  waitingChange (state, n) {
    state.waitingNum += n
  },
  waitingSet (state, n) {
    state.waitingNum = n
  },
  todayNumUpdate (state, n) {
    state.todayNum = n
  },
  customerArrayAdd (state, obj) {
    state.customerArray.push(obj)
  },
  customerArrayDelete (state, n) {
    state.customerArray.splice(n, 1)
    state.customerNum -= 1
    state.currentCustomer = -1
  },
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
    state.chat.endService()
  },
  changeCard (state, userid) {
    state.chat.changeCard(userid)
    console.log('store.js')
    console.log(userid)
  }
}

export default new Vuex.Store({
  state,
  mutations
})
