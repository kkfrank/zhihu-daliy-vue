import Vue from 'vue'
import Vuex from 'vuex'
import moment from 'moment'

import API from '../api/index.js'
import home from './home'
import theme from './theme'
import detail from './detail'

Vue.use(Vuex)
const store=new Vuex.Store({
	modules:{
		home,
		theme,
		detail
	},
	state:{
		loading:false,
		//searchDay:today,//知乎日报查询日期：查询2016年11月18日的消息，应为 20161119
		isLeftBarShow:false,
		topBar:{
			type:"",//list;theme;detail
			name:""
		},
		prevScrollTop:0,//保存列表进入详情页面之前的scrollTop值
		editorList:[]
	},
	getters:{
	  
	},
	mutations:{
		setScrollTop(state){
			document.body.scrollTop=state.prevScrollTop
		},
		setLoading(state,loading){
			state.loading=loading
		},
		setTopBar(state,data){
			state.topBar.type=data.type
			data.name && (state.topBar.name=data.name)
		},
		hideLeftBar(state){
			state.isLeftBarShow=false
			document.body.style=""
		},
		showLeftBar(state){
			state.isLeftBarShow=true
			document.body.style="overflow:hidden;padding-right:0px;"
		},
		setEditorList(state,data){
			state.editorList=data
		}
	},
	actions:{
	/*	freshMainList(context){
			context.state.fresh=true
		},*/
		loadMore(context,{id}){//下拉加载更多
			if(context.state.loading){//正在加载
				console.log('loading......')
				return
			}
			context.commit('setLoading',true)
			var type=context.state.topBar.type
			var url="",list=[];
			if(type==="list"){//主页加载更多
				var list=context.state.home.homeList
				var beforeDate=list[list.length-1].date//知乎api查询日期需+1
				API.getNewsByDate(beforeDate)
					.then(data=>{
						context.commit('setLoading',false)
						context.commit('setHomeList',data.data)
					})
					.catch(err=>{
						context.commit('setLoading',false)
					})
			}else{
				var list=context.state.theme.themeList[id]
			    var stories=list[list.length-1].stories
			    var beforeId=stories[stories.length-1].id
			    API.getThemeListByDate(id,beforeId)
					.then(data=>{
						context.commit('setThemeList',{
							type:id,
							data:data.data
						})	
						context.commit('setLoading',false)
					})
					.catch(err=>{
						console.error('error',err)
						context.commit('setLoading',false)
					})
			}
		}
	}
})

export default store