<template>
    <div :class="'page-content '+mobileClass">

        <div class="contents">
            <div class="from-box">
                <div class="stitle">Login</div>
                <form novalidate @submit.prevent="validate">
                    <v-text-field
                        v-model="uid"
                        label="사용자 이름"
                        required
                        :error-messages="uidErrors"
                        outlined
                    ></v-text-field>

                    <v-text-field
                        type="password" v-model="upass"
                        label="비밀번호"
                        required
                        :error-messages="upassErrors"
                        outlined
                    ></v-text-field>
                    <p>
                        <v-btn
                            type="submit"
                            class="submit-button" style="background: #686EFB;"
                        >
                            로그인
                        </v-btn>
                    </p>

                </form>
            </div>
            <div class="find-box">
                <div class="left">
                    <span @click="findPwOpen()">비밀번호 찾기</span>
                </div>
                <div class="right">
                    <span @click="$router.push('/link/main/join')">회원가입</span>
                </div>
            </div>
        </div>
        <v-dialog
            v-model="modalShow"
            width="450"

        >
            <modalFindId style="background:#fff;" if="findPWShow" @close="modalShow=false"></modalFindId>
        </v-dialog>
    </div>
</template>


<script>
import {mapActions} from "vuex";
import AUTH from '../../../api/auth'
import {validationMixin} from 'vuelidate'
import {required} from 'vuelidate/lib/validators'
import {
    API_URL_MEMBER_LOGIN,
} from '../../../api/urls';
import apiService from '../../../api/apiService';
import modalFindId from './modalFindId'

export default {
    name: 'linkLogin',
    mixins: [validationMixin],
    validations: {
        uid: {required},
        upass: {required},
    },
    components: {
        modalFindId
    },
    data() {
        return {
            uid: '',
            upass: '',
            mobileView: false,
            mobileClass: '',
            modalShow: false,
            findPWShow: false,

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
    computed: {
        uidErrors() {
            const errors = []
            if (!this.$v.uid.$dirty) return errors
            !this.$v.uid.required && errors.push('사용자이름을 입력하세요')
            return errors
        },
        upassErrors() {
            const errors = []
            if (!this.$v.upass.$dirty) return errors
            !this.$v.upass.required && errors.push('비밀번호를 입력하세요')
            return errors
        },
    },
    methods: {
        ...mapActions('member', ["setMember"]),
        findPwOpen() {
            this.modalShow = true;
            this.findPWShow = true;
        },
        validate() {
            this.$v.$touch()
            if (!this.$v.$anyError) {
                this.formSubmit();
            }

        },
        formSubmit() {

            const frm = new FormData()
            frm.append('uid', this.uid)
            frm.append('upass', this.upass)
            this.$eventBus.$emit('overlay', 'show');

            apiService.post(API_URL_MEMBER_LOGIN, frm, (res) => {
                this.$eventBus.$emit('overlay', 'hide');
                let result = res.result;
                let params = {}
                switch (result) {
                    case 'wrong':
                        params = {
                            message: '잘못된 아이디 또는 비밀번호입니다',
                        };
                        this.$eventBus.$emit('modalOpen', params);
                        break;
                    case 'noauth':
                        params = {
                            message: '미인증된 아이디 입니다',
                        };
                        this.$eventBus.$emit('modalOpen', params);
                        break;
                    case 'succ':
                        if (res.userInfo.mtype == 'indi') {
                            params = {
                                message: '잘못된 아이디 또는 비밀번호입니다',
                            };
                            this.$eventBus.$emit('modalOpen', params);
                        } else {
                            params = {
                                message: '로그인 되었습니다',
                                doAction: () => {
                                    let authData = {
                                        AUTHTOKEN: res.AUTHTOKEN,
                                        name: res.userInfo.name,
                                        uid: res.userInfo.uid,
                                        no: res.userInfo.no,
                                        mtype: res.userInfo.mtype,
                                        APIKEY: res.apikey
                                    }
                                    AUTH.setSession(this.$isMobile(), authData);
                                    this.setMember(authData)
                                    this.$router.push('/link/main/main')
                                }
                            };
                            this.$eventBus.$emit('modalOpen', params);
                        }
                        break;
                }
            })
        },

    },

}
</script>

<style lang="scss" scoped>
.page-content {
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

        .space {
            height: 20px;
        }

        .find-box {
            display: flex;
            color: #000;
            margin-top:40px;
            span {
                cursor: pointer;
            }

            .left {
                width: 50%;
                color:#999;
            }

            .right {
                width: 50%;
                text-align: right;

                span {
                    color: #686EFB;
                    text-decoration: underline;
                }
            }
        }

    }

    &.mobile {
        width: 100%;
        overflow-x: hidden;

        .contents {
            padding: 105px 20px 20px 20px;

            .submit-button {
                width: 100%;

            }
        }
    }

}


</style>