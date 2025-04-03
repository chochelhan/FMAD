<template>
    <div :class="'page-content '+mobileClass">
        <div class="header">
            <div class="logo">
                <img src="../../../assets/linksvg/logo.png">
                AI.LINK
            </div>
            <ul class="login-box">
                <li @click="goPage('login')">로그인</li>
                <li @click="goPage('join')">회원가입</li>
            </ul>
        </div>
        <div class="contents top-content">
            <ul>
                <li>
                    <div class="ctitle">
                        챗봇, 쇼핑몰<br>링크트리 기능을<br v-if="mobileView"> 하나로!
                    </div>
                    <div class="tip">
                        INSTALINK에서 셀럽에게 꼭 필요한 기능을<br v-if="mobileView"> 엄선하여<br v-if="!mobileView">서비스로 제공합니다.
                    </div>
                    <div class="round-box" v-if="!mobileView">
                        <ul class="link-ul">
                            <li class="lbox">
                                <img src="../../../assets/linksvg/img_sim.svg">
                            </li>
                            <li class="field">
                                Instaliink.ai/<input type="text" v-model="uid" placeholder="your id here">

                            </li>
                            <li class="button-box">
                                <v-btn class="join-button"  v-if="uid" @click="goJoin()">
                                    <i class="fas fa-arrow-right"></i>
                                </v-btn>

                            </li>
                        </ul>
                    </div>

                </li>
                <li>
                    <img src="../../../assets/linksvg/img_mb.svg">

                    <div class="round-box" v-if="mobileView">
                        <ul class="link-ul">
                            <li class="lbox">
                                <img src="../../../assets/linksvg/img_sim.svg">
                            </li>
                            <li class="field">
                                Instaliink.ai/<input type="text" v-model="uid" placeholder="your id here">

                            </li>
                            <li class="button-box">
                                <v-btn class="join-button"  v-if="uid" @click="goJoin()">
                                    <i class="fas fa-arrow-right"></i>
                                </v-btn>

                            </li>
                        </ul>
                    </div>
                </li>
            </ul>
        </div>
        <div class="contents box-content">
            <div class="big-title">
                셀럽들에게 꼭 필요한 기능을<br>INSTALINK에서 제공합니다.
            </div>
            <ul class="three-box">
                <li>
                    <div class="img-box"><img src="../../../assets/linksvg/img_fun1.svg"></div>
                    <div class="info-box">
                        <div class="subject">
                            Chatbot
                        </div>
                        <div class="msg">
                            반복적인 질문은<br>챗봇이 24시간 응답
                        </div>
                    </div>
                </li>
                <li>
                    <div class="img-box"><img src="../../../assets/linksvg/img_fun2.svg"></div>
                    <div class="info-box">
                        <div class="subject">
                            Shopping Mall
                        </div>
                        <div class="msg">
                            공동구매를 진행하는 상품도<br>간단하게 등록 후 판매까지
                        </div>
                    </div>
                </li>
                <li>
                    <div class="img-box"><img src="../../../assets/linksvg/img_fun3.svg"></div>
                    <div class="info-box">
                        <div class="subject">
                            LINK BUTTON
                        </div>
                        <div class="msg">
                            관리하는 페이지가 많다면<br>간편하게 연결
                        </div>
                    </div>
                </li>
            </ul>
        </div>
        <div class="contents bg-content">
            <div class="big-title" v-if="!mobileView">
                공동구매 가능한 쇼핑몰도 받으시고,<br> 정산도 쉽게 받아보세요!
            </div>
            <div class="big-title" v-else>
                공동구매 가능한 쇼핑몰도 받고,<br> 정산도 쉽게 받아보세요!
            </div>
            <ul class="three-box">
                <li>
                    <div class="img-box"><img src="../../../assets/linksvg/img_mall1.svg"></div>
                    <div class="info-box">
                        <div class="subject">
                            PG 결제
                        </div>
                        <div class="msg">
                            본인PG 및<br> 본인 입금계좌로 결제
                        </div>
                    </div>
                </li>
                <li>
                    <div class="img-box"><img src="../../../assets/linksvg/img_mall2.svg"></div>
                    <div class="info-box">
                        <div class="subject">
                            수수료
                        </div>
                        <div class="msg">
                            판매되는 상품에 대해<br> 건당 수수료 부과 (3%)
                        </div>
                    </div>
                </li>
                <li>
                    <div class="img-box"><img src="../../../assets/linksvg/img_mall3.svg"></div>
                    <div class="info-box">
                        <div class="subject">
                            쿠폰관리
                        </div>
                        <div class="msg">
                            할인쿠폰도 내 마음대로<br> 발급 가능!
                        </div>
                    </div>
                </li>
            </ul>
        </div>
        <div class="contents four-content">
            <div class="left-box">
                <div class="big-title">
                    반복적인 업무에 지치셨죠?<br> 이제 챗봇에게 맡기세요.
                </div>
                <div class="tip">
                    챗봇을 통해 고객을 24시간 만족시키고<br v-if="mobileView"> 반복적인 질문을 해결함으로써<br> 시간을 절약할 수 있습니다.
                </div>
                <v-btn  v-if="!mobileView" class="chat-button" rounded>챗봇 만들기</v-btn>
            </div>
            <div class="right-box">
                <ul>
                    <li>
                        <div class="img-box"><img src="../../../assets/linksvg/img_chat1.svg"></div>
                        <div class="info-box">
                            <div class="subject">
                                24시간 응답
                            </div>
                            <div class="msg">
                                챗봇은 24시간 대기중! 언제든 상담 가능
                            </div>
                        </div>
                    </li>
                    <li>
                        <div class="img-box"><img src="../../../assets/linksvg/img_chat2.svg"></div>
                        <div class="info-box">
                            <div class="subject">
                                간단한 학습
                            </div>
                            <div class="msg">
                                질문/답변만 넣으시면 바로 답변 가능
                            </div>
                        </div>
                    </li>

                </ul>
            </div>
        </div>
        <div class="contents last-content">
            <div class="big-title" >
                INSTALINK<br v-if="mobileView"> 추천은 이런분들께!
            </div>
            <swiper :options="swiperOption" class="swiper-box-layout" v-if="mobileView">
                <swiper-slide class="swiper-box">
                    <div class="img-box"><img src="../../../assets/linksvg/img_sub1.svg"></div>
                    <div class="subject">
                        <div class="qut">“</div>
                        현재 관리하고 계신<br> SNS가 많으신 분
                        <div class="qut">“</div>
                    </div>
                </swiper-slide>
                <swiper-slide class="swiper-box">
                    <div class="img-box"><img src="../../../assets/linksvg/img_sub2.svg"></div>
                    <div class="subject">
                        <div class="qut">“</div>
                        너무 많은 질문을<br> 감당하기 어려운 분
                        <div class="qut">“</div>
                    </div>
                </swiper-slide>
                <swiper-slide class="swiper-box">
                    <div class="img-box"><img src="../../../assets/linksvg/img_sub3.svg"></div>
                    <div class="subject">
                        <div class="qut">“</div>
                        공동 구매를 자주<br> 진행하거나<br> 정산이 늦어 고민이신 분
                        <div class="qut">“</div>
                    </div>
                </swiper-slide>
            </swiper>
            <ul class="three-box" v-else>
                <li>
                    <div class="img-box"><img src="../../../assets/linksvg/img_sub1.svg"></div>
                    <div class="subject">
                        <div class="qut">“</div>
                        현재 관리하고 계신<br> SNS가 많으신 분
                        <div class="qut">“</div>
                    </div>
                </li>
                <li>
                    <div class="img-box"><img src="../../../assets/linksvg/img_sub2.svg"></div>
                    <div class="subject">
                        <div class="qut">“</div>
                        너무 많은 질문을<br> 감당하기 어려운 분
                        <div class="qut">“</div>
                    </div>
                </li>
                <li>
                    <div class="img-box"><img src="../../../assets/linksvg/img_sub3.svg"></div>
                    <div class="subject">
                        <div class="qut">“</div>
                        공동 구매를 자주<br> 진행하거나<br> 정산이 늦어 고민이신 분
                        <div class="qut">“</div>
                    </div>
                </li>
            </ul>
        </div>
        <div class="footer">
            <div class="footer-top">
                <div class="logo"  v-if="!mobileView">
                    <img src="../../../assets/linksvg/logo_bot_w.png">
                    AI.LINK
                </div>
                <ul class="login-box">
                    <li>이용약관</li>
                    <li class="dot">|</li>
                    <li>개인정보처리방침</li>
                    <li class="dot">|</li>
                    <li>고객센터</li>
                </ul>
                <div class="logo" v-if="mobileView">
                    <img src="../../../assets/linksvg/logo_bot_w.png">
                    AI.LINK
                </div>
            </div>
            <div class="footer-bottom">
                <ul class="info-box">
                    <li>상호:(주)페르소나에이아이 | 대표:유승재</li>
                    <li>서울특별시 서초구 강남대로 코리아비즈니스센터 718,719호 | 사업자번호:696-86-00654</li>
                    <li>TEL:02-762-8713 | MAIL:admin@bottalks.co.kr</li>
                </ul>
                <div class="copy">
                    Copyright @ PERSONA .AI All Rights Reserved.
                </div>
            </div>
        </div>
    </div>
</template>


<script>
import {mapActions} from "vuex";
import AUTH from '../../../api/auth'

export default {
    name: 'linkIntro',
    data() {
        return {
            mobileView: false,
            mobileClass: '',
            swiperOption: {
                slidesPerView:'auto',
                spaceBetween: 20,
                loop: false,
            },
            uid:'',
        }
    },
    created() {
        let memberInfo = AUTH.getSession(this.$isMobile());
        if (memberInfo.AUTHTOKEN) {
            if (memberInfo.mtype == 'indi') {
                this.$router.push({path: '/'});
            } else {
                this.$router.push({path: '/link/main/main/link'});
            }
            return;
        }
        if (this.$isMobile()) {
            this.mobileView = true;
            this.mobileClass = 'mobile'
        }


    },
    methods: {
        goPage(cmd) {
            this.$router.push('/link/main/' + cmd)
        },
        goJoin() {
            sessionStorage.setItem('uid',this.uid)
            this.$router.push('/link/main/join')
        }

    }

}
</script>

<style lang="scss" scoped>
.page-content {
    width: 100%;
    padding: 0;

    .header {
        padding: 20px 30px;
        display: flex;
        justify-content: space-between;

        .logo {
            img {
                width: 30px;
            }

            font-weight: bold;
            font-size: 32px;
            color: #000;
        }

        .login-box {
            display: flex;
            justify-content: flex-end;
            padding: 0;

            li {
                cursor: pointer;
                margin-left: 40px;
                font-size: 18px;
                color: #333333;
                font-weight: 600;
            }
        }
    }

    .contents {
        width: 1200px;
        padding: 0;
        margin: auto;

        &.top-content {
            padding: 100px 0;

            ul {
                padding: 0;
                display: flex;
                justify-content: space-between;

                li {
                    width: 620px;

                    &:last-child {
                        width: 540px;
                    }

                    img {
                        max-width: 100%;
                        width: 100%;
                    }

                    .ctitle {
                        font-size: 58px;
                        color: #000;
                        line-height: 150%;
                    }

                    .tip {
                        font-size: 18px;
                        color: #000;
                        line-height: 150%;
                        padding: 30px 0 40px 0;
                    }

                    .round-box {
                        width: 579px;
                        height: 80px;
                        border-radius: 40px;
                        border: 1px solid #DCDCDC;
                        line-height: 80px;

                        .link-ul {
                            width:100%;
                            display: flex;
                            padding: 0 0 0 40px;

                            .lbox {
                                min-width:45px;
                                width:45px;
                                padding-top: 9px;

                                img {
                                    width: 29px;
                                }
                            }

                            .field {
                                width: 90%;
                                text-align: left;
                                font-size: 23px;
                                color: #000;

                                span {
                                    color: #999;
                                }
                                input {
                                    border:none;
                                    &:focus {
                                        outline: none;
                                    }
                                }

                            }
                            .button-box {
                                width:60px;
                                margin:-2px 10px 0 0;
                                .join-button {
                                    width:50px;
                                    min-width:50px;
                                    height:50px;
                                    background: #455281;
                                    border-radius: 50%;
                                    color: #fff;
                                }

                            }

                        }
                    }
                }
            }
        }

        .big-title {
            color: #000;
            text-align: center;
            font-size: 36px;
            font-weight: bold;
            padding-bottom: 100px;
        }

        .three-box {
            width: 1200px;
            padding: 0;
            margin: auto;
            display: flex;
            justify-content: space-between;

            li {
                width: 33.333%;
                text-align: center;

                .img-box {
                    height: 140px;
                }

                .subject {
                    font-size: 24px;
                    font-weight: bold;
                    color: #000;
                    padding: 0 0 10px 0;
                }

                .msg {
                    font-size: 16px;
                    color: #999999;
                }
            }
        }

        &.box-content {
            padding: 70px 0 0 0;
        }

        &.bg-content {
            padding-top: 450px;
            width: calc(100vw);
            background: url('../../../assets/linksvg/img_mallbg.png') no-repeat;
            background-size: cover;
            height: 1100px;

            .big-title {
                color: #455281;
            }

            .three-box {
                li {
                    .img-box {
                        height: 160px;
                    }

                    .subject {
                        color: #455281;

                    }

                    .msg {
                        color: #455281;
                    }
                }
            }
        }

        &.four-content {
            padding: 150px 0;
            display: flex;
            justify-content: flex-start;

            .left-box {
                width: 790px;

                .big-title {
                    text-align: left;
                    font-size: 56px;
                    padding-bottom: 30px;
                }

                .tip {
                    font-size: 14px;
                    color: #999999;
                    line-height: 180%;
                    padding: 0;
                }

                .chat-button {
                    width: 260px;
                    height: 56px;
                    background: #455281;
                    color: #fff;
                    margin-top: 40px;
                }
            }

            .right-box {
                text-align: left;

                ul {
                    padding: 0;

                    li {
                        padding: 50px 0 20px 0;
                        display: flex;
                        justify-content: flex-start;

                        .img-box {
                            margin-right: 30px;
                        }

                        .info-box {
                            padding-top: 20px;

                            .subject {
                                font-size: 20px;
                                font-weight: bold;
                                color: #455281;
                                padding: 0 0 10px 0;
                            }

                            .msg {
                                font-size: 14px;
                                color: #999999;
                            }
                        }
                    }
                }
            }

        }

        &.last-content {
            background: #F9FBFD;
            width: calc(100vw);
            padding: 160px 0 170px 0;

            .three-box {
                li {
                    width: 330px;
                    text-align: center;
                    height: 450px;
                    background: #fff;

                    .img-box {
                        margin-top: 60px;
                        height: 190px;
                    }

                    .subject {
                        .qut {
                            font-size: 50pt;
                            line-height: 60pt;

                            &:first-child {
                                margin-bottom: -33px;
                            }
                        }

                        font-size: 24px;
                        font-weight: bold;
                        color: #000;
                        padding: 0;
                    }

                    &:last-child {
                        .img-box {
                            height: 170px;
                        }
                    }

                }
            }
        }

    }

    .footer {
        width: 100%;
        padding: 50px 0;
        background: #333333;
        color: #fff;

        .footer-top {
            width: 1200px;
            padding: 0 0 18px 0;
            margin: auto;
            display: flex;
            justify-content: space-between;
            border-bottom: solid 2px #DCDCDC;

            .logo {
                img {
                    width: 50px;
                }

                font-weight: bold;
                font-size: 21px;

            }

            .login-box {
                display: flex;
                justify-content: flex-end;
                padding: 0;

                li {
                    cursor: pointer;
                    margin-left: 10px;
                    font-size: 14px;
                    font-weight: noraml;
                    color: #DCDCDC;
                }
            }
        }

        .footer-bottom {
            width: 1200px;
            padding: 0;
            margin: auto;
            font-size: 14px;

            .info-box {
                padding: 30px 0 40px 0;

                li {

                    padding-bottom: 5px;
                    font-weight: normal;

                }
            }
        }
    }

    &.mobile {
        width: 100%;
        overflow-x: hidden;

        .header {
            padding: 20px 30px;

            .logo {
                img {
                    width: 27px;
                    margin-bottom:-7px;
                }
                font-size: 20px;
            }

            .login-box {
                display: flex;
                justify-content: flex-end;
                padding: 0;

                li {
                    padding-top:7px;
                    margin-left: 40px;
                    font-size: 14px;
                    &:last-child {
                        display: none;
                    }
                }
            }
        }

        .contents {
            width: 100%;
            padding: 0 20px;

            &.top-content {
                padding: 30px 20px;

                ul {
                    padding: 0;
                    display: block;

                    li {
                        width: 100%;

                        &:last-child {
                            width: 100%;
                        }

                        img {
                            max-width: 100%;
                            width: 100%;
                        }

                        .ctitle {
                            font-size: 36px;
                            color: #333333;
                            line-height: 135%;
                        }

                        .tip {
                            font-size: 15px;
                            color: #333333;
                            line-height: 150%;
                            padding: 20px 0 50px 0;
                        }

                        .round-box {
                            margin-top: 30px;
                            width: 100%;
                            height: 54px;
                            border-radius: 27px;
                            border: 1px solid #DCDCDC;
                            line-height: 54px;

                            .link-ul {
                                width:100%;
                                display: flex;
                                padding: 0 0 0 20px;

                                .lbox {
                                    min-width: 29px;
                                    width: 29px;
                                    padding-top: 5px;

                                    img {
                                        width: 20px;
                                    }
                                }

                                .field {
                                    width: 90%;
                                    text-align: left;
                                    font-size: 15px;
                                    color: #000;
                                    display:flex;
                                    input {
                                        width:140px;
                                        height:50px;
                                        &:focus {
                                            outline: none;
                                        }
                                    }

                                }
                                .button-box {
                                    width:34px;
                                    margin:-2px 8px 0 0;
                                    .join-button {
                                        width:34px;
                                        min-width:34px;
                                        height:34px;
                                        background: #455281;
                                        border-radius: 50%;
                                        color: #fff;
                                    }

                                }

                            }
                        }
                    }
                }
            }

            .big-title {
                padding: 0;
                text-align: center;
                font-size: 24px;
                color: #333333;
            }

            .three-box {
                width: 100%;
                padding: 10px 20px;
                margin: 0;
                display: block;

                li {
                    width: 100%;
                    text-align: left;
                    display: flex;
                    padding-top: 30px;

                    .img-box {
                        width: 120px;
                    }

                    .info-box {
                        padding-top: 10px;

                        .subject {
                            font-size: 24px;
                            font-weight: bold;
                            color: #000;
                            padding: 0 0 7px 0;
                        }

                        .msg {
                            font-size: 16px;
                            color: #999999;
                        }
                    }

                    &:last-child {
                        .info-box {
                            padding-top: 0;

                        }
                    }
                }
            }

            &.box-content {
                padding: 70px 0 0 0;
            }

            &.bg-content {
                margin-top: -50px;
                padding-top: 180px;
                width: calc(100vw);
                background: url('../../../assets/linksvg/img_mallbg_m.png') no-repeat;
                background-size: cover;
                height: 900px;

                .big-title {
                    font-size: 24px;
                    color: #455281;
                    padding: 0;
                    width: calc(100vw);
                    margin-left: -20px;
                }

                .three-box {
                    li {
                        .img-box {
                            img {
                                width:93px;
                            }
                        }

                        .subject {
                            color: #455281;

                        }

                        .msg {
                            color: #455281;
                        }
                    }
                }
            }

            &.four-content {
                padding:60px 0;
                display: block;
                .left-box {
                    width:100%;

                    .big-title {
                        text-align:center;
                        font-size: 30px;
                        padding-bottom: 25px;
                        line-height:120%;
                    }

                    .tip {
                        font-size: 14px;
                        color: #999999;
                        line-height: 140%;
                        padding: 0;
                        text-align:center;
                    }

                    .chat-button {
                        width: 260px;
                        height: 56px;
                        background: #455281;
                        color: #fff;
                        margin-top: 40px;
                    }
                }

                .right-box {
                    text-align: center;
                    ul {
                        padding: 0 20px;
                        display: flex;
                        justify-content:space-between;
                        li {
                            padding: 50px 0 20px 0;
                            display:block;
                            .img-box {
                                margin-right:0;
                            }

                            .info-box {
                                padding-top: 20px;
                                .subject {
                                    font-size: 20px;
                                    font-weight: bold;
                                    color: #455281;
                                    padding: 0 0 10px 0;
                                }

                                .msg {
                                    font-size: 14px;
                                    color: #999999;
                                }
                            }
                        }
                    }
                }

            }

            &.last-content {
                background: #F9FBFD;
                width: calc(100vw);
                padding:60px 0 100px 20px;
                .swiper-box-layout {
                    margin-top:30px;
                    .swiper-box {
                        width:270px;
                        text-align: center;
                        height: 330px;
                        background: #fff;
                        .img-box {
                            margin-top: 30px;
                            height: 150px;
                            img {
                                width:120px;
                            }
                        }

                        .subject {
                            .qut {
                                font-size: 30pt;
                                &:first-child {
                                    margin-bottom:-20px;
                                }
                            }

                            font-size: 20px;
                            font-weight: bold;
                            color: #000;
                            padding: 0;
                        }

                        &:last-child {
                            .img-box {
                                height: 120px;
                            }
                        }

                    }
                }
            }

        }

        .footer {
            width: 100%;
            padding:20px;
            background: #333333;
            color: #fff;
            .footer-top {
                width:100%;
                padding: 0 0 18px 0;
                margin: auto;
                display:block;
                border-bottom:none;

                .logo {
                    margin-top:10px;
                    img {
                        width: 50px;
                    }
                    font-weight: bold;
                    font-size: 21px;

                }

                .login-box {
                    display: flex;
                    justify-content:space-between;
                    padding: 0;

                    li {
                        cursor: pointer;
                        margin-left:0;
                    }
                }
            }

            .footer-bottom {
                width:100%;
                padding: 0;
                margin: auto;
                font-size: 14px;
                .info-box {
                    padding:0 0 20px 0;
                    li {
                        font-size: 13px;
                        padding-bottom: 5px;
                        font-weight: normal;

                    }
                }
            }
        }
    }

}


</style>