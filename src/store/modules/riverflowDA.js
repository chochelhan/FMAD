
export default ({
	namespaced: true,
	state: {
		base: {},
		header: {},
		mainImg: {},
		addMenus:{},
		menus:[],
		sideMenus:{},
		content: [],
		contentItem:{},
		contentItemBlock:{},
		contentItemBlockCol:{},
		footer: {},
		tempSection:{
			bgUse:'',
			bgType:'',
			imgName:'',
			saveStyle: {
				height:'',
				background:'',
			}
		},
		tempBlockGroup:{
			bgUse:'',
			bgType:'',
			imgName:'',
			listMargin:'',
			borderUse:'',
			borderRadiusUse:'',
			saveStyle: {
				background:'',
				padding:'',
				border:'',
				'border-radius':'',
			}
			
		},
		tempBlock:{
			id:'',
			ctype:'',
			bgUse:'',
			bgType:'',
			imgName:'',
			padding:'',
			borderUse:'',
			borderRadiusUse:'',
			saveStyle: {
				background:'',
				padding:'',
				border:'',
				'border-radius':'',
			},
			content: {
				text:'',
				imgUrl: '',
				imgName: '',
				icon: '',
				iconColor: '',
				iconSize: '',
				iconEffect: '',
				iconBoxUse: '',
				iconBoxSize: '',
				iconBoxColor: '',
				iconBoxBgUse: '',
			},
			board:{
				bid:'',
				vtype:'',
				listcnt:'',
				sort:'',
			},
			cols:[],
			colsCnt:0,
		},
		tempBlockColContent: {
			id: '',
			ctype:'',
			saveStyle: {
				height:'',
				padding:'',
			},
			content: {
				text: '',
				imgUrl: '',
				imgName: '',
				icon: '',
				iconColor: '',
				iconSize: '',
				iconEffect: '',
				iconBoxUse: '',
				iconBoxSize: '',
				iconBoxColor: '',
				iconBoxBgUse: '',
			},
			board:{
				bid:'',
				vtype:'',
				listcnt:'',
				sort:'',
			},
			
		},
		editBoxTitle:'',
		editUpdate:'',
	},
	getters: {
		mapAddMenuData: state => {
			return state.addMenus;
		},
		mapMenuData: state => {
			return state.menus;
		},
		mapBaseData: state => {
			return state.base;
		},
		mapHeaderData: state => {
			return state.header;
		},
		mapMainImgData: state => {
			return state.mainImg;
		},
		mapSideMenuData: state => {
			return state.sideMenus;
		},
		mapContentData: state => {
			return state.content;
		},
		mapContentItemData: state => {
			return state.contentItem;
		},
		mapContentItemBlockData: state => {
			return state.contentItemBlock;
		},
		mapContentItemBlockColData: state => {
			return state.contentItemBlockCol;
		},
		mapFooterData: state => {
			return state.footer;
		},
		mapTempSection:state=> {
			return state.tempSection;
		},
		mapTempBlockGroup:state=> {
			return state.tempBlockGroup;
		},
		mapTempBlock:state=> {
			return state.tempBlock;
		},
		mapTempBlockColContent:state=> {
			return state.tempBlockColContent;
		},
		getEditBoxTitle:state=> {
			return state.editBoxTitle;
		},
		getEditUpdate:state=>{
			return state.editUpdate;
		}
	},
	mutations: {
		setAddMenus(state,params) {
			state.addMenus = params;
		},
		setMenus(state,params) {
			state.menus = params;
		},
		setBase(state,params) {
			state.base = params;
		},
		setHeader(state,params) {
			state.header = params;
		},
		setMainImg(state,params) {
			state.mainImg = params;
		},
		setSideMenu(state,params) {
			state.sideMenus = params;
		},
		setContent(state,data) {
			state.content = data;
	
		},
		setContentList(state,data) {
			state.content.push(data);
			
		},
		setContentItem(state,index) {
			state.contentItem =  state.content[index];
		},
		setContentItemBlock(state,index) {
			state.contentItemBlock =  state.contentItem.list[index];
		},
		
		setContentItemBlockCol(state,index) {
			state.contentItemBlockCol =  state.contentItemBlock.cols[index];
		},
		saveContentItem(state,params) {
			state.content[params.index] = params.data;
		},
		deleteContentItem(state,index) {
			state.content.splice(index,1)
		},
		setTempSection(state,params) {
			state.tempSection = params;
		},
		
		setTempBlockGroup(state,params) {
			state.tempBlockGroup = params;
		},
		setTempBlock(state,params) {
			state.tempBlock = params;
		},
		setTempBlockColContent(state,params) {
			state.tempBlockColContent = params;
		},
		setEditBoxTitle(state,title) {
			state.editBoxTitle = title;
		},
		setEditUpdate(state,cmd) {
			state.editUpdate = cmd;
		},
	},
	actions: {
		setMapAddMenus({commit},params) {
			commit('setAddMenus',params)
		},
		setMapMenus({commit},params) {
			commit('setMenus',params)
		},
		
		setMapBase({commit},params) {
			commit('setBase',params)
		},
		setMapHeader({commit},params) {
			commit('setHeader',params)
		},
		setMapMainImg({commit},params) {
			commit('setMainImg',params)
		},
		setMapSideMenu({commit},params) {
			commit('setSideMenu',params)
		},
		setMapContent({commit},params) {
			commit('setContent',params)
			
		},
		setMapContentList({commit},params) {
			commit('setContentList',params)
			
		},
		setMapContentItem({commit},index) {
			
			commit('setContentItem',index);
		},
		setMapContentItemBlock({commit},index) {
			commit('setContentItemBlock',index);
		},
		setMapContentItemBlockCol({commit},index) {
			commit('setContentItemBlockCol',index);
		},
		saveMapContentItem({commit},params) {
			commit('saveContentItem',params);
		},
		deleteMapContentItem({commit},index) {
			commit('deleteContentItem', index);
		},
		setMapTempSection({commit},params) {
			commit('setTempSection',params);
		},
		setMapTempBlockGroup({commit},params) {
			commit('setTempBlockGroup',params);
		},
		setMapTempBlock({commit},params) {
			commit('setTempBlock', params);
		},
		setMapTempBlockColContent({commit},params) {
			commit('setTempBlockColContent', params);
		},
		setMapEditBoxTitle({commit},title) {
			commit('setEditBoxTitle',title);
		},
		setMapEditUpdate({commit},cmd) {
			commit('setEditUpdate',cmd);
		},
		
	
	}
})
