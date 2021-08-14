import Vue from 'vue'
import Vuelidate from 'vuelidate'
import Paginate from 'vuejs-paginate'
import App from './App.vue'
import router from './router'
import store from './store'
import dateFilter from '@/filters/date.filter'
import currencyFilter from '@/filters/currency.filter'
import tooltipDirective from '@/directives/tooltip.directives'
import messagePlugin from '@/utils/message.plugin'
import Loader from '@/components/app/Loader'
import './registerServiceWorker'
import 'materialize-css/dist/js/materialize.min'


import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'

Vue.config.productionTip = false

Vue.use(Vuelidate)
Vue.use(messagePlugin)
Vue.filter('date', dateFilter)
Vue.filter('currency', currencyFilter)
Vue.directive('tooltip', tooltipDirective)
Vue.component('Loader', Loader)
Vue.component('Paginate', Paginate)

firebase.initializeApp({
  apiKey: "AIzaSyDdLF9F2M17MBgHw6fccfR5_WDWFBYqoew",
  authDomain: "parp-vue-crm.firebaseapp.com",
  projectId: "parp-vue-crm",
  storageBucket: "parp-vue-crm.appspot.com",
  messagingSenderId: "969587929635",
  appId: "1:969587929635:web:1b4307657b7ad3aa69f796",
  measurementId: "G-CRRPVZK4D5"
})

let app

firebase.auth().onAuthStateChanged(() => {
  if (!app) {
    app = new Vue({
      router,
      store,
      render: h => h(App)
    }).$mount('#app')
  }
})


