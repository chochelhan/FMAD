
export const ADMIN_MENU = [
	/*{
		id:'config',
		name: '환경 설정',
		view: false,
		icon: 'fas fa-cog',
		subMenus: [
			//{name: '사이트 기본환경 설정', url: ''},
			{name: '회원 환경 설정', url: '/admin/memberConfig'},
			//{name: '쇼핑몰 카테고리 설정', url: '/admin/shop/category'},
		]
	},
	*/
	{
		id:'member',
		name: '회원 관리',
		view: false,
		icon: 'fas fa-user-friends',
		subMenus: [
			{name: '회원 환경 설정', url: '/admin/member/config'},
			{name: '회원 목록', url: '/admin/member/list'},
		]
	},

	{
		id:'instar',
		name: '인스타셀럽 관리',
		view: false,
		icon: 'fab fa-instagram',
		subMenus: [

			{name: '셀럽 목록', url: '/admin/instar/list'},
			{name: '셀럽 등록', url: '/admin/instar/regist/new'},
		]
	},
	{
		id:'board',
		name: '게시판 관리',
		view: false,
		icon: 'fas fa-clipboard-list',
		subMenus: [
			{name: '게시판 생성', url: '/admin/boardRegist/new'},
			{name: '게시판 수정', url: '/admin/boardList'},
			{name: '게시판 목록', url: 'none',icon: 'far fa-clipboard',
				subList: [
		
				]
			},
		]
	},
	

];
