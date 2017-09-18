import Vue from 'vue'

import App from './App.vue'
import router from './router/index.js'

new Vue({
	el:'#root',
	router,
	template:'<App/>',
	components:{App}
})