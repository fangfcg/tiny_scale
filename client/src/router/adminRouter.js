import Vue from 'vue'
import Router from 'vue-router'
import AdminChart from '@/components/admin/AdminChart'
import AdminMain from '@/components/admin/AdminMain'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/Data',
      component: AdminChart
    },
    {
      path: '/Main',
      component: AdminMain
    },
    {
      path: '/Settings'
    },
    {
      path: '/',
      redirect: '/Main'
    }
  ]
})
