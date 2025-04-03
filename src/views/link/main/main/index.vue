<template>
    <div :class="'page-container-box '+mobileClass">
        <div class="page-header">
            <div class="logo" @click="goHome()">
                <img src="../../../../assets/linksvg/logo.png"/>
            </div>
            <ul class="tabs" :style="menuStyle">
                <li v-for="menu in menuList" @click="goPage(menu.code)" :class="'item '+menu.gclass" :key="menu.code">
                    <i :class="menu.icon"></i>
                </li>
            </ul>
            <div v-if="!mobileView" class="header-user-box">
                <div class="user-icon" @click="goUserModify()">
                    <img v-if="imgPreview" class="user-img" :src="imgPreview"/>
                    <img v-else class="icon" src="../../../../assets/img/ico_user_link.png"/>
                </div>
                <div class="logout" @click="logout()">
                    <i class="fas fa-sign-out-alt"></i>
                </div>

            </div>
            <div class="user-box" v-else>
                <div class="user-icon" @click="goUserModify()">
                    <img v-if="imgPreview" class="user-img" :src="imgPreview"/>
                    <img v-else class="icon" src="../../../../assets/linksvg/ico_user.svg"/>
                </div>
            </div>

        </div>
        <div class="pc-contents-container" v-if="!mobileView">
            <div class="piece-box"></div>
            <div class="contents-box">
                <div class="left-contents" style="cursor:pointer;">
                    <div class="inner-box" @click="copyUrl()">
                        <div class="text-box">
                            {{ url }}{{ uid }}
                        </div>
                        <div class="icon-box">
                            <i class="fas fa-link"></i>
                        </div>
                    </div>
                    <div class="content-title">
                        <span>{{ title }}</span>
                        <div class="tip">
                            입력하시면 자동으로 저장됩니다
                        </div>
                    </div>
                </div>
            </div>
            <div class="scroll-div-layout">
                <div class="scroll-div">
                    <router-view/>
                </div>
            </div>
            <div class="device-preview">
                <devicePreview></devicePreview>
            </div>

        </div>
        <div class="contents-container" v-else>
            <div class="contents-header">
                <div class="space-div"></div>
                <div class="left-contents" style="cursor:pointer;">
                    <div class="inner-box" @click="copyUrl()">
                        <div class="text-box">
                            {{ url }}{{ uid }}
                        </div>
                        <div class="icon-box">
                            <i class="fas fa-link"></i>
                        </div>
                    </div>
                </div>
                <div class="space-div"></div>
                <div class="space"></div>

            </div>
            <div class="contents-body">
                <div class="space-div"></div>
                <div class="left-contents">
                    <div class="content-title">
                        <span>{{ title }}</span>
                        <div class="tip">
                            입력하시면 자동으로 저장됩니다
                        </div>
                    </div>

                    <div class="scroll-div">
                        <router-view/>
                    </div>
                </div>
                <div class="space-div"></div>

            </div>

        </div>
    </div>

</template>

<script>
import devicePreview from "./devicePreview";
import {mapActions, mapGetters} from "vuex";
import AUTH from '../../../../api/auth'
import {
    HOST,
    API_URL_LINK_LINK_INFO, API_URL_LINK_LINK_CHATBOT_LIST,
} from '../../../../api/urls';
import apiService from '../../../../api/apiService';


export default {
    name: 'linkUserMain',
    components: {
        devicePreview
    },
    computed: {
        ...mapGetters('link', ["getAccountData"]),

    },
    watch: {
        getAccountData(val) {
            this.setData()

        }
    },
    data() {
        return {
            url: 'https://duckku.com/link/',
            menuList: [
                {name: '링크', code: 'link', gclass: '', icon: 'fas fa-link'},
                {name: '챗봇', code: 'chatbot', gclass: '', icon: 'fas fa-comments'},
                {name: '계정 설정', code: 'setting', gclass: '', icon: 'fas fa-cog'},
                {name: '쇼핑몰 생성', code: 'shop', gclass: '', icon: 'fas fa-shopping-basket'},
            ],
            menuStyle: {},
            uid: '',
            title: '',
            imgPreview: '',
            mobileClass: '',
            mobileView: false
        }
    },
    created() {
        if (this.$isMobile()) {
            this.mobileClass = 'mobile'
        }
        let memberInfo = AUTH.getSession(this.$isMobile());
        if (memberInfo.AUTHTOKEN) {
            if (memberInfo.mtype == 'indi') {
                this.$router.push({path: '/'});
            } else {
                if (this.$isMobile()) {
                    this.mobileView = true;
                    this.mobileClass = 'mobile'
                }
                this.uid = memberInfo.uid;
                let path = this.$route.path.split('/');
                if (path[4]) {
                    let index = 0;
                    let item = {};
                    switch (path[4]) {
                        case 'chatbot':
                            index = 1;
                            item = this.menuList[index];
                            item.gclass = 'active'
                            this.$set(this.menuList, index, item)
                            this.title = item.name;
                            break;
                        case 'setting':
                            index = 2;
                            item = this.menuList[index];
                            item.gclass = 'active'
                            this.$set(this.menuList, index, item)
                            this.title = item.name;
                            break;
                        case 'shop':
                            index = 3;
                            item = this.menuList[index];
                            item.gclass = 'active'
                            this.$set(this.menuList, index, item)
                            this.title = item.name;
                            break;
                        case 'link':
                            index = 0;
                            item = this.menuList[index];
                            item.gclass = 'active'
                            this.$set(this.menuList, index, item)
                            this.title = item.name;

                            break;
                        default:
                            this.title = '회원 정보 변경';
                            break;
                    }

                }
                this.getInfo();
                this.getChatbotListData();
            }


        } else {
            this.$router.push({path: '/link'});
        }
    },
    methods: {
        ...mapActions('link', ["setLinkData", "setAccountData", "setChatbotUse", "setChatbotList", "setShopUse", "setServerFlag", "setChatbotServerFlag"]),
        getInfo() {
            const frm = new FormData()
            apiService.post(API_URL_LINK_LINK_INFO, frm, (res) => {
                if (res.info) {
                    if (res.info.linkData) this.setLinkData(res.info.linkData);
                    if (res.info.accountData) this.setAccountData(res.info.accountData);
                    if (res.info.chatbotData) this.setChatbotUse(res.info.chatbotData.use)
                    if (res.info.shopUse) this.setShopUse(res.info.shopUse);

                }
                this.setServerFlag(true);
                this.setData();
            })
        },
        getChatbotListData() {
            const frm = new FormData()
            apiService.post(API_URL_LINK_LINK_CHATBOT_LIST, frm, (res) => {

                if(res.result=='succ') this.setChatbotList(res.list)
                this.setChatbotServerFlag(true);
            })
        },
        copyUrl() {
            const selBox = document.createElement('textarea');
            selBox.style.position = 'fixed';
            selBox.style.left = '0';
            selBox.style.top = '0';
            selBox.style.opacity = '0';
            selBox.value = this.url + this.uid;
            document.body.appendChild(selBox);
            selBox.focus();
            selBox.select();
            document.execCommand('copy');
            document.body.removeChild(selBox);
            let message = {
                message: 'URL을 클립보드에 복사하였습니다',
            };
            this.$eventBus.$emit('modalOpen', message);
        },
        setData() {
            if (this.getAccountData) {
                if (this.getAccountData.img) this.imgPreview = HOST + this.getAccountData.img
                else this.imgPreview = '';
            }

        },
        goHome() {
            this.$router.push({path: '/link/main/main/link'});

        },
        goPage(code) {
            for (let item of this.menuList) {
                if (item.code == code) {
                    item.gclass = 'active'
                    this.title = item.name;
                } else item.gclass = '';
            }
            this.$router.push({path: '/link/main/main/' + code});
        },
        goUserModify() {
            for (let item of this.menuList) {
                item.gclass = '';
            }
            this.title = '회원 정보 변경';
            this.$router.push('/link/main/main/userModify')
        },
        logout() {
            AUTH.logout(this.$isMobile());
            let msgParams = {
                message: '로그아웃 되었습니다',
                doAction: () => {
                    this.$router.push({path: '/link'});
                }
            }
            this.$eventBus.$emit('modalOpen', msgParams);

        },

    },
    mounted() {
        if (!this.$isMobile()) {
            if (window.innerHeight < 780) {
                this.menuStyle = {'padding': '100px 17px 0 0'}
            }
        }

    }
}
</script>

<style lang="scss" scoped="true">
.page-container-box {
    width: 100%;
    margin: 0;
    padding: 0;
    background: #E9ECF5;
    .page-header {
        background: #E9ECF5;
        left: 0;
        top: 0;
        position: fixed;
        width: 110px;
        z-index:5;
        height: calc(100vh);
        .logo {
            margin-top: 53px;
            cursor: pointer;
            text-align: center;

            img {
                width: 60px;
                margin-right: 17px;
            }

        }

        .tabs {
            height: 18px;
            margin: auto;
            padding: 200px 17px 0 0;

            .item {
                cursor: pointer;
                height: 82px;
                line-height: 82px;
                color: #9AA4C7;
                text-align: center;
                font-size: 24pt;

                &.active {
                    color: #F2554C;

                    &:hover {
                        color: #F2554C;
                    }
                }

                &:hover {
                    color: #858EAB;

                }

            }
        }

        .header-user-box {

            position: absolute;
            bottom: 32px;
            text-align: center;
            width: 110px;
            color: #9AA4C7;
            font-size: 25pt;
            padding-right: 17px;

            .user-icon {
                margin: 0 0 15px 23px;
                width: 46px;
                height: 46px;
                border-radius: 50%;
                overflow: hidden;
                background: #fff;
                text-align: center;
                cursor: pointer;

                img.icon {
                    margin-top: 7px;
                    width: 29px;
                }

                img.user-img {
                    width: 100%;
                    min-height: 30px;
                }

            }

            .logout {
                cursor: pointer;

                &:hover {
                    color: #858EAB;

                }
            }
        }

    }

    .pc-contents-container {
        margin-left: 110px;
        padding: 0;
        width: calc(100vw - 110px);
        min-height: calc(100vh);
        position: relative;
        .piece-box {
            background: #E9ECF5;
            width:37px;
            height:37px;
            position:fixed;
            z-index:5;
            top:0;
            left:110px;

        }
        .contents-box {
            background: #F2F5FA;
            border-radius: 36px 0 0 0;
            position: fixed;
            background: #F2F5FA;
            padding-top: 57px;
            left: 110px;
            top: 0;
            display: flex;
            width: 100%;
            z-index: 10;

            .left-contents {
                width: 880px;
                margin-left: calc((100vw - 1438px) / 2);
                padding-bottom: 10px;

                .inner-box {
                    background: #fff;
                    height: 70px;
                    border-radius: 35px;
                    display: flex;
                    justify-content: space-between;

                    .text-box {
                        font-size: 11pt;
                        font-weight: 600;
                        color: #000;
                        padding: 25px 0 0 35px;

                        i {
                            color: #98A7C8;
                        }
                    }

                    .icon-box {
                        margin: 14px 15px 0 0;
                        width: 42px;
                        height: 42px;
                        border-radius: 50%;
                        background: #F4F5FA;
                        text-align: center;
                        color: #98A7C8;
                        line-height: 42px;
                        font-size: 14pt;
                    }
                }

                .content-title {
                    width: 100%;
                    height: 10px;
                    margin: 40px 0 40px 0;
                    border-bottom: solid 1px #dcdcdc;

                    span {
                        margin-top: -20px;
                        display: inline-block;
                        font-weight: bold;
                        font-size: 18pt;
                        background: #F2F5FA;
                        padding-right: 30px;
                    }

                    .tip {
                        font-size: 10pt;
                        font-weight: bold;
                        padding-bottom: 40px;
                    }

                }

            }

        }

        .scroll-div-layout {
            width:100%;
            background: #F2F5FA;
            margin-top:50px;
            .scroll-div {
                padding: 200px 0 40px 0;
                margin-left: calc((100vw - 1438px) / 2);
                width: 880px;
            }
        }

        .device-preview {
            margin-left: calc(100vw - 558px);
            width: 448px;
            min-width: 448px;
        }
    }

    &.mobile {
        width: calc(100vw);
        overflow-x: hidden;

        .page-header {
            width: 100%;
            height: 135px;
            z-index: 50;
            background: #E9ECF5;

            .logo {
                position: absolute;
                top: 26px;
                left: 24px;
                margin-top: 0;
                line-height: 100%;

                img {
                    width: 30px;
                }
            }

            .tabs {
                height: 18px;
                margin: 60px 60px 0 60px;
                padding: 0;
                display: flex;
                justify-content: space-between;

                .item {
                    cursor: pointer;
                    height: 82px;
                    line-height: 82px;
                    color: #9AA4C7;
                    text-align: center;
                    font-size: 18pt;

                }
            }

            .user-box {
                position: absolute;
                top: 30px;
                right: 24px;
                width: 30px;
                min-width: 30px;

                .user-icon {
                    width: 30px;
                    height: 30px;
                    border-radius: 50%;
                    overflow: hidden;
                    background: #fff;
                    text-align: center;
                    cursor: pointer;

                    img.icon {
                        margin-top: 5px;
                        width: 20px;
                    }

                    img.user-img {
                        width: 100%;
                        min-height: 30px;
                    }

                }
            }


        }

        .contents-container {
            margin-left: 0;
            background: #F2F5FA;
            width: 100%;
            min-height: 300px;
            margin-top: 135px;
            border-radius: 36px 36px 0 0;

            .contents-header {
                padding: 30px 24px;
                display: block;
                width: 100%;

                .space-div {
                    display: none;
                }

                .left-contents {
                    width: 100%;
                    min-width: 100%;

                    .inner-box {
                        background: #fff;
                        height: 60px;
                        border-radius: 30px;
                        display: flex;
                        justify-content: space-between;

                        .text-box {
                            font-size: 10pt;
                            font-weight: 600;
                            color: #000;
                            padding: 20px 0 0 20px;

                            i {
                                color: #98A7C8;
                            }
                        }

                        .icon-box {
                            margin: 10px 10px 0 0;
                            width: 42px;
                            height: 42px;
                            border-radius: 50%;
                            background: #F4F5FA;
                            text-align: center;
                            color: #98A7C8;
                            line-height: 42px;
                            font-size: 12pt;
                        }
                    }

                }

                .space {
                    display: none;

                }

            }

            .contents-body {
                padding: 0 20px 20px 20px;
                display: block;
                width: 100%;

                .space-div {
                    display: none;
                }

                .left-contents {
                    width: 100%;
                    min-width: 100%;

                    .content-title {
                        width: 100%;
                        height: auto;
                        margin: 0 0 30px 0;
                        border-bottom: none;

                        span {
                            margin-top: 0;
                            padding-right: 0;
                            display: inline-block;
                            font-weight: bold;
                            font-size: 18pt;
                            background: #F2F5FA;
                        }

                        .tip {
                            font-size: 10pt;
                            font-weight: bold;
                        }
                    }

                    .scroll-div {
                        padding-top: 0;
                        padding-right: 0;
                        height: auto;
                        overflow-y: visible;
                        overflow-x: hidden;
                    }
                }

            }
        }
    }
}
</style>