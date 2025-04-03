<template>
    <div :class="'priview-container '+mobileClass">
        <div class="p-title">미리보기</div>
        <div class="device-box">
            <vue-custom-scrollbar class="inner-box" :settings="settings">
                <div :class="'theme'+theme" :style="themeStyle">
                    <div class="user-box">
                        <div class="img-box">
                            <img v-if="imgPreview" :src="imgPreview"/>
                            <i v-else class="fa fa-user"></i>
                        </div>
                        <div class="user-name">{{ name }}</div>
                        <div class="user-msg" v-html="msg"></div>
                    </div>
                    <div class="link-button-box">
                        <ul class="link-button-ul">
                            <li v-for="(item,index) in linkList">
                                <v-btn v-if="item.name && item.link && item.use=='yes'"
                                       type="button"
                                       class="link-button">
                                    {{ item.name }}
                                </v-btn>
                            </li>

                        </ul>
                    </div>

                    <div class="bottom-box">

                        <div v-if="cbtUse"
                               class="chatbot-icon">
                            <img src="../../../../assets/img/btn_chatbot.png"/>
                        </div>
                        <div class="logo">
                            <img :src="logo"/>
                        </div>
                    </div>
                    <div class="fixed-box" v-if="bankShow && bankUse=='yes'">
                        <div class="text-1">후원계좌</div>
                        <div class="text-2">{{ bankName }} {{ bankNumber }} {{ bankOwner }}</div>
                        <div class="text-3">{{ bankMsg }}</div>
                    </div>
                </div>
            </vue-custom-scrollbar>
        </div>
    </div>
</template>


<script>
import {THEMES} from '../../../../config/themes'
import vueCustomScrollbar from 'vue-custom-scrollbar'
import "vue-custom-scrollbar/dist/vueScrollbar.css"
import {mapGetters} from "vuex";
import {
    HOST
} from '../../../../api/urls';

export default {
    name: 'devicePreview',
    components: {
        vueCustomScrollbar
    },
    computed: {
        ...mapGetters('link', ["getLinkData", "getServerFlag", "getChatbotUse", "getAccountData"]),
    },
    watch: {
        getServerFlag(val) {
            if (val) {
                this.setData();
            }
        },
        getChatbotUse(val) {
            this.setData();
        },
        getLinkData(val) {
            this.setData();
        },
        getAccountData() {
            this.setData();
        }
    },
    data() {
        return {
            linkList: [],
            mobileView: false,
            mobileClass: '',
            cbtBtnName: '',
            cbtUse: true,
            name: '',
            theme: '',
            msg: '',
            imgPreview: '',
            bankName: '',
            bankUse: '',
            bankNumber: '',
            bankOwner: '',
            bankMsg: '',
            bankShow: false,
            settings: {
                suppressScrollY: false,
                suppressScrollX: false,
                wheelPropagation: false
            },
            themeList: THEMES,
            themeStyle: {},
            logo:'',

        }
    },
    created() {
        if (this.$isMobile()) {
            this.mobileView = true;
            this.mobileClass = 'mobile'
        }
        this.logo = this.themeList[0].logo;
        if (this.getServerFlag) {
            this.setData();
        }

    },
    methods: {
        setData() {
            this.linkList = [];
            if (this.getLinkData) {
                for (let item of this.getLinkData) {
                    if (item.name && item.link) {
                        this.linkList.push(item)
                    }
                }
            }

            if (this.getChatbotUse) {

                if (this.getChatbotUse == 'yes') {
                    this.cbtUse = true;
                    //this.cbtBtnName = this.getChatbotData.name;
                } else {
                    this.cbtUse = false;
                }
            }
            if (this.getAccountData) {
                this.name = this.getAccountData.name
                this.theme = this.getAccountData.theme

                let theme = this.themeList.find((item) => item.code == this.theme)
                if(theme) {
                    this.themeStyle = theme.style
                    this.logo = theme.logo;
                }
                this.msg = this.getAccountData.msg
                if (this.getAccountData.img) this.imgPreview = HOST + this.getAccountData.img
                else this.imgPreview = '';
                this.bankName = (this.getAccountData.bank) ? this.getAccountData.bank : '';

                this.bankUse = (this.getAccountData.bankUse == 'yes') ? 'yes' : '';
                this.bankNumber = this.getAccountData.bankNumber
                this.bankOwner = this.getAccountData.bankOwner
                this.bankMsg = this.getAccountData.bankMsg
                this.bankShow = false;
                if (this.bankName || this.bankOwner || this.bankMsg || this.bankNumber) {
                    this.bankShow = true;
                }
            } else {
                this.imgPreview = '';
            }

        }

    },

}
</script>
<style lang="scss" scoped>
.priview-container {
    width: 100%;
    background: #0E276A;
    border-radius: 36px 0px 0px 0px;
    position: fixed;
    bottom: 0;
    z-index:50;
    padding: 30px 0 20px 64px;
    .p-title {
        color:#fff;
        font-weight:bold;
        font-size:24px;
        padding-bottom:26px;
    }
    .device-box {
        width: 319px;
        height: 650px;
        border-radius: 20px;
        background: #fff;

        .inner-box {
            width: 319px;
            height: 650px;
            padding: 0;
            overflow: auto;
            border-radius: 20px;

            .user-box {
                padding: 60px 0 20px 0;
                text-align: center;
                height:225px;
                .img-box {
                    width: 90px;
                    height: 90px;
                    border-radius: 50%;
                    background: #E4E5FF;
                    overflow: hidden;
                    margin: auto;

                    img {
                        width: 100%;
                        min-height: 90px;
                    }

                    i {
                        margin-top: 20px;
                        font-size: 38pt;
                        color: #686EFB;

                    }

                }

                .user-name {
                    color: #000;
                    font-weight: bold;
                    padding: 10px 0 0 0;
                }

                .user-msg {
                    font-size: 10pt;
                    color: #999;
                    padding: 0 30px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: normal;
                    word-wrap: break-word;
                    display: -webkit-box;
                    -webkit-box-orient: vertical;
                    -webkit-line-clamp: 3;

                }
            }

            .link-button {
                margin: 0;
                overflow: hidden;
                width: 270px;
                height: 48px;
                background: #686EFB;
                border-radius: 6px;
                color: #fff;
            }

            .link-button-box {
                width: 270px;
                margin: 0 auto 20px auto;
                min-height:350px;

                .link-button-ul {
                    padding: 20px 0;

                    li {
                        margin-bottom: 15px;
                    }
                }
            }

            .bottom-box {
                width: 270px;
                margin: auto;
                .chatbot-icon {
                    position:fixed;
                    bottom:27px;
                    right:63px;
                }
                .logo {
                    width: 100px;
                    margin:20px auto 20px auto;

                    img {
                        width: 100px;
                    }
                }
            }

            .fixed-box {
                margin-top: 20px;
                padding: 20px;
                width: 100%;
                background: #000;
                color: #fff;
                border-radius: 10px;
                bottom: 0;
                font-size: 10pt;
                font-weight: normal;

                .text-1 {
                }
            }

            .themeb {
                .user-box {
                    .logo-box {
                        background: #FFF;

                        i {
                            color: #6579B1;
                        }
                    }

                }

                .link-button-box {
                    .link-button-ul {
                        li {
                            .link-button {
                                background: #fff;
                                color: #333;
                            }
                        }

                    }
                }
                .fixed-box {
                    background:rgba(255,255,255,0.88);
                    color: #333;

                }

            }

            .themec {
                .user-box {
                    .user-name {
                        color: #fff;

                    }

                    .user-msg {
                        color: #ccc;

                    }
                }
                .fixed-box {
                    background:rgba(255,255,255,0.88);
                    color: #333;

                }
            }

            .themed {
                .link-button-box {
                    .link-button-ul {
                        li {
                            .link-button {
                                background: #fff;
                                color: #333;
                            }
                        }

                    }
                }
            }

        }
    }

    &.mobile {
        width: 100%;
        padding: 70px 20px 100px 20px;
        width: auto;

        .space {
            height: 20px;
        }

        .submit-button {
            position: fixed;
            bottom: 0;
            width: calc(100vw);
            margin-left: -20px;
            border-radius: 0;
        }

        .tab {
            width: calc(100vw);
            margin-left: -20px;

            li {
                font-size: 12pt;
            }
        }

    }

}


</style>