import Vue from 'vue'
import Router from 'vue-router'
import Manning from '@/components/manning'
import test from '@/components/manning_test'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'manning',
      component: Manning 
    },
    {
      path: '/test',
      name: 'manning_test',
      component: test 
    }
  ]
})
