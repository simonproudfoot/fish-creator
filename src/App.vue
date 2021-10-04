<template>
<div id="app">
    <creator v-if="$store.state.view == 'creator'" />
    <attractor v-if="$store.state.view == 'attractor'" />
    <fishtank v-if="$store.state.view == 'fishtank'" />
</div>
</template>

<script>
import creator from "./components/creator.vue";
import attractor from "./components/attractor.vue";
import fishtank from "./components/fishTank.vue";
export default {
    name: "App",
    components: {
        fishtank,
        creator,
        attractor,
    },
    mounted() {
        var saved = JSON.parse(localStorage.getItem('previous'))
        if (saved) {

            saved.forEach((fish, i) => {
                
                if (i < 10) {
                    console.log(i)
                    this.$store.commit('ADD_FISH', fish)
                }
            });
        }
    }
};
</script>

<style>
body {
    margin: 0;
}

#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #06909c;
    margin: 0;
    text-align: center;
    font: normal normal normal 20px/29px Gilroy-Bold;
}

.text {
    margin: auto;
    max-width: 500px;
    padding-top: 100px;
    text-align: left;
}

.index {
    top: 0;
    left: 0;
    position: fixed;
    z-index: 100;
    background-color: black;
}
</style>
