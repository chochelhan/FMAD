<template>
    <div class="cfg-contents">
        <form novalidate @submit.prevent="validate">
            <div class="form-item">

                <ul class="title-box">
                    <li class="item-title">네이버 로그인 사용여부</li>
                    <li>
                        <div class="item">
                            <v-switch
                                v-model="nvcfg"
                                label=""
                                inset
                            ></v-switch>
                        </div>
                    </li>
                </ul>
                <v-expand-transition>
                    <div class="form-sub-box" v-if="nvcfg">
                        <div class="tip-box">
                            네이버 개발자 센터에서 발급 받은 client_id 와 client_secret 를 입력하세요<br>
                            로그인 앱 등록시에 RETURN URL은 반드시 하단의 로그인 RETURN URL, 회원가입 RETURN URL 값 두개를 입력하셔야 합니다
                        </div>
                        <v-text-field
                            v-model="nvkey"
                            label="네이버 API CLIENT_ID"
                            :error-messages="nvkeyErrors"
                            @input="$v.nvkey.$touch()"
                            @blur="$v.nvkey.$touch()"
                            outlined
                            dense
                        ></v-text-field>
                        <v-text-field
                            v-model="nvsec"
                            label="네이버 API CLIENT_SECRET"
                            :error-messages="nvsecErrors"
                            @input="$v.nvsec.$touch()"
                            @blur="$v.nvsec.$touch()"
                            outlined
                            dense
                        ></v-text-field>
                        <ul class="callback-box">
                            <li class="label">로그인 RETURN URL</li>
                            <li>
                                {{naverLoginReturnUrl}}
                            </li>
                            <li class="button">
                                <v-btn
                                    class="copy-button"
                                    color="primary"
                                    type="button"
                                    rounded
                                    outlined
                                    @click="copyLink(naverLoginReturnUrl)"
                                >
                                    링크복사
                                </v-btn>
                            </li>

                        </ul>
                        <ul class="callback-box">
                            <li class="label">회원가입 RETURN URL</li>
                            <li>
                                {{naverJoinReturnUrl}}
                            </li>
                            <li class="button">
                                <v-btn
                                    class="copy-button"
                                    color="primary"
                                    type="button"
                                    rounded
                                    outlined
                                    @click="copyLink(naverJoinReturnUrl)"
                                >
                                    링크복사
                                </v-btn>
                            </li>
                        </ul>
                        <div style="height:10px"></div>

                    </div>

                </v-expand-transition>
            </div>
            <div class="form-item">
                <ul class="title-box">
                    <li class="item-title">카카오 로그인 사용여부</li>
                    <li>
                        <div class="item">
                            <v-switch
                                v-model="kacfg"
                                label=""
                                inset
                            ></v-switch>
                        </div>
                    </li>
                </ul>
                <v-expand-transition>
                    <div class="form-sub-box" v-if="kacfg">
                        <div class="tip-box">
                            카카오 개발자 센터에서 발급 받은 REST API 키를 입력하세요 (<span>보안 설정을 한 경우에만 CLIENT_SECRET값을 입력하세요</span>)<br>

                            로그인 앱 등록시에 RETURN URL은 반드시 하단의 로그인 RETURN URL, 회원가입 RETURN URL 값 두개를 입력하셔야 합니다
                        </div>
                        <v-text-field
                            v-model="kakey"
                            label="카카오 REST API 키"
                            :error-messages="kakeyErrors"
                            @input="$v.kakey.$touch()"
                            @blur="$v.kakey.$touch()"
                            outlined
                            dense
                        ></v-text-field>

                        <v-text-field
                            v-model="kasec"
                            label="카카오톡 API CLIENT_SECRET"
                            outlined
                            dense
                        ></v-text-field>
                        <ul class="callback-box">
                            <li class="label">로그인 RETURN URL</li>
                            <li>
                                {{kakaoLoginReturnUrl}}
                            </li>
                            <li class="button">
                                <v-btn
                                    class="copy-button"
                                    color="primary"
                                    type="button"
                                    rounded
                                    outlined
                                    @click="copyLink(kakaoLoginReturnUrl)"
                                >
                                    링크복사
                                </v-btn>
                            </li>

                        </ul>
                        <ul class="callback-box">
                            <li class="label">회원가입 RETURN URL</li>
                            <li>
                                {{kakaoJoinReturnUrl}}
                            </li>
                            <li class="button">
                                <v-btn
                                    class="copy-button"
                                    color="primary"
                                    type="button"
                                    rounded
                                    outlined
                                    @click="copyLink(kakaoJoinReturnUrl)"
                                >
                                    링크복사
                                </v-btn>
                            </li>
                        </ul>
                        <div style="height:10px"></div>

                    </div>
                </v-expand-transition>
            </div>
            <div class="submit-button-box">
                <v-btn
                    class="submit-button"
                    color="primary"
                    type="submit"
                    rounded

                >
                    확 인
                </v-btn>
            </div>
        </form>
        <input type="hidden" id="copy-code" :value="copyLinkUrl">
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
	import {validationMixin} from 'vuelidate'
	import {required} from 'vuelidate/lib/validators'


	import {
		API_URL_MEMBER_ADMIN_INSERTCONFIG,
		API_URL_MEMBER_ADMIN_GETCONFIG,
		CONFIG_HEADER_POST
	} from '../../../../api/urls';

	export default {
		name: 'SNSCFG',
		data() {
			return {
				kacfg: false,
				nvcfg: false,
				kakey: '',
				nvkey: '',
				kasec: '',
				nvsec: '',
				overlay: false,
				naverJoinReturnUrl: '',
				naverLoginReturnUrl: '',
				kakaoJoinReturnUrl: '',
				kakaoLoginReturnUrl: '',
				copyLinkUrl: '',

			}
		},
		mixins: [validationMixin],
		validations: {
			nvkey: {required},
			kakey: {required},
			nvsec: {required},
		},
		computed: {
			kakeyErrors() {
				const errors = []
				if (!this.$v.kakey.$dirty) return errors
				!this.$v.kakey.required && errors.push('카카오 rest api 키 를 입력하세요')
				return errors
			},
			nvkeyErrors() {
				const errors = []
				if (!this.$v.nvkey.$dirty) return errors
				!this.$v.nvkey.required && errors.push('네이버 api client_id 를 입력하세요')
				return errors
			},
			nvsecErrors() {
				const errors = []
				if (!this.$v.nvsec.$dirty) return errors
				!this.$v.nvsec.required && errors.push('네이버 api client_secret 를 입력하세요')
				return errors
			},
		},
		created() {
			this.getData();
			this.naverJoinReturnUrl = window.location.protocol + '//' + window.location.host + '/api/member/naverJoin';
			this.naverLoginReturnUrl = window.location.protocol + '//' + window.location.host + '/api/member/naverLogin';
			this.kakaoJoinReturnUrl = window.location.protocol + '//' + window.location.host + '/api/member/kakaoJoin';
			this.kakaoLoginReturnUrl = window.location.protocol + '//' + window.location.host + '/api/member/kakaoLogin';

		},
		methods: {
			getData() {
				const frm = new FormData()
				frm.append('mode', 'sns')
				this.$http.post(API_URL_MEMBER_ADMIN_GETCONFIG, frm, {headers: CONFIG_HEADER_POST}).then(res => {
					if (res.data.result == 'succ') {
						let info = res.data.info.content;
						this.kacfg = (info.kacfg == 'yes') ? true : false;
						this.nvcfg = (info.nvcfg == 'yes') ? true : false;
						if (this.kacfg) {
							this.kakey = info.kakey;
							this.kasec = info.kasec;
						}
						if (this.nvcfg) {
							this.nvkey = info.nvkey;
							this.nvsec = info.nvsec;
						}
					}

				});
			},
			copyLink(url) {
				this.copyLinkUrl = url;
				let codeToCopy = document.querySelector('#copy-code')
				codeToCopy.setAttribute('type', 'text')
				codeToCopy.select()

				try {
					var successful = document.execCommand('copy');
					var msg = successful ? 'successful' : 'unsuccessful';
					let params = {
						message: '링크가 복사되었습니다',
					};
					this.$eventBus.$emit('modalOpen', params);
				} catch (err) {
					let params = {
						message: '링크 복사에 실패하였습니다',
					};
					this.$eventBus.$emit('modalOpen', params);
				}

				/* unselect the range */
				codeToCopy.setAttribute('type', 'hidden')
				window.getSelection().removeAllRanges()
			},
			validate() {
				if (this.overlay) return;
				this.$v.$touch()
				const frm = new FormData()
				frm.append('mode', 'sns')
				if (this.kacfg) {
					if(!this.$v.kakey.required) return;

					frm.append('kacfg', 'yes')
					frm.append('kakey', this.kakey)
					frm.append('kasec', this.kasec)

				} else {
					frm.append('kacfg', 'no')
					frm.append('kakey', '')
					frm.append('kasec', '')

				}
				if (this.nvcfg) {
					if (!this.$v.nvkey.required  || !this.$v.nvsec.required) return;

					frm.append('nvcfg', 'yes')
					frm.append('nvkey', this.nvkey)
					frm.append('nvsec', this.nvsec)
				} else {
					frm.append('nvcfg', 'no')
					frm.append('nvkey', '')
					frm.append('nvsec', '')
				}
				this.overlay = true;

				this.$http.post(API_URL_MEMBER_ADMIN_INSERTCONFIG, frm, {headers: CONFIG_HEADER_POST}).then(res => {
					this.overlay = false;
					let result = res.data.result;
					let params = {}
					switch (result) {
						case 'fail':
							params = {
								message: '시스템에러',
							};
							this.$eventBus.$emit('modalOpen', params);
							break;
						case 'succ':
							params = {
								message: '정보가 변경되었습니다',
							};
							this.$eventBus.$emit('modalOpen', params);

							break;
					}
				})

			}
		}

	}
</script>

<style lang="scss" scoped="true">
    .title-box {
        display: flex;
        justify-content: space-between;
        padding: 0;
        margin: 0;
        li {
            margin: 0;
            text-align: right;
            &.item-title {
                width: 200px;
                font-weight: bold;
                font-size: 11pt;
                text-align: left;

            }
            .item {
                margin-top: -20px;
            }

        }
    }
    .form-item {
        padding-bottom:10px;
    }
    .form-sub-box {
        .tip-box {
            background: #000;
            margin: 20px 0 30px 0;
            padding: 20px;
            color: #fff;
            font-size: 9pt;
            border-radius: 5px;
            span {
                color:#FFEB3B;
            }
        }
        .callback-box {
            display: flex;
            margin: 0 0 20px 0;
            padding: 0;
            width: 100%;
            justify-content: space-between;
            li {
                font-size: 11pt;
                color: #000;
                width: 500px;
                &.label {
                    width: 250px;
                    font-weight: bold;
                    color: #000;

                }
                &.button {
                    text-align: right;
                    width: 200px;
                    .copy-button {
                        margin-top: -5px;
                    }
                }
            }
        }
    }

    .submit-button-box {
        padding-top: 80px;
    }
</style>