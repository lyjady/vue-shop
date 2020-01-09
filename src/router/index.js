import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/home',
    component: Home
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  // to将要访问的路径
  // from来自的路径
  // next是一个函数表示放行
  if (to.path === '/login') return next()
  let token = window.sessionStorage.getItem('token')
  if (!token) return next('/login')
  return next()
})

export default router
