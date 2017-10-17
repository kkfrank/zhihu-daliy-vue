<template>
	<div>
		<TopHeader title="主编">
			<span slot="left" class="navbar-left" @click="routerBack">
				<icon name="arrow-left"></icon>
			</span>
		</TopHeader>
		<div class="editor-box">
			<!-- <router-link :to="'editor/'+item.id" v-for="item in editorList" :key="item.id" class="editor-item"> -->
		<!-- 	<a  @click.prevent="jumpDetail" v-for="item in editorList" class="editor-item" :data-href="getEditor(item.id)"> -->
			<a :href="getEditor(item.id)" target="_blank" v-for="item in editorList" class="editor-item">
				<div><img :src="item.avatar.replace('http:','https:')"/></div>
				<div class="editor-profile">
					<div>{{item.name}}</div>
					<p>{{item.bio}}</p>
				</div>
			</a>
			<!-- </router-link> -->
		</div>
	</div>
</template>

<script>
	import  Api from '../api/'
	import TopHeader from '../components/TopHeader'
	export default{
		created:function(){
			if(this.editorList.length===0){//没有则跳转到主页，停留在当前页面刷新，会导致length为0
				this.$router.push({path:"/"})
			}
		},
		methods:{
			getEditor:Api.getEditor,
			routerBack(){
				this.$router.back()
			}
		},
		computed:{
			editorList:function(){
				return this.$store.state.editorList
			}
		},
		components:{
			TopHeader
		}
	}
</script>

<style>
	.editor-box{
		position: absolute;
	    top: 50px;
	    width: 100%;
	}
	.editor-item {
	    display: flex;
        padding: 10px;
    	border-bottom: 1px solid #ddd;
	}
	.editor-item img{
		width: 56px;
	    height: 56px;
	    border-radius: 50%;
	}
	.editor-profile{
		margin-left: 10px;
	}
	.editor-profile div {
	    margin-top: 4px;
	}
	.editor-profile p {
	    margin-top: 10px;
	    font-size: 14px;
	    color: #333;
	}

</style>