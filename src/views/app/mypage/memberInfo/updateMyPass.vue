<template>
    <div class="member-container">

        <div :class="'contents '+mobileClass">
                <form novalidate @submit.prevent="validate">
                    <ul class="field-box">
                        <li>
                            <div class="field-input">
                                <v-text-field
                                    type="password" v-model="nowpass"
                                    label="기존 비밀번호"
                                    required
                                    :error-messages="nowpassErrors"
                                    @input="$v.nowpass.$touch()"
                                    @blur="$v.nowpass.$touch()"
                                    outlined
                                    :dense="dense"
                                ></v-text-field>
                            </div>
                        </li>
                        <li>
                            <div class="field-input">
                                <v-text-field
                                    type="password" v-model="upass"
                                    label="비밀번호"
                                    required
                                    :dense="dense"
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
                                    :dense="dense"
                                ></v-text-field>
                            </div>
                        </li>
                    </ul>
                    <p>
                        <v-btn
                            type="submit"
                            class="submit-button" style="background:#303E9F;color:#fff;"
                        >
                           비밀번호 변경
                        </v-btn>
                    </p>

                </form>
        </div>
    </div>
</template>


<script>
	import AUTH from '../../../../api/auth'
	import {validationMixin} from 'vuelidate'
	import {required, minLength, maxLength} from 'vuelidate/lib/validators'
	import {
		API_URL_MEMBER_PASS_UPDATE
	} from '../../../../api/urls';
	import apiService from '../../../../api/apiService';

	export default {
		name: 'updateMyPass',
		mixins: [validationMixin],
		validations: {
			nowpass: {required},
			upass: {required, minLength: minLength(8), maxLength: maxLength(15)},
			reupass: {required},

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
                dense:false,

			}
		},
		created() {
			if(this.$isMobile()) {
				this.mobileView = true;
				this.mobileClass = 'mobile'
                this.dense = true;
			}

		},
		computed: {
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
			nowpassErrors() {
				const errors = []
				if (!this.$v.nowpass.$dirty) return errors
				!this.$v.nowpass.required && errors.push('기존비밀번호를 입력하세요')
				return errors
			},


		},
		methods: {
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
                    let msg = (res.msg=='succ')?'정보가 변경되었습니다':'잘못된 현재 비밀번호 입니다';
					if(res.msg=='succ') {
						let memberInfo = AUTH.getSession(this.$isMobile());
						memberInfo.AUTHTOKEN= res.AUTHTOKEN
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