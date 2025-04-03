
export default ({
	namespaced: true,
	state: {
		class:'',
		title:'',
		backUrl:'',
		bjBackUrl:'',
	},
	getters: {
		getClass: state => {
			return state.class;
		},
		getTitle:state => {
			return state.title;
		},
		getBackUrl:state => {
			return state.backUrl;
		},
		getBjBack:state => {
			return state.bjBackUrl;
		},
		
	},
	mutations: {
		setClass(state,name) {
			state.class = name;
		},
		setTitle(state,title) {
			state.title = title;
		},
		setBackUrl(state,url) {
			state.backUrl = url;
		},
		setBjBack(state,url) {
			state.bjBackUrl = url;
		},
	},
	actions: {
		setClass({commit},name) {
			commit('setClass',name)
		},
		setTitle({commit},title) {
			commit('setTitle',title)
		},
		setBackUrl({commit},url) {
			commit('setBackUrl',url)
		},
		setBjBack({commit},url) {
			commit('setBjBack',url)
		},
		
	}
})
