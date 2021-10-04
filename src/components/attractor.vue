<template>
<main>
    <video muted autoplay :src="require('@/assets/attractor.mp4')"></video>
    <img :src="require('@/assets/button_start.svg')" class="start" @click="$store.commit('SET_VIEW', 'creator')" />
</main>
</template>

<script>
export default {

}
</script>

<style>
main {
    background-size: cover;
    background-repeat: no-repeat;
    position: relative;
    width: 1920px;
    height: 1080px;
    background-color: #06909c;
}

.start {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 240px;
    height: 99px;

}
</style>
