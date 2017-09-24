import moment from 'moment'
import Vue from 'vue'
import axios from 'axios'
import API from '../constants/index.js'
let today=moment().format('YYYYMMDD')
const homeModule={
	state:{
		//homeTodayData:[],
		//homeBeforeData:[],
		homeList:[]
	},
	getters:{
		/*homeDataList(state){
			console.log('getters',state.fresh)
			if(state.fresh){
				return state.homeTodayData//.concat()
			}
			return state.homeTodayData.concat(state.homeBeforeData)
		},*/
		homeListTillDay(state,getters,rootState){
			const searchDay=rootState.searchDay
			var list= state.homeList.filter(data=>{
				return moment(data.date).valueOf() >= moment(searchDay).valueOf()
			})
			if(list.length===0){//当日没有最新新闻
				if(state.homeList.length===0){
					list= []
				}else{
					list=[state.homeList[0]]
				}
			}
			return list
		}
	},
	mutations:{
		/*setHomeTodayData(state,{data}){
			var temp={...data}
			state.homeList=[temp]
			//Vue.set(state.homeList,0,temp)
		},
		setHomeBeforeData(state,data){
			if(!data){
				//state.homeBeforeData=[]	
				return
			}
			var time=data.date
			for(var i=0,len=state.homeList.length;i<len;i++){
				var item=state.homeList[i]
				if(item.date===time){//此日期的数据已经存在
					state.homeList[i]=data
					return
				}
			}
			console.log('beforeDay',data)
			state.homeList.push({
				...data
			})
		},*/
		setHomeList(state,data){
			if(!data){
				//state.homeBeforeData=[]	
				return
			}
			var time=data.date
			for(var i=0,len=state.homeList.length;i<len;i++){
				var item=state.homeList[i]
				if(item.date===time){//此日期的数据已经存在
					state.homeList[i]=data
					return
				}
			}
			console.log('beforeDay',data)
			state.homeList.push({
				...data
			})
		}
	},

	actions:{
		getHomeListToday(context,getter,rootState){
			let today=moment().format('YYYYMMDD')
			context.commit('hideLeftBar')
			axios.get(API.latestNews)
				.then(data=>{
					/*context.commit('setHomeTodayData',{
						data:data.data,
					})*/
					if(data.data.date!==today){
						context.commit('setSearchDay',data.date)	
					}else{
						context.commit('setSearchDay',today)	
					}

					context.commit('setHomeList',data.data)
					context.commit('setTopBar',{type:"list",name:"首页"})
					context.commit('setLoading',false)
				})
				.catch(err=>{
					context.commit('setLoading',false)
				})
		},
		freshMainList(context){
			context.commit('hideLeftBar')
			axios.get(API.latestNews)
				.then(data=>{
					console.log('axios',data)
					context.commit('setHomeTodayData',data.data)
					/*context.commit('setList',data.data.stories)
					context.commit('setSliderList',data.data.background || data.data.top_stories)*/
					context.commit('setTopBar',{
						type:"list",
						name:"首页"
					})
				})
				.catch(err=>{

				})
		}
	}
}

export default homeModule