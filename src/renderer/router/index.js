import Vue from 'vue'

import Router from 'vue-router'

import generated from '@/components/LandingPage'
import config from '@/components/config'
import demo from '@/components/demo'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'landing-page',
      component: generated
    }, {
      path: '/demo',
      name: 'demo',
      component: demo
    },
    {
      path: '/config',
      component: config
    }, {
      path: '*',
      redirect: '/'
    }
  ]
})
