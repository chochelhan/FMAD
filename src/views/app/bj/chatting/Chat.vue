<template>
    <div :class="'chatting-container '+mobileClass" id='chat-search-container'>
        <div class="chat-header">
            <div class="chat-search-back" v-if="chatSearchView">
                <i class="fas fa-chevron-left" @click="chatSearchBack()"></i>
            </div>
            <div class="chat-title">{{chatTitle}}</div>
            <div class="chat-search">
                <div class="chat-box">
                    <input type="text" id="searchKeyword" class="inputBox" v-model="keyword">
                    <i class="fas fa-search" @click="searchWord()"></i>
                </div>
            </div>
            <div class="chat-menu" v-if="!chatSearchView">
                <i class="fas fa-ellipsis-v" @click="settingView=true"></i>
            </div>
        </div>
        <div id="chatLayout">
            <div class="notice-box" v-if="notice.no">
                <div class="notice-info">
                    <div class="icon">
                        <i class="fas fa-bullhorn"></i>
                    </div>
                    <div class="msg" v-html="noticeMsg">
                    </div>

                    <div class="arrow" @click="toggleNotice()">
                        <i class="fas fa-chevron-down"></i>
                    </div>
                </div>
                <ul class="notice-button">
                    <li @click="hideNoticeBox()">다시 열지 않음</li>
                    <li @click="toggleNoticeBox()">접어두기</li>
                </ul>
            </div>
            <div class="notice-pre-icon" v-if="notice.no" @click="toggleNoticeBox()">
                <i class="fas fa-bullhorn"></i>
            </div>
            <div id="data-container">
                <ul class="data-content" id="no-data-result">
                    <li>
                        <div style="text-align:center;padding-top:300px;font-weight:bold;">검색결과가 존재하지 않습니다</div>
                    </li>
                </ul>
                <ul class="data-content" id="is-data-result">
                    <li v-for="(data,dataIndex) in messageList" :class="dataIndex+'item'">
                        <div class="main-3 divide-line" v-if="data.divide_date">
                            <span>{{data.divide_date}}</span>
                        </div>
                        <div class="main-3" v-if="data.userType=='new'">
                            <div class="enter">
                                {{data.msg}}
                            </div>
                        </div>
                        <div class="main-3" v-else-if="data.userType=='out'">
                            <div class="out">
                                {{data.msg}}
                            </div>
                        </div>

                        <div v-else-if="data.userType=='other'" class="main-1">
                            <div class="box-left">
                                <img v-if="data.photo" :src="host+data.photo"/>
                                <i v-else class="fa fa-user"></i>
                            </div>
                            <div class="box-right">
                                <div class="box-top">
                                    <ul>
                                        <li>{{data.name}}</li>
                                        <li>{{data.gtime}}</li>
                                    </ul>
                                </div>
                                <div class="iconBox" v-if="data.icon">
                                    <img :src="host+iconList[data.icon]"/>
                                </div>
                                <div v-if="data.msg" class="box-bottom">
                                    <div class="box-img">
                                        <img src="../../../../assets/img/img_cbt_f.png">
                                    </div>
                                    <div class="box-content" v-html="data.msg">
                                    </div>

                                </div>
                                <div class="imgBox" v-if="data.img">
                                    <img :src="host+data.img"/>
                                </div>

                            </div>
                        </div>
                        <div v-else-if="data.userType=='me' || data.userType=='greet'" class="main-2">
                            <p class="aa">{{data.gtime}}</p>
                            <div class="iconBox" v-if="data.icon">
                                <img :src="host+iconList[data.icon]"/>
                            </div>
                            <div class="box-big" v-if="data.msg">

                                <div class="box-aa" v-html="data.msg">
                                </div>
                                <div class="box-img-cc">
                                    <img src="../../../../assets/img/img_cbt_me.png">
                                </div>
                            </div>
                            <div class="imgBox" v-if="data.img">
                                <img class="readyimg" :src="host+data.img"/>

                            </div>
                        </div>
                        <div v-else-if="data.userType=='service'" class="service">
                            <div v-if="data.result=='ready'" class="progress-box">
                                <v-progress-circular
                                    indeterminate
                                    color="purple"
                                ></v-progress-circular>

                            </div>
                            <div v-else>
                                <div class="main-1">
                                    <div class="box-left">
                                        <img v-if="data.photo" :src="host+data.photo"/>
                                        <i v-else class="fa fa-user"></i>
                                    </div>

                                    <div class="box-right">
                                        <div class="box-top">
                                            <ul>
                                                <li>{{data.name}}</li>
                                                <li>{{data.gtime}}</li>
                                            </ul>
                                        </div>
                                        <div class="box-bottom">
                                            <div class="box-img">
                                                <img src="../../../../assets/img/img_cbt_ai.png">
                                            </div>
                                            <div class="box-content" v-html="data.response">
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="service-box" v-if="data.serviceDataList.length>0 || data.stype=='who'">
                                    <div class="pushbutton-box" v-if="data.stype=='who'">
                                        <button class="pushButton md-raised" @click="sendAllPush(data.no)">모두에게 보내기
                                        </button>
                                        <button class="pushButton md-raised" @click="sendUserPush(data.no)">선택해서
                                            보내기
                                        </button>
                                    </div>
                                    <div class="searchResult-box" v-if="data.serviceDataList.length>0">
                                        <div v-if="data.type=='youtube'" class="swiper-container">
                                            <swiper :options="swiperOption">
                                                <swiper-slide v-for="item,index in data.serviceDataList">
                                                    <div class="data-box" @click="fullVideo(item.id.videoId)">
                                                        <div class="img">
                                                            <img class="readyimg"
                                                                 :src="item.snippet.thumbnails.medium.url">
                                                        </div>
                                                        <div class="gtitle">
                                                            {{getStrCut(item.snippet.title,25)}}
                                                        </div>
                                                        <div class="rdate">
                                                            {{item.rdate}} | YOUTUBE
                                                        </div>
                                                    </div>
                                                </swiper-slide>
                                            </swiper>
                                        </div>
                                        <div v-else-if="data.type=='board'">
                                            <div class="board-box">
                                                <div class="list-box">
                                                    <div class="list" v-for="item,index in data.boardList"
                                                         @click="goArticle(data.type,item)">
                                                        <div :class="'info-box '+((item.imgs)?'':'alone')">
                                                            <div class="gtitle">{{getStrCut(item.subject,30)}}
                                                            </div>
                                                            <div class="rdate">
                                                                {{item.rdate}} | {{item.userName}}
                                                            </div>
                                                        </div>
                                                        <div class="img-box" v-if="item.imgs">
                                                            <img :src="host+item.imgs">
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="more-button"
                                                     v-if="data.serviceDataList.length>4 && !data.moreButtonView"
                                                     @click="moreBoardData(dataIndex)">
                                                    더보기
                                                </div>
                                            </div>

                                        </div>
                                        <div v-else-if="data.type=='greet'">
                                            <div class="greet-box" v-if="data.greetType=='init'">
                                                <ul class="greet-list">
                                                    <li v-for="item,index in data.serviceDataList"
                                                        @click="greetChoice(item)">{{item.name}}
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                        <div v-else class="swiper-container">

                                            <swiper :options="swiperOption">
                                                <swiper-slide v-for="item,index in data.serviceDataList">
                                                    <div :class="'data-box '+data.type"
                                                         @click="goArticle(data.type,item)">
                                                        <div class="img">
                                                            <img class="readyimg" v-if="item.imgs"
                                                                 :src="host+item.imgs">
                                                        </div>
                                                        <div class="gtitle">
                                                            {{getStrCut(item.subject,25)}}
                                                        </div>
                                                        <ul v-if="data.type=='meet'" class="meet-info">
                                                            <li><img src="../../../../assets/img/ico_m1.png">{{item.gdate}}
                                                            </li>
                                                            <li><img src="../../../../assets/img/ico_m2.png">{{item.garea}}
                                                            </li>
                                                            <li><img src="../../../../assets/img/ico_m3.png">{{item.price}}
                                                            </li>
                                                        </ul>
                                                        <div v-else class="rdate">
                                                            {{item.rdate}} | {{item.userName}}
                                                        </div>
                                                    </div>
                                                </swiper-slide>
                                            </swiper>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </li>
                </ul>
                <div class="no-read-box" v-if="noReadMsgView">
                    <div class="no-read-item" @click="goDown()">
						 <span class="box-left">
						 	  <img v-if="noReadMsg.photo" :src="host+noReadMsg.photo"/>
							  <i v-else class="fa fa-user"></i>
						 </span>
                        <span class="name">
									{{noReadMsg.name}}
						 </span>
                        <span v-if="noReadMsg.msg" class="msg">
								{{noReadMsg.msg}}
						 </span>
                        <span v-else class="msg">
								새로운 메세지
						 </span>
                        <span class="gobox">
							<i class="fas fa-caret-square-down"></i>
						 </span>

                    </div>
                </div>
            </div>
            <div class="footer" :style="{'width':fixedBottomWidth}" v-if="!chatSearchView">
                <div v-if="iconChoiceView" class="iconChoiceBox">
                    <i class="fa fa-times" @click="iconChoiceView=false"></i>
                    <img :src="choiceIconSrc">
                </div>
                <form novalidate @submit.prevent="formSubmit">
                    <ul class="inform-box">
                        <li class="fileBox">
                            <input type="file" ref="imgContainer" @change="imgPaste" id="img" accept="image/*">
                            <img src="../../../../assets/img/btn-img1.png">
                        </li>
                        <li class="textbox"><input type="text" placeholder="메시지를 입력하세요" v-model="messageText"/></li>
                        <!--li><img src="../../../../assets/img/btn-emo.png" @click="showIcon()"></li-->
                        <li><img src="../../../../assets/img/btn-send1.png" @click="formSubmit()"></li>
                    </ul>
                </form>
                <ul class="icon-box" v-if="iconView">
                    <li v-for="icon,key in iconList">
                        <img @click="choiceIcon(key)" :src="host+icon"/>
                    </li>
                </ul>

            </div>
            <div class="footer" :style="{'width':fixedBottomWidth}" v-if="chatSearchView && searchResult">
                <ul class="search-updn-box">
                    <li @click="searchResultList('up')">
                        <i class="fas fa-chevron-up"></i>
                    </li>
                    <li class="textbox">{{showIndex}}/{{totalIndex}}</li>
                    <li @click="searchResultList('dn')">
                        <i class="fas fa-chevron-down"></i>
                    </li>
                </ul>
            </div>
        </div>
        <v-dialog
            v-model="settingView"
            width="380"
            style="z-index:100;"
        >
            <div :class="'md-drawer '+mobileClass">
                <div class="main-box">
                    <div class="box-screelayout-list">
                        <ul>
                            <li @click="gpushToggle()" v-if="pushView"><img
                                src="../../../../assets/img/ico-bell.png"><span class="text">채팅 알림</span><span
                                :class="'font-aa '+noPushClass">{{pushMsg}}</span></li>
                            <li v-else><i class="fa fa-star" style='font-size:13pt;'></i><span class="text">{{gInfo.name}} 채팅방</span>
                            </li>
                            <li @click="search()"><img src="../../../../assets/img/ico-saerch.png"><span
                                class="text">검색</span></li>
                            <li @click="urlCopy()"><img src="../../../../assets/img/ico-link.png"><span class="text">채팅방 주소복사</span>
                            </li>
                            <!--li v-if="gUserInfo.gmanager=='admin'" @click="sendPush()"><img
                                src="../../../../assets/img/ico_pm.png"><span class="text">푸쉬 보내기</span></li-->
                            <!--li v-if="gUserInfo.gmanager=='admin'" @click="writeNotice()"><i style='font-size:13pt;'
                                                                                             class="fas fa-bullhorn"></i><span
                                class="text">공지</span></li-->
                            <li>
                                <div class="chat-member-box">
                                    <div class="chat-member-title">대화 멤버 <span>{{onShowMemberList.length}}</span></div>
                                    <div class="more" @click="goChatMember()">모두보기 <i class="fas fa-chevron-right"></i>
                                    </div>
                                </div>
                                <div class="chat-member-list">
											<span v-for="member in onShowMemberList" :class="'member '+member.gclass">
												<div class="photo">
													<img :src="host+member.photo" v-if="member.photo"/>
													<i v-else class="fa fa-user"></i>
												</div>
												<div class="my"></div>
											</span>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div class="footer-box">
                        <ul>
                            <li @click="roomOut()"><img src="../../../../assets/img/ico-out.png"> <span
                                style='position:relative;top:2px;margin-left:10px;'>나가기</span></li>
                        </ul>
                    </div>
                </div>

            </div>
        </v-dialog>
        <v-dialog
            v-model="componentModalShow"
            width="380"
            style="z-index:100;background:#fff;"
        >
            <chatMember v-if="memberView" :ownerUid="ownerUid" @hideMember="memberListAction"></chatMember>
            <sendMessage v-if="messageView" :ownerUid="ownerUid" :sendUid="memberInfo.uid"
                         :targetMember="paperMessageTargetMember" @hideMessage="messageAction"></sendMessage>
        </v-dialog>
        <v-dialog
            v-model="dataModalShow"
            :width="dataModalWidth"
            persistent
            style="z-index:100;"
        >
            <meetView :no="selectedNo" v-if="meetViewShow" @modalHide="modalHide"></meetView>
            <div class="modalBox" v-if="boardViewShow">
                <div class="modal-header">
                    <div class="mod-title">게시판</div>
                    <div class="close" @click="dataModalShow=false"><i class="fa fa-times"></i></div>

                </div>
                <div class="modal-content">
                    <userBoardView :selectedNo="selectedNo" :acceptType="'chat'" @modalHide="modalHide"></userBoardView>
                </div>
            </div>
            <div class="modalBox" v-if="photoViewShow">
                <div class="modal-header">
                    <div class="mod-title">사진첩</div>
                    <div class="close" @click="dataModalShow=false"><i class="fa fa-times"></i></div>

                </div>
                <div class="modal-content">

                    <userPhotoView :selectedNo="selectedNo" :acceptType="'chat'" @modalHide="modalHide"></userPhotoView>
                </div>
            </div>
            <div class="modalBox" v-if="videoViewShow">
                <div class="modal-header">
                    <div class="mod-title">동영상</div>
                    <div class="close" @click="dataModalShow=false"><i class="fa fa-times"></i></div>

                </div>
                <div class="modal-content" style="padding:0;overflow-x:hidden;">
                    <videoView :selectedVid="selectedVid" @modalHide="modalHide"></videoView>

                </div>
            </div>

        </v-dialog>
        <iframe id="jsonRpcFrame" :src="jsonRpcUrl" scrolling="0"></iframe>
    </div>

</template>

<script>
	import {mapActions, mapGetters} from "vuex";
	import JQ from 'jquery'
	import AUTH from '../../../../api/auth'
	import UTIL from '../../../../api/util'
	import {
		HOST,
		API_URL_MESSAGE_INSERT,
		API_URL_MESSAGE_GET_INTRO,
		API_URL_MESSAGE_GET_LIST,
		API_URL_MESSAGE_INSERT_IMG,
		API_URL_MESSAGE_USER_OUT,
		API_URL_MESSAGE_SEARCH_DATA,
		API_URL_MESSAGE_UPDATE_YOUTUBE_LIST,
		API_URL_MESSAGE_UPDATE_YOUTUBE_INFO,
	} from '../../../../api/urls';
	import apiService from '../../../../api/apiService';
	import jsonRpcService from '../../../../api/jsonRpcService';
	import chatMember from './ChatMember'
	import sendMessage from './SendMsg'
	import meetView from '../meeting/meetView'
	import userBoardView from '../board/userBoardView'
	import userPhotoView from '../photo/userPhotoView'
	import videoView from '../../main/videoView'

	export default {
		name: 'GuildChat',
		components: {
			chatMember,
			sendMessage,
			meetView,
			userBoardView,
			userPhotoView,
			videoView,

		},
		computed: {
			...mapGetters('etc', ["getUid", "getBroadcastInfo"]),
		},
		data() {

			return {
                mobileView: false,
                mobileClass: '',
				host: HOST,
				DEBUG: true,
				chatTitle: '',
				youtubeKey: '',
				gno: '',
				ownerUid: '',
				ownerNo: '',
				gInfo: {},
				gUserInfo: {},
				messageList: [],
				noReadMsgView: false,
				noReadMsg: {},
				scrollAction: true,
				settingView: false,
				settingViewAfter: false,
				socket: null,
				userList: {},
				dbLoad: false,
				memberInfo: {},
				isLogin: false,
				iconList: {},
				iconView: false,
				iconChoiceView: false,
				choiceIconSrc: '',
				iconKey: '',
				chatSearchView: false,
				nowdate: new Date(),
				pushMsg: '켜짐',
				noPushClass: '',
				weekList: {0: '일요일', 1: '월요일', 2: '화요일', 3: '수요일', 4: '목요일', 5: '금요일', 6: '토요일'},
				onMemberList: {},
				onShowMemberList: [],
				chatUid: '',
				pushStats: '',
				total_page: 0,
				page: 1,
				chatTime: '',
				virtualProgress: false,
				serverFlag: false,
				scrollingStop: false,
				scrollTop: null,
				pushView: false,
				greetData: {},
				notice: {},
				greetAction: false,
				noticeSimple: true,
				noticeMsg: '',
				swiperOption: {
					slidesPerView: 'auto',
					freeMode: true,

				},
				memberView: false,
				componentModalShow: false,
				paperMessageTargetMember: {},
				messageView: false,
				keyword: '',
				fixedBottomWidth: '',
				messageText: '',
				firstInit: true,
				jsonRpcUrl: '',
				roomOutFlag: false,
				dataModalShow: false,
				selectedNo: '',
				meetViewShow: false,
				boardViewShow: false,
				photoViewShow: false,
				dataModalWidth: 600,
				indexKeyList: [],
				searchResult: false,
				currentIndex: '',
				totalIndex: '',
				showIndex: '',
				videoViewShow: false,
				selectedVid: '',

			}
		},

		watch: {
			iconChoiceView(sd) {
				if (!sd) {
					this.iconKey = '';
				}
			},
			dataModalShow(val) {
				if (!val) {
					this.meetViewShow = false;
					this.boardViewShow = false;
					this.photoViewShow = false;
					this.selectedNo = '';
					this.videoViewShow = false;
					this.selectedVid = '';

				}
			}

		},
		created() {
            if (this.$isMobile()) {
                this.mobileView = true;
                this.mobileClass = 'mobile'
            }
			this.ownerUid = this.getUid;
			if (!this.ownerUid) {
				let params = {
					content: "잘못된 접근입니다",
					doAction: () => {
						this.$router.push('/');
					}
				};
				this.$eventBus.$emit('dialogOpen', params);
				return;
			}
			let memberInfo = AUTH.getSession(this.$isMobile());
			if (memberInfo.AUTHTOKEN) {
				this.isLogin = true;
				this.memberInfo = memberInfo;
				if (location.host == 'localhost:8080') {
					this.getData();
				} else {
					jsonRpcService.sendType = 'chat';
					jsonRpcService.checkDebug();
					this.jsonRpcUrl = jsonRpcService.jsonRpcUrl + '/index?uid=' + this.memberInfo.uid;
					this.$eventBus.$on('chatRpcResponse', this.jsonRpcResponse);
				}
			} else {
				let params = {
					content: "먼저 로그인하세요",
				};
				this.$eventBus.$emit('modalOpen', params);
				return;


			}
			/*
			if(localStorage.getItem('device') == 'app_ios' || localStorage.getItem('device') == 'app_android') {
				this.pushView = true;
				//this.$store.commit('updatePushMessageView',false);
			}
			*/

		},
		methods: {
			...mapActions('etc', ["setChatMove"]),
			modalHide(cmd) {
				this.dataModalShow = false;


			},
			getData() {
				const frm = new FormData()
				frm.append('ownerUid', this.ownerUid)
				apiService.post(API_URL_MESSAGE_GET_INTRO, frm, (resp) => {
					if (resp.userDeny == 'noAuth' || resp.userDeny == 'noUser') {
						let params = {
							content: "먼저 구독신청하세요",
						};
						this.$eventBus.$emit('modalOpen', params);
						return;
					}
					jsonRpcService.jsonRpcConnect = true;
					this.chatInit(resp.gUserInfo.chatmode);

					if (this.getBroadcastInfo) {
						this.chatTitle = this.getBroadcastInfo.name;
					} else {
						this.chatTitle = resp.info.name;
					}


					if (resp.chatFirstRegdateCheck) {
						this.messageList.push(resp.chatFirstRegdate);
					}
					if (resp.chatTime) {
						this.virtualProgress = true;
						this.chatTime = resp.chatTime;

					}
					this.total_page = resp.total_page;
					this.ownerNo = resp.info.no;
					this.gUserInfo = resp.gUserInfo;
					this.dbLoad = (this.gUserInfo.chatmode == 'yes') ? 'old' : 'new';
					this.chatUid = resp.chatUid;
					this.youtubeKey = resp.youtubekey;
					//if (this.memberInfo.gpush == 'no' || this.gUserInfo.gpush == 'no') {
					this.pushMsg = '꺼짐';
					this.noPushClass = 'noPushGclass';
					//}
					this.userList = resp.userList;
					this.iconList = resp.iconList;

					let pushStats = this.parseData(resp, 'back');

					this.onMemberList = resp.onMemberList;
					this.parseOnMemberList()
					this.firstInit = false;

					/*
                    if (this.gUserInfo.gmanager == 'admin') {
                        this.pushStats = pushStats;
                    }

                    if (resp.notice.no) {
                        var data = localStorage.getObject('noticeHidden');
                        if (!data) {
                            data = {};

                        }
                        if (!data[this.gno]) {
                            data[this.gno] = {};
                        }
                        if (!data[this.gno][resp.notice.no]) {
                            this.notice = resp.notice;
                            this.noticeMsg = this.notice.msg;
                        }
                    }
                    */

				});
			},
			formSubmit() {
				if (!this.messageText) {
					return;
				}
				let message = this.messageText;
				//if (this.greetData.code == 'gpush') {
				//	this.pushStats = 'what';
				//}
				this.pushStats = '';

				const frm = new FormData()
				frm.append('ownerUid', this.ownerUid)
				frm.append('msg', this.messageText)
				frm.append('icon', '')
				frm.append('greetData', JSON.stringify(this.greetData))
				frm.append('pushStype', this.pushStats)

				this.checkDay();
				var gtime = this.checkTime();
				var item = {
					msg: this.nl2br(this.messageText),
					icon: this.iconKey,
					img: '',
					uid: this.memberInfo.uid,
					userType: 'me',
					gtime: gtime
				}
				this.messageList.push(item);

				this.iconChoiceView = false;
				this.choiceIconSrc = '';
				this.iconView = false;
				this.messageText = '';
				this.firstInit = false;
				JQ("#message").height(20);
				apiService.post(API_URL_MESSAGE_INSERT, frm, (response) => {
					let socketFlag = false;
					if (response.service) {
						if (response.service.type == 'gpush') {
							socketFlag = true;
						}
					}
					if (!socketFlag) {
						if (!this.greetData.code) {
							let socketParams = {
								type: 'chat',
								ownerUid: this.ownerUid,
								message: message,
								step: 'msg',
								img: '',
								icon: this.iconKey,
								uid: this.memberInfo.uid,
								uno: this.memberInfo.no,
								sendType: 'chatData',
							}
							this.chatSend(socketParams);

						}
					}

					if (response.service) {
						switch (response.service.type) {
							case 'youtube':
							case 'photo':
							case 'board':
							case 'meet':

								var gtime = this.checkTime();
								var userInfo = this.userList[response.chatUid];
								var name = userInfo.name;
								var photo = userInfo.photo;

								var serviceItem = {
									userType: 'service',
									type: response.service.type,
									result: 'ready',
									serviceDataList: [],
									name: name,
									photo: photo,
									gtime: gtime,
									response: response.service.response
								}
								this.messageList.push(serviceItem);
								if (!this.greetData.code) {
									let socketParams = {
										type: 'chat',
										step: 'service',
										ownerUid: this.ownerUid,
										service: response.service,
										uid: this.memberInfo.uid,
										serviceIndex: response.serviceIndex,
										sendType: 'chatService'
									}
									this.chatSend(socketParams);
								}
								var index = parseInt(this.messageList.length) - 1;
								var tempIndex = 1;
								var bid = (this.greetData.bid) ? this.greetData.bid : '';
								this.getService(response.service, index, response.serviceIndex, tempIndex, bid);
								break;
							case 'greet':


								break;
							case 'etc':
								var gtime = this.checkTime();
								var userInfo = this.userList[response.chatUid];
								var name = userInfo.name;
								var photo = userInfo.photo;

								var serviceItem = {
									userType: 'service',
									type: response.service.type,
									result: 'complete',
									serviceDataList: [],
									name: name,
									photo: photo,
									gtime: gtime,
									response: response.service.response
								}
								this.messageList.push(serviceItem);
								if (!this.greetData.code) {
									let socketParams = {
										type: 'chat',
										ownerUid: this.ownerUid,
										step: 'service',
										service: response.service,
										uid: this.memberInfo.uid,
										sendType: 'etcService'
									}
									this.chatSend(socketParams);
								}
								break;
						}
					}
					this.greetData = {};

				});

			},
			greetChoice(item) {
				var gtime = this.checkTime();
				var userInfo = this.userList[this.chatUid];
				var name = userInfo.name;
				var photo = userInfo.photo;
				var code = item.code;
				switch (code) {
					case 'board':
					case 'photo':
						var greetMessage = '어떤 글로 찾을까요?';
						break;
					case 'meet':
						var greetMessage = '어떤 모임으로 찾을까요?';
						break;
					case 'gpush':
						var greetMessage = '푸쉬 뭐라고 보낼까요?';
						break;
					case 'youtube':
						var greetMessage = '어떤 동영상을 찾을까요?';
						break;
				}
				var serviceItem = {
					no: '',
					userType: 'service',
					type: 'greet',
					greetType: 'step1',
					result: 'complete',
					serviceDataList: [],
					name: name,
					photo: photo,
					gtime: gtime,
					response: greetMessage
				}
				this.greetData = {code: code, gid: item.gid, msg: greetMessage};
				this.greetAction = true;
				this.messageList.push(serviceItem);
				this.firstInit = false;


			},
			writeNotice() {
				this.settingView = false;

				this.$router.push({path: '/guild/chatNotice/' + this.gno});
			},
			toggleNotice() {
				if (this.noticeSimple) {
					this.noticeSimple = false;
					jQ('.notice-box').addClass('wide');
					jQ('.notice-box .arrow i').removeClass('fa-chevron-down');
					jQ('.notice-box .arrow i').addClass('fa-chevron-up');

					this.noticeMsg = this.notice.contents;

				} else {
					this.noticeSimple = true;
					this.noticeMsg = this.notice.msg;

					JQ('.notice-box').removeClass('wide');
					JQ('.notice-box .arrow i').removeClass('fa-chevron-up');
					JQ('.notice-box .arrow i').addClass('fa-chevron-down');


				}
			},
			hideNoticeBox() {
				var data = localStorage.getObject('noticeHidden');
				if (!data) {
					data = {};
				}
				data[this.gno] = {};
				data[this.gno][this.notice.no] = true;
				localStorage.setObject('noticeHidden', data);
				this.notice = {};
			},
			toggleNoticeBox() {
				if (JQ('.notice-pre-icon').css('display') == 'none') {
					JQ('.notice-box').hide();
					JQ('.notice-pre-icon').show();

				} else {
					JQ('.notice-box').show();
					JQ('.notice-pre-icon').hide();

				}
			},


			getDataList() {
				if (this.serverFlag) {
					this.page--;
					return;
				}
				var obj = this;
				if (!this.chatTime) return;
				this.serverFlag = true;
				const frm = new FormData()
				frm.append('ownerUid', this.ownerUid)
				frm.append('page', this.page)
				frm.append('chatTime', this.chatTime)

				apiService.post(API_URL_MESSAGE_GET_LIST, frm, (response) => {
					this.parseData(response, 'front');
					this.serverFlag = false;
				});
			},
			parseData(resp, cmd) {
				// console.log(resp.messageList);
				var obj = this;
				var pushStats = '';
				if (cmd == 'back') {
					resp.messageList.reverse();
				}
				if (!resp.chatTime && cmd == 'back') {
					var list = [];
				}
				for (var key in resp.messageList) {
					pushStats = '';
					var item = resp.messageList[key];
					if (item.userType == 'blank') {
						continue;
					} else if (item.userType == 'onlyMe') {
						var serviceItem = {
							no: item.no,
							userType: 'me',
							name: ((obj.userList[item.uno]) ? obj.userList[item.uno].name : ''),
							photo: ((obj.userList[item.uno]) ? obj.userList[item.uno].photo : ''),
							gtime: item.gtime,
							msg: item.serviceData.response
						}
						if (cmd == 'front') {
							obj.messageList.unshift(serviceItem);
						} else {
							if (!resp.chatTime) {
								list.push(serviceItem);
							}

							obj.messageList.push(serviceItem);
						}
					} else if (item.userType == 'service') {
						switch (item.serviceData.type) {
							case 'youtube':
							case 'photo':
							case 'board':
							case 'meet':
								var serviceItem = {
									no: item.no,
									userType: 'service',
									type: item.serviceData.type,
									result: 'complete',
									serviceDataList: item.serviceData.serviceDataList,
									name: ((obj.userList[item.uno]) ? obj.userList[item.uno].name : ''),
									photo: ((obj.userList[item.uno]) ? obj.userList[item.uno].photo : ''),
									gtime: item.gtime,
									response: item.serviceData.response
								}


								if (item.serviceData.type == 'board' && item.serviceData.serviceDataList.length > 0) {
									var boardList = []
									for (var k in item.serviceData.serviceDataList) {
										if (k < 4) {
											boardList.push(item.serviceData.serviceDataList[k]);
										}
									}
									serviceItem.boardList = boardList;
								}

								break;
							case 'gpush':
								if (obj.gUserInfo.gmanager == 'admin') {
									pushStats = item.serviceData.stype;
								}
								var serviceItem = {
									no: item.no,
									userType: 'service',
									type: item.serviceData.type,
									result: 'complete',
									serviceDataList: [],
									name: ((obj.userList[item.uno]) ? obj.userList[item.uno].name : ''),
									photo: ((obj.userList[item.uno]) ? obj.userList[item.uno].photo : ''),
									gtime: item.gtime,
									response: item.serviceData.response,
									stype: item.serviceData.stype
								}
								break;
							case 'greet':
								var serviceItem = {
									no: item.no,
									userType: 'service',
									type: item.serviceData.type,
									greetType: item.serviceData.greetType,
									result: 'complete',
									serviceDataList: item.serviceData.serviceDataList,
									name: ((obj.userList[item.uno]) ? obj.userList[item.uno].name : ''),
									photo: ((obj.userList[item.uno]) ? obj.userList[item.uno].photo : ''),
									gtime: item.gtime,
									response: item.serviceData.response
								}

								break;
							case 'etc':
								var serviceItem = {
									no: item.no,
									userType: 'service',
									type: item.serviceData.type,
									result: 'complete',
									serviceDataList: [],
									name: ((obj.userList[item.uno]) ? obj.userList[item.uno].name : ''),
									photo: ((obj.userList[item.uno]) ? obj.userList[item.uno].photo : ''),
									gtime: item.gtime,
									response: item.serviceData.response
								}
								break;
						}
						if (cmd == 'front') {
							obj.messageList.unshift(serviceItem);
						} else {
							if (!resp.chatTime) {
								list.push(serviceItem);
							}
							obj.messageList.push(serviceItem);
						}

					} else {
						if (item.uno) {
							item.name = ((obj.userList[item.uno]) ? obj.userList[item.uno].name : '');
							item.photo = ((obj.userList[item.uno]) ? obj.userList[item.uno].photo : '');

						}
						if (cmd == 'front') {
							obj.messageList.unshift(item);
						} else {
							if (!resp.chatTime) {
								list.push(item);
							}
							obj.messageList.push(item);
						}
					}
				}
				return pushStats;
			},
			parseOnMemberList() {
				let memberList = [];
				let myItem = [];
				for (let key in this.onMemberList) {
					let item = this.onMemberList[key]
					if (item.gclass == 'active') {
						myItem.push(item);
					} else {
						memberList.push(item);
					}

				}
				this.onShowMemberList = myItem.concat(memberList);


			},
			gpushToggle() {
				if (this.memberInfo.gpush == 'no') {
					var gparams = {
						content: "먼저 마이페이지 설정메뉴에서 알림을 ON 으로 변경해주세요",
					};
					this.$eventBus.$emit('modalOpen', gparams);
					return;
				}

				if (this.gUserInfo.gpush == 'no') {
					var gpush = 'yes';
				} else {
					var gpush = 'no';
				}

				var obj = this;
				var params = {gno: this.gno, owner: this.gUserInfo.gmanager, gpush: gpush}
				/*
				this.$form.sendPost(params, 'chatProc/updateGpush', function (resp) {
					if (resp.result == 'succ') {
						if (gpush == 'yes') {
							obj.pushMsg = '켜짐';
							obj.noPushClass = '';
						} else {
							obj.pushMsg = '꺼짐';
							obj.noPushClass = 'noPushGclass';
						}
						obj.gUserInfo.gpush = gpush;
					}

				});
				*/
			},
			chatInit(chatMode) {
				let chatInitFlag = setInterval(() => {
					if (jsonRpcService.jsonRpcConnect) {
						clearInterval(chatInitFlag);
						let frm = {
							sendType: 'joinUser',
							name: this.memberInfo.name,
							uid: this.memberInfo.uid,
							room: this.ownerUid,
							chatMode: chatMode,
							photo: this.memberInfo.photo,
							uno: this.memberInfo.no,

						}
						jsonRpcService.post(frm, (res) => {

						});
					}
				}, 300);

			},
			chatSend(params) {


				if (jsonRpcService.jsonRpcConnect) {
					jsonRpcService.post(params, (res) => {
					});
				}
			},
			jsonRpcResponse(params) {
				let data = params.data;
				let item = {};
				switch (data.sendMethod) {
					case 'join':
						if (data.result == 'doubleId') {
							let params = {
								content: "동일한 아이디로 이중 접속하셨습니다",
								doAction: () => {
									this.setChatMove(true)
								}
							};
							this.$eventBus.$emit('modalOpen', params);
							return;
						} else {
							this.getData();
						}
						break;
					case 'joinUser':
						if (data.uid == this.memberInfo.uid) return;
						if (data.chatMode == 'no') {
							this.checkDay();
							item = {msg: data.name + '님이 입장하셨습니다', userType: 'new'}
							this.messageList.push(item);


							if (!this.userList[data.uid]) {
								this.userList[data.uid] = {
									uid: data.uid,
									name: data.name,
									photo: data.photo,
									no: data.uno
								};
							}
							this.onShowMemberList.push({
								uid: data.uid,
								name: data.name,
								photo: data.photo,
								no: data.uno
							});
							this.firstInit = false;
						}
						break;
					case 'search':
					case 'etcService':
					case 'chatSend':
					case 'chatService':
						if (data.uid == this.memberInfo.uid) return;
						this.getMessage(data);
						break;
					case 'roomOut':
						if (data.uid == this.memberInfo.uid) {
							this.setChatMove(true)
						} else {
							this.checkDay();
							item = {msg: data.name + '님이 퇴장하였습니다', userType: 'out'}
							this.messageList.push(item);


							for (let key in this.onShowMemberList) {
								if (parseInt(this.onShowMemberList[key].no) == parseInt(data.uno)) {
									this.onShowMemberList.splice(key, 1);
									break;
								}
							}
							this.firstInit = false;
						}
						break;
				}

			},
			getMessage(data) {
				console.log(data)

				switch (data.step) {
					case 'notice':
						this.notice = data.notice;
						this.noticeMsg = data.noticeMsg
						return;
						break;
					case 'noticeUpdate':
						console.log(data.notice);
						if (data.notice.notice != 'yes') {
							this.notice = data.notice;
							this.noticeMsg = data.noticeMsg
						} else {
							this.notice = {};
							this.noticeMsg = '';
						}
						return;
						break;
					case 'noticeDelete':
						if (this.notice.no == data.no) {
							this.notice = {};
							this.noticeMsg = '';
						}
						return;
						break;
				}
				this.checkDay();
				if (data.uno == this.chatUid) {

					if (data.sendMethod == 'search') {
						/*let pushFlag = false;
						for (var key in this.messageList) {
							var item = this.messageList[key];
							if (item.serviceIndex == data.serviceIndex) {
								pushFlag = true;
								this.updateSearchResultBySocket(key, data);
								break;
							}
						}

						if(!pushFlag) {
						*/
						if (data.dataType == 'youtube') {
							if (data.nodataMsg == 'dataIs') {
								const frm = new FormData()
								frm.append('ownerUid', this.ownerUid)
								frm.append('no', data.serviceIndex)
								apiService.post(API_URL_MESSAGE_UPDATE_YOUTUBE_INFO, frm, (response) => {
									var gtime = this.checkTime();
									var serviceItem = {
										no: data.serviceIndex,
										userType: 'service',
										type: data.dataType,
										result: 'complete',
										serviceDataList: response.dataList,
										name: this.userList[this.chatUid].name,
										photo: this.userList[this.chatUid].photo,
										gtime: gtime,
										response: response.msg,
									}

									this.messageList.push(serviceItem);
									this.firstInit = false;
								});
							} else {
								var gtime = this.checkTime();
								var serviceItem = {
									no: data.serviceIndex,
									userType: 'service',
									type: data.dataType,
									result: 'complete',
									serviceDataList: [],
									name: this.userList[this.chatUid].name,
									photo: this.userList[this.chatUid].photo,
									gtime: gtime,
									response: data.nodataMsg,
								}

								this.messageList.push(serviceItem);
								this.firstInit = false;
							}
						} else {
							let dataList = JSON.parse(data.dataList);
							var gtime = this.checkTime();
							var serviceItem = {
								no: data.serviceIndex,
								userType: 'service',
								type: data.dataType,
								result: 'complete',
								serviceDataList: dataList,
								name: this.userList[this.chatUid].name,
								photo: this.userList[this.chatUid].photo,
								gtime: gtime,
								response: data.nodataMsg,
							}


							if (serviceItem.type == 'board' && serviceItem.serviceDataList.length > 0) {
								var boardList = []
								for (var k in serviceItem.serviceDataList) {
									if (k < 4) {
										boardList.push(serviceItem.serviceDataList[k]);
									}
								}
								serviceItem.boardList = boardList;
							}
							this.messageList.push(serviceItem);
							this.firstInit = false;
						}
					} else {
						var gtime = this.checkTime();
						var userInfo = this.userList[this.chatUid];
						var name = userInfo.name;
						var photo = userInfo.photo;

						var serviceItem = {};
						serviceItem.userType = 'service';
						serviceItem.type = data.service.type;
						serviceItem.serviceDataList = [];
						serviceItem.name = name;
						serviceItem.photo = photo;
						serviceItem.gtime = gtime;
						serviceItem.response = data.service.response;

						switch (data.service.type) {
							case 'etc':
								serviceItem.result = 'complete';
								this.messageList.push(serviceItem);

								break;
							default:
								serviceItem.result = 'complete';
								serviceItem.serviceIndex = data.serviceIndex;
								this.messageList.push(serviceItem);
								break;
						}
						this.firstInit = false;


					}

				} else {

					var gtime = this.checkTime();
					var userInfo = this.userList[data.uno];
					var name = userInfo.name;
					var photo = userInfo.photo;
					var message = this.nl2br(data.message)
					var item = {
						msg: message,
						img: data.img,
						icon: data.icon,
						name: name,
						photo: photo,
						userType: 'other',
						gtime: gtime
					}
					this.messageList.push(item);
					this.firstInit = false;
				}
			},

			updateSearchResultBySocket(index, data) {
				var serviceItem = this.messageList[index];
				serviceItem.result = 'complete'
				let dataList = JSON.parse(data.dataList);
				if (data.dataType == 'youtube') {
					if (data.dataList.length > 0) {
						serviceItem.serviceDataList = dataList
					} else {
						serviceItem.response = data.nodataMsg;
					}
				} else {
					if (data.dataList.length > 0) {
						serviceItem.serviceDataList = dataList
						serviceItem.boardList = []
						for (var k in serviceItem.serviceDataList) {
							if (k < 4) {
								serviceItem.boardList.push(serviceItem.serviceDataList[k]);
							}
						}
					} else {
						serviceItem.response = data.nodataMsg;
					}
				}
				this.$set(this.messageList, index, serviceItem);
			},
			sendUserPush(no) {

			},
			sendAllPush(no) {


			},

			getService(service, index, serviceIndex, tempIndex, gid) {

				var type = service.type;
				var keyword = service.keyString;
				switch (type) {
					case 'youtube':
						this.searchYoutube(keyword, index, serviceIndex, tempIndex)
						break;
					default:
						this.searchArticle(service, index, serviceIndex, tempIndex, gid)
						break;
				}
			},
			setEtcData(service, index) {
				var serviceItem = this.messageList[index];
				serviceItem.userType = 'other'
				serviceItem.msg = service.response;
				this.$set(this.messageList, index, serviceItem);

			},
			searchArticle(service, index, serviceIndex, tempIndex, bid) {
				var keyword = (service.keyString) ? service.keyString : '';
				var type = service.type;
				var stype = service.stype;
				var endate = (service.endate) ? service.endate : '';
				var stdate = (service.stdate) ? service.stdate : '';
				var nameKeyword = (service.nameKeyword) ? service.nameKeyword : '';

				const frm = new FormData()
				frm.append('ownerUid', this.ownerUid)
				frm.append('no', serviceIndex)
				frm.append('keyword', keyword)
				frm.append('type', type)
				frm.append('stype', stype)
				frm.append('stdate', stdate)
				frm.append('endate', endate)
				frm.append('nameKeyword', nameKeyword)
				frm.append('bid', bid)

				apiService.post(API_URL_MESSAGE_SEARCH_DATA, frm, (response) => {

					//console.log(response);

					let msg = '';
					var serviceItem = this.messageList[index];
					serviceItem.result = 'complete'
					if (response.dataList.length > 0) {
						serviceItem.serviceDataList = response.dataList;
						serviceItem.boardList = []
						for (var k in serviceItem.serviceDataList) {
							if (k < 4) {
								serviceItem.boardList.push(serviceItem.serviceDataList[k]);
							}
						}
						msg = service.response;
					} else {
						serviceItem.response = response.msg;
						msg = response.msg;

					}
					this.$set(this.messageList, index, serviceItem);
					this.firstInit = false;
					if (serviceIndex && serviceIndex != 'none') {
						let params = {
							dataList: JSON.stringify(response.dataList),
							dataType: type,
							sendType: 'search',
							nodataMsg: msg,
							uid: this.memberInfo.uid,
							uno: this.chatUid,
							ownerUid: this.ownerUid,
							serviceIndex: serviceIndex
						};
						this.chatSend(params);

					}
				});
			},
			searchYoutube(keyword, index, serviceIndex, tempIndex) {
				if (!keyword) return;
				let datas = {
					q: keyword,
					part: "snippet",
					key: this.youtubeKey,
					maxResults: 10
				};
				let url = "https://www.googleapis.com/youtube/v3/search";
				JQ.ajax({
					url: url,
					data: datas,
					type: 'GET',
					dataType: 'json',
					success: (response) => {
						let youtubeList = [];
						for (var key in response.items) {
							let item = response.items[key];
							//console.log(item);
							if (item.id.videoId) {

								let rdate = item.snippet.publishedAt.substr(0, 10)
								item.rdate = rdate.replace(/-/gi, '.')
								youtubeList.push(item);

							}
						}
						let serviceItem = this.messageList[index];
						serviceItem.result = 'complete'
						if (youtubeList.length > 0) {
							serviceItem.serviceDataList = youtubeList

						} else {
							serviceItem.response = '검색결과가 존재하지 않습니다';
						}

						this.$set(this.messageList, index, serviceItem);


						if (serviceIndex && serviceIndex != 'none') {
							const frm = new FormData()
							frm.append('ownerUid', this.ownerUid)
							frm.append('no', serviceIndex)
							frm.append('dataList', JSON.stringify(youtubeList))
							apiService.post(API_URL_MESSAGE_UPDATE_YOUTUBE_LIST, frm, (response) => {
								if (response.data == 'succ') {
									let params = {
										dataList: JSON.stringify([]),
										dataType: 'youtube',
										sendType: 'search',
										nodataMsg: 'dataIs',
										uid: this.memberInfo.uid,
										uno: this.chatUid,
										ownerUid: this.ownerUid,
										serviceIndex: serviceIndex
									};
									this.chatSend(params);
								}
							});


						}
						this.firstInit = false;

					},
					error: function (request, status, error) {

						let serviceItem = this.messageList[index];
						serviceItem.result = 'complete'
						serviceItem.response = 'YOUTUBE 서버에 접근할수 없습니다 잠시후 다시 시도해주세요';
						this.$set(this.messageList, index, serviceItem);
						if (serviceIndex && serviceIndex != 'none') {
							let list = [];
							let params = {
								dataList: JSON.stringify(list),
								dataType: 'youtube',
								sendType: 'search',
								nodataMsg: 'YOUTUBE 서버에 접근할수 없습니다 잠시후 다시 시도해주세요',
								uid: this.memberInfo.uid,
								uno: this.chatUid,
								ownerUid: this.ownerUid,
								serviceIndex: serviceIndex
							};
							this.chatSend(params);
						}
						this.firstInit = false;
						//console.log("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
					}
				});
			},
			fullVideo(vid) {
				this.dataModalShow = true;
				this.dataModalWidth = 900;
				this.videoViewShow = true;
				this.selectedVid = vid
			},
			goArticle(gtype, item) {
				this.dataModalShow = true;
				this.selectedNo = item.no;

				switch (gtype) {
					case 'board':
						this.dataModalWidth = 900;
						this.boardViewShow = true;
						break;
					case 'meet':
						this.dataModalWidth = 600;
						this.meetViewShow = true;
						break;
					case 'photo':
						this.dataModalWidth = 900;
						this.photoViewShow = true;
						break;
				}

			},
			nl2br(str) {
				return str.replace(/\n/g, "<br />");
			},
			showIcon() {
				this.iconView = true;
			},
			choiceIcon(key) {
				this.iconKey = key;
				this.iconChoiceView = true;
				this.choiceIconSrc = this.host + this.iconList[key];

			},
			roomOut() {
				let params = {
					type: 'confirm',
					content: "기존데이타는 모두 삭제됩니다<br>채팅방을 나가시겠습니까?",
					doAction: () => {
						const frm = new FormData()
						frm.append('ownerUid', this.ownerUid)
						frm.append('uid', this.memberInfo.uid)
						apiService.post(API_URL_MESSAGE_USER_OUT, frm, (response) => {
							this.roomOutFlag = true;
							let rpcParams = {
								uid: this.memberInfo.uid,
								uno: this.memberInfo.no,
								name: this.memberInfo.name,
								ownerUid: this.ownerUid,
								sendType: 'roomOut',
							}
							this.chatSend(rpcParams)

						});

					}
				};
				this.$eventBus.$emit('modalOpen', params);
			},
			checkDay() {
				var nowDate = new Date();
				if (this.nowdate.getDay() != nowDate.getDay()) {
					var year = nowDate.getFullYear();
					var month = parseInt(nowDate.getMonth()) + 1;
					var day = nowDate.getDate();

					var week = this.weekList[nowDate.getDay()];

					var item = {divide_date: year + '년 ' + month + '월 ' + day + '일 ' + week}
					this.messageList.push(item);
					this.nowdate = nowDate;
				}
			},
			checkTime() {
				var nowDate = new Date();
				if (parseInt(nowDate.getHours()) >= 12) {
					var timepre = 'PM ';

					if (parseInt(nowDate.getHours()) > 12) {
						var hour = parseInt(nowDate.getHours()) - 12;
						if (hour < 10) {
							hour = '0' + hour;
						}

					} else {
						var hour = nowDate.getHours();
					}
				} else {
					var timepre = 'AM ';
					var hour = nowDate.getHours();
				}
				return timepre + hour + ':' + nowDate.getMinutes();
			},
			search() {
				this.settingView = false;
				JQ('#searchKeyword').focus();
			},
			searchWord() {
				if (!this.keyword) {
					let params = {
						content: "검색어를 입력하세요",
					};
					this.$eventBus.$emit('modalOpen', params);
					return;
				}

				this.chatSearchView = true;
				JQ('#is-data-result').show();
				JQ('#no-data-result').hide();

				if (this.messageList.length > 0) {

					let msgFlag = false;
					let lastIndex = '';
					let indexTotal = 0;
					this.indexKeyList = [];
					for (let key in this.messageList) {
						let item = this.messageList[key];
						msgFlag = false;
						let result = {};
						switch (item.userType) {
							case 'other':
							case 'me':
							case 'new':
							case 'out':
								if (item.orgMsg) {
									item.msg = item.orgMsg;
								}
								if (item.msg) {
									msgFlag = true;
									item.orgMsg = item.msg;
									result = this.searchMessage(item.msg, key);
									item.msg = result.msg;

								}
								break;
							case 'service':
								if (item.orgResponse) {
									item.response = item.orgResponse;
								}

								if (item.response) {
									msgFlag = true;
									item.orgResponse = item.response;
									result = this.searchMessage(item.response, key);
									item.response = result.msg;
								}
								break;
						}
						if (msgFlag && result.index != 'none') {
							lastIndex = result.index;
							indexTotal++;
							this.indexKeyList.push(result.index)
						}
						this.$set(this.messageList, key, item);
					}
					if (lastIndex) {

						this.searchResult = true;
						this.currentIndex = lastIndex;
						this.totalIndex = indexTotal;
						this.showIndex = indexTotal;
						this.resultAppear()
					} else {
						this.searchResult = false;
						JQ('#is-data-result').hide();
						JQ('#no-data-result').show();

					}
				}

			},
			searchMessage(message, index) {
				var resultMsg = {};
				var ptn = new RegExp("<\/?[^>]*>", "gi");
				var ptn = /<\/?[^>]*>/gi;
				message = message.replace(ptn, "");

				if (message.match(this.keyword) !== null) {
					//this.message
					var regexp = new RegExp(this.keyword, "gi");

					resultMsg.msg = message.replace(regexp, "<span class='searchResult-box' style='background:#007ACC;color:#fff;padding:5px;'>" + this.keyword + "</span>");
					resultMsg.index = index;
				} else {
					resultMsg.msg = message;
					resultMsg.index = 'none';
				}
				return resultMsg;
			},
			resultAppear() {
				let el = JQ('#chat-search-container .' + this.currentIndex + 'item');

				let top = JQ('#chat-search-container').scrollTop() + parseInt(JQ(el).offset().top) - 200;
				console.log(top);
				JQ('html,body').animate({
					scrollTop: top,
				}, 500, function () {
					JQ(el).animate({
						opacity: 0.3
					}, 300, function () {
						JQ(this).animate({
							opacity: 1
						}, 300);
					});
				});
			},
			searchResultList(cmd) {
				if (this.totalIndex < 2) return;
				switch (cmd) {
					case 'up':
						if (this.showIndex <= 1) {
							return;
						}
						this.showIndex--;

						break;
					case 'dn':
						if (this.showIndex >= this.totalIndex) {
							return;
						}
						this.showIndex++;
						break;
				}
				this.currentIndex = this.indexKeyList[this.showIndex - 1];
				this.resultAppear()
			},
			chatSearchBack() {

				if (this.messageList.length > 0) {
					for (let key in this.messageList) {
						let item = this.messageList[key];
						switch (item.userType) {
							case 'other':
							case 'me':
							case 'new':
							case 'out':
								if (item.orgMsg) {
									item.msg = item.orgMsg;
								}
								break;
							case 'service':
								if (item.orgResponse) {
									item.response = item.orgResponse;
								}
								break;
						}
						this.$set(this.messageList, key, item);
					}

				}
				JQ('#no-data-result').hide();
				this.keyword = '';
				this.chatSearchView = false;
				let width = JQ('#data-container').width();
				this.fixedBottomWidth = width + 'px';
				JQ('#is-data-result').show();

			},
			goChatMember() {

				this.memberView = true;
				this.componentModalShow = true;
				this.settingView = false;
				this.messageView = false;

			},
			urlCopy() {

				var val = location.protocol + '//' + location.host + '/' + this.ownerUid + '/main/chat';
				var t = document.createElement("textarea");
				document.body.appendChild(t);
				t.value = val;
				t.select();
				document.execCommand('copy');
				document.body.removeChild(t);
				this.settingView = false;
				let params = {
					content: "채팅방 주소가 복사되었습니다",
				};
				this.$eventBus.$emit('modalOpen', params);
			},
			moreBoardData(index) {
				var serviceItem = this.messageList[index];
				serviceItem.boardList = serviceItem.serviceDataList;
				serviceItem.moreButtonView = true;
				this.$set(this.messageList, index, serviceItem);
				this.settingViewAfter = true;

			},
			goDown() {
				jQ('#data-container').scrollTop(jQ('#data-container .data-content').height());
			},
			getStrCut(str, len) {
				return UTIL.getStrCut(str, len);
			},

			////// 새로 추가된 작업 ////////////
			memberListAction(params) {

				this.memberView = false;
				if (params.type == 'hide') {
					this.componentModalShow = false;
					this.settingView = true;
					this.paperMessageTargetMember = {};
				} else {
					this.paperMessageTargetMember = params.member;
					this.messageView = true;

				}

			},
			messageAction(params) {
				this.paperMessageTargetMember = {};
				this.messageView = false;
				this.memberView = true;
			},
			imgPaste() {
				const imgObj = this.$refs.imgContainer.files;
				let img = imgObj.length > 0 ? imgObj[0] : null;
				var formData = new FormData();
				formData.append('ownerUid', this.ownerUid);
				formData.append('img', img);
				formData.append('uno', this.memberInfo.no);
				apiService.postFile(API_URL_MESSAGE_INSERT_IMG, formData, (response) => {

					let socketParams = {
						type: 'chat',
						ownerUid: this.ownerUid,
						message: '',
						step: 'msg',
						img: response.img,
						icon: '',
						uid: this.memberInfo.uid,
						uno: this.memberInfo.no,
						sendType: 'chatData',
					}
					this.chatSend(socketParams);
					this.checkDay();
					let gtime = this.checkTime();
					let item = {msg: '', uno: this.memberInfo.no, userType: 'me', img: response.img, gtime: gtime}
					this.messageList.push(item);
				});
			}

		},
		beforeDestroy() {
			if (!this.roomOutFlag) {
				let rpcParams = {
					uid: this.memberInfo.uid,
					ownerUid: this.ownerUid,
					sendType: 'disconnect',
				}
				jsonRpcService.post(rpcParams, (res) => {
				});
			}
			this.$eventBus.$off('chatRpcResponse');
		},
		mounted() {
			let width = JQ('#data-container').width();
			this.fixedBottomWidth = width + 'px';
			//let height = JQ('body').height()+(JQ(window).height() * 2);
			//scrollTo(0, height);


		},
		updated() {

			if (!this.firstInit) {

				let width = JQ('#data-container').width();
				this.fixedBottomWidth = width + 'px';
				if (!this.chatSearchView) {

					let height = JQ('body').height() + (JQ(window).height() * 2);
					scrollTo(0, height);
					this.firstInit = true;

				}

			}

		}

	}
</script>

<style lang="scss" scoped>
    #jsonRpcFrame {
        display: none;
    }

    span.searchResult-box {
        background: #007ACC;
        color: #fff;
    }

    .chatting-container {
        width: 100%;

        .chat-header {
            position: sticky;
            top: 62px;
            z-index: 100;
            background: #fff;
            padding: 0 30px;
            height: 80px;
            line-height: 80px;
            display: flex;
            justify-content: space-between;
            .chat-search-back {
                font-weight: bold;
                font-size: 14pt;
                cursor: pointer;
            }
            .chat-title {
                width: 70%;
                text-align: left;
                color: #000;
                font-size: 12pt;
            }
            .chat-search {
                .chat-box {
                    border: solid 1px #dcdcdc;
                    width: 270px;
                    height: 35px;
                    margin: 22px 0 0 0;
                    display: flex;
                    .inputBox {
                        border: none;
                        width: 240px;
                        height: 30px;
                        outline: none;
                        margin-right: 5px;
                        padding: 0 0 0 10px;
                    }
                    i {
                        margin-top: 8px;
                        color: #999;
                        cursor: pointer;
                    }
                }
            }
            .chat-menu {
                width: 20px;
                text-align: right;
                cursor: pointer;
            }
        }
        #chatLayout {
            width: 100%;
            background: #fff;
        }
        .notice-pre-icon {
            display: none;
            position: fixed;
            top: 70px;
            right: 15px;
            width: 30px;
            height: 30px;
            z-index: 101;
            border-radius: 15px;
            background: #cc0000;
            color: #fff;
            text-align: center;
            line-height: 30px;
        }
        .notice-box {
            position: fixed;
            top: 56px;
            width: 100%;
            height: auto;
            z-index: 5;
            background: #f9f9f9;
            border-bottom: solid 1px #ccc;
            .notice-info {
                display: flex;
                .icon {
                    width: 30px;
                    margin: 10px;
                    height: 30px;
                    border-radius: 15px;
                    background: #cc0000;
                    color: #fff;
                    text-align: center;
                    line-height: 30px;
                }
                .msg {
                    margin-top: 15px;
                    width: 80%;
                    height: 20px;
                    overflow: hidden;
                    color: #000;
                    font-size: 12px;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                }
                .arrow {
                    width: 40px;
                    text-align: center;
                    margin-top: 15px;
                }
            }
            .notice-button {
                display: none;
            }
        }
        .notice-box.wide {
            .notice-info {
                .msg {
                    height: auto;
                    overflow-y: visible;
                    white-space: normal;
                    word-wrap: normal;
                    text-overflow: inherit;
                }
            }
            .notice-button {
                display: flex;
                margin-top: 7px;
                li {
                    width: 50%;
                    text-align: center;
                    border-top: solid 1px #dfdfdf;
                    height: 35px;
                    line-height: 35px;
                    font-size: 11px;
                    font-weight: bold;
                    color: #000;
                }
                li:first-child {
                    border-right: solid 1px #dfdfdf;

                }
            }
        }
        #data-container, #virtualView {
            width: 100%;
            margin: 0;
            background: #E7E8FD;
            padding: 80px 0 0 0;
            .no-read-box {
                width: 100%;
                position: fixed;
                z-index: 10;
                bottom: 70px;
                padding: 0 7px;
                .no-read-item {
                    background: #999;
                    margin: auto;
                    height: 45px;
                    overflow: hidden;
                    position: relative;
                    border-radius: 7px;
                    padding: 12px 25px;
                    font-family: 'Nanum Gothic', sans-serif;
                    color: #fff;
                    font-weight: normal;
                    white-space: nowrap;
                    text-overflow: ellipsis;

                    .box-left {
                        position: absolute;
                        top: 8px;
                        left: 7px;
                        width: 30px;
                        height: 30px;
                        border-radius: 50%;
                        background: #826BA2;
                        text-align: center;
                        overflow: hidden;
                        display: inline-block;
                        img {
                            width: 100%;
                            min-height: 30px;
                        }
                        i {
                            font-size: 12pt;
                            color: #fff;
                        }
                    }
                    .name {
                        padding-left: 15px;
                        font-size: 12px;

                    }
                    .msg {
                        padding-left: 5px;
                        font-size: 12px;

                    }
                    .gobox {
                        position: absolute;
                        right: 8px;
                        top: 13px;

                    }
                }

            }
            .data-content {
                width: 100%;
                min-height: 700px;
                margin: 0;
                padding: 0 0 100px 0;
                li {
                    position: relative;
                    .main-1 {
                        width: 40%;
                        height: auto;
                        display: flex;
                        padding: 13px 15px 13px 5px;
                        .box-left {
                            width: 35px;
                            height: 35px;
                            line-height: 35px;
                            border-radius: 50%;
                            background: #5F667D;
                            text-align: center;
                            position: absolute;
                            bottom: 15px;
                            overflow: hidden;
                            img {
                                margin-top: 5px;
                                width: 20px;

                            }
                            i {
                                font-size: 12pt;
                                color: #fff;
                            }
                        }
                        .box-right {
                            width: 100%;
                            margin-left: 47px;
                            .box-top {
                                width: auto;
                                position: relative;
                                ul {
                                    display: flex;
                                    li {
                                        padding-bottom: 3px;
                                        color: #999999;
                                        font-family: 'Nanum Gothic', sans-serif;
                                        font-size: 13px;
                                        &:last-child {
                                            position: absolute;
                                            right: 0;
                                        }
                                    }
                                }
                            }
                            .box-bottom {
                                display: flex;
                                position: relative;
                                .box-img {
                                    width: auto;
                                    height: auto;
                                    position: absolute;
                                    bottom: -7px;
                                    left: -15px;
                                    img {
                                        width: 20px;
                                        height: 30px;
                                    }

                                }
                                .box-content {
                                    width: 100%;
                                    height: auto;
                                    background: #fff;
                                    padding: 15px 20px;
                                    border-radius: 5px;
                                    position: relative;
                                    word-break: break-all;
                                    word-wrap: break-word;
                                    line-height: 140%;
                                    color: #999999;
                                    font-family: 'Nanum Gothic', sans-serif;
                                    font-size: 11px;
                                }
                            }
                            .imgBox {
                                width: 100%;
                                min-width: 200px;
                                overflow-x: hidden;
                                text-align: center;
                                min-height: 200px;
                                //background: url(https://duckku.com/common/img/data-loader.gif) no-repeat;
                                //background-position: center center;
                                img {
                                    max-width: 100%;
                                }

                            }
                            .iconBox {
                                width: auto;
                                overflow-x: hidden;
                                padding: 7px 0 0 0;
                                margin-bottom: 10px;
                                img {
                                    width: 90px;
                                }
                            }
                        }
                    }
                    .service {
                        .progress-box {
                            text-align: center;
                        }
                        .main-1 {
                            position: relative;
                            padding-bottom: 0;
                            .box-left {
                                bottom: 1px;
                            }
                            .box-bottom {
                                .box-content {
                                    background: #1F2940;
                                    color: #fff;
                                }
                            }

                        }
                        .service-box {
                            width: 100%;
                            margin: 10px 0 13px 0;
                            .pushbutton-box {
                                margin-left: 50px;
                                .pushButton {
                                    border: solid 1px #ccc;
                                    margin: 0;
                                    width: calc((100vw - 77px) / 2);
                                    height: 43px;
                                    color: #402E97;
                                    z-index: 1;
                                }
                                .pushButton:first-child {
                                    margin-right: 10px;

                                }

                            }
                            .searchResult-box {
                                margin-left: 15px;
                                padding: 15px 0;
                                .greet-box {
                                    margin-top: -14px;
                                    width: 40%;
                                    .greet-list {
                                        display: flex;
                                        flex-wrap: wrap;
                                        li {
                                            width: 30%;
                                            margin-left: 7px;
                                            border-radius: 5px;
                                            height: 35px;
                                            line-height: 35px;
                                            text-align: center;
                                            cursor: pointer;
                                            background: #fff;
                                            color: #000;
                                            border: solid 1px #1F2940;
                                            font-weight: bold;
                                            font-size: 11px;
                                            margin-bottom: 7px;
                                            overflow: hidden;
                                        }
                                    }
                                }
                                .board-box {
                                    margin: 0 15px 0 5px;
                                    border-radius: 12px;
                                    border: solid 1px #ccc;
                                    width: 40%;
                                    background: #fff;
                                    height: auto;
                                    cursor: pointer;

                                    box-shadow: 1px 1px 2px 1px rgba(0, 0, 0, 0.1);
                                    .list-box {
                                        padding: 20px 20px 0 20px;
                                        .list {
                                            display: flex;
                                            border-bottom: solid 1px #c3c3c3;
                                            height: 80px;
                                            padding: 10px 0;
                                            .info-box {
                                                width: calc(100vw - 170px);
                                                .gtitle {
                                                    line-height: 120%;
                                                    font-size: 10pt;
                                                    font-weight: bold;
                                                    color: #000;
                                                    padding: 3px 0 0 0;
                                                    height: 37px;
                                                }
                                                .rdate {
                                                    font-size: 7pt;
                                                    color: #999;
                                                    padding: 0;
                                                }

                                            }
                                            .info-box.alone {
                                                width: 100%;

                                            }
                                            .img-box {
                                                width: 280px;
                                                height: 60px;
                                                overflow: hidden;
                                                background: #eee;
                                                text-align: Center;
                                                img {
                                                    width: 100%;
                                                    min-height: 60px;
                                                }

                                            }
                                        }
                                        .list:last-child {
                                            border-bottom: none;
                                        }
                                    }
                                    .more-button {
                                        border-top: solid 1px #c3c3c3;
                                        text-align: center;
                                        height: 45px;
                                        line-height: 45px;
                                        color: #8572DD;
                                    }
                                }
                                .swiper-container {
                                    margin: 0;
                                    padding: 0;
                                    position: relative;
                                    .swiper-slide {
                                        width: 180px;
                                        height: auto;
                                        margin: 0 5px;
                                        padding-bottom: 5px;
                                        .data-box {
                                            cursor: pointer;
                                            background: #fff;
                                            border-radius: 12px;
                                            border: solid 1px #ccc;
                                            overflow: hidden;
                                            width: 100%;
                                            height: 173px;
                                            box-shadow: 1px 1px 2px 1px rgba(0, 0, 0, 0.1);
                                            .img {
                                                height: 100px;
                                                width: 100%;
                                                overflow: hidden;
                                                text-align: center;
                                                // background: url(https://duckku.com/common/img/data-loader.gif) no-repeat;
                                                //background-position: center center;
                                                img {
                                                    width: 100%;
                                                    min-height: 100px;
                                                }

                                            }
                                            .gtitle {
                                                line-height: 120%;
                                                font-size: 10pt;
                                                font-weight: bold;
                                                color: #000;
                                                padding: 8px;
                                                height: 30px;
                                            }
                                            .rdate {
                                                font-size: 7pt;
                                                color: #999;
                                                padding: 0 8px;
                                            }
                                        }
                                        .data-box.meet {
                                            height: 207px;
                                            .meet-info {
                                                padding: 0 8px;
                                                margin: 0;
                                                li {
                                                    padding: 0;
                                                    margin: 0;
                                                    font-size: 8pt;
                                                    color: #999;
                                                    line-height: 160%;
                                                    img {
                                                        width: 10px;
                                                        margin-right: 7px;
                                                    }
                                                }
                                            }

                                        }
                                    }

                                }
                            }
                        }
                    }
                    .main-2 {
                        width: 40%;
                        height: auto;
                        padding: 13px 5px 13px 50px;
                        margin-left: 60%;
                        .aa {
                            color: #999999;
                            font-family: 'Nanum Gothic', sans-serif;
                            font-size: 13px;
                            padding: 0 0 0 5px;
                            margin: 0;
                        }
                        .box-big {
                            display: flex;
                            position: relative;
                            .box-aa {
                                width: 100%;
                                margin: 0 11px 0 2px;
                                padding: 12px 25px;
                                background: #686EFB;
                                color: #fff;
                                font-family: 'Nanum Gothic', sans-serif;
                                font-size: 12px;
                                border-radius: 4px;
                                word-break: break-all;
                                word-wrap: break-word;
                                line-height: 140%;
                            }
                            .box-img-cc {
                                width: auto;
                                position: absolute;
                                right: 2px;
                                bottom: -7px;
                                img {
                                    width: 12px;
                                    height: 20px;

                                }
                            }
                        }
                        .imgBox {
                            margin: 0 11px 0 3px;
                            width: auto;
                            min-width: 200px;
                            min-height: 200px;
                            overflow-x: hidden;
                            text-align: center;
                            // background: url(https://duckku.com/common/img/data-loader.gif) no-repeat;
                            //background-position: center center;
                            img {
                                max-width: 100%;
                            }

                        }
                        .iconBox {
                            width: auto;
                            overflow-x: hidden;
                            padding: 7px 10px 0 0;
                            text-align: right;
                            margin-bottom: 10px;
                            img {
                                width: 90px;
                            }
                        }
                    }
                    .main-3 {
                        width: 100%;
                        height: auto;
                        text-align: center;
                        padding-top: 22px;
                        color: #000;
                        font-family: 'Nanum Gothic', sans-serif;
                        font-size: 12px;
                        &.divide-line {
                            border-bottom: solid 1px #C2C2C2;
                            width: 95%;
                            margin: auto;
                            span {
                                display: inline-block;
                                width: 180px;
                                text-align: center;
                                margin: auto;
                                position: relative;
                                bottom: -10px;
                                background: #E7E8FD;
                            }
                        }
                        .enter {
                            width: auto;
                            display: inline-block;
                            padding: 0 10px;
                            border-radius: 13px;
                            height: 26px;
                            margin: auto;
                            line-height: 26px;
                            text-align: center;
                            background: #FD237A;
                            color: #fff;

                        }
                        .out {
                            width: auto;
                            display: inline-block;
                            padding: 0 10px;
                            border-radius: 13px;
                            height: 26px;
                            margin: auto;
                            line-height: 26px;
                            text-align: center;
                            background: #c1c1c1;
                            color: #fff;

                        }
                    }
                }
            }
        }
        .footer {
            height: auto;
            position: fixed;
            z-index: 1;
            bottom: 0;
            -webkit-box-shadow: 0px 0px 8px -1px rgba(0, 0, 0, 0.6);
            -moz-box-shadow: 0px 0px 8px -1px rgba(0, 0, 0, 0.6);
            box-shadow: 0px 0px 8px -1px rgba(0, 0, 0, 0.6);
            .iconChoiceBox {
                width: 100%;
                min-height: 100px;
                padding: 30px 0 20px 0;
                text-align: center;
                background: rgba(0, 0, 0, .6);
                position: relative;
                i {
                    position: absolute;
                    top: 10px;
                    right: 10px;
                    color: #fff;
                    font-size: 17pt;
                }
                img {
                    width: 90px;
                }

            }
            ul.search-updn-box {
                background: #fff;
                padding: 15px 15px;
                display: flex;
                li {
                    font-size: 14pt;
                    width: 20%;
                    color: #000;
                    &:first-child {
                        text-align: left;
                        padding-left: 12px;
                        cursor: pointer;
                    }
                    &:last-child {
                        text-align: right;
                        padding: 2px 12px 0 0;
                        cursor: pointer;
                    }

                }
                li.textbox {
                    width: 60%;
                    padding-top: 2px;
                    text-align: center;
                    color: #000;
                    font-weight: bold;

                }
            }
            ul.inform-box {
                background: #fff;
                padding: 15px 0 15px 15px;
                display: flex;
                li {
                    min-width: 25px;
                    &:last-child {
                        text-align: right;

                    }
                    &:nth-child(3) {
                        margin-right: 14px;
                    }
                    img {
                        width: 25px;
                        height: 25px;
                    }

                }
                li.fileBox {
                    min-width: 35px;
                    position: relative;
                    input[type="file"] {
                        width: 100%;
                        position: absolute;
                        top: 0;
                        height: 27px;
                        opacity: 0;
                        z-index: 10000;
                    }
                }
                li.textbox {
                    width: 95%;
                    padding-top: 2px;
                    input {
                        width: 95%;
                        border: none;
                        height: 20px;
                        outline: none;
                        color: #000;
                        font-family: 'Nanum Gothic', sans-serif;
                        font-size: 12pt;
                        margin-left: 10px;
                        line-height: 110%;
                    }
                }
            }
            ul.icon-box {

                display: flex;
                flex-wrap: wrap;
                padding: 10px;
                background: #fafafa;
                border-top: solid 1px #777;
                li {
                    width: 20%;
                    text-align: center;
                    margin: 10px 0;
                    img {
                        width: auto;
                        max-width: 70%;
                    }
                }
            }
        }
        &.mobile {
            width:calc(100vw);
            margin:-15px 0 0 -15px;
            .chat-header {
                top:90px;
                z-index: 100;
                padding: 0 15px;
                height:60px;
                line-height: 60px;
                .chat-search-back {
                    font-size: 14px;
                }
                .chat-title {
                    font-size: 14PX;
                }
                .chat-search {
                    .chat-box {
                        height:35px;
                        margin:12px 15px 0 0;
                        .inputBox {
                            margin-right: 5px;
                            padding: 0 0 0 10px;
                        }

                    }
                }
            }
            #data-container, #virtualView {
                .data-content {
                    li {
                        .main-1 {
                            width: 84%;
                            .box-right {
                                width: 100%;
                                margin-left: 47px;

                            }
                        }
                        .service {
                            .service-box {
                                .searchResult-box {
                                    .greet-box {
                                        width: 80%;
                                    }
                                }
                            }
                        }
                        .main-2 {
                            width: 80%;
                            margin-left:20%;


                        }

                    }
                }
            }

        }
    }

    .modify {
        padding: 3px 15px 0 0;
        i {
            font-size: 13pt;
            color: #ccc;
        }
    }

    #no-data-result {
        display: none;
    }

    .md-drawer {
        width: 380px;
        .main-box {
            width: 100%;
            background: #fff;
            position: relative;
            .box-screelayout-list {
                width: 100%;
                height: auto;
                padding: 0 25px;
                ul {
                    padding: 0;
                    li {
                        padding: 20px 0;
                        border-bottom: 1px solid #E0E0E0;
                        position: relative;
                        &:last-child {
                            border-bottom: none;
                        }
                        img {
                            width: 18px;
                            height: 18px;
                            margin-bottom: -2px;
                            cursor: pointer;
                        }
                        .text {
                            cursor: pointer;
                            color: #3D3D3D;
                            font-family: 'Nanum Gothic', sans-serif;
                            font-size: 11pt;
                            margin-left: 10px;
                        }
                        .font-aa {
                            position: absolute;
                            right: 0;
                            color: #27108C;
                        }
                        .font-aa.noPushGclass {
                            color: #f00;
                        }
                        .chat-member-box {
                            display: flex;
                            font-size: 12px;
                            .chat-member-title {
                                width: 60%;
                                text-align: left;
                                color: #000;
                                font-weight: bold;
                                span {
                                    color: #00cc66;
                                }
                            }
                            .more {
                                width: 40%;
                                text-align: right;
                                color: #777;
                                cursor: pointer;

                            }
                        }
                        .chat-member-list {
                            padding: 10px 0 0 0;
                            overflow: hidden;
                            height: 150px;
                            width: 100%;
                            display: flex;
                            span {
                                width: 34px;
                                height: 34px;
                                margin-right: 10px;
                                position: relative;
                                .photo {
                                    display: inline-block;
                                    width: 34px;
                                    height: 34px;
                                    border-radius: 17px;
                                    overflow: hidden;
                                    background: #27108C;
                                    color: #fff;
                                    text-align: center;
                                    line-height: 34px;
                                    img {
                                        width: 34px;
                                        min-height: 34px;
                                    }
                                }
                                .my {
                                    height: 0;
                                    width: 0;
                                }
                            }
                            span.active {
                                .my {
                                    position: absolute;
                                    display: inline-block;
                                    background: #00cc66;
                                    width: 12px;
                                    height: 12px;
                                    border-radius: 6px;
                                    z-index: 30;
                                    right: -3px;
                                    bottom: 0;
                                    border: solid 1px #fafafa;
                                }
                            }
                        }

                    }
                }
            }
            .footer-box {
                border-top: 1px solid #E0E0E0;
                width: 100%;
                height: auto;
                ul {
                    padding: 0;
                    border: none;
                    li {
                        cursor: pointer;
                        padding: 20px 0 20px 25px;
                        border: none;
                        img {
                            width: 18px;
                            height: 18px;
                            margin-bottom: -4px;
                        }
                        color: #3D3D3D;
                        font-family: 'Nanum Gothic', sans-serif;
                        font-size: 14px;

                    }
                    li.out-box {
                        border-top: none;
                        color: #000;
                    }
                }
            }
        }
        &.mobile {
            width: 100%;

        }

    }

    .modalBox {
        width:100%;
        background:#fff;
        padding:0;
        margin:0;
        .modal-header {
            width:900px;
            background:#fff;
            position:fixed;
            display:flex;
            justify-content: space-between;
            padding:20px;
            margin-top:-60px;
            z-index:1000;
            border-bottom:solid 1px #dcdcdc;
            .mod-title {
                font-size:12pt;
                font-weight:bold;
            }
            .close {
                color:#dcdcdc;
                cursor:pointer;
            }
        }
        .modal-content {
            margin-top:60px;
            padding:30px;
        }
    }

</style>