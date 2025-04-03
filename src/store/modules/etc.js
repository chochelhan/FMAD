
export default ({
	namespaced: true,
	state: {
		uid:'',
		ownerUid:'',
		gno:'',
		chatMove:false,
		broadcastInfo:{},
		pcmainLeftBanner:[],
		pcmainOwnerUid:'',
		searchKeyword:'',
	},
	getters: {
		getUid: state => {
			return state.uid;
		},
		getOwnerUid: state => {
			return state.ownerUid;
		},
		getGno: state => {
			return state.gno;
		},
		getBroadcastInfo: state => {
			return state.broadcastInfo;
		},
		getChatMove:state => {
			return state.chatMove;
		},
		getPcmainLeftBanner:state => {
			return state.pcmainLeftBanner;
		},
		getPcmainOwnerUid:state => {
			return state.pcmainOwnerUid;
		},
		getSearchKeyword:state => {
			return state.searchKeyword;
		},
		
	},
	mutations: {
		setUid(state,uid) {
			state.uid = uid;
		},
		setOwnerUid(state,uid) {
			state.ownerUid = uid;
		},
		
		setGno(state,gno) {
			state.gno = gno;
		},
		setBroadcastInfo(state,info) {
			state.broadcastInfo = info;
		},
		setChatMove(state,bool) {
			state.chatMove = bool;
		},
		setPcmainLeftBanner(state,banners) {
			state.pcmainLeftBanner = banners;
		},
		setPcmainOwnerUid(state,uid) {
			state.pcmainOwnerUid = uid;
		},
		setSearchKeyword(state,keyword) {
			state.searchKeyword = keyword;
		},
		
	},
	actions: {
		setUid({commit},uid) {
			commit('setUid',uid)
		},
		setOwnerUid({commit},uid) {
			commit('setOwnerUid',uid)
		},
		setGno({commit},gno) {
			commit('setGno',gno)
		},
		setBroadcastInfo({commit},info) {
			commit('setBroadcastInfo',info)
		},
		setChatMove({commit},bool) {
			commit('setChatMove',bool)
		},
		setPcmainLeftBanner({commit},banners) {
			commit('setPcmainLeftBanner',banners)
		},
		setPcmainOwnerUid({commit},uid) {
			commit('setPcmainOwnerUid',uid)
		},
		setSearchKeyword({commit},keyword) {
			commit('setSearchKeyword',keyword)
		},
	}
})
