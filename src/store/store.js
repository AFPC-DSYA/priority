import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

export const store =  new Vuex.Store({
	state:{
		asDate: 'Undetermined',
		resetAfsc: false,
		startAfsc:false,
		sanity: 'SANE',
	}
});
