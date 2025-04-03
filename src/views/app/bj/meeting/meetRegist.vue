<template>
    <div class="modal-container">
        <form novalidate @submit.prevent="validate">
            <div class="contents">
                <div class="from-box">

                    <!--div class="stitle"><span>{{title}}</span></div-->
                    <ul class="field-box">
                        <li>
                            <v-text-field
                                v-model="name"
                                required
                                label="모임명"
                                placeholder="모임명을 입력해주세요"
                                dense
                                :error-messages="nameErrors"
                                @input="$v.name.$touch()"
                                @blur="$v.name.$touch()"
                                outlined
                            ></v-text-field>
                        </li>
                        <li>
                            <v-text-field
                                v-model="gdate"
                                required
                                label="모임일시"
                                placeholder="모임일시를 입력해주세요"
                                dense
                                :error-messages="gdateErrors"
                                @input="$v.gdate.$touch()"
                                @blur="$v.gdate.$touch()"
                                outlined
                            ></v-text-field>
                        </li>
                        <li>
                            <v-text-field
                                v-model="garea"
                                required
                                label="장소"
                                placeholder="장소를 입력해주세요"
                                dense
                                :error-messages="gareaErrors"
                                @input="$v.garea.$touch()"
                                @blur="$v.garea.$touch()"
                                outlined
                            ></v-text-field>
                        </li>
                        <li>
                            <v-text-field
                                v-model="price"
                                required
                                label="비용"
                                placeholder="비용을 입력해주세요"
                                dense
                                :error-messages="priceErrors"
                                @input="$v.price.$touch()"
                                @blur="$v.price.$touch()"
                                outlined
                            ></v-text-field>
                        </li>
                        <li>
                            <v-text-field
                                v-model="gcnt"
                                required
                                label="최대 참가인원"
                                placeholder="최대 참가인원을 입력해주세요"
                                dense
                                :error-messages="gcntErrors"
                                @input="$v.gcnt.$touch()"
                                @blur="$v.gcnt.$touch()"
                                outlined
                            ></v-text-field>
                        </li>

                        <li>
                            <v-textarea
                                label="내용"
                                placeholder="내용을 입력해주세요"
                                outlined
                                v-model="content"
                                :error-messages="contentErrors"
                                @input="$v.content.$touch()"
                                @blur="$v.content.$touch()"
                                rows="4"
                            ></v-textarea>
                        </li>
                        <li>
                            <div class="file-desc">이미지 등록</div>
                            <div class="file-box">
                                <div class="file-names">
                                    {{fileName}}

                                </div>
                                <div class="file-click">
                                    <input ref="imgContainer" @change="onChangeImg" type="file" accept="image/*"
                                           id="vfile">
                                    파일 찾기
                                </div>
                            </div>
                        </li>

                    </ul>


                </div>
            </div>
            <p :class="'submit-button-box '+mobileClass">
                <v-btn
                    type="button"
                    class="cancle-button"
                    @click="boxHide()"
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
</template>


<script>
	import AUTH from '../../../../api/auth'
	import UTIL from '../../../../api/util'
	import {validationMixin} from 'vuelidate'
	import {required, numeric} from 'vuelidate/lib/validators'
	import {
		API_URL_MEET_INFO,
		API_URL_MEET_UPDATE,
	} from '../../../../api/urls';
	import apiService from '../../../../api/apiService';

	export default {
		name: 'meetRegist',
		mixins: [validationMixin],
		props: ["ownerUid", "no"],
		validations: {
			name: {required},
			gdate: {required},
			garea: {required},
			price: {required},
			gcnt: {required, numeric},
			content: {required},
		},
		data() {
			return {
                mobileView: false,
                mobileClass: '',
				insertFlag: false,
				title: '모임 만들기',
				name: '',
				gdate: '',
				garea: '',
				price: '',
				gcnt: '',
				content: '',
				profileImg: '',
				fileName: '',
                mobileOwnerUid:'',
                mobileNo:'',
			}
		},
		created() {
            if (this.$isMobile()) {
                this.mobileView = true;
                this.mobileClass = 'mobile'
                this.mobileOwnerUid = this.$route.params.uid;
                this.mobileNo = this.$route.params.no;
            }
			if (this.no || this.mobileNo) {
				this.getData();
			}
		},
		computed: {
			nameErrors() {
				const errors = []
				if (!this.$v.name.$dirty) return errors
				if (!this.$v.name.required) {
					errors.push('모임명을 입력하세요')
				}

				return errors
			},
			gdateErrors() {
				const errors = []
				if (!this.$v.gdate.$dirty) return errors
				if (!this.$v.gdate.required) {
					errors.push('모임일시를 입력하세요')
				}
				return errors
			},
			gareaErrors() {
				const errors = []
				if (!this.$v.garea.$dirty) return errors
				if (!this.$v.garea.required) {
					errors.push('장소를 입력하세요')
				}
				return errors
			},
			priceErrors() {
				const errors = []
				if (!this.$v.price.$dirty) return errors
				if (!this.$v.price.required) {
					errors.push('비용을 입력하세요')
				}
				return errors
			},
			gcntErrors() {
				const errors = []
				if (!this.$v.gcnt.$dirty) return errors
				if (!this.$v.gcnt.required) {
					errors.push('참가인원을 입력하세요')
					return errors
				}
				if (!this.$v.gcnt.numeric) {
					errors.push('참가인원은 숫자만 입력가능합니다')
					return errors
				}

			},
			contentErrors() {
				const errors = []
				if (!this.$v.content.$dirty) return errors
				if (!this.$v.content.required) {
					errors.push('내용을 입력하세요')
				}
				return errors
			},


		},
		methods: {
			getData() {
				const frm = new FormData()
                if(this.mobileNo) {
                    frm.append('no', this.mobileNo)
                } else frm.append('no', this.no)
				apiService.post(API_URL_MEET_INFO, frm, (res) => {
					if (res.info.no) {
						this.name = res.info.name;
						this.gdate = res.info.gdate;
						this.garea = res.info.garea;
						this.price = res.info.price;
						this.content = UTIL.br2nl(res.info.content);
						this.gcnt = res.info.gcnt;
						this.fileName = res.info.imgs.name;
						//this.img = this.host+res.info.imgs.img
						//this.no = res.info.no;
					}
				});
			},
			onChangeImg() {
				const imgObj = this.$refs.imgContainer.files;
				let img = imgObj.length > 0 ? imgObj[0] : null;
				this.fileName = img.name;
				this.profileImg = img;


			},
			validate() {

				this.$v.$touch()
				if (!this.$v.$anyError) {
					this.formSubmit();
				}


			},
			boxHide() {
				this.$emit('modalHide', 'none')
			},
			formSubmit() {
				if (this.insertFlag) return;
				if (!this.fileName) {
					let params = {
						message: '이미지를 첨부하세요',

					};
					this.$eventBus.$emit('modalOpen', params);
					return;
				}
				this.insertFlag = true;

				const frm = new FormData()
				frm.append('name', this.name)
				if (this.no) frm.append('no', this.no)
                else if(this.mobileNo) frm.append('no', this.mobileNo)

				if (this.profileImg) {
					frm.append('profileimg', this.profileImg)
				}
				frm.append('gdate', this.gdate)
				frm.append('garea', this.garea)
				frm.append('price', this.price)
				frm.append('gcnt', this.gcnt)
				frm.append('content', this.content)
                if(this.mobileOwnerUid) {
                    frm.append('ownerUid', this.mobileOwnerUid)
                } else {
                    frm.append('ownerUid', this.ownerUid)
                }

				this.$eventBus.$emit('overlay', 'show');
				apiService.postFile(API_URL_MEET_UPDATE, frm, (res) => {
					this.$eventBus.$emit('overlay', 'hide');
					let params = {}
					this.insertFlag = false;
					params = {
						message: '정보가 저장되었습니다',
						doAction: () => {
                            if (!this.$isMobile()) {
                                this.$emit('modalHide', 'reload')
                            }
						}
					};
                    if (this.$isMobile()) {
                        this.$router.back()
                    }
					this.$eventBus.$emit('modalOpen', params);


				})
			},
		},

	}
</script>
<style lang="scss" scoped>
    .modal-container {
        width: 100%;
        background: #fff;
        height: 670px;
        .submit-button-box {
            display: flex;
            width:100%;
            margin: 10px auto 0 auto;
            justify-content: space-between;
            .cancle-button {
                width:50%;
                border-radius: 0;
                padding: 0;
                background: #999999;
                color: #fff;
                height: 70px;
                font-size: 12pt;
            }
            .submit-button {
                width: 50%;
                border-radius: 0;
                padding: 0;
                background: #686EFB;
                color: #fff;
                height: 70px;
                font-size: 12pt;

            }
            &.mobile {
                position:fixed;
                bottom:0;
                .cancle-button {
                    height: 50px;
                    font-size: 12pt;
                    display:none;
                }
                .submit-button {
                    height: 50px;
                    width:100%;
                    font-size: 12pt;

                }
            }
        }
        .from-box {
            padding:35px 35px 25px 35px;
            height: 590px;
            overflow: auto;
            .stitle {
                font-size: 17pt;
                font-weight: bold;
                padding: 0 0 10px 0;
                color: #686EFB;
                border-bottom: solid 1px #dcdcdc;
                span {
                    padding-bottom: 13px;
                    border-bottom: solid 2px #686EFB;
                }
            }
            .title-desc {
                padding: 10px 0 40px 0;
                font-size: 10pt;
                color: #555;

            }
            .field-box {
                margin-top: 20px;
                padding: 0;
                & > li {
                    padding: 5px 0;
                    .file-desc {
                        font-size: 11pt;
                        color: #000;
                        margin: 0 0 5px 5px;

                    }
                    .file-box {
                        margin: 0 0 25px 0;
                        display: flex;
                        width: 100%;
                        padding: 0;
                        height: 40px;
                        .file-names {
                            width: 100%;
                            border: solid 1px #9E9E9E;
                            border-right: none;
                            border-radius: 5px 0 0 5px;
                            padding: 7px 0 0 10px;
                            i {
                                margin: 3px 0 0 7px;
                                cursor: pointer;
                            }

                        }
                        .file-click {
                            position: relative;
                            width: 200px;
                            background: #fff;
                            border: solid 1px #9E9E9E;
                            text-align: center;
                            color: #000;
                            cursor: pointer;
                            border-radius: 0 5px 5px 0;
                            height: 40px;
                            padding-top: 8px;
                            #vfile, #dfile {
                                opacity: 0;
                                width: 100%;
                                position: absolute;
                                right: 0;
                                min-height: 40px;

                                z-index: 2;
                            }
                            i {
                                position: relative;
                                top: 2px;
                                font-size: 15pt;
                                margin-right: 10px;

                            }
                        }
                    }
                }
            }
        }
    }


</style>