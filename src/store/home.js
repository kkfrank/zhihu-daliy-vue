// import API from '../api/index.js'
import connection from '../utils/connection'

export default {
	state:{
        nowDate: null,
        scrollTop: 0,
        topStoryList: [],
        storyList: [],
	},
	getters:{
	},
	mutations:{
        setLatestNews(state, data){
			state.nowDate = data.date
			state.topStoryList = data.top_stories
            state.storyList.push({...data})
			//state.storyList = [...state.storyList, ...addDateToStory(data.stories, data.date)]
		},
		setBeforeNews(state, data){
            state.nowDate = data.date
            state.storyList.push({...data})
		},
		setNewsListScrollTop(state, data){
			state.scrollTop = data
		},
	},
	actions:{
		getHomeLatest(context){
			document.body.scrollTop=0
            context.commit('showLoading')
			return new Promise((resolve, reject) => {
                connection.get('/news/latest')
                    .then(data => {
                        context.commit('hideLoading')
                        context.commit('setLatestNews', data)
                        // context.dispatch('getBeforeNews')
						resolve(data)
                    })
                    .catch(err => {
                        context.commit('setErrorMsg', err.message)
                        context.commit('hideLoading')
						reject(err)
                    })
			})
		},
		getBeforeNews({state, rootState, commit}){
            const date  = state.nowDate
			const { loading } = rootState.loadingError
			if(loading || !date) {
            	return
			}
			commit('showLoading')
            connection.get(`/news/before/${date}`).then(data=>{
                commit('hideLoading')
				commit('setBeforeNews', data)
			}).catch(err=>{
                commit('setErrorMsg', err.message)
			})
		}
	}
}


function addDateToStory(storyList, date){
    return storyList.map(item=>{
        return {
            ...item,
            date: date
        }
    })
}