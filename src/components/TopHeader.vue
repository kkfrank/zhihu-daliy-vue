<template>
	<header class="navbar">
		<slot name="left"></slot>
		<h1 v-show="title!=null" class="navbar-title">{{title}}</h1>
		<slot name="right"></slot>
	</header>
</template>

<script>
	export default{
		props:['title']
	}
</script>

<style lang="scss">
	.navbar{
		position: fixed;
		top: 0;
		left: 0;
		width:100%;
		align-items:center;
		height:50px;
		line-height: 50px;
		background-color: #00a2ea;
		color:#fff;
		z-index: 1;
	}
	.navbar-title{
		float: left;
	    font-size: 17px;
    	font-weight: normal;
		text-align: center;
		width: calc(100% - 80px);
	}
	.navbar-left{
		float: left;
		display: inline-block;
		width: 50px;
		text-align: center;
		cursor: pointer;
		&:hover{
			background-color: #0589c3;
	 	}
	}
	.navbar-right{
		float: right;
		span {
			margin-right: 22px;
		}
	}
	.navbar-right-detail{
		float: right;
		flex:3;
		text-align: right;
	}
</style>