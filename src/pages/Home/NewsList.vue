<template>
	<div class="list-box">
		<div v-for="(data, index) in list">
			<h3 class="list-title">
				{{ index===0 ? '' : data.date }}
			</h3>
			<ul>
				<li v-for="item in data.stories">
					<router-link :to="`/details/${item.id}`">
						<span>{{ item.title }}</span>
						<img v-if="item.images" v-bind:src="item.images[0]">
					</router-link>
				</li>
			</ul>	
		</div>
	</div>
</template>

<script>
	export default{
        props:['list']
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