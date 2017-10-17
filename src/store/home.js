import API from '../api/index.js'

const homeModule={
	state:{
		homeList:[]
	},
	getters:{
	},
	mutations:{
		setHomeList(state,data){
			if(!data){
				return
			}
			state.homeList.push({
				...data
			})
		},
		setHomeLatest(state,data){
			state.homeList=[data]
		}
	},
	actions:{
		getHomeLatest(context){
			context.commit('setTopBar',{type:"list",name:"首页"})
			document.body.scrollTop=0
			API.getHomeLatest()
				.then(data=>{
					context.commit('setLoading',false)
					context.commit('setHomeLatest',data)
				})
				.catch(err=>{
					context.commit('setLoading',false)
				})
		}
	}
}

export default homeModule