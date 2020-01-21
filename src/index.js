import Vue from 'vue'

import App from './App.vue'
import router from './router/index.js'
import store from './store/index.js'

Vue.config.productionTip = true

new Vue({
	el: '#root',
	router,
	store,
	// template: '<App/>',
	// components: { App },
	render: h => h(App)
})