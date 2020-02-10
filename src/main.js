import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/css/global.css'
import './assets/fonts/iconfont.css'
import axios from 'axios'
import 'element-ui/lib/theme-chalk/index.css'
import ZkTable from 'vue-table-with-tree-grid'

Vue.config.productionTip = false

Vue.prototype.$http = axios
axios.defaults.baseURL = 'http://127.0.0.1:8081/shop/'
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})

Vue.component(ZkTable.name, ZkTable)

Vue.filter('dateFormat', function (mill) {
  const date = new Date(mill)
  const year = date.getFullYear()
  const month = (date.getMonth() + 1 + '').padStart(2, '0')
  const day = (date.getDay() + '').padStart(2, '0')
  const hour = (date.getHours() + '').padStart(2, '0')
  const minute = (date.getMinutes() + '').padStart(2, '0')
  const second = (date.getSeconds() + '').padStart(2, '0')
  return `${year}-${month}-${day} ${hour}:${minute}:${second}`
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
