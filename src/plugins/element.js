import Vue from 'vue'
// eslint-disable-next-line import/no-duplicates
import { Button } from 'element-ui'
// eslint-disable-next-line import/no-duplicates
import { FormItem } from 'element-ui'
// eslint-disable-next-line no-unused-vars,import/no-duplicates
import { Form } from 'element-ui'
// eslint-disable-next-line no-unused-vars,import/no-duplicates
import { Input } from 'element-ui'
// eslint-disable-next-line import/no-duplicates
import { Message, Container, Aside, Main, Header, Menu, Submenu, MenuItem } from 'element-ui'

Vue.use(Button)
Vue.use(FormItem)
Vue.use(Form)
Vue.use(Input)
Vue.use(Container)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Header)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.prototype.$message = Message
