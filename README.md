# zhihu-daliy-vue
知乎日报by vue 

## start

1. 使用nginx反向代理知乎日报的接口,nginx关键代码
```javascript
    proxy_pass https://news-at.zhihu.com;
    add_header 'Access-Control-Allow-Origin' '*';
    add_header 'Referer policy' 'no-referer';
    add_header 'referer' 'https://news-at.zhihu.com';
```
2. install dependencies  
yarn
 
3. serve with hot reload at localhost:9000  
yarn start  

4. build for production with minification  
yarn build

### 主要的技术
vue+vuex+vue-router+webpack

### 知乎API
感谢[ZhihuDailyPurify](https://github.com/izzyleung/ZhihuDailyPurify/wiki/%E7%9F%A5%E4%B9%8E%E6%97%A5%E6%8A%A5-API-%E5%88%86%E6%9E%90)整理了API
