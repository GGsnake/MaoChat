import Vue from 'vue'
import App from './App'

import store from './store'

Vue.config.productionTip = false

Vue.prototype.$store = store
// Vue.prototype.base="http://47.100.187.103:8111"
// Vue.prototype.wss="ws://47.100.187.103:8111"
Vue.prototype.wss="ws://192.168.0.109:8111"
Vue.prototype.base="http://192.168.0.109:8111"
App.mpType = 'app'

const app = new Vue({
	store,
    ...App
})
app.$mount()

