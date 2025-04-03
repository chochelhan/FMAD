<template>
    <div :class="'data-page-container '+mobileClass">
        <div id="screenLayout" :class="'myPaymentFrameLayout '+mobileClass"  v-if="paymentFrameShow">
            <div id="bannerPaymentFrameBox">
                <iframe id="bannerPaymentFrame" :src="paymentFrameSrc" style="width:100%;height:495px;" frameborder="0"
                        scrolling="0"></iframe>
            </div>
        </div>

        <div class="userBg isTargetUid">
            <div class="memberInfo-box">
                <div class="img-box">
                    <img v-if="photo" :src="host+photo">
                    <i v-if="!photo" class="fas fa-user"></i>
                </div>
                <div class="info-box">
                    <div class="name">
                        {{ name }}
                    </div>
                    <div class="url">duckku.com/{{ ownerInfo.uid }}</div>
                    <div class="desc" v-if="mtype=='shop'">구독자 {{ readNum }}</div>
                </div>
            </div>
            <div class="button-box">
                <v-btn :class="'mbtn '+favoriteClass" @click="setFavorite()">
                    <i class="fas fa-heart"></i>
                    {{ readNum }}
                </v-btn>

            </div>

        </div>
        <!-- div style="color:#fff" @click="testGo()">나의페이지</div -->

        <div class="metabusBg" v-if="ownerInfo.mtype == 'shop'">

        </div>
        <div class="isTargetUid">
            <ul class="tab-menus" id="move-target" v-if="!mobileView">
                <li :class="'tab-item '+menu.gclass" v-for="(menu,index) in menuList">
                    <span @click="goPage(menu.code)">{{ menu.name }}</span>

                </li>
            </ul>
            <div class="swiper-tab-menus" id="smove-target" v-else>
                <swiper :options="swiperOption" class="swiper-box-layout">
                    <swiper-slide v-for="(menu,index) in menuList" class="swiper-box">
                        <div :class="'tab-item '+menu.gclass">
                            <span @click="goPage(menu.code)">{{ menu.name }}</span>
                        </div>
                    </swiper-slide>
                </swiper>
            </div>

            <div class="main-container">
                <router-view/>

            </div>
        </div>
        <v-dialog
            v-if="!mobileView"
            v-model="modalShow"
            width="680"
            style="z-index:100;"
        >
            <bannerRegist v-if="bannerRegistShow" :ownerUid="uid"
                          @bannerModalHide="bannerModalHide" @bannerPaymentHide="setBannerPaymentFrame"></bannerRegist>
        </v-dialog>
        <form id="sfrm" style="display:none" method="post">
            <input type="hidden" name="jwtToken" id="jwtToken"/>
        </form>


    </div>
</template>

<script>

import {mapActions, mapGetters} from "vuex";
import {
    HOST,
    API_URL_MESSAGE_USER_UPDATE,
    API_URL_BROADCAST_GET_BROADCASTINFO, API_URL_MEMBER_GET_SHOP_TOKEN
} from '../../../api/urls';
import apiService from '../../../api/apiService';
import AUTH from '../../../api/auth'
import bannerRegist from './banner/bannerRegist'
import JQ from 'jquery'

export default {
    name: 'BJ',
    components: {
        bannerRegist,
    },
    data() {
        return {
            debug: true,
            paymentFrameShow: false,
            paymentFrameSrc: '',
            host: HOST,
            uid: '',
            myUid: '',
            myName: '',
            photo: '',
            checkWorld: true,
            menuList: [],
            readNum: '',
            topRank: '',
            partRank: '',
            ownerInfo: {},
            menuCode: '',
            isLogin: false,
            chatMember: false,
            isAdmin: false,
            favoriteClass: '',
            mtype: '',
            modalShow: false,
            bannerRegistShow: false,
            nouserapikey: '',
            gHome: false,
            gcode: '',
            webGlModalShow: false,
            webGlViewShow: false,
            bannerCode: '',
            name: '',
            unityObject: '',
            unityMethod: '',
            AUTHTOKEN: '',
            APIKEY: '',
            webglUrl: '',
            webglStyle: {},
            mobileView: false,
            mobileClass: '',
            swiperOption: {
                slidesPerView: 'auto',
                loop: false,

            },
            mobileModalShow: false,


        };
    },
    computed: {
        ...mapGetters('member', ["getMtype"]),
        ...mapGetters('etc', ["getChatMove"])
    },
    watch: {
        '$route'(to, from) {
            let path = to.path.split('/');
            let nowCode = path[3];
            for (let item of this.menuList) {
                if (item.code == nowCode) {
                    item.gclass = 'active'
                } else item.gclass = ''
            }
            if (this.uid != this.$route.params.uid) {
                this.checkWorld = false;
                setTimeout(() => {
                    this.checkWorld = true;
                }, 100)
            }
            this.uid = this.$route.params.uid;
            if (this.uid == 'world') {
                JQ('.isTargetUid').hide();

            } else {
                JQ('.isTargetUid').show();
            }


            this.setUid(this.uid)
            this.getInfo();

        },
        getMtype(val) {
            if (val) {
                location.reload();
                //this.setMemberInfo();
            }
        },
        getChatMove(val) {
            if (val) {
                this.$router.push('/' + this.uid + '/main/home')
                this.setChatMove(false);
            }
        },
        modalShow(val) {
            if (!val) {
                this.bannerRegistShow = false;
            }
        },
        webGlModalShow(val) {
            if (!val) {
                this.webGlViewShow = false;
            }
        }

    },
    created() {
        //if (location.host == 'localhost:8080') {
        //this.debug = true;
        //}


        if (this.$isMobile()) {
            this.mobileView = true;
            this.mobileClass = 'mobile'
            this.setClass('subBj')
            let backUrl = sessionStorage.getItem('bjBackUrl')
            if(!backUrl) {
                backUrl = '/';

            }
            this.setBjBack(backUrl)
            sessionStorage.setItem('bjBackUrl','')
            this.setBackUrl('');
        }
        this.uid = this.$route.params.uid;
        this.setUid(this.uid)
        this.setMemberInfo();


    },
    methods: {
        ...mapActions('etc', ["setUid", "setBroadcastInfo", "setChatMove", "setPcmainLeftBanner", "setPcmainOwnerUid"]),
        ...mapActions('member', ["setLoginBoxOpen"]),
        ...mapActions('mobile', ["setClass", "setTitle", "setBackUrl","setBjBack"]),
        setMemberInfo() {
            let memberInfo = AUTH.getSession(this.$isMobile());
            if (memberInfo.AUTHTOKEN) {
                this.AUTHTOKEN = memberInfo.AUTHTOKEN
                this.APIKEY = memberInfo.APIKEY
                this.isLogin = true;
                this.myUid = memberInfo.uid;
                this.myName = memberInfo.name;
                this.isAdmin = (memberInfo.uid == this.uid) ? true : false;
                if (!this.isAdmin) {
                    this.isAdmin = (memberInfo.uid == 'admin') ? true : false;
                }
            } else {
                let params = {
                    message: '먼저 로그인 하세요',
                    doAction: () => {
                        this.$router.push('/');
                    }
                };
                this.$eventBus.$emit('modalOpen', params);
                return;
            }
            this.getInfo();

        },
        testGo() {
            let targetUid = 'inf06'
            this.$router.push('/' + targetUid);


        },
        getInfo() {
            if (this.uid == 'world') return;
            const frm = new FormData()
            frm.append('uid', this.uid)
            apiService.post(API_URL_BROADCAST_GET_BROADCASTINFO, frm, (res) => {
                if (!this.isLogin) {
                    this.nouserapikey = res.nouserapikey;
                }
                if (!res.ownerInfo) {
                    let params = {
                        message: '잘못된 접근입니다',
                        doAction: () => {
                            this.$router.push('/');
                        }
                    };
                    this.$eventBus.$emit('modalOpen', params);
                    return;
                }
                this.chatMember = res.chatMember;
                this.menuList = [];
                let item = {name: '홈', code: 'home'}
                this.menuList.push(item)
                this.ownerInfo = res.ownerInfo;

                this.readNum = (this.ownerInfo.mypen) ? this.ownerInfo.mypen : 0;
                this.topRank = res.topRank;
                this.partRank = res.partRank;
                if (res.myFollwer) {
                    this.favoriteClass = 'myBj';
                }
                if (res.ownerInfo.mtype == 'shop') {
                    item = {name: '동영상', code: 'video'}
                    this.menuList.push(item)
                }
                if (this.ownerInfo.photo) this.photo = this.ownerInfo.photo;
                item = {name: '사진첩', code: 'userPhoto'}
                this.menuList.push(item)

                item = {name: '게시판', code: 'userBoard'}
                this.menuList.push(item)
                this.mtype = this.ownerInfo.mtype;
                this.setPcmainLeftBanner([]);
                this.setPcmainOwnerUid(res.randFix);

                this.name = res.ownerInfo.unick;

                if (this.$isMobile()) {
                    this.setTitle(this.name);
                    sessionStorage.setItem('bjTitleName',this.name)
                }
                let path = this.$route.path.split('/');
                let nowCode = path[3];
                for (let item of this.menuList) {
                    if (item.code == nowCode) {
                        item.gclass = 'active'
                        if (item.code == 'metaroom' && this.myUid == this.uid) {
                            for (let sub of item.subMenus) {
                                if (path[4] == sub.code) sub.gclass = 'selected';
                                else sub.gclass = ''
                            }
                        }
                    } else item.gclass = ''
                }

            });
        },
        unityLoaded() {
            return;

        },
        goPage(code) {
            //if (code == this.menuCode) return;
            let urlCode = '';
            switch (code) {
                case 'userBoard':
                    urlCode = 'userBoard/list'
                    break;
                case 'shop':
                    const frm = new FormData()
                    apiService.post(API_URL_MEMBER_GET_SHOP_TOKEN, frm, (res) => {
                        window.open('', 'shopWin');
                        if (res.result == 'succ' && res.token) {
                            JQ('#jwtToken').val(res.token);
                        }
                        JQ('#sfrm').attr('target', 'shopWin');
                        if(this.mobileView) {
                            JQ('#sfrm').attr('action', 'https://' + this.ownerInfo.uid + '.shopduckku.com/m/');
                        } else {
                            JQ('#sfrm').attr('action', 'https://' + this.ownerInfo.uid + '.shopduckku.com');
                        }
                        JQ('#sfrm').submit()

                    });
                    return;
                    break;
                case 'userPhoto':
                    urlCode = 'userPhoto/list'
                    break;
                case 'metaroom':
                    urlCode = 'metaroom/list'
                    break;
                case 'chat':
                    if (!this.isLogin) {
                        this.setLoginBoxOpen(true);
                        return;
                    } else {
                        if (!this.chatMember && !this.isAdmin && !this.favoriteClass) {
                            let params = {
                                message: '먼저 구독신청 하세요',
                            };
                            this.$eventBus.$emit('modalOpen', params);
                            return;
                        }
                        urlCode = code;
                    }
                    break;
                default:
                    urlCode = code;
                    break;
            }
            for (let item of this.menuList) {
                if (item.code == code) {
                    item.gclass = 'active'
                } else item.gclass = ''
            }
            this.$router.push('/' + this.uid + '/main/' + urlCode)
            this.menuCode = code;
        },
        goMetabusPage(itemCode, index) {
            let k = 0;
            for (let item of this.menuList[index].subMenus) {
                if (item.code == itemCode) {
                    item.gclass = 'selected';
                } else item.gclass = '';
                this.$set(this.menuList[index].subMenus, k, item);
                k++;
            }
            this.$router.push('/' + this.uid + '/main/metaroom/' + itemCode)
        },
        setFavorite() {
            if (!this.isLogin) {
                this.setLoginBoxOpen(true);
                return;
            }
            let myBj = this.favoriteClass;
            if (this.uid == this.myUid) {
                return;
            }

            const frm = new FormData()
            frm.append('targetUid', this.uid)
            this.$eventBus.$emit('overlay', 'open');
            apiService.post(API_URL_MESSAGE_USER_UPDATE, frm, (res) => {
                this.$eventBus.$emit('overlay', 'hide');
                if (myBj != 'myBj') {
                    this.favoriteClass = 'myBj';
                } else this.favoriteClass = '';
                this.readNum = res.mypen;

                let params = {
                    message: '구독 정보가 저장되었습니다',
                };
                this.$eventBus.$emit('modalOpen', params);

            });
        },
        showBannerRegist() {
            if (!this.isLogin) {
                this.setLoginBoxOpen(true);
            } else {

                this.modalShow = true;
                this.bannerRegistShow = true;
            }

        },
        bannerModalHide() {
            this.modalShow = false;
            this.bannerRegistShow = false;

        },
        webGlModalHide(params) {
            this.webGlModalShow = false;
            this.webGlViewShow = false;
            if (params.type != 'close') {
                this.webGlSend(params);
            }
        },

        setBannerPaymentFrame(params) {
            this.modalShow = false;
            this.bannerRegistShow = false;
            if (!this.myUid) return;

            this.bannerCode = params.bannerCode;
            this.paymentFrameShow = true;
            let device = (this.mobileView)?'m':'pc';
            this.paymentFrameSrc = '/api/danalPayment/bannerPayment?orderId=' + params.orderId+'&device='+device+'&name=' + params.name + '&email=' + params.email + '&itemName=' + params.itemName;
        },
        bannerPaymentClose(cmd) {
            this.paymentFrameShow = false;
            this.paymentFrameSrc = '';
            let params = {};
            switch (cmd) {
                case 'succ':
                    params = {
                        message: '광고가 신청되었습니다',
                        doAction: () => {
                            if (this.bannerCode == 'pcmain_left') {
                                //this.$emit('bannerModalHide', 'reload');
                            }
                        }
                    };
                    this.$eventBus.$emit('modalOpen', params);
                    break;
                case 'fail':
                    params = {
                        message: '결제에 실패하였습니다',
                    };
                    this.$eventBus.$emit('modalOpen', params);
                    break;

            }
        },
        mobileModalOpen(cmd) {
            this.mobileModalShow = true;

        },
        mobileModalHide() {
            this.mobileModalShow = false;

        }

    },
    beforeDestroy() {

    },
    mounted() {
        if (this.uid == 'world') {
            JQ('.isTargetUid').hide();
        } else {
            JQ('.isTargetUid').show();
        }


    }


}
</script>
<style>
    .select-box {
        background: #fff !important;
    }
</style>
<style lang="scss" scoped="true">
.data-page-container {
    .userBg {
        width: 100%;
        height: 165px;
        background: #fff;
        padding: 25px 30px 0 50px;
        display: flex;
        justify-content: space-between;

        .memberInfo-box {
            display: flex;

            .img-box {

                width: 116px;
                height: 116px;
                overflow: hidden;
                border-radius: 50%;
                background: #225CA2;
                text-align: center;

                img {
                    width: 100%;
                    min-height: 116px;
                }

                i {
                    color: #fff;
                    font-size: 40pt;
                    margin-top: 29px;

                }
            }

            .info-box {
                margin-left: 15px;
                color: #000;
                font-size: 10pt;

                .name {
                    font-size: 20pt;
                    font-weight: bold;
                }

                .url {
                    margin-bottom: 10px;
                }

                .desc {
                    color: #999;
                }
            }
        }

        .button-box {
            .mbtn {
                background: #225CA2;
                color: #fff;
                margin-right: 10px;

                i {
                    margin-right: 5px;
                }

                &.myBj {
                    color: #fff;
                }

            }
        }
    }

    .metabusBg {
        overflow-x: auto;
        overflow-y: hidden;
        width:100%;
        height:300px;
        background: #000000;
    }

    .main-container {
        width: 100%;
        background: #fff;
        padding: 40px;

    }
    .tab-menus {
        position: sticky;
        top: 0;
        z-index: 100;
        background-color: #fff;
        padding: 0;
        width: 100%;
        display: flex;
        border-bottom: solid 1px #dcdcdc;
        .tab-item {
            color: #555;
            font-size: 11pt;
            position: relative;
            cursor: pointer;

            span {
                display: inline-block;
                width: 100%;
                padding: 18px 25px;
            }

            &.active {
                border-bottom: solid 2px #1F2A40;
                font-weight: bold;
                color: #1F2A40;
            }


        }
    }

    .tab-form-item {
        width: 100%;
        color: #fff;
        background: #141A2C;
    }

    #screenLayout {
        width: 100%;
        height: calc(100vh);
        top: 0;
        left: 0;
        background: rgba(0, 0, 0, 0.5);
        position: fixed;
        z-index: 1000000;

        #bannerPaymentFrameBox {
            width: 660px;
            height: 495px;
            margin: 150px auto 0 auto;
            background: #fff;
        }
    }

    &.mobile {
        .fixed-top {
            position: fixed;
            top: 0;
            right: 20px;
            z-index: 132;
            .top-button {
                padding: 0;
                li {
                    color: #fff;
                    padding-top: 10px;
                }
            }
        }
        .userBg {
            height: 92px;
            background: #fff;
            padding:15px 15px 0 15px;
            display: flex;
            justify-content: space-between;
            .memberInfo-box {
                display: flex;
                .img-box {

                    width: 60px;
                    height: 60px;
                    overflow: hidden;
                    border-radius: 50%;
                    background: #225CA2;
                    text-align: center;
                    img {
                        width: 100%;
                        min-height:60px;
                    }

                    i {
                        color: #fff;
                        font-size: 20pt;
                        margin-top: 16px;

                    }
                }

                .info-box {
                    margin-left:15px;
                    color: #000;
                    font-size:9pt;
                    .name {
                        font-size: 12pt;
                        font-weight: bold;
                        img {
                            width:25px;
                        }
                    }
                    .url {
                        margin-bottom:5px;
                    }
                    .desc {
                        color: #999;
                        font-size:8px;
                    }
                }
            }

            .button-box {
                padding-top:10px;
                .mbtn {


                }
            }
        }

        .metabusBg {
            overflow-x: auto;
            overflow-y: hidden;
            background: #000000;
        }

        .main-container {
            width: 100%;
            background: #fff;
            padding:15px;

        }

        .swiper-tab-menus {
            position: sticky;
            top: 40px;
            z-index: 100;
            background-color: #fff;
            width: 100%;
            display:flex;
            padding:0;
            margin:0;
            .swiper-box-layout {
                width:100%;
                .swiper-box {
                    width: 20%;
                    padding: 0;

                    .tab-item {
                        padding: 0;
                        color: #999;
                        font-size: 10pt;
                        position: relative;
                        text-align: center;

                        span {
                            text-align: center;
                            display: inline-block;
                            padding:15px 5px;
                        }

                        &.active {
                            border-bottom: solid 2px #000;
                            color: #000;
                        }

                        .metabus-box {
                            position: absolute;
                            top: 63px;
                            left: -80px;
                            width: 265px;
                            z-index: 1000;

                            .metabus-ul {
                                padding: 0;
                                display: flex;
                                width: 100%;
                                background: #313646;

                                li {
                                    text-align: center;
                                    font-size: 10pt;
                                    padding: 13px 20px;
                                    cursor: pointer;
                                    color: #999999;

                                    &.selected {
                                        color: #686EFB;
                                    }
                                }
                            }

                        }
                    }
                }
            }
        }

        .tab-form-item {
            width: 100%;
            color: #fff;
            background: #141A2C;
        }

        #screenLayout {
            width: 100%;
            height: calc(100vh);
            top: 0;
            left: 0;
            background: rgba(0, 0, 0, 0.5);
            position: fixed;
            z-index: 1000000;

            #bannerPaymentFrameBox {
                width: 660px;
                height: 495px;
                margin: 150px auto 0 auto;
                background: #fff;
            }
        }
    }
}

.mobile-modal-layout {
    background:#fff;
    padding:10px;
    .close-box {
        text-align:right;
        font-size:15pt;
    }
    .req-button-box {
        padding:0;
        li {
            padding:0 0 10px 10px;
            &.myBj {
                color: #686EFB;
                font-weight:bold;
            }
        }
    }


}
.myPaymentFrameLayout {
    &.mobile {
        width: 100%;
        height: calc(100vh);
        top: 0;
        left: 0;
        background: rgba(0, 0, 0, 0.5);
        position: fixed;
        z-index: 1000000;

        #my-bannerPaymentFrameBox {
            width:100%;
            min-height: calc(100vh);
            margin:0;
            background: #fff;
        }
    }
}

.screenBox {
    z-index: 1000001;
    width:100%;
    height:calc(100vh);
    position:fixed;
    top:0;
    left:0;
    background:#fff;
    .mobile-header {
        width: 100%;
        background: #141A2C;
        height: 44px;
        display:flex;
        box-shadow: 0px 0px 9px #0000007A;
        .back-button {
            color:#fff;
            margin:10px 0 0 10px;
        }
        .header-title {
            text-align:left;
            padding:10px 0 0 15px;
            color:#fff;
            font-weight: 600;
        }
    }

}
</style>
