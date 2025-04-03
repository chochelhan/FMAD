<template>
    <div class="find-page-content">

        <div class="contents">
            <div class="from-box">
                <div class="stitle">비밀번호 찾기</div>
                <form novalidate @submit.prevent="validate">
                    <v-text-field
                        v-model="uid"
                        label="사용자이름"
                        required
                        prefix="duckku.com/link/"
                        @input="$v.uid.$touch()"
                        @blur="$v.uid.$touch()"
                        :error-messages="uidErrors"
                        outlined
                    ></v-text-field>
                   <div class="tip">
                       사용자 이름을 입력하시면, 가입시 입력하신 이메일로 변경된 비밀번호를 전달드립니다.
                   </div>
                    <p>
                        <v-btn
                            type="submit"
                            class="submit-button" style="background: #686EFB;"
                        >
                            확 인
                        </v-btn>
                    </p>

                </form>
            </div>
        </div>

    </div>
</template>


<script>
	import AUTH from '../../../api/auth'
	import {validationMixin} from 'vuelidate'
	import {required,numeric} from 'vuelidate/lib/validators'

	import {
        API_URL_MEMBER_FIND_ID,
	} from '../../../api/urls';
	import apiService from '../../../api/apiService'

	export default {
		name: 'linkModalFindId',
    	mixins: [validationMixin],
		validations: {
			uid: {required},
		},
		data() {
			return {
				uid:'',
			}
		},
		created() {

			let memberInfo = AUTH.getSession(this.$isMobile());
			if (memberInfo.AUTHTOKEN) {
				this.$router.push({path: '/'});
				return;
			}

		},
		computed: {
			uidErrors() {
			    const errors = []
				if (!this.$v.uid.$dirty) return errors
				!this.$v.uid.required && errors.push('이름을 입력하세요')
				return errors
			},
		},
		methods: {
			validate() {
				this.$v.$touch()
				if (!this.$v.$anyError) {
					this.formSubmit();
				}

			},
            formSubmit() {
				this.$eventBus.$emit('overlay', 'open');
				const frm = new FormData()
				frm.append('uid', this.uid)
				apiService.post(API_URL_MEMBER_FIND_ID, frm,(res) => {
					this.$eventBus.$emit('overlay', 'hide');
					let params = {}
					let msg = '';
					switch (res.msg) {
						case 'wrong':
							msg = '잘못된 이름 입니다';
							params = {
								message:msg,
							};
							this.$eventBus.$emit('modalOpen', params);
							break;
						case 'succ':
							msg = '등록된 이메일 주소로 새 비밀번호를 발송해드렸습니다';
							params = {
								message: msg,
								doAction: () => {
									this.$emit('close','hide');
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
    .find-page-content {
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
            .tip {
                margin-top:-7px;
                font-size:10pt;
                font-weight:bold;
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
                    width: 50%;
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
                                width: 30px;
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
                                width: 30px;
                            }
                        }
                        .button-text {
                            font-size: 11pt;

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