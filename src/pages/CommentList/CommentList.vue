<template>
    <div>
        <TopHeader :title ="`${extra.commentCount}条评论`">
        <span slot="left" class="navbar-left" @click="goBack">
            <i class="fa fa-chevron-left"></i>
        </span>
        </TopHeader>
        <div class="comment-box">
            <div class='comment-title' v-if="longCommentList.length > 0">{{ extra.longCommentCount }} 条长评</div>
            <template v-for="item in longCommentList">
                <CommentItem :comment = "item"></CommentItem>
            </template>
            <div class='comment-title' v-if="shortCommentList.length >0">{{ extra.shortCommentCount }} 条短评</div>
            <template v-for="item in shortCommentList">
                <CommentItem :comment = "item"></CommentItem>
            </template>
        </div>
    </div>
</template>

<script>
    import { mapState } from 'vuex'
    import TopHeader from '../../components/TopHeader'
    import CommentItem from './CommentItem.vue'

    import { listenScrollBottom, removeListenScrollBottom } from '../../utils/utils'

    export default {
        computed:{
            storyId: function(){
                return this.$route.params.id
            },
            ...mapState({
                shortCommentList: state => state.commentList.shortCommentList,
                longCommentList: state => state.commentList.longCommentList,
                extra: state => state.newsDetail.extra
            })
        },
        methods: {
            goBack(){
                this.$router.back()
//                this.$store.commit('clearDetailAll')
            }
        },
        created: function(){
            document.documentElement.scrollTop = 0
            this.$store.dispatch({ type: "getLongCommentList", id: this.storyId})
            this.$store.dispatch({ type: "getShortCommentList", id: this.storyId})
            this.$store.dispatch({ type: "getNewsExtra", id: this.storyId })
        },
        mounted: function () {
            var that = this;
            listenScrollBottom(function () {
                that.$store.dispatch({ type: "getShortCommentListBefore", id: that.storyId})
            })
        },
        destroyed: function () {
            console.log('CommentList destroyed')
            this.$store.commit('clearCommentList')
            removeListenScrollBottom();
        },
        components:{
            TopHeader,
            CommentItem
        }
    }
</script>


<style lang="scss">
    .comment-box{
        padding: 50px 10px;
        .comment-title{
            font-size: 14px;
            font-weight: 600;
            margin-top: 10px;
        }
    }
</style>