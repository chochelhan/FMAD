<template>
    <div :class="'mypage-container '+mobileClass">

        <div class="contents">
            <div class="from-box">
                <div v-if="!mobileView" class="stitle">
                    <span>방송 만들기</span>
                </div>
                <div  v-if="!mobileView" class="title-desc">실시간 방송을 진행할 URL을 입력해주세요</div>
                <form novalidate @submit.prevent="validate">
                    <ul class="field-box">
                        <li>
                            <div class="required-icon">제목</div>
                            <div class="field-input">
                                <v-text-field
                                    v-model="name"
                                    required
                                    :error-messages="nameErrors"
                                    @input="$v.name.$touch()"
                                    @blur="$v.name.$touch()"
                                    :dense="dense"
                                    outlined
                                ></v-text-field>
                            </div>
                        </li>
                        <li>
                            <div class="required-icon">YOUTUBE URL</div>
                            <div class="field-input">
                                <v-text-field
                                    v-model="youtubeUrl"
                                    required
                                    :error-messages="youtubeUrlErrors"
                                    @input="$v.youtubeUrl.$touch()"
                                    @blur="$v.youtubeUrl.$touch()"
                                    outlined
                                    :dense="dense"
                                ></v-text-field>
                            </div>
                        </li>

                    </ul>
                    <p class="submit-button-box">
                        <v-btn
                            type="button"
                            class="cancle-button"
                            v-if="!mobileView"
                        >
                            취소
                        </v-btn>
                        <v-btn
                            type="submit"
                            class="submit-button"
                        >
                            저장
                        </v-btn>
                    </p>

                </form>
            </div>

        </div>
        <div id="virtual-player" style="display:none"></div>
    </div>
</template>


<script>
	import {validationMixin} from 'vuelidate'
	import {required} from 'vuelidate/lib/validators'
	import {
		API_URL_BROADCAST_LIVE_INSERT,
	} from '../../../api/urls';
	import apiService from '../../../api/apiService';
    import {mapActions} from "vuex";

	export default {
		name: 'broadcastMake',
		mixins: [validationMixin],
		validations: {
			name: {required},
			youtubeUrl: {required},
		},
		data() {
			return {
				insertFlag: false,
				name: '',
				mobileView: false,
				mobileClass: '',
				youtubeUrl: '',
				videoId:'',
                dense:false,


			}
		},
		created() {
            if (this.$isMobile()) {
                this.mobileView = true;
                this.mobileClass = 'mobile'
                this.setClass('sub')
                this.setTitle('방송 만들기');
                this.setBackUrl('');
                this.dense = true
            }
		},
		computed: {
			nameErrors() {
				const errors = []
				if (!this.$v.name.$dirty) return errors
				!this.$v.name.required && errors.push('제목을 입력하세요')
				return errors
			},
			youtubeUrlErrors() {
				const errors = []
				if (!this.$v.youtubeUrl.$dirty) return errors
				!this.$v.youtubeUrl.required && errors.push('youtube Url을 입력하세요')
				return errors
			},


		},
		methods: {
            ...mapActions('mobile', ["setClass", "setTitle", "setBackUrl"]),
			validate() {
				this.$v.$touch()
				if (!this.$v.$anyError) {
					let matches = this.youtubeUrl.match(/https:\/\/(?:www\.)?youtube.*watch\?v=([a-zA-Z0-9\-_]+)/);
					if (matches) {
						let urls = this.youtubeUrl.split('watch?v=');
						if (urls[1]) {
							let urls2 = urls[1].split('&');
							this.videoId = urls2[0];
						} else {
							let params = {
								message: '잘못된 YOUTUBE URL 입니다',

							};
							this.$eventBus.$emit('modalOpen', params);
							return;
						}
					} else {
						let matches2 = this.youtubeUrl.match('https://youtu.be/');
						if (matches2) {
							this.videoId = this.youtubeUrl.replace('https://youtu.be/', '');
						} else {
							let params = {
								message: '잘못된 YOUTUBE URL 입니다',

							};
							this.$eventBus.$emit('modalOpen', params);
							return;
						}
					}

					this.formSubmit();
				}


			},
			formSubmit() {
				if (this.insertFlag) return;
				this.insertFlag = true;

				const frm = new FormData()
				frm.append('title', this.name)
                let url = 'https://youtu.be/'+this.videoId;
				frm.append('url', url)
				this.$eventBus.$emit('overlay', 'show');
				apiService.postFile(API_URL_BROADCAST_LIVE_INSERT, frm, (res) => {
					this.$eventBus.$emit('overlay', 'hide');
					let params = {}
					this.insertFlag = false;
					params = {
						message: '정보가 저장되었습니다',
						doAction: () => {
							this.$router.push('/live/' + res.no + '/liveInfo');
						}
					};
					this.$eventBus.$emit('modalOpen', params);


				})
			},

		}
	}
</script>
<style lang="scss" scoped>
.mobile {
    .submit-button-box {
        width:100%;
        display:block;
        .submit-button {
            min-width:100%;
        }
    }
}


</style>