import Vue from 'vue'
import Router from 'vue-router'
import AdminChart from '@/components/admin/AdminChart'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/Data',
      component: AdminChart
    },
    {
      path: '/Main'
    },
    {
      path: '/Settings'
    }
  ]
})
