<template>
    <div class="zoom-layout">
        <div class="header">
            {{ subject }}

        </div>
        <div class="youtube-layout">
            <div class="youtube-box">
                <div class="youtube-iframe">
                    <div id="player" style="width:100%;height:250px;"></div>
                </div>
            </div>
        </div>
        <div class="chating-box">
            <div class="chat-header">채팅</div>
            <div class="chat-container" :style="chatStyle">
                <ul class="chatmsg-list">
                    <li v-for="msg in chatMsgList" :class="msg.user">
                        <span class="user">{{ msg.name }}</span>
                        <span class="message">{{ msg.message }}</span>
                    </li>
                </ul>
            </div>
            <div class="chat-message-box" id="chat-message-box">
                <div :class="'menu '+extendClass" v-if="menuBoxShow">
                    <div class="menu-header">
                        <div class="left" v-if="barHideFlag" @click="backMenu()">
                            <div class="del-box"><i class="fas fa-arrow-left"></i></div>
                        </div>
                        <div class="menu-title">{{ menuTitle }}</div>
                        <div class="right">
                            <div class="extend-box" v-if="extendShow" @click="contenWindowExtend()">
                                <i :class="'fas '+extendIcon"></i>
                            </div>
                            <div class="del-box" v-if="!onlyContentShow" @click="hideMenu()"><i
                                class="fas fa-times"></i></div>
                        </div>
                        <div style="clear:both;"></div>
                    </div>
                    <div id="barHideLayout" v-if="contentShow">

                        <pollRun :recepiveData="sendPollData" v-if="loadPollShow"
                                 @sendDataEvent="childSendData"></pollRun>
                        <voteRun :recepiveData="sendVoteData" v-if="loadVoteShow"
                                 @sendDataEvent="childSendData"></voteRun>
                        <examRun :recepiveData="sendExamData" v-if="loadExamShow"
                                 @sendDataEvent="childSendData"></examRun>
                        <quizRun :recepiveData="sendQuizData" v-if="loadQuizShow"
                                 @sendDataEvent="childSendData"></quizRun>
                        <examRun :recepiveData="sendExamResultData" :examResultCheck="'resultView'"
                                 v-if="loadResultExamShow" @sendDataEvent="loadExamHide"></examRun>
                        <dataView :gno="no" v-if="loadDataShow" @hideEvent="screenBoxHIde"></dataView>
                        <liveFileView :no="fileNo" v-if="loadFileShow" @hideEvent="screenBoxHIde"></liveFileView>
                        <boardRegist :gno="no" :no="updArticleNo" :compontentType="'live'"
                                     v-if="zoomBoardUpdateShow"
                                     @hideEvent="zoomBoardBoxHIde"></boardRegist>
                        <boardList :gno="no" :compontentType="'live'" v-if="zoomBoardListShow"
                                   @articleView="showArticleView"
                                   @hideEvent="zoomBoardBoxHIde"></boardList>
                        <boardView :gno="no" :no="articleNo" :compontentType="'live'" v-if="zoomBoardViewShow"
                                   @articleUpdate="updateArticle" @hideEvent="zoomBoardBoxHIde"></boardView>


                    </div>
                    <div v-if="menuLayoutShow">
                        <ul class="menu-box" v-if="openDialogShow">
                            <li v-for="menu in subMenuList" @click="subMenuAction(menu.code)">
                                <div :class="'sub-icon '+menu.gclass">
                                    <img :src="menu.icon"></div>
                                <div class="title-over">{{ menu.name }}</div>
                            </li>

                        </ul>
                        <ul class="menu-box" v-if="!openDialogShow">
                            <li @click="loadPollList()" v-if="IsPoll">
                                <div class="icon"><img src="../../../../assets/mobileimg/live03menu/ico_m_menu1.svg"
                                                       style="width:20px;"><span
                                    class="is-dot" v-if="IsPoll"></span></div>
                                <div class="title-over">설문조사</div>
                            </li>
                            <li @click="loadVoteList()" v-if="IsVote">
                                <div class="icon"><img src="../../../../assets/mobileimg/live03menu/ico_m_menu2.svg"
                                                       style="width:35px;padding-top:2px;"> <span class="is-dot"
                                                                                                  v-if="IsVote"></span>
                                </div>
                                <div class="title-over">투표</div>
                            </li>
                            <li @click="loadDataList()">
                                <div class="icon"><img src="../../../../assets/mobileimg/live03menu/ico_m_menu3.svg"
                                                       style="width:35px;padding-top:2px;"><span class="is-dot"
                                                                                                 v-if="IsData"></span>
                                </div>
                                <div class="title-over">자료공유</div>
                            </li>
                            <li @click="showOpenDialog('board')" v-if="zoomBoardwriteView">
                                <div class="icon"><img src="../../../../assets/mobileimg/live03menu/ico_m_menu4.svg"
                                                       style="width:20px;"><span
                                    class="is-dot" v-if="IsZoomBoard"></span></div>

                                <div class="title-over">{{ zoomBoardName }}</div>

                            </li>
                            <li @click="loadZoomBoard()" v-if="!zoomBoardwriteView">
                                <div class="icon"><img src="../../../../assets/mobileimg/live03menu/ico_m_menu4.svg"
                                                       style="width:20px;"><span
                                    class="is-dot" v-if="IsZoomBoard"></span></div>

                                <div class="title-over">{{ zoomBoardName }}</div>
                            </li>
                        </ul>
                        <div class="end-button-box" v-if="!contentShow">
                            <div class="btn" @click="badMeeting()">
                                신고하기
                            </div>
                            <div class="btn" @click="userMeetingEnd()">
                                끝내기
                            </div>
                        </div>
                    </div>
                </div>
                <div class="chat-message-sender" style="border-top:solid 1px #ccc;"
                     v-if="chatSenderShow && !contentShow">
                    <div class="chat-menu-box" @click="showMenu()"><img
                        src="../../../../assets/mobileimg/live02chat/btn_menu2.svg"></div>
                    <div class="field-box">
                        <input v-model="chatMsg" autocomplete="off" class="field" placeholder="메세지를 입력하세요">
                    </div>
                    <div class="chat-button-box"><img
                        src="../../../../assets/mobileimg/live02chat/btn_send.svg" @click="onkeypress()"></div>

                </div>

            </div>
        </div>
        <div class="screenLayout" v-if="screenShow">
            <div class="name-box rtq-box" v-if="badBoxShow">
                <div class="screen-header">
                    <div class="del-box" @click="hideBadBox()"><i class="fas fa-times"></i></div>
                </div>
                <form novalidate @submit.prevent="badSubmit">
                    <div class="summary"><span>'{{ subject }}'</span><br> 신고 사유를 남겨주세요.</div>
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
            host: HOST,
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
            fileNo: '',
            loadFileShow: false,
            sendExamResultData: {},
            loadResultExamShow: false,
            bannerList: [],
            chatSenderShow: true,
            menuBoxShow: false,
            subMenuList: [],

            openDialogShow: false,
            dialogTitle: '',
            currentUrl: '',
            barHideFlag: false,
            contentShow: false,
            menuLayoutShow: true,
            IsWaitUser: false,
            loadUser: false,
            webinaClass: '',
            menuBoxStat: '',
            rpcSendMenu: false,
            rpcSendRtq: false,
            menuDepth: 1,
            extendClass: '',
            extendIcon: 'fa-expand',
            extendShow: false,
            onlyContentShow: false,
            menuTitle: '',
            tempMenuTitle: '',
            backMenuTitle: '',
            subMenuFlag: false,
            fileView: false,

        }
    },
    created() {
        if (location.hostname != 'localhost') {
            if (sessionStorage.getItem('reload') == 'yes') {
                sessionStorage.setItem('reload', '')
                this.doError();
                return;
            }
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
            if (location.hostname != 'localhost') {
                this.$eventBus.$emit('overlay', 'open');
            }
            jsonRpcService.checkDebug();
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
        showMenu() {
            sessionStorage.setItem('hostBack', '')
            if (this.menuBoxShow) {
                this.menuBoxShow = false;
                this.contentAllHide();
            } else {
                this.contentShow = false;
                this.menuLayoutShow = true;
                this.menuBoxShow = true;


            }
        },
        hideMenu() {
            sessionStorage.setItem('hostBack', '')
            this.onlyContentShow = false;
            this.contentShow = false;
            this.menuBoxShow = false;
            this.contentAllHide();
            this.contenWindowCompress();

        },
        showOpenDialog(mode) {
            this.subMenuList = [];
            this.barHideFlag = true;
            this.subMenuFlag = true;
            let item = {};
            switch (mode) {
                case 'board':
                    this.menuTitle = this.zoomBoardName;
                    item = {
                        code: 'boardWrite',
                        name: '게시글 작성',
                        icon: require('@/assets/svg/submenu/bwrite.png'),
                        gclass: ''
                    };
                    this.subMenuList.push(item);
                    item = {
                        code: 'boardList',
                        name: '게시글 보기',
                        icon: require('@/assets/svg/submenu/blist.png'),
                        gclass: ''
                    };
                    this.subMenuList.push(item);
                    break;

            }
            this.openDialogShow = true;
        },
        backMenu() {
            if (this.rpcSendMenu) {
                this.rpcSendMenu = false;
                this.loadUser = false;

                if (this.backMenuTitle) {
                    this.menuTitle = this.backMenuTitle;
                    this.backMenuTitle = '';
                }
                switch (this.menuBoxStat) {
                    case 'menuHide':
                        this.menuBoxShow = false;
                        this.contentShow = false;
                        this.menuLayoutShow = false;
                        this.contentAllHide();
                        break;
                    case 'menuOpen':
                        this.contentShow = false;
                        this.menuLayoutShow = true;
                        break;
                    default:
                        if (this.onlyContentShow) {
                            this.barHideFlag = false;
                        }
                        break;
                }
                return;
            }


            if (this.rpcSendRtq) {
                this.rpcSendRtq = false;
                this.zoomRtqWriteShow = false;
                if (this.backMenuTitle) {
                    this.menuTitle = this.backMenuTitle;
                    this.backMenuTitle = '';
                }
                switch (this.menuBoxStat) {
                    case 'menuHide':
                        this.menuBoxShow = false;
                        this.contentShow = false;
                        this.menuLayoutShow = false;
                        this.contentAllHide();
                        break;
                    case 'menuOpen':
                        this.contentShow = false;
                        this.menuLayoutShow = true;
                        this.contenWindowCompress();
                        break;
                    default:
                        if (this.onlyContentShow) {
                            this.barHideFlag = false;
                        }
                        break;
                }
                return;
            }
            if (this.fileView) {
                this.fileView = false;
                let parentParams = {
                    method: 'hostBackFileList',
                    data: {}
                };
                // this.utilService.parentToAction(parentParams);
                return;
            }
            if (sessionStorage.getItem('hostBack')) {

                switch (sessionStorage.getItem('hostBack')) {
                    case 'rtqList':
                        this.zoomRtqWriteShow = false;
                        this.zoomRtqListShow = true;
                        break;
                    default:
                        let parentParams = {
                            method: 'hostBackBoardList',
                            data: {code: sessionStorage.getItem('hostBack')}
                        };
                        //this.utilService.parentToAction(parentParams);
                        break;
                }
                sessionStorage.setItem('hostBack', '')
                return;

            }
            if (this.menuDepth == 1) {
                this.barHideFlag = false;
                this.onlyContentShow = false;
                this.menuTitle = '';
                if (this.subMenuFlag) {
                    this.subMenuFlag = false;
                    this.openDialogShow = false;
                    return;
                }

            } else if (this.menuDepth > 1) {
                if (this.tempMenuTitle) {
                    this.menuTitle = this.tempMenuTitle;
                    this.tempMenuTitle = '';
                }
                if (!this.barHideFlag) this.barHideFlag = true;
                this.onlyContentShow = false;
                this.openDialogShow = true;
                this.menuDepth = 1;
            }
            this.contentShow = false;
            this.menuLayoutShow = true;
            this.contenWindowCompress();
            this.contentAllHide();


        },
        contentVisible() {
            this.onlyContentShow = false;
            this.extendShow = true;
            this.contentShow = true;
            this.menuLayoutShow = false;
            this.barHideFlag = true;

        },
        onlyContentVisible() {
            this.onlyContentShow = true;
            this.extendShow = true;
            this.contentShow = true;
            this.menuLayoutShow = false;
        },
        contenWindowCompress() {
            //if (this.extendClass == 'fullHeight') {
            this.extendClass = ''
            this.extendIcon = 'fa-expand';
            this.extendShow = false;
            this.chatSenderShow = true;

            //}
        },
        contenWindowExtend() {
            JQ('#barHideLayout').css('height', '96%');
            if (this.extendClass == 'fullHeight') {
                this.extendClass = ''
                this.extendIcon = 'fa-expand';
                this.chatSenderShow = true;
            } else {
                JQ('#barHideLayout').css('height', '87%');
                this.extendClass = 'fullHeight'
                this.extendIcon = 'fa-compress';
                this.chatSenderShow = false;
            }
        },
        subMenuAction(code) {
            this.contentVisible();
            this.openDialogShow = false;
            this.menuDepth = 2;
            this.tempMenuTitle = this.menuTitle;

            switch (code) {
                case 'boardWrite':
                    this.menuTitle = '게시글 작성';
                    this.zoomBoardWrite();
                    break;
                case 'boardList':
                    this.menuTitle = '게시글 보기';
                    this.loadZoomBoard();
                    break;
                case 'examList':
                    this.menuTitle = '시험 불러오기';
                    this.loadExamList();
                    break;
                case 'examWrite':
                    this.menuTitle = '즉시 만들기';
                    this.loadImmExam();
                    break;

            }
        },
        contentAllHide() {
            this.loadFileShow = false;
            this.loadExamShow = false;
            this.loadImmExamShow = false;
            this.loadPollShow = false;
            this.loadVoteShow = false;
            this.loadQuizShow = false;
            this.loadDataShow = false;
            this.zoomBoardUpdateShow = false;
            this.zoomBoardListShow = false;
            this.loadUser = false;
            this.webinaInfoShow = false;
            this.webinaDataShow = false;
            this.noticeShow = false;
            this.zoomRtqListShow = false;
            this.chatSenderShow = true;
            this.fileView = false;
            this.contentShow = false;

        },
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
                if (this.accessType == 'no') {
                    this.$eventBus.$emit('overlay', 'open');
                    this.accessRoom();
                }


                this.ExmAnswer = (ret.info.examImmAnswer) ? ret.info.examImmAnswer : 'yes';
                this.ExmDown = (ret.info.examDown) ? ret.info.examDown : 'no';


            })
        },
        zoomBoardWrite() {
            this.updArticleNo = 'new';
            this.zoomBoardUpdateShow = true;
        },
        loadZoomBoard() {
            this.contentVisible()
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
        //openResponse() {
        //  JQ('#app-response').show();
        //JQ('#menu-response-box').hide();
        //},
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
            this.menuTitle = '설문조사';
            this.onlyContentVisible();
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
            this.loadVoteShow = true;
            this.onlyContentVisible();

        },
        loadDataList() {
            this.menuTitle = '자료공유';
            this.contentVisible()
            this.loadDataShow = true;
        },
        screenBoxHIde(event) {
            if (event.page == 'data') {
                if (event.action == 'view') {
                    this.fileNo = event.data;
                    this.loadFileShow = true;
                } else {
                    this.screenShow = false;
                }

                this.loadDataShow = false;
            } else if (event.page == 'fileView') {
                this.screenShow = false;
                this.loadFileShow = false;
            }

        },
        examGoodView() {
            this.sendExamResultData = {
                resultNo: this.examResultNo

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
                        type: 'timeout',
                        message: '신고가 접수되었습니다',

                    };
                    this.$eventBus.$emit('modalOpen', message);
                });
            }

        },
        doError() {
            window.opener.sessionStorage.setItem('joinRoomNo', '');
            window.opener.document.location.reload();
            JQ(window).off("beforeunload");
            location.href='/userLiveIntro/'+this.no;
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
            jsonRpcService.post(rpcParams, () => {

            });
            const frm = new FormData()
            frm.append('gno', this.no)
            frm.append('uid', this.uid)

            apiService.post(API_URL_BROADCAST_LIVE_USER_OUT, frm, (ret) => {
                this.doError();
            });

        },
        transferAction(params) {
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

                    this.menuBoxShow = true;
                    this.contentAllHide();
                    this.onlyContentVisible();
                    if (this.extendClass == 'fullHeight') {
                        this.extendClass = ''
                        this.extendIcon = 'fa-expand';
                    }

                    this.examNo = parseInt(params.data);
                    this.menuTitle = '시험';
                    this.sendExamData = {
                        no: parseInt(params.data.data),
                        uid: this.uid,
                        name: this.userName
                    };
                    this.loadExamShow = true;
                    break;
                case 'insertPoll':
                    if (this.userPollComplete) return;
                    this.sendPollData = {
                        no: parseInt(params.data.data),
                        uid: this.uid,
                        name: this.userName
                    };
                    this.menuBoxShow = true;
                    this.contentAllHide();
                    this.onlyContentVisible();
                    if (this.extendClass == 'fullHeight') {
                        this.extendClass = ''
                        this.extendIcon = 'fa-expand';
                    }
                    this.menuTitle = '설문조사';

                    this.loadPollShow = true;
                    break;
                case 'insertVote':
                    if (this.userVoteComplete) return;


                    this.sendVoteData = {
                        no: parseInt(params.data.data),
                        uid: this.uid,
                        name: this.userName
                    };
                    this.menuBoxShow = true;
                    this.contentAllHide();
                    this.onlyContentVisible();
                    if (this.extendClass == 'fullHeight') {
                        this.extendClass = ''
                        this.extendIcon = 'fa-expand';
                    }
                    this.menuTitle = '투표';
                    this.loadVoteShow = true;
                    break;
                case 'insertQuiz':
                    this.contentAllHide();
                    this.onlyContentVisible();
                    this.menuBoxShow = true;
                    if (this.extendClass == 'fullHeight') {
                        this.extendClass = ''
                        this.extendIcon = 'fa-expand';
                    }
                    this.sendQuizData = {
                        no: parseInt(params.data.data),
                        uid: this.uid,
                        name: this.userName
                    };
                    this.menuTitle = '간단퀴즈';
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
                    this.menuBoxShow = true;
                    this.contentAllHide();
                    this.onlyContentVisible();
                    if (this.extendClass == 'fullHeight') {
                        this.extendClass = ''
                        this.extendIcon = 'fa-expand';
                    }
                    this.menuTitle = '자료공유';
                    this.setFdata(params.data.data);
                    break;

            }
        },
        setFdata(no) {
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
                    this.contenWindowCompress();
                    this.loadExamShow = false;
                    this.onlyContentShow = false;
                    this.contentShow = false;
                    this.menuTitle = '';
                    this.ExmAnswer = (this.meetingInfo.examImmAnswer) ? this.meetingInfo.examImmAnswer : 'yes';
                    this.ExmDown = (this.meetingInfo.examDown) ? this.meetingInfo.examDown : 'no';
                    if (this.ExmAnswer == 'yes' || this.ExmDown == 'yes') {
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

                    this.onlyContentShow = false;
                    this.contentShow = false;
                    this.contentAllHide()
                    this.menuLayoutShow = true;
                    this.contenWindowCompress();
                    this.menuTitle = '';

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
                    this.menuLayoutShow = true;
                    this.contentShow = false;
                    this.contentAllHide()
                    this.onlyContentShow = false;
                    this.contenWindowCompress();
                    this.menuTitle = '';

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
                    this.quizShow = false;
                    this.menuLayoutShow = true;
                    this.contentShow = false;
                    this.contentAllHide()
                    this.onlyContentShow = false;
                    this.contenWindowCompress();
                    this.menuTitle = '';

                    break;

            }
        },

        onkeypress(event) {
            this.menuBoxShow = false;
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
        if (location.hostname != 'localhost') {
            JQ(window).on("beforeunload", function (eventObject) {
                if (obj.chatRoomNo) {
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
        }


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

    .header {
        width: 100%;
        padding: 0;
        maing: 0;
        border-bottom: solid 1px #C2C2C2;
        height: 50px;
        z-index: 100000;
        background: #fff;
        text-align: center;
        color: #000;
        font-weight: bold;
        line-height: 50px;
        font-size: 16px;
    }

    .youtube-layout {
        height: 250px;
        width: 100%;
        overflow: hidden;
        z-index: 100;

        .youtube-box {
            width: 100%;

            .youtube-iframe {
                width: 100%;
                height: 250px;
                background: #000;

                #player {
                    background: #000;
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
        background: rgba(0, 0, 0, 0.5);

        .name-box {
            width: 80%;
            height: 350px;
            -webkit-box-shadow: 1px 1px 9px -1px rgba(71, 70, 71, 0.53);
            -moz-box-shadow: 1px 1px 9px -1px rgba(71, 70, 71, 0.53);
            box-shadow: 1px 1px 9px -1px rgba(71, 70, 71, 0.53);
            border-radius: 10px;
            position: absolute;
            left: 50%;
            top: 50%;
            background: #ffffff;
            margin: -160px 0 0 -40%;
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

.chating-box {
    width: 100%;
    height: 100%;
    position: relative;

    .chat-blind {
        position: absolute;
        top: 0;
        width: 100%;
        min-height: 1000px;
        left: 0;
        z-index: 1000;
        background: #fff;
    }

    .chat-header {
        background: #333333;
        color: #fff;
        padding: 13px 0 13px 20px;
    }

    .chat-container {
        overflow-y: auto;
        width: 100%;
        background: #fff;

        .chatmsg-list {
            padding: 10px 20px 50px 20px;

            li {
                font-weight: bold;
                font-size: 11pt;
                color: #000;
                display: flex;

                &.me {
                    color: #1E90FF;
                }

                padding: 7px 0;

                .message {
                    text-align: left;
                }

                .user {
                    display: inline-block;
                    min-width: 80px;

                }

            }
        }
    }

    .chat-message-box {
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        background: #fff;
        z-index: 1000;
        min-height: 50px;
        border-top: solid 1px #E4E4E4;

        .chat-message-sender {
            height: 50px;
            display: flex;

            .chat-menu-box {
                width: 42px;
                padding: 12px 0 0 10px;

                img {
                    width: 30px;
                }
            }

            .chat-button-box {
                width: 33px;
                padding: 15px 8px 0 0;

                img {
                    width: 25px;
                }
            }

            .field-box {
                padding: 5px 10px;
                width: 100%;
                margin: 0;
                background: #fff;

                .field {
                    border: none;
                    width: 100%;
                    padding: 0;
                    margin: 3px 0 0 0;
                    height: 35px;

                    &:focus {
                        outline: none;
                    }
                }
            }
        }

        .menu {

            position: relative;
            height: 340px;
            width: 100%;
            z-index: 100000;
            background: #F4F4F4;
            border-top: solid 1px #E4E4E4;

            .menu-header {
                width: 100%;
                height: 50px;
                background: #fff;
                border-bottom: solid 1px #E4E4E4;
                font-size: 14pt;

                .left {
                    position: absolute;
                    top: 12px;
                    left: 15px;
                }

                .menu-title {
                    text-align: center;
                    width: 220px;
                    margin: auto;
                    height: auto;
                    font-size: 16px;
                    padding-top: 12px;
                    overflow: hidden;
                }

                .right {
                    .del-box {
                        position: absolute;
                        right: 15px;
                        top: 12px;
                    }

                    .extend-box {
                        position: absolute;
                        right: 40px;
                        top: 12px;
                    }
                }
            }

            #barHideLayout {
                height: 290px;
                width: 100%;
                overflow-y: auto;

            }

            &.fullHeight {
                height: calc(100vh);

                #barHideLayout {
                    height: 96%;
                }
            }

            .attend-list-user {
                position: absolute;
                width: 100%;
                top: 50px;
                left: 0;
                background: #fff;
                min-height: 100%;
                overflow-y: auto;
                z-index: 10000000;

                .attend-list {
                    padding: 20px 0 70px 0;

                    li {
                        font-size: 10pt;
                        padding: 0 0 20px 20px;
                        position: relative;

                        .name {
                            display: inline-block;
                            width: 110px;
                            color: #333;
                        }

                        .email {
                            display: inline-block;
                            width: 110px;
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

            .menu-box {
                padding-top: 20px;
                width: 100%;
                display: flex;
                flex-wrap: wrap;

                li {
                    width: 25%;
                    margin-bottom: 20px;
                    text-align: center;
                    position: relative;

                    .icon {
                        width: 60px;
                        height: 60px;
                        margin: auto;
                        border-radius: 30px;
                        background: #2196F3;
                        line-height: 60px;
                        text-align: center;

                        img {
                            margin-top: 15px;
                        }

                    }

                    .sub-icon {
                        width: 60px;
                        height: 60px;
                        margin: auto;
                        border-radius: 30px;
                        background: #2196F3;
                        line-height: 60px;
                        text-align: center;

                        img {
                            margin-top: 15px;
                            width: 20px;
                        }

                        &.webi {
                            img {
                                width: 30px;
                            }
                        }
                    }

                    .title-over {
                        padding: 7px 0 0 0;
                        text-align: center;
                        color: #000;
                        font-size: 10pt;
                    }

                    .is-dot {
                        display: inline-block;
                        position: absolute;
                        width: 14px;
                        height: 14px;
                        background: #ff0000;
                        border-radius: 7px;
                        right: 22px;
                        top: 5px;
                    }
                }

                text-align: center;
            }
        }

    }
}

.end-button-box {
    width: 100%;
    position: absolute;
    bottom: 0;
    background: #fff;
    height: 50px;
    border-top: solid 1px #ccc;
    display: flex;

    .btn {
        width: 50%;
        text-align: center;
        line-height: 50px;
        font-weight: bold;

        &:first-child {
            border-right: solid 1px #ccc;
        }
    }
}

.screenLayout {
    position: fixed;
    top: 0;
    left: 0;
    width: calc(100vw);
    height: 100%;
    z-index: 100001;
    background: rgba(0, 0, 0, 0.3);

    .inner-box {
        width: 240px;
        height: 240px;
        -webkit-box-shadow: 1px 1px 9px -1px rgba(71, 70, 71, 0.53);
        -moz-box-shadow: 1px 1px 9px -1px rgba(71, 70, 71, 0.53);
        box-shadow: 1px 1px 9px -1px rgba(71, 70, 71, 0.53);
        border-radius: 10px;
        position: absolute;
        left: 50%;
        top: 50%;
        background: #ffffff;
        margin: -120px 0 0 -140px;
        padding: 0 20px;

        &.webina-box {
            height: 420px;
            margin: -210px 0 0 -140px;

        }

        &.rtq-box {
            width: 300px;
            height: 510px;
            margin: -280px 0 0 -170px;
            padding-top: 60px;

            textarea {
                height: 300px;
            }
        }

        .screen-header {
            height: 40px;

            .del-box {
                cursor: pointer;
                position: absolute;
                right: 15px;
                top: 15px;
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

            .title {
                text-align: center;
                font-size: 13pt;
                font-weight: bold;
                color: #000;
                padding-top: 15px;

            }
        }

        .sub-box {
            margin: 30px 0 0 0;

            li {
                text-align: center;
                font-weight: bold;
                color: #000;
                border: solid 1px #dcdcdc;
                border-radius: 5px;
                height: 50px;
                line-height: 50px;
                margin-bottom: 10px;
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

    &.black {
        background: rgba(0, 0, 0, 0.4);
    }
}
</style>
