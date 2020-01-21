<template>
    <div class='comment-item clear'>
        <img :src="comment.avatar" class='avatar'/>
        <div class='comment-detail'>
            <div class='comment-author'>{{ comment.author }}</div>
            <p class='comment-content'>{{ comment.content }}</p>

            <div class='replay-to' v-if="comment.reply_to">
                <div>// {{ comment.reply_to.author }}: {{ comment.reply_to.content }}</div>
            </div>

            <div class='comment-other clear'>
                <span class='time'>{{ formatTime(comment.time) }}</span>
                <div class='comment-judge'><i class="fa fa-comment-o"></i></div>
                <div class='comment-like'><span>{{ comment.likes }}</span><i class="fa fa-thumbs-o-up"></i></div>
            </div>
        </div>
    </div>
</template>


<script>
    import { formatDate2 } from '../../utils/utils'
    export default {
        props: ['comment'],
        mounted:function () {
        },
        methods: {
            formatTime(time){
                formatDate2(new Date((time+'000')-0))
            }
        }
    }
</script>

<style lang="scss">
    .comment-item{
        border-bottom: 1px solid #eee;
        padding: 14px 0;
    }
    .avatar{
        float: left;
        width: 30px;
        border-radius: 50%;
    }
    .comment-detail{
        margin-left: 44px;
        .comment-author{
            font-weight: 600;
            margin-bottom: 6px;
        }
        .comment-content{
            font-size: 14px;
            margin-bottom: 10px;
            white-space: pre-line;
        }
        .comment-other{
            color: #666;
            font-size: 14px;
            .time{
                font-size: 12px;
            }
        }
        .comment-like{
            cursor: pointer;
            float: right;
            margin-right: 30px;
            span{
                margin-right: 4px;
                font-size: 12px;
            }
        }
        .comment-judge{
            cursor: pointer;
            float: right;
        }
        .replay-to{
            color: #666;
            font-size: 12px;
            margin-bottom: 16px;
        }
    }
</style>
