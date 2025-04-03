<template>
    <div class="page-container">

        <div :class="'contents '+mobileClass">
            <div class="from-box">

                <div class="stitle" v-if="!mobileView">로그인</div>
                <form novalidate @submit.prevent="validate">
                    <v-text-field
                        v-model="uid"
                        label="아이디(이메일)"
                        required
                        :error-messages="uidErrors"
                        outlined
                    ></v-text-field>

                    <div class="space"></div>

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
                            class="submit-button" style="background:#303E9F;color:#fff;"
                        >
                            로그인
                        </v-btn>
                    </p>

                </form>
            </div>
            <div class="find-box">
                <div class="left">
                    <span @click="goPage('/findId')"> 아이디·비밀번호 찾기</span>
                </div>
                <div class="right">
                    <span @click="goPage('/join')">  회원가입</span>
                </div>
            </div>


            <!--div class="sns-login-box" v-if="snsUseInfo.kacfg=='yes' || snsUseInfo.nvcfg=='yes'">
                <div class="sns-line">
                    <div class="sns-title">SNS 로그인</div>
                </div>
                <div class="icon-button" v-if="snsUseInfo.kacfg=='yes'">
                    <v-btn
                        type="button"
                        class="kakao-sns-button"
                        @click="snsLogin('ka')"
                    >

                        <div class="logo">
                            <img src="../../../assets/img/ka_icon.png"/>
                        </div>
                        <div class="button-text">
                            카카오 아이디로 로그인
                        </div>
                    </v-btn>
                </div>
                <div class="icon-button" v-if="snsUseInfo.nvcfg=='yes'">
                    <v-btn
                        type="button"
                        class="naver-sns-button"
                        @click="snsLogin('nv')"
                    >
                        <div class="logo">
                            <img src="../../../assets/img/naver_icon.png"/>
                        </div>
                        <div class="button-text">
                            네이버 아이디로 로그인
                        </div>
                    </v-btn>
                </div>
            </div-->
        </div>

    </div>
</template>


<script>
	import {mapActions, mapGetters} from "vuex";
	import AUTH from '../../../api/auth'
	import {validationMixin} from 'vuelidate'
	import {required} from 'vuelidate/lib/validators'
	import SITECONFIG from '../../../api/siteConfig';

	import {
		API_URL_MEMBER_LOGIN,
		CONFIG_HEADER_POST
	} from '../../../api/urls';

	export default {
		name: 'Login',
		mixins: [validationMixin],
		validations: {
			uid: {required},
			upass: {required},
		},
		data() {
			return {
				uid: '',
				upass: '',
				mobileView: false,
				mobileClass: '',
				configInterval: null,
				snsUseInfo: {},
			}
		},
		created() {

			let memberInfo = AUTH.getSession(this.$isMobile());

			if (memberInfo.AUTHTOKEN) {
				this.$router.push({path: '/'});
				return;
			}
			if (this.$isMobile()) {
				this.mobileView = true;
				this.mobileClass = 'mobile'
			}
			if (SITECONFIG.memberServer) {

				this.setConfig();
			} else {
				this.configInterval = setInterval(() => {
					if (SITECONFIG.memberServer) {
						this.setConfig();
						clearInterval(this.configInterval);
					}
				}, 200)
			}

		},
		computed: {
			uidErrors() {
				const errors = []
				if (!this.$v.uid.$dirty) return errors
				!this.$v.uid.required && errors.push('아이디를 입력하세요')
				return errors
			},
			upassErrors() {
				const errors = []
				if (!this.$v.upass.$dirty) return errors
				!this.$v.upass.required && errors.push('비밀번호를 입력하세요')
				return errors
			},
		},
		destroyed() {
			if (this.configInterval) {
				clearInterval(this.configInterval);
			}
		},
		methods: {
			...mapActions('member', ["setMember"]),
			setConfig() {
				let config = SITECONFIG.getMemberConfig();
				if (config.sns) {
					this.snsUseInfo = config.sns;
				}

			},
			snsLogin(cmd) {
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
						redirect_uri = protocol + '//' + host + '/api/member/kakaoLogin';
						url = "https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=" + client_id + "&redirect_uri=" + redirect_uri + "&state=" + state;
						break;

					case 'nv':
						client_id = this.snsUseInfo.nvkey;
						redirect_uri = protocol + '//' + host + '/api/member/naverLogin';
						url = "https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=" + client_id + "&redirect_uri=" + redirect_uri + "&state=" + state;
						break;
				}
				window.open(url, 'snsWin', 'width=500,height=500');
			},
			validate() {
				this.$v.$touch()
				if (!this.$v.$anyError) {
					this.formSubmit();
				}

			},
			goPage(url) {
				this.$router.push(url)
			},
			formSubmit() {
				let params = {uid: this.uid, upass: this.upass};
				const frm = new FormData()
				frm.append('uid', this.uid)
				frm.append('upass', this.upass)


				this.$http.post(API_URL_MEMBER_LOGIN, frm, {headers: CONFIG_HEADER_POST}).then(res => {
					console.log(res)
					let result = res.data.result;
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
							let authData = {
								AUTHTOKEN: res.data.AUTHTOKEN,
								name: res.data.userInfo.name,
								uid: res.data.userInfo.uid,
								no: res.data.userInfo.no,
								photo: res.data.userInfo.photo,
								level: res.data.userInfo.level,
								APIKEY:res.data.apikey,
                                mtype:res.data.userInfo.mtype
							}
							AUTH.setSession(this.$isMobile(), authData);
							this.setMember(authData)
							params = {
								message: '로그인 되었습니다',
								doAction: () => {
									this.$router.go(-1);
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
        width: 100%;
        min-height: calc(100vh);
        background: #fff;
        .contents {
            width: 400px;
            margin: auto;
            padding: 120px 0 80px 0;
            .submit-button {
                margin: 50px 0 0 0;
                width: 100%;
                padding: 0;
                background: #303E9F;
                color: #fff;
                border-radius:35px;
                min-height: 70px;
                font-size: 12pt;

            }
            .stitle {
                font-size: 20pt;
                font-weight: bold;
                padding: 0 0 40px 0;
            }
            .space {
                height: 20px;
            }
            .find-box {
                display: flex;
                margin-bottom: 40px;
                color: #303E9F;
                span {
                    cursor: pointer;
                }
                .left {
                    width: 50%;
                }
                .right {
                    width: 50%;
                    text-align: right;
                }
            }
            .sns-login-box {
                margin: 50px 0 50px 0;
                .sns-line {
                    margin-bottom: 50px;
                    border-bottom: solid 1px #333;
                    width: 100%;
                    .sns-title {
                        background: #fff;
                        width: 160px;
                        margin: -13px 0 0 120px;
                        text-align: center;
                        font-weight: bold;
                        color: #000;
                        font-size: 14pt;
                        position: absolute;

                    }

                }
                .icon-button {
                    margin-bottom: 50px;
                    .naver-sns-button {
                        width: 100%;
                        height: 70px;
                        border-radius: 35px;
                        display: flex;
                        background: #1EC800;
                        color: #FFFFFF;
                        font-weight: bold;
                        .logo {
                            width: 50px;
                            img {
                                margin-top: 5px;
                                width: 45px;
                            }

                        }
                        .button-text {
                            width: 300px;
                            font-size: 14pt;
                        }
                    }
                    .kakao-sns-button {
                        width: 100%;
                        height: 70px;
                        border-radius: 35px;
                        display: flex;
                        background: #FEE500;
                        color: #191919;
                        font-weight: bold;
                        .logo {
                            width: 50px;
                            padding-top: 3px;
                        }
                        .button-text {
                            width: 300px;
                            font-size: 14pt;

                        }
                    }
                }
            }
            &.mobile {
                padding: 120px 20px 20px 20px;
                width: auto;
                .stitle {
                    font-size: 20pt;
                    font-weight: bold;
                }
                .space {
                    height: 20px;
                }
                .text-login {
                    text-align: center;
                    margin: 15px 0;
                    color: #3D79FE;
                    font-size: 12px;
                    .text-border {
                        margin: 0 5px;
                        color: #a8a8a8;
                    }
                }

            }

        }

    }


</style>
