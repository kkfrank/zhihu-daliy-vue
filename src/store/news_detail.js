import connection from '../utils/connection'


export default {
	state: {
	    scrollTop: 0,
        body: '',
        title: '',
        image: '',
        imageSource: '',
        extra: {
            commentCount: 0,
            longCommentCount: 0,
            shortCommentCount:0,
            popularityCount: 0
        }
    },
	mutations:{
		setNewsDetail(state, data){
			state.body = data.body
            state.title = data.title
            state.image = data.image
            state.imageSource = data.imageSource
            state.body = data.body
		},
		setNewsExtra(state, data){
            state.extra.longCommentCount = data.long_comments
            state.extra.shortCommentCount = data.short_comments
            state.extra.commentCount = data.comments
            state.extra.popularityCount = data.popularity
		},
        setNewsDetailScrollTop(state, data){
		    console.log(',setNewsDetailScrollTop', data)
		  state.scrollTop = data
        },
        clearNewsDetail(state){
            state.body = ''
            state.title = ''
            state.image = ''
            state.imageSource = ''
            state.extra.commentCount = 0
            state.extra.longCommentCount = 0
            state.extra.longCommentCount = 0
            state.extra.popularityCount = 0
        }
	},
	actions:{
		getNewsDetail({ commit },{ id }){
            commit('showLoading')
            connection.get(`/news/${id}`).then(data=>{
                commit('hideLoading')
                commit('setNewsDetail', data)
            }).catch(err=>{
                commit('hideLoading')
                commit('setErrorMsg', err.message)
            })
		},
		getNewsExtra({ commit },{ id }){
            commit('showLoading')
            connection.get(`/story-extra/${id}`).then(data=>{
                commit('hideLoading')
                commit('setNewsExtra', data)
            }).catch(err=>{
                commit('hideLoading')
                commit('setErrorMsg', err.message)
            })
		}
	}
}
