import Vue from 'vue'
import Router from 'vue-router'
import Register from '../components/register.vue'
import Confirm from '../components/confirm.vue'
import Login from '../components/login.vue'
import Main from '../components/main.vue'


Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Register',
      component: Register
    },
    {
    	path: '/confirm',
    	name: 'confirm',
    	component: Confirm,
    	props: true,

    },
    {
    	path: '/login',
    	name: 'login',
    	component: Login
    },
    {
    	path: '/main',
    	name: 'main',
    	component: Main,
    	props: true
    }
  ]
})
