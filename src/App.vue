<template>
	<div id="app">
		<Modal :visible = 'errorMsg!==""'  v-on:on-ok="handleOk" v-on:on-cancel="handleCancel">
			<p slot="content"> {{ errorMsg }}</p>
		</Modal>
		<Loading :loading= "loading"></Loading>
		<router-view></router-view>
<!-- 		<router-view name="main"></router-view>
		<router-view name="leftbar"></router-view> -->
	</div>
</template>

<script>
	import Modal from './components/Modal.vue'
    import Loading from './components/Loading.vue'

	export default{
		created(){
		},
		computed: {
		    loading: function () {
                return this.$store.state.loadingError.loading
            },
			errorMsg: function () {
				return this.$store.state.loadingError.errorMsg
            }
		},
		methods: {
            handleOk(){
                this.$store.commit('clearErrorMsg')
			},
            handleCancel(){
                this.$store.commit('clearErrorMsg')
			}
		},
		components: {
            Modal,
            Loading
		}
	}
</script>

<style>
	html,body{
		width: 100%;
		height:100%;
	}
	*{
		margin: 0;
		padding: 0;
		box-sizing:border-box;
	}
	a{
		text-decoration: none;
	}
	li{
		list-style: none;
	}
	.btn{
		color: #fff;
		background-color: #1890ff;
		border: 1px solid #1890ff;
		padding: 6px 12px;
		border-radius: 4px;
		cursor: pointer;
		white-space: nowrap;
		outline: 0;
	}
	.btn:hover{
		color: #fff;
		background-color: #40a9ff;
		border-color: #40a9ff;
	}
	.btn.default{
		background-color: #fff;
		border-color: #d9d9d9;
		color: rgba(0,0,0,0.65);
	}
	.btn.disabled{
		color: rgba(0,0,0,0.25);
		background-color: #f5f5f5;
		border-color: #d9d9d9;
		cursor: not-allowed;
	}
	.hide{ display: none; }
	.clear:after { visibility: hidden; display: block; font-size: 0; content: " "; clear: both; height: 0; }
</style>