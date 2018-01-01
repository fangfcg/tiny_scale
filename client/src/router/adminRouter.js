import Vue from 'vue'
import Router from 'vue-router'
import AdminChart from '@/components/admin/AdminChart'
import AdminMain from '@/components/admin/AdminMain'
import AdminSetting from '@/components/admin/AdminSetting'

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
      path: '/Settings',
      component: AdminSetting
    },
    {
      path: '/',
      redirect: '/Main'
    }
  ]
})
