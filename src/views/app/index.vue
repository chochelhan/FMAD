<template>
    <div>
        <upassDialog></upassDialog>
        <defaultLayout v-if="defaultLayoutShow"></defaultLayout>
        <mypageLayout v-else-if="mypageLayoutShow"></mypageLayout>
        <liveLayout v-else-if="liveLayoutShow"></liveLayout>
        <topLayout v-else-if="topLayoutShow"></topLayout>
        <blankLayout v-else-if="blankLayoutShow"></blankLayout>
        <mobileLayout v-else-if="mobileLayoutShow"></mobileLayout>
        <v-dialog
            v-model="loginShow"
            width="450"
            :persistent="modalPersistent"
        >
            <modalLogin v-if="modalPageShow.login" @loginBoxMove="loginBoxMove"></modalLogin>
            <modalJoin v-else-if="modalPageShow.join" @loginBoxMove="loginBoxMove"></modalJoin>
            <modalFindId v-else-if="modalPageShow.findId" :findType="findCmd"
                         @loginBoxMove="loginBoxMove"></modalFindId>
        </v-dialog>

    </div>
</template>

<script>
import SITECONFIG from '../../api/siteConfig';
import {mapActions, mapGetters} from "vuex";
import upassDialog from '../../components/board/upassDialog'
import AUTH from '../../api/auth';
import defaultLayout from './layout/defaultLayout';
import mypageLayout from './layout/mypageLayout';
import liveLayout from './layout/liveLayout';
import topLayout from './layout/topLayout';
import blankLayout from './layout/blankLayout';
import mobileLayout from './layout/mobileLayout';

import modalJoin from './member/modalJoin';
import modalLogin from './member/modalLogin';
import modalFindId from './member/modalFindId';

import apiService from '../../api/apiService';
import {
    API_URL_GET_SITECONFIG
} from '../../api/urls'

export default {
    components: {
        upassDialog,
        defaultLayout,
        mypageLayout,
        liveLayout,
        topLayout,
        blankLayout,
        mobileLayout,
        modalFindId,
        modalJoin,
        modalLogin
    },
    computed: {
        ...mapGetters('member', ["getUid", "getMtype", "getLoginBoxOpen"])
    },
    watch: {
        '$route'(to, from) {
            let path = to.path.split('/');
            switch (path[1]) {
                case 'live':
                    this.setLayout('live')
                    break;
                case 'videoView':
                    this.setLayout('videoView')
                    break;
                case 'agree':
                    this.setLayout('agree')
                    break;
                case 'userLiveIntro':
                    this.setLayout('topLayout')
                    break;

                default:
                    if (path[2]) {
                        switch (path[2]) {
                            case 'mypage':
                                this.setLayout('mypage')
                                break;
                            default:
                                this.setLayout('default')
                                break;
                        }
                    } else {
                        this.setLayout('default')
                    }
                    break;
            }

        },
        getUid(val) {
            if (val) {
                this.setMemberInfo();
            }
        },
        getMtype(val) {
            if (val) {
                this.setMemberInfo();
            }

        },
        getLoginBoxOpen(val) {
            if (val) {
                if(this.$isMobile()) {
                    this.$router.push('/main/login')

                } else {
                    this.loginShow = val;
                    this.modalPageShow = {
                        login: true,
                        join: false,
                        findId: false,
                    }
                }
                this.setLoginBoxOpen(false);
            }
        },
        loginShow(val) {
            if (!val) {
                if(this.$isMobile()) {


                } else {
                    this.modalPageShow = {
                        login: false,
                        join: false,
                        findId: false,
                    }
                }
            }
        }
    },
    data() {
        return {
            defaultLayoutShow: true,
            mypageLayoutShow: false,
            liveLayoutShow: false,
            topLayoutShow: false,
            blankLayoutShow: false,
            mobileLayoutShow: false,
            userId: '',
            isLogin: false,
            mtype: '',
            msgList: [],
            DEBUG: true,
            loginShow: false,
            modalPageShow: {
                login: false,
                join: false,
                findId: false,
            },
            modalPersistent: false,
            findCmd: '',
        };
    },
    created() {
        AUTH.setDevice(this.$isMobile());
        let path = this.$route.path.split('/');
        switch (path[1]) {
            case 'live':
                this.setLayout('live')
                break;
            case 'userLiveIntro':
                this.setLayout('topLayout')
                break;
            case 'videoView':
                this.setLayout('videoView')
                break;
            case 'agree':
                this.setLayout('agree')
                break;
            default:
                if (path[2]) {
                    switch (path[2]) {
                        case 'mypage':
                            this.setLayout('mypage')
                            break;
                        default:
                            this.setLayout('default')
                            break;
                    }
                } else {
                    this.setLayout('default')
                }
                break;
        }
        this.getData();
        this.setMemberInfo();
        this.$eventBus.$on('googleLoginComplete', this.googleResult);
        this.$eventBus.$on('snsGo', this.shareSns);
    },
    methods: {
        ...mapActions('member', ["setLoginBoxOpen", "setMember"]),
        googleResult(res) {
            let ret = res.result;
            let msg = '등록된 유튜브 동영상이 존재하지 않습니다'
            if (ret == 'succ' || ret == 'join') {
                msg = '유튜버로 인증되었습니다'
            } else if (ret == 'noUser') {
                msg = '이미 인증받은 구글 아이디가 있습니다<br>동영상을 불러올수 없습니다';
            }
            if (ret == 'join') {
                this.$eventBus.$emit('googleJoinComplete');
            }
            let params = {
                message: msg,
            };
            this.$eventBus.$emit('modalOpen', params);
        },
        loginBoxMove(cmd) {
            if(this.$isMobile()) {

            } else {
                switch (cmd) {
                    case 'hide':
                        this.modalPersistent = false;
                        this.loginShow = false;
                        this.modalPageShow = {
                            login: false,
                            join: false,
                            findId: false,
                        }
                        break;
                    case 'join':
                        this.modalPersistent = true;
                        this.modalPageShow = {
                            login: false,
                            join: true,
                            findId: false,
                        }

                        break;
                    case 'findId':
                        this.findCmd = 'id'
                        this.modalPageShow = {
                            login: false,
                            join: false,
                            findId: true,
                        }
                        break;
                    case 'findPw':
                        this.findCmd = 'pw'
                        this.modalPageShow = {
                            login: false,
                            join: false,
                            findId: true,
                        }

                        break;
                }
            }

        },
        setLayout(cmd) {
            this.defaultLayoutShow = false;
            this.mypageLayoutShow = false;
            this.liveLayoutShow = false;
            this.topLayoutShow = false;
            this.blankLayoutShow = false;
            this.mobileLayout = false;
            if (!this.$isMobile()) {
                switch (cmd) {
                    case 'mypage':
                        this.mypageLayoutShow = true;
                        break;
                    case 'live':
                        this.liveLayoutShow = true;
                        break;
                    case 'topLayout':
                        this.topLayoutShow = true;
                        break;
                    case 'videoView':
                        this.blankLayoutShow = true;
                        break;
                    case 'agree':
                        this.blankLayoutShow = true;
                        break;
                    default:
                        this.defaultLayoutShow = true;
                        break;
                }
            } else {
                this.mobileLayoutShow = true;

            }

        },
        getData() {
            const frm = new FormData()
            apiService.post(API_URL_GET_SITECONFIG, frm, (res) => {
                SITECONFIG.setMemberConfig(res.config);
            });
        },
        setMemberInfo() {
            let memberInfo = AUTH.getSession(this.$isMobile());
            if (memberInfo.AUTHTOKEN) {
                if (memberInfo.mtype == 'temp') {
                    this.loginShow = true;
                    sessionStorage.setItem('linktreeUid', memberInfo.uid)
                    this.loginBoxMove('join')

                } else {
                    this.$eventBus.$on('chatSend', this.chatSend);
                    this.isLogin = true;
                    this.userId = memberInfo.uid;
                    this.mtype = memberInfo.mtype;
                }


            }
        },

        getFormatDate(date) {
            let year = date.getFullYear();
            let month = (1 + date.getMonth());
            month = month >= 10 ? month : '0' + month;
            let day = date.getDate();
            day = day >= 10 ? day : '0' + day;
            let hour = date.getHours();
            hour = (hour >= 10) ? hour : '0' + hour;
            let min = date.getMinutes();
            min = (min >= 10) ? min : '0' + min;
            return year + '-' + month + '-' + day + ' ' + hour + ':' + min;
        },
        shareSns(snsParams) {
            let sns_share_url = snsParams.currentUrl;
            let protocol = document.location.protocol;
            let hostName = document.location.hostname;

            let url = encodeURIComponent('https://duckku.com/' + sns_share_url);
            let title = encodeURIComponent(snsParams.title);
            let img = (snsParams.img) ? 'https://duckku.com/' + snsParams.img : '';
            switch (snsParams.stype) {
                case 'fb':
                    window.open('https://www.facebook.com/sharer/sharer.php?u=' + url);
                    break;
                case 'ko':
                    shareLink(protocol + '//' + hostName + '/' + sns_share_url, snsParams.title, img);
                    break;
                case 'nb':
                    window.open('https://band.us/plugin/share?body=' + title + encodeURIComponent("\n") + url + '&route=' + url, 'bandsharedialog', 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes');
                    break;
                case 'ln':
                    window.open('https://social-plugins.line.me/lineit/share?url=' + url);
                    break;
            }
        },
    },
    beforeDestroy() {
        this.$eventBus.$off('googleLoginComplete');
        this.$eventBus.$off('snsGo');

    }

}
</script>
<style lang="scss" scoped="true">

</style>
<style lang="scss">
@font-face {
    font-family: NanumGothic;
    src: url(../../assets/fonts/NanumGothic/NanumGothic-Regular.ttf) format("embededed-opentype");
    font-style: normal;
}

html, body {
    background: #14192C;
}

div, td, th, span, h1, h2, h3, h4, a, li {
    font-family: NanumGothic, sans-serif;
}

ul {
    list-style: none;
    padding: 0;
    margin: 0;

    li {
        padding: 0;
        margin: 0;
        font-family: NanumGothic, sans-serif;
    }
}

.page-container {
    width: 100%;
    min-height: calc(100vh);
}

ul {
    list-style: none;
    padding: 0;
    margin: 0;
}

#jsonRpcFrame {
    width: 0;
    height: 0;
    display: none;
}

.main {
    width: 100%;
    background: #fff;

    .main-img {

    }

    .contents {
        width: 1100px;
        margin: auto;

        .title {
            margin: 30px 0 10px 0;
            border-bottom: solid 2px #999;
            position: relative;
            height: 40px;

            .title-line-box {
                position: absolute;
                bottom: -2px;
                font-size: 16pt;
                color: #333;
                font-weight: bold;
                padding: 0 20px 5px 20px;
                border-bottom: solid 2px #4188FC;
            }
        }

        .description-box {
            font-size: 12pt;
            height: auto;
            width: 100%;
        }

        .sub-title {
            color: #000;
            font-size: 14pt;
        }

    }
}


</style>
<style lang="scss" scoped="true">
.header {
    width: 100%;
    padding-top: 40px;
    height: 120px;

    .menu {
        width: 1100px;
        margin: auto;
        display: flex;

        li {
            cursor: pointer;
            width: auto;
            margin: 0 20px;
        }
    }
}

.footer {
    height: 150px;
    width: 100%;
    background: #fafafa;
    margin: 100px 0 0 0;
    clear: both;
}
</style>
