<template>
    <div :class="'page-container '+mobileClass">
        <div class="contents">
            <div class="from-box" v-if="!baseInfoFlag">

                <div class="stitle">Sign up</div>
                <form novalidate @submit.prevent="validate">
                    <ul class="field-box">
                        <li>
                            <div class="field-input">
                                <v-text-field
                                        v-model="email"
                                        label="이메일"
                                        required
                                        :error-messages="emailErrors"
                                        @input="$v.email.$touch()"
                                        @blur="$v.email.$touch()"
                                        outlined
                                ></v-text-field>
                                <div v-if="emailResultClass" :class="'uidResultClass '+emailResultClass">
                                    {{emailResultMessage}}
                                </div>
                            </div>
                        </li>
                        <li>
                            <div class="field-input">

                                <v-text-field
                                        v-model="uid"
                                        label="사용자 이름"
                                        required
                                        @input="$v.uid.$touch()"
                                        @blur="$v.uid.$touch()"
                                        :error-messages="uidErrors"
                                        outlined
                                        prefix="duckku.com/link/"
                                ></v-text-field>
                                <div v-if="uidResultClass" :class="'uidResultClass '+uidResultClass">
                                    {{uidResultMessage}}
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


                    <p>
                        <v-btn
                                type="submit"
                                class="submit-button"
                        >
                            다음
                        </v-btn>
                    </p>

                </form>
                <div class="login-text" @click="$router.push('/link/main/login')">이미 계정이 있으신가요?</div>
            </div>
            <div class="from-box" v-if="baseInfoFlag">
                <div class="stitle">카테고리</div>
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
                <div class="button-box">
                    <v-btn
                            type="button"
                            class="submit-button"
                            @click="myPartComplete()"
                    >
                        완료
                    </v-btn>
                </div>
            </div>
        </div>
    </div>


    </div>
</template>


<script>

    import AUTH from '../../../api/auth'
    import {validationMixin} from 'vuelidate'
    import {required, minLength, maxLength, email} from 'vuelidate/lib/validators'
    import {
        API_URL_MEMBER_UIDCHECK,
        API_URL_MEMBER_EMAILCHECK,
        API_URL_MEMBER_LINK_JOIN,
        CONFIG_HEADER_POST
    } from '../../../api/urls';
    import apiService from '../../../api/apiService';

    export default {
        name: 'linkJoin',
        mixins: [validationMixin],
        validations: {
            uid: {required, minLength: minLength(4), maxLength: maxLength(10)},
            upass: {required, minLength: minLength(8), maxLength: maxLength(15)},
            reupass: {required},
            email: {required, email},

        },
        data() {
            return {
                insertFlag: false,
                uid: '',
                upass: '',
                reupass: '',
                email: '',
                succEmail: false,
                emailResultClass: '',
                emailResultMessage: '',
                upassValid: false,
                reupassValid: false,
                succUid: false,
                mobileView: false,
                mobileClass: '',
                uidResultClass: '',
                uidResultMessage: '',
                baseInfoFlag: false,
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
                youtubeType: '',

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
            if(sessionStorage.getItem('uid')) {
                this.uid = sessionStorage.getItem('uid')
                sessionStorage.setItem('uid','')
            }

            if (this.$isMobile()) {
                this.mobileView = true;
                this.mobileClass = 'mobile'
            }

        },
        computed: {
            uidErrors() {
                const errors = []
                if (!this.$v.uid.$dirty) return errors
                !this.$v.uid.required && errors.push('사용자이름을 입력하세요')
                let pattern = /^[A-Za-z0-9+]*$/;
                if (!this.$v.uid.minLength || !this.$v.uid.maxLength) {
                    errors.push('사용자이름은 4자 이상 10자 이하로 입력하세요')
                    this.succUid = false;
                } else {
                    if (!pattern.test(this.uid)) {
                        errors.push('사용자이름은 영문 또는 숫자만 사용가능합니다')
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
                    errors.push('사용할수 없는 사용자이름 입니다')
                    this.succUid = false;
                    this.uidResultClass = '';
                    return errors
                }
                if (this.$v.uid.required && this.$v.uid.minLength && this.$v.uid.maxLength && pattern.test(this.uid)) {
                    const frm = new FormData()
                    frm.append('uid', this.uid)
                    this.$http.post(API_URL_MEMBER_UIDCHECK, frm, {headers: CONFIG_HEADER_POST}).then(res => {
                        console.log(res)
                        let result = res.data.result;
                        let params = {}
                        if (result == "succ") {
                            this.succUid = true;
                            this.uidResultClass = 'succ'
                            this.uidResultMessage = '사용가능한 사용자이름 입니다';
                        } else {
                            this.succUid = false;
                            this.uidResultClass = 'double'
                            this.uidResultMessage = '중복된 사용자이름 입니다';
                        }
                    });

                } else {
                    this.succUid = false;
                    this.uidResultClass = '';

                }

                return errors
            },
            emailErrors() {
                const errors = []
                if (!this.$v.email.$dirty) return errors
                if (!this.$v.email.required) {

                    errors.push('이메일을 입력하세요')
                    this.emailResultClass = '';
                    this.emailResultMessage = '';
                    return errors;
                }
                if (!this.$v.email.email) {
                    errors.push('잘못된 형식의 이메일입니다')
                    this.succEmail = false;
                    this.emailResultClass = '';
                    return errors;
                }
                if (this.$v.email.required && this.$v.email.email) {

                    const frm = new FormData()
                    frm.append('email', this.email)
                    this.$http.post(API_URL_MEMBER_EMAILCHECK, frm, {headers: CONFIG_HEADER_POST}).then(res => {
                        let result = res.data.result;
                        if (this.$v.email.required && this.$v.email.email) {
                            if (result == "succ") {
                                this.succEmail = true;
                                this.emailResultClass = 'succ'
                                this.emailResultMessage = '사용가능한 이메일 입니다';
                            } else {
                                this.succEmail = false;
                                this.emailResultClass = 'double'
                                this.emailResultMessage = '중복된 이메일 입니다';
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

        },
        methods: {
            setMyPart(type) {

                this.youtubeType = type;
                for (let key in this.gclass) {
                    if (key == type) {
                        this.gclass[key] = 'active';
                    } else this.gclass[key] = '';
                }


            },
            myPartComplete() {
                if (!this.youtubeType) {
                    let params = {
                        message: '카테고리를 선택해주세요',
                    };
                    this.$eventBus.$emit('modalOpen', params);
                    return;
                }
                this.formSubmit();
            },
            validate() {

                this.$v.$touch()
                if (!this.upassValid || !this.reupassValid || !this.succUid || !this.succEmail) {
                    return;
                }
                if (!this.$v.$anyError) {
                    this.baseInfoFlag = true;

                }


            },
            formSubmit() {
                if (this.insertFlag) return;
                if (!this.succUid) return;
                this.insertFlag = true;


                const frm = new FormData()
                frm.append('uid', this.uid)
                frm.append('upass', this.upass)
                frm.append('email', this.email)
                frm.append('name', this.unick)
                frm.append('yType',this.youtubeType)


                this.$eventBus.$emit('overlay', 'show');

                apiService.post(API_URL_MEMBER_LINK_JOIN, frm, (res) => {
                    this.$eventBus.$emit('overlay', 'hide');

                    let result = res.result;
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
                                message: '중복된 사용자이름 입니다',
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
                                AUTHTOKEN: res.AUTHTOKEN,
                                name: res.userInfo.name,
                                uid: res.userInfo.uid,
                                no: res.userInfo.no,
                                mtype: 'temp',
                                APIKEY: res.apikey

                            }
                            AUTH.setSession(this.$isMobile(), authData);
                            params = {
                                message: '회원가입을 축하합니다',
                                doAction: () => {
                                    this.$router.push('/link/main/main');
                                }
                            };
                            this.$eventBus.$emit('modalOpen', params);
                            break;
                    }
                })
            },
        },

    }
</script>
<style lang="scss" scoped>
    .page-container {
        width: 368px;
        margin: auto;
        .contents {
            width: 100%;
            padding: 171px 0 80px 0;

            .submit-button {
                margin-top: 20px;
                width: 360px;
                height: 56px;
                background: #686EFB 0% 0% no-repeat padding-box;
                border-radius: 6px;
                color: #fff;

            }

            .stitle {
                text-align: center;
                margin-bottom: 44px;
                font: normal normal normal 30px/45px Noto Sans KR;
            }
            .login-text {
                text-align: center;
                text-decoration: underline;
                font: normal normal normal 14px/20px Noto Sans KR;
                letter-spacing: 0px;
                color: #999999;
                margin-top: 39px;
                cursor: pointer;
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
            .field-icon-box {
                padding: 0;
                width: 340px;
                margin: 0 auto 10px auto;
                display: flex;
                justify-content: space-between;
                li {
                    text-align: center;
                    width:33.3%;
                    .icon-box {
                        margin:auto;
                        width: 90px;
                        height: 90px;
                        background: #DCDCDC;
                        border-radius: 50%;
                        text-align: center;
                        line-height: 110px;
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
            .button-box {
                padding-top: 15px;
            }
            .field-box {
                padding: 0;
                margin: 0;
                li {
                    .field-input {
                        width: 100%;

                    }
                }
            }
        }
        &.mobile {
            width: calc(100vw);
            overflow-x: hidden;
            .contents {
                padding: 103px 20px 40px 20px;

                .submit-button {
                    width: 100%;
                }
                .field-icon-box {
                    width: 100%;
                    margin: 0 auto 10px auto;
                    li {

                    }
                }
            }

        }

    }


</style>