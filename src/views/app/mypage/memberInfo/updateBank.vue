<template>
    <div class="member-container">

        <div :class="'contents '+mobileClass">
            <form novalidate @submit.prevent="validate">
                <ul class="field-box">
                    <li>
                        <div class="field-input">
                            <v-select
                                v-model="bankName"
                                :items="bankList"
                                outlined
                                :dense="dense"
                                required
                                label="은행 선택"
                                :error-messages="bankNameErrors"
                                @input="$v.bankName.$touch()"
                                @blur="$v.bankName.$touch()"
                            ></v-select>
                        </div>
                    </li>
                    <li>
                        <div class="field-input">
                            <v-text-field
                                :dense="dense"
                                v-model="bankAccount"
                                label="계좌번호"
                                required
                                :error-messages="bankAccountErrors"
                                @input="$v.bankAccount.$touch()"
                                @blur="$v.bankAccount.$touch()"
                                outlined
                            ></v-text-field>
                        </div>
                    </li>
                    <li>
                        <div class="field-input">

                            <v-text-field
                                :dense="dense"
                                v-model="bankOwner"
                                label="예금주명"
                                required
                                @input="$v.bankOwner.$touch()"
                                @blur="$v.bankOwner.$touch()"
                                :error-messages="bankOwnerErrors"
                                outlined
                            ></v-text-field>
                        </div>
                    </li>
                </ul>
                <p>
                    <v-btn
                        type="submit"
                        class="submit-button" style="background:#303E9F;color:#fff;"
                    >
                        저 장
                    </v-btn>
                </p>

            </form>
        </div>
    </div>
</template>


<script>
	import {validationMixin} from 'vuelidate'
	import {required} from 'vuelidate/lib/validators'
	import {
		API_URL_MEMBER_UPDATE_BANK,
		API_URL_MEMBER_GET_BANK,
	} from '../../../../api/urls';
	import apiService from '../../../../api/apiService';

	export default {
		name: 'updateBank',
		mixins: [validationMixin],
		validations: {
			bankName: {required},
			bankAccount: {required},
			bankOwner: {required},

		},
		data() {
			return {
				insertFlag: false,
				bankName: '',
				bankAccount: '',
				bankOwner: '',
				mobileView: false,
				mobileClass: '',
				bankList: [
					{text: '국민은행', value: '국민은행'},
					{text: '기업은행', value: '기업은행'},
					{text: 'SC제일은행', value: 'SC제일은행'},
					{text: '하나은행', value: '하나은행'},
					{text: '신한은행', value: '신한은행'},
					{text: '농협', value: '농협'},
					{text: '신협', value: '신협'},
				],
                dense:false,

			}
		},
		created() {
			if (this.$isMobile()) {
				this.mobileView = true;
				this.mobileClass = 'mobile'
                this.dense = true;
			}
			this.getData();
		},
		computed: {
			bankNameErrors() {
				const errors = []
				if (!this.$v.bankName.$dirty) return errors
				!this.$v.bankName.required && errors.push('은행을 선택하세요')
				return errors
			},
			bankAccountErrors() {
				const errors = []
				if (!this.$v.bankAccount.$dirty) return errors
				!this.$v.bankAccount.required && errors.push('계좌번호를 입력하세요')
				return errors
			},
			bankOwnerErrors() {
				const errors = []
				if (!this.$v.bankOwner.$dirty) return errors
				!this.$v.bankOwner.required && errors.push('예금주명을 입력하세요')
				return errors
			},


		},
		methods: {
			getData() {
				const frm = new FormData()
				apiService.post(API_URL_MEMBER_GET_BANK, frm, (res) => {
					this.bankName = (res.info.bankName) ? res.info.bankName : '';
					this.bankAccount = (res.info.bankAccount) ? res.info.bankAccount : '';
					this.bankOwner = (res.info.bankOwner) ? res.info.bankOwner : '';

				})
			},
			validate() {

				this.$v.$touch()
				if (!this.$v.$anyError) {

					this.formSubmit();
				}


			},
			formSubmit() {
				if (this.insertFlag) return;
				this.insertFlag = true;

				const frm = new FormData()
				frm.append('bankName', this.bankName)
				frm.append('bankAccount', this.bankAccount)
				frm.append('bankOwner', this.bankOwner)
				this.$eventBus.$emit('overlay', 'open');

				apiService.post(API_URL_MEMBER_UPDATE_BANK, frm, (res) => {
					this.$eventBus.$emit('overlay', 'hide');
					this.insertFlag = false;
					let params = {
						message: '정보가 저장되었습니다',
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
                margin-bottom: 10px;
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