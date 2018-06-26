import Vue from 'vue'
import Router from 'vue-router'
import SignUp from '@/components/SignUp'
import Login from '@/components/Login'
import Welcome from '@/components/Welcome'
import Attribute from '@/components/Attribute'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/SignUp',
      name: 'SignUp',
      component: SignUp
    },
    {
      path: '/Login',
      name: 'Login',
      component: Login
    },
    {
      path: '/Attribute',
      name: 'Attribute',
      component: Attribute
    },
    {
      path: '/',
      name: 'Welcome',
      component: Welcome
    },
  ]
})
