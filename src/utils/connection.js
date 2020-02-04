import axios from 'axios'

const corsUrl = 'https://cors-anywhere.herokuapp.com/'
//https://news-at.zhihu.com/api/4/news/latest
let BaseUrl = 'http://127.0.0.1:9001/api/4'
if(process.env.NODE_ENV === 'production'){
    BaseUrl = corsUrl + 'https://news-at.zhihu.com/api/4'
}

export default {
    get(url, params = {}){
        return new Promise((resolve, reject) => {
            axios.get(BaseUrl + url,{ params: params}).then( res => {
                resolve(res.data)
            }).catch( err => {
                reject(err)
            })
        })
    },
    post(url){
        return new Promise((resolve, reject) => {
            axios.post(BaseUrl + url).then( res => {
                resolve(res.data)
            }).catch( err => {
                reject(err)
            })
        })
    }
}

// export default {
//     post(url, data, params){
//         return new Promise((resolve, reject) => {
//              fetch(BaseUrl + url, { method: 'POST' })
//                 .then(res => resolve(res.json()))
//                 .catch(err => {
//                     reject({
//                         message: err
//                     })
//                 })
//         })
//     },
//     get(url, params = {}){
//         return new Promise((resolve, reject) => {
//             fetch(BaseUrl + url, { method: 'GET' })
//                 .then(res => resolve(res.json()))
//                 .catch(err => reject({ message: err }))
//         })
//     }
// }





