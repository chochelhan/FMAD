<template>
    <div class="member-container">

        <div :class="'contents '+mobileClass">
            <div class="from-box">
                <form novalidate @submit.prevent="validate">
                    <ul class="field-box">
                        <li>
                            <div class="field-input">

                                <v-text-field
                                    v-model="name"
                                    label="이름"
                                    required
                                    @input="$v.name.$touch()"
                                    @blur="$v.name.$touch()"
                                    :error-messages="nameErrors"
                                    outlined
                                    :dense="dense"
                                ></v-text-field>
                            </div>
                        </li>
                        <li>
                            <div class="date-box">
                                <v-menu
                                    ref="birthPicker"
                                    v-model="birthPicker"
                                    :close-on-content-click="false"
                                    :return-value.sync="birth"
                                    transition="scale-transition"
                                    offset-y
                                    min-width="auto"
                                >
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-text-field
                                            v-model="birth"
                                            label="생년월일"
                                            readonly
                                            @input="$v.birth.$touch()"
                                            @blur="$v.birth.$touch()"
                                            :error-messages="birthErrors"
                                            v-bind="attrs"
                                            outlined
                                            v-on="on"
                                            :dense="dense"
                                        ></v-text-field>
                                    </template>
                                    <v-date-picker
                                        v-model="birth"
                                        scrollable
                                    >
                                        <v-spacer></v-spacer>
                                        <v-btn
                                            text
                                            color="primary"
                                            @click="birthPicker = false"
                                        >
                                            취소
                                        </v-btn>
                                        <v-btn
                                            text
                                            color="primary"
                                            @click="$refs.birthPicker.save(birth)"
                                        >
                                            확인
                                        </v-btn>
                                    </v-date-picker>
                                </v-menu>
                            </div>
                        </li>
                        <li>
                            <div class="field-input">

                                <v-text-field
                                    :dense="dense"
                                    v-model="email"
                                    label="이메일"
                                    @input="$v.email.$touch()"
                                    @blur="$v.email.$touch()"
                                    :error-messages="emailErrors"
                                    outlined
                                ></v-text-field>
                            </div>
                            <div class="radio-box">
                                <div class="radio-box-item" @click="setEmailReceive()">
                                    <div :class="'icon-box '+emailGclass">
                                        <i class="fas fa-check"></i>
                                    </div>
                                    <div class="text">이메일 수신동의</div>
                                </div>
                            </div>
                        </li>
                        <li>
                            <div class="field-input">

                                <v-text-field
                                    v-model="pcs"
                                    label="휴대폰 번호"
                                    @input="$v.pcs.$touch()"
                                    @blur="$v.pcs.$touch()"
                                    :error-messages="pcsErrors"
                                    outlined
                                    :dense="dense"
                                ></v-text-field>
                            </div>
                            <div class="radio-box">
                                <div class="radio-box-item" @click="setSmsReceive()">
                                    <div :class="'icon-box '+smsGclass">
                                        <i class="fas fa-check"></i>
                                    </div>
                                    <div class="text">SMS 수신동의</div>
                                </div>
                            </div>
                        </li>
                    </ul>


                    <p>
                        <v-btn
                            type="submit"
                            class="submit-button" style="background:#686EFB;color:#fff;"
                        >
                            정보 변경
                        </v-btn>
                    </p>

                </form>
            </div>

        </div>

    </div>
</template>


<script>
	import {mapActions} from "vuex";
	import AUTH from '../../../../api/auth'
	import {validationMixin} from 'vuelidate'
	import {required, email} from 'vuelidate/lib/validators'
	import {
		API_URL_MEMBER_UPDATE,
	} from '../../../../api/urls';
	import apiService from '../../../../api/apiService';

	export default {
		name: 'updateMyInfo',
		mixins: [validationMixin],
        props:["memberInfo"],
        validations: {
			name: {required},
			pcs: {required},
			birth: {required},
			email: {required, email},

		},
		data() {
			return {
				insertFlag: false,
				name: '',
				pcs: '',
				birth: '',
				email: '',
				birthPicker: false,
				mobileView: false,
				mobileClass: '',
				smsGclass:'',
                emailGclass:'',
                smsSend:'no',
				emailSend:'no',
                dense:false,
			}
		},
		created() {
			if (this.$isMobile()) {
				this.mobileView = true;
				this.mobileClass = 'mobile'
                this.dense = true;
			}
			this.getMemberInfo();
		},
		computed: {
			nameErrors() {
				const errors = []
				if (!this.$v.name.$dirty) return errors
				!this.$v.name.required && errors.push('이름 입력하세요')
				return errors
			},
			birthErrors() {
				const errors = []
				if (!this.$v.birth.$dirty) return errors
				!this.$v.birth.required && errors.push('생년월일을 입력하세요')
				return errors
			},
			emailErrors() {
				const errors = []
				if (!this.$v.email.$dirty) return errors
				if (!this.$v.email.required) {
					errors.push('이메일을 입력하세요')
					return errors
				}
				if (!this.$v.email.email) {
					errors.push('잘못된 이메일형식 입니다')
					return errors
				}
			},
			pcsErrors() {
				const errors = []
				if (!this.$v.pcs.$dirty) return errors
				!this.$v.pcs.required && errors.push('휴대폰 번호를 입력하세요')
				return errors
			},

		},
		methods: {
			...mapActions('member', ["setMember"]),
			getMemberInfo() {
					this.name = this.memberInfo.name;
					this.pcs = this.memberInfo.pcs;
					this.birth = this.memberInfo.birth;
					this.email = this.memberInfo.email;
					this.emailSend = this.memberInfo.emailSend;
					this.smsSend = this.memberInfo.smsSend;
					if(this.emailSend=='yes')this.emailGclass = 'active';
					if(this.smsSend=='yes')this.smsGclass = 'active';

			},
			validate() {

				this.$v.$touch()
				if (!this.$v.$anyError) {
					this.formSubmit();
				}

			},
			setEmailReceive() {
				if(this.emailGclass=='active') {
					this.emailGclass=''
                    this.emailSend = 'no'
                } else {
					this.emailGclass='active'
					this.emailSend = 'yes'
                }
            },
			setSmsReceive() {
				if(this.smsGclass=='active') {
					this.smsGclass=''
					this.smsSend = 'no'
				} else {
					this.smsGclass='active'
					this.smsSend = 'yes'
				}
			},
			formSubmit() {
				if (this.insertFlag) return;
				this.insertFlag = true;

				const frm = new FormData()
				frm.append('name', this.name)
				frm.append('pcs', this.pcs)
				frm.append('email', this.email)
				frm.append('birth', this.birth)
				frm.append('smsSend', this.smsSend)
				frm.append('emailSend', this.emailSend)

				this.$eventBus.$emit('overlay', 'open');

				apiService.post(API_URL_MEMBER_UPDATE, frm, (res) => {
					this.$eventBus.$emit('overlay', 'hide');

					this.insertFlag = false;
					if(res.msg=='isEmail') {
						let params = {
							message: '동일한 이메일 정보가 존재합니다',
						};
						this.$eventBus.$emit('modalOpen', params);
                    } else {
						let memberInfo = AUTH.getSession(this.$isMobile());
						memberInfo.name = this.name
						memberInfo.email = this.email
						AUTH.setPartSession(this.$isMobile(), memberInfo);
						this.setMember(memberInfo);
                        this.$emit("updateInfo");
						let params = {
							message: '정보가 변경되었습니다',
						};
						this.$eventBus.$emit('modalOpen', params);
					}
				})
			},
		},

	}
</script>
<style lang="scss" scoped>
    .member-container {
        width: 100%;
        background: #fff;
        padding: 0;
        .contents {
            width: 500px;
            margin: auto;
            padding: 30px 0 80px 0;
            text-align: center;
            .submit-button {
                margin: 50px auto 0 auto;
                width: 400px;
                border-radius: 0;
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
                padding: 0;
                width: 100%;
                margin: 0;
                li {
                    width: 100%;
                    border: none;
                    display: inline-block;
                    padding-left: 0;
                    padding-right: 0;
                    .field-input {
                        width: 100%;

                    }
                    .date-box {
                        width: 100%;
                    }
                }
            }
            .radio-box {
                margin-top: -5px;
                margin-bottom:10px;
                .radio-box-item {
                    display: flex;
                    cursor: pointer;
                    .icon-box {
                        width: 30px;
                        height: 30px;
                        border-radius: 50%;
                        text-align: center;
                        color: #dcdcdc;
                        border: solid 1px #ccc;
                        line-height: 30px;
                        margin-right: 5px;
                        &.active {
                            background: #686EFB;
                            color: #fff;
                        }
                    }
                    .text {
                        font-size: 10pt;
                        padding-top: 5px;
                    }
                }

            }
            &.mobile {
                width: 100%;
                padding:0;
                .submit-button {
                    margin: 30px auto 0 auto;
                    width:100%;
                    border-radius: 0;
                    min-height:50px;
                    font-size: 10pt;
                }
            }

        }

    }


</style>