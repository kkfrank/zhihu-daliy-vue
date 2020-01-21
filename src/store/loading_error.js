import { SHOW_LOADING, HIDE_LOADING, SET_ERROR_MSG, CLEAR_ERROR_MSG} from "../mutation_types/loading_error";

export default{
	state:{
		loading: false,
		errorMsg: ''
	},
	mutations:{
		showLoading(state){
			state.loading = true
            state.errorMsg = ''
        },
		hideLoading(state){
			state.loading = false
		},
        setErrorMsg(state, errorMsg){
			state.errorMsg = errorMsg
            state.loading = false
		},
        clearErrorMsg(state){
            state.errorMsg = ''
        }
	}
}