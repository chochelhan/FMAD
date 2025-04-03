const IS_DEBUG = process.env.NODE_ENV !== 'production';

let host = '';
if (document.location.host == 'localhost:8080') {
	host = 'https://www.fatmouse.co.kr';
}
export const HOST = host;
/**
 * @ 기본설정 정보
 */

export const API_URL_GET_SITECONFIG = `${HOST}/api/member/getSiteConfig`;

/**
 * @ 회원정보
 */

export const API_URL_AUTH = `${HOST}/api/member/login`;
export const API_URL_MEMBER_JOIN = `${HOST}/api/member/join`;
export const API_URL_MEMBER_LINK_JOIN = `${HOST}/api/member/linkJoin`;

export const API_URL_MEMBER_GET_SHOP_TOKEN = `${HOST}/api/member/getJwtToeken`;


export const API_URL_MEMBER_UPDATE = `${HOST}/api/member/updateMember`;
export const API_URL_MEMBER_PASS_UPDATE = `${HOST}/api/member/updateMemberPass`;
export const API_URL_MEMBER_INFO = `${HOST}/api/member/getMemberInfo`;

export const API_URL_MEMBER_UIDCHECK = `${HOST}/api/member/checkUid`;
export const API_URL_MEMBER_UNICKCHECK = `${HOST}/api/member/checkUnick`;
export const API_URL_MEMBER_GET_APIKEY = `${HOST}/api/member/getApiKey`;

export const API_URL_MEMBER_EMAILCHECK = `${HOST}/api/member/checkEmail`;
export const API_URL_MEMBER_GETCONFIG = `${HOST}/api/member/getConfig`;
export const API_URL_MEMBER_LOGIN = `${HOST}/api/member/login`;
export const API_URL_MEMBER_SNSJOIN = `${HOST}/api/member/snsAddJoin`;
export const API_URL_MEMBER_MY_ARTICLE_LIST = `${HOST}/api/member/getMyArticleList`;
export const API_URL_MEMBER_UPDATE_BANK = `${HOST}/api/member/updateBankInfo`;
export const API_URL_MEMBER_GET_BANK = `${HOST}/api/member/getBankInfo`;
export const API_URL_MEMBER_FIND_IDPW = `${HOST}/api/member/findMemberIdPw`;
export const API_URL_MEMBER_FIND_ID = `${HOST}/api/member/findMemberPwSendEmail`;


////// 마일리지
export const API_URL_MEMBER_POINT_PAYMENT = `${HOST}/api/member/insertPointPayment`;
export const API_URL_MEMBER_POINT_PAYMENT_LIST = `${HOST}/api/member/getPointPaymentList`;
export const API_URL_MEMBER_POINT_USE_LIST = `${HOST}/api/member/getPointUseList`;

//쇼팡몰
export const API_URL_SHOPUSE_UPDATE = `${HOST}/api/member/updateShopUse`;


//bj 정보
export const API_URL_MEMBER_BJLIST = `${HOST}/api/member/getBjList`;
export const API_URL_MEMBER_YOUTUBER_CHECK = `${HOST}/api/member/checkYoutuber`;


////관리자
export const API_URL_MEMBER_ADMIN_GETMEMBERLIST = `${HOST}/api/memberAdmin/getMemberList`;
export const API_URL_MEMBER_ADMIN_LOGIN = `${HOST}/api/memberAdmin/login`;
export const API_URL_MEMBER_ADMIN_INSERTCONFIG = `${HOST}/api/memberAdmin/insertConfig`;
export const API_URL_MEMBER_ADMIN_GETCONFIG = `${HOST}/api/memberAdmin/getConfig`;
export const API_URL_MEMBER_ADMIN_ALLGETCONFIG = `${HOST}/api/memberAdmin/getAllConfig`;
export const API_URL_MEMBER_ADMIN_DELETE = `${HOST}/api/memberAdmin/deleteMember`;




export const API_URL_INSTART_ADMIN_REGIST = `${HOST}/api/instarAdmin/registInstar`;
export const API_URL_INSTART_ADMIN_REGIST_INFO = `${HOST}/api/instarAdmin/getInstarInfo`;
export const API_URL_INSTART_ADMIN_LIST = `${HOST}/api/instarAdmin/getInstarList`;
export const API_URL_INSTART_ADMIN_DELETE = `${HOST}/api/instarAdmin/deleteInstar`;

export const API_URL_INSTAR_LIST = `${HOST}/api/instar/getInstarList`;





////// 마일리지 관리자
export const API_URL_BANNER_ADMIN_POINT_PAYMENT_LIST = `${HOST}/api/memberAdmin/getPointPaymentList`;
export const API_URL_MEMBER_ADMIN_POINT_LIST = `${HOST}/api/memberAdmin/getPointList`;
export const API_URL_MEMBER_ADMIN_POINT_UPDATE = `${HOST}/api/memberAdmin/updatePoint`;


//입점업체 관리자
export const API_URL_MEMBER_SHOP_MANAGER_LOGIN = `${HOST}/api/memberAdmin/shopManagerLogin`;
export const API_URL_MEMBER_SHOP_MANAGER_LOGINCHECK = `${HOST}/api/memberAdmin/shopManagerLoginCheck`;

// 링크몰 결제관리
export const API_URL_LINK_ADMIN_GRADE_PAYMENT_LIST = `${HOST}/api/memberAdmin/getLinkGradePaymentList`;


/// 구독자
export const API_URL_READ_USER_LIST = `${HOST}/api/readUser/getReadUserList`;
export const API_URL_READ_USER_DENY = `${HOST}/api/readUser/updateReadUserDeny`;
export const API_URL_READ_MYUSER_LIST = `${HOST}/api/readUser/getReadMyUserList`;
export const API_URL_READ_USER_MYDELETE = `${HOST}/api/readUser/deleteReadMyUser`;
export const API_URL_READ_USER_REGAUTH = `${HOST}/api/readUser/setRegAuth`;


/**
 * @ 게시판
 */



export const API_URL_BOARD_ARTICLE_INSERT = `${HOST}/api/board/insertArticle`;
export const API_URL_BOARD_ARTICLE_INFO = `${HOST}/api/board/getArticle`;
export const API_URL_BOARD_ARTICLE_LIST = `${HOST}/api/board/getArticleList`;
export const API_URL_BOARD_ARTICLE_REGIST_INFO = `${HOST}/api/board/getArticleRegistInfo`;
export const API_URL_BOARD_ARTICLE_CHECKUPASS = `${HOST}/api/board/checkArticleUpass`;
export const API_URL_BOARD_ARTICLE_DELETE = `${HOST}/api/board/deleteArticle`;


////관리자
export const API_URL_BOARD_ADMIN_INSERT = `${HOST}/api/boardAdmin/insertBoard`;
export const API_URL_BOARD_ADMIN_INFO = `${HOST}/api/boardAdmin/getBoard`;
export const API_URL_BOARD_ADMIN_GETBOARDLIST = `${HOST}/api/boardAdmin/getBoardList`;
export const API_URL_BOARD_ADMIN_GETARTICLELIST = `${HOST}/api/boardAdmin/getArticleList`;
export const API_URL_BOARD_ADMIN_ARTICLE_INSERT = `${HOST}/api/boardAdmin/insertArticle`;
export const API_URL_BOARD_ADMIN_ARTICLE_INFO = `${HOST}/api/boardAdmin/getArticle`;
export const API_URL_BOARD_ADMIN_ARTICLE_REGIST_INFO = `${HOST}/api/boardAdmin/getArticleRegistInfo`;
export const API_URL_BOARD_ADMIN_CHECK_BID = `${HOST}/api/boardAdmin/checkBid`;
export const API_URL_BOARD_ADMIN_ARTICLE_DELETE = `${HOST}/api/boardAdmin/deleteArticle`;


/**
 * @ YOUTUBE
 */

export const API_URL_YOUTUBE_GET_MAIN_VIDEO_LIST = `${HOST}/api/youtube/getMainVideoList`;
export const API_URL_YOUTUBE_GET_LIVE_VIDEO_LIST = `${HOST}/api/youtube/getLiveVideoList`;
export const API_URL_YOUTUBE_GET_BJ_VIDEO_LIST = `${HOST}/api/youtube/getBjVideoList`;
export const API_URL_YOUTUBE_GET_VIDEO_INFO = `${HOST}/api/youtube/getVideoInfo`;
export const API_URL_YOUTUBE_GET_BJ_HOME = `${HOST}/api/youtube/getBjHome`;
export const API_URL_YOUTUBE_GET_VIDEO_LIST = `${HOST}/api/youtube/getVideoList`;
export const API_URL_YOUTUBE_GET_SEARCH = `${HOST}/api/youtube/getSearch`;

/**
 * @ 댓글
 */


export const API_URL_COMMENT_INSERT = `${HOST}/api/comment/insertComment`;
export const API_URL_COMMENT_LIST = `${HOST}/api/comment/getCommentList`;
export const API_URL_COMMENT_DELETE = `${HOST}/api/comment/deleteComment`;
export const API_URL_COMMENT_GLIKE = `${HOST}/api/comment/updateCommentGlike`;


/**
 * @ 레이아웃
 */

/// 관리자
export const API_URL_LAYOUT_ADMIN_INFO = `${HOST}/api/layoutAdmin/getLayout`;
export const API_URL_LAYOUT_ADMIN_TEMP_UPDATE = `${HOST}/api/layoutAdmin/updateTempLayout`;
export const API_URL_LAYOUT_ADMIN_UPDATE = `${HOST}/api/layoutAdmin/updateLayout`;
export const API_URL_LAYOUT_ADMIN_LIST = `${HOST}/api/layoutAdmin/getLayoutList`;
export const API_URL_LAYOUT_ADMIN_SIMPLE_INFO = `${HOST}/api/layoutAdmin/getLayoutWithSimple`;
export const API_URL_LAYOUT_ADMIN_SIMPLE_UPDATE = `${HOST}/api/layoutAdmin/updateLayoutWithSimple`;
export const API_URL_LAYOUT_ADMIN_PAGEINFO = `${HOST}/api/layoutAdmin/getLayoutWithPage`;
export const API_URL_LAYOUT_ADMIN_UNSPLASH_SEARCH = `${HOST}/api/layoutAdmin/searchUnsplash`;


// 사용자
export const API_URL_LAYOUT_SITE_DATA = `${HOST}/api/layout/getLayoutSiteData`;

/**
 * @ 메뉴.기본설정
 */
export const API_URL_CONFIG_ADMIN_UPDATE = `${HOST}/api/configAdmin/updateConfig`;
export const API_URL_CONFIG_ADMIN_GETINFO = `${HOST}/api/configAdmin/getConfig`;


/**
 * @ 메타버스
 */
export const API_URL_METABUS_CATEGORY_ADMIN_UPDATE = `${HOST}/api/metabusAdmin/updateCategory`;
export const API_URL_METABUS_CATEGORY_ADMIN_INFO = `${HOST}/api/metabusAdmin/getCategory`;
export const API_URL_METABUS_ITEM_ADMIN_REGIST_INFO = `${HOST}/api/metabusAdmin/getItemRegist`;
export const API_URL_METABUS_ITEM_ADMIN_REGIST = `${HOST}/api/metabusAdmin/updateItem`;
export const API_URL_METABUS_ITEM_ADMIN_LIST = `${HOST}/api/metabusAdmin/getItemList`;
export const API_URL_METABUS_ITEM_ADMIN_DELETE = `${HOST}/api/metabusAdmin/deleteItem`;
export const API_URL_METABUS_WORLD_HOME_ADMIN_LIST = `${HOST}/api/metabusAdmin/getWorldHomeList`;
export const API_URL_METABUS_ITEM_ADMIN_BUY_LIST = `${HOST}/api/metabusAdmin/getItemBuyLIst`;
export const API_URL_METABUS_WORLD_HOME_ADMIN_BUY_LIST = `${HOST}/api/metabusAdmin/getWorldHomeBuyLIst`;
export const API_URL_METABUS_ITEM_ADMIN_PRESENT_LIST = `${HOST}/api/metabusAdmin/getItemPresentLIst`;


/**
 * @ 방송
 */


export const API_URL_BROADCAST_NAME_CHECK = `${HOST}/api/broadcast/getNameCheck`;
export const API_URL_BROADCAST_UPDATE = `${HOST}/api/broadcast/updateBroadcast`;
export const API_URL_BROADCAST_GET_MY_BROADCASTINFO = `${HOST}/api/broadcast/getMyBroadcastInfo`;
export const API_URL_BROADCAST_GET_BROADCASTINFO = `${HOST}/api/broadcast/getBroadcastInfo`;

export const API_URL_BROADCAST_LIST_BY_VTYPE = `${HOST}/api/broadcast/getBroadcastListByVtype`;


export const API_URL_BROADCAST_LIVE_INSERT = `${HOST}/api/broadcastLive/insertLive`;
export const API_URL_BROADCAST_LIVE_DELETE = `${HOST}/api/broadcastLive/deleteLive`;
export const API_URL_BROADCAST_LIVE_MYLIST = `${HOST}/api/broadcastLive/getMyLiveList`;
export const API_URL_BROADCAST_LIVE_INFO = `${HOST}/api/broadcastLive/getLive`;
export const API_URL_BROADCAST_LIVE_INFO_WITH_OWNER = `${HOST}/api/broadcastLive/getLiveWithOwner`;
export const API_URL_BROADCAST_LIVE_UPDATE = `${HOST}/api/broadcastLive/updateLive`;
export const API_URL_BROADCAST_LIVE_ALL_INFO = `${HOST}/api/broadcastLive/getAllLive`;
export const API_URL_BROADCAST_LIVE_INFO_WITH_STATUS_ING = `${HOST}/api/broadcastLive/getAllLiveWithStatusIng`;
export const API_URL_BROADCAST_LIVE_INVITED_USER = `${HOST}/api/broadcastLive/sendInvitedUser`;

export const API_URL_BROADCAST_LIVE_INFO_BY_VIDEOID = `${HOST}/api/broadcastLive/getLiveByVideoId`;
export const API_URL_BROADCAST_LIVE_END = `${HOST}/api/broadcastLive/endLive`;

// 시험
export const API_URL_BROADCAST_LIVE_EXAM_EXCEL_INSERT = `${HOST}/api/broadcastExam/insertExcel`;
export const API_URL_BROADCAST_LIVE_EXAM_DIRECT_INSERT = `${HOST}/api/broadcastExam/insertDirect`;
export const API_URL_BROADCAST_LIVE_GET_EXAM = `${HOST}/api/broadcastExam/getExamData`;
export const API_URL_BROADCAST_LIVE_ALL_DATA_LIST = `${HOST}/api/broadcastExam/getExamListByGno`;

export const API_URL_BROADCAST_LIVE_EXAM_LIST = `${HOST}/api/broadcastExam/getExamList`;
export const API_URL_BROADCAST_LIVE_UPDATE_EXAM_STATUS = `${HOST}/api/broadcastExam/updateExamStatus`;
export const API_URL_BROADCAST_LIVE_EXAM_REPLY_INSERT = `${HOST}/api/broadcastExam/insertExamReply`;
export const API_URL_BROADCAST_LIVE_EXAM_AFTER_LIST = `${HOST}/api/broadcastExam/getExamAfterList`;
export const API_URL_BROADCAST_LIVE_EXAM_AFTER_DELETE = `${HOST}/api/broadcastExam/deleteExamAfter`;
export const API_URL_BROADCAST_LIVE_GET_EXAM_USER_LIST = `${HOST}/api/broadcastExam/getExamWithUser`;
export const API_URL_BROADCAST_LIVE_GET_EXAM_USER_REPORT = `${HOST}/api/broadcastExam/getExamWithUserReport`;
//퀴즈
export const API_URL_BROADCAST_LIVE_QUIZ_INSERT = `${HOST}/api/broadcastQuiz/insertQuiz`;
export const API_URL_BROADCAST_LIVE_QUIZ_INFO = `${HOST}/api/broadcastQuiz/getQuiz`;
export const API_URL_BROADCAST_LIVE_QUIZ_REPLY_INSERT = `${HOST}/api/broadcastQuiz/insertQuizReply`;
export const API_URL_BROADCAST_LIVE_QUIZ_AFTER_LIST = `${HOST}/api/broadcastQuiz/getQuizAfterList`;
export const API_URL_BROADCAST_LIVE_QUIZ_AFTER_DELETE = `${HOST}/api/broadcastQuiz/deleteQuizAfter`;
export const API_URL_BROADCAST_LIVE_QUIZ_AFTER_USER_REPORT = `${HOST}/api/broadcastQuiz/getQuizWithUserReport`;


//설문조사
export const API_URL_BROADCAST_LIVE_POLL_INSERT = `${HOST}/api/broadcastPoll/updatePoll`;
export const API_URL_BROADCAST_LIVE_POLL_LIST = `${HOST}/api/broadcastPoll/getPollListByGno`;
export const API_URL_BROADCAST_LIVE_UPDATE_POLL_STATUS = `${HOST}/api/broadcastPoll/updatePollStatus`;
export const API_URL_BROADCAST_LIVE_POLL_REPLY_INSERT = `${HOST}/api/broadcastPoll/insertPollReply`;
export const API_URL_BROADCAST_LIVE_POLL_AFTER_INFO = `${HOST}/api/broadcastPoll/getPollWithUser`;
export const API_URL_BROADCAST_LIVE_POLL_AFTER_WITH_USER_LIST = `${HOST}/api/broadcastPoll/getPollWithUserList`;
export const API_URL_BROADCAST_LIVE_POLL_AFTER_WITH_USER_INFO = `${HOST}/api/broadcastPoll/getPollWithUserInfo`;


// 투표
export const API_URL_BROADCAST_LIVE_VOTE_INSERT = `${HOST}/api/broadcastVote/updateVote`;
export const API_URL_BROADCAST_LIVE_VOTE_LIST = `${HOST}/api/broadcastVote/getVoteListByGno`;
export const API_URL_BROADCAST_LIVE_UPDATE_VOTE_STATUS = `${HOST}/api/broadcastVote/updateVoteStatus`;
export const API_URL_BROADCAST_LIVE_VOTE_REPLY_INSERT = `${HOST}/api/broadcastVote/insertVoteReply`;
export const API_URL_BROADCAST_LIVE_VOTE_AFTER_INFO = `${HOST}/api/broadcastVote/getVoteWithUserInfo`;


// 사용자 응답
export const API_URL_BROADCAST_LIVE_USER_RESPONSE_INFO = `${HOST}/api/broadcastLive/getUserResponse`;

// 사용자 정보 등록
export const API_URL_BROADCAST_LIVE_USER_JOIN = `${HOST}/api/broadcastLive/insertLiveUser`;
export const API_URL_BROADCAST_LIVE_USER_OUT = `${HOST}/api/broadcastLive/outLiveUser`;
export const API_URL_BROADCAST_LIVE_END_USER_INFO = `${HOST}/api/broadcastLive/getLiveUserInfo`;


export const API_URL_BROADCAST_LIVE_BAD_REPORT_INSERT = `${HOST}/api/broadcastLive/insertBadReport`;

// 채팅
export const API_URL_BROADCAST_LIVE_CHAT_AFTER_LIST = `${HOST}/api/broadcastLive/getChatInfo`;

// 자료 //
export const API_URL_BROADCAST_LIVE_DATA_FILE_INSERT = `${HOST}/api/broadcastData/insertFile`;
export const API_URL_BROADCAST_LIVE_DATA_ALL_LIST = `${HOST}/api/broadcastData/getAllData`;
export const API_URL_BROADCAST_LIVE_DATA_INFO = `${HOST}/api/broadcastData/getData`;
export const API_URL_BROADCAST_LIVE_DATA_DELETE = `${HOST}/api/broadcastData/deleteData`;
export const API_URL_BROADCAST_LIVE_DATA_LIST = `${HOST}/api/broadcastData/getDataList`;
export const API_URL_BROADCAST_LIVE_DATA_FILE_SHARE = `${HOST}/api/broadcastData/updateDataShare`;
export const API_URL_BROADCAST_LIVE_DATA_AFTER_LIST = `${HOST}/api/broadcastData/getDataShareList`;


// 게시판
export const API_URL_BROADCAST_LIVE_BOARD_INFO = `${HOST}/api/broadcastBoard/getBoardByGno`;
export const API_URL_BROADCAST_LIVE_BOARD_UPDATE = `${HOST}/api/broadcastBoard/updateBoard`;
export const API_URL_BROADCAST_LIVE_BOARD_ARTICLE_INFO = `${HOST}/api/broadcastBoard/getArticle`;
export const API_URL_BROADCAST_LIVE_BOARD_ARTICLE_UPDATE = `${HOST}/api/broadcastBoard/updateArticle`;
export const API_URL_BROADCAST_LIVE_BOARD_ARTICLE_LIST = `${HOST}/api/broadcastBoard/getArticleList`;
export const API_URL_BROADCAST_LIVE_BOARD_ARTICLE_VIEW_INFO = `${HOST}/api/broadcastBoard/getArticleView`;
export const API_URL_BROADCAST_LIVE_BOARD_REPLE_UPDATE = `${HOST}/api/broadcastBoard/updateReple`;
export const API_URL_BROADCAST_LIVE_BOARD_REPLE_LIST = `${HOST}/api/broadcastBoard/getRepleList`;
export const API_URL_BROADCAST_LIVE_BOARD_REPLE_DELETE = `${HOST}/api/broadcastBoard/deleteReple`;
export const API_URL_BROADCAST_LIVE_BOARD_ARTICLE_DELETE = `${HOST}/api/broadcastBoard/deleteArticle`;
export const API_URL_BROADCAST_LIVE_BOARD_ARTICLE_LIST_WIDTH_BOARDINFO = `${HOST}/api/broadcastBoard/getArticleListWithBoardInfo`;


/**
 * @ BJ 게시판
 */
export const API_URL_USER_BOARD_UPDATE = `${HOST}/api/userBoard/updateUserBoard`;
export const API_URL_USER_BOARD_REGIST_INFO = `${HOST}/api/userBoard/getRegistUserBoardInfo`;
export const API_URL_USER_BOARD_ARTICLE_LIST_BYUID = `${HOST}/api/userBoard/getArticleListByUid`;
export const API_URL_USER_BOARD_ARTICLE_REGIST_INFO = `${HOST}/api/userBoard/getArticleRegistInfo`;
export const API_URL_USER_BOARD_ARTICLE_REGIST = `${HOST}/api/userBoard/registArticle`;
export const API_URL_USER_BOARD_ARTICLE_LIST = `${HOST}/api/userBoard/getArticleList`;
export const API_URL_USER_BOARD_ARTICLE_LIKE_UPDATE = `${HOST}/api/userBoard/updateArticleLike`;
export const API_URL_USER_BOARD_ARTICLE_DELETE = `${HOST}/api/userBoard/deleteArticle`;

/**
 * @ BJ 사진첩
 */

export const API_URL_USER_PHOTO_UPDATE = `${HOST}/api/userPhoto/updateUserPhoto`;
export const API_URL_USER_PHOTO_ARTICLE_LIST_BYUID = `${HOST}/api/userPhoto/getArticleListByUid`;
export const API_URL_USER_PHOTO_ARTICLE_REGIST_INFO = `${HOST}/api/userPhoto/getArticleRegistInfo`;
export const API_URL_USER_PHOTO_ARTICLE_REGIST = `${HOST}/api/userPhoto/registArticle`;
export const API_URL_USER_PHOTO_ARTICLE_LIST = `${HOST}/api/userPhoto/getArticleList`;
export const API_URL_USER_PHOTO_ARTICLE_LIKE_UPDATE = `${HOST}/api/userPhoto/updateArticleLike`;
export const API_URL_USER_PHOTO_ARTICLE_DELETE = `${HOST}/api/userPhoto/deleteArticle`;


/**
 * @ BJ 모임
 */

export const API_URL_MEET_UPDATE = `${HOST}/api/meeting/updateMeeting`;
export const API_URL_MEET_INFO = `${HOST}/api/meeting/getMeeting`;
export const API_URL_MEET_LIST = `${HOST}/api/meeting/getMeetingList`;
export const API_URL_MEET_JOIN_INSERT = `${HOST}/api/meeting/joinMeet`;
export const API_URL_MEET_JOIN_LIST = `${HOST}/api/meeting/joinList`;
export const API_URL_MEET_DELETE = `${HOST}/api/meeting/deleteMeeting`;


/**
 * @ BJ 배너
 */
export const API_URL_BANNER_USER_SETTING = `${HOST}/api/banner/userSetting`;
export const API_URL_BANNER_USER_SETTING_INFO = `${HOST}/api/banner/getUserSetting`;
export const API_URL_BANNER_USER_APPLY = `${HOST}/api/banner/applyUserBanner`;
export const API_URL_BANNER_USER_PAYMENT_LIST = `${HOST}/api/banner/getUserBannerPaymentList`;
export const API_URL_BANNER_USER_MYBANNER_LIST = `${HOST}/api/banner/getUserBannerMyBannerList`;
export const API_URL_BANNER_USER_UPDATE_GIVEW = `${HOST}/api/banner/updateUserBannerGivew`;
export const API_URL_BANNER_USER_REQUIRED_SETTLE = `${HOST}/api/banner/requirePaymentSettle`;

//관리자
export const API_URL_BANNER_ADMIN_PAYMENT_LIST = `${HOST}/api/bannerAdmin/paymentList`;
export const API_URL_BANNER_ADMIN_UPDATE_SETTLE = `${HOST}/api/bannerAdmin/updatePaymentSettle`;


/**
 * @ 채팅
 */
export const API_URL_MESSAGE_INSERT = `${HOST}/api/message/insertMessage`;
export const API_URL_MESSAGE_GET_INTRO = `${HOST}/api/message/getMessageIntro`;
export const API_URL_MESSAGE_GET_LIST = `${HOST}/api/message/getChatList`;
export const API_URL_GET_MESSAGE_BY_USER = `${HOST}/api/message/getMessageByUser`;
export const API_URL_GET_MESSAGE_BY_ADMIN = `${HOST}/api/message/getMessageByAdmin`;
export const API_URL_MESSAGE_GET_MEMBER_LIST = `${HOST}/api/message/getChatMember`;
export const API_URL_MESSAGE_INSERT_IMG = `${HOST}/api/message/insertMessageByImg`;
export const API_URL_MESSAGE_USER_OUT = `${HOST}/api/message/userRoomOut`;
export const API_URL_MESSAGE_SEARCH_DATA = `${HOST}/api/message/searchArticle`;
export const API_URL_MESSAGE_UPDATE_YOUTUBE_LIST = `${HOST}/api/message/updateYoutubeList`;
export const API_URL_MESSAGE_UPDATE_YOUTUBE_INFO = `${HOST}/api/message/getYoutubeInfo`;


/// 쪽지 보내기
export const API_URL_PAPER_MESSAGE_INSERT = `${HOST}/api/paperMessage/insertData`;
export const API_URL_PAPER_MESSAGE_MY_LIST = `${HOST}/api/paperMessage/getMyList`;
export const API_URL_PAPER_MESSAGE_MY_LIST_VIEW = `${HOST}/api/paperMessage/getMyListView`;

////// 타임라인
export const API_URL_USER_TIMELINE_LIST_BYUID = `${HOST}/api/timeline/getTimelineListByUid`;
export const API_URL_USER_TIMELINE_REGIST_INFO = `${HOST}/api/timeline/getTimeline`;
export const API_URL_USER_TIMELINE_REGIST = `${HOST}/api/timeline/updateTimeline`;
export const API_URL_USER_TIMELINE_LIKE_UPDATE = `${HOST}/api/timeline/updateTimelineLike`;
export const API_URL_USER_TIMELINE_DELETE = `${HOST}/api/timeline/deleteTimeline`;


////// 구독자
export const API_URL_MESSAGE_USER_UPDATE = `${HOST}/api/message/updateChatUser`;


/**
 * 메타버스
 **/
export const API_URL_METABUS_GET_USER_CHARACTER = `${HOST}/api/metabus/getMetabusUserCharacter`;
export const API_URL_METABUS_GET_ITEM_LIST = `${HOST}/api/metabus/getItemList`;
export const API_URL_METABUS_GET_ITEM_LIST_WITH_CONFIG = `${HOST}/api/metabus/getItemListWithConfig`;
export const API_URL_METABUS_GET_ITEM_INFO = `${HOST}/api/metabus/getItemInfo`;
export const API_URL_METABUS_GET_ITEM_INFO_BY_CODE = `${HOST}/api/metabus/getItemInfoByCode`;
export const API_URL_METABUS_GET_ITEM_BUY_GOODS = `${HOST}/api/metabusPayment/buyItem`;
export const API_URL_METABUS_GET_ITEM_BUY_HOME = `${HOST}/api/metabusPayment/buyHome`;
export const API_URL_METABUS_GET_ITEM_PRESENT_GOODS = `${HOST}/api/metabusPayment/presentItem`;
export const API_URL_METABUS_GET_ITEM_APPLY = `${HOST}/api/metabusPayment/applyItem`;
export const API_URL_METABUS_PRESENT_IMMEDIATELY_APPLY = `${HOST}/api/metabusPayment/applyPresentImmediately`;



/**
 * 덕쿠 링크
 **/

/**
 *  링크
 * */
export const API_URL_LINK_LINK_UPDATE = `${HOST}/api/link/updateLinkUrl`;
export const API_URL_LINK_LINK_INFO = `${HOST}/api/link/getInfo`;
export const API_URL_LINK_LINK_CHATBOT_LIST = `${HOST}/api/link/getChatbotList`;
export const API_URL_LINK_CHATBOT_UPDATE = `${HOST}/api/link/updateChatbot`;
export const API_URL_LINK_USERACCOUNT_UPDATE = `${HOST}/api/link/updateUserAccount`;
export const API_URL_LINK_SHOPUSE_UPDATE = `${HOST}/api/link/updateShopUse`;





export const youtubeTypeList = [
	{text: '뉴스/정치', value: 'a'},
	{text: '뷰티/패션', value: 'b'},
	{text: '코미디', value: 'c'},
	{text: '스포츠', value: 'd'},
	{text: '음악', value: 'e'},
	{text: '기술', value: 'f'},
	{text: '게임', value: 'g'},
	{text: '요리/건강', value: 'h'},
	{text: '영화/엔터테인먼트', value: 'i'},
]

export const CONFIG_HEADER = {
	'Content-Type': 'application/json;charset=UTF-8'
};

export const CONFIG_HEADER_DEFAULT = {
	AUTHTOKEN: '',
	APIKEY: '',
	
};
export const CONFIG_HEADER_POST = {
	AUTHTOKEN: '',
	APIKEY: '',
	'Content-Type': 'application/json;charset=UTF-8'
};

export const CONFIG_HEADER_FORM = {
	AUTHTOKEN: '',
	APIKEY: '',
	'Content-Type': 'multipart/form-data;charset=utf-8;'
	
};


