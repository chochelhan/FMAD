import riverflowDA from './modules/riverflowDA'
import member from './modules/member'
import etc from './modules/etc'
import link from './modules/link'
import mobile from './modules/mobile'

import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
	modules: {
		riverflowDA,
		member,
		etc,
		link,
		mobile

	}
})
