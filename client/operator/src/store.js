import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
  waitingNum: 5,
  customerNum: 0,
  todayNum: 3
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
  }
}

export default new Vuex.Store({
  state,
  mutations
})
