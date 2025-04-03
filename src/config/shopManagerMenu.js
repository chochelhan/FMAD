
export const  shopManagerMenu = [
	{
		id:'config',
		name: '환경 설정',
		view: false,
		icon: 'fas fa-cog',
		subMenus: [
			{name: '사이트 기본환경 설정', url: ''},
			{name: '카테고리 설정', url: '/shopManager/setting/category'},
		]
	},
	{
		id:'shop',
		name: '쇼핑몰 관리',
		view: false,
		icon: 'fas fa-shopping-cart',
		subMenus: [
			{name: '상품등록', url: '/shopManager/goods/regist/new'},
			{name: '상품목록', url: '/shopManager/goods/list'},
		]
	},
	

];