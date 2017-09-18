<template>
	<div class="slider-box">
		<div class="slider-inner">
			<router-link :to="'/detail/'+item.id" v-for="item in list">
				<img :src="item.image"/>
			</router-link>
		</div>
	</div>
</template>

<script>
	export default{
		props:['list']
	}
</script>

<style>
	.slider-box{
		width: 100%;
		height: 300px;
		overflow: hidden;
	}
	.slider-box .slider-inner{
		width: 500%;
		height: 100%;
	}
	.slider-box img{
		height: 300px;
    	width: 100%;
	}
</style>