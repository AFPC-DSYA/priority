import Vue from 'vue'
import Router from 'vue-router'
import Manning from '@/components/manning'
import AFSC from '@/components/afscManning'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'manning',
      component: Manning 
    },
    {
        path: '/afsc',
        name: 'afsc',
        component: AFSC
    }
  ]
})
