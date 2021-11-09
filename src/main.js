import Vue from 'vue'
import App from './App.vue'
Vue.config.productionTip = false
import Vuex from 'vuex'
Vue.use(Vuex)
import DatGui from '@cyrilf/vue-dat-gui'
Vue.use(DatGui)
const store = new Vuex.Store({
  state: {
    view: 'attractor', // attractor, creator, fishtank, final
    finInfo: '',
    fishes: [],
    howto: false,
    reset: 0,
    colors: {
      default: {
        finColor: '',
        file: require("@/assets/map-default.jpg")
      },
      red: {
        finColor: '#970d51',
        file: require("@/assets/map-red.jpg")
      },
      green: {
        finColor: '#1f7321',
        file: require("@/assets/map-green.jpg")
      },
      blue: {
        finColor: '#282369',
        file: require("@/assets/map-blue.jpg")
      }
    },
    sounds: {
      swim: new Audio(require("@/assets/sound/swim.wav")),
      test: new Audio(require("@/assets/sound/test.mp3")),
      fail: new Audio(require("@/assets/sound/fail.wav"))

    },
  },
  mutations: {
    RESET_SCREEN(state) {
      state.reset++
    },
    ADD_FISH(state, val) {
      state.fishes.length = Math.min(state.fishes.length, 4);
      state.fishes.push(val)
    },
    SET_VIEW(state, val) {
      state.view = val
    },
    SET_FININFO(state, val) {
      state.finInfo = val
    },
    SET_HOWTO(state, val) {
      state.howto = val
    }
  }
})

var globals = {
  created: function () {
    console.log('mixin hook called')
  },

  methods: {
    playSound: function () {
      alert('playing sound')
    }
  }
}

new Vue({
  store,
  mixins: [globals],
  render: h => h(App),
}).$mount('#app')
