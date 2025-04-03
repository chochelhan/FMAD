<template>
    <div>
        <v-dialog
            v-model="upassOpen"
            persistent
            class="dialog-container"
            max-width="500px"
            max-height="500px"
        >
            <div style="background:#fff;border-radius:10px;">
                <div
                    style="height:60px;text-align:center;position:relative;background:#fafafa;border-bottom:solid 1px #ccc;border-radius:10px 10px 0 0;">
                    <div style="font-weight:bold;font-size:15pt;line-height:60px;">작성자 정보</div>
                    <div class="dialog-button"
                         style="cursor:pointer;position:absolute;top:18px;right:18px;width:26px;height:26px;border-radius:15px;background:#000;color:#fff;line-height:30px;"
                         @click="upassOpen=false">
                        <i class="fas fa-times" style="margin:0 0 0 1px"></i></div>
                </div>
                <form novalidate @submit.prevent="upassvalidate">
                    <div class="form-box">
                        <ul class="form-basic">
                            <li class="item-list">
                                <v-text-field
                                    v-model="upass"
                                    type="password"
                                    label="비밀번호"
                                    @input="upassTouch()"
                                    @blur="upassTouch()"
                                    :error-messages="upassErrors"
                                    outlined
                                ></v-text-field>
                            </li>

                        </ul>
                        <div class="button-box">
                            <v-btn
                                class="cancle-button"
                                type="button"
                                rounded
                                @click="upassOpen=false"
                            >
                                취 소
                            </v-btn>
                            <v-btn
                                class="reg-button"
                                color="primary"
                                type="submit"
                                rounded
                            >
                                확 인
                            </v-btn>
                        </div>
                    </div>
                </form>
            </div>

        </v-dialog>
    </div>
</template>


<script>
	import {
		API_URL_BOARD_ARTICLE_INFO,
		API_URL_BOARD_ADMIN_ARTICLE_INFO,
		CONFIG_HEADER_POST
	} from '../../api/urls';

	export default {
		name: 'upassDoalog',
       data() {
			return {
				upassOpen:false,
				upass:'',
				upassErrors:[],
				doAction:'',
			}
		},
		created() {
			this.$eventBus.$on('upassOpen', this.openUpass);
		},
		methods: {
			openUpass(params) {
				this.upassErrors = [];
			    this.upass = '';
			    this.upassOpen = true;
				this.doAction = params.doAction;
			},
			upassTouch() {
				this.upassErrors = [];
				if (!this.upass) {
					this.upassErrors.push('비밀번호를 입력하세요')
				} else {
					if(this.upass.length>10) {
						this.upassErrors.push('비밀번호는 10자 이하로 입력하세요')
                    }
                }

			},
			upassvalidate() {
				if (!this.upass) {
					this.upassErrors = [];
					this.upassErrors.push('비밀번호를 입력하세요')
                    return;
				}
				if(this.upass.length>10) {
					this.upassErrors.push('비밀번호는 10자 이하로 입력하세요')
                    return;
				}
				this.upassOpen = false;
				this.doAction(this.upass);

            }
		},
		mounted() {

		}

	}
</script>

<style lang="scss" scoped="true">
    .form-box {
        padding: 50px 20px 40px 20px;
        .form-basic {
            padding:0;
        }
        .button-box {
            text-align: center;
            margin-top:40px;
            .cancle-button {
                width: 150px;
                height: 50px;
                background: #999;
                color: #fff;
                margin-right: 20px;
            }
            .reg-button {
                width: 150px;
                height: 50px;

            }
        }
    }


</style>