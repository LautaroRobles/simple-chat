import Vue from 'vue'
import App from './App.vue'
import vuetify from './vuetify'
import router from './router'
import peerjs from './peerjs'

Vue.config.productionTip = false

new Vue({
  vuetify,
  router,
  peerjs,
  render: h => h(App)
}).$mount('#app')
