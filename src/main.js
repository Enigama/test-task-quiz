import Vue from 'vue'
import App from './App.vue'
import VueTippy from "vue-tippy";

Vue.config.productionTip = false

Vue.use(VueTippy);

new Vue({
  render: h => h(App),
}).$mount('#app')
