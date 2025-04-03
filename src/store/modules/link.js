
export default ({
	namespaced: true,
	state: {
		linkData:[],
		accountData:{},
		chatbotList:[],
		chatbotUse:'no',
		shopUse:'',
		serverFlag:false,
		chatbotServerFlag:false,
	},
	getters: {
		getLinkData: state => {
			return state.linkData;
		},
		getAccountData: state => {
			return state.accountData;
		},
		getChatbotList: state => {
			return state.chatbotList;
		},
		getChatbotUse: state => {
			return state.chatbotUse;
		},
		getShopUse: state => {
			return state.shopUse;
		},
		getServerFlag: state => {
			return state.serverFlag;
		},
		getChatbotServerFlag: state => {
			return state.chatbotServerFlag;
		},
	},
	mutations: {
		setLinkData(state,linkData) {
			state.linkData = linkData;
		},
		setAccountData(state,accountData) {
			state.accountData = accountData;
		},
		setChatbotList(state,list) {
			state.chatbotList = list;
		},
		setChatbotUse(state,use) {
			state.chatbotUse = use;
		},
		setShopUse(state,shopUse) {
			state.shopUse = shopUse;
		},
		setServerFlag(state,bool) {
			state.serverFlag = bool;
		},
		setChatbotServerFlag(state,bool) {
			state.chatbotServerFlag = bool;
		},

	},
	actions: {
		setLinkData({commit},linkData) {
			commit('setLinkData',linkData)
		},
		setAccountData({commit},accountData) {
			commit('setAccountData',accountData)
		},
		setChatbotList({commit},list) {
			commit('setChatbotList',list)
		},
		setChatbotUse({commit},use) {
			commit('setChatbotUse',use)
		},
		setShopUse({commit},shopUse) {
			commit('setShopUse',shopUse)
		},
		setServerFlag({commit},bool) {
			commit('setServerFlag',bool)
		},
		setChatbotServerFlag({commit},bool) {
			commit('setChatbotServerFlag',bool)
		},
		
	}
})
