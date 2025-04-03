<template>
    <div :class="'data-container '+mobileClass">
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
                        <v-btn @click="" v-if="item.name && item.link && item.use=='yes'" @click="goWindow(item.link)"
                               type="button"
                               class="link-button">
                            {{ item.name }}
                        </v-btn>
                    </li>

                </ul>
            </div>

            <div class="bottom-box">

                <!--div v-if="cbtUse"
                     class="chatbot-icon">
                    <img src="../../../assets/img/btn_chatbot.png"/>
                </div-->
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
    </div>
</template>


<script>
import {THEMES} from '../../../config/themes'
import {
    API_URL_LINK_LINK_INFO,
    HOST
} from '../../../api/urls';
import apiService from "../../../api/apiService";

export default {
    name: 'linkViewMain',
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
            bankList: [
                {text: '우리은행', value: 'a'},
                {text: '신한은행', value: 'b'},
                {text: 'SC제일은행', value: 'c'},
                {text: '기업은행', value: 'd'},
            ],
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
            uid:'',
            shopUse:'',
            logo:'',
            serverCheckFlag:false,
            ownerNo:'',
        }
    },
    created() {
        if (this.$isMobile()) {
            this.mobileView = true;
            this.mobileClass = 'mobile'
        }
        this.uid = this.$route.params.uid;
        this.getInfo();
        this.logo = this.themeList[0].logo;

    },
    methods: {
        setChatbotScript() {
            window.bottalksSetting = {"uIdx": this.ownerNo, "botID": "e412c6c29d20b06", "botHost": "https://duckku.bottalks.ai"};
            (function(d,s,id) {
                var j,i=new Date().getTime(),t=d.getElementsByTagName(s)[0];
                var h=window.bottalksSetting.botHost;
                if(d.getElementById(id)) {return;}
                j = d.createElement(s); j.id = id; j.async=1;
                j.src = h+"/plugin_bot/bottalks.plugin.chatbot.js?"+i;
                t.parentNode.insertBefore(j, t);
            }(document, "script", "bottalks-embed"));

        },
        getInfo() {
            const frm = new FormData()
            frm.append('uid',this.uid)
            apiService.post(API_URL_LINK_LINK_INFO, frm, (res) => {
                if (res.info) {
                    this.ownerNo = res.info.ownerNo;
                    this.setData(res.info);


                }

            })
        },
        setData(info) {
            this.linkList = [];
            if (info.linkData) {
                for (let item of info.linkData) {
                    if (item.name && item.link) {
                        this.linkList.push(item)
                    }
                }
            }

            if (info.chatbotData) {

                if (info.chatbotData.use == 'yes') {
                    this.cbtUse = true;
                    this.cbtBtnName = info.chatbotData.name;
                } else {
                    this.cbtUse = false;
                }
            }
            this.serverCheckFlag = true;
            if (info.accountData) {
                this.name = info.accountData.name
                this.theme = info.accountData.theme

                let theme = this.themeList.find((item) => item.code == this.theme)
                if(theme) {
                    this.logo = theme.logo;
                    this.themeStyle = theme.style
                }
                this.msg = info.accountData.msg
                if (info.accountData.img) this.imgPreview = HOST + info.accountData.img
                else this.imgPreview = '';
                let bank = (info.accountData.bank) ? info.accountData.bank : '';
                let gitem = this.bankList.find((item) => item.value == bank)
                if (gitem) this.bankName = gitem.text;

                this.bankUse = (info.accountData.bankUse == 'yes') ? 'yes' : '';
                this.bankNumber = info.accountData.bankNumber
                this.bankOwner = info.accountData.bankOwner
                this.bankMsg = info.accountData.bankMsg
                this.bankShow = false;
                if (this.bankName || this.bankOwner || this.bankMsg || this.bankNumber) {
                    this.bankShow = true;
                }
            } else {
                this.imgPreview = '';
            }
            this.shopUse = (info.shopUse=='yes')?'yes':'no';

        },
        goWindow(url) {
            if(url) {
                if (this.mobileView) {
                    if (url.indexOf('.linkduckku.com') !== -1) {
                        url = url + '/m/';
                    }
                }
                window.open(url)
            }
        }

    },
    mounted() {

        if(this.serverCheckFlag) {
            if(this.cbtUse)this.setChatbotScript()
        } else {
            setTimeout(()=> {
                if(this.cbtUse)this.setChatbotScript()
            },400)

        }

    }

}
</script>
<style lang="scss" scoped>
.data-container {
    width: 100%;
    .user-box {
        height:225px;
        padding: 60px 0 20px 0;
        text-align: center;

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
        min-height:calc(100vh - 305px);

        .link-button-ul {
            padding: 20px 0;

            li {
                margin-bottom: 15px;
            }
        }
    }

    .bottom-box {
        width:100%;
        .chatbot-icon {
            position:fixed;
            bottom:15px;
            right:20px;
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
        border-radius: 10px 10px 0 0;
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

    &.mobile {

    }

}


</style>