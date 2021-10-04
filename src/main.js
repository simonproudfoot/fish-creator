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
    // position : finSelected
    fishes: []
  },
  mutations: {
    ADD_FISH(state, val) {
      state.fishes.push(val)
    },
    SET_VIEW(state, val) {
      state.view = val
    }
  }
})

new Vue({
  store,
  render: h => h(App),
}).$mount('#app')
