import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)


const routes = [
	{
		path: "/",
		component: () => import("../views/app/index"),
		redirect: `/main`,
		children: [
			{
				path: "videoView/:no",
				component: () => import("../views/app/main/videoView"),
			},
			{
				path: "main",
				component: () => import("../views/app/main/index"),
				redirect: `/main/home`,
				children: [
					{
						path: "home",
						name:'mainHome',
						component: () => import("../views/app/main/main")
					},
					{
						path: "live",
						name:'mainLive',
						component: () => import("../views/app/main/live")
					},
					{
						path: "video",
						name:'mainVideo',
						component: () => import("../views/app/main/video")
					},
					{
						path: "bjList",
						name:'mainBjList',
						component: () => import("../views/app/main/bjList")
					},
					{
						path: "instar",
						name:'mainInstar',
						component: () => import("../views/app/instar/bjList")
					},
					{
						path: "search/:keyword",
						component: () => import("../views/app/main/search")
					},
					{
						path: "content/:code",
						name: 'pageContent',
						component: () => import("../views/app/content/content")
					},
					{
						path: "login",
						component: () => import("../views/app/member/modalLogin")
					},
					{
						path: "setAddMemberInfo",
						component: () => import("../views/app/member/setAddMemberInfo")
					},
					{
						path: "join",
						component: () => import("../views/app/member/modalJoin")
					},
					{
						path: "agree/:cmd",
						component: () => import("../views/app/member/agree")
					},
					{
						path: 'mypage',
						component: () => import("../views/app/mypage/index"),
						children: [
							{
								path: "myMenu",
								component: () => import("../views/app/mypage/mobileMenu")
							},
							{
								path: "broadcastList",
								component: () => import("../views/app/mypage/broadcastList")
							},
							{
								path: "broadcastSetting",
								component: () => import("../views/app/mypage/broadcastSetting")
							},
							{
								path: "broadcastImg",
								component: () => import("../views/app/mypage/broadcastImg")
							},
							{
								path: "broadcastMake",
								component: () => import("../views/app/mypage/broadcastMake")
							},
							{
								path: "userBoard",
								component: () => import("../views/app/mypage/userBoard")
							},
							{
								path: "shopSetting",
								component: () => import("../views/app/mypage/shopSetting")
							},
							{
								path: "updateMyInfo",
								component: () => import("../views/app/mypage/myInfo")
							},
							{
								path: "myFollower",
								component: () => import("../views/app/mypage/myFollower")
							},
							{
								path: "myMessage",
								component: () => import("../views/app/mypage/message/index"),
								redirect: `myMessage/list`,
								children: [
									{
										path: "list",
										component: () => import("../views/app/mypage/message/myMessage")
									},
									{
										path: "view/:targetUid",
										component: () => import("../views/app/mypage/message/myMessageView")
									},
								
								]
							},
							{
								path: "myPoint",
								component: () => import("../views/app/mypage/myPoint")
							},
							{
								path: "shopSetting",
								component: () => import("../views/app/mypage/shopSetting")
							},
							{
								path: "myFollowing",
								component: () => import("../views/app/mypage/myFollowing")
							},
							{
								path: "myArticle",
								component: () => import("../views/app/mypage/myArticle")
							},
							{
								path: "useBanner",
								component: () => import("../views/app/mypage/banner/useBanner")
							},
							{
								path: "bannerSet",
								component: () => import("../views/app/mypage/banner/bannerSet")
							},
							{
								path: "bannerUsers",
								component: () => import("../views/app/mypage/banner/bannerUsers")
							},

						]
					},
					{
						path: "board/list/:bid/:code",
						name: "boardList",
						component: () => import("../views/app/board/articleList")
					},
					{
						path: "board/view/:no",
						name: "boardView",
						component: () => import("../views/app/board/articleView")
					},
					{
						path: "board/regist/:bid/:no",
						name: "boardRegist",
						component: () => import("../views/app/board/articleRegist")
					},
					{
						path: 'customer',
						component: () => import("../views/app/customer/index"),
						redirect: `customer/main`,
						children: [
							{
								path: "main",
								component: () => import("../views/app/customer/main")
							},
							{
								path: "broadcastSetting",
								component: () => import("../views/app/mypage/broadcastSetting")
							},
						]
					}
				]
			}
		]
	},
	{
		path: "/live",
		component: () => import("../views/app/index"),
		redirect: `/live/:no`,
		children: [
			{
				path: ":no",
				component: () => import("../views/app/live/index"),
				redirect: `/live/:no/liveInfo`,
				children: [
					{
						path: "liveInfo",
						component: () => import("../views/app/live/liveInfo")
					},
					{
						path: "liveSetting",
						component: () => import("../views/app/live/liveSetting")
					},
					{
						path: "examSetting/normal",
						component: () => import("../views/app/live/examSettingNormal")
					},
					{
						path: "examSetting/direct",
						component: () => import("../views/app/live/examSettingDirect")
					},
					{
						path: "examSetting/excel",
						component: () => import("../views/app/live/examSettingExcel")
					},
					{
						path: "dataList",
						component: () => import("../views/app/live/data/index"),
						redirect: `/live/:no/dataList/all`,
						children: [
							{
								path: "all",
								component: () => import("../views/app/live/data/dataList")
							},
							{
								path: "examModify/:no",
								component: () => import("../views/app/live/exam/examModify")
							},
							{
								path: "fileView/:no",
								component: () => import("../views/app/live/data/fileView")
							},
						]
					},
					{
						path: "pollList",
						component: () => import("../views/app/live/poll/pollMake")
					},
					{
						path: "voteList",
						component: () => import("../views/app/live/vote/voteMake")
					},
					{
						path: "boardSetting",
						component: () => import("../views/app/live/board/boardSetting")
					},
					////////// after //////////////
					{
						path: "afterExam",
						component: () => import("../views/app/live/exam/afterExam")
					},
					{
						path: "examReport/:examNo",
						component: () => import("../views/app/live/exam/examReport")
					},
					{
						path: "examReportView/:pno/:replyNo",
						component: () => import("../views/app/live/exam/examReportView")
					},
					{
						path: "afterQuiz",
						component: () => import("../views/app/live/quiz/afterQuiz")
					},
					{
						path: "afterQuizView/:pno",
						component: () => import("../views/app/live/quiz/afterQuizView")
					},
					{
						path: "afterChat",
						component: () => import("../views/app/live/chat/afterchat")
					},
					{
						path: "afterPoll",
						component: () => import("../views/app/live/poll/afterPoll")
					},
					{
						path: "afterPollUser",
						component: () => import("../views/app/live/poll/afterPollUser")
					},
					{
						path: "afterPollUserReport/:userNo",
						component: () => import("../views/app/live/poll/afterPollUserReport")
					},
					{
						path: "afterVote",
						component: () => import("../views/app/live/vote/afterVote")
					},
					{
						path: "afterBoard",
						component: () => import("../views/app/live/board/afterBoard")
					},
					{
						path: "afterUser",
						component: () => import("../views/app/live/attendUser/afterUser")
					},
					{
						path: "afterData",
						component: () => import("../views/app/live/data/afterData")
					}
				]
			},
		]
	},
	{
		path: "/hostLive/:no",
		component: () => import("../views/app/live/hostLive/hostVideo")
	},
	{
		path: "/mobileHostLive/:no",
		component: () => import("../views/app/live/hostLive/mobileHostVideo")
	},
	{
		path: "/userLiveIntro/:no",
		component: () => import("../views/app/index"),
		redirect: `/userLiveIntro/:no/main`,
		children: [
			{
				path: "main",
				component: () => import("../views/app/live/userLive/userVideoIntro")
			},
		
		]
	},
	{
		path: "/userLive/:no",
		component: () => import("../views/app/live/userLive/userVideo")
	},
	{
		path: "/userLiveMobile/:no",
		component: () => import("../views/app/live/userLive/userVideoMobile")
	},
	{
		path: "/agree/:cmd",
		component: () => import("../views/app/index"),
		redirect: `/agree/:cmd/main`,
		children: [
			{
				path: "main",
				component: () => import("../views/app/member/agree")
			},
		
		]
	},
	{
		path: "/admin",
		component: () => import("../views/admin/index"),
		children: [
			{
				path: "member",
				component: () => import("../views/admin/member/index"),
				redirect: `member/list`,
				children: [
					{
						path: "list",
						component: () => import("../views/admin/member/memberList")
					},
					{
						path: "config",
						component: () => import("../views/admin/member/memberConfig")
					},
				]
			},
			{
				path: "instar",
				component: () => import("../views/admin/instar/index"),
				redirect: `instar/list`,
				children: [
					{
						path: "list",
						component: () => import("../views/admin/instar/list")
					},
					{
						path: "regist/:no",
						component: () => import("../views/admin/instar/regist")
					},
				]
			},
			{
				path: "linkPayment/paymentList",
				component: () => import("../views/admin/linkPayment/paymentList"),
			},
			
			{
				path: "pointList",
				component: () => import("../views/admin/instar/regist")
			},
			{
				path: "boardRegist/:no",
				component: () => import("../views/admin/board/boardRegist")
			},
			{
				path: "boardList",
				component: () => import("../views/admin/board/boardList")
			},
			{
				path: "boardArticle/:bid",
				component: () => import("../views/admin/board/boardArticle"),
				redirect: `boardArticle/:bid/list`,
				children: [
					{
						path: "list",
						component: () => import("../views/admin/board/article/boardArticleList")
					},
					{
						path: "regist/:no",
						component: () => import("../views/admin/board/article/boardArticleRegist")
					},
					{
						path: "view/:no",
						component: () => import("../views/admin/board/article/boardArticleView")
					},
				]
			},
			{
				path: "metabus",
				component: () => import("../views/admin/metabus/index"),
				redirect: `metabus/itemList`,
				children: [
					{
						path: "category",
						component: () => import("../views/admin/metabus/category")
					},
					{
						path: "itemList",
						component: () => import("../views/admin/metabus/itemList")
					},
					{
						path: "itemRegist/:no",
						component: () => import("../views/admin/metabus/itemRegist")
					},
					{
						path: "worldHomeList",
						component: () => import("../views/admin/metabus/worldHomeList")
					},
					{
						path: "buyList",
						component: () => import("../views/admin/metabus/buyList")
					},
					{
						path: "presentList",
						component: () => import("../views/admin/metabus/presentList")
					},
					{
						path: "homeBuyList",
						component: () => import("../views/admin/metabus/homeBuyList")
					},
				]
			},
			{
				path: "banner",
				component: () => import("../views/admin/banner/index"),
				redirect: `banner/paymentList`,
				children: [
					{
						path: "paymentList",
						component: () => import("../views/admin/banner/paymentList")
					},
				]
			},
		
		]
	},
	{
		path: "/board",
		component: () => import("../views/app/index"),
		children: [
			{
				path: "list/:bid",
				component: () => import("../views/app/board/articleList"),
			},
			{
				path: "regist/:bid",
				component: () => import("../views/app/board/articleRegist"),
			},
			{
				path: "view/:no",
				component: () => import("../views/app/board/articleView"),
			},
		
		]
	},
	{
		path: "/:uid",
		component: () => import("../views/app/index"),
		redirect: `/:uid/main`,
		children: [
			{
				path: "main",
				component: () => import("../views/app/bj/index"),
				redirect: `/:uid/main/home`,
				children: [
					{
						path: "home",
						component: () => import("../views/app/bj/home")
					},
					{
						path: "userBoard",
						component: () => import("../views/app/bj/board/index"),
						redirect: `userBoard/list`,
						children: [
							{
								path: "list",
								name:"userBoardList",
								component: () => import("../views/app/bj/board/userBoardArticle")
							},
							{
								path: "view/:no",
								name:"userBoardView",
								component: () => import("../views/app/bj/board/userBoardView")
							},
							{
								path: "regist",
								name:"userBoardRegist",
								component: () => import("../views/app/bj/board/userBoardRegist")
							},
							{
								path: "modify/:no",
								name:"userBoardModify",
								component: () => import("../views/app/bj/board/userBoardRegist")
							},
						]
					},
					{
						path: "video",
						component: () => import("../views/app/bj/video/videoList")
					},
					{
						path: "userPhoto",
						component: () => import("../views/app/bj/photo/index"),
						redirect: `userPhoto/list`,
						children: [
							{
								path: "list",
								component: () => import("../views/app/bj/photo/userPhotoArticle"),
								name:"userPhotoList"

							},
							{
								path: "view/:no",
								component: () => import("../views/app/bj/photo/userPhotoView"),
								name:"userPhotoView",
							},
							{
								path: "regist",
								name:"userPhotoRegist",
								component: () => import("../views/app/bj/photo/userPhotoRegist")
							},
							{
								path: "modify/:no",
								name:"userPhotoModify",
								component: () => import("../views/app/bj/photo/userPhotoRegist")
							},


						]
					},
					{
						path: "timeline",
						component: () => import("../views/app/bj/timeline/index"),
						redirect: `timeline/list`,
						children: [
							{
								path: "list",
								component: () => import("../views/app/bj/timeline/timelineList"),
								children: [
									{
										path: "regist",
										name:"userTimelineRegist",
										component: () => import("../views/app/bj/timeline/timelineRegist")
									},
									{
										path: "modify/:no",
										name:"userTimelineModify",
										component: () => import("../views/app/bj/timeline/timelineRegist")
									},
									{
										path: "comment/:no",
										name:"userTimelineComment",
										component: () => import("../views/app/bj/timeline/timelineComment")
									},

								]
							},
						]
					},
					{
						path: "chat",
						component: () => import("../views/app/bj/chatting/Chat")
					},
					{
						path: "meeting",
						name:"meetingList",
						component: () => import("../views/app/bj/meeting/meetList"),
						children: [
							{
								path: "regist",
								name:"userMeetingRegist",
								component: () => import("../views/app/bj/meeting/meetRegist")
							},
							{
								path: "modify/:no",
								name:"userMeetingModify",
								component: () => import("../views/app/bj/meeting/meetRegist")
							},
							{
								path: "view/:no",
								name:"userMeetingView",
								component: () => import("../views/app/bj/meeting/meetView")
							},

						]
					},

					{
						path: "metaroom",
						component: () => import("../views/app/bj/metabus/index"),
						redirect: `metaroom/list`,
						children: [
							{
								path: "list",
								component: () => import("../views/app/bj/metabus/itemList")
							},
							{
								path: "view/:no/:pagecode",
								component: () => import("../views/app/bj/metabus/itemView")
							},
							{
								path: "myitem",
								component: () => import("../views/app/bj/metabus/itemList")
							},
							{
								path: "goods",
								component: () => import("../views/app/bj/metabus/itemList")
							},
						]
					},
				]
			},
		]
	},
]

const router = new VueRouter({
	mode: 'history',
	base: process.env.BASE_URL,
	scrollBehavior(to, from, savedPosition) {
		if (savedPosition) {
			//console.log(JSON.stringify(savedPosition));
			return savedPosition;
		} else {
			return {x: 0, y: 0}
		}

	},
	routes
})

export default router
