
export default ({
	namespaced: true,
	state: {
		name:'',
		no:'',
		uid:'',
		mtype:'',
		level:'',
		photo:'',
		loginBoxOpen:false,
		brocastChange:false,
	},
	getters: {
		getName: state => {
			return state.name;
		},
		getNo: state => {
			return state.no;
		},
		getUid: state => {
			return state.uid;
		},
		getMtype: state => {
			return state.mtype;
		},
		getLevel: state => {
			return state.level;
		},
		getLoginBoxOpen: state => {
			return state.loginBoxOpen;
		},
		getBrocastChange: state => {
			return state.brocastChange;
		},
		getPhoto:state => {
			return state.photo;
		},
	},
	mutations: {
		setMemberInfo(state,params) {
			state.name = (params.name)?params.name:'';
			state.no = (params.no)?params.no:'';
			state.uid = (params.uid)?params.uid:'';
			state.mtype = (params.mtype)?params.mtype:'';
			state.level = (params.level)?params.level:'';
			
		},
		setPhoto(state,photo) {
			state.photo = photo;
		},
		setLoginBoxToggle(state,bool) {
			state.loginBoxOpen = bool;
		},
		setBrocastToggle(state,bool) {
			state.brocastChange = bool;
		}
	},
	actions: {
		setMember({commit},params) {
			commit('setMemberInfo',params)
		},
		setLoginBoxOpen({commit},bool) {
			commit('setLoginBoxToggle',bool)
		},
		setBrocastChange({commit},bool) {
			commit('setBrocastToggle',bool)
		},
		setPhoto({commit},photo) {
			commit('setPhoto',photo)
		},
	
	}
})
