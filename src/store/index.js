import Vue from 'vue'
import Vuex from 'vuex'

import axios from 'axios'
const store=new Vuex.Store({
	state:{
		list:[],
		detail:[]
	},
	mutations:{
		setList(state,data){
			state.list=data
		},
		setDetail(state,data){
			state.detail=data
		}
	},
	actions:{
		getList(context){
			axios.get('http://127.0.0.1:9001/api/4/news/latest')
				.then(data=>{
					context.commit('setList',data)
				})
				.catch(err=>{

				})
		}
	}
})

export default store