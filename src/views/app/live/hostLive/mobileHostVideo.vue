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
                        <response :params="userReponseParams" v-if="userReponseShow"
                                  @hideEvent="screenBoxHIde"></response>
                        <examView :gno="no" v-if="loadExamShow" @hideEvent="screenBoxHIde"></examView>
                        <examMake :gno="no" v-if="loadImmExamShow" @hideEvent="screenBoxHIde"></examMake>

                        <pollView :gno="no" v-if="loadPollShow" @hideEvent="screenBoxHIde"></pollView>
                        <quizMake :gno="no" v-if="loadQuizShow" @hideEvent="screenBoxHIde"></quizMake>
                        <voteView :gno="no" v-if="loadVoteShow" @hideEvent="screenBoxHIde"></voteView>

                        <hostDataView :gno="no" v-if="loadDataShow" @hideEvent="screenBoxHIde"></hostDataView>
                        <liveFileView :no="fileNo" v-if="loadFileShow" @hideEvent="screenBoxHIde"></liveFileView>

                        <div v-if="zoomBoardUpdateShow || zoomBoardListShow || zoomBoardViewShow">
                            <boardRegist :gno="no" :no="updArticleNo" :compontentType="'live'"
                                         v-if="zoomBoardUpdateShow"
                                         @hideEvent="zoomBoardBoxHIde"></boardRegist>
                            <boardList :gno="no" :compontentType="'live'" v-if="zoomBoardListShow"
                                       @articleView="showArticleView"
                                       @hideEvent="zoomBoardBoxHIde"></boardList>
                            <boardView :gno="no" :no="articleNo" :compontentType="'live'" v-if="zoomBoardViewShow"
                                       @articleUpdate="updateArticle" @hideEvent="zoomBoardBoxHIde"></boardView>
                        </div>
                        <div class="attend-list-user" v-if="loadUser">
                            <ul class="attend-list waitUser" v-if="waitUserList.length>0">
                                <li class="wtitle">대기자 목록</li>
                                <li v-for="(user,idx) in waitUserList">
                                    <span class="name">{{ user.name }}</span>
                                    <span class="email" v-if="user.email">{{ user.email }}</span>
                                    <span class="out">
                                    <button @click="userPermit(idx,'yes')">승인</button>
                                    <button @click="userPermit(idx,'no')">거부</button>
                                </span>
                                </li>
                            </ul>
                            <ul class="attend-list">
                                <li v-for="(user,idx) in userList">
                                    <span class="name">{{ user.name }}</span>
                                    <span class="email" v-if="user.email">{{ user.email }}</span>
                                    <span class="out">
                                    <button @click="userOut(idx)">퇴장</button>
                                </span>
                                </li>
                            </ul>
                        </div>
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
                            <li @click="showOpenDialog('exam')">
                                <div class="icon"><img src="../../../../assets/mobileimg/live03menu/exam.svg"
                                                       style="width:28px;"><span
                                    class="is-dot" v-if="IsProblem"></span></div>
                                <div class="title-over">시험</div>
                            </li>
                            <li @click="loadQuiz()">
                                <div class="icon"><img src="../../../../assets/mobileimg/live03menu/quiz.png"
                                                       style="width:30px;"></div>
                                <div class="title-over">간단퀴즈</div>
                            </li>

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
                            <li @click="showOpenDialog('board')">
                                <div class="icon"><img src="../../../../assets/mobileimg/live03menu/ico_m_menu4.svg"
                                                       style="width:20px;"><span
                                    class="is-dot" v-if="IsZoomBoard"></span></div>

                                <div class="title-over">{{ zoomBoardName }}</div>

                            </li>
                            <li @click="openUsers()">
                                <div class="icon"><i class="far fa-user" style="color:#fff;font-size:15pt;"></i><span
                                    class="is-dot" v-if="IsWaitUser"></span></div>
                                <div class="title-over">참가자 관리</div>
                            </li>
                        </ul>
                        <div class="end-button-box" v-if="!contentShow">
                            <div class="btn" @click="endMeeting()">
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
                    <div class="gtitle">{{ subject }}> 라이브 완료</div>
                    <div class="del-box" @click="completeLive()"><i class="fas fa-times"></i></div>
                </div>
                <div class="contents">
                    <div class="img-box">
                        <h3>방송이 종료되었습니다.</h3>
                        <div class="tip">수고하셨습니다. 사용해 주셔서 감사합니다.</div>
                    </div>
                    <div class="text-box">
                        <div class="subject">{{ subject }}</div>
                        <div class="author">{{ userName }}</div>
                        <ul class="result-ul">
                            <li>
                                <div class="li-title">참가자 수</div>
                                <div class="li-value">{{ joinCnt }}</div>
                            </li>
                            <li>
                                <div class="li-title">최대 시청자 수</div>
                                <div class="li-value">{{ watchCnt }}</div>
                            </li>
                            <li>
                                <div class="li-title">라이브 시간</div>
                                <div class="li-value">{{ liveTime }}</div>
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
    name: 'mobileHostVideo',
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
    watch: {
        contentShow(val) {

        }
    },
    data() {
        return {

            host: HOST,
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
            fileNo: '',
            loadFileShow: false,
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
        AUTH.setDevice(this.$isMobile());
        this.no = this.$route.params.no;
        let memberInfo = AUTH.getSession(this.$isMobile());
        if (memberInfo.AUTHTOKEN) {
            if (this.no < 1) {
                this.doError();
                return;
            }
            jsonRpcService.checkDebug();
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
        openUsers() {

            this.menuTitle = '참가자 관리';
            this.contentVisible();
            this.loadUser = true;
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
                case 'exam':
                    this.menuTitle = '시험';
                    item = {
                        code: 'examList',
                        name: '시험 불러오기',
                        icon: require('../../../../assets/svg/submenu/exam.png'),
                        gclass: ''
                    };
                    this.subMenuList.push(item);
                    item = {
                        code: 'examWrite',
                        name: '즉시 만들기',
                        icon: require('../../../../assets/svg/submenu/examwrite.png'),
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
            this.updArticleNo = 'new';
            this.zoomBoardUpdateShow = true;
        },
        loadZoomBoard() {
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
                    if (cmd == 'close') this.doError()
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

            this.contentShow = true;
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

            this.menuTitle = '간단퀴즈';
            this.contentVisible();
            this.loadQuizShow = true;
        },
        loadDataList() {
            this.menuTitle = '자료공유';
            this.contentVisible();
            this.loadDataShow = true;
        },
        loadImmExam() {
            this.contentShow = true;
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

            this.menuTitle = '설문조사';
            this.contentVisible();
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

            this.menuTitle = '투표';
            this.contentVisible();
            this.loadVoteShow = true;
        },
        screenBoxHIde(event) {
            switch (event.page) {
                case 'exam':
                    switch (event.action) {
                        case 'sendProblem':
                            this.sendRpcData(event.no, 'insertProblem');
                            break;
                        default:
                            this.backMenu();
                            break;
                    }
                    this.loadExamShow = false;
                    break;
                case 'immExam':
                    switch (event.action) {
                        case 'sendProblem':

                            this.sendRpcData(event.no, 'insertProblem');
                            break;
                        default:
                            this.backMenu();
                            break;
                    }
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
                        default:
                            this.backMenu();
                            break
                    }
                    this.loadPollShow = false;
                    break;
                case 'vote':
                    switch (event.action) {
                        case 'sendVote':
                            this.sendRpcData(event.no, 'insertVote');
                            break;
                        default:
                            this.backMenu();
                            break
                    }
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
                    } else if (event.action == 'setSubject') {
                        this.menuTitle = event.title;
                        this.onlyContentVisible();
                        this.barHideFlag = false;

                    } else {
                        this.backMenu();
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
                        jsonRpcService.post(rpcParams, () => {

                        });
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
                    this.userReponseShow = false;
                    this.showMenu();

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
                if(this.waitUserList.length>0)this.IsWaitUser = true;

                this.menuBoxStat = 'contentShow';
                if(!this.menuBoxShow) {
                    this.menuBoxShow = true;
                    this.menuBoxStat = 'menuHide';
                }
                if(!this.contentShow) {
                    this.contentVisible();
                    if(this.menuBoxStat=='contentShow')this.menuBoxStat = 'menuOpen';
                }
                this.backMenuTitle = this.menuTitle;

                this.menuTitle = '참가자 관리';
                this.barHideFlag = true;
                this.rpcSendMenu = true;
                this.loadUser = true;

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
           // if (location.hostname == 'localhost') return;
            if (this.goAfterFlag) {

                //window.opener.document.location.href = '/live/' + this.no + '/afterExam';
            } else {
                //window.opener.document.location.reload();
            }

            JQ(window).off("beforeunload");
            location.href = '/live/' + this.no + '/afterExam';
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
            setTimeout(() => {
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
            }, 1000);

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
                color: #fff;
            }
        }
    }
}

.blackScreenLayout {
    position: fixed;
    top: 0;
    left: 0;
    width: calc(100vw);
    height: 100%;
    z-index: 100001;
    background: rgba(0, 0, 0, 0.3);
    .complete-content {
        width: calc(100vw - 40px);
        height: calc(100vh - 80px);
        -webkit-box-shadow: 1px 1px 9px -1px rgba(71, 70, 71, 0.53);
        -moz-box-shadow: 1px 1px 9px -1px rgba(71, 70, 71, 0.53);
        box-shadow: 1px 1px 9px -1px rgba(71, 70, 71, 0.53);
        border-radius: 10px;
        position: absolute;
        left: 20px;
        top: 40px;
        background: #ffffff;
        .title-box {
            height: 60px;
            line-height: 60px;
            border-bottom: solid 1px #dcdcdc;
            position: relative;
            .gtitle {
                font-size: 12pt;
                font-weight: bold;
                color: #000;
                padding-left:10px;
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
            height:440px;
            overflow-y: auto;
            .img-box {
                width: 100%;
                height: 140px;
                background: #007aff;
                text-align: center;
                h3 {
                    margin: 0;
                    padding: 40px 0 10px 0;
                    font-size: 20pt;
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
                    font-size: 12pt;
                    padding: 15px 0 5px 30px;
                }
                .author {
                    color: #777;
                    font-size: 10pt;
                    padding: 0 0 0 30px;

                }
                .result-ul {
                    margin:10px auto 0 auto;
                    width:90%;
                    li {
                        border-radius: 5px;
                        -webkit-box-shadow: 1px 1px 9px -1px rgba(71, 70, 71, 0.53);
                        -moz-box-shadow: 1px 1px 9px -1px rgba(71, 70, 71, 0.53);
                        box-shadow: 1px 1px 9px -1px rgba(71, 70, 71, 0.53);
                        background: #fff;
                        padding:10px;
                        display:flex;
                        margin-top:10px;
                        .li-title {
                            width:50%;
                            color: #777;
                            font-size: 12pt;
                            text-align:left;
                            padding-left:20px;
                        }
                        .li-value {
                            width: 50%;
                            font-weight: bold;
                            color: #2196F3;
                            font-size: 14pt;
                            text-align:right;
                            padding-right:20px;
                        }
                    }
                }
            }
        }
        .button-row {
            text-align: center;
            padding:10px 15px;
            display:flex;
            button {
                min-width: 100px;
                border-radius: 25px;
                height:40px;
                padding-left: 10px;
                padding-right: 10px;
                &:first-child {
                    margin-right: 10px;
                }
            }
        }
    }
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
.end-button-box {
    width: 100%;
    position: absolute;
    bottom: 0;
    background: #fff;
    height: 50px;
    border-top: solid 1px #ccc;
    .btn {
        width: 100%;
        text-align: center;
        line-height: 50px;
        font-weight: bold;
    }
}

</style>