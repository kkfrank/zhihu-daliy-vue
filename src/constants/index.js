//https://news-at.zhihu.com/api/4/news/latest

const BaseUrl="http://127.0.0.1:9001"
const latestNews=BaseUrl+'/api/4/news/latest'
const newsDetail=BaseUrl+'/api/4/news/'
//知乎日报的生日为 2013 年 5 月 19 日，若 before 后数字小于 20130520 ，只会接收到空消息
//若果需要查询 11 月 18 日的消息，before 后的数字应为 20131119
const beforNews=BaseUrl+'/api/4/news/before/' 

const themes=BaseUrl+'/api/4/themes'
const themesList=BaseUrl+'/api/4/theme/'
export default{

}