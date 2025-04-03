<template>
    <div class="mypage-container">

        <div v-if="mobileView" class="top-menu-bar">
            <div class="top-menu-bar-content">
                <div class="back-button" @click="$router.go(-1)">
                    <i class="fas fa-chevron-left"></i>
                </div>
                <span class="m-title">엑셀로 업로드 </span>

            </div>
        </div>
        <div :class="'contents '+mobileClass">
            <div class="from-box">

                <div v-if="!mobileView" class="stitle"><span class="line">엑셀로 업로드 </span>
                    <span class="question-box">
                                    <i class="fas fa-question">
                                        <div class="menu-title-tip">
                                            엑셀로 업로드
                                            <div class="description">
                                            엑셀 업로드를 통해 보다 간편하게 시험 문제를 출제할 수 있습니다.
                                            시험의 기본적인 정보인 시험명, 출제자 정보와 해당 시험에 배당된 시간과 배점을 입력해 주세요.
                                            이후 문제 설정은 엑셀 템플릿을 다운로드하고 엑셀에 문제 입력 후 파일을 업로드하면 됩니다.
                                            <br><br>
                                            자세한 내용은 하단의 ‘자세히 알아보기’를 눌러 예시 화면을 살펴보세요
                                            </div>
                                        </div>
                                    </i>
                    </span>
                </div>
                <div class="title-desc">엑셀 업로드를 통해 보다 간편하게 시험 문제를 출제할 수 있습니다.</div>

                <div class="question-answer-box">
                    <v-expand-transition>
                        <div id="guide-description" v-if="guideShow">
                            <div class="img">
                            <img style="max-width:100%;" src="../../../assets/guideImg/05_guide.jpg">
                            </div>
                        </div>
                    </v-expand-transition>
                    <div class="quide-title-box" @click="guideToggle()">
                        <div :class="'quide-title '+guideClass">{{guideTitle}}</div>
                        <div class="guide-icon-box">
                            <div class="guide-icon">
                                <i  v-if="!guideShow" class="fas fa-angle-down"></i>
                                <i  v-else class="fas fa-angle-up"></i>
                            </div>
                        </div>
                    </div>
                </div>
                <form novalidate @submit.prevent="validate">
                    <ul class="field-box">
                        <li>
                            <div class="required-icon">시험명 입력</div>
                            <div class="field-input">
                                <v-text-field
                                    v-model="name"
                                    required
                                    placeholder="시험명을 입력하세요"
                                    :error-messages="nameErrors"
                                    @input="$v.name.$touch()"
                                    @blur="$v.name.$touch()"
                                    outlined
                                ></v-text-field>
                            </div>
                        </li>
                        <li>
                            <div class="required-icon">출제자 입력</div>
                            <div class="field-input">
                                <v-text-field
                                    v-model="author"
                                    required
                                    placeholder="출제자를 입력하세요"
                                    :error-messages="authorErrors"
                                    @input="$v.author.$touch()"
                                    @blur="$v.author.$touch()"
                                    outlined
                                ></v-text-field>
                            </div>
                        </li>
                        <li>
                            <div class="required-icon">제한시간 입력</div>
                            <div class="field-input">
                                <v-text-field
                                    v-model="timelimit"
                                    required
                                    placeholder="제한시간을 숫자로 입력하세요 (단위:분)"
                                    :error-messages="timelimitErrors"
                                    @input="$v.timelimit.$touch()"
                                    @blur="$v.timelimit.$touch()"
                                    outlined
                                ></v-text-field>
                            </div>
                        </li>
                        <li style="padding-bottom:30px;">
                            <div class="required-icon">엑셀 템플릿 다운로드</div>
                            <div class="field-input">
                                <v-btn
                                    type="button"
                                    class="down-button"
                                >
                                    엑셀 템플릿 다운로드
                                </v-btn>
                            </div>
                        </li>
                        <li>
                            <div class="required-icon">파일 업로드</div>
                            <div class="field-input">
                                <div class="file-box">
                                    <div class="file-names">
                                        {{fileName}}

                                    </div>
                                    <div class="file-click">
                                        <input ref="imgContainer" @change="onChangeImg" type="file" accept=".xls,.xlsx"
                                               id="vfile">
                                        파일 찾기
                                    </div>
                                </div>
                            </div>
                        </li>

                    </ul>

                    <p class="submit-button-box">
                        <v-btn
                            type="button"
                            class="cancle-button"
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

    </div>
</template>


<script>
	import {validationMixin} from 'vuelidate'
	import {required, numeric} from 'vuelidate/lib/validators'
	import {mapGetters} from "vuex";
	import {
		API_URL_BROADCAST_LIVE_EXAM_EXCEL_INSERT,
	} from '../../../api/urls';
	import apiService from '../../../api/apiService';

	export default {
		name: 'examSettingExcel',
		mixins: [validationMixin],
		validations: {
			name: {required},
			author: {required},
			timelimit: {required,numeric},

		},
		computed: {
			...mapGetters('etc', ["getGno"]),
			nameErrors() {
				const errors = []
				if (!this.$v.name.$dirty) return errors
				if (!this.$v.name.required) {
					errors.push('시험명을 입력하세요')
				}
				return errors
			},
			authorErrors() {
				const errors = []
				if (!this.$v.author.$dirty) return errors
				if (!this.$v.author.required) {
					errors.push('출제자를 입력하세요')
				}
				return errors
			},
			timelimitErrors() {
				const errors = []
				if (!this.$v.timelimit.$dirty) return errors
				if (!this.$v.timelimit.required) {
					errors.push('제한시간을 입력하세요')
				}
				if (!this.$v.timelimit.numeric) {
					errors.push('제한시간은 숫자만 입력가능합니다')
				}

				return errors
			},


		},
		data() {
			return {
				insertFlag: false,
				mobileView: false,
				mobileClass: '',
			    no: '',
				guideTitle:' 자세히 알아보기',
				guideShow:false,
				guideClass:'',
				name:'',
				author:'',
				timelimit:'',
				profileImg: '',
                fileName:'',
		    }
		},
		created() {
			this.no = this.getGno;
		},
		methods: {
			guideToggle() {
				if(this.guideShow) {
					this.guideShow = false;
					this.guideTitle = '자세히 알아보기'
					this.guideClass = ''
				} else {
					this.guideShow = true;
					this.guideTitle = '접기'
					this.guideClass = 'center'
				}
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
					if(!this.fileName) {
						let params = {
							message: '엑셀파일을 첨부하세요',
						};
						this.$eventBus.$emit('modalOpen', params);
						return;
					}
					this.formSubmit();
				}

			},
			formSubmit() {
				if (this.insertFlag) return;
				this.insertFlag = true;

				const frm = new FormData()
				frm.append('gno', this.no)
				frm.append('subject',this.name);
				frm.append('author',this.author);
				frm.append('timelimit',this.timelimit);
				frm.append('excelFile',this.profileImg);
				this.$eventBus.$emit('overlay', 'show');
				apiService.postFile(API_URL_BROADCAST_LIVE_EXAM_EXCEL_INSERT, frm, (res) => {
					this.$eventBus.$emit('overlay', 'hide');
					let params = {}
					this.insertFlag = false;
					params = {
						message: '정보가 저장되었습니다',

					};
					this.$eventBus.$emit('modalOpen', params);


				})
			},
		},

	}
</script>
<style lang="scss" scoped>
    .contents {
        .share {
            padding-right: 15px;
            cursor: pointer;
            img {
                margin-top: 8px;
                width: 40px;
            }
        }
        .down-button {
            width:100%;
            height:55px;
            border-radius:0;
            background:#207245;
            color:#fff;

        }
        .file-box {
            margin: 0 0 25px 0;
            display: flex;
            width: 100%;
            padding: 0;
            min-height: 50px;
            .file-names {
                width: 100%;
                border: solid 1px #9E9E9E;
                border-right: none;
                border-radius: 5px 0 0 5px;
                padding: 15px 0 0 10px;
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
                min-height: 60px;
                padding-top: 18px;
                #vfile, #dfile {
                    opacity: 0;
                    width: 100%;
                    position: absolute;
                    right: 0;
                    min-height: 60px;

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
        &.mobile {
            width: 100%;
            padding: 70px 20px 100px 20px;
            width: auto;

        }

    }


</style>