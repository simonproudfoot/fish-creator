<template>
<div id="app">
    <fishtank :key="tankRefresh" />
    <creator v-if="$store.state.view == 'creator'" />
    <attractor v-show="$store.state.view == 'attractor'" />
    <final v-show="$store.state.view == 'final'" />
</div>
</template>

<script>
import creator from "./components/creator.vue";
import attractor from "./components/attractor.vue";
import fishtank from "./components/fishTank.vue";
import final from "./components/final.vue";
export default {
    name: "App",
    data() {
        return {
            test: true,
            tankRefresh: 0,
            ready: false,
            startCreator: false
        }
    },

    components: {
        final,
        fishtank,
        attractor,
        creator,
    },
    watch: {
        '$store.state.fishes'(val) {
            this.tankRefresh++
        },
        '$store.state.reset'(val) {
            this.tankRefresh++
        },

    },
    mounted() {
        var saved = JSON.parse(localStorage.getItem('previous'))
        if (saved) {
            saved.forEach((fish, i) => {
                if (i < 5) {
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

.shadowed {}

.button {
    padding: 0 1.1em;
    filter: drop-shadow(7px 5px 0px rgba(0, 0, 0, 0.1));
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

.loading {
    position: absolute;
    top: 0;
    left: 0;
    transform: translate(-50%, -50%);
    height: 100px;
    width: 100px;
    -webkit-animation: fail 2s linear infinite;
    animation: fail 2s linear infinite;
    right: 0;
    bottom: 0;
    margin: auto;

}

@keyframes fail {
    0% {
        transform: rotate(0deg)
    }

    100% {
        transform: rotate(360deg)
    }
}

@keyframes pulse {
    from {
        transform: scale(0.7);
    }

    to {
        transform: scale(1);

    }
}
</style>
