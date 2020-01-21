<template>
    <div class="modal-box" v-show="visible">
        <div class="modal-mask" v-on:click="handleCancel"></div>
        <div class="modal-content"  tabIndex='0' v-on:keydown="handleKeyDown">
            <div class='modal-header'>
                {{ title || defaultTitle }}
                <i v-on:click="handleCancel" class='right'>x</i>
            </div>
            <div class='modal-body'>
                <slot name="content"></slot>
            </div>
            <div class='modal-footer'>
                <button v-on:click="handleCancel" class='btn default mr10'>取消</button>
                <button v-on:click="handleOk" :class="`btn ${confirmLoading ? 'disabled' : ''}` ">确定</button>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        props: ['visible', 'title', 'confirmLoading'],
        methods: {
            handleOk(){
                this.$emit('on-ok','')
            },
            handleCancel(){
                this.$emit('on-cancel','')
            },
            handleKeyDown(event){
                if(event.keyCode === 27){// esc
                    this.handleCancel();
                }
            }
        },
        data: function () {
            return {
                defaultTitle: '提示'
            }
        }
    }
</script>

<style lang="scss">
    .modal-box{
        position: fixed;
        z-index: 9999;
        .modal-mask{
            position: fixed;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            height: 100%;
            background-color: rgba(0,0,0,0.45);
        }
        .modal-content{
            position: fixed;
            left: 50%;
            top: 50%;
            min-width: 280px;
            max-width: 500px;
            background-color: #fff;
            border-radius: 4px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            margin-top: -100px;
            transform: translate(-50%);
            outline: 0;
        }
        .modal-header{
            padding: 16px 24px;
            border-bottom: 1px solid #e8e8e8;
            i{
                cursor: pointer;
                position: absolute;
                right: 0;
                top: 0;
                padding: 10px 18px;
                font-size: 20px;
            }
        }
        .modal-body{
            padding: 24px;
        }
        .modal-footer{
            padding: 10px 16px;
            text-align: right;
        }
    }
</style>