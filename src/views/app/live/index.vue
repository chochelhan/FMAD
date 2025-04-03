<template>
    <div :class="'liveMobileLayout '+mobileClass">
        <div v-if="mobileView && menuShow" @click="menuShow=false" class="menuBgScreen"></div>
        <div v-if="mobileView">

            <div class="live-menu" id="mobile-live-header-menu">
                <div class="big-menu" @click="goLiveMain()">
                    STEP01. 내 라이브
                </div>
                <div class="big-menu">
                    STEP03. 사용 후 관리
                </div>
                <ul class="menu-ul" v-if="status == 'complete'">
                    <li v-for="menu in myMenus" @click="goMenus(menu.code)">
                        {{menu.name}}
                    </li>
                </ul>
            </div>
            <div class="mobile-header">
                <div class="back-button" @click="menuShow=true">
                    <i class="fas fa-bars"></i>
                </div>
                <div class="header-title">
                    {{ title }}
                </div>
                <div class="play-button" @click="playLive()">
                    <i class="far fa-play-circle"></i>
                </div>

            </div>
            <div class="virtual-box"></div>
        </div>

        <router-view/>
    </div>

</template>

<script>
import {mapActions} from "vuex";
import apiService from "../../../api/apiService";
import {API_URL_BROADCAST_LIVE_INFO_WITH_OWNER} from "../../../api/urls";
import AUTH from "../../../api/auth";
import JQ from "jquery"

export default {
    name: 'LivePage',
    watch:{
        menuShow(val) {
            if(val) {
                JQ('body').css({'height':JQ(window).height()+'px','overflow':'hidden'})
                JQ('#mobile-live-header-menu').animate({
                    left:0,
                },300)

            } else {
                let left = -1 * (JQ(window).width() - 90);
                JQ('#mobile-live-header-menu').animate({
                    left:left+'px',
                },100,function() {
                    JQ('body').css({height:'auto',overflow:'visibile'})
                })
            }
        }
    },
    data() {
        return {
            mobileView: false,
            mobileClass: '',
            title: '',
            gno: '',
            status: '',
            myMenus:[],
            menuShow:false,
            memberInfo: {},
        }
    },
    created() {
        if (this.$isMobile()) {
            this.mobileView = true;
            this.mobileClass = 'mobile'
            this.setClass('none')
            this.setMemberInfo();
            this.gno = this.$route.params.no;
            this.setGno(this.gno);
            this.setMemberInfo();
            this.getLiveInfo();


        }
    },
    methods: {
        ...mapActions('mobile', ["setClass"]),
        ...mapActions('etc', ["setGno"]),
        getLiveInfo() {
            const frm = new FormData()
            frm.append('no', this.gno)
            apiService.post(API_URL_BROADCAST_LIVE_INFO_WITH_OWNER, frm, (ret) => {
                this.status = ret.info.status;
                this.title = ret.info.title;
                this.setMenus();
            });
        },
        goMenus(code) {
            this.menuShow = false;
           this.$router.push('/live/' + this.gno + '/' + code);

        },
        setMenus() {

            let afterClass = '';
            let myMenus = [
                {name: '시험 내역', code: 'afterExam', gclass: afterClass},
                {name: '간단 퀴즈 내역', code: 'afterQuiz', gclass: afterClass},
                {name: '채팅 내역', code: 'afterChat', gclass: afterClass},
                {name: '설문조사 내역', code: 'afterPoll', gclass: afterClass},
                {name: '투표 내역', code: 'afterVote', gclass: afterClass},
                {name: '공유 내역', code: 'afterData', gclass: afterClass},
                {name: '게시판 내역', code: 'afterBoard', gclass: afterClass},
                {name: '참가자 정보', code: 'afterUser', gclass: afterClass},
            ]
            let path = this.$route.path.split('/');
            let code = path[3];
            for (let mnu of myMenus) {
                if (mnu.code == code) {
                    mnu.gclass = 'active';
                } else mnu.gclass = '';
            }
            this.myMenus = myMenus;


        },
        setMemberInfo() {
            let memberInfo = AUTH.getSession(this.$isMobile());
            if (memberInfo.AUTHTOKEN) {
                this.memberInfo = memberInfo;
            } else {
                this.$router.push('/');
            }
        },
        goLiveMain() {
            this.menuShow = false;
            this.$router.push('/live/'+this.gno+'/liveInfo');
        },
        playLive() {
            if(this.status=='ready') {

                this.$router.push('/mobileHostLive/' + this.gno)
            } else {
                let msg = (this.status=='ing')?'현재 진행중인':'이미 종료된'
                let  message = {
                    message: msg+' 방송입니다',
                };
                this.$eventBus.$emit('modalOpen', message);
            }

        },
    }
}
</script>

<style lang="scss" scoped>
.menuBgScreen {
    position:fixed;
    top:0;
    left:0;
    width:100%;
    height:calc(100vh);
    z-index:110;
    background:rgba(0,0,0,0.5);
}
.live-menu {
    position:fixed;
    top:0;
    left:calc(-1 * (100vw - 90px));
    width:calc(100vw - 90px);
    height:calc(100vh);
    background:#fff;
    z-index:111;
    padding:40px 0 0 30px;
    .big-menu {
        color:#888;
        font-size:13pt;
        font-weight:700;
        margin-bottom:15px;
    }
    .menu-ul {
        padding:0;
        li {
            font-size:14px;
            padding:0 0 15px 20px;
        }
    }

}
.mobile-header {
    width: 100%;
    position: fixed;
    background: #141A2C;
    z-index: 90;
    top: 0;
    left: 0;
    height: 44px;
    display: flex;
    box-shadow: 0px 0px 9px #0000007A;

    .back-button {
        color: #fff;
        position:absolute;
        top: 10px;
        left:15px;
    }

    .header-title {
        width:100%;
        text-align: center;
        padding: 10px 0 0 15px;
        color: #fff;
        font-weight: 600;
    }
    .play-button {
        font-size:13pt;
        position:absolute;
        top: 10px;
        right:15px;
        color: #fff;
    }


}
.virtual-box {
    height:24px;
}
</style>
<style lang="scss">
.mypage-container {
    width: 100%;
    min-height: calc(100vh);
    background: #fff;
    .contents {
        padding: 50px 35px;

        .submit-button-box {
            display: flex;
            width: 700px;
            margin: 80px auto;
            justify-content: space-between;

            .cancle-button {
                width: 48%;
                border-radius: 0;
                padding: 0;
                background: #999999;
                color: #fff;
                min-height: 70px;
                font-size: 14pt;
            }

            .submit-button {
                width: 48%;
                border-radius: 0;
                padding: 0;
                background: #686EFB;
                color: #fff;
                min-height: 70px;
                font-size: 14pt;

            }
        }

        .stitle {
            font-size: 17pt;
            font-weight: bold;
            padding: 0 0 10px 0;
            color: #686EFB;
            border-bottom: solid 1px #dcdcdc;

            span.line {
                padding-bottom: 13px;
                border-bottom: solid 2px #686EFB;
            }

            span.question-box {
                border-bottom: solid 1px #999;
                line-height: 6px;
            }
        }

        .title-desc {
            padding: 10px 0 40px 0;
            font-size: 10pt;
            color: #555;

        }

        .sub-title {
            margin-top: 50px;
            font-weight: bold;
            color: #000;
            font-size: 14pt;
        }

        .sub-title-desc {
            padding: 5px 0 20px 0;
            font-size: 10pt;
            color: #555;

        }

        .field-box {
            padding: 0;

            & > li {
                border-bottom: solid 1px #DCDCDC;
                display: flex;
                padding: 25px 25px 0 25px;

                &:first-child {
                    border-top: solid 1px #dcdcdc;
                }

                .required-icon {
                    width: 220px;
                    color: #000;
                    font-weight: bold;
                    font-size: 12pt;
                    padding-top: 15px;
                }

                .field-input {
                    width: 60%;

                    .switch-ul {
                        width: 500px;
                        padding: 0;
                        display: flex;
                        margin-bottom: 25px;

                        &.three-box {
                            width: 600px;

                            li {
                                border-right: none;

                                &:last-child {
                                    border-right: solid 1px #dcdcdc;
                                }
                            }
                        }

                        li {
                            width: 50%;
                            border: solid 1px #dcdcdc;
                            text-align: center;
                            line-height: 55px;
                            height: 55px;
                            cursor: pointer;

                            &.active {
                                background: #686EFB;
                                color: #fff;
                            }

                            &:first-child {
                                border-right: none;
                                border-radius: 10px 0 0 10px;
                            }

                            &:last-child {
                                border-radius: 0 10px 10px 0;
                            }
                        }
                    }

                }
            }
        }
    }
    &.mobile {
        .no-data {
            width:100%;
            margin:0;
            font-size:13px;
            font-weight:normal;

        }
        .contents {
            padding:0 15px;

            .submit-button-box {
                display: flex;
                width: 100%;
                margin:40px auto;
                justify-content: space-between;
                .cancle-button {
                    width: 48%;
                    border-radius: 0;
                    padding: 0;
                    background: #999999;
                    color: #fff;
                    min-height: 50px;
                    font-size: 11pt;
                }

                .submit-button {
                    width: 100%;
                    border-radius: 0;
                    padding: 0;
                    background: #686EFB;
                    color: #fff;
                    min-height: 50px;
                    font-size: 11pt;

                }
            }
            .stitle {

                font-size: 12pt;
                font-weight: bold;
                padding: 0 0 10px 0;
                color: #686EFB;
                border-bottom: solid 1px #dcdcdc;

                span.line {
                    padding-bottom: 13px;
                    border-bottom: solid 2px #686EFB;
                }

                span.question-box {
                    border-bottom: solid 1px #999;
                    line-height: 6px;
                }
            }
            .sub-title {
                margin-top:20px;
                font-weight: bold;
                color: #000;
                font-size: 14px;
            }

            .sub-title-desc {
                padding: 5px 0 20px 0;
                font-size: 12px;
                color: #555;

            }
            .field-box {
                padding: 0;
                & > li {
                    border-bottom: solid 1px #DCDCDC;
                    display: block;
                    padding: 25px 0 0 0;

                    &:first-child {
                        border-top:none;
                    }

                    .required-icon {
                        width:100%;
                        font-size: 14px;
                        padding-top:5px;
                        padding-bottom:10px;
                    }

                    .field-input {
                        width: 100%;
                        .switch-ul {
                            width: 100%;
                            padding: 0;
                            display: flex;
                            margin-bottom:15px;

                            &.three-box {
                                width:100%;
                                li {
                                    border-right: none;
                                    &:last-child {
                                        border-right: solid 1px #dcdcdc;
                                    }
                                }
                            }

                            li {
                                width: 50%;
                                border: solid 1px #dcdcdc;
                                text-align: center;
                                line-height: 45px;
                                height: 45px;
                                font-size:13px;
                                cursor: pointer;

                                &.active {
                                    background: #686EFB;
                                    color: #fff;
                                }

                                &:first-child {
                                    border-right: none;
                                    border-radius: 10px 0 0 10px;
                                }

                                &:last-child {
                                    border-radius: 0 10px 10px 0;
                                }
                            }
                        }

                    }
                }
            }
        }
    }
}

/* question-box */
span.question-box {
    width: 16px;
    height: 16px;
    background: #F4F4F4;
    border: solid 1px #999;
    border-radius: 8px;
    display: inline-block;
    text-align: center;
    line-height: 12px;
    cursor: pointer;
    margin-left: 5px;
    position: relative;
    top: -2px;

    i {
        font-size: 7pt;
        color: #999;
    }

    .menu-title-tip {
        text-align: left;
        position: absolute;
        top: 0;
        left: 22px;
        font-size: 14pt;
        font-weight: bold;
        color: #333;
        display: none;
        height: auto;
        background: #fff;
        z-index: 100;
        -webkit-box-shadow: 1px 1px 9px -1px rgba(71, 70, 71, 0.53);
        -moz-box-shadow: 1px 1px 9px -1px rgba(71, 70, 71, 0.53);
        box-shadow: 1px 1px 9px -1px rgba(71, 70, 71, 0.53);

        padding: 30px 24px;
        width: 400px;

        .description {
            margin-top: 20px;
            font-size: 11pt;
            color: #777;
            font-weight: normal;
            line-height: 140%;


        }
    }

    &:hover {
        .menu-title-tip {
            display: block;
        }
    }
}

/* question-box end */
.question-answer-box {
    width: 100%;
    margin: -20px 0 50px 0;

    #guide-description {
        border: solid 1px #dfdfdf;

        .img {
            padding: 20px;
            min-height: 350px;
            line-height: 140%;
        }


    }

    .quide-title-box {
        cursor: pointer;
        width: 100%;
        background: #2D8CFF;
        display: flex;
        height: 60px;

        .quide-title {
            width: 99%;
            font-weight: bold;
            color: #fff;
            font-size: 12pt;
            padding: 0 0 0 20px;
            line-height: 60px;

            &.center {
                text-align: center;
            }
        }

        .guide-icon-box {
            width: 50px;
            text-align: right;
            padding: 16px 0 0 0;

            .guide-icon {
                width: 26px;
                height: 26px;
                line-height: 29px;
                border-radius: 13px;
                background: #fff;
                text-align: center;

                i {
                    color: #2D8CFF;
                }

                #upIcon {
                    display: none;
                }
            }
        }
    }
}
</style>
