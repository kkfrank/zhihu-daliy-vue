<template>
	<div class="slider-box">
		<div class="slider-inner" :style="{width:list.length+'00%',left: leftPostion}">
			<router-link :to="'/details/'+item.id" v-for="item in list" :key="item.id" class="slider-link" :style="{backgroundImage:'url('+item.image+')'}">
				<!-- <img :src="item.image"/> -->
				<div class="detail-overlay"></div>
				<h3>{{item.title}}</h3>
			</router-link>
		</div>
		<ul class="slider-nums">
			<li v-for="i in list.length" :class="{ on: active === i-1 }" v-on:click = 'jumpTo(i-1)'></li>
		</ul>
	</div>
</template>

<script>
    import { addTouchEvent } from '../../utils/utils'

	export default{
		props:['list', "defaultActive"],
        data(){
            return{
                active: this.defaultActive
            }
        },
		mounted: function () {
            let that = this;
            addTouchEvent(document.querySelector('.slider-box'), function (event) {
                if(event.type === 'touchend'){
					if(event.directionX === 'left'){
                        if(that.active === that.list.length - 1){
                            return
                        }
                        that.active = that.active + 1
					}else if(event.directionX === 'right'){
                        if(that.active === 0){
                            return
                        }
                        that.active = that.active - 1
					}
                }
            })
        },
		computed:{
            leftPostion: function(){
				return -(this.active * 100) + '%'
			}
		},
		methods:{
            jumpTo(page){
                this.active = page
			}
		}
	}
</script>

<style>
	.slider-box{
		position: relative;
		width: 100%;
		height: 300px;
		overflow: hidden;
		margin-top: 50px;
	}
	.slider-box .slider-inner{
		position: absolute;
		/*width: 500%;*/
		height: 100%;
	}
	.slider-box img{
		height: 300px;
    	width: 100%;
	}
	.slider-inner .slider-link{
	    display: flex;
    	justify-content: center;
	    position: relative;
		float: left;
		width: 20%;
		height: 100%;
		background-size: 100% 100%;
	}
	.slider-link div{
		width: 100%;
		height: 100%;
	}
	.slider-link h3{
	    position: absolute;
	    bottom: 26px;
	    color: #fff;
	    padding: 0 20px;
	}
	.slider-nums{
		position: absolute;
	    bottom: 10px;
	    right: 50%;
	    transform: translate(50%,0);
	}
	.slider-nums li{
		width: 8px;
	    height: 8px;
	    border-radius: 50%;
	    background-color: #aaa;
	    float: left;
	    list-style: none;
	    margin: 0 4px;
	}
	.slider-nums li.on{
	    background-color: #fff;
	}
</style>