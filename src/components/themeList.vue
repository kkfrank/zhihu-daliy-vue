<template>
	<div class="list-box">
			<router-link to="/editors" class="list-title">
				<h3>主编</h3>
				<img v-for="item in newList.editors" :src="item.avatar.replace('http:','https:')"></img>
			</router-link>

			<ul>
				<li v-for="item in newList.stories">
					<router-link :to="'/detail/'+item.id">
						<span>{{item.title}}</span>
						<img v-if="item.images" v-bind:src="item.images && item.images[0].replace('http:','https:')">
					</router-link>
				</li>
			</ul>	
	</div>
</template>

<script>
	import moment from 'moment'
	require('es6-promise').polyfill();
	export default{
		data(){
			return{
				today:moment().add(0,'days').format('YYYYMMDD')
			}
		},
		computed:{
			newList(){
				var data={...this.list[0]}
				for(var i=1,item;item=this.list[i++];){
					data.stories=data.stories.concat(item.stories)
				}
				return {...data}
			},
		},
		props:['list'],
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
	.list-box .list-title{
	    display: flex;
	    height: 40px;
	    line-height: 40px;
	    padding-left: 20px;
	    align-items: center;
	}
	.list-box .list-title{
		font-weight: normal;
	    color: #333;
       font-size: 16px;
	}
	.list-box .list-title img{
		width: 24px;
	    height: 24px;
	    vertical-align: middle;
	    border-radius: 50%;
	    margin-left: 10px;
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
	.list-box ul img{
		/*flex:1;*/
		width: 80px;
		height: 80px;
	}
</style>