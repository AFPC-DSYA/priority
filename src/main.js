// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

//Import polyfill so IE can use Promise & Axios
import {polyfill} from 'es6-promise'; polyfill();
var ES6Promise = require("es6-promise");
ES6Promise.polyfill();

//startsWith IE polyfill 
if(!String.prototype.startsWith) {
  String.prototype.startsWith = function(searchString, position){
    return this.substr(position || 0, searchString.length) === searchString;
  };
}

import axios from 'axios'
axios.defaults.headers.get['Accepts'] = 'applicaton/json'

import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import '../node_modules/mdbootstrap/css/mdb.min.css'

import fontawesome from '@fortawesome/fontawesome'
import faSpinner from '@fortawesome/fontawesome-free-solid/faSpinner'
import faQuestionCircle from '@fortawesome/fontawesome-free-solid/faQuestionCircle'
import faInfoCircle from '@fortawesome/fontawesome-free-solid/faInfoCircle'

fontawesome.library.add(faSpinner,faQuestionCircle, faInfoCircle)

import { store } from '@/store/store'

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
