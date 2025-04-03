import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import VueLodash from 'vue-lodash'
import lodash from 'lodash'

Vue.use(VueLodash, { name: 'custom' , lodash: lodash })
Vue.config.productionTip = false
import axios from 'axios'
Vue.prototype.$http = axios;

import VueMobileDetection from 'vue-mobile-detection'
Vue.use(VueMobileDetection)

import VueAwesomeSwiper from 'vue-awesome-swiper'
import 'swiper/dist/css/swiper.css'
Vue.use(VueAwesomeSwiper)

import VueMasonry from 'vue-masonry-css'
Vue.use(VueMasonry);

var EventBus = new Vue();
Object.defineProperties(Vue.prototype, {
	$eventBus: {
		get: function () {
			return EventBus;
		}
	}
});


let vue = new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')


window.snsJoinMove = function(uid,name,email,pcs,sns) {
	let params = {
		uid:uid,
		name:name,
		email:email,
		pcs:pcs,
		sns:sns
	}
	vue.$eventBus.$emit('snsJoinMove',params);
}
window.snsJoinDriect = function(uid,name,email,pcs,sns) {
	let params = {
		uid:uid,
		name:name,
		email:email,
		pcs:pcs,
		sns:sns
	}
	vue.$eventBus.$emit('snsJoinDriect',params);
}

window.snsLoginComplete = function(loginCode) {
	vue.$eventBus.$emit('snsLoginComplete',loginCode);
}
window.googleLoginResult = function(result,joinCode) {

	let params = {
		result:result,
		joinCode:joinCode
	}
	vue.$eventBus.$emit('googleLoginComplete',params);
}
import jsonRpcService from './api/jsonRpcService';
window.addEventListener("message", function(event) {
	jsonRpcService.checkDebug();
	let origin = event.origin;
	if(origin.toString().trim() == jsonRpcService.jsonRpcUrl.toString()) {
		
		vue.$eventBus.$emit('chatRpcResponse',event.data);
	} else if(origin.toString().trim() == jsonRpcService.jsonRpcLiveUrl.toString()) {
		
		vue.$eventBus.$emit('liveRpcResponse',event.data);
	} else {
		if(event.data.type=='webpackOk')return;
		vue.$eventBus.$emit('unityAction',event.data);
		
	}

});
/*
window.unityAction = function(params)  {
	vue.$eventBus.$emit('unityAction',params);
}
*/
window.bannerPaymentClose = function(cmd) {
	vue.$eventBus.$emit('bannerPaymentClose',cmd);
}


window.pointPaymentClose = function(cmd) {
	vue.$eventBus.$emit('pointPaymentClose',cmd);
}

