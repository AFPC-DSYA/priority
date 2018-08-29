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

//import bootstrap
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import '../node_modules/mdbootstrap/css/mdb.min.css'
//import dc styling globally
import '../node_modules/dc/dc.css'

import fontawesome from '@fortawesome/fontawesome'
import faSpinner from '@fortawesome/fontawesome-free-solid/faSpinner'
import faQuestionCircle from '@fortawesome/fontawesome-free-solid/faQuestionCircle'
import faInfoCircle from '@fortawesome/fontawesome-free-solid/faInfoCircle'
import faArrowUp from '@fortawesome/fontawesome-free-solid/faArrowUp'
import faArrowDown from '@fortawesome/fontawesome-free-solid/faArrowDown'

fontawesome.library.add(faSpinner,faQuestionCircle, faInfoCircle, faArrowUp, faArrowDown)

import { store } from '@/store/store'

if (store.state.sanity != check_portal && !local){
	var querystring = require('querystring');
	const formData = {
		_PROGRAM: AXIOS_PROGRAM,
		nPage:"sanity"
	}
	var myData = axios.post(axios_url, querystring.stringify(formData))
	.then(function(response){
		var mySanity = response.data.sanity;
		if (mySanity != 'INSANE'){
				window.location.href = 'https://starsraw.afpc.randolph.af.mil';
		} else {
				store.state.sanity = 'INSANE'
		}
	}).then(function(){
		Vue.config.productionTip = false

		/* eslint-disable no-new */
		new Vue({
		  el: '#app',
		  router,
		  store,
		  components: { App },
		  template: '<App/>'
		})
	}).catch(function(error){
		console.log(error)
		window.location.href = 'https://starsraw.afpc.randolph.af.mil';
	})
} else {
	Vue.config.productionTip = false

	/* eslint-disable no-new */
	new Vue({
	  el: '#app',
	  router,
	  store,
	  components: { App },
	  template: '<App/>'
	})
}

// router.beforeEach((to, from, next) => {
// 	 //PROD:
//    	//if (store.state.sanity == "SANE"){
// 	 	if (store.state.sanity != check_portal){
// 	 	  	var querystring = require('querystring');
//           	const formData = {
//             	_PROGRAM: AXIOS_PROGRAM,
//             	nPage:"sanity"
//           	}
//           	var myData = axios.post(axios_url, querystring.stringify(formData))
//           	.then(function(response){
//             	var mySanity = response.data.sanity;
//             	if (mySanity != 'INSANE'){
//               		window.location.href = 'https://starsraw.afpc.randolph.af.mil';
//             	} else {
//               		store.state.sanity = 'INSANE'
//               		next();
//               		//alert('AUTHENTICATED')
//             	}
//           	}).catch(function(error){
//             	console.log(error)
//             	window.location.href = 'https://starsraw.afpc.randolph.af.mil';
//           	})
//         } else {
//           next();
//         }
// 	//}
// })

