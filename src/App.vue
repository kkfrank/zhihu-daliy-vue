<template>
	<div>
		<header class="navbar">
			<icon name="bars" scale=1 class="navbar-icon"></icon> 
			<span class="navbar-span-title">首页</span>
			<icon name="bell-o" scale=1 class="navbar-icon"></icon> 
			<icon name="ellipsis-v" scale=1 class="navbar-icon"></icon> 
		</header>
		<router-view></router-view>
	</div>
</template>

<script>
	import 'vue-awesome/icons'
	//import Icon from 'vue-awesome/components/Icon'
	import Icon from 'vue-awesome/components/Icon.vue'
	//Vue.component('icon',Icon)
	import Home from './views/Home.vue'

	export default{
		data(){
			return{
				msg:"hello world"
			}
		},
		components:{
			Icon,
			Home
		}
	}
</script>

<style lang="scss">
	html,body{
		width: 100%;
		height:100%;
	}
	*{
		margin: 0;
		padding: 0;
		box-sizing:border-box;
	}
	h1{
		color:red;
	}
	.navbar{
		position: absolute;
		top: 0;
		left: 0;
		width:100%;
		display: flex;
		align-items:center;
		height:50px;
		background-color: #00a2ea;
		color:#fff;
		z-index: 1;
	}
	.navbar-span-title{
		flex:6;
	}
	.navbar-icon{
		flex:1;
	}
</style>