import Vue from 'vue'
import App from './App.vue'
Vue.config.productionTip = false
import Vuex from 'vuex'
Vue.use(Vuex)
import DatGui from '@cyrilf/vue-dat-gui'
Vue.use(DatGui)
const store = new Vuex.Store({
  state: {
    view: 'attractor',
    finInfo: '',
    fishes: [],
    howto: false
  },
  mutations: {
    ADD_FISH(state, val) {
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

new Vue({
  store,
  render: h => h(App),
}).$mount('#app')
