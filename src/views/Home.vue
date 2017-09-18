<template>
	<div>
		<Slider :list="topList"></Slider>
		<list :list="list"></list>
	</div>
</template>

<script>
	import Slider from '../components/Slider.vue'
	import List from '../components/List.vue'
	import axios from 'axios'
	export default{
		components:{
			Slider,
			List
		},
		data(){
			return{
				topList:[],
				list:[]
			}
		},
		created:function(){
			console.log('me')
		    this.getNews()
		  },
		  methods:{
		      getNews:function(){
		        axios.get('http://127.0.0.1:9001/api/4/news/latest')
		          .then(data=>{
		          	this.topList=data.data.top_stories
		          	this.list=data.data.stories
		            console.log(data)
		          })
		          .catch(err=>{
		            console.log(err)
		          })

		      }
		  }
	}
</script>

<style>
	
</style>