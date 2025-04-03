<template>
    <div :class="'page-content '+mobileClass">

        <div class="contents">
            <div class="from-box">
                <div class="stitle">로그인</div>
                <form novalidate @submit.prevent="validate">
                    <v-text-field
                        v-model="uid"
                        label="아이디"
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
                    <div class="find-box">
                        <div class="left">
                            <span @click="goPage('findId')"> 아이디 찾기</span><span class="dot">|</span><span @click="goPage('findPw')">비밀번호 찾기</span>
                        </div>
                    </div>
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
            <!--div class="sns-login-box">
                <div class="icon-button">
                    <v-btn
                        type="button"
                        class="naver-sns-button"
                        @click="snsLogin('nv')"
                    >
                        <div class="logo">
                            <img src="../../../assets/images/ico_sns1.png"/>
                        </div>
                        <div class="button-text">
                            네이버 로그인
                        </div>
                    </v-btn>
                </div>
                <div class="icon-button">
                    <v-btn
                        type="button"
                        class="kakao-sns-button"
                        @click="snsLogin('ka')"
                    >

                        <div class="logo">
                            <img src="../../../assets/images/ico_sns2.png"/>
                        </div>
                        <div class="button-text">
                            카카오 로그인
                        </div>
                    </v-btn>
                </div >

            </div-->
            <div class="find-box">
                <div class="center">
                    아직 회원이 아니신가요? <span @click="goPage('join')">  회원가입 하러가기</span>
                </div>
            </div>

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
		API_URL_MEMBER_GET_APIKEY,
		CONFIG_HEADER_POST
	} from '../../../api/urls';

	export default {
		name: 'modalLogin',
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
            if (this.$isMobile()) {
                this.setClass('close')
                this.setTitle('');
                this.setBackUrl('');
                this.mobileView = true;
                this.mobileClass = 'mobile'
            }
			this.$eventBus.$on('snsJoinMove', this.snsMoveDirectJoin);
			this.$eventBus.$on('snsLoginComplete', this.snsLoginComplete);

			let memberInfo = AUTH.getSession(this.$isMobile());

			if (memberInfo.AUTHTOKEN) {
				this.$emit('loginBoxMove','hide');
				return;
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
            ...mapActions('mobile', ["setClass", "setTitle", "setBackUrl"]),
			...mapActions('member', ["setMember"]),
			setConfig() {
				let config = SITECONFIG.getMemberConfig();
				if (config && config.sns) {
					this.snsUseInfo = config.sns;
              	}

			},
            snsMoveDirectJoin(data) {
	            let params = {
		            message: '회원가입전 입니다 먼저 회원가입 해주세요',
		            doAction: () => {
		            	sessionStorage.setItem('snsJoinMove','yes');
			            sessionStorage.setItem('snsJoinInfo',JSON.stringify(data));
			            this.goPage('join')
		            }
	            };
	            this.$eventBus.$emit('modalOpen', params);

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
			goPage(cmd) {
                if(this.mobileView) {
                    this.$router.push('/main/join')
                } else {
                    this.$emit('loginBoxMove',cmd);
                }


			},
			formSubmit() {
				let params = {uid: this.uid, upass: this.upass};
				const frm = new FormData()
				frm.append('uid', this.uid)
				frm.append('upass', this.upass)


				this.$http.post(API_URL_MEMBER_LOGIN, frm, {headers: CONFIG_HEADER_POST}).then(res => {
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
                            if(res.data.userInfo.mtype == 'temp') {

                               sessionStorage.setItem('linktreeUid',res.data.userInfo.uid)
                               this.$emit('loginBoxMove', 'join');

                            } else {
                                params = {
                                    message: '로그인 되었습니다',
                                    doAction: () => {
                                        let authData = {
                                            AUTHTOKEN: res.data.AUTHTOKEN,
                                            name: res.data.userInfo.name,
                                            uid: res.data.userInfo.uid,
                                            no: res.data.userInfo.no,
                                            level: res.data.userInfo.level,
                                            email: res.data.userInfo.email,
                                            APIKEY: res.data.apikey,
                                            photo: res.data.userInfo.photo,
                                            mtype: res.data.userInfo.mtype
                                        }
                                        AUTH.setSession(this.$isMobile(), authData);
                                        this.setMember(authData)
                                        if(this.mobileView) {
                                             this.$router.go(-1)
                                        } else {
                                            this.$emit('loginBoxMove', 'hide');
                                        }
                                    }
                                };
                                this.$eventBus.$emit('modalOpen', params);
                            }
							break;
					}
				})
			},
			snsLoginComplete(joinCode) {
				const frm = new FormData()
				frm.append('joinCode', joinCode)
				this.$http.post(API_URL_MEMBER_GET_APIKEY, frm, {headers: CONFIG_HEADER_POST}).then(res => {
					if (res.data.result == 'succ') {
						let params = {
							message: '로그인 되었습니다',
							doAction: () => {
								let authData = {
									AUTHTOKEN: res.data.AUTHTOKEN,
									name: res.data.userInfo.name,
									uid: res.data.userInfo.uid,
									no: res.data.userInfo.no,
									level: res.data.userInfo.level,
									email: res.data.userInfo.email,
									APIKEY: res.data.apikey,
									photo: res.data.userInfo.photo,
									mtype: res.data.userInfo.mtype
								}
								this.setMember(authData)
								AUTH.setSession(this.$isMobile(), authData);

								this.$emit('loginBoxMove','hide');
							}
						};
						this.$eventBus.$emit('modalOpen', params);

					}
				});
            }

		},
		beforeDestroy() {
			this.$eventBus.$off('snsJoinMove');
		}

	}
</script>

<style lang="scss" scoped>
    .page-content {
        width: 100%;
        background: #fff;
        .contents {
            width: 360px;
            margin: auto;
            padding: 50px 0;
            .submit-button {
                margin: 30px 0 0 0;
                width: 100%;
                padding: 0;
                color: #fff;
                border-radius:0;
                min-height: 70px;
                font-size: 12pt;

            }
            .stitle {
                font-size: 20pt;
                font-weight: bold;
                text-align:center;
                padding-bottom:30px;
            }
            .space {
                height: 20px;
            }
            .find-box {
                display: flex;
                color: #000;
                span {
                    cursor: pointer;
                }

                .left {
                    width: 70%;
                    .dot {
                        cursor: default;
                        padding:0 10px;
                    }
                }
                .center {
                    width:100%;
                    text-align: center;
                    span {
                        color:#686EFB;
                        text-decoration: underline;
                    }
                }
            }
            .sns-login-box {
                margin: 20px 0;
                display:flex;
                justify-content: space-between;
                max-width:360px;
                overflow:hidden;
                .icon-button {
                    width:47%;
                    margin-bottom: 10px;
                    .naver-sns-button {
                        width: 100%;
                        height: 60px;
                        display: flex;
                        background: #1EC800;
                        color: #FFFFFF;
                        font-weight: bold;
                        border-radius:0;
                        .logo {
                            width: 40px;
                            img {
                                margin-top: 5px;
                                width: 20px;
                            }

                        }
                        .button-text {
                             font-size: 11pt;
                        }
                    }
                    .kakao-sns-button {
                        width: 100%;
                        height: 60px;
                        border-radius:0;
                        display: flex;
                        background: #FEE500;
                        color: #191919;
                        font-weight: bold;
                        .logo {
                            width: 40px;
                            padding-top: 3px;
                            img {
                                width: 20px;
                            }
                        }
                        .button-text {
                            font-size: 11pt;

                        }
                    }
                }
            }


        }
        &.mobile {
            padding:20px;
            .contents {
                width: 100%;
                margin: auto;
                padding:30px 0;
                .submit-button {
                    margin: 30px 0 0 0;
                    width: 100%;
                    padding: 0;
                    color: #fff;
                    border-radius:0;
                    min-height:50px;
                    font-size: 10pt;

                }
                .stitle {
                    font-size: 18pt;
                    font-weight:600;
                    text-align:center;
                    padding-bottom:30px;
                }
                .space {
                    height: 10px;
                }
                .find-box {
                    margin-top:-10px;
                    font-size:10pt;
                    display: flex;
                    color: #000;
                    span {
                        cursor: pointer;
                    }
                    .left {
                        width: 70%;
                        .dot {
                            cursor: default;
                            padding:0 10px;
                        }
                    }
                    .center {
                        margin-top:10px;
                        width:100%;
                        text-align: center;
                        span {
                            color:#686EFB;
                            text-decoration: underline;
                        }
                    }
                }
                .sns-login-box {
                    margin:10px 0;
                    display:flex;
                    justify-content: space-between;
                    overflow:hidden;
                    .icon-button {
                        width:48%;
                        margin-bottom: 10px;
                        .naver-sns-button {
                            width: 100%;
                            height: 42px;
                            display: flex;
                            background: #1EC800;
                            color: #FFFFFF;
                            font-weight: bold;
                            border-radius:0;
                            .logo {
                                width:23px;
                                img {
                                    margin-top:3px;
                                    width:15px;
                                }

                            }
                            .button-text {
                                font-size:10pt;
                            }
                        }
                        .kakao-sns-button {
                            width: 100%;
                            height: 42px;
                            border-radius:0;
                            display: flex;
                            background: #FEE500;
                            color: #191919;
                            font-weight: bold;
                            .logo {
                                width: 25px;
                                padding-top: 3px;
                                img {
                                    width:15px;
                                }
                            }
                            .button-text {
                                font-size: 10pt;

                            }
                        }
                    }
                }


            }
        }
    }


</style>
