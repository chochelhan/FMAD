<template>
    <div class="zoom-layout">
        <div class="header fixed">
            <div class="logo" v-if="!logoUrl"><img src="../../../../assets/images/logo_live.png"></div>
            <div class="logo" v-if="logoUrl"><img :src="logoUrl"></div>
            <span class="subject-box"><span class="live-icon">LIVE</span>{{subject}}</span>
            <div class="menu">
                <ul class="menu-box">
                    <li>
                        <img src="../../../../assets/svg/menu/exam.svg" style="width:27px;"><span
                        class="title-over posi-top">시험</span> <span class="is-dot" v-if="IsProblem"></span>
                        <ul class="sub-box">
                            <li class="sub-item" @click="loadExamList()">저장된 시험 불러오기</li>
                            <li class="sub-item" @click="loadImmExam()">즉시 만들기</li>
                        </ul>
                    </li>
                    <li @click="loadQuiz()"><img src="../../../../assets/svg/menu/quiz.svg"><span class="title-over">간단퀴즈</span>
                    </li>
                    <li @click="loadPollList()" v-if="IsPoll"><img src="../../../../assets/svg/menu/poll.svg"
                                                                   style="width:20px;"><span
                        class="title-over">설문조사</span> <span class="is-dot" v-if="IsPoll"></span></li>
                    <li @click="loadVoteList()" v-if="IsVote"><img src="../../../../assets/svg/menu/vote.svg"
                                                                   style="width:35px;padding-top:2px;"><span
                        class="title-over">투표</span> <span class="is-dot" v-if="IsVote"></span></li>
                    <li @click="loadDataList()"><img src="../../../../assets/svg/menu/data.svg"
                                                     style="width:35px;padding-top:2px;"><span
                        class="title-over">자료공유</span> <span class="is-dot" v-if="IsData"></span></li>
                    <li>
                        <img src="../../../../assets/svg/menu/board.svg" style="width:20px;"><span
                        class="title-over posi-top">{{zoomBoardName}}</span> <span class="is-dot"
                                                                                   v-if="IsZoomBoard"></span>
                        <ul class="sub-box">
                            <li class="sub-item" @click="zoomBoardWrite()">글 작성</li>
                            <li class="sub-item" @click="loadZoomBoard()">게시글 보기</li>
                        </ul>
                    </li>
                    <li @click="loadUserList()"><img src="../../../../assets/svg/menu/usermng.svg"><span
                        class="title-over">참가자 관리</span>
                        <span class="effect"></span>
                    </li>
                </ul>
            </div>
            <div class="right-box">
                <ul class="right-ui">
                    <li class="response-info">
                        <div class="layout-box" id="menu-response-box" @click="openResponse()">
                            <span>{{responseTitle}}</span> {{responseTimeInfo}} <span class="circle-box"><i
                            class="far fa-square"></i></span>
                        </div>
                    </li>
                    <li class="time-info"><span><i class="far fa-clock"></i> 방송시간 </span> {{timeInfo}}</li>
                    <li>
                        <v-btn class="end-button" type="button" @click="endMeeting()">끝내기</v-btn>
                    </li>
                </ul>
            </div>
        </div>
        <div class="youtube-layout">
            <div class="youtube-box">
                <div class="youtube-iframe">
                    <div id="player" style="width:100%;height:550px;"></div>
                </div>
                <div class="chating-box">
                    <div class="chat-container" :style="chatStyle">
                        <ul class="chatmsg-list">
                            <li v-for="msg in chatMsgList" :class="msg.user">
                                <span class="user">{{msg.name}}</span>
                                <span class="message">{{msg.message}}</span>
                            </li>
                        </ul>
                    </div>
                    <div class="field-box">
                        <div class="field">
                            <input v-model="chatMsg" autocomplete="off" class="inputField" @keyup.enter="onkeypress"
                                   placeholder="메세지를 입력하세요">
                        </div>
                    </div>
                </div>
            </div>
            <div class="data-contents-box">
                <v-expand-transition>
                    <div class="attend-box" v-if="isAttendShow">
                        <div class="atend-title">참가자 관리</div>
                        <div class="attend-list-user" :style="attendStyle">

                            <ul class="attend-list waitUser" v-if="waitUserList.length>0">
                                <li class="wtitle">대기자 목록</li>
                                <li v-for="(user,idx) in waitUserList">
                                    <span class="name">{{user.name}}</span>
                                    <span class="email" v-if="user.email">{{user.email}}</span>
                                    <span class="out">
                                    <button @click="userPermit(idx,'yes')">승인</button>
                                    <button @click="userPermit(idx,'no')">거부</button>
                                </span>
                                </li>
                            </ul>
                            <ul class="attend-list">
                                <li v-for="(user,idx) in userList">
                                    <span class="name">{{user.name}}</span>
                                    <span class="email" v-if="user.email">{{user.email}}</span>
                                    <span class="out">
                                    <button @click="userOut(idx)">퇴장</button>
                                </span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </v-expand-transition>
                <div class="banner-box">
                    <ul class="banner-box-ul">
                        <li v-for="banner in bannerList"  @click="goBannerUrl(banner.glink)">
                            <img :src="host+banner.img">
                        </li>
                    </ul>
                </div>


            </div>
        </div>
        <div class="screenLayout" v-if="screenShow">
            <examView :gno="no" v-if="loadExamShow" @hideEvent="screenBoxHIde"></examView>
            <examMake :gno="no" v-if="loadImmExamShow" @hideEvent="screenBoxHIde"></examMake>

            <pollView :gno="no" v-if="loadPollShow" @hideEvent="screenBoxHIde"></pollView>
            <quizMake :gno="no" v-if="loadQuizShow" @hideEvent="screenBoxHIde"></quizMake>
            <voteView :gno="no" v-if="loadVoteShow" @hideEvent="screenBoxHIde"></voteView>

            <hostDataView :gno="no" v-if="loadDataShow"  @hideEvent="screenBoxHIde"></hostDataView>
            <liveFileView :no="fileNo" v-if="loadFileShow"  @hideEvent="screenBoxHIde"></liveFileView>

            <div class="board-layout" v-if="zoomBoardUpdateShow || zoomBoardListShow || zoomBoardViewShow">
                <boardRegist :gno="no" :no="updArticleNo" :compontentType="'live'" v-if="zoomBoardUpdateShow"
                             @hideEvent="zoomBoardBoxHIde"></boardRegist>
                <boardList :gno="no" :compontentType="'live'" v-if="zoomBoardListShow" @articleView="showArticleView"
                           @hideEvent="zoomBoardBoxHIde"></boardList>
                <boardView :gno="no" :no="articleNo" :compontentType="'live'" v-if="zoomBoardViewShow"
                           @articleUpdate="updateArticle" @hideEvent="zoomBoardBoxHIde"></boardView>
            </div>
        </div>
        <div class="screenLayout" id="app-response">
            <response :params="userReponseParams" v-if="userReponseShow" @hideEvent="screenBoxHIde"></response>

        </div>
        <div class="blackScreenLayout" v-if="badScreenShow">
            <div class="bad-modal-box">
                <h3>관리자에 의해 라이브 강제 종료</h3>
                <div class="message" v-html="adminBadMessage"></div>
                <div class="button-row">
                    <v-btn class="end-button" type="button" @click="badDoAction()">확인</v-btn>
                </div>
            </div>
        </div>
        <div class="blackScreenLayout" v-if="completeScreenShow">
            <div class="complete-content">
                <div class="title-box">
                    <div class="gtitle">{{subject}}> 라이브 완료</div>
                    <div class="del-box" @click="completeLive()"><i class="fas fa-times"></i></div>
                </div>
                <div class="contents">
                    <div class="img-box">
                        <h3>방송이 종료되었습니다.</h3>
                        <div class="tip">수고하셨습니다. 사용해 주셔서 감사합니다.</div>
                    </div>
                    <div class="text-box">
                        <div class="subject">{{subject}}</div>
                        <div class="author">{{userName}}</div>
                        <ul class="result-ul">
                            <li>
                                <div class="li-title">참가자 수</div>
                                <div class="li-value">{{joinCnt}}</div>
                            </li>
                            <li>
                                <div class="li-title">최대 시청자 수</div>
                                <div class="li-value">{{watchCnt}}</div>
                            </li>
                            <li>
                                <div class="li-title">라이브 시간</div>
                                <div class="li-value">{{liveTime}}</div>
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="button-row">
                    <v-btn class="cancle" type="button" @click="completeLive()">닫기</v-btn>
                    <v-btn class="end-button" type="button" @click="goAfter()">사용후 관리 살펴보기</v-btn>
                </div>
            </div>
        </div>


        <iframe id="jsonRpcLiveFrame" :src="jsonRpcLiveUrl" scrolling="0"></iframe>
    </div>

</template>


<script>
	import examView from '../exam/examView'
	import examMake from '../exam/examMake'
	import pollView from '../poll/pollView'
	import quizMake from '../quiz/quizMake'
	import voteView from '../vote/voteView'
	import boardList from '../board/boardList'
	import boardRegist from '../board/boardRegist'
	import boardView from '../board/boardview'
    import hostDataView from '../data/hostDataView'
	import liveFileView from '../data/liveFileView'
	import response from '../userResponse/response'

	import AUTH from '../../../../api/auth'
	import JQ from 'jquery'
	import {
		HOST,
		API_URL_BROADCAST_LIVE_INFO_WITH_STATUS_ING,
		API_URL_BROADCAST_LIVE_UPDATE,
		API_URL_BROADCAST_LIVE_END,
		API_URL_BROADCAST_LIVE_USER_OUT,
		API_URL_BROADCAST_LIVE_END_USER_INFO
	} from '../../../../api/urls';
	import apiService from '../../../../api/apiService';
	import jsonRpcService from '../../../../api/jsonRpcService';

	export default {
		name: 'hostVideo',
		components: {
			examView,
			examMake,
			pollView,
			quizMake,
			voteView,
			boardList,
			boardRegist,
			boardView,
			response,
			hostDataView,
			liveFileView

		},
		data() {
			return {
				host:HOST,
				jsonRpcLiveUrl: '',
				insertFlag: false,
				no: '',
				DEBUG: false,
				subject: '',
				meetingNumber: '',
				uid: '',
				userName: '',
				userEmail: '',
				passWord: '',
				chatRoomNo: '',
				chatUno: '',
				topMenuShow: false,
				screenShow: false,
				loadExamShow: false,
				loadDataShow: false,
				headerClass: '',
				loadImmExamShow: false,
				loadPollShow: false,
				loadVoteShow: false,
				loadQuizShow: false,
				userReponseShow: false,
				userReponseParams: {},
				brdType: '',
				isAttendShow: false,
				userList: [],
				waitUserList: [],
				chatMsg: '',
				chatMsgList: [],
				chatStyle: {},
				attendStyle: {},
				selectedUserIdx: '',
				status: '',
				accessType: '',
				noticeShow: false,
				sendParentParams: {},
				webinaDataShow: false,
				paymentPlan: true,
				adminBadMessage: '',
				badScreenShow: false,
				YT: '',
				video: '',
				player: '',
				reframed: false,
				videoPlaying: false,
				zoomBoardName: '게시판',
				selectedArticleData: {},
				zoomBoardUpdateShow: false,
				zoomBoardListShow: false,
				zoomBoardViewShow: false,
				articleNo: '',
				timeInterval: '',
				timeInfo: '',
				updArticleNo: '',
				IsProblem: false,
				IsData: false,
				IsPoll: false,
				IsVote: false,
				IsZoomBoard: false,
				responseTitle: '',
				responseTimeInfo: '',
				timeResponseInterval: null,
				logoUrl: '',
				completeScreenShow: false,
				joinCnt: '',
				watchCnt: '',
				liveTime: '',
				goAfterFlag: false,
				zoomRtqListShow: false,
				rtqMenuShow: false,
				noneCloseWin: true,

				isSns: false,
				isNotice: false,
				fileNo:'',
                loadFileShow:false,
				bannerList:[],

			}
		},
		created() {
			AUTH.setDevice(this.$isMobile());
			this.no = this.$route.params.no;
			let memberInfo = AUTH.getSession(this.$isMobile());
			if (memberInfo.AUTHTOKEN) {
				if (this.no < 1) {
					this.doError();
					return;
				}
				jsonRpcService.sendType = 'live';
				this.jsonRpcLiveUrl = jsonRpcService.jsonRpcLiveUrl + '/index?uid=' + memberInfo.uid;
				this.$eventBus.$on('liveRpcResponse', this.transferAction);

				if (!window['YT']) {
					var tag = document.createElement('script');
					tag.src = 'https://www.youtube.com/iframe_api';
					var firstScriptTag = document.getElementsByTagName('script')[0];
					firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
				}
				this.chatRoomNo = memberInfo.uid;

				this.chatUno = memberInfo.no;
				this.uid = memberInfo.uid;
				this.userName = memberInfo.name;
				this.userEmail = memberInfo.email;
				this.getMeetingInfo();


			} else {
				this.doError();

			}
		},
		methods: {
			goBannerUrl(url) {
				window.open(url);
			},
			test() {
				this.sendRpcData(4, 'insertProblem')
			},
			completeLive() {
				this.doError()
			},
			goAfter() {
				this.goAfterFlag = true;
				this.doError()

			},
			zoomBoardWrite() {
				this.screenShow = true;
				this.updArticleNo = 'new';
				this.zoomBoardUpdateShow = true;
			},
			loadZoomBoard() {
				this.screenShow = true;
				this.zoomBoardListShow = true;

			},
			zoomBoardBoxHIde(event) {
				//console.log(event)
				switch (event.page) {
					case 'regist':
						this.screenShow = false;
						this.zoomBoardUpdateShow = false;
						this.zoomBoardListShow = false;
						this.zoomBoardViewShow = false;
						break;
					case 'list':
						this.screenShow = false;
						this.zoomBoardUpdateShow = false;
						this.zoomBoardListShow = false;
						this.zoomBoardViewShow = false;
						break;
					case 'view':
						this.zoomBoardUpdateShow = false;
						this.zoomBoardListShow = true;
						this.zoomBoardViewShow = false;
						break;
				}

			},
			showArticleView(no) {

				this.articleNo = no;
				this.zoomBoardUpdateShow = false;
				this.zoomBoardListShow = false;
				this.zoomBoardViewShow = true;
			},
			updateArticle(no) {
				this.updArticleNo = no;
				this.zoomBoardUpdateShow = true;
				this.zoomBoardListShow = false;
				this.zoomBoardViewShow = false;
			},
			setTimeVal(sec) {
				sec = parseInt(sec);
				if (isNaN(sec)) return '00:00:00';
				if (sec < 0) return '00:00:00';
				let resultSec = sec % 60;
				resultSec = Math.floor(resultSec)
				let min = sec / 60;
				min = Math.floor(min);
				let resultMin;
				if (min >= 60) {
					resultMin = min % 60;
				} else {
					resultMin = min;
				}
				resultMin = Math.floor(resultMin);
				let hour = min / 60;
				hour = Math.floor(hour);
				let resultHour;
				let day = '';
				if (hour >= 24) {
					resultHour = hour % 24;
				} else {
					resultHour = hour;
				}
				resultHour = Math.floor(resultHour);
				return day + this.zf(resultHour) + ':' + this.zf(resultMin) + ':' + this.zf(resultSec);
			},
			zf(date) {
				date = parseInt(date);
				if (date < 10) {
					return "0" + date;
				} else return date;
			},
			getMeetingInfo() {
				const frm = new FormData()
				frm.append('no', this.no)
				apiService.post(API_URL_BROADCAST_LIVE_INFO_WITH_STATUS_ING, frm, (ret) => {
					if (ret.info.uno != this.chatUno) {
						alert('잘못된 접근입니다');
						this.doError();
						return;
					}

					/**
					 *@ 새로 추가된곳 시작
					 **/
					this.logoUrl = (ret.info.logo) ? ret.info.logo : '';

					this.IsProblem = (ret.problemInfo) ? true : false;
					if (ret.fileList) {
						if (ret.fileList.length > 0) this.IsData = true;
					}
					this.IsPoll = (ret.pollInfo) ? true : false;
					this.IsVote = (ret.voteInfo) ? true : false;
					this.IsZoomBoard = (ret.zoomBardCnt) ? true : false;

					let ingDate = new Date(ret.info.ingDate);
					let nowDate = new Date();
					let timeCnt = (nowDate.getTime() - ingDate.getTime()) / 1000;
					timeCnt = Math.floor(timeCnt);
					if (timeCnt < 0) timeCnt = 0;
					this.timeInterval = setInterval(() => {
						this.timeInfo = this.setTimeVal(timeCnt);
						timeCnt++;

					}, 1000);

					/**
					 *@ 새로 추가된곳 끝
					 **/
                    this.bannerList = ret.bannerList;

					if (ret.boardInfo) this.zoomBoardName = ret.boardInfo.boardName;
					this.IsZoomBoard = (ret.zoomBoardCnt) ? true : false;

					this.status = ret.info.status;
					this.meetingNumber = ret.info.roomNo;
					this.passWord = ret.info.roomPw;
					this.subject = ret.info.title;
					this.brdType = 'teacher';
					this.accessType = ret.info.acceptType;

					this.getVideoId(ret.info.videoId);
					this.startMeeting();


				})
			},
			endMeeting() {
				let message = {
					type: 'confirm',
					message: ' 방송을 종료하시겠습니까?',
					doAction: () => {
						setTimeout(() => {
							let message = {
								type: 'confirm',
								message: '정말로 종료하시겠습니까?<br>지금 종료할 경우 라이브가 종료되어 새롭게 라이브를 시작하셔야 합니다',
								doAction: () => {
									this.meetingEnd();
								}
							};
							this.$eventBus.$emit('modalOpen', message);
						}, 500)
					}
				};
				this.$eventBus.$emit('modalOpen', message);
			},
			meetingEnd() {

				/*** 새로 추가된곳 2020 11 03 ****/
				this.endMeetingActiveAct();
				if (this.timeInterval) {
					clearInterval(this.timeInterval)
				}
				this.completeScreenShow = true;
				let mpl = {
					mno: this.no
				}
				const frm = new FormData()
				frm.append('gno', this.no)
				apiService.post(API_URL_BROADCAST_LIVE_END_USER_INFO, frm, (ret) => {
					let joinCnt = 0;
					for (let user of ret.list) {
						if (user.status == 'join') {
							joinCnt++;
						}
					}
					this.joinCnt = joinCnt;
					this.watchCnt = ret.list.length;
					this.liveTime = this.timeInfo;
				})

			},
			endMeetingActive() {
				this.doEndMeetingActive('close')


			},
			endMeetingActiveAct() {

				this.doEndMeetingActive('none')

			},
			doEndMeetingActive(cmd) {

				let from;
				let to;
				let time;
				let msg;
				let chatDatList = [];
				if (this.chatMsgList.length > 0) {
					for (let chat of this.chatMsgList) {
						if (chat.user == 'me') {
							from = '나';
						} else from = chat.name;
						msg = chat.message;
						to = '모두';
						time = chat.time;
						chatDatList.push({to: to, from: from, time: time, msg: msg});
					}
				}
				let params = {
					messages: JSON.stringify(chatDatList),
					mno: this.no
				}
				const frm = new FormData()
				frm.append('gno', this.no)
				frm.append('messages', JSON.stringify(chatDatList))
				apiService.post(API_URL_BROADCAST_LIVE_END, frm, (ret) => {

					let frm = {
						roomNo: this.chatRoomNo,
						sendType: 'endLive'
					}
					jsonRpcService.post(frm, (res) => {
						if(cmd=='close')this.doError()
					});

				})

			},
			loadExamList() {
				if (this.userReponseShow) {
					let message = {
						message: '먼저 진행중인 작업을 종료하세요',
					};
					this.$eventBus.$emit('modalOpen', message);
					return;
				}

				this.screenShow = true;
				this.loadExamShow = true;

			},
			loadQuiz() {
				if (this.userReponseShow) {
					let message = {
						message: '먼저 진행중인 작업을 종료하세요',
					};
					this.$eventBus.$emit('modalOpen', message);
					return;
				}

				this.screenShow = true;
				this.loadQuizShow = true;
			},
			loadDataList() {
				this.screenShow = true;
				this.loadDataShow = true;
			},
			loadImmExam() {
				this.screenShow = true;
				this.loadImmExamShow = true;
			},
			loadPollList() {
				if (this.userReponseShow) {
					let message = {
						message: '먼저 진행중인 작업을 종료하세요',
					};
					this.$eventBus.$emit('modalOpen', message);
					return;
				}

				this.screenShow = true;
				this.loadPollShow = true;
			},
			loadVoteList() {
				if (this.userReponseShow) {
					let message = {
						message: '먼저 진행중인 작업을 종료하세요',
					};
					this.$eventBus.$emit('modalOpen', message);
					return;
				}

				this.screenShow = true;
				this.loadVoteShow = true;
			},
			screenBoxHIde(event) {
				switch (event.page) {
					case 'exam':
						switch (event.action) {
							case 'sendProblem':
								this.sendRpcData(event.no, 'insertProblem');
								break;
						}
						this.screenShow = false;
						this.loadExamShow = false;
						break;
					case 'immExam':
						switch (event.action) {
							case 'sendProblem':

								this.sendRpcData(event.no, 'insertProblem');
								break;
						}
						this.screenShow = false;
						this.loadImmExamShow = false;
						break;
					case 'quiz':
						switch (event.action) {
							case 'sendQuiz':
								this.sendRpcData(event.no, 'insertQuiz');
								break;
						}
						this.screenShow = false;
						this.loadQuizShow = false;
						break;
					case 'poll':
						switch (event.action) {
							case 'sendPoll':
								this.sendRpcData(event.no, 'insertPoll');
								break;
						}
						this.screenShow = false;
						this.loadPollShow = false;
						break;
					case 'vote':
						switch (event.action) {
							case 'sendVote':
								this.sendRpcData(event.no, 'insertVote');
								break;
						}
						this.screenShow = false;
						this.loadVoteShow = false;
						break;
					case 'userResponse':
						if (event.action == 'forceEnd') {
							let msg = '';
							switch (event.gtype) {
								case 'insertProblem':
									msg = '시험을';
									break;
								case 'insertPoll':
									msg = '설문조사를';
									break;
								case 'insertVote':
									msg = '투표를';
									break;
								case 'insertQuiz':
									msg = '간단퀴즈를';
									break;
							}
							let message = {
								type: 'confirm',
								message: msg + ' 강제 종료하시겠습니까?',
								doAction: () => {
									this.modalResponse('forceResponseEnd');
								}
							};
							this.$eventBus.$emit('modalOpen', message);

						} else if (event.action == 'barHide') {
							switch (event.gtype) {
								case 'insertProblem':
									this.responseTitle = '시험 진행중';

									break;
								case 'insertPoll':
									this.responseTitle = '설문 진행중';
									break;
								case 'insertVote':
									this.responseTitle = '투표 진행중';
									break;
								case 'insertQuiz':
									this.responseTitle = '간단퀴즈 진행중';
									break;
							}
							JQ('#app-response').hide();
							if (this.timeResponseInterval) {
								this.responseTimeInfo = '00:00:00'
								clearInterval(this.timeResponseInterval);
							}

							let rtimeCnt = 0;

							this.timeResponseInterval = setInterval(() => {
								this.responseTimeInfo = this.setTimeVal(rtimeCnt);
								rtimeCnt++;

							}, 1000);

							JQ('#menu-response-box').show();
						} else {
							JQ('#app-response').hide();
							this.userReponseShow = false;
						}
						break;
					case 'fileView':
						this.loadFileShow = false;
						this.fileNo = '';
						this.screenShow = false;
						break;
					case 'data':
						if (event.action == 'share') {
							switch (event.fdata.ext) {
								case 'google':
									let height = JQ(window).height();
									let left = JQ(window).width() - 800;
									window.open('https://drive.google.com/file/d/' + event.fdata.url + '/view?ths=true', 'gWin', 'width=800,height=' + height + ',top=0,left=' + left);
									break;
								default:
									//frame.setAttribute('src', 'https://view.officeapps.live.com/op/embed.aspx?src=' + protocol + '//' + host + event.fdata.url);
									//frame.style.display = 'block';
									this.fileNo = event.fdata.no;
									this.loadFileShow = true;
									break;
							}
							let rpcParams = {
								sendType: 'room',
								roomNo: this.chatRoomNo,
								sendMethod: 'insertFdata',
								data: event.fdata.no
							}
							jsonRpcService.post(rpcParams,()=>{

                            });
						} else {
							this.screenShow = false;
						}
						this.loadDataShow = false;
						break;
				}
			},
			openResponse() {
				JQ('#app-response').show();
				JQ('#menu-response-box').hide();

			},
			updateTopMenu() {
				this.topMenuShow = true;
				this.headerClass = 'fixed';
			},
			startMeeting() {

				setTimeout(() => {
					this.startVideo();
				}, 1000)

			},
			joinSocketRoom() {
				let frm = {
					uid: this.chatRoomNo,
					roomHost: 'yes',
					sendType: 'makeLiveRoom'
				}
				jsonRpcService.post(frm, (res) => {
					//console.log()
				});

			},
			sendRpcData(no, type) {
				this.userReponseParams = {
					mno: this.no,
					no: no,
					type: type
				};

				let rpcParams = {
					sendType: 'room',
					sendMethod: type,
					data: no,
					roomNo: this.chatRoomNo,
				}
				jsonRpcService.post(rpcParams, (res) => {

				});
				let msg;
				switch (type) {
					case 'insertProblem':
						msg = '시험을 출제하였습니다';
						break;
					case 'insertPoll':
						msg = '설문조사를 시작하였습니다';
						break;
					case 'insertVote':
						msg = '투료를 시작하였습니다';
						break;
					case 'insertQuiz':
						msg = '간단퀴즈를 출제하였습니다';
						break;
				}
				JQ('#app-response').show();
				this.userReponseShow = true;
				let message = {
					type: 'timeout',
					message: msg,
				};
				this.$eventBus.$emit('modalOpen', message);
			},

			modalResponse(type) {
				switch (type) {
					case 'forceResponseEnd':
						let rpcParams = {
							sendType: 'room',
							sendMethod: 'forceEnd',
							data: 'none',
							roomNo: this.chatRoomNo,
						}
						jsonRpcService.post(rpcParams, () => {

						});
						JQ('#app-response').hide();
						this.userReponseShow = false;

						break;
					case 'userOut':
						let user = this.userList[this.selectedUserIdx];
						if (!user) return;
						if (user.uid) {
							let rpcParams = {
								sendType: 'userOut',
								sendMethod: 'userOut',
								uid: user.uid,
								roomNo: this.chatRoomNo,
							}
							jsonRpcService.post(rpcParams, () => {

							});
							this.userList.splice(this.selectedUserIdx, 1);

							const frm = new FormData()
							frm.append('gno', this.no)
							frm.append('uid', user.uid);
							apiService.post(API_URL_BROADCAST_LIVE_USER_OUT, frm, (ret) => {

							});
						}
						break;


				}
			},
			userPermit(idx, cmd) {
				let item = this.waitUserList[idx];
				if (cmd == 'yes') {
					this.userList.push(item);
				}
				this.waitUserList.splice(idx, 1);
				let frm = {
					roomNo: this.chatRoomNo,
					sendType: 'userJoinPermit',
					uid: item.uid,
					cmd: cmd
				}
				jsonRpcService.post(frm, (res) => {
				});

			},
			meetUserJoin(params) {
				let flag = false;
				for (let user of this.userList) {
					if (user.uid == params.uid) {
						flag = true;
						break;
					}
				}
				if (!flag) {
					let item = {
						uid: params.uid,
						name: params.userName,
						email: params.userEmail
					}

					if (this.accessType == 'yes') {
						this.waitUserList.push(item);
					} else {
						this.userList.push(item);
					}
					JQ('.effect').animate({
						width: '30px',
						height: '30px',
						'border-radius': '15px'
					}, 2000, function () {
						JQ('.effect').animate({
							width: '10px',
							height: '10px',
							'border-radius': '5px'

						}, 2000)
					});
				}

			},
			badDoAction() {
				this.badScreenShow = false;
				this.endMeetingActive();

			},

			transferAction(params) {
				console.log(params)
				let parentParams;
				switch (params.data.sendMethod) {
					case 'join':
						if (params.result != 'succ') return;
						if (params.data.result == 'doubleId') {
							let message = {
								message: '동일한 아이디로 접속중입니다',
								doAction: () => {
									this.doError();
								}
							};
							//this.$eventBus.$emit('modalOpen', message);
							//return;
						} else {
							this.joinSocketRoom();
						}
						break;
					case 'joinUser':
						if (params.result != 'succ') return;
						this.meetUserJoin(params.data);

						break;

					case 'adminForceEndMeeting': // 관리자 강제종룟
						this.adminBadMessage = params.data.replace(/\n/g, "<br />") + '<br>자세한 내용은 관리자에게 문의바랍니다';
						this.badScreenShow = true;
						break;
					case 'createRoomCheck':
						if (params.result == 'doubleRoom') {
							if (!this.DEBUG) this.endMeetingActive();
						}
						break;
					case 'replayProblem':
					case 'replayPoll':
					case 'replayVote':
					case 'replayQuiz':
						parentParams = {
							method: 'replyUser',
							uid: params.data.data
						};
						this.$eventBus.$emit('liveUserResponse', parentParams);
						break;
					case 'chattingAll':
						let messageData = params.data;
						let nowDate = new Date();
						let time = nowDate.getHours() + ':' + nowDate.getMinutes() + ':' + nowDate.getSeconds();
						let item = {
							user: 'user',
							name: messageData.name,
							uid: messageData.uid,
							email: messageData.email,
							time: time,
							message: messageData.chatmsg
						}
						this.chatMsgList.push(item);
						break;
					case 'outUser': // 방송중 종료한 사람들
						let flag = false;
						let k = 0;
						for (let user of this.userList) {
							if (user.uid == params.data.data) {
								flag = true;
								this.userList.splice(k, 1)
								break;
							}
							k++;
						}
						if (flag) {
							JQ('.effect').animate({
								width: '30px',
								height: '30px',
								'border-radius': '15px'
							}, 2000, function () {
								JQ('.effect').animate({
									width: '10px',
									height: '10px',
									'border-radius': '5px'

								}, 2000)
							});
						}
						break;
				}
			},
			loadUserList() {
				if (!this.isAttendShow) {
					this.isAttendShow = true;
				} else {
					this.isAttendShow = false;
				}

			},

			doError() {
				if (this.goAfterFlag) {

					window.opener.document.location.href = '/live/' + this.no + '/afterExam';
				} else {
					window.opener.document.location.reload();
				}
				JQ(window).off("beforeunload");
				window.close();
			},

			userOut(idx) {
				let item = this.userList[idx];
				this.selectedUserIdx = idx;
				let msg = item.name + ((item.email) ? '(' + item.email + ')' : '') + ' 님을<br> 퇴장 시키시겠습니까?'
				let message = {
					type: 'confirm',
					message: msg,
					doAction: () => {
						this.modalResponse('userOut')
					}
				};
				this.$eventBus.$emit('modalOpen', message);

			},

			onkeypress(event) {
				let nowDate = new Date();
				let time = nowDate.getHours() + ':' + nowDate.getMinutes() + ':' + nowDate.getSeconds();
				let item = {
					user: 'me',
					name: this.userName,
					uid: this.uid,
					email: this.userEmail,
					time: time,
					message: this.chatMsg
				}
				this.chatMsgList.push(item);
				let rpcParams = {
					sendType: 'chatting',
					sendMethod: 'chattingUserAll',
					name: this.userName,
					chatmsg: this.chatMsg,
					uid: this.uid,
					email: this.userEmail,
					roomNo: this.chatRoomNo,
				}
				this.chatMsg = '';
				jsonRpcService.post(rpcParams, (res) => {

				})


			},
			getVideoId(id) {
				this.video = id;
			},
			startVideo() {
				setTimeout(()=> {
					var obj = this;
					this.reframed = false;
					this.player = new window['YT'].Player('player', {
						videoId: this.video,
						playerVars: {
							autoplay: 1,
							modestbranding: 1,
							controls: 1,
							disablekb: 1,
							rel: 0,
							showinfo: 0,
							fs: 0,
							playsinline: 0
						},
						events: {
							'onStateChange': this.onPlayerStateChange.bind(this),
							'onError': this.onPlayerError.bind(this),
							'onReady': this.onPlayerReady.bind(this),
						}
					});
				},1000);

			},
			onPlayerReady(event) {
				event.target.playVideo();
			},
			onPlayerStateChange(event) {


			},
			onPlayerError(event) {
				switch (event.data) {
					case 2:
						console.log(this.video);
						break;
					case 100:
						break;
					case 101 || 150:
						break;

				}
			},


		},
		mounted() {
			JQ(window).on("beforeunload", function (eventObject) {
				this.doEndMeetingActive('close')
				return false;
			});
			let height = JQ(window).height() - 670;
			this.chatStyle = {'height': height + 'px', 'width': '100%'};
			this.attendStyle = {'height': (JQ(window).height() - 114) + 'px'}

			//window.resizeTo(JQ(window).width(), JQ(window).height() + 150)
		},
		destroyed() {
			this.$eventBus.$off('liveRpcResponse');
			if (this.timeInterval) {
				clearInterval(this.timeInterval)
			}
			if (this.timeResponseInterval) {
				clearInterval(this.timeResponseInterval)
			}
		}

	}
</script>
<style lang="scss" scoped>
    #jsonRpcLiveFrame {
        width: 0;
        height: 0;
        display: none;
    }

    ul {
        padding: 0;
    }

    .zoom-layout {
        width: calc(100vw);
        height: 100%;
        position: relative;
        overflow-y: auto;
        overflow-x: hidden;
        .clear {
            clear: both;
        }
        .header {
            width: 100%;
            padding: 0;
            maing: 0;
            border-bottom: solid 1px #C2C2C2;
            height: 60px;
            z-index: 100000;
            background: #fff;
            .logo {
                cursor: pointer;
                img {
                    max-width: 120px;
                    max-height: 50px;
                }
            }
            &.fixed {
                position: fixed;
                top: 0;
                left: 0;
                .logo {
                    cursor: default;
                }

            }
            .subject-box {

                width: auto;
                max-width: 370px;
                overflow-x: hidden;
                overflow-y: hidden;
                position: absolute;
                top: 15px;
                left: 150px;
                display: inline-block;
                height: 30px;

                text-align: center;
                line-height: 30px;
                font-size: 10pt;
                color: #000;
                font-weight: bold;
                .live-icon {
                    border-radius: 3px;
                    background: #E62118;
                    color: #fff;
                    padding: 3px 5px;

                }
            }
            .logo {
                position: absolute;
                top: 0;
                left: 0;
                width: 30%;
                text-align: left;
                font-size: 20pt;
                font-weight: bold;
                color: #1E90FF;
                float: left;
                padding: 0 0 0 20px;
                line-height: 60px;
                img {
                    margin-top: -5px;
                    max-width: 120px;
                    max-height: 50px;
                }
            }
            .menu {
                width: 600px;
                margin: auto;
                .menu-box {
                    margin-left: 100px;
                    display: flex;
                    list-style-type: none;
                    & > li {
                        text-align: center;
                        padding: 16px 15px 15px 15px;
                        font-weight: bold;
                        color: #000;
                        cursor: pointer;
                        position: relative;
                        img {
                            width: 30px;

                        }
                        .title-over {
                            display: none;
                            position: absolute;
                            z-index: 1000;
                            top: 49px;
                            left: 20px;
                            padding: 3px 10px;
                            min-width: 100px;
                            text-align: center;
                            background: #fafafa;
                            border: solid 1px #dcdcdc;
                            color: #000;
                            font-size: 9pt;
                            &.posi-top {
                                top: 7px;
                                left: 40px;
                            }
                        }
                        .is-dot {
                            display: inline-block;
                            position: absolute;
                            width: 10px;
                            height: 10px;
                            background: #ff0000;
                            border-radius: 5px;
                            right: 15px;
                            top: 15px;
                        }
                        .effect {
                            display: inline-block;
                            position: absolute;
                            width: 10px;
                            height: 10px;
                            background: #ff0000;
                            border-radius: 5px;
                            left: 15px;
                            top: 12px;
                        }
                        .sub-box {
                            display: none;
                            position: absolute;
                            top: 50px;
                            left: -40px;
                            min-width: 160px;
                            height: 80px;
                            -webkit-box-shadow: 1px 1px 5px -1px rgba(71, 70, 71, 0.53);
                            -moz-box-shadow: 1px 1px 5px -1px rgba(71, 70, 71, 0.53);
                            box-shadow: 1px 1px 5px -1px rgba(71, 70, 71, 0.53);
                            background: #fff;
                            border-radius: 5px;
                            &.webina {
                                max-height: 200px;
                                height: auto;
                                left: -25px;

                            }
                            &:hover {
                                display: block;
                            }
                            .sub-item {
                                font-size: 10pt;
                                font-weight: normal;
                                padding: 10px 0 10px 20px;
                                text-align: left;
                                color: #000;
                                &:hover {
                                    background: #F4F4F4;
                                }

                            }
                        }
                        &:hover {
                            color: #1E90FF;
                            .sub-box {
                                display: block;
                            }
                            .title-over {
                                display: block;
                            }
                        }
                    }

                }
            }
            .right-box {
                position: absolute;
                top: 0;
                right: 0;
                .right-ui {
                    display: flex;
                    list-style-type: none;
                    li {
                        padding: 12px 20px 0 0;
                        &.time-info {
                            padding: 20px 20px 0 0;
                            font-weight: bold;
                            font-size: 11pt;
                            span {
                                color: #1E90FF;
                            }
                        }
                        &.response-info {
                            padding: 8px 10px 0 0;
                            .layout-box {
                                display: none;
                                cursor: pointer;
                                border: solid 1px #ccc;
                                padding: 10px 5px;
                                border-radius: 8px;
                                font-weight: bold;
                                font-size: 11pt;
                                span {
                                    color: #1E90FF;
                                }
                                .circle-box {
                                    background: #999;
                                    color: #fff;
                                    width: 18px;
                                    height: 18px;
                                    display: inline-block;
                                    text-align: center;
                                    line-height: 16px;
                                    border-radius: 9px;
                                    i {
                                        font-size: 8px;
                                    }
                                }
                            }
                        }
                        &.badRequest-box {
                            img {
                                width: 30px;
                                cursor: pointer;
                            }
                        }
                        &.userbox {
                            cursor: pointer;
                            div {
                                background: #F4F4F4;
                                color: #999999;
                                font-size: 14pt;
                                width: 38px;
                                height: 38px;
                                text-align: center;
                                line-height: 38px;
                                border-radius: 19px;
                                border: solid 1px #dcdcdc;
                            }
                        }
                        .end-button {
                            width: 130px;
                            height: 36px;
                            line-height: 36px;
                            border-radius: 18px;
                            background: #5E65E3;
                            color: #fff;
                        }
                    }

                }
            }
        }
        .youtube-layout {
            position: fixed;
            top: 60px;
            left: 0;
            height: calc(100vh);
            width: 100%;
            overflow: hidden;
            display: flex;
            z-index: 100;
            .youtube-box {
                width: 55%;
                .youtube-iframe {
                    width: 100%;
                    height: 550px;
                    background: #000;
                    #player {
                        background: #000;
                    }
                }
                .chating-box {
                    width: 100%;
                    height: 100%;
                    .chat-container {
                        overflow-y: auto;
                        width: 100%;
                        .chatmsg-list {
                            padding: 5px 20px 0 20px;
                            li {
                                font-size: 10pt;
                                color: #000;
                                &.me {
                                    color: #1E90FF;
                                }
                                padding: 2px 0 0 0;
                                .message {

                                }
                                .user {
                                    display: inline-block;
                                    width: 100px;
                                }
                            }
                        }
                    }
                    .field-box {
                        padding: 8px 10px;
                        width: 100%;
                        margin: 0;
                        background: #fff;
                        .field {
                            width: 100%;
                            padding: 0;
                            margin: 0;
                            .inputField {
                                width: 100%;
                                height: 40px;
                                padding-left: 10px;
                                border: solid 1px #dcdcdc;

                            }
                        }
                    }

                }
            }
            .data-contents-box {
                width: 45%;
                background: #fff;
                border-left: solid 1px #dcdcdc;
                height: calc(100vh);
                position: relative;
                .banner-box {
                    width:400px;
                    margin:20px auto 0 auto;
                    .banner-box-ul {
                        margin:0;
                        padding:0;
                        li {
                            width: 400px;
                            height: 180px;
                            overflow: hidden;
                            padding:0;
                            cursor:pointer;
                            margin:0;
                            img {
                                width: 100%;
                                height: auto;
                                min-height:180px;
                            }
                        }
                    }
                }
                .attend-box {
                    position: absolute;
                    right: 0;
                    width: 450px;
                    overflow: hidden;
                    -webkit-box-shadow: 1px 1px 5px -1px rgba(71, 70, 71, 0.53);
                    -moz-box-shadow: 1px 1px 5px -1px rgba(71, 70, 71, 0.53);
                    box-shadow: 1px 1px 5px -1px rgba(71, 70, 71, 0.53);
                    background: #fff;
                    height: 100%;
                    .atend-title {
                        text-align: center;
                        font-weight: bold;
                        color: #000;
                        height: 50px;
                        line-height: 50px;
                        border-bottom: solid 1px #dcdcdc;
                    }
                    .attend-list-user {
                        overflow-y: auto;
                        .attend-list {
                            padding: 20px 0 0 0;
                            li {
                                font-size: 10pt;
                                padding: 0 0 20px 20px;
                                position: relative;
                                .name {
                                    display: inline-block;
                                    width: 150px;
                                    color: #333;
                                }
                                .email {
                                    display: inline-block;
                                    width: 200px;
                                    padding-left: 20px;
                                    color: #1E90FF;
                                }
                                .out {
                                    position: absolute;
                                    top: 0;
                                    right: 20px;
                                    button {
                                        cursor: pointer;
                                        min-width: 40px;
                                        width: 45px;
                                        height: 25px;
                                        min-height: 25px;
                                        background: #111;
                                        color: #fff;
                                        border-radius: 13px;
                                        font-size: 9pt;
                                        text-align: center;
                                    }
                                }
                            }
                            &.waitUser {
                                border-bottom: solid 1px #ccc;
                                li.wtitle {
                                    text-align: center;
                                    font-weight: bold;
                                    color: #000;
                                    padding: 0 0 20px 0;
                                }
                                .out {
                                    button {
                                        &:first-child {
                                            margin-right: 8px;
                                            background: #2196F3;
                                        }
                                    }
                                }
                            }

                        }
                    }
                }
            }
        }
        .screenLayout {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 100001;
            background: rgba(255, 255, 255, 0.1);
        }
        .blackScreenLayout {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 100001;
            background: rgba(0, 0, 0, 0.3);
        }
        .bad-modal-box {
            width: 70%;
            max-width: 500px;
            height: 400px;
            margin: -130px auto 0 auto;
            background: #fff;
            position: relative;
            top: 50%;
            border-radius: 10px;
            h3 {
                padding: 30px;
            }
            .message {
                font-size: 13pt;
                color: #777;
                line-height: 130%;
                height: 200px;
                overflow-y: auto;
                padding: 0 30px;
            }
            .button-row {
                text-align: center;
                padding: 30px;
                button {
                    width: 100%;
                    border-radius: 25px;
                    height: 50px;
                    background: #5E65E3;
                    color:#fff;
                }
            }
        }
    }

    .complete-content {
        width: 800px;
        height: 700px;
        -webkit-box-shadow: 1px 1px 9px -1px rgba(71, 70, 71, 0.53);
        -moz-box-shadow: 1px 1px 9px -1px rgba(71, 70, 71, 0.53);
        box-shadow: 1px 1px 9px -1px rgba(71, 70, 71, 0.53);
        border-radius: 10px;
        position: absolute;
        left: 50%;
        top: 50%;
        background: #ffffff;
        margin: -350px 0 0 -400px;
        .title-box {
            height: 60px;
            line-height: 60px;
            border-bottom: solid 1px #dcdcdc;
            position: relative;
            .gtitle {
                font-size: 12pt;
                font-weight: bold;
                color: #000;
                text-align: center;
            }
            .del-box {
                cursor: pointer;
                position: absolute;
                right: 15px;
                top: 17px;
                background: #999999;
                width: 20px;
                height: 20px;
                text-align: center;
                line-height: 20px;
                border-radius: 10px;
                i {
                    font-size: 10pt;
                    color: #fff;
                }
            }
        }
        .contents {
            background: #f4f4f4;
            padding: 0;
            height: 560px;
            overflow-y: auto;
            .img-box {
                width: 100%;
                height: 300px;
                background: #007aff;
                text-align: center;
                h3 {
                    margin: 0;
                    padding: 110px 0 10px 0;
                    font-size: 22pt;
                    color: #000000;
                    font-weight: bold;
                }
                .tip {
                    font-size: 10pt;
                    color: #fff;
                }
            }
            .text-box {
                .subject {
                    font-weight: bold;
                    color: #000;
                    font-size: 16pt;
                    padding: 15px 0 15px 30px;
                }
                .author {
                    color: #777;
                    font-size: 12pt;
                    padding: 0 0 0 30px;

                }
                .result-ul {
                    margin-top: 20px;
                    display: flex;
                    padding-left: 35px;
                    li {
                        width: 30%;
                        height: 130px;
                        border-radius: 5px;
                        -webkit-box-shadow: 1px 1px 9px -1px rgba(71, 70, 71, 0.53);
                        -moz-box-shadow: 1px 1px 9px -1px rgba(71, 70, 71, 0.53);
                        box-shadow: 1px 1px 9px -1px rgba(71, 70, 71, 0.53);
                        background: #fff;
                        margin-right: 5%;
                        padding: 20px;
                        .li-title {
                            color: #777;
                            font-size: 13pt;

                        }
                        .li-value {
                            padding-top: 15px;
                            font-weight: bold;
                            color: #2196F3;
                            font-size: 16pt;
                        }
                        &.last-child {
                            margin-right: 0;
                        }
                    }
                }
            }
        }
        .button-row {
            text-align: center;
            padding: 15px;
            button {
                min-width: 100px;
                border-radius: 25px;
                height: 50px;
                padding-left: 20px;
                padding-right: 20px;
                background: #5E65E3;
                color: #fff;
                &:first-child {
                    margin-right: 30px;
                    background: #999;

                }
            }
        }
    }

    .board-layout {
        width: 800px;
        height: 700px;
        -webkit-box-shadow: 1px 1px 9px -1px rgba(71, 70, 71, 0.53);
        -moz-box-shadow: 1px 1px 9px -1px rgba(71, 70, 71, 0.53);
        box-shadow: 1px 1px 9px -1px rgba(71, 70, 71, 0.53);
        border-radius: 10px;
        position: absolute;
        left: 50%;
        top: 50%;
        background: #ffffff;
        margin: -350px 0 0 -550px;

    }

    #app-response {
        display: none;
    }
</style>