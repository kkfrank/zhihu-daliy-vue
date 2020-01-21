<template>
    <div class="loading" v-show="loading"></div>
</template>

<script>
    export default {
        props: ['loading']
    }
</script>

<style>
    .loading{
        position: fixed;
        width: 40px;
        height: 40px;
        z-index: 1;
        left: 44%;
        top: 46%;
        border: 4px solid #00a2ea;
        border-radius: 50%;
        border-right: 4px solid transparent;
        border-top: 4px solid transparent;
        transform: rotate(45deg);
        animation: rotate .6s infinite linear;
        margin-top: 10px;
    }
    @keyframes rotate{
        from {
            transform: rotate(45deg);
        }
        to{
            transform: rotate(405deg);
        }
    }
</style>