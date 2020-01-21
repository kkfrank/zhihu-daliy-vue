import Vue from 'vue'
import Vuex from 'vuex'

import home from './home'
import newsDetail from './news_detail'
import loadingError from './loading_error'
import commentList from './comment_list'

Vue.use(Vuex)

const store=new Vuex.Store({
	modules:{
		home,
        newsDetail,
        commentList,
        loadingError
	},
	// state:{
	// 	loading:false,
	// },
	// mutations:{
	// 	setScrollTop(state){
	// 		document.body.scrollTop=state.prevScrollTop
	// 	},
	// 	setLoading(state,loading){
	// 		state.loading=loading
	// 	}
	// }
})

export default store