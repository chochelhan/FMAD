<template>
    <div class="page-container">

        <div class="contents">
            <div class="from-box">

                <div class="stitle">쇼핑몰 입점업체 로그인</div>
                <form novalidate @submit.prevent="validate">
                    <v-text-field
                        v-model="uid"
                        label="아이디"
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
                            color="primary"
                            class="submit-button"
                        >
                            로그인
                        </v-btn>
                    </p>

                </form>
            </div>
        </div>
        <div class="overlay"></div>
    </div>
</template>


<script>
	import AUTH from '../../api/auth'
	import {validationMixin} from 'vuelidate'
	import {required} from 'vuelidate/lib/validators'
	import apiService from '../../api/apiService';
	import {
		API_URL_MEMBER_SHOP_MANAGER_LOGIN,
	} from '../../api/urls';

	export default {
		name: 'shopManagerLogin',
		mixins: [validationMixin],
		validations: {
			uid: {required},
			upass: {required},
		},
		data() {
			return {
				uid: '',
				upass: '',
			}
		},
		created() {


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
		methods: {
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
				const frm = new FormData()
				frm.append('uid', this.uid)
				frm.append('upass', this.upass)

				apiService.post(API_URL_MEMBER_SHOP_MANAGER_LOGIN, frm,(res) => {
					let result = res.msg;
					let params = {}
					switch (result) {
						case 'not':
							params = {
								message: '잘못된 아이디 또는 비밀번호입니다',
							};
							this.$eventBus.$emit('modalOpen', params);
							break;
						case 'noAuth':
							params = {
								message: '미인증된 회원정보입니다',
							};
							this.$eventBus.$emit('modalOpen', params);
							break;

						case 'succ':
							let authData = {
								AUTHTOKEN: res.AUTHTOKEN,
								name: res.userInfo.name,
								uid: res.userInfo.uid,
								no: res.userInfo.no,
								APIKEY:res.apikey
							}
							AUTH.setSession(false, authData);
							params = {
								message: '로그인 되었습니다',
								doAction: () => {
									this.$emit('loginResult');
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
        background: url('../../assets/img/shop_manager.jpg') no-repeat;
        background-size: cover;
        padding:0;
        .overlay {
            width:100%;
            min-height: calc(100vh);
            background:rgba(0,0,0,0.1);
            position:absolute;
            top:0;
            left:0;

        }
        .contents {
            width: 400px;
            margin:-260px 0 0 -200px;
            height:490px;
            -webkit-box-shadow: 1px 1px 5px 1px rgba(0, 0,0, 0.3);
            -moz-box-shadow: 1px 1px 5px 1px rgba(0, 0, 0, 0.3);
            box-shadow: 1px 1px 5px 1px rgba(0, 0, 0, 0.3);
            background: #fff;
            border-radius: 10px;
            padding: 50px;
            position:absolute;
            top:50%;
            left:50%;
            z-index:10;
            .submit-button {
                margin: 40px 0 0 0;
                width: 100%;
                padding: 0;
                color: #fff;
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


        }

    }


</style>