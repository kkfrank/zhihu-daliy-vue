import API from '../api/index.js'

const moduleTheme={
	state:{
		themeTypes:[],
		themeList:{
			2:[],//开始游戏
			3:[],//电影日报
			4:[],//设计日报
			5:[],//大公司日报
			6:[],//财经日报
			7:[],//音乐日报
			9:[],//动漫日报
			8:[],//体育日报
			10:[],//互联网安全
			11:[],//不许无聊
			12:[],//用户推荐日报
			13:[]//日常心理学
		},
		//editorList:[]
	},
	getters:{
	},
	mutations:{
		setThemeTypes(state,data){
			state.themeTypes=data
		},
		setThemeList(state,{type,data,fresh}){
			if(fresh){//刷新
				state.themeList[type]=[{...data}]
			}else{
				state.themeList[type].push({...data})	
			}
		}
	},
	actions:{
		getThemesTypes(context){
			API.getThemesTypes()
				.then(data=>{
					context.commit('setThemeTypes',data.data.others)
				})
				.catch(err=>{
					console.error(err)
				})
		},
		getThemeListNow(context,{id},rootState,rootGetters){
			context.commit('hideLeftBar')
			context.commit('setLoading',true)
			//context.commit('setPrevScrollTop',0)
			document.body.scrollTop=0
			API.getThemeListNow(id)
				.then(data=>{
					context.commit('setThemeList',{
						type:id,
						data:data.data,
						fresh:true
					})
					context.commit('setTopBar',{
						type:'theme',
						name:data.data.name
					})
					context.commit('setEditorList',data.data.editors)
					context.commit('setLoading',false)
				})
				.catch(err=>{
					context.commit('setLoading',false)
				})
		}
	}
}
export default moduleTheme