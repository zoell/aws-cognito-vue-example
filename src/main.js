// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import BootstrapVue from "bootstrap-vue"
import App from './App'
import router from './router'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import GlobalHeader from './components/GlobalHeader'
import MFAChallengeResponse from './components/MFAChallengeResponse'
import appStore from './appStore'
import VueQrcode from '@xkeshi/vue-qrcode'

Vue.use(BootstrapVue)
Vue.config.productionTip = false

// Global components
Vue.component('Globalheader', GlobalHeader)
Vue.component('MFAChallengeResponse', MFAChallengeResponse)
Vue.component(VueQrcode.name, VueQrcode)

// initialize single application store
window.appStore = appStore;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
