import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';

Vue.use(Vuetify);

// Translation provided by Vuetify (javascript)
import ko from 'vuetify/es5/locale/ko'


export default new Vuetify({
	icons: {
		iconfont: 'mdiSvg',
	},
	lang: {
		locales: { ko},
		current: 'ko',
	},
})