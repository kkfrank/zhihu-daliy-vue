import Vue from 'vue'
import VueRouter from 'vue-router'

import Home from '../views/Home.vue'
import LeftBar from '../components/LeftBar'
import Theme from '../views/Theme'
import Detail from '../views/Detail.vue'
import EditorList from '../components/EditorList'
import EditorItem from '../components/EditorItem'
import About from '../components/About.vue'

Vue.use(VueRouter)

const routes=[{
	path:'/about',
	component:About
},{
	path:'/detail/:id',
	component:Detail
},{
	path:'/theme/:id',
	component:Theme
},{
	path:'/editors',
	component:EditorList
	
},{
	path:'/editor/:id',
	component:EditorItem
},
{
	path:'/',
	component:Home,
/*	beforeEnter(to,from,next){
		console.log('enter home')
		next()
	}*/
}]

export default new VueRouter({
	routes
})
