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
@font-face {
    font-family: "Gilroy-Bold";
    src: local("Gilroy-Bold.woff"), url('./fonts/Gilroy-Bold.woff') format("woff");
}

@font-face {
    font-family: "Gilroy-Regular";
    src: local("Gilroy-Regular.woff"), url('./fonts/Gilroy-Regular.woff') format("woff");
}

.button {
    padding: 0 1.1em;
    font-size: 40px;
    color: #fff;
    display: block;
    font-family: "Gilroy-Bold";
    height: 91px;
    line-height: 91px;
    width: auto;
    border-radius: 20px;
    position: relative;

}

.button::after {
    content: '';
    width: 50px;
    background-color: red;
    height: 300px;
    top: 0;
    left: 0;
    display: inline;

}

.button.small {
    height: 57px;
    line-height: 57px;
    font-size: 30px;
}

.button.green {
    background-color: #82bd55
}

.button.orange {
    background-color: #e8a720;
}

.button.aqua {
    background-color: #4AB7C5
}

body {
    margin: 0;
}

#app {
    font-family: 'Gilroy-Regular', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #06909c;
    margin: 0;
    text-align: center;
    font-size: 20px;

}

h1,
h2,
h3 {
    font-family: 'Gilroy-Regular',
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
