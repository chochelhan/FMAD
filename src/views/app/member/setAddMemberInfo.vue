<template>
    <div class="page-container">

        <div :class="'contents '+mobileClass">
            <div class="from-box">

                <div v-if="!mobileView" class="stitle">추가 정보 입력</div>
                <form novalidate @submit.prevent="validate">
                    <div class="extraVars" v-if="pcsUse=='yes' || emailUse=='yes'">
                        <ul class="addForm">
                            <li v-if="emailUse=='yes'">
                                <div class="required-icon"><i class="fas fa-check"></i></div>
                                <v-text-field
                                    v-model="email"
                                    label="이메일"
                                    @input="emailTouchErrors"
                                    @blur="emailTouchErrors"
                                    :error-messages="emailErrors"
                                    outlined
                                ></v-text-field>
                            </li>
                            <li v-if="pcsUse=='yes'">
                                <div class="required-icon"><i v-if="pcsReq=='yes'" class="fas fa-check"></i></div>
                                <v-text-field
                                    v-model="pcs"
                                    label="휴대폰 번호"
                                    @input="pcsTouchErrors"
                                    @blur="pcsTouchErrors"
                                    :error-messages="pcsErrors"
                                    outlined
                                ></v-text-field>
                            </li>
                        </ul>
                    </div>
                    <div class="extraVars" v-if="extraVars.length>0">
                        <div class="sub-title">추가 정보</div>
                        <ul>
                            <li v-for="(item,index) in extraVars" :key="index">
                                <div class="required-icon"><i v-if="item.req" class="fas fa-check"></i></div>
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
                                    <div class="required-error" v-if="item.value.length<1 && item.touch">{{item.name}}
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
                            </li>
                        </ul>
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

        </div>
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
	import {
		API_URL_MEMBER_SNSJOIN,
		CONFIG_HEADER_POST
	} from '../../../api/urls';

	export default {
		name: 'setAddMemberInfo',
		data() {
			return {
				overlay: false,
				insertFlag: false,
				pcs: '',
				pcsErrors:[],
				mobileView: false,
				mobileClass: '',
				pcsUse: 'no',
				pcsReq: 'no',
				extraVars: [],
				serverInit: false,
				extraUse: 'no',
				emailTouch:false,
				email:'',
				emailUse: 'no',
				emailErrors:[],
				emailSucc:false,


			}
		},
		created() {
			let memberInfo = AUTH.getSession(this.$isMobile());
			if (memberInfo.AUTHTOKEN) {
               this.$router.push({path: '/'});
               return;
            }
            this.setConfig();
			if (this.$isMobile()) {
				this.mobileView = true;
				this.mobileClass = 'mobile'
			}

		},
		methods: {
			setConfig() {
				let config = SITECONFIG.getMemberConfig();
				console.log(config)
				if (config.join) {
					let pcsUse = config.join.pcscfg;

					let joinPcs = sessionStorage.getItem('joinPcs');
					if (joinPcs == 'no') {
						if (pcsUse == 'yes') {
							this.pcsUse = 'yes';
							this.pcsReq = config.join.pcsreq;
					    }
					}
					let joinEmail = sessionStorage.getItem('joinEmail');
					if (joinEmail == 'no') {
						this.emailUse = 'yes';

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
			pcsTouchErrors() {
				this.pcsErrors = []
				if (this.pcsReq == 'yes') {
					if (!this.pcs) {
						this.pcsErrors.push('휴대폰 번호를 입력하세요');
					}
				}

			},
			emailTouchErrors() {
				this.emailErrors = []
				if (!this.email) {
					this.emailSucc = false;
					this.emailErrors.push('이메일을 입력하세요');
				}
				let regExp = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;

				if (regExp.test(this.email)) {
					this.emailSucc = true;
				} else {
					this.emailErrors.push('잘못된 이메일 형식입니다');
					this.emailSucc = false;
				}

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
			validate() {
                let validateFlag = true;
				if (this.emailUse=='yes') {
					if (!this.email) {
						this.emailErrors = [];
						this.emailErrors.push('이메일을 입력하세요');
						validateFlag = false;
					}

					if (!this.emailSucc) {
						this.emailErrors = [];
						this.emailErrors.push('잘못된 이메일 형식입니다');
						validateFlag = false;
					}
				}
			    if(this.pcsUse == 'yes' && this.pcsReq == 'yes' && !this.pcs) {
				    this.pcsTouchErrors();
				    validateFlag = false;
			    }

				if (this.extraVars.length > 0) {
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

				}
				if (!validateFlag) return;
				this.formSubmit();


			},
			formSubmit() {
				if (this.insertFlag) return;
				this.insertFlag = true;


				const frm = new FormData()
				if (this.pcsUse == 'yes') {
					frm.append('pcs', this.pcs)
				} else frm.append('pcs', '')
				if (this.extraVars.length > 0 && this.extraUse == 'yes') {
					frm.append('extraVars', JSON.stringify(this.extraVars));
				}
				this.overlay = true;
				this.$http.post(API_URL_MEMBER_SNSJOIN, frm, {headers: CONFIG_HEADER_POST}).then(res => {
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
								APIKEY:res.data.apikey
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
                border-radius:35px;
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
            .extraVars {
                ul {
                    padding: 0;
                    margin: 0;
                    li {
                        display:flex;
                        .required-icon {
                            font-size:12pt;
                            margin-top:16px;
                            width:30px;
                            text-align:left;
                            color:#E91E63;
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
                    position:relative;
                    top:-20px;
                }
                ul {
                    padding: 0;
                    margin:0;
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
                margin:80px 0 50px 0;
                .sns-line {
                    margin-bottom:50px;
                    border-bottom:solid 1px #333;
                    width:100%;
                    .sns-title {
                        background:#fff;
                        width:250px;
                        margin:-13px 0 0 175px;
                        text-align:center;
                        font-weight:bold;
                        color:#000;
                        font-size:14pt;
                        position:absolute;

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