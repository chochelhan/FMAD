<template>
    <div class="mypage-container">

        <div v-if="mobileView" class="top-menu-bar">
            <div class="top-menu-bar-content">
                <div class="back-button" @click="$router.go(-1)">
                    <i class="fas fa-chevron-left"></i>
                </div>
                <span class="m-title">수기로 입력</span>

            </div>
        </div>
        <div :class="'contents '+mobileClass">
            <div class="from-box">

                <div v-if="!mobileView" class="stitle"><span class="line">수기로 입력</span>
                    <span class="question-box">
                                    <i class="fas fa-question">
                                        <div class="menu-title-tip">
                                             수기로 입력
                                            <div class="description">
                                            시험 문제 출제를 위한 설정을 진행할 수 있습니다.
                                            먼저 시험의 기본적인 정보인 시험명, 출제자 정보와 해당 시험에 배당된 시간과 배점을 입력해 주세요.
                                            이후 문제 설정을 클릭하여 문제 정보를 입력할 수 있습니다!
                                            <br><br>
                                             자세한 내용은 하단의 ‘자세히 알아보기’를 눌러 예시 화면을 살펴보세요
                                            </div>
                                        </div>
                                    </i>
                    </span>
                </div>
                <div class="title-desc">시험 문제 출제를 위한 설정을 진행할 수 있습니다.</div>

                <div class="question-answer-box">
                    <v-expand-transition>
                        <div id="guide-description" v-if="guideShow">
                            <div class="img">
                            <img style="max-width:100%;" src="../../../assets/guideImg/04_guide.jpg">
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
                <div v-if="!makeShow">
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
                        <li>
                            <div class="required-icon">총배점 입력</div>
                            <div class="field-input">
                                <v-text-field
                                    v-model="totalJumsu"
                                    required
                                    placeholder="총배점을 숫자로 입력하세요"
                                    :error-messages="totalJumsuErrors"
                                    @input="$v.totalJumsu.$touch()"
                                    @blur="$v.totalJumsu.$touch()"
                                    outlined
                                ></v-text-field>
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
                            문제 설정
                        </v-btn>
                    </p>

                </form>
                </div>
                <examDirectMake v-else :sendParams="sendParams" @backChange="makeShow=false"></examDirectMake>
            </div>

        </div>

    </div>
</template>


<script>

	import {validationMixin} from 'vuelidate'
	import {required, numeric} from 'vuelidate/lib/validators'
	import {mapGetters} from "vuex";
    import examDirectMake from './exam/examDirectMake'
	export default {
		name: 'examSettingDirect',
        components:{
	        examDirectMake
        },
		mixins: [validationMixin],
		validations: {
			name: {required},
			author: {required},
			timelimit: {required,numeric},
			totalJumsu: {required,numeric},

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
				totalJumsu:100,
				makeShow:false,
				sendParams:{},
		    }
		},
		created() {
			this.no = this.getGno;
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
			totalJumsuErrors() {
				const errors = []
				if (!this.$v.totalJumsu.$dirty) return errors
				if (!this.$v.totalJumsu.required) {
					errors.push('총배점을 입력하세요')
				}
				if (!this.$v.totalJumsu.numeric) {
					errors.push('총배점은 숫자만 입력가능합니다')
				}

				return errors
			},

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
			validate() {
				this.$v.$touch()
				if (!this.$v.$anyError) {
					this.sendParams = {
						name:this.name,
						author:this.author,
						timelimit:this.timelimit,
						totalJumsu: this.totalJumsu,
						sendType:'direct',
                        gno:this.no,
					}
					this.makeShow = true;
				}

			}
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
        .flex-box {
            display:flex;
            .chk {
                margin-right:20px;
            }
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