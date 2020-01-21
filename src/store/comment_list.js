import connection from '../utils/connection'

export default {
    state: {
        shortCommentList: [],
        longCommentList: []
    },
    mutations: {
        setShortCommentList(state, data){
            state.shortCommentList = data
        },
        setLongCommentList(state, data){
            state.longCommentList = data
        },
        setShortCommentListBefore(state, data){
            state.shortCommentList = [...state.shortCommentList, ...data]
        },
        setLongCommentListBefore(state, data){
            state.longCommentList = [...state.longCommentList, ...data]
        },
        clearCommentList(state){
            state.shortCommentList = []
            state.longCommentList = []
        }
    },
    actions: {
        getShortCommentList({commit, dispatch}, { id }){
            commit('showLoading')
            connection.get(`/story/${id}/short-comments`).then(data=>{
                commit('hideLoading')
                commit('setShortCommentList', data.comments)
            }).catch(err=>{
                commit('hideLoading')
                commit('setErrorMsg', err.message)
            })
        },
        getLongCommentList({commit, dispatch}, { id }){
            commit('showLoading')
            connection.get(`/story/${id}/long-comments`).then(data=>{
                commit('hideLoading')
                commit('setLongCommentList', data.comments)
            }).catch(err=>{
                commit('hideLoading')
                commit('setErrorMsg', err.message)
            })
        },
        getShortCommentListBefore({commit, dispatch, state, rootState}, { id }){
            const { loading } = rootState.loadingError
            if(loading) {
                return
            }

            commit('showLoading')
            let lastCommentId = state.shortCommentList[state.shortCommentList.length-1].id
            connection.get(`/story/${id}/short-comments/before/${lastCommentId}`).then(data=>{
                commit('hideLoading')
                commit('setShortCommentListBefore', data.comments)
            }).catch(err=>{
                commit('hideLoading')
                commit('setErrorMsg', err.message)
            })
        },
        getLongCommentListBefore({commit, dispatch, state, rootState}, { id }){
            const { loading } = rootState.loadingError
            if(loading) {
                return
            }
            commit('showLoading')
            let lastCommentId = state.longCommentList[state.shortCommentList.length-1].id
            connection.get(`/story/${id}/long-comments/before${lastCommentId}`).then(data=>{
                commit('hideLoading')
                commit('setLongCommentListBefore', data.comments)
            }).catch(err=>{
                commit('hideLoading')
                commit('setErrorMsg', err.message)
            })
        }
    }
}