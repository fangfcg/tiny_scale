import Vue from 'vue'
import Router from 'vue-router'
import AdminChart from '@/components/admin/AdminChart'
import AdminMain from '@/components/admin/AdminMain'
import AdminSetting from '@/components/admin/AdminSetting'
import AdminRobot from '@/components/admin/AdminRobot'
import AdminInvite from '@/components/admin/AdminInvite'

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
      path: '/Robot',
      component: AdminRobot
    },
    {
      path: '/Invite',
      component: AdminInvite
    },
    {
      path: '/',
      redirect: '/Main'
    }
  ]
})
