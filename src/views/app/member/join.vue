<template>
    <div class="page-container">

        <div v-if="mobileView" class="top-menu-bar">
            <div class="top-menu-bar-content">
                <div class="back-button" @click="$router.go(-1)">
                    <i class="fas fa-chevron-left"></i>
                </div>
                <span class="m-title">회원가입</span>
            </div>
        </div>
        <div :class="'contents '+mobileClass">
            <div class="from-box">

                <div v-if="!mobileView" class="stitle">회원가입</div>
                <form novalidate @submit.prevent="validate">
                    <ul class="field-box">
                        <li>
                            <div class="required-icon"><i class="fas fa-check"></i></div>
                            <div class="field-input">
                                <v-text-field
                                    v-model="uid"
                                    label="아이디(이메일)"
                                    required
                                    :error-messages="uidErrors"
                                    @input="$v.uid.$touch()"
                                    @blur="$v.uid.$touch()"
                                    outlined
                                ></v-text-field>
                                <div v-if="uidResultClass" :class="'uidResultClass '+uidResultClass">
                                    {{uidResultMessage}}
                                </div>
                            </div>
                        </li>
                        <li>
                            <div class="required-icon"><i class="fas fa-check"></i></div>
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
                            <div class="required-icon"><i class="fas fa-check"></i></div>
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
                        <li>
                            <div class="required-icon"><i class="fas fa-check"></i></div>
                            <div class="field-input">

                                <v-text-field
                                    v-model="name"
                                    label="이름"
                                    required
                                    @input="$v.name.$touch()"
                                    @blur="$v.name.$touch()"
                                    :error-messages="nameErrors"
                                    outlined
                                ></v-text-field>
                            </div>
                        </li>
                        <li v-if="pcsUse=='yes'">
                            <div class="required-icon"><i v-if="pcsReq=='yes'" class="fas fa-check"></i></div>
                            <div class="field-input">

                                <v-text-field
                                    v-model="pcs"
                                    label="휴대폰 번호"
                                    :required="((pcsReq=='yes')?true:false)"
                                    @input="$v.pcs.$touch()"
                                    @blur="$v.pcs.$touch()"
                                    :error-messages="pcsErrors"
                                    outlined
                                ></v-text-field>
                            </div>
                        </li>
                    </ul>

                    <div class="extraVars" v-if="extraVars.length>0">
                        <div class="sub-title">추가 정보</div>
                        <ul>
                            <li v-for="(item,index) in extraVars" :key="index">
                                <div class="required-icon"><i v-if="item.req" class="fas fa-check"></i></div>
                                <div class="field-input">

                                    <v-text-field
                                        v-if="item.type=='text'"
                                        v-model="item.value"
                                        :label="item.name"
                                        outlined
                                        :error-messages="item.error"
                                        @input="extraValuesTouch(index)"
                                        @blur="extraValuesTouch(index)"
                                    ></v-text-field>
                                    <v-select
                                        v-else-if="item.type=='select'"
                                        v-model="item.value"
                                        :items="item.subItems"
                                        :label="item.name"
                                        :error-messages="item.error"
                                        @input="extraValuesTouch(index)"
                                        @blur="extraValuesTouch(index)"
                                        outlined

                                    ></v-select>
                                    <div class="table-box" v-else-if="item.type=='checkbox'">
                                        <div class="label-title">{{item.name}}</div>
                                        <div class="table-content-box">
                                            <v-checkbox v-for="(subItem,subIndex) in item.subItems"
                                                        v-model="item.value"
                                                        :label="subItem.name"
                                                        :value="subItem.name"
                                                        style="margin-right:10px"
                                                        @change="extraValuesTouch(index)"
                                            ></v-checkbox>

                                        </div>
                                        <div class="required-error" v-if="item.value.length<1 && item.touch">
                                            {{item.name}}
                                            선택하세요
                                        </div>
                                    </div>
                                    <div class="table-box" v-else-if="item.type=='radio'">
                                        <div class="label-title">{{item.name}}</div>
                                        <div class="table-content-box">
                                            <v-radio-group v-model="item.value" row
                                                           :error-messages="item.error"
                                                           @change="extraValuesTouch(index)">
                                                <v-radio
                                                    v-for="(subItem,subIndex) in item.subItems"
                                                    :key="subIndex"
                                                    :label="subItem.name"
                                                    :value="subItem.name"

                                                ></v-radio>
                                            </v-radio-group>
                                        </div>
                                    </div>
                                    <v-textarea v-else-if="item.type=='textarea'"
                                                outlined
                                                v-model="item.value"
                                                :label="item.name"
                                                :error-messages="item.error"
                                                @input="extraValuesTouch(index)"
                                                @blur="extraValuesTouch(index)"
                                                rows="10"

                                    ></v-textarea>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div class="agree-box">
                        <ul>
                            <li>
                                <v-checkbox v-model="agree"
                                            class="agree-checkbox"
                                ></v-checkbox>
                            </li>
                            <li>
                                <span @click="showAgree('agree')">이용약관</span>에 동의합니다
                            </li>
                        </ul>
                        <div class="required-error" v-if="!agree && agreeTouch">
                            이용약관에 동의하세요
                        </div>
                        <ul>
                            <li>
                                <v-checkbox v-model="privacy"
                                            class="agree-checkbox"
                                ></v-checkbox>
                            </li>
                            <li>
                                <span @click="showAgree('privacy')">개인정보 처리방침</span>에 동의합니다
                            </li>
                        </ul>
                        <div class="required-error" v-if="!privacy && agreeTouch">
                            개인정보 처리방침에 동의하세요
                        </div>
                    </div>
                    <p>
                        <v-btn
                            type="submit"
                            class="submit-button" style="background:#303E9F;color:#fff;"
                        >
                            회원가입
                        </v-btn>
                    </p>

                </form>
            </div>
            <div class="sns-join-box" v-if="snsUseInfo.kacfg=='yes' || snsUseInfo.nvcfg=='yes'">
                <div class="sns-line">
                    <div class="sns-title">SNS 계정 간편 회원가입</div>
                </div>
                <div class="icon-button" v-if="snsUseInfo.kacfg=='yes'">
                    <v-btn
                        type="button"
                        class="kakao-sns-button"
                        @click="snsJoin('ka')"
                    >

                        <div class="logo">
                            <img src="../../../assets/img/ka_icon.png"/>
                        </div>
                        <div class="button-text">
                            카카오톡 아이디로 회원가입
                        </div>
                    </v-btn>
                </div>
                <div class="icon-button" v-if="snsUseInfo.nvcfg=='yes'">
                    <v-btn
                        type="button"
                        class="naver-sns-button"
                        @click="snsJoin('nv')"
                    >
                        <div class="logo">
                            <img src="../../../assets/img/naver_icon.png"/>
                        </div>
                        <div class="button-text">
                            네이버 아이디로 회원가입
                        </div>
                    </v-btn>
                </div>
            </div>

        </div>
        <v-dialog
            v-model="dialog"
            transition="dialog-bottom-transition"
            max-width="900"
        >
            <div class="dialog-layout">
                <div class="header-box">
                    {{agreeTitle}}
                    <i class="far fa-times-circle" @click="dialog=false"></i>
                </div>
                <div class="message-box">
                    <div class="message-content" v-html="agreeContent"></div>
                </div>


                <div class="footer-box">
                    <v-btn
                        color="primary"
                        text
                        @click="dialog=false"
                    >
                        확인
                    </v-btn>
                </div>
            </div>
        </v-dialog>
        <v-overlay :value="overlay" style="z-index:100">

            <v-progress-circular
                :size="50"
                color="lime accent-1"
                indeterminate
            ></v-progress-circular>
        </v-overlay>
    </div>
</template>


<script>
	import AUTH from '../../../api/auth'

	import SITECONFIG from '../../../api/siteConfig';
	import {validationMixin} from 'vuelidate'
	import {required, email, numeric, minLength, maxLength} from 'vuelidate/lib/validators'
	import {
		API_URL_MEMBER_UIDCHECK,
		API_URL_MEMBER_JOIN,
		CONFIG_HEADER_POST
	} from '../../../api/urls';

	export default {
		name: 'Join',
		mixins: [validationMixin],
		validations: {
			uid: {required, email},
			upass: {required, minLength: minLength(8), maxLength: maxLength(15)},
			reupass: {required},
			name: {required},
			pcs: {},

		},
		data() {
			return {
				dialog: false,
				agreeTitle: '',
				agreeContent: '',
				agreeInfo: {},
				overlay: false,
				insertFlag: false,
				uid: '',
				upass: '',
				reupass: '',
				name: '',
				pcs: '',
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
				configInterval: null,
				pcsUse: 'no',
				pcsReq: 'no',
				extraVars: [],
				serverInit: false,
				extraUse: 'no',
				agree: false,
				privacy: false,
				agreeTouch: false,

			}
		},
		created() {
			let memberInfo = AUTH.getSession(this.$isMobile());
			if (memberInfo.AUTHTOKEN) {
				this.$router.push({path: '/'});
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
			if (this.$isMobile()) {
				this.mobileView = true;
				this.mobileClass = 'mobile'
			}

		},
		destroyed() {
			if (this.configInterval) {
				clearInterval(this.configInterval);
			}
		},
		computed: {
			uidErrors() {
				const errors = []
				if (!this.$v.uid.$dirty) return errors
				!this.$v.uid.required && errors.push('아이디를 입력하세요')
				!this.$v.uid.email && errors.push('잘못된 이메일입니다')
				if (this.$v.uid.required && this.$v.uid.email) {
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
					});

				} else {
					this.succUid = false;
					this.uidResultClass = '';

				}

				return errors
			},
			upassErrors() {
				const errors = []
				if (!this.$v.upass.$dirty) return errors
				!this.$v.upass.required && errors.push('비밀번호를 입력하세요')
				if (!this.$v.upass.minLength || !this.$v.upass.maxLength) {
					errors.push('비밀번호는 8자 이상 15자 이하로 입력하세요')
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
			pcsErrors() {
				const errors = []
				if (!this.$v.pcs.$dirty) return errors
				if (this.pcsReq == 'yes') {
					!this.$v.pcs.required && errors.push('휴대폰 번호를 입력하세요')
				}
				return errors
			},

		},
		methods: {
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
				if (config.join) {
					this.pcsUse = config.join.pcscfg;
					if (this.pcsUse == 'yes') {
						this.pcsReq = config.join.pcsreq;


					}
					this.extraUse = config.join.extra;
					if (config.join.extra == 'yes') {
						let extraVars = config.join.extraVars;
						let value = '';
						this.extraVars = [];
						for (let item of extraVars) {
							switch (item.type) {
								case'select':
									for (let subItem of item.subItems) {
										subItem.text = subItem.name;
										subItem.value = subItem.name;

									}
									break;
								case 'checkbox':
									value = [];
									break;
							}
							item.value = value
							item.error = [];
							item.touch = false;
							this.extraVars.push(item);
						}
					}
				}
				this.serverInit = true;
			},
			extraValuesTouch(index) {
				let field = this.extraVars[index];
				if (field.req) {
					field.touch = true;
					switch (field.type) {
						case 'checkbox':
							break;
						case 'select':
						case 'radio':
							if (!field.value || field.value == '') {
								if (field.error.length < 1) {
									field.error.push(field.name + ' 선택하세요');
								}
							} else {
								field.error = [];
							}
							break;
						default:
							if (!field.value || field.value == '') {
								if (field.error.length < 1) {
									field.error.push(field.name + ' 입력하세요');
								}
							} else {
								field.error = [];
							}
							break;
					}

				}
			},
			showAgree(cmd) {
				switch (cmd) {
					case 'agree':
						this.agreeTitle = '이용약관';
						break;
					case 'privacy':
						this.agreeTitle = '개인정보 처리방침';
						break;
				}
				this.agreeContent = this.agreeInfo[cmd];
				this.dialog = true;
			},
			snsJoin(cmd) {
				if (!this.agree || !this.privacy) {
					this.agreeTouch = true;
					let msg = '';
					if (!this.agree) msg = '이용약관에 동의해주세요'
					else msg = '개인정보 처리방침에 동의해주세요'
					let params = {
						message: msg,
					};
					this.$eventBus.$emit('modalOpen', params);
					return;
				}
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

				this.$v.$touch()
				this.agreeTouch = true;
				if (this.pcsUse == 'yes' && this.pcsReq == 'yes' && !this.pcs) {
					return;
				}

				if (this.extraVars.length > 0) {
					let validateFlag = true;
					for (let item of this.extraVars) {
						if (item.req) {

							switch (item.type) {
								case 'checkbox':
									if (item.value.length < 1) {
										if (item.error.length < 1) {
											item.touch = true;
										}
										validateFlag = false;
									}
									break;
								case 'select':
								case 'radio':
									if (!item.value || item.value == '') {
										if (item.error.length < 1) {
											item.error.push(item.name + ' 선택하세요');
										}
										validateFlag = false;
									}
									break;
								default:
									if (!item.value || item.value == '') {
										if (item.error.length < 1) {
											item.error.push(item.name + ' 입력하세요');
										}
										validateFlag = false;
									}
									break;
							}
						}
					}
					if (!validateFlag) return;
				}
				if (!this.upassValid || !this.reupassValid || !this.agree || !this.privacy || !this.succUid) {
					return;
				}
				if (!this.$v.$anyError) {

					this.formSubmit();
				}


			},
			formSubmit() {
				if (this.insertFlag) return;
				if (!this.succUid) return;
				this.insertFlag = true;


				const frm = new FormData()
				frm.append('uid', this.uid)
				frm.append('upass', this.upass)
				frm.append('name', this.name)
				if (this.pcsUse == 'yes') {
					frm.append('pcs', this.pcs)
				} else frm.append('pcs', '')
				if (this.extraVars.length > 0 && this.extraUse == 'yes') {
					frm.append('extraVars', JSON.stringify(this.extraVars));
				}
				frm.append('mtype', '')
				this.overlay = true;
				this.$http.post(API_URL_MEMBER_JOIN, frm, {headers: CONFIG_HEADER_POST}).then(res => {
					this.overlay = false;

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

						case 'doubleEmail':
							params = {
								message: '중복된 아이디 입니다',
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
								APIKEY: res.data.apikey
							}
							AUTH.setSession(this.$isMobile(), authData);
							params = {
								message: '회원가입을 축하합니다',
								doAction: () => {
									this.$router.push('/');
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
            width: 600px;
            margin: auto;
            padding: 30px 0 80px 0;

            .submit-button {
                margin: 50px 0 0 0;
                width: 100%;
                border-radius: 35px;
                padding: 0;
                background: #303E9F;
                color: #fff;
                min-height: 70px;
                font-size: 12pt;

            }

            .stitle {
                font-size: 20pt;
                font-weight: bold;
                padding: 0 0 30px 0;
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
                padding:0;
                margin:0;
                li {
                    display:flex;
                    .required-icon {
                        min-width:30px;
                        font-size:12pt;
                        color:#E91E63;
                        margin-top:16px;
                    }
                    .field-input {
                        width:100%;

                    }
                }
            }
            .extraVars {
                ul {
                    padding: 0;
                    margin: 0;
                    li {
                        display:flex;
                        .required-icon {
                            min-width:30px;
                            font-size:12pt;
                            color:#E91E63;
                            margin-top:16px;
                        }
                        .field-input {
                            width:100%;

                        }
                        .table-box {
                            margin-bottom: 20px;
                            .required-error {
                                font-size: 9pt;
                                color: #F44336;
                                margin-top: -17px;
                            }
                            .label-title {
                                font-size: 11pt;
                                color: #000;
                            }
                            .table-content-box {
                                display: flex;
                                flex-wrap: wrap;
                            }
                        }
                    }
                }
            }
            .agree-box {
                margin-top: 10px;
                .required-error {
                    font-size: 9pt;
                    color: #F44336;
                    position: relative;
                    top: -20px;
                }
                ul {
                    padding: 0;
                    margin: 0;
                    display: flex;
                    li {
                        span {
                            text-decoration: underline;
                            color: #303E9F;
                            cursor: pointer;
                        }
                        &:first-child {
                            width: 40px;
                            .agree-checkbox {
                                margin: -4px 0 0 0;
                            }
                        }
                    }
                }
            }
            .sns-join-box {
                margin: 80px 0 50px 0;
                .sns-line {
                    margin-bottom: 50px;
                    border-bottom: solid 1px #333;
                    width: 100%;
                    .sns-title {
                        background: #fff;
                        width: 250px;
                        margin: -13px 0 0 175px;
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
                            width: 490px;
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
                            width: 490px;
                            font-size: 14pt;

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

    }


</style>