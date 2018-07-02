import Vue from 'vue'
import Router from 'vue-router'
import SignUp from '@/components/SignUp'
import Login from '@/components/Login'
import Welcome from '@/components/Welcome'
import Attribute from '@/components/Attribute'
import MFA from '@/components/MFA'
import CognitoUser from '@/components/CognitoUser'
import IDPool from '@/components/IDPool'

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
      path: '/MFA',
      name: 'MFA',
      component: MFA
    },
    {
      path: '/CognitoUser',
      name: 'CognitoUser',
      component: CognitoUser
    },
    {
      path: '/IDPool',
      name: 'IDPool',
      component: IDPool
    },

    {
      path: '/',
      name: 'Welcome',
      component: Welcome
    },
  ]
})
