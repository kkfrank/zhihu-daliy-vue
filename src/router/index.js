import Vue from 'vue'
import VueRouter from 'vue-router'

import Home from '../pages/Home/Home.vue'
import NewsDetail from '../pages/NewsDetail/NewsDetail.vue'
import CommentList from '../pages/CommentList/CommentList.vue'
import About from '../components/About.vue'

Vue.use(VueRouter)

const routes=[{
	path: '/about',
	component: About
},{
	path: '/details/:id',
	component: NewsDetail
},{
	path: '/details/:id/comments',
    component: CommentList
},{
	path:'/',
	component: Home
}]

export default new VueRouter({
	routes
})
