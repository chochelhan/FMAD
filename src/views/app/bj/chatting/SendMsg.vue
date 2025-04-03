<template>
    <div class="member-container">
        <div class="md-toolbar-row">
            <div class="md-icon-button" @click="goBack()">
                <i class="fas fa-chevron-left"></i>
            </div>
            <span class="gtitle">쪽지 보내기</span>
        </div>

        <form novalidate @submit.prevent="formSubmit">
            <div class="contents">
                <div class="from-box">

                    <ul class="field-box">


                        <li>
                            <v-textarea
                                label="내용"
                                placeholder="내용을 입력해주세요"
                                outlined
                                v-model="content"
                                :error-messages="contentErrors"
                                @input="$v.content.$touch()"
                                @blur="$v.content.$touch()"
                                rows="6"
                            ></v-textarea>
                        </li>
                    </ul>


                </div>
            </div>
            <p class="submit-button-box">
                <v-btn
                    type="submit"
                    class="submit-button"
                >
                    쪽지 보내기
                </v-btn>
            </p>
        </form>
    </div>

</template>

<script>
	import {
		HOST,
		API_URL_PAPER_MESSAGE_INSERT,
	} from '../../../../api/urls';
	import apiService from '../../../../api/apiService';
	import {validationMixin} from 'vuelidate'
	import {required, numeric} from 'vuelidate/lib/validators'

	export default {
		name: 'SendMsg',
		props: ["ownerUid", "targetMember", "sendUid"],
		mixins: [validationMixin],
		validations: {
			content: {required},
		},
		computed: {
			contentErrors() {
				const errors = []
				if (!this.$v.content.$dirty) return errors
				if (!this.$v.content.required) {
					errors.push('내용을 입력하세요')
				}
				return errors
			},
		},
		data() {
			return {
				content:'',
				insertFlag:false,
			}
		},
		created() {


		},
		methods: {
			goBack() {
				this.$emit('hideMessage',{type:'hide'})
			},
			formSubmit() {
				if(	this.insertFlag)return;
				this.$v.$touch()
				if (!this.$v.$anyError) {
					this.insertFlag = true;

					const frm = new FormData()
					frm.append('targetUid', this.targetMember.uid)
					frm.append('targetName', this.targetMember.name)
					frm.append('sendUid', this.sendUid)
					frm.append('ownerUid', this.ownerUid)
					frm.append('msg', this.content)

					apiService.postFile(API_URL_PAPER_MESSAGE_INSERT, frm, (res) => {
						this.insertFlag = false;

						let params = {
							message:'쪽지를 발송하였습니다',
                            doAction:()=>{
	                            this.$emit('hideMessage',{type:'hide'})
                            }
						}
						this.$eventBus.$emit('modalOpen', params);

					})
				}
			},


		},

	}
</script>

<style lang="scss" scoped>
    .member-container {
        padding: 0;
        margin: 0;
        width: 100%;
        background: #fff;
        .md-toolbar-row {
            display: flex;
            padding: 15px 20px 15px 20px;
            border-bottom: solid 1px #dfdfdf;
            .md-icon-button {
                width: 40px;
                cursor: pointer;
                font-weight: bold;
                color: #5A3FD2;
                font-size: 18pt;

            }
            .gtitle {
                font-weight: bold;
                color: #000;
                font-size: 12pt;
                padding-top: 5px;

            }
        }
        .contents {
            padding:50px 30px;
            ul {
                padding:0;
            }

        }
        .submit-button-box {
            padding: 10px 0 30px 0;
            text-align:center;

            .submit-button {
                width: 200px;
                border-radius: 0;
                padding: 0;
                background: #686EFB;
                margin:auto;
                color: #fff;
                height: 50px;
                font-size: 12pt;

            }
        }
    }


</style>