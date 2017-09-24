import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import moment from 'moment'

import API from '../constants/index.js'

import home from './home'
import theme from './theme'

Vue.use(Vuex)
const today=moment().format('YYYYMMDD')
function haveItem(list,date){
	for(var i=0;i<list.length;i++){
		if(list[i].date===date){
			return true
		}
	}
	return false
}
const store=new Vuex.Store({
	modules:{
		home,
		theme
	},
	state:{
		loading:true,
		searchDay:today,//知乎日报查询日期：查询2016年11月18日的消息，应为 20161119
		fresh:true,
		detail:[],
		isLeftBarShow:false,
		topBar:{
			type:"list",//list theme detail
			name:"首页"
		},
		editorList:[]
	},
	getters:{
	},
	mutations:{
		setSearchDay(state,day){
			state.searchDay=day
		},
		setLoading(state,loading){
			state.loading=loading
		},
		setTopBar(state,{type,name}){
			state.topBar.type=type
			state.topBar.name=name
		},
		hideLeftBar(state){
			state.isLeftBarShow=false
			document.body.style=""
		},
		showLeftBar(state){
			state.isLeftBarShow=true
			document.body.style="overflow:hidden;padding-right:0px;"
		},
		setDetail(state,data){
			state.detail=data
		},
		setEditorList(state,data){
			state.editorList=data
		},

		scrollBottom(state){

		}
	},
	actions:{
		freshMainList(context){
			context.state.fresh=true
		},
		loadMore(context){
			console.log('load',context.state.loading)
			if(context.state.loading){//正在加载
				console.log('loading......')
				return
			}
			var type=context.state.topBar.type
			//const beforeDay=moment(context.state.searchDay,"YYYYMMDD").subtract(1,'days').format('YYYYMMDD')
			/*const have=context.state.homeBeforeData.some(data=>data.date===beforeDay)
			context.state.fresh=false
			if(have){
				console.log(beforeDay+"have load before")
				context.commit('setHomeBeforeData',beforeDay)
				return
			}*/
			var url="",list=[],
				searchDay=context.state.searchDay
			if(type==="list"){
				list=context.state.home.homeList
				//searchDay=list[list.length-1].date
				//console.log('searchDay',searchDay)
				var url=API.getNewsByDate(searchDay)
			}else{
				var id=this.$route.params.id
				list=context.state.theme.themeList[id]
				//searchDay=list[list.length-1].date
				url=API.getThemeListByDate(id,searchDay)
			}
			context.state.searchDay=moment(searchDay,"YYYYMMDD").subtract(1,'days').format('YYYYMMDD')
			if(haveItem(list,context.state.searchDay)){//已经存在
				return
			}
			axios.get(url)
				.then(data=>{
					if(type==="list"){
						context.commit('setHomeList',data.data)
					}else{
						context.commit('setThemeList',data.data)	
					}
					
					//context.state.searchDay=moment(context.state.searchDay,"YYYYMMDD").subtract(1,'days').format('YYYYMMDD')
					context.state.loading=false
				})
				.catch(err=>{
					console.log(err)
					context.state.loading=false
				})
			
		},
/*		getHomeListBefore(context){
			context.commit('hideLeftBar')
			axios.get(API.getNewsByDate())

		},*/
/*		getHomeListToday(context){
			context.commit('hideLeftBar')
			context.state.fresh=true
			context.state.searchDay=today
			axios.get(API.latestNews)
				.then(data=>{
					console.log('home',data)
					context.commit('setHomeTodayData',data.data)
					context.commit('setHomeBeforeData',null)
					context.commit('setTopBar',{
						type:"list",
						name:"首页"
					})
					context.state.loading=false
				})
				.catch(err=>{
					context.state.loading=false
				})
		},*/
/*		getThemeList(context,{id}){
			context.commit('hideLeftBar')
			axios.get(API.themesIDList+id)
				.then(data=>{
					console.log('axios',data)
					context.commit('setList',data.data.stories)
					context.commit('setEditorList',data.data.editors)
					context.commit('setSliderList',data.data.background || data.data.top_stories)

					context.commit("setTopBar",{
						type:"theme",
						name:data.data.name
					})
				})
				.catch(err=>{

				})
		}*/
	}
})

export default store