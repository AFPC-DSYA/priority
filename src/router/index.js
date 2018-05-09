import Vue from 'vue'
import Router from 'vue-router'
import Manning from '@/components/manning'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'manning',
      component: Manning 
    }
  ]
})
