import Vue from 'vue'
import Router from 'vue-router'
import loginMain from '@/components/login/loginMain'
import loginSignin from '@/components/login/loginSignin'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/login',
      component: loginMain
    },
    {
      path: '/signin',
      component: loginSignin
    },
    {
      path: '/',
      redirect: '/login'
    }
  ]
})
