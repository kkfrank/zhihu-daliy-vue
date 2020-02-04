<template>
	<div class="container">
		<TopHeader title="知乎日报(建议小屏查看)">
			<div class="navbar-right" slot="right">
			</div>
		</TopHeader>
		<div class="main">
			<Slider :list="sliderList" :defaultActive="0"></Slider>
			<NewsList :list="newsList"></NewsList>
		</div>
	</div>
</template>

<script>
	import TopHeader from '../../components/TopHeader'
    import Slider from './Slider.vue'
	import NewsList from './NewsList.vue'
    import { listenScrollBottom, removeListenScrollBottom } from '../../utils/utils'

	export default{
		created: function(){
            let that= this
			if(this.newsList.length > 0){
                return
			}
			this.$store.dispatch({ type: "getHomeLatest"}).then(()=>{
                that.$store.dispatch({ type: 'getBeforeNews' })
			}).catch(err => {
			    console.log('errrrrr',err)
			})
		},
	    mounted: function () {
			let that=this
            document.documentElement.scrollTop = this.scrollTop
            listenScrollBottom(function () {
                console.log('to bttom')
                that.$store.dispatch({ type: "getBeforeNews" })
            })
        },
		destroyed: function () {
            removeListenScrollBottom()
        },
	 	methods: {

		},
		components: {
			TopHeader,
            Slider,
            NewsList
		},
		computed: {
		    scrollTop(){
		      return this.$store.state.home.scrollTop
			},
			newsList(){
                return this.$store.state.home.storyList
			},
			sliderList(){
			    return this.$store.state.home.topStoryList
			}
		}
	}
</script>

<style>
	
</style>