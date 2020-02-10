import Vue from 'vue'
import VueRouter from 'vue-router'

// import Home from '../pages/Home/Home.vue'
// import NewsDetail from '../pages/NewsDetail/NewsDetail.vue'
// import CommentList from '../pages/CommentList/CommentList.vue'
// import About from '../components/About.vue'

// Vue组件异步加载，配合webpack code splitting使用, 只需在webpack中配置chunkFilename即可
// /* webpackChunkName: "news" */ 这个表示把相同的webpackChunkName的所有组件都打包到同个文件中, 这里打包了3个文件
// news.js   comments.js   和一个没有指定名称的about组件文件
const Home = () => import(/* webpackChunkName: "news" */ '../pages/Home/Home.vue')
const NewsDetail = () => import(/* webpackChunkName: "news" */ '../pages/NewsDetail/NewsDetail.vue')
const CommentList = () => import(/* webpackChunkName: "comments" */ '../pages/CommentList/CommentList.vue')

const About = () =>  import('../components/About.vue')

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
