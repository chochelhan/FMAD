<template>
    <div class="cfg-contents">
        <form novalidate @submit.prevent="validate">
            <v-textarea
                label="이용약관"
                outlined
                v-model="agree"
                rows="18"
                :error-messages="agreeErrors"
                @input="$v.agree.$touch()"
                @blur="$v.agree.$touch()"
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
		name: 'AGRCFG',
		mixins: [validationMixin],
		validations: {
			agree: {required},
       },
		computed: {
			agreeErrors() {
				const errors = []
				if (!this.$v.agree.$dirty) return errors
				!this.$v.agree.required && errors.push('이용약관을 입력하세요')
				return errors
			}
		},
		data() {
			return {
				agree: '',
				overlay:false,
			}
		},
		created() {
			this.getData();
		},
		methods: {
			getData() {
				const frm = new FormData()
				frm.append('mode','agree')
				this.$http.post(API_URL_MEMBER_ADMIN_GETCONFIG, frm, {headers: CONFIG_HEADER_POST}).then(res => {
					if(res.data.result=='succ') {
						this.agree = res.data.info.content;

					}

				});
			},
			validate() {
				if(this.overlay)return;

				this.$v.$touch()
				if (!this.$v.$anyError) {
					const frm = new FormData()
					frm.append('mode','agree')
					frm.append('content',this.agree)
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