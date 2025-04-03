<template>
    <div class="page-content">

        <div class="contents">
            <div class="from-box">
                <div class="stitle">{{title}}</div>
                <form novalidate @submit.prevent="validate">
                    <v-text-field
                        v-model="name"
                        label="이름"
                        required
                        @input="$v.name.$touch()"
                        @blur="$v.name.$touch()"
                        :error-messages="nameErrors"
                        outlined
                    ></v-text-field>

                    <v-text-field
                        v-model="pcs"
                        label="휴대폰 번호"
                        required
                        @input="$v.pcs.$touch()"
                        @blur="$v.pcs.$touch()"
                        :error-messages="pcsErrors"
                        outlined
                    ></v-text-field>
                    <v-text-field v-if="findType=='pw'"
                        v-model="email"
                        label="이메일 주소"
                        @input="emailTouch()"
                        @blur="emailTouch()"
                        :error-messages="emailErrors"
                        outlined
                    ></v-text-field>

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
		API_URL_MEMBER_FIND_IDPW,
	} from '../../../api/urls';
	import apiService from '../../../api/apiService'

	export default {
		name: 'modalFindId',
        props:["findType"],
		mixins: [validationMixin],
		validations: {
			name: {required},
			pcs: {required,numeric},
		},
		data() {
			return {
				name: '',
				pcs: '',
                title:'',
                email:'',
                emailErrors:[],
			}
		},
		created() {

			let memberInfo = AUTH.getSession(this.$isMobile());

			if (memberInfo.AUTHTOKEN) {
				this.$router.push({path: '/'});
				return;
			}
			this.title = (this.findType == 'id')?'아이디 찾기':'비밀번호 찾기';

		},
		computed: {
			nameErrors() {
				const errors = []
				if (!this.$v.name.$dirty) return errors
				!this.$v.name.required && errors.push('이름을 입력하세요')
				return errors
			},
			pcsErrors() {
				const errors = []
				if (!this.$v.pcs.$dirty) return errors
				if(!this.$v.pcs.required) {

					errors.push('휴대폰 번호를 입력하세요')
					return errors
				}
				if (!this.$v.pcs.numeric) {
					errors.push('휴대폰 번호는 숫자만 입력가능합니다')
					return errors
				}
			},
		},
		methods: {
			validate() {
				this.$v.$touch()
				if (!this.$v.$anyError) {
					if(this.findType=='pw' && !this.email) {
						this.emailTouch();
						return;
                    }
					this.formSubmit();
				}

			},
            emailTouch() {
	            this.emailErrors = []
	            if(!this.email) {
		            this.emailErrors.push('이메일 주소를 입력하세요')
	            }

            },
			formSubmit() {
				this.$eventBus.$emit('overlay', 'open');
				const frm = new FormData()
				frm.append('name', this.name)
				frm.append('pcs', this.pcs)
                if(this.findType=='pw')frm.append('email', this.email)
				frm.append('findType', this.findType)
				apiService.post(API_URL_MEMBER_FIND_IDPW, frm,(res) => {
					this.$eventBus.$emit('overlay', 'hide');
					let params = {}
					let msg = '';
					switch (res.msg) {
						case 'wrong':
							msg = (this.findType=='id')?'잘못된 이름 또는 휴대폰번호 입니다':'잘못된 이름 또는 휴대폰번호 또는 이메일 주소 입니다';
							params = {
								message:msg,
							};
							this.$eventBus.$emit('modalOpen', params);
							break;
						case 'succ':
							msg = (this.findType=='id')?'회원님의 아이디는 '+res.uid+' 입니다':'등록된 이메일 주소로 새 비밀번호를 발송해드렸습니다';
							params = {
								message: msg,
								doAction: () => {
									this.$emit('loginBoxMove','hide');
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