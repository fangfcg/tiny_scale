import Vue from 'vue'
import Router from 'vue-router'
import CustomMenu from '@/components/operator/CustomMenu'
import CustomTalk from '@/components/operator/CustomTalk'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/CustomMenu',
      component: CustomMenu
    },
    {
      path: '/CustomTalk',
      component: CustomTalk
    },
    {
      path: '/',
      redirect: '/CustomMenu'
    }
  ]
})
