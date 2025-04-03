<template>
    <div class="cfg-contents">
        <form novalidate @submit.prevent="validate">
            <v-textarea
                label="개인정보 처리방침"
                outlined
                v-model="privacy"
                rows="18"
                :error-messages="privacyErrors"
                @input="$v.privacy.$touch()"
                @blur="$v.privacy.$touch()"
            ></v-textarea>
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
	import { required } from 'vuelidate/lib/validators'

	import {
		API_URL_MEMBER_ADMIN_INSERTCONFIG,
		API_URL_MEMBER_ADMIN_GETCONFIG,
		CONFIG_HEADER_POST
	} from '../../../../api/urls';

	export default {
		name: 'PRVCFG',
		mixins: [validationMixin],
		validations: {
			privacy: {required},
		},
		computed: {
			privacyErrors() {
				const errors = []
				if (!this.$v.privacy.$dirty) return errors
				!this.$v.privacy.required && errors.push('개인정보 처리방침을 입력하세요')
				return errors
			}
		},
		data() {
			return {
				privacy: '',
				overlay:false,
			}
		},
		created() {
			this.getData();
		},
		methods: {
			getData() {
				const frm = new FormData()
				frm.append('mode','privacy')
				this.$http.post(API_URL_MEMBER_ADMIN_GETCONFIG, frm, {headers: CONFIG_HEADER_POST}).then(res => {
					console.log(res)

					if(res.data.result=='succ') {
						this.privacy = res.data.info.content;

					}

				});
			},
			validate() {
				if(this.overlay)return;
				this.$v.$touch()
				if (!this.$v.$anyError) {
					const frm = new FormData()
					frm.append('mode','privacy')
					frm.append('content',this.privacy)
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

	}
</script>

<style lang="scss" scoped="true">


</style>