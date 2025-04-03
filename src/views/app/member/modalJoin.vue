<template>
    <div :class="'page-content '+mobileClass">
        <div class="join-mobile-header" v-if="mobileView">
            <div class="back-button" @click="goMobileBack()">
                <i class="fas fa-arrow-left"></i>
            </div>
            <div class="header-title">
                회원가입
            </div>
        </div>
        <div class="contents" v-if="layoutShow.base">
            <div class="stitle">회원가입</div>
            <div class="tip intro-line">회원가입 후 차별화된 서비스를 즐겨보세요.</div>
            <div class="from-box" v-if="contentShow.agree">
                <ul class="agree-box">
                    <li>
                        <div class="agree-title">
                            <div class="icon-box" v-if="!agreeShow.agree" @click="agreeToggle('agree')">
                                <i class="fas fa-check"></i>
                            </div>
                            <div class="icon-box active" v-else-if="agreeShow.agree" @click="agreeToggle('agree')">
                                <i class="fas fa-check"></i>
                            </div>
                            <div @click="agreeToggle('agree')">이용약관 동의 <span>(필수)</span></div>
                            <i @click="agreeContentToggle('agree')" v-if="!agreeContentShow.agree"
                               class="fas fa-chevron-down  arrow-icon"></i>
                            <i @click="agreeContentToggle('agree')" v-else-if="agreeContentShow.agree"
                               class="fas fa-chevron-up  arrow-icon"></i>
                        </div>
                        <v-expand-transition>
                            <div class="agree-content" v-if="agreeContentShow.agree">
                                <div style="padding:10px;" v-html="agreeInfo.agree"></div>
                            </div>
                        </v-expand-transition>
                    </li>
                    <li>
                        <div class="agree-title">
                            <div class="icon-box" v-if="!agreeShow.privacy" @click="agreeToggle('privacy')">
                                <i class="fas fa-check"></i>
                            </div>
                            <div class="icon-box active" v-else-if="agreeShow.privacy" @click="agreeToggle('privacy')">
                                <i class="fas fa-check"></i>
                            </div>
                            <div @click="agreeToggle('privacy')">개인정보 수집 및 이용 동의 <span>(필수)</span></div>
                            <i @click="agreeContentToggle('privacy')" v-if="!agreeContentShow.privacy"
                               class="fas fa-chevron-down arrow-icon"></i>
                            <i @click="agreeContentToggle('privacy')" v-else-if="agreeContentShow.privacy"
                               class="fas fa-chevron-up  arrow-icon"></i>
                        </div>
                        <v-expand-transition>
                            <div class="agree-content" v-if="agreeContentShow.privacy">
                                <div style="padding:10px;" v-html="agreeInfo.privacy"></div>
                            </div>
                        </v-expand-transition>
                    </li>
                    <li>
                        <div class="agree-title">
                            <div class="icon-box" v-if="!agreeShow.agreeA" @click="agreeToggle('agreeA')">
                                <i class="fas fa-check"></i>
                            </div>
                            <div class="icon-box active" v-else-if="agreeShow.agreeA" @click="agreeToggle('agreeA')">
                                <i class="fas fa-check"></i>
                            </div>
                            <div @click="agreeToggle('agreeA')">개인정보 처리 위탁 동의 <span>(필수)</span></div>
                            <i @click="agreeContentToggle('agreeA')" v-if="!agreeContentShow.agreeA"
                               class="fas fa-chevron-down arrow-icon"></i>
                            <i @click="agreeContentToggle('agreeA')" v-else-if="agreeContentShow.agreeA"
                               class="fas fa-chevron-up  arrow-icon"></i>
                        </div>
                        <v-expand-transition>
                            <div class="agree-content" v-if="agreeContentShow.agreeA">
                                <div style="padding:10px;" v-html="agreeInfo.agreeA"></div>
                            </div>
                        </v-expand-transition>
                    </li>
                    <li>
                        <div class="agree-title">
                            <div class="icon-box" v-if="!agreeShow.agreeB" @click="agreeToggle('agreeB')">
                                <i class="fas fa-check"></i>
                            </div>
                            <div class="icon-box active" v-else-if="agreeShow.agreeB" @click="agreeToggle('agreeB')">
                                <i class="fas fa-check"></i>
                            </div>
                            <div @click="agreeToggle('agreeB')"> 개인정보 제3자 제공 동의 <span style="color:#000">(선택)</span>
                            </div>
                            <i @click="agreeContentToggle('agreeB')" v-if="!agreeContentShow.agreeB"
                               class="fas fa-chevron-down arrow-icon"></i>
                            <i @click="agreeContentToggle('agreeB')" v-else-if="agreeContentShow.agreeB"
                               class="fas fa-chevron-up  arrow-icon"></i>
                        </div>
                        <v-expand-transition>
                            <div class="agree-content" v-if="agreeContentShow.agreeB">
                                <div style="padding:10px;" v-html="agreeInfo.agreeB"></div>
                            </div>
                        </v-expand-transition>
                    </li>
                    <li>
                        <div class="agree-title" @click="agreeToggle('all')">
                            <div class="icon-box" v-if="!agreeShow.all">
                                <i class="fas fa-check"></i>
                            </div>
                            <div class="icon-box active" v-else-if="agreeShow.all">
                                <i class="fas fa-check"></i>
                            </div>
                            모두 동의합니다
                        </div>
                    </li>
                </ul>
                <div class="button-box">
                    <v-btn
                        type="button"
                        class="cancle-button"
                        @click="goBack()"
                    >
                        취소
                    </v-btn>
                    <v-btn
                        type="button"
                        class="sub-button"
                        @click="goNext('mtype')"
                    >
                        동의
                    </v-btn>
                </div>
            </div>
            <div class="from-box" v-else-if="contentShow.mtype">
                <ul class="double-box">
                    <li :class="mytpes.indi" @click="checkMtype('indi')">
                        일반회원 가입
                    </li>
                    <li :class="mytpes.shop" @click="checkMtype('shop')">
                        BJ로 가입하기
                    </li>
                </ul>
                <v-btn
                    type="button"
                    class="submit-button"
                    @click="goNext('join')"
                >
                    회원가입
                </v-btn>
                <div class="sns-join-box">
                    <!-- div class="sns-line">
                        <div class="sns-title">간편 회원가입</div>
                    </div>
                    <div class="icon-button">
                        <v-btn
                            type="button"
                            class="naver-sns-button"
                            @click="snsJoin('nv')"
                        >
                            <div class="logo">
                                <img src="../../../assets/images/ico_sns1.png"/>
                            </div>
                            <div class="button-text">
                                네이버로 회원가입
                            </div>
                        </v-btn>
                    </div>
                    <div class="icon-button">
                        <v-btn
                            type="button"
                            class="kakao-sns-button"
                            @click="snsJoin('ka')"
                        >

                            <div class="logo">
                                <img src="../../../assets/images/ico_sns2.png"/>
                            </div>
                            <div class="button-text">
                                카카오로 회원가입
                            </div>
                        </v-btn>
                    </div  -->

                </div>

            </div>

            <div class="from-box" v-else-if="contentShow.join">
                <form novalidate @submit.prevent="validate">
                    <div v-if="snsJoinMove || this.linktreeUid">
                        <ul class="double-box" v-if="snsJoinMove">
                            <li :class="mytpes.indi" @click="checkMtype('indi')">
                                일반회원 가입
                            </li>
                            <li :class="mytpes.shop" @click="checkMtype('shop')">
                                BJ로 가입하기
                            </li>
                        </ul>
                        <ul class="field-box" style="margin-top:50px">
                            <li>
                                <div class="field-input">
                                    <v-text-field
                                        v-model="unick"
                                        label="닉네임"
                                        required
                                        @input="$v.unick.$touch()"
                                        @blur="$v.unick.$touch()"
                                        :error-messages="unickErrors"
                                        outlined
                                    ></v-text-field>
                                    <div v-if="unickResultClass" :class="'uidResultClass '+unickResultClass">
                                        {{ unickResultMessage }}
                                    </div>
                                </div>
                            </li>

                        </ul>
                    </div>
                    <ul class="field-box" v-else>
                        <li>
                            <div class="field-input">
                                <v-text-field
                                    v-model="uid"
                                    label="아이디"
                                    required
                                    :error-messages="uidErrors"
                                    @input="$v.uid.$touch()"
                                    @blur="$v.uid.$touch()"
                                    outlined
                                ></v-text-field>
                                <div v-if="uidResultClass" :class="'uidResultClass '+uidResultClass">
                                    {{ uidResultMessage }}
                                </div>
                            </div>
                        </li>
                        <li>
                            <div class="field-input">

                                <v-text-field
                                    v-model="unick"
                                    label="닉네임"
                                    required
                                    @input="$v.unick.$touch()"
                                    @blur="$v.unick.$touch()"
                                    :error-messages="unickErrors"
                                    outlined
                                ></v-text-field>
                                <div v-if="unickResultClass" :class="'uidResultClass '+unickResultClass">
                                    {{ unickResultMessage }}
                                </div>
                            </div>
                        </li>

                        <li>
                            <div class="field-input">
                                <v-text-field
                                    type="password" v-model="upass"
                                    label="비밀번호"
                                    required
                                    :error-messages="upassErrors"
                                    @input="$v.upass.$touch()"
                                    @blur="$v.upass.$touch()"
                                    outlined
                                ></v-text-field>
                            </div>
                        </li>
                        <li>
                            <div class="field-input">

                                <v-text-field
                                    type="password" v-model="reupass"
                                    label="비밀번호 확인"
                                    required
                                    @input="$v.reupass.$touch()"
                                    @blur="$v.reupass.$touch()"
                                    :error-messages="reupassErrors"
                                    outlined
                                ></v-text-field>
                            </div>
                        </li>

                    </ul>

                    <div class="button-box">
                        <v-btn
                            type="button"
                            class="cancle-button"
                            @click="goBack()"
                        >
                            취소
                        </v-btn>
                        <v-btn
                            type="submit"
                            class="sub-button"
                        >
                            다음
                        </v-btn>
                    </div>
                </form>
            </div>
        </div>
        <div class="contents" v-if="layoutShow.addInfo">
            <memberAddInfo :mtype="mtype" :snsJoinMove="snsJoinMove" @addinfoResult="setUserJoin" :stepChange="mobileStep" @stepChangeEvent="stepChangeActive"></memberAddInfo>
        </div>
        <div class="contents" v-if="layoutShow.googleAuth">
            <div class="stitle">FMAD</div>
            <div class="tip">인플루언서가 되어보세요</div>
            <div class="from-box" style="border-top:solid 1px #dcdcdc;margin-top:20px;padding-top:30px;">
                <ul class="field-icon-box">
                    <li @click="setMyPart('a')">
                        <div :class="'icon-box '+gclass.a">
                            <img src="../../../assets/images/ico_f1.png">

                        </div>
                        <div class="text">뉴스/정치</div>
                    </li>
                    <li @click="setMyPart('b')">
                        <div :class="'icon-box '+gclass.b">
                            <img src="../../../assets/images/ico_f2.png">

                        </div>
                        <div class="text">뷰티/패션</div>
                    </li>
                    <li @click="setMyPart('c')">
                        <div :class="'icon-box '+gclass.c">
                            <img src="../../../assets/images/ico_f3.png">

                        </div>
                        <div class="text">코미디</div>
                    </li>

                </ul>
                <ul class="field-icon-box">
                    <li @click="setMyPart('d')">
                        <div :class="'icon-box '+gclass.d">
                            <img src="../../../assets/images/ico_f4.png">
                        </div>
                        <div class="text">스포츠</div>
                    </li>
                    <li @click="setMyPart('e')">
                        <div :class="'icon-box '+gclass.e">
                            <img src="../../../assets/images/ico_f5.png">
                        </div>
                        <div class="text">음악</div>
                    </li>
                    <li @click="setMyPart('f')">
                        <div :class="'icon-box '+gclass.f">
                            <img src="../../../assets/images/ico_f6.png">
                        </div>
                        <div class="text">기술</div>
                    </li>
                </ul>
                <ul class="field-icon-box">
                    <li @click="setMyPart('g')">
                        <div :class="'icon-box '+gclass.g">
                            <img src="../../../assets/images/ico_f7.png">
                        </div>
                        <div class="text">게임</div>
                    </li>
                    <li @click="setMyPart('h')">
                        <div :class="'icon-box '+gclass.h">
                            <img src="../../../assets/images/ico_f8.png">
                        </div>
                        <div class="text">요리/건강</div>
                    </li>
                    <li @click="setMyPart('i')">

                        <div :class="'icon-box '+gclass.i">
                            <img src="../../../assets/images/ico_f9.png">
                        </div>
                        <div class="text">영화/엔터테인먼트</div>
                    </li>

                </ul>
                <div v-if="mobileView">
                    <div class="double-button-box">
                        <v-btn
                            @click="googleLogin()"
                            type="button"
                            class="google-button" style="background:#D44330;color:#fff;"
                        >
                            <i class="fab fa-youtube"></i> 유튜브로 인증
                        </v-btn>
                        <v-btn
                            type="button"
                            class="complete-single-button"
                            @click="goComplete()"
                        >
                            가입완료
                        </v-btn>
                    </div>

                </div>
                <div v-else>
                    <p class="google-button-box">
                        <v-btn
                            @click="googleLogin()"
                            type="button"
                            class="google-button" style="background:#D44330;color:#fff;"
                        >
                            <i class="fab fa-youtube"></i> 유튜브로 인증
                        </v-btn>
                    </p>
                    <div class="button-box">
                        <v-btn
                            type="button"
                            class="complete-single-button"
                            @click="goComplete()"
                        >
                            가입완료
                        </v-btn>
                    </div>
                </div>
            </div>
        </div>
        <div class="contents" v-if="layoutShow.complete">
            <div class="stitle">회원가입 완료</div>
            <div class="tip">반갑습니다! 가입을 축하합니다.</div>
            <div class="from-box">
                <div class="complet-img-box">
                    <img src="../../../assets/images/img_wc.png">
                </div>
                <div class="button-box">
                    <v-btn
                        type="button"
                        class="complete-single-button"
                        @click="joinCompleteMove"
                    >
                        가입완료
                    </v-btn>
                </div>
            </div>
        </div>

    </div>
</template>


<script>
import AUTH from '../../../api/auth'
import {mapActions} from "vuex";
import SITECONFIG from '../../../api/siteConfig';
import {validationMixin} from 'vuelidate'
import {required, minLength, maxLength} from 'vuelidate/lib/validators'
import {
    HOST,
    API_URL_MEMBER_UIDCHECK,
    API_URL_MEMBER_JOIN,
    API_URL_MEMBER_UNICKCHECK,
    API_URL_MEMBER_GET_APIKEY,
    API_URL_METABUS_GET_USER_CHARACTER,
    CONFIG_HEADER_POST
} from '../../../api/urls';
import memberAddInfo from './joinComponents/addInfo';

export default {
    name: 'modalJoin',
    mixins: [validationMixin],
    validations: {
        uid: {required, minLength: minLength(4), maxLength: maxLength(10)},
        upass: {required, minLength: minLength(8), maxLength: maxLength(15)},
        reupass: {required},
        unick: {required, minLength: minLength(2), maxLength: maxLength(10)},

    },
    components: {
        memberAddInfo,
    },
    data() {
        return {
            host: HOST,
            agreeTitle: '',
            agreeContent: '',
            agreeInfo: {},
            insertFlag: false,
            uid: '',
            upass: '',
            reupass: '',
            upassValid: false,
            reupassValid: false,
            succUid: false,
            mobileView: false,
            mobileClass: '',
            uidResultClass: '',
            uidResultMessage: '',
            snsUseInfo: {
                kacfg: 'no',
                kakey: '',
                nvcfg: 'no',
                nvkey: '',

            },
            contentShow: {
                agree: true,
                mtype: false,
                join: false,
            },
            agreeShow: {
                agree: false,
                privacy: false,
                agreeA: false,
                agreeB: false,
                all: false,
            },
            agreeContentShow: {
                agree: false,
                privacy: false,
                agreeA: false,
                agreeB: false,
            },
            mytpes: {
                shop: '',
                indi: 'active'
            },
            mtype: 'indi',
            layoutShow: {
                base: true,
                addInfo: false,
                googleAuth: false,
                vileage: false,
                house: false,
                character: false,
                complete: false,

            },
            normalGclass: '',
            infGclass: '',
            unick: '',
            succUnick: false,
            unickResultClass: '',
            unickResultMessage: '',
            gclass: {
                a: '',
                b: '',
                c: '',
                d: '',
                e: '',
                f: '',
                g: '',
                h: '',
                i: '',
            },
            supportMyInfo: false,
            youtubeType: '',
            clientId: '286799290312-ruqaremdjdg4mu219a4g0o0bjefn4iet.apps.googleusercontent.com',
            redirectUrl: '',
            scope: 'https://www.googleapis.com/auth/youtube',
            snsJoinMove: false,
            snsinfoData: {},
            params: {},
            userCharacters: {man: [], woman: []},
            sex: 'man',
            sexClass: {man: 'active', woman: ''},
            userHouse: {shop: [], indi: []},
            home: '',
            userWorld: {shop: [], indi: []},
            world: '',
            linktreeUid: '',
            mobileStep:1,
            stepChange:1,
        }
    },
    created() {
        if (this.$isMobile()) {
            this.setClass('none')
            this.setTitle('회원가입');
            this.setBackUrl('');
            this.mobileView = true;
            this.mobileClass = 'mobile'
        }
        let protocol = window.location.protocol;
        let host = window.location.host;
        this.redirectUrl = protocol + '//' + host + '/api/googleApi/redirect';

        let memberInfo = AUTH.getSession(this.$isMobile());
        if (memberInfo.AUTHTOKEN) {
            if (memberInfo.mtype != 'temp') {
                this.$emit('loginBoxMove', 'hide');
                return;
            }
        }
        this.setConfig();
        if (sessionStorage.getItem('snsJoinMove') == 'yes') {
            sessionStorage.setItem('snsJoinMove', '');
            this.snsinfoData = JSON.parse(sessionStorage.getItem('snsJoinInfo'));
            this.snsJoinMove = true;
        }

        this.$eventBus.$on('googleJoinComplete', this.goComplete);
        this.$eventBus.$on('snsJoinDriect', this.setSnsJoinDriect);
        this.getMetaBusUserData();

    },
    computed: {
        uidErrors() {
            const errors = []
            if (!this.$v.uid.$dirty) return errors
            !this.$v.uid.required && errors.push('아이디를 입력하세요')
            let pattern = /^[A-Za-z0-9+]*$/;
            if (!this.$v.uid.minLength || !this.$v.uid.maxLength) {
                errors.push('아이디는 4자 이상 10자 이하로 입력하세요')
                this.succUid = false;
            } else {
                if (!pattern.test(this.uid)) {
                    errors.push('아이디는 영문 또는 숫자만 사용가능합니다')
                    this.succUid = false;
                }
            }
            let denyUidList = {
                videoView: true,
                main: true,
                hostLive: true,
                userLiveIntro: true,
                userLive: true,
                admin: true,
                live: true,
                board: true,
                world: true,
                link: true,
            };
            if (denyUidList[this.uid]) {
                errors.push('사용할수 없는 아이디 입니다')
                this.succUid = false;
                this.uidResultClass = '';
                return errors
            }
            if (this.$v.uid.required && this.$v.uid.minLength && this.$v.uid.maxLength && pattern.test(this.uid)) {
                const frm = new FormData()
                frm.append('uid', this.uid)
                this.$http.post(API_URL_MEMBER_UIDCHECK, frm, {headers: CONFIG_HEADER_POST}).then(res => {
                    let result = res.data.result;
                    let params = {}
                    if (result == "succ") {
                        this.succUid = true;
                        this.uidResultClass = 'succ'
                        this.uidResultMessage = '사용가능한 아이디 입니다';
                    } else {
                        this.succUid = false;
                        this.uidResultClass = 'double'
                        this.uidResultMessage = '중복된 아이디 입니다';
                    }
                }).catch((error)=> {
                    console.log(error)
                });

            } else {
                this.succUid = false;
                this.uidResultClass = '';

            }

            return errors
        },
        unickErrors() {
            const errors = []
            if (!this.$v.unick.$dirty) return errors
            if (!this.$v.unick.required) {

                errors.push('닉네임을 입력하세요')
                this.unickResultClass = '';
                this.unickResultMessage = '';
                return errors;
            }
            if (!this.$v.unick.minLength || !this.$v.unick.maxLength) {
                errors.push('닉네임은 2자 이상 10자 이하로 입력하세요')
                this.succUnick = false;
                this.unickResultClass = '';
                return errors;
            }
            if (this.$v.unick.required && this.$v.unick.minLength && this.$v.unick.maxLength) {

                const frm = new FormData()
                frm.append('unick', this.unick)
                this.$http.post(API_URL_MEMBER_UNICKCHECK, frm, {headers: CONFIG_HEADER_POST}).then(res => {
                    let result = res.data.result;
                    if (this.$v.unick.required && this.$v.unick.minLength && this.$v.unick.maxLength) {
                        if (result == "succ") {
                            this.succUnick = true;
                            this.unickResultClass = 'succ'
                            this.unickResultMessage = '사용가능한 닉네임 입니다';
                        } else {
                            this.succUnick = false;
                            this.unickResultClass = 'double'
                            this.unickResultMessage = '중복된 닉네임 입니다';
                        }
                    }
                });
            }


            return errors
        },
        upassErrors() {
            const errors = []
            if (!this.$v.upass.$dirty) return errors
            !this.$v.upass.required && errors.push('비밀번호를 입력하세요')
            if (!this.$v.upass.minLength || !this.$v.upass.maxLength) {
                errors.push('비밀번호는 8자 이상 15자 이하로 입력하세요')
                this.upassValid = false;

            }
            if (this.$v.upass.required && this.$v.upass.minLength && this.$v.upass.maxLength) {
                //let eng = this.upass.search(/[a-z]/ig);
                let spe = this.upass.search(/[`~!@@#$%^&*|₩₩₩'₩";:₩/?]/gi);
                if (spe < 0) {
                    errors.push('비밀번호는 영문 또는 숫자와 특수문자의 조합만 가능합니다')
                    this.upassValid = false;
                } else {
                    this.upassValid = true;
                }

            }

            return errors
        },
        reupassErrors() {
            const errors = []
            if (!this.$v.reupass.$dirty) return errors
            !this.$v.reupass.required && errors.push('비밀번호 확인을 입력하세요')
            if (this.upass != this.reupass) {
                errors.push('비밀번호와 비밀번호 확인이 다릅니다')
                this.reupassValid = false;
            } else {

                this.reupassValid = true;
            }
            return errors
        },
        nameErrors() {
            const errors = []
            if (!this.$v.name.$dirty) return errors
            !this.$v.name.required && errors.push('이름 입력하세요')
            return errors
        },


    },
    methods: {
        ...mapActions('mobile', ["setClass", "setTitle", "setBackUrl"]),
        ...mapActions('member', ["setMember"]),
        stepChangeActive(step) {
            this.stepChange=step;
            this.mobileStep =step;
        },
        goMobileBack() {
            if(this.contentShow.agree) {
                this.$router.go(-1);
            } else if(this.contentShow.mtype) {
                this.contentShow.agree = true;
                this.contentShow.mtype = false;
            } else if(this.contentShow.join) {
                if(this.layoutShow.complete || this.layoutShow.googleAuth) {
                    this.$router.push('/');
                    return;
                }
                if(this.layoutShow.base || this.layoutShow.addInfo) {
                    if(this.layoutShow.base) {
                        this.contentShow.mtype = true;
                        this.contentShow.join = false;
                    } else {
                        if (this.stepChange == 1) {
                            this.layoutShow.base = true;
                            this.layoutShow.addInfo = false;
                        } else {
                            this.stepChange--;
                            this.mobileStep = this.stepChange;
                        }
                    }
                } else {
                    if(this.layoutShow.vileage) {
                        this.layoutShow.vileage = false;
                        this.layoutShow.addInfo = true;
                    } else if(this.layoutShow.house) {
                        this.layoutShow.house = false;
                        this.layoutShow.vileage = true;
                    } else if(this.layoutShow.character) {
                        this.layoutShow.character = false;
                        this.layoutShow.house = true;
                    }

                }


            }
            //mtype: ((step == 'mtype') ? true : false),
            //join: ((step == 'join') ? true : false),
        },
        goBack() {
            if(this.$isMobile()) {
                this.goMobileBack()
            } else {
                this.$emit('loginBoxMove', 'hide');
            }
        },
        joinCompleteMove() {
            location.href='/';
            /*
            if(this.$isMobile()) {
                this.$router.push('/');
            } else {
                this.$emit('loginBoxMove', 'hide');
                this.$router.push('/');
            }

             */

        },
        getMetaBusUserData() {
            const frm = new FormData()
            frm.append('chk', 'chk');
            this.userCharacters = {man: [], woman: []};
            this.userHouse = {shop: [], indi: []};
            this.home = '';
            this.userWorld = {shop: [], indi: []};
            this.world = '';
            this.$http.post(API_URL_METABUS_GET_USER_CHARACTER, frm, {headers: CONFIG_HEADER_POST}).then(res => {
                if (res.data.datas.character) {
                    if (res.data.datas.character.man) {
                        for (let item of res.data.datas.character.man) {
                            item.gclass = '';
                            this.userCharacters['man'].push(item);
                        }
                    }
                    if (res.data.datas.character.woman) {
                        for (let item of res.data.datas.character.woman) {
                            item.gclass = '';
                            this.userCharacters['woman'].push(item);
                        }
                    }
                }
                if (res.data.datas.home) {
                    if (res.data.datas.home.normal) {
                        for (let item of res.data.datas.home.normal) {
                            item.gclass = '';
                            this.userHouse['indi'].push(item);
                        }
                    }
                    if (res.data.datas.home.inf) {
                        for (let item of res.data.datas.home.inf) {
                            item.gclass = '';
                            this.userHouse['shop'].push(item);
                        }
                    }
                }
                if (res.data.datas.world) {
                    if (res.data.datas.world.starcity) {
                        for (let item of res.data.datas.world.starcity) {
                            item.gclass = '';
                            this.userWorld['shop'].push(item);
                        }
                    }
                    if (res.data.datas.world.village) {
                        for (let item of res.data.datas.world.village) {
                            item.gclass = '';
                            this.userWorld['indi'].push(item);
                        }
                    }
                }


            });
        },
        nextHouse() {
            if (!this.world) {
                let params = {
                    message: '마을을 선택해 주세요',
                };
                this.$eventBus.$emit('modalOpen', params);
                return;
            }
            this.layoutShow = {
                base: false,
                addInfo: false,
                vileage: false,
                house: true,
                googleAuth: false,
                complete: false,
                character: false,
            };
        },
        choiceWorld(code) {
            for (let item of this.userWorld[this.mtype]) {
                if (item.gcode == code) {
                    item.gclass = 'active';
                    this.world = code;
                } else {
                    item.gclass = '';
                }
            }

        },
        choiceHouse(code) {
            for (let item of this.userHouse[this.mtype]) {
                if (item.gcode == code) {
                    item.gclass = 'active';
                    this.home = code;
                } else {
                    item.gclass = '';
                }
            }

        },
        nextCharacter() {
            if (!this.home) {
                let params = {
                    message: '집을 선택해 주세요',
                };
                this.$eventBus.$emit('modalOpen', params);
                return;
            }
            this.layoutShow = {
                base: false,
                addInfo: false,
                vileage: false,
                house: false,
                googleAuth: false,
                complete: false,
                character: true,
            };
        },
        setSex(sex) {
            this.sex = sex;
            for (let key in this.sexClass) {
                if (key == sex) this.sexClass[key] = 'active';
                else this.sexClass[key] = '';
            }
            let idx = 0;
            for (let item of this.userCharacters[this.sex]) {
                item.gclass = ''
                this.$set(this.userCharacters[this.sex], idx, item)
                idx++;
            }
            this.character = '';

        },
        choiceCharacter(code) {
            let idx = 0;
            for (let item of this.userCharacters[this.sex]) {
                if (code == item.gcode) {
                    this.character = code;
                    item.gclass = 'active'
                } else item.gclass = ''
                this.$set(this.userCharacters[this.sex], idx, item)
                idx++;
            }

        },
        characterSubmit() {
            if (!this.character) {
                let params = {
                    message: '캐릭터를 선택해 주세요',
                };
                this.$eventBus.$emit('modalOpen', params);
                return;
            }
            this.doSetUserJoin();


        },
        setSnsJoinDriect(data) {
            sessionStorage.setItem('snsJoinInfo', JSON.stringify(data));
            this.snsinfoData = data;
            this.snsJoinMove = true;
            this.contentShow = {
                agree: false,
                mtype: false,
                join: true,
            }
        },
        checkMtype(cmd) {
            this.mtype = cmd;
            for (let key in this.mytpes) {
                this.mytpes[key] = '';
            }
            this.mytpes[cmd] = 'active';
            if (cmd == 'shop') {
                this.normalGclass = '';
                this.infGclass = 'active';
            } else {
                this.normalGclass = 'active';
                this.infGclass = '';
            }
        },
        goNext(step) {

            if (step == 'mtype') {
                let flag = true;
                this.supportMyInfo = false;
                for (let agr in this.agreeShow) {
                    if (agr == 'all' || agr == 'agreeB') {
                        if (agr == 'agreeB' && this.agreeShow[agr]) {
                            this.supportMyInfo = true;
                        }
                        continue;
                    }
                    if (!this.agreeShow[agr]) flag = false;

                }
                if (!flag) {
                    let params = {
                        message: '필수약관에 동의해 주세요',
                    };
                    this.$eventBus.$emit('modalOpen', params);
                    return;
                }
            }
            if (this.snsJoinMove) {
                this.contentShow = {
                    agree: false,
                    mtype: false,
                    join: true,
                }
            } else {
                if (sessionStorage.getItem('linktreeUid')) this.linktreeUid = sessionStorage.getItem('linktreeUid');
                if (this.linktreeUid) {
                    this.mtype = 'shop';
                    this.contentShow = {
                        agree: false,
                        mtype: false,
                        join: true,
                    }
                } else {
                    this.contentShow = {
                        agree: false,
                        mtype: ((step == 'mtype') ? true : false),
                        join: ((step == 'join') ? true : false),
                    }
                }
            }
        },
        agreeToggle(cmd) {
            if (this.agreeShow[cmd]) this.agreeShow[cmd] = false;
            else this.agreeShow[cmd] = true;
            if (cmd == 'all') {
                for (let agr in this.agreeShow) {
                    if (agr == 'all') continue;
                    if (this.agreeShow[cmd]) {
                        this.agreeShow[agr] = true;
                    } else {
                        this.agreeShow[agr] = false;
                    }
                }
            }

        },
        agreeContentToggle(cmd) {
            for (let agr in this.agreeContentShow) {
                if (agr == cmd) {
                    if (this.agreeContentShow[cmd]) this.agreeContentShow[cmd] = false;
                    else this.agreeContentShow[cmd] = true;
                } else {
                    this.agreeContentShow[agr] = false;
                }
            }

        },
        setConfig() {
            let config = SITECONFIG.getMemberConfig();
            if (config.sns) {
                this.snsUseInfo = config.sns;
            }
            if (config.agree) {
                this.agreeInfo['agree'] = config.agree
            }
            if (config.privacy) {
                this.agreeInfo['privacy'] = config.privacy
            }
            if (config.agra) {
                this.agreeInfo['agreeA'] = config.agra
            }
            if (config.agrb) {
                this.agreeInfo['agreeB'] = config.agrb
            }

        },
        snsJoin(cmd) {
            let protocol = window.location.protocol;
            let host = window.location.host;

            let date = new Date();
            let state = date.getTime();
            let url = '';
            let client_id = '';
            let redirect_uri = '';
            switch (cmd) {
                case 'ka':
                    client_id = this.snsUseInfo.kakey;
                    redirect_uri = protocol + '//' + host + '/api/member/kakaoJoin';
                    url = "https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=" + client_id + "&redirect_uri=" + redirect_uri + "&state=" + state;

                    break;

                case 'nv':
                    client_id = this.snsUseInfo.nvkey;
                    redirect_uri = protocol + '//' + host + '/api/member/naverJoin';
                    url = "https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=" + client_id + "&redirect_uri=" + redirect_uri + "&state=" + state;
                    break;
            }
            window.open(url, 'snsWin', 'width=500,height=500');
        },
        validate() {
            if (this.snsJoinMove || this.linktreeUid) {
                this.$v.$touch()
                if (!this.succUnick || !this.unick) {
                    return;
                }
                this.layoutShow = {
                    base: false,
                    addInfo: true,
                    vileage: false,
                    house: false,
                    googleAuth: false,
                    complete: false,
                    character: false,
                };
            } else {

                this.$v.$touch()
                if (!this.upassValid || !this.reupassValid || !this.succUid || !this.succUnick) {
                    return;
                }
                if (!this.$v.$anyError) {
                    this.layoutShow = {
                        base: false,
                        addInfo: true,
                        googleAuth: false,
                        vileage: false,
                        house: false,
                        complete: false,
                        character: false,
                    };
                }
            }


        },
        setMyPart(type) {
            this.youtubeType = type;
            for (let key in this.gclass) {
                if (key == type) {
                    this.gclass[key] = 'active';
                } else this.gclass[key] = '';
            }

        },
        setUserJoin(params) {
            this.params = params;

            this.layoutShow = {
                base: false,
                addInfo: false,
                googleAuth: false,
                complete: false,
                vileage: false,
                house: false,
                character: false,
            };
            this.doSetUserJoin();
        },
        doSetUserJoin() {
            let params = this.params;
            const frm = new FormData()
            if (this.snsJoinMove) {

                frm.append('uid', this.snsinfoData.uid)
                frm.append('upass', this.snsinfoData.uid)
                frm.append('sns', this.snsinfoData.sns)
            } else if (this.linktreeUid) {
                frm.append('linktreeUid', this.linktreeUid)

            } else {
                frm.append('uid', this.uid)
                frm.append('upass', this.upass)
            }
            frm.append('unick', this.unick)
            frm.append('mtype', this.mtype)
            frm.append('name', params.name)
            frm.append('pcs', params.pcs)
            if (!this.linktreeUid) {
                frm.append('email', params.email)
                frm.append('emailSend', params.emailSend)
            }
            frm.append('birth', params.birth)
            frm.append('smsSend', params.smsSend)
            frm.append('home', this.home)
            frm.append('gworld', this.world)

            let supportMyInfo = (this.supportMyInfo) ? 'yes' : 'no';
            frm.append('supportMyInfo', supportMyInfo);
            let extraData = {
                myType: params.myType,
                myBjList: params.myBjList,
            }
            frm.append('gcharacter', this.character)
            frm.append('extraData', JSON.stringify(extraData))

            this.$eventBus.$emit('overlay', 'open');
            this.$http.post(API_URL_MEMBER_JOIN, frm, {headers: CONFIG_HEADER_POST}).then(res => {
                console.log(res)
                this.$eventBus.$emit('overlay', 'hide');
                sessionStorage.setItem('linktreeUid', '');
                let result = res.data.result;
                let params = {}
                this.insertFlag = false;
                switch (result) {
                    case 'fail':
                        params = {
                            message: '시스템 에러',
                        };
                        this.$eventBus.$emit('modalOpen', params);
                        break;

                    case 'doubleId':
                        params = {
                            message: '중복된 아이디 입니다',
                        };
                        this.$eventBus.$emit('modalOpen', params);
                        break;
                    case 'doubleEmail':
                        params = {
                            message: '중복된 이메일 입니다',
                        };
                        this.$eventBus.$emit('modalOpen', params);
                        break;
                    case 'succ':

                        let authData = {
                            AUTHTOKEN: res.data.AUTHTOKEN,
                            name: res.data.userInfo.name,
                            uid: res.data.userInfo.uid,
                            no: res.data.userInfo.no,
                            level: res.data.userInfo.level,
                            APIKEY: res.data.apikey,
                            email: res.data.userInfo.email,
                            mtype: res.data.userInfo.mtype
                        }
                        this.setMember(authData)
                        AUTH.setSession(this.$isMobile(), authData);

                        if (this.mtype == 'indi') {
                            this.layoutShow = {
                                base: false,
                                addInfo: false,
                                vileage: false,
                                house: false,
                                googleAuth: false,
                                character: false,
                                complete: true,
                            };
                        } else {
                            this.layoutShow = {
                                base: false,
                                addInfo: false,
                                vileage: false,
                                house: false,
                                googleAuth: true,
                                character: false,
                                complete: false,
                            };
                        }
                        break;
                }
            }).catch((error) => {
                if (error.response) {
                    // 요청이 이루어졌으며 서버가 2xx의 범위를 벗어나는 상태 코드로 응답했습니다.
                    console.log(error.response.data);
                    console.log(error.response.status);
                    console.log(error.response.headers);
                } else if (error.request) {
                    // 요청이 이루어 졌으나 응답을 받지 못했습니다.
                    // `error.request`는 브라우저의 XMLHttpRequest 인스턴스 또는
                    // Node.js의 http.ClientRequest 인스턴스입니다.
                    console.log(error.request);
                } else {
                    // 오류를 발생시킨 요청을 설정하는 중에 문제가 발생했습니다.
                    console.log('Error', error.message);
                }
                console.log(error.config);
            });

        },
        googleLogin() {
            if (!this.youtubeType) {
                let params = {
                    message: '먼저 방송분야를 선택하세요',
                };
                this.$eventBus.$emit('modalOpen', params);
                return;
            }
            let uid = this.uid + '|@|temp|@|' + this.youtubeType;
            window.open('https://accounts.google.com/o/oauth2/v2/auth?client_id=' + this.clientId + '&redirect_uri=' + this.redirectUrl + '&state=' + uid + '&access_type=offline&approval_prompt=force&response_type=code&scope=' + this.scope, 'loginWin', 'top=30,left=100,width=400,height=500');


        },
        goComplete() {
            this.doGoComplete();
        },
        doGoComplete() {
            this.layoutShow = {
                base: false,
                addInfo: false,
                vileage: false,
                house: false,
                googleAuth: false,
                complete: true,
                character: false,
            };

        }

    },
    beforeDestroy() {
        this.$eventBus.$off('googleJoinComplete');
        this.$eventBus.$off('snsJoinDriect');
    }

}
</script>
<style lang="scss" scoped>
.page-content {
    width: 100%;
    background: #fff;
    overflow: hidden;

    .contents {
        width: 360px;
        margin: auto;
        padding: 20px 0 0 0;

        .from-box {
            background: #fff;
        }

        .button-box {
            width: 450px;
            display: flex;
            margin-top: 50px;
            margin-left: -45px;

            .cancle-button {
                width: 50%;
                color: #fff;
                height: 65px;
                border-radius: 0;
                background: #999999;
            }

            .sub-button {
                width: 50%;
                color: #fff;
                height: 65px;
                border-radius: 0;
                background: #686EFB;
            }

            .complete-single-button {
                width: 100%;
                color: #fff;
                height: 65px;
                border-radius: 0;
                background: #686EFB;
            }
        }

        .google-button-box {
            width: 200px;
            margin: 30px auto;

            .google-button {
                width: 100%;
                height: 50px;
                border-radius: 0;

                i {
                    margin-right: 10px;
                    font-size: 13pt;
                }

            }

        }

        .submit-button {
            margin: 40px 0 0 0;
            width: 100%;
            border-radius: 0;
            padding: 0;
            background: #686EFB;
            color: #fff;
            min-height: 65px;
            font-size: 12pt;

        }

        .stitle {
            font-size: 18pt;
            font-weight: bold;
            text-align: center;
            padding-bottom: 5px;
        }

        .tip {
            font-size: 10pt;
            text-align: center;
            padding-bottom: 10px;
        }

        .sub-title {
            font-size: 16pt;
            font-weight: bold;
            padding: 20px 0 15px 0;
        }

        .space {
            height: 20px;
        }

        .uidResultClass {
            margin: -25px 0 10px 0;
            font-size: 9pt;

            &.succ {
                color: #303E9F;
            }

            &.double {
                color: #f00;
            }
        }

        .field-box {
            padding: 0;
            margin: 0;

            li {
                display: flex;

                .required-icon {
                    min-width: 30px;
                    font-size: 12pt;
                    color: #E91E63;
                    margin-top: 16px;
                }

                .field-input {
                    width: 100%;

                }
            }
        }

        .agree-box {
            padding: 0;
            margin: 0;
            width: 100%;

            li {
                position: relative;

                .agree-title {
                    padding: 13px 10px 10px 10px;
                    display: flex;
                    cursor: pointer;
                    border-bottom: solid 1px #dcdcdc;
                    font-size: 11pt;

                    .icon-box {
                        width: 30px;
                        height: 30px;
                        border: solid 1px #DCDCDC;
                        color: #DCDCDC;
                        text-align: center;
                        border-radius: 50%;
                        line-height: 30px;
                        margin-right: 10px;
                        margin-top: -3px;

                        &.active {
                            border: solid 1px #686EFB;
                            background: #686EFB;
                            color: #fff;
                        }
                    }

                    span {
                    }

                    .arrow-icon {
                        position: absolute;
                        right: 10px;
                        top: 20px;
                        color: #dcdcdc;
                        font-size: 12pt;

                        &.fa-chevron-up {
                            top: 15px;
                        }
                    }
                }

                .agree-content {
                    border: solid 1px #dcdcdc;
                    border-top: none;
                    max-height: 80px;
                    overflow-y: auto;
                    font-size: 10pt;
                    background: #F9F9F9;
                }
            }
        }

        .double-box {
            padding: 0;
            margin: 20px 0 0 0;
            display: flex;

            li {
                width: 50%;
                border: solid 1px #dcdcdc;
                color: #999;
                text-align: center;
                height: 50px;
                line-height: 50px;
                cursor: pointer;

                &.active {
                    background: #686EFB;
                    color: #fff;
                }

                &:first-child {
                    border-right: none;

                }
            }
        }

        .sns-join-box {
            padding: 50px 0 30px 0;

            .sns-line {
                margin-bottom: 50px;
                border-bottom: solid 1px #dcdcdc;
                width: 100%;

                .sns-title {
                    background: #fff;
                    width: 130px;
                    margin: -13px 0 0 120px;
                    text-align: center;
                    color: #000;
                    font-size: 12pt;
                    position: absolute;

                }

            }

            .icon-button {
                margin-bottom: 16px;

                .naver-sns-button {
                    width: 100%;
                    height: 60px;
                    border-radius: 0;
                    display: flex;
                    background: #1EC800;
                    color: #FFFFFF;
                    font-weight: bold;

                    .logo {
                        width: 50px;

                        img {
                            margin-top: 5px;
                            width: 20px;
                        }

                    }

                    .button-text {
                        font-size: 12pt;
                    }
                }

                .kakao-sns-button {
                    width: 100%;
                    height: 60px;
                    border-radius: 0;
                    display: flex;
                    background: #FEE500;
                    color: #191919;
                    font-weight: bold;

                    .logo {
                        width: 50px;
                        padding-top: 3px;

                        img {
                            width: 20px;
                        }
                    }

                    .button-text {
                        font-size: 12pt;

                    }
                }
            }
        }

        .field-icon-box {
            padding: 0;
            width: 340px;
            margin: 0 auto 10px auto;
            display: flex;
            justify-content: space-between;

            li {
                width: 100px;
                text-align: center;

                .icon-box {
                    width: 80px;
                    height: 80px;
                    margin: auto;
                    background: #DCDCDC;
                    border-radius: 50%;
                    text-align: center;
                    line-height: 105px;
                    cursor: pointer;

                    img {
                    }

                    &.active {
                        background: #686EFB;
                    }
                }

                .text {
                    font-size: 9pt;
                    margin-top: 5px;
                }

            }
        }

        .complet-img-box {
            text-align: center;
            padding-top: 40px;
        }


    }

}

.sex-box {
    display: flex;
    padding: 15px 0;
    justify-content: space-between;
    border-top: solid 1px #dcdcdc;
    border-bottom: solid 1px #dcdcdc;

    li {
        &.gtitle {
            padding-left: 10px;
            font-size: 12pt;
            color: #000;
            padding-top: 12px;
            font-weight: bold;
        }

        &.blank {
            width: 40%;
        }

        &.sex {
            width: 50px;
            height: 50px;
            line-height: 50px;
            border-radius: 50%;
            border: solid 1px #dcdcdc;
            font-size: 10pt;
            text-align: center;
            margin-right: 10px;
            color: #999;
            cursor: pointer;
        }

        &.active {
            background: #686EFB;
            color: #fff;
        }
    }
}

.tip-box {
    margin-top: 17px;
    border-top: solid 1px #dcdcdc;
    padding-top: 20px;
    text-align: center;
    font-size: 10pt;
    color: #000;

}

.swiper-content {
    position: relative;
    height: 340px;
    display: flex;
    justify-content: space-between;

    .swiper-box {
        width: 30%;

        .inner-item {
            text-align: center;
            cursor: pointer;

            .img-box {
                text-align: center;

                img {
                    width: 100%;
                    border: solid 2px #fff;
                }

            }

            .choice-icon {
                width: 30px;
                height: 30px;
                color: #999;
                margin: 7px auto 0 auto;
                line-height: 34px;
                border: solid 1px #999;
                border-radius: 50%;

            }

            &.active {
                .img-box {
                    img {
                        border: solid 2px #686EFB;
                    }
                }

                .choice-icon {
                    background: #686EFB;
                    color: #fff;
                }

            }
        }

    }

    &.vileage {
        display: block;
        margin-top: 18px;
        border-top: solid 1px #dcdcdc;
        padding-top: 30px;
        height: 350px;
        overflow-y: auto;
        overflow-x: hidden;

        .swiper-box {
            width: 100%;
            margin-bottom: 40px;

            .inner-item {
                .img-box {
                    text-align: center;

                    img {
                        width: 100%;
                        border: solid 2px #fff;

                    }
                }

                .name-box {
                    display: flex;
                    text-align: left;
                    margin-top: 7px;

                    .choice-icon {
                        width: 30px;
                        height: 30px;
                        color: #999;
                        line-height: 34px;
                        border: solid 1px #999;
                        border-radius: 50%;
                        text-align: center;

                    }

                    span {
                        width: 85%;
                        text-align: left;
                        padding-top: 10px;
                        color: #000;
                    }
                }

                &.active {
                    .img-box {
                        img {
                            border: solid 2px #686EFB;
                        }
                    }

                    .choice-icon {
                        background: #686EFB;
                        color: #fff;
                    }

                }
            }
        }
    }

    &.house {
        display: block;
        margin-top: 18px;
        border-top: solid 1px #dcdcdc;
        padding-top: 30px;
        height: 430px;
        overflow-y: auto;
        overflow-x: hidden;

        .swiper-box {
            width: 100%;
            margin-bottom: 40px;

            .inner-item {
                .img-box {
                    text-align: center;

                    img {
                        width: 100%;
                        border: solid 2px #fff;

                    }
                }

                .name-box {
                    display: flex;
                    text-align: left;
                    margin-top: 7px;

                    .choice-icon {
                        width: 30px;
                        height: 30px;
                        color: #999;
                        line-height: 34px;
                        border: solid 1px #999;
                        border-radius: 50%;
                        text-align: center;

                    }

                    span {
                        width: 85%;
                        text-align: left;
                        padding-top: 10px;
                        color: #000;
                    }
                }

                &.active {
                    .img-box {
                        img {
                            border: solid 2px #686EFB;
                        }
                    }

                    .choice-icon {
                        background: #686EFB;
                        color: #fff;
                    }

                }
            }
        }
    }

    .button-next {
        position: absolute;
        top: 120px;
        right: -25px;
        z-index: 20;
        color: #686EFB;
        font-size: 20pt;
    }

    .button-prev {
        position: absolute;
        left: -25px;
        top: 120px;
        z-index: 20;
        color: #686EFB;
        font-size: 20pt;
    }

}

.mobile {
    width: 100%;
    background: #fff;
    overflow: hidden;

    .contents {
        width: 100%;
        margin: auto;
        padding: 40px 15px 0 15px;

        .from-box {
            background: #fff;
        }

        .button-box {
            width: 100%;
            display: flex;
            margin-top: 50px;
            margin-left: 0;

            .cancle-button {
                height: 50px;

            }

            .sub-button {
                height: 50px;

            }

            .complete-single-button {
                width: 100%;
                color: #fff;
                height: 50px;
                border-radius: 0;
                background: #686EFB;
            }
        }
        .double-button-box {
            margin-top:20px;
            .google-button {
                width: 50%;
                height: 50px;
                border-radius: 0;

                i {
                    margin-right: 10px;
                    font-size: 13pt;
                }

            }

            .complete-single-button {
                width: 50%;
                color: #fff;
                height: 50px;
                border-radius: 0;
                background: #686EFB;
            }
        }
        .submit-button {
            margin: 40px 0 0 0;
            width: 100%;
            border-radius: 0;
            padding: 0;
            background: #686EFB;
            color: #fff;
            min-height: 57px;
            font-size: 12pt;

        }

        .stitle {
            font-size: 14pt;
            font-weight: bold;
            text-align: center;
            padding-bottom: 10px;
        }

        .tip {
            font-size: 8pt;
            text-align: center;
            padding-bottom: 10px;
            color: #999;

            &.intro-line {
                padding-bottom: 30px;
                border-bottom: solid 1px #dcdcdc;
            }
        }

        .sub-title {
            font-size: 16pt;
            font-weight: bold;
            padding: 20px 0 15px 0;
        }

        .space {
            height: 20px;
        }

        .uidResultClass {
            margin: -25px 0 10px 0;
            font-size: 9pt;

            &.succ {
                color: #303E9F;
            }

            &.double {
                color: #f00;
            }
        }

        .field-box {
            padding: 0;
            margin: 0;

            li {
                display: flex;

                .required-icon {
                    min-width: 30px;
                    font-size: 12pt;
                    color: #E91E63;
                    margin-top: 16px;
                }

                .field-input {
                    width: 100%;

                }
            }
        }

        .agree-box {
            padding: 0;
            margin: 0;
            width: 100%;

            li {
                position: relative;

                .agree-title {
                    padding: 13px 10px 10px 10px;
                    display: flex;
                    cursor: pointer;
                    border-bottom: solid 1px #dcdcdc;
                    font-size: 11pt;

                    .icon-box {
                        width: 30px;
                        height: 30px;
                        border: solid 1px #DCDCDC;
                        color: #DCDCDC;
                        text-align: center;
                        border-radius: 50%;
                        line-height: 30px;
                        margin-right: 10px;
                        margin-top: -3px;

                        &.active {
                            border: solid 1px #686EFB;
                            background: #686EFB;
                            color: #fff;
                        }
                    }

                    span {
                    }

                    .arrow-icon {
                        position: absolute;
                        right: 10px;
                        top: 20px;
                        color: #dcdcdc;
                        font-size: 12pt;

                        &.fa-chevron-up {
                            top: 15px;
                        }
                    }
                }

                .agree-content {
                    border: solid 1px #dcdcdc;
                    border-top: none;
                    max-height: 80px;
                    overflow-y: auto;
                    font-size: 10pt;
                    background: #F9F9F9;
                }
            }
        }

        .double-box {
            padding: 0;
            margin: 20px 0 0 0;
            display: flex;

            li {
                width: 50%;
                border: solid 1px #dcdcdc;
                color: #999;
                text-align: center;
                height: 50px;
                line-height: 50px;
                cursor: pointer;

                &.active {
                    background: #686EFB;
                    color: #fff;
                }

                &:first-child {
                    border-right: none;

                }
            }
        }

        .sns-join-box {
            padding: 50px 0 30px 0;

            .sns-line {
                margin-bottom: 50px;
                border-bottom: solid 1px #dcdcdc;
                width: 100%;

                .sns-title {
                    background: #fff;
                    width: 130px;
                    margin: -13px 0 0 120px;
                    text-align: center;
                    color: #000;
                    font-size: 12pt;
                    position: absolute;

                }

            }

            .icon-button {
                margin-bottom: 16px;

                .naver-sns-button {
                    width: 100%;
                    height: 50px;
                    border-radius: 0;
                    display: flex;
                    background: #1EC800;
                    color: #FFFFFF;
                    font-weight: bold;

                    .logo {
                        width: 50px;

                        img {
                            margin-top: 5px;
                            width: 20px;
                        }

                    }

                    .button-text {
                        font-size: 12pt;
                    }
                }

                .kakao-sns-button {
                    width: 100%;
                    height: 50px;
                    border-radius: 0;
                    display: flex;
                    background: #FEE500;
                    color: #191919;
                    font-weight: bold;

                    .logo {
                        width: 50px;
                        padding-top: 3px;

                        img {
                            width: 20px;
                        }
                    }

                    .button-text {
                        font-size: 12pt;

                    }
                }
            }
        }

        .field-icon-box {
            padding: 0;
            width: 340px;
            margin: 0 auto 10px auto;
            display: flex;
            justify-content: space-between;

            li {
                width: 100px;
                text-align: center;

                .icon-box {
                    width: 80px;
                    height: 80px;
                    margin: auto;
                    background: #DCDCDC;
                    border-radius: 50%;
                    text-align: center;
                    line-height: 105px;
                    cursor: pointer;

                    img {
                    }

                    &.active {
                        background: #686EFB;
                    }
                }

                .text {
                    font-size: 9pt;
                    margin-top: 5px;
                }

            }
        }

        .complet-img-box {
            text-align: center;
            padding-top: 40px;
        }

    }

    .sex-box {
        display: flex;
        padding: 15px 0;
        justify-content: space-between;
        border-top: solid 1px #dcdcdc;
        border-bottom: solid 1px #dcdcdc;

        li {
            &.gtitle {
                padding-left: 10px;
                font-size: 11pt;
                color: #000;
                padding-top: 7px;
                font-weight: bold;
                line-height: 110%;
            }

            &.blank {
                width: 40%;
            }

            &.sex {
                width: 50px;
                height: 50px;
                line-height: 50px;
                border-radius: 50%;
                border: solid 1px #dcdcdc;
                font-size: 10pt;
                text-align: center;
                margin-right: 10px;
                color: #999;
                cursor: pointer;
            }

            &.active {
                background: #686EFB;
                color: #fff;
            }
        }
    }

    .tip-box {
        margin-top: 17px;
        border-top: solid 1px #dcdcdc;
        padding-top: 20px;
        text-align: center;
        font-size: 10pt;
        color: #000;

    }

    .swiper-content {
        position: relative;
        height: 280px;
        display: flex;
        justify-content: space-between;

        .swiper-box {
            width: 30%;

            .inner-item {
                text-align: center;
                cursor: pointer;

                .img-box {
                    text-align: center;

                    img {
                        width: 100%;
                        border: solid 2px #fff;
                    }

                }

                .choice-icon {
                    width: 30px;
                    height: 30px;
                    color: #999;
                    margin: 7px auto 0 auto;
                    line-height: 34px;
                    border: solid 1px #999;
                    border-radius: 50%;

                }

                &.active {
                    .img-box {
                        img {
                            border: solid 2px #686EFB;
                        }
                    }

                    .choice-icon {
                        background: #686EFB;
                        color: #fff;
                    }

                }
            }

        }

        &.vileage {
            display: block;
            margin-top: 18px;
            border-top: solid 1px #dcdcdc;
            padding-top: 30px;
            height: 350px;
            overflow-y: auto;
            overflow-x: hidden;

            .swiper-box {
                width: 100%;
                margin-bottom: 40px;

                .inner-item {
                    .img-box {
                        text-align: center;

                        img {
                            width: 100%;
                            border: solid 2px #fff;

                        }
                    }

                    .name-box {
                        display: flex;
                        text-align: left;
                        margin-top: 7px;

                        .choice-icon {
                            width: 30px;
                            height: 30px;
                            color: #999;
                            line-height: 34px;
                            border: solid 1px #999;
                            border-radius: 50%;
                            text-align: center;

                        }

                        span {
                            width: 85%;
                            text-align: left;
                            padding-top: 10px;
                            color: #000;
                        }
                    }

                    &.active {
                        .img-box {
                            img {
                                border: solid 2px #686EFB;
                            }
                        }

                        .choice-icon {
                            background: #686EFB;
                            color: #fff;
                        }

                    }
                }
            }
        }

        &.house {
            display: block;
            margin-top: 10px;
            border-top: solid 1px #dcdcdc;
            padding-top: 10px;
            height: 350px;
            overflow-y: auto;
            overflow-x: hidden;

            .swiper-box {
                width: 100%;
                margin-bottom: 20px;

                .inner-item {
                    .img-box {
                        text-align: center;

                        img {
                            width: 100%;
                            border: solid 2px #fff;

                        }
                    }

                    .name-box {
                        display: flex;
                        text-align: left;
                        margin-top: 0;

                        .choice-icon {
                            width: 30px;
                            height: 30px;
                            color: #999;
                            line-height: 34px;
                            border: solid 1px #999;
                            border-radius: 50%;
                            text-align: center;

                        }

                        span {
                            width: 85%;
                            text-align: left;
                            padding-top: 10px;
                            color: #000;
                        }
                    }

                    &.active {
                        .img-box {
                            img {
                                border: solid 2px #686EFB;
                            }
                        }

                        .choice-icon {
                            background: #686EFB;
                            color: #fff;
                        }

                    }
                }
            }
        }


    }
    .join-mobile-header {
        width: 100%;
        position: fixed;
        background: #141A2C;
        z-index: 90;
        top: 0;
        left: 0;
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
