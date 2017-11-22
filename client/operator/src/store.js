import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
  waitingNum: 5,
  customerNum: 3,
  todayNum: 3,
  customerArray: [{id: 12}, {id: 23}, {id: 34}],
  currentCustomer: -1
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

  },
  initSock (state) {

  },
  sendMsg (state, msg) {
  },
  endService (state) {

  }
}

export default new Vuex.Store({
  state,
  mutations
})
