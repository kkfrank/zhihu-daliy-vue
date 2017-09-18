import Vue from 'vue'
import VueRouter from 'vue-router'

import Home from '../views/Home.vue'
import Detail from '../views/Detail.vue'
import About from '../components/About.vue'

Vue.use(VueRouter)

const routes=[{
	path:'/',
	component:Home
},{
	path:'/about',
	component:About
},{
	path:'/detail/:id',
	component:Detail
}]

export default new VueRouter({
	routes
})
