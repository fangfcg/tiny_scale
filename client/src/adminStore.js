import Vue from 'vue'
import Vuex from 'vuex'
import Admin from './api/admin'

Vue.use(Vuex)

const state = {
  admin: Admin
}

const mutations = {
  changeDisplayingType (state, id) {
    state.admin.changeDisplayingType(id)
  },
  changeDisplayingCustom (state, id) {
    state.admin.changeDisplayingCustom(id)
  },
  getRawData (state) {
    return state.admin.getRawData()
  },
  setRandomData (state) {
    state.admin.setRandomData()
  },
  getCurrType (state) {
    return state.admin.getCurrType()
  }
}

export default new Vuex.Store({
  state,
  mutations
})
