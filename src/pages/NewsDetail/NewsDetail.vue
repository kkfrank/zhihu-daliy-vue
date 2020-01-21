<template>
	<div>
		<TopHeader class="detail-header header">
			<span slot="left" class="navbar-left" @click="goBack">
				<i class="fa fa-chevron-left"></i>
			</span>
			<div slot="right" class="navbar-right-detail">
				<router-link :to="`/details/${storyId}/comments`">
					<i class="fa fa-comment-o"></i>
					<span class="ml-6">{{ extra.commentCount }}</span>
				</router-link>
				<div class="func-btn">
					<i class="fa fa-thumbs-o-up"></i>
					<span>{{ extra.popularityCount }}</span>
				</div>
			</div>
		</TopHeader>

		<div class="detial-box">
			<!--<div v-if="image" class="detail-img-box" :style="{ backgroundImage:'url('+image+')' }">-->
			<div class="detail-img-box">
			    <img :src="image" alt="picture">
				<div class="detail-overlay"></div>
				<h2>{{ title }}</h2>
				<span>{{ imageSource }}</span>
			</div>
			<div v-html='body' class="detail-content-box"></div>
		</div>
	</div>
	
</template>

<script>
	import TopHeader from '../../components/TopHeader'
	import { mapState } from 'vuex'
	export default{
		computed:{
            storyId: function(){
                return this.$route.params.id
            },
            ...mapState({
                body: state => state.newsDetail.body,
                title: state => state.newsDetail.title,
                image: state => state.newsDetail.image,
                imageSource: state => state.newsDetail.imageSource,
                extra: state => state.newsDetail.extra
            })
		},
        beforeRouteEnter(to ,from, next){
            const scrollTop = document.documentElement.scrollTop
			console.log(from)
			next(vm => {
                if(from.path === '/'){// from list page, clear detail data and save before scrollTop postion
                    vm.$store.commit('setNewsListScrollTop', scrollTop)
//                    vm.$store.commit('clearNewsDetail')
                }
			})
		},
        beforeRouteLeave(to, from, next){
            const scrollTop = document.documentElement.scrollTop
            console.log(to)
			let path = to.path
            next(vm => {
                if(path === '/'){
                    console.log('mmmmmmmmmm')
                    vm.$store.commit('clearNewsDetail')
				}
//				if(to.path.test(/^\/details\/[\d]+\/comments/)){// to commnets page, save scrollTop postion
//                    console.log('not clearNewsDetail')
//                    vm.$store.commit('setNewsDetailScrollTop', scrollTop)
//				}else{
//				    console.log('clearNewsDetail')
//                    vm.$store.commit('clearNewsDetail')
//				}
			})
		},
		methods: {
			goBack(){
				this.$router.back()
			}
		},
		created: function(){
			const id= this.$route.params.id
            const { body, scrollTop } = this.$store.state.newsDetail
			console.log('bidy',body)
			if(body){
                document.documentElement.scrollTop = scrollTop
			    return
			}
            document.documentElement.scrollTop = 0
			this.$store.dispatch({ type: "getNewsDetail", id })
			this.$store.dispatch({ type: "getNewsExtra", id })
		},
		mounted: function () {
            //document.documentElement.scrollTop = 0
        },
		destroyed: function () {
		    console.log('newDetail destroyed')
			//this.$store.commit('clearNewsDetail')
        },
		components: {
			TopHeader
		}
	}
</script>


<style lang="scss">
	.detail-header.header{
		.func-btn, a{
			float: left;
			display: inline-block;
			min-width: 50px;
			padding: 1px 16px 0;
			text-align: center;
			height: 100%;
			cursor: pointer;
			color: #fff;
			&:hover{
				background-color: #0589c3;
			}
			.fa{
				color: #fff;
			}
			.fa-comment-o, .fa-thumbs-o-up {
				font-size: 19px;
				font-weight: 700;
			}
			span{
				font-size: 12px;
				margin-top: -2px;
				display: inline-block;
				vertical-align: top;
				margin-left: 4px;
			}
		}
	}

	.detail-box{
		margin-top: 50px;
	}
	.detail-img-box{
		position: relative;
		height: 370px;
		width: 100%;
		&:after{
			 content: "";
			 position: absolute;
			 top: 0;
			 left: 0;
			 width: 100%;
			 height: 100%;
			 background-color: rgba(0,0,0,.05);
			 border-radius: inherit;
			 pointer-events: none;
		 }
		h2{
			position: absolute;
			color: #fff;
			bottom: 50px;
			padding: 0 20px;
			font-size: 22px;
			font-weight: 500;
		}
		span{
			position: absolute;
			right: 20px;
			bottom: 14px;
			color: #eee;
			font-size: 12px;
		}
		img{
			width: 100%;
			height: 100%;
		}
		.detail-overlay{
			background-image: linear-gradient(0,rgba(65,109,122,1),rgba(65,109,122,0.9),rgba(65,109,122,0));
			width: 100%;
			height: 50%;
			position: absolute;
			left: 0;
			bottom: 0;
		}
	}
	.detail-content-box{
		background-color: #fff;
		padding: 18px 18px 30px 18px;
	}
	.detail-content-box .answer .meta{
		padding: 20px 0;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		span{
			vertical-align: middle;
		}
	}
	.detail-content-box .avatar{
		height: 28px;
		width: 28px;
		margin-right: 6px;
		border-radius: 50%;
		display: inline-block;
	}
	.detail-content-box .content p,.detail-content-box .content hr,
	.detail-content-box .content blockquote{
		margin-bottom: 20px;
	}
	.detail-content-box blockquote{
		border-left: 2px solid #63bbe2;
		padding-left: 8px;
	}
	.detail-content-box a{
		color: #01a3ea;
	}
	.detail-content-box .heading{
		color: #999;
		margin-bottom: 6px;
	}
	.detail-content-box .heading-content{
		color: #333;
	}
	.detail-content-box .view-more{
		width: 100%;
		height: 44px;
		border-radius: 22px;
		background: #03a9f4;
		font-size: 14px;
		text-align: center;
		line-height: 44px;
		display: block;
		font-weight: 600;
		color: #fff;
		margin-bottom: 20px;
	}
	.detail-content-box .view-more a{
		color: #fff;
	}
	.detail-content-box  .question-title{
		font-size: 1.2em
	}
	.detail-content-box .content-image{
		width: 100%;
	}
	.navbar-icon .ml-6{
		margin-left:6px
	}
</style>