<template>
    <div>
        <v-dialog
            v-model="dialog"
            width="800"
        >
            <v-card>
                <v-card-title class="headline">
                    <div class="headline-title">회원가입
                        <span>아직 회원가입을 하지 않으셨습니다. 먼저 회원가입을 해주세요</span>
                    </div>
                </v-card-title>
                <div class="content-box">
                    <div class="content">
                        <v-tabs fixed-tabs :value="tabValue" @change="tabChange">
                            <v-tab class="tab-item">이용약관</v-tab>
                            <v-tab class="tab-item">개인정보 처리방침</v-tab>
                            <v-tab v-if="extraUse=='yes' || pcsUse=='yes' || emailUse=='yes'" class="tab-item">추가정보 입력</v-tab>
                            <v-tab-item>
                                <div class="agree-item" v-html="agreeInfo.agree">
                                </div>
                                <ul class="check-box">
                                    <li>
                                        <v-checkbox v-model="agree"
                                                    class="agree-checkbox"
                                        ></v-checkbox>
                                    </li>
                                    <li>
                                        이용약관에 동의합니다
                                    </li>
                                </ul>
                            </v-tab-item>
                            <v-tab-item>
                                <div class="agree-item" v-html="agreeInfo.privacy">
                                </div>
                                <ul class="check-box">
                                    <li>
                                        <v-checkbox v-model="privacy"
                                                    class="agree-checkbox"
                                        ></v-checkbox>
                                    </li>
                                    <li>
                                        개인정보 처리방침에 동의합니다
                                    </li>
                                </ul>
                            </v-tab-item>
                            <v-tab-item v-if="extraUse=='yes' || pcsUse=='yes' || emailUse=='yes'">
                                <div class="extraVars">
                                    <ul class="addForm" v-if="pcsUse=='yes' || emailUse=='yes'">
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

                                    <ul v-if="extraVars.length>0">
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
                                        </li>
                                    </ul>
                                </div>
                            </v-tab-item>
                        </v-tabs>
                    </div>
                </div>

                <div class="member-footer">
                    <v-btn
                        class="cancle-button"
                        color="primay"
                        @click="dialog=false"
                    >
                        취소
                    </v-btn>
                    <v-btn
                        class="join-button"
                        color="primary"
                        @click="join()"
                    >
                        회원가입
                    </v-btn>
                </div>
            </v-card>
        </v-dialog>
    </div>
</template>
<script>
	import AUTH from '../api/auth';
	import SITECONFIG from '../api/siteConfig';
	import {
		API_URL_MEMBER_SNSJOIN,
		CONFIG_HEADER_POST
	} from '../api/urls';

	export default {
		data() {
			return {
				dialog: false,
				agreeInfo: {},
				agree: false,
				privacy: false,
				tabValue: 0,
				pcsUse: 'no',
				emailUse: 'no',
				pcsReq: 'no',
				extraUse: 'no',
				extraVars: [],
				pcsTouch: false,
				pcs: '',
				pcsErrors: [],
                emailTouch:false,
                email:'',
                emailErrors:[],
				insertFlag: false,
				emailSucc:false,


			}
		},
		watch: {
			agree(val) {
				if (val) {


					if (!this.privacy) this.tabValue = 1;
					else if (this.pcsUse == 'yes' || this.extraUse == 'yes') {
						this.tabValue = 2;
					}
				}
			},
			privacy(val) {
				if (val) {
					if (this.pcsUse == 'yes' || this.extraUse == 'yes') {
						this.tabValue = 2;
					} else if (!this.agree) this.tabValue = 1;
				}
			}
		},
		created() {
			this.$eventBus.$on('showAgreeBox', this.openMemberInfo);
		},
		methods: {
			tabChange(val) {
				this.tabValue = val;
			},
			setConfig(params) {
				let config = SITECONFIG.getMemberConfig();
				if (config.agree) {
					this.agreeInfo['agree'] = config.agree
				}
				if (config.privacy) {
					this.agreeInfo['privacy'] = config.privacy
				}
				if (params.email == 'no') {
					this.emailUse = 'yes';

				}
				if (config.join) {
					let pcsUse = config.join.pcscfg;
					if (pcsUse == 'yes') {
						if (params.pcs == 'no') {
							this.pcsUse = 'yes';
							this.pcsReq = config.join.pcsreq;
						}

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
			join() {
				if (this.insertFlag) return;

				if (!this.agree) {

					let params = {
						message: '이용약관에 동의하세요',
						doAction: () => {
							this.tabValue = 0;
						}
					};
					this.$eventBus.$emit('modalOpen', params);

					return;
				}
				if (!this.privacy) {

					let params = {
						message: '개인정보 처리방침에 동의하세요',
						doAction: () => {
							this.tabValue = 1;
						}
					};
					this.$eventBus.$emit('modalOpen', params);

					return;
				}
				if (this.emailUse == 'yes' || this.pcsUse == 'yes' || this.extraUse == 'yes') {
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

					if (this.pcsReq == 'yes') {
						if (!this.pcs) {
							this.pcsErrors = [];
							this.pcsErrors.push('휴대폰 번호를 입력하세요');
							validateFlag = false;
						}
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
					if (!validateFlag) {
						this.tabValue = 2;
						return;
					}

					this.insertFlag = true;

					const frm = new FormData()
					if (this.pcsUse == 'yes' || this.extraUse == 'yes') {
						if (this.pcsUse == 'yes') {
							frm.append('pcs', this.pcs)
						} else frm.append('pcs', '')
						if (this.extraVars.length > 0 && this.extraUse == 'yes') {
							frm.append('extraVars', JSON.stringify(this.extraVars));
						}
					}
					this.$http.post(API_URL_MEMBER_SNSJOIN, frm, {headers: CONFIG_HEADER_POST}).then(res => {
						this.dialog = false;
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

							case 'succ':
								let authData = {
									AUTHTOKEN: res.data.AUTHTOKEN,
									name: res.data.userInfo.name,
									uid: res.data.userInfo.uid,
									no: res.data.userInfo.no,
									level: res.data.userInfo.level,
									APIKEY: res.data.apikey
								}
								AUTH.setSession(false, authData);

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
				}

			},
			openMemberInfo(params) {
				this.setConfig(params);
				this.dialog = true;
			},

		}
	}
</script>
<style lang="scss" scoped="true">
    .headline {
        background: #fafafa;
        height: 60px;
        width: 100%;
        border-bottom: solid 1px #ccc;
        .headline-title {
            width: 100%;
            font-size: 14pt;
            padding-left: 20px;
            span {
                font-size: 10pt;
                color: #999;
                font-weight: normal;
                padding-left: 20px;
            }
        }
    }

    .content-box {
        padding: 10px 30px 0 30px;
        margin: 0;
        height: 570px;
        overflow-y: auto;
        .tab-item {
            font-weight: bold;
            font-size: 11pt;
            border-bottom: solid 2px #ccc;
        }
        .agree-item {
            margin: 0;
            line-height: 80%;
            height: 460px;
            overflow-y: auto;
            border-bottom: solid 2px #ccc;
            padding: 30px;

        }
        ul.check-box {
            padding: 15px 0 0 0;
            margin: 0;
            display: flex;
            li {
                font-size: 11pt;
                font-weight: bold;
                &:first-child {
                    width: 40px;
                    .agree-checkbox {
                        margin: -5px 0 0 0;
                        height: 15px;
                    }
                }
            }
        }
        .extraVars {
            padding:50px 30px 30px 0;
            height: 507px;
            overflow-y: auto;
            &.no-margin {
                height:auto;
                padding-bottom:0;
            }
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
    }

    .member-footer {
        background: #fafafa;
        height: 80px;
        padding-top: 15px;
        width: 100%;
        border-top: solid 1px #ccc;
        text-align: center;
        .cancle-button {
            width: 200px;
            height: 50px;
            background: #999;
            color: #fff;
            margin-right: 30px;
            font-size: 12pt;
            border-radius: 25px;
        }
        .join-button {
            width: 200px;
            height: 50px;
            font-size: 12pt;
            border-radius: 25px;

        }
    }

</style>