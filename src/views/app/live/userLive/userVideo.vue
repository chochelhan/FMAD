<template>
    <div class="zoom-layout">
        <div class="header fixed">
            <div class="logo" v-if="!logoUrl"><img src="../../../../assets/images/logo_live.png"></div>
            <div class="logo" v-if="logoUrl"><img :src="logoUrl"></div>
            <span class="subject-box"><span class="live-icon">LIVE</span>{{subject}}</span>
            <div class="menu">
                <ul class="menu-box">
                    <li @click="loadPollList()" v-if="IsPoll"><img src="../../../../assets/svg/menu/poll.svg"
                                                                   style="width:20px;"><span
                        class="title-over">설문조사</span> <span class="is-dot" v-if="IsPoll"></span></li>
                    <li @click="loadVoteList()" v-if="IsVote"><img src="../../../../assets/svg/menu/vote.svg"
                                                                   style="width:35px;padding-top:2px;"><span
                        class="title-over">투표</span> <span class="is-dot" v-if="IsVote"></span></li>
                    <li @click="loadDataList()"><img src="../../../../assets/svg/menu/data.svg"
                                                     style="width:35px;padding-top:2px;"><span
                        class="title-over">자료공유</span> <span class="is-dot" v-if="IsData"></span></li>
                    <li v-if="zoomBoardwriteView">
                        <img src="../../../../assets/svg/menu/board.svg" style="width:20px;">
                        <span class="title-over posi-top">{{zoomBoardName}}</span>
                        <span class="is-dot" v-if="IsZoomBoard"></span>
                        <ul class="sub-box">
                            <li class="sub-item" @click="zoomBoardWrite()">글 작성</li>
                            <li class="sub-item" @click="loadZoomBoard()">게시글 보기</li>
                        </ul>
                    </li>
                    <li @click="loadZoomBoard()" v-if="!zoomBoardwriteView">
                        <img src="../../../../assets/svg/menu/board.svg" style="width:20px;">
                        <span class="title-over">{{zoomBoardName}}</span>
                        <span class="is-dot" v-if="IsZoomBoard"></span>
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
                    <li class="badRequest-box">
                        <img src="../../../../assets/svg/btn_notify.svg" @click="badMeeting()">
                    </li>
                    <li>
                        <v-btn class="end-button" type="button" @click="userMeetingEnd()">끝내기</v-btn>
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
                            <input class="inputField" v-model="chatMsg" autocomplete="off" @keyup.enter="onkeypress"
                                   placeholder="메세지를 입력하세요">
                        </div>
                    </div>
                </div>
            </div>
            <div class="data-contents-box">
                <div class="banner-box">
                    <ul class="banner-box-ul">
                        <li v-for="banner in bannerList"  @click="goBannerUrl(banner.glink)">
                            <img :src="host+banner.img">
                        </li>
                    </ul>
                </div>
                <!--div class="content-frame-box">
                    <iframe id="viewFrame" :style="fdataFrameStyle" frameborder="0">This is an embedded <a
                        target='_blank' href='http://office.com'>Microsoft Office</a> document, powered by <a
                        target='_blank' href='http://office.com/webapps'>Office Online</a>.
                    </iframe>
                </div-->
            </div>
        </div>
        <div id="app-response" class="screenLayout">
            <pollRun :recepiveData="sendPollData" v-if="loadPollShow" @sendDataEvent="childSendData"></pollRun>
            <voteRun :recepiveData="sendVoteData" v-if="loadVoteShow" @sendDataEvent="childSendData"></voteRun>
            <examRun :recepiveData="sendExamData" v-if="loadExamShow" @sendDataEvent="childSendData"></examRun>
            <quizRun :recepiveData="sendQuizData" v-if="loadQuizShow" @sendDataEvent="childSendData"></quizRun>

        </div>

        <div class="screenLayout" v-if="screenShow">
            <examRun :recepiveData="sendExamResultData" :examResultCheck="'resultView'" v-if="loadResultExamShow" @sendDataEvent="loadExamHide"></examRun>
            <dataView :gno="no" v-if="loadDataShow" @hideEvent="screenBoxHIde"></dataView>
            <liveFileView :no="fileNo" v-if="loadFileShow" @hideEvent="screenBoxHIde"></liveFileView>
            <div class="board-layout" v-if="zoomBoardUpdateShow || zoomBoardListShow || zoomBoardViewShow">
                <boardRegist :gno="no" :no="updArticleNo" :compontentType="'live'" v-if="zoomBoardUpdateShow"
                             @hideEvent="zoomBoardBoxHIde"></boardRegist>
                <boardList :gno="no" :compontentType="'live'" v-if="zoomBoardListShow" @articleView="showArticleView"
                           @hideEvent="zoomBoardBoxHIde"></boardList>
                <boardView :gno="no" :no="articleNo" :compontentType="'live'" v-if="zoomBoardViewShow"
                           @articleUpdate="updateArticle" @hideEvent="zoomBoardBoxHIde"></boardView>
            </div>

            <div class="name-box rtq-box" v-if="badBoxShow">
                <div class="screen-header">
                    <div class="del-box" @click="hideBadBox()"><i class="fas fa-times"></i></div>
                </div>
                <form novalidate @submit.prevent="badSubmit">
                    <div class="summary"><span>'{{subject}}'</span><br> 신고 사유를 남겨주세요.</div>
                    <div class="field-box">
                        <v-textarea
                            outlined
                            placeholder="신고사유를 남겨주세요"
                            v-model="badContent"
                            :error-messages="badContentErrors"
                            @input="$v.badContent.$touch()"
                            @blur="$v.badContent.$touch()"
                            rows="4"

                        ></v-textarea>
                    </div>
                    <div class="button-box">
                        <v-btn class="submit-button" type="submit">보내기</v-btn>
                    </div>
                </form>
            </div>
            <div class="name-box exam-result-box" v-if="examResultShow">
                <div class="screen-header">
                    <div class="del-box" @click="hideExamResultBox()"><i class="fas fa-times"></i></div>
                </div>
                <div class="content-box">
                    <div class="title-box">제출이 완료되었습니다</div>
                    <div class="desc-box" v-if="ExmAnswer=='yes' && ExmDown!='yes'">
                        아래 답안보기 버튼을 눌러<br>시험 답안을 확인해 보세요
                    </div>
                    <div class="desc-box" v-if="ExmAnswer!='yes' && ExmDown=='yes'">
                        시험문제 다운로드를 원하는 경우<br>아래 다운로드 버튼을 눌러주세요
                    </div>
                    <div class="desc-box" v-if="ExmAnswer=='yes' && ExmDown =='yes'">
                        답안확인을 원하시면 답안보기 버튼을<br>
                        다운로드를 원하시면 다운로드 버튼을<br> 눌러주세요
                    </div>
                </div>
                <div :class="'button-row '+examDownButton">
                    <v-btn type="button" v-if="ExmAnswer=='yes'" @click="examGoodView()">답안보기</v-btn>
                    <v-btn type="button" v-if="ExmDown=='yes'" @click="examDownLoad()">다운로드</v-btn>
                    <v-btn type="button" class="cancle" @click="hideExamResultBox()">닫기</v-btn>
                </div>
            </div>
        </div>
        <iframe id="jsonRpcLiveFrame" :src="jsonRpcLiveUrl" scrolling="0"></iframe>
    </div>

</template>


<script>
	import AUTH from '../../../../api/auth';
	import examView from '../exam/examView'
	import pollRun from '../poll/pollRun'
	import voteRun from '../vote/voteRun'
	import examRun from '../exam/examRun'
	import quizRun from '../quiz/quizRun'
	import dataView from '../data/dataView'
	import boardList from '../board/boardList'
	import boardRegist from '../board/boardRegist'
	import boardView from '../board/boardview'
	import liveFileView from '../data/liveFileView'

	import JQ from 'jquery'
	import {
		HOST,
		API_URL_BROADCAST_LIVE_ALL_INFO,
		API_URL_BROADCAST_LIVE_USER_JOIN,
		API_URL_BROADCAST_LIVE_USER_OUT,
		API_URL_BROADCAST_LIVE_BAD_REPORT_INSERT,
		API_URL_BROADCAST_LIVE_DATA_INFO,
		API_URL_BROADCAST_LIVE_GET_EXAM
	} from '../../../../api/urls';
	import apiService from '../../../../api/apiService';
	import jsonRpcService from '../../../../api/jsonRpcService';
	import {validationMixin} from 'vuelidate'
	import {required} from 'vuelidate/lib/validators'

	export default {
		name: 'userVideo',
		components: {
			examView,
			pollRun,
			voteRun,
			examRun,
			quizRun,
			dataView,
			boardList,
			boardRegist,
			boardView,
			liveFileView
		},
		mixins: [validationMixin],
		validations: {
			badContent: {required},

		},
		computed: {
			badContentErrors() {
				const errors = []
				if (!this.$v.badContent.$dirty) return errors
				if (!this.$v.badContent.required) {
					errors.push('신고사유를 입력하세요')
				}
				return errors
			},
		},
		data() {
			return {
				host:HOST,
				uid: '',
				jsonRpcLiveUrl: '',
				insertFlag: false,
				no: '',
				DEBUG: false,
				subject: '',
				meetingNumber: '',
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
				fdataFrameStyle: {},
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
				zoomBoardwriteView: false,
				zoomBoardwriteAuth: '',
				zoomBoardViewShow: false,
				articleNo: '',
				updArticleNo: '',
				timeInterval: '',
				timeInfo: '',

				IsData: false,
				IsPoll: false,
				IsVote: false,
				IsZoomBoard: false,
				responseTitle: '',
				responseTimeInfo: '00:00:00',
				timeResponseInterval: null,
				logoUrl: '',
				completeScreenShow: false,
				joinCnt: '',
				watchCnt: '',
				liveTime: '',
				goAfterFlag: false,
				noneCloseWin: true,
				badContent: '',
				badBoxShow: false,
				examResultShow: false,
				ExmAnswer: '',
				ExamDown: '',
				userPollComplete: false,
				sendPollData: {},
				sendVoteData: {},
				sendExamData: {},
				sendQuizData: {},
				isLogin: false,
				examResultNo: '',
				examNo: '',
				fileNo:'',
                loadFileShow:false,
				sendExamResultData:{},
                loadResultExamShow:false,
				bannerList:[],

			}
		},
		created() {
			if(sessionStorage.getItem('reload')=='yes') {
				sessionStorage.setItem('reload','')
                this.doError();
				return;
            }
			AUTH.setDevice(this.$isMobile());
			let memberInfo = AUTH.getSession(this.$isMobile());
			if (memberInfo.AUTHTOKEN) {
				this.isLogin = true;

			}
			this.no = this.$route.params.no;
			if (this.no < 1) {
				this.doError();
				return;
			}
			this.uid = sessionStorage.getItem('joinUid');
			this.userName = sessionStorage.getItem('userName');
			this.userEmail = sessionStorage.getItem('userEmail');
			if (this.uid && this.userName) {
				this.$eventBus.$emit('overlay', 'open');

				jsonRpcService.sendType = 'live';
				this.jsonRpcLiveUrl = jsonRpcService.jsonRpcLiveUrl + '/index?uid=' + this.uid;
				this.$eventBus.$on('liveRpcResponse', this.transferAction);
				if (!window['YT']) {
					var tag = document.createElement('script');
					tag.src = 'https://www.youtube.com/iframe_api';
					var firstScriptTag = document.getElementsByTagName('script')[0];
					firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
				}
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
				this.examResultNo = 4;
				this.examGoodView();

			},
			joinSocketRoom() {
				let checkInterval = setInterval(() => {
					if (this.chatRoomNo) {
						clearInterval(checkInterval)
						let frm = {
							roomNo: this.chatRoomNo,
							uid: this.uid,
							userName: this.userName,
							userEmail: this.userEmail,
							roomHost: 'no',
							sendType: 'joinUser'
						}

						jsonRpcService.post(frm, (res) => {
							//console.log()
						});
					}
				}, 500)

			},
			getMeetingInfo() {
				const frm = new FormData()
				frm.append('no', this.no)
				apiService.post(API_URL_BROADCAST_LIVE_ALL_INFO, frm, (ret) => {
					if (ret.info.status == 'complete') {
						alert('종료된 방송 입니다');
						this.doError();
						return;
					}
					this.chatRoomNo = ret.info.uid;
					this.logoUrl = (ret.info.logo) ? ret.info.logo : '';
					this.video = ret.info.videoId;
					this.IsProblem = (ret.problemInfo) ? true : false;
					if (ret.linkList) {
						if (ret.linkList.length > 0) this.IsData = true;
					}
					if (ret.fileList) {
						if (ret.fileList.length > 0) this.IsData = true;
					}
					this.IsPoll = (ret.pollInfo) ? true : false;
					this.IsVote = (ret.voteInfo) ? true : false;
                    this.bannerList = ret.bannerList;
					let ingDts = ret.info.ingDate;
					let ingDate = new Date(ingDts);
					let nowDate = new Date();
					let timeCnt = (nowDate.getTime() - ingDate.getTime()) / 1000;
					timeCnt = Math.floor(timeCnt);
					if (timeCnt < 0) timeCnt = 0;
					this.timeInterval = setInterval(() => {
						this.timeInfo = this.setTimeVal(timeCnt);
						timeCnt++;

					}, 1000);
					if (ret.boardInfo) {
						this.zoomBoardName = ret.boardInfo.boardName;
						this.zoomBoardwriteAuth = ret.boardInfo.writeAuth;
						this.IsZoomBoard = (ret.zoomBoardCnt) ? true : false;

					}
					switch (this.zoomBoardwriteAuth) {
						case 'host':
							this.zoomBoardwriteView = false;
							break;
						case 'user':
							if (this.isLogin) {
								this.zoomBoardwriteView = true;
							} else this.zoomBoardwriteView = false;
						case 'all':
							this.zoomBoardwriteView = true;
							break;
					}
					this.status = ret.info.status;
					this.meetingNumber = ret.info.roomNo;
					this.passWord = ret.info.roomPw;
					this.subject = ret.info.title;
					this.brdType = 'teacher';
					this.accessType = ret.info.acceptType;
					if(this.accessType=='no') {
						this.$eventBus.$emit('overlay', 'open');
						this.accessRoom();
					}


					this.ExmAnswer = (ret.info.examImmAnswer) ? ret.info.examImmAnswer : 'yes';
					this.ExmDown = (ret.info.examDown) ? ret.info.examDown : 'no';




				})
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
			openResponse() {
				JQ('#app-response').show();
				JQ('#menu-response-box').hide();
			},
			loadPollList() {
				if (this.userPollComplete) {
					let message = {
						message: '설문조사를 완료하였습니다',
					};
					this.$eventBus.$emit('modalOpen', message);
					return;
				}

				this.sendPollData = {
					no: this.no,
					uid: this.uid,
					name: this.userName,
					email: this.userEmail
				};
				JQ('#app-response').show();
				this.loadPollShow = true;
			},
			loadVoteList() {
				if (this.userVoteComplete) {
					let message = {
						message: '투표를 완료하였습니다',

					};
					this.$eventBus.$emit('modalOpen', message);
					return;
				}

				this.sendVoteData = {
					no: this.no,
					uid: this.uid,
					name: this.userName,
					email: this.userEmail
				};
				JQ('#app-response').show();
				this.loadVoteShow = true;
			},
			loadDataList() {
				this.screenShow = true;
				this.loadDataShow = true;
			},
			screenBoxHIde(event) {
				if(event.page=='data') {
					if(event.action=='view') {
						this.fileNo = event.data;
						this.loadFileShow = true;
					} else {
						this.screenShow = false;
                    }

					this.loadDataShow = false;
                } else if(event.page=='fileView') {
					this.screenShow = false;
					this.loadFileShow = false;
                }

			},
			examGoodView() {
				this.sendExamResultData = {
					resultNo:this.examResultNo

				};
				this.screenShow = true;
				this.examResultShow = false;
				this.loadResultExamShow = true;

			},
			hideExamResultBox() {
				this.screenShow = false;
				this.examResultShow = false

			},
			loadExamHide(event) {
				this.screenShow = false;
				this.loadResultExamShow = false;
			},
			openResponse() {
				JQ('#app-response').show();
				JQ('#menu-response-box').hide();
			},
			examDownLoad() {
				const frm = new FormData()
				frm.append('no', this.examResultNo)
				apiService.post(API_URL_BROADCAST_LIVE_GET_EXAM, frm, (ret) => {
					this.excelDown(ret.info);

				})

			},
			excelDown(info) {
				let datas = info.problems;

				var tab_text = '<html xmlns:x="urn:schemas-microsoft-com:office:excel">';
				tab_text = tab_text + '<head><meta http-equiv="content-type" content="application/vnd.ms-excel; charset=UTF-8">';
				tab_text = tab_text + '<xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet>'
				tab_text = tab_text + '<x:Name>Sheet</x:Name>';
				tab_text = tab_text + '<x:WorksheetOptions><x:Panes></x:Panes></x:WorksheetOptions></x:ExcelWorksheet>';
				tab_text = tab_text + '</x:ExcelWorksheets></x:ExcelWorkbook></xml></head><body>';
				tab_text = tab_text + "<table border='1px'>";
				tab_text = tab_text + '<tr><td colspan="2">' + info.subject + '</td></tr><tr><td colspan="2"></td></tr>';
				let pIdx = 1;
				for (let data of datas) {
					tab_text = tab_text + '<tr><td colspan="2">' + pIdx + '. ' + data.question + '</td></tr>'
					if (data.prbType == 'mchoice') {
						let idx = 1;
						for (let item of data.items) {
							tab_text = tab_text + '<tr><td>' + idx + '</td><td>' + item.answer + '</td></tr>';
							idx++;
						}
						//} else if(data.prbType=='subject') {
					}
					tab_text = tab_text + '<tr><td colspan="2"></td></tr>'
				}
				tab_text = tab_text + '</table></body></html>';
				var data_type = 'data:application/vnd.ms-excel';
				var ua = window.navigator.userAgent;
				var msie = ua.indexOf("MSIE ");

				var fileName = info.subject + '.xls';
				//Explorer 환경에서 다운로드
				if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)) {
					if (window.navigator.msSaveBlob) {
						var blob = new Blob([tab_text], {
							type: "application/csv;charset=utf-8;"
						});
						navigator.msSaveBlob(blob, fileName);
					}
				} else {
					var blob2 = new Blob([tab_text], {
						type: "application/xls;charset=utf-8;"
					});
					var filename = fileName;
					var elem = window.document.createElement('a');
					elem.href = window.URL.createObjectURL(blob2);
					elem.download = filename;
					document.body.appendChild(elem);
					elem.click();
					document.body.removeChild(elem);
				}
			},
			badMeeting() {
				this.screenShow = true;
				this.badBoxShow = true;


			},
			hideBadBox() {
				this.badContent = '';
				this.$v.$reset()
				this.screenShow = false;
				this.badBoxShow = false;

			},
			badSubmit() {
				this.$v.$touch()
				if (!this.$v.$anyError) {
					const frm = new FormData()
					frm.append('gno', this.no)
					frm.append('uid', this.uid)
					frm.append('name', this.userName)
					frm.append('content', this.badContent)
					apiService.post(API_URL_BROADCAST_LIVE_BAD_REPORT_INSERT, frm, (ret) => {
						this.hideBadBox();
						let message = {
							type:'timeout',
							message: '신고가 접수되었습니다',

						};
						this.$eventBus.$emit('modalOpen', message);
					});
				}

			},
			doError() {
				if(location.hostname=='localhost')return;
			    window.opener.sessionStorage.setItem('joinRoomNo', '');
				window.opener.document.location.reload();
				JQ(window).off("beforeunload");
				window.close();
			},
			userMeetingEnd() {
				let message = {
					type: 'confirm',
					message: '방송시청을 종료하시겠습니까?',
					doAction: () => {
						this.userMeetingEndActive();
					}
				};
				this.$eventBus.$emit('modalOpen', message);

			},
			accessRoom() {
				if (this.accessType != 'yes') {


					let job = (sessionStorage.getItem('userJob')) ? sessionStorage.getItem('userJob') : '';
					let part = (sessionStorage.getItem('userPart')) ? sessionStorage.getItem('userPart') : '';
					let posi = (sessionStorage.getItem('userPosi')) ? sessionStorage.getItem('userPosi') : '';
					let sex = (sessionStorage.getItem('userSex')) ? sessionStorage.getItem('userSex') : '';

					const frm = new FormData()
					frm.append('job', job)
					frm.append('part', part)
					frm.append('posi', posi)
					frm.append('sex', sex)
					frm.append('gno', this.no)
					frm.append('name', this.userName)
					frm.append('email', this.userEmail)
					frm.append('uid', this.uid)
					apiService.post(API_URL_BROADCAST_LIVE_USER_JOIN, frm, (ret) => {
						setTimeout(() => {
							this.startVideo();
						}, 1000)

					})
				}
			},
			userMeetingEndActive() {
				let rpcParams = {
					sendType: 'roomHost',
					sendMethod: 'outUser',
					data: this.uid,
					uid: this.uid,
					roomNo: this.chatRoomNo,
				};
				jsonRpcService.post(rpcParams,()=>{

                });
				const frm = new FormData()
				frm.append('gno', this.no)
				frm.append('uid', this.uid)

                apiService.post(API_URL_BROADCAST_LIVE_USER_OUT, frm, (ret) => {
					this.doError();
				});

			},
			transferAction(params) {
				console.log(params);
				if (params.data.sendMethod == 'join') {
					if (params.result != 'succ') return;
					if (params.data.result == 'doubleId') {
						window.opener.sessionStorage.setItem('joinRoomNo', '');
						let message = {
							message: '동일한 아이디로 접속중입니다<br>참가 종료하신 경우에는<br>잠시후 다시 시도해주세요',
							doAction: () => {
								this.doError();
							}
						};
						this.$eventBus.$emit('modalOpen', message);
						return;
					} else {
						this.joinSocketRoom();
					}

					return;
				}
				switch (params.data.sendMethod) {
					case 'userJoinPermit':
						this.$eventBus.$emit('overlay', 'hide');
						if (params.data.cmd == 'yes') {
							this.accessType = 'no';
							this.accessRoom();
						} else {
							let message = {
								message: '입장 거부 되었습니다',
								doAction: () => {
									this.doError();
								}
							};
							this.$eventBus.$emit('modalOpen', message);
						}

						break;
					case 'insertProblem':
						JQ('#app-response').show();
						this.examNo = parseInt(params.data.data);
						this.sendExamData = {
							no: parseInt(params.data.data),
							uid: this.uid,
							name: this.userName
						};
						this.loadExamShow = true;
						break;
					case 'insertPoll':
						if (this.userPollComplete) return;
						JQ('#app-response').show();
						this.sendPollData = {
							no: parseInt(params.data.data),
							uid: this.uid,
							name: this.userName
						};
						this.loadPollShow = true;
						break;
					case 'insertVote':
						if (this.userVoteComplete) return;
						JQ('#app-response').show();
						this.sendVoteData = {
							no: parseInt(params.data.data),
							uid: this.uid,
							name: this.userName
						};

						this.loadVoteShow = true;
						break;
					case 'insertQuiz':
						JQ('#app-response').show();
						this.sendQuizData = {
							no: parseInt(params.data.data),
							uid: this.uid,
							name: this.userName
						};
						this.loadQuizShow = true;
						break;

					case 'forceEnd':
						this.examNo = 0;
						this.loadExamShow = false;
						this.sendVoteData = {};
						this.loadVoteShow = false;
						this.sendPollData = {};
						this.loadPollShow = false;
						this.loadQuizShow = false;
						this.sendQuizData = {};

						JQ('#app-response').hide();
						JQ('#menu-response-box').hide();
						if (this.timeResponseInterval) {
							this.responseTimeInfo = '00:00:00'
							clearInterval(this.timeResponseInterval);
						}

						break;

					case 'chattingUserAll':
					case 'chattingAll':
						let messageData = params.data;
						//console.log(messageData.uid,this.joinUid)
						if (messageData.uid == this.uid) return;
						let item = {
							user: 'user',
							name: messageData.name,
							uid: messageData.uid,
							email: messageData.email,
							message: messageData.chatmsg
						}
						this.chatMsgList.push(item);
						break;
					case 'userOut':
						let outUid = params.data.uid;
						if (outUid != this.uid) return;
						this.userOut();
						break;
					case 'endMeeting':
						this.adminEndMeeting()
						break;
					case  'insertFdata':
						this.setFdata(params.data.data);
						break;

				}
			},
			setFdata(no) {
				this.screenShow = true;
				this.fileNo = no;
				this.loadFileShow = true;
				//if (params.ext == 'google') {
					//let height = JQ(window).height();
					//let left = JQ(window).width() - 800;
					//window.open('https://drive.google.com/file/d/' + params.url + '/view?ths=true', 'gWin', 'width=800,height=' + height + ',top=0,left=' + left);
				//} else {

			},
			adminEndMeeting() {
				let message = {
					message: '방송이 종료되었습니다',
					doAction: () => {
						this.doError();
					}
				};
				this.$eventBus.$emit('modalOpen', message);
			},
			userOut() {
				let message = {
					message: '강제 퇴장 당했습니다',
					doAction: () => {
						this.doError();
					}
				};
				this.$eventBus.$emit('modalOpen', message);

			},
			childSendData(event) {
				let rpcParams = {};
				JQ('#app-response').hide();

				switch (event.page) {
					/**
					 *@ 새로 추가된곳 시작
					 **/
					case 'barHide':
						switch (event.active) {
							case 'exam':
								this.responseTitle = '시험 진행중';

								break;
							case 'poll':
								this.responseTitle = '설문 진행중';
								break;
							case 'vote':
								this.responseTitle = '투표 진행중';
								break;
							case 'quiz':
								this.responseTitle = '간단퀴즈 진행중';
								break;
						}
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

						break;
					/**
					 *@ 새로 추가된곳 끝
					 **/

					case 'exam':
						switch (event.active) {
							case 'replayExam':
								rpcParams = {
									sendType: 'roomHost',
									sendMethod: 'replayProblem',
									roomNo: this.chatRoomNo,
									uid: this.uid,
									data: this.uid
								};
								jsonRpcService.post(rpcParams, () => {

								});

								break;
						}
						this.loadExamShow = false;
						// 새로 추가된곳 시작 2020 11 04 //

						if (this.ExmAnswer == 'yes' || this.ExmDown == 'yes') {
							this.screenShow = true
							this.examResultShow = true;
							this.examResultNo = this.examNo;
							if (this.ExmAnswer == 'yes' && this.ExmDown == 'yes') {
								this.examDownButton = 'triple';
							}
						}
						this.examNo = 0;

						break;
					case 'poll':
						switch (event.active) {
							case 'replayPoll':
								this.userPollComplete = true;
								rpcParams = {
									sendType: 'roomHost',
									sendMethod: 'replayPoll',
									roomNo: this.chatRoomNo,
									uid: this.uid,
									data: this.uid
								};
								jsonRpcService.post(rpcParams, () => {

								});
								break;
						}
						this.sendPollData = {};
						this.pollShow = false;
						break;
					case 'vote':
						switch (event.active) {
							case 'replayVote':
								this.userVoteComplete = true;
								rpcParams = {
									sendType: 'roomHost',
									sendMethod: 'replayVote',
									roomNo: this.chatRoomNo,
									uid: this.uid,
									data: this.uid
								};
								jsonRpcService.post(rpcParams, () => {

								});
								break;
						}
						this.sendVoteData = {};
						this.voteShow = false;
						break;
					case 'quiz':
						switch (event.active) {
							case 'replayQuiz':
								rpcParams = {
									sendType: 'roomHost',
									sendMethod: 'replayQuiz',
									roomNo: this.chatRoomNo,
									uid: this.uid,
									data: this.uid
								};
								jsonRpcService.post(rpcParams, () => {

								});
								break;
						}
						this.sendQuizData = {};
						this.loadQuizShow = false;

						break;

				}
			},

			onkeypress(event) {
				let item = {
					user: 'me',
					name: this.userName,
					uid: this.uid,
					email: this.userEmail,
					message: this.chatMsg
				}
				this.chatMsgList.push(item);
				let frm = {
					sendType: 'chatting',
					sendMethod: 'chattingAll',
					name: this.userName,
					chatmsg: this.chatMsg,
					uid: this.uid,
					roomNo: this.chatRoomNo,
					email: this.userEmail,
				}
				this.chatMsg = '';
				jsonRpcService.post(frm, (res) => {

				});


			},
			startVideo() {
				var obj = this;
				if (!this.video) {
					return;
				}
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

			},
			onPlayerReady(event) {
				console.log(event);
				event.target.playVideo();
			},
			onPlayerStateChange(event) {
				return;
				if (event.data == 1) {
					this.videoPlaying = true;
				} else this.videoPlaying = false;
				//console.log(event);

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

			}
		},
		mounted() {
			let obj = this;
			JQ(window).on("beforeunload", function (eventObject) {
				if(obj.chatRoomNo) {
					let rpcParams = {
						sendType: 'roomHost',
						sendMethod: 'outUser',
						data: obj.uid,
						uid: obj.uid,
						roomNo: obj.chatRoomNo,
					};
					jsonRpcService.post(rpcParams, () => {

					});

					const frm = new FormData()
					frm.append('gno', obj.no)
					frm.append('uid', obj.uid)

					apiService.post(API_URL_BROADCAST_LIVE_USER_OUT, frm, (ret) => {

						window.opener.sessionStorage.setItem('joinRoomNo', '');
						window.opener.document.location.reload();
						window.close();
					});
				}
				return false;
			});
			//window.resizeTo(JQ(window).width(), JQ(window).height() + 150)
			let height = JQ(window).height() - 670;
			//let width =
			this.chatStyle = {'height': height + 'px', 'width': '100%'};
			this.attendStyle = {'height': (JQ(window).height() - 114) + 'px'}
			this.fdataFrameStyle = {'height': (JQ(window).height() - 140) + 'px'}


		},
        beforeDestroy() {
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
        #app-response {
            display: none;
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
                            width: 30px;
                            height: 30px;
                            background: #ff0000;
                            border-radius: 25px;
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
                background: #999999;
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
                            margin:0;
                            cursor:pointer;
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
            .name-box {
                width: 400px;
                height: 350px;
                -webkit-box-shadow: 1px 1px 9px -1px rgba(71, 70, 71, 0.53);
                -moz-box-shadow: 1px 1px 9px -1px rgba(71, 70, 71, 0.53);
                box-shadow: 1px 1px 9px -1px rgba(71, 70, 71, 0.53);
                border-radius: 10px;
                position: absolute;
                left: 50%;
                top: 50%;
                background: #ffffff;
                margin: -160px 0 0 -200px;
                padding: 60px 20px 0 20px;
            }
            .screen-header {
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
            .summary {
                text-align: center;
                line-height: 150%;
                font-size: 11pt;
                color: #000;

            }
            .field-box {
                margin: 20px 0 0 0;
                .field {
                    width: 100%;
                }
            }
            .button-box {
                button {
                    width: 100%;
                    height: 50px;
                    background: #5E65E3;
                    color: #fff;
                    border-radius: 25px;
                }
            }
            &.login-box {
                .screen-title {
                    text-align: center;
                    font-weight: bold;
                    color: #000;
                    font-size: 12pt;
                    margin-bottom: 17px;
                }
                .button-row {
                    margin-top: 24px;
                    width: 100%;
                    button {
                        width: 48%;
                        height: 50px;
                        border-radius: 25px;
                        &:first-child {
                            margin-right: 4%;
                        }
                    }

                }

            }

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
            .title {
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
                &:first-child {
                    margin-right: 30px;
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
        margin: -350px 0 0 -400px;

    }

    .exam-result-box {
        .content-box {
            text-align: center;
            .title-box {
                color: #000;
                font-weight: bold;
                font-size: 14pt;
            }
            .desc-box {
                color: #999;
                font-size: 11pt;
                margin: 30px 0;
                line-height: 140%;
            }
        }
        .button-row {
            button {
                width: 48%;
                height: 50px;
                border-radius: 25px;
                background: #5E65E3;
                color: #fff;
                &:first-child {
                    margin-right: 4%;
                }
                &.cancle {
                    background: #999;
                }
            }
            &.triple {
                button {
                    width: 32%;
                    &:first-child {
                        margin-right: 2%;
                    }
                    &:last-child {
                        margin-left: 2%;
                    }
                }
            }
        }

    }
</style>