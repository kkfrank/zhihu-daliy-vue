<template>
	<div class="list-box">
		<h3>今日新闻</h3>
		<ul>
			<li v-for="item in list">
				<router-link :to="'detail/'+item.id">
					<span>{{item.title}}</span>
					<img v-bind:src="item.images && item.images[0]">
				</router-link>
			</li>
		</ul>	
	</div>
	

</template>

<script>
	import axios from 'axios'
	import logo from '../assets/logo.png'
	require('es6-promise').polyfill();
	export default{
		data(){
			return{
				url:logo,
				//list:[]
			}
		},
		props:['list'],
		components:{
			//logo
		}
	}
</script>

<style>
	a{
		text-decoration: none;
		color: #000;
	}
	.list-box{
		background-color:#eee;
	}
	.list-box h3{
		font-weight: normal;
	    color: #333;
	    height: 40px;
	    line-height: 40px;
	    font-size: 16px;
	    margin-left: 20px;
	}
	.list-box ul{
		display: flex;
		flex-direction:column;
	}
	.list-box li{
		display: flex;
		padding: 10px;
	    background-color: #fff;
	    margin: 8px;
	}
	.list-box li a{
		display: flex;
		flex:1;
	}
	.list-box span{
		flex:1;
		padding-right: 10px;
	}
	.list-box img{
		/*flex:1;*/
		width: 80px;
		height: 80px;
	}
</style>