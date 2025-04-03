<template>
    <div :class="'page-container '+mobileClass">

        <div class="contents">
            <div class="from-box">
                <div class="left-box">
                    <div class="item-title">비밀번호 변경</div>
                    <div class="round-box">
                        <form novalidate @submit.prevent="validate">
                            <ul class="field-box">
                                <li>
                                    <div class="field-input">
                                        <v-text-field
                                                type="password" v-model="nowpass"
                                                label="현재 비밀번호"
                                                required
                                                :error-messages="nowpassErrors"
                                                @input="$v.nowpass.$touch()"
                                                @blur="$v.nowpass.$touch()"
                                                outlined
                                        ></v-text-field>
                                    </div>
                                </li>
                                <li>
                                    <div class="field-input">
                                        <v-text-field
                                                type="password" v-model="upass"
                                                label="새 비밀번호"
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
                                                label="새 비밀번호 확인"
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
                                    완료
                                </v-btn>
                            </p>

                        </form>
                    </div>
                </div>
                <div class="right-box">
                    <div class="item-title">카테고리</div>
                    <div class="round-box">
                        <ul class="field-icon-box">
                            <li @click="setMyPart('a')">
                                <div :class="'icon-box '+gclass.a">
                                    <img src="../../../../assets/images/ico_f1.png">

                                </div>
                                <div class="text">뉴스/정치</div>
                            </li>
                            <li @click="setMyPart('b')">
                                <div :class="'icon-box '+gclass.b">
                                    <img src="../../../../assets/images/ico_f2.png">

                                </div>
                                <div class="text">뷰티/패션</div>
                            </li>
                            <li @click="setMyPart('c')">
                                <div :class="'icon-box '+gclass.c">
                                    <img src="../../../../assets/images/ico_f3.png">

                                </div>
                                <div class="text">코미디</div>
                            </li>

                        </ul>
                        <ul class="field-icon-box">
                            <li @click="setMyPart('d')">
                                <div :class="'icon-box '+gclass.d">
                                    <img src="../../../../assets/images/ico_f4.png">
                                </div>
                                <div class="text">스포츠</div>
                            </li>
                            <li @click="setMyPart('e')">
                                <div :class="'icon-box '+gclass.e">
                                    <img src="../../../../assets/images/ico_f5.png">
                                </div>
                                <div class="text">음악</div>
                            </li>
                            <li @click="setMyPart('f')">
                                <div :class="'icon-box '+gclass.f">
                                    <img src="../../../../assets/images/ico_f6.png">
                                </div>
                                <div class="text">기술</div>
                            </li>
                        </ul>
                        <ul class="field-icon-box">
                            <li @click="setMyPart('g')">
                                <div :class="'icon-box '+gclass.g">
                                    <img src="../../../../assets/images/ico_f7.png">
                                </div>
                                <div class="text">게임</div>
                            </li>
                            <li @click="setMyPart('h')">
                                <div :class="'icon-box '+gclass.h">
                                    <img src="../../../../assets/images/ico_f8.png">
                                </div>
                                <div class="text">요리/건강</div>
                            </li>
                            <li @click="setMyPart('i')">

                                <div :class="'icon-box '+gclass.i">
                                    <img src="../../../../assets/images/ico_f9.png">
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
                <div class="logout-button-box" v-if="mobileView">
                    <v-btn
                            type="button"
                            class="logout-button"
                            @click="logout()"
                    >
                        로그아웃
                    </v-btn>
                </div>
            </div>
        </div>


    </div>
</template>


<script>
    import AUTH from '../../../../api/auth'
    import {mapActions, mapGetters} from "vuex";
    import {validationMixin} from 'vuelidate'
    import {required, minLength, maxLength} from 'vuelidate/lib/validators'
    import {
        API_URL_MEMBER_PASS_UPDATE
    } from '../../../../api/urls';
    import apiService from '../../../../api/apiService';

    export default {
        name: 'linkMainUserModify',
        mixins: [validationMixin],
        validations: {
            nowpass: {required},
            upass: {required, minLength: minLength(8), maxLength: maxLength(15)},
            reupass: {required},

        },
        computed: {
            ...mapGetters('link', ["getAccountData", "getServerFlag"]),
            upassErrors() {
                const errors = []
                if (!this.$v.upass.$dirty) return errors
                !this.$v.upass.required && errors.push('새 비밀번호를 입력하세요')
                if (!this.$v.upass.minLength || !this.$v.upass.maxLength) {
                    errors.push('새 비밀번호는 8자 이상 15자 이하로 입력하세요')
                }
                if (this.$v.upass.required && this.$v.upass.minLength && this.$v.upass.maxLength) {
                    //let eng = this.upass.search(/[a-z]/ig);
                    let spe = this.upass.search(/[`~!@@#$%^&*|₩₩₩'₩";:₩/?]/gi);
                    if (spe < 0) {
                        errors.push('새 비밀번호는 영문 또는 숫자와 특수문자의 조합만 가능합니다')
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
                !this.$v.reupass.required && errors.push('새 비밀번호 확인을 입력하세요')
                if (this.upass != this.reupass) {
                    errors.push('새 비밀번호와 새 비밀번호 확인이 다릅니다')
                    this.reupassValid = false;
                } else {

                    this.reupassValid = true;
                }
                return errors
            },
            nowpassErrors() {
                const errors = []
                if (!this.$v.nowpass.$dirty) return errors
                !this.$v.nowpass.required && errors.push('현재 비밀번호를 입력하세요')
                return errors
            },

        },
        watch: {
            getServerFlag(val) {

            },
        },
        data() {
            return {
                insertFlag: false,
                nowpass: '',
                upass: '',
                reupass: '',
                upassValid: false,
                reupassValid: false,
                mobileView: false,
                mobileClass: '',
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
            if (this.$isMobile()) {
                this.mobileView = true;
                this.mobileClass = 'mobile'
            }
            if (this.getServerFlag) {
            }

        },
        methods: {
            ...mapActions('link', ["setAccountData"]),
            setData() {

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
            },
            validate() {

                this.$v.$touch()
                if (!this.upassValid || !this.reupassValid) {
                    return;
                }
                if (!this.$v.$anyError) {

                    this.formSubmit();
                }


            },
            formSubmit() {
                if (this.insertFlag) return;
                this.insertFlag = true;

                const frm = new FormData()
                frm.append('nowpass', this.nowpass)
                frm.append('upass', this.upass)
                this.$eventBus.$emit('overlay', 'open');

                apiService.post(API_URL_MEMBER_PASS_UPDATE, frm, (res) => {
                    this.$eventBus.$emit('overlay', 'hide');
                    let msg = (res.msg == 'succ') ? '정보가 변경되었습니다' : '잘못된 현재 비밀번호 입니다';
                    if (res.msg == 'succ') {
                        let memberInfo = AUTH.getSession(this.$isMobile());
                        memberInfo.AUTHTOKEN = res.AUTHTOKEN
                        AUTH.setSession(this.$isMobile(), memberInfo);
                    }

                    this.insertFlag = false;
                    let params = {
                        message: msg,
                    };
                    this.$eventBus.$emit('modalOpen', params);

                })
            },
        },

    }
</script>
<style lang="scss" scoped>
    .page-container {
        width: 100%;
        min-height: calc(100vh);
        .contents {
            width: 100%;
            padding: 0 0 100px 0;
            .from-box {
                width: 880px;
                overflow: hidden;
                display: flex;
                justify-content: space-between;
                .item-title {
                    font-size: 16px;
                    font-weight: 600;
                    color: #333;
                    margin-bottom: 6px;
                    margin-top: 0;

                }
                .round-box {
                    width: 100%;
                    min-height: 300px;
                    background: #fff;
                    box-shadow: 0px 3px 3px #0000000F;
                    border-radius: 24px;
                    padding: 50px 30px 0 30px;
                    height: 534px;
                    .field-icon-box {
                        padding: 0;
                        width: 340px;
                        margin: 0 auto 10px auto;
                        display: flex;
                        justify-content: space-between;
                        li {
                            width: 33.3%;
                            text-align: center;
                            .icon-box {
                                margin: auto;
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
                        padding-top: 5px;
                    }
                    .submit-button {
                        margin-top: 20px;
                        width: 360px;
                        height: 56px;
                        background: var(--unnamed-color-686efb) 0% 0% no-repeat padding-box;
                        background: #686EFB 0% 0% no-repeat padding-box;
                        border-radius: 6px;
                        color: #fff;
                    }
                }

                .left-box {
                    width: 420px;
                    .field-box {
                        padding: 0;
                    }
                }
                .right-box {
                    width: 420px;

                }

            }

        }
        &.mobile {
            .contents {
                width: 100%;
                padding: 0 0 50px 0;
                .from-box {
                    width: 100%;
                    display: block;
                    .item-title {
                        font-size: 16px;
                        font-weight: 600;
                        color: #333;
                        margin-bottom: 10px;
                        margin-top: 40px;


                    }
                    .round-box {
                        width: 100%;
                        min-height: 300px;
                        background: #fff;
                        box-shadow: 0px 3px 3px #0000000F;
                        border-radius: 24px;
                        padding: 50px 30px 0 30px;
                        height: 434px;
                        .submit-button {
                            margin-top: 20px;
                            width: 100%;
                            height: 56px;
                            background: var(--unnamed-color-686efb) 0% 0% no-repeat padding-box;
                            background: #686EFB 0% 0% no-repeat padding-box;
                            border-radius: 6px;
                            color: #fff;
                        }
                    }

                    .left-box {
                        width: 100%;
                        .item-title {
                            margin-top:0;
                        }
                    }
                    .right-box {
                        width: 100%;
                        .round-box {
                            padding: 30px 20px 0 20px;
                            height: 470px;
                            .field-icon-box {
                                padding: 0;
                                width: 100%;
                                margin: 0 auto 10px auto;
                                display: flex;
                                justify-content: space-between;
                                li {
                                    width: 33.3%;
                                    text-align: center;
                                    .icon-box {
                                        margin: auto;
                                        width: 70px;
                                        height: 70px;
                                        background: #DCDCDC;
                                        border-radius: 50%;
                                        text-align: center;
                                        line-height:90px;
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
                                padding-top: 5px;
                            }
                            .submit-button {
                                margin-top: 20px;
                                width: 100%;
                                height: 56px;
                                background: var(--unnamed-color-686efb) 0% 0% no-repeat padding-box;
                                background: #686EFB 0% 0% no-repeat padding-box;
                                border-radius: 6px;
                                color: #fff;
                            }
                        }

                    }
                    .logout-button-box {
                        .logout-button {
                            margin-top: 50px;
                            width: 100%;
                            height: 56px;
                            background:#999999;
                            border-radius: 6px;
                            color: #fff;
                        }
                    }
                }
            }
        }

    }


</style>