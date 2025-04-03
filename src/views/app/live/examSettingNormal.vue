<template>
    <div class="mypage-container">

        <div v-if="mobileView" class="top-menu-bar">
            <div class="top-menu-bar-content">
                <div class="back-button" @click="$router.go(-1)">
                    <i class="fas fa-chevron-left"></i>
                </div>
                <span class="m-title">일반 설정</span>

            </div>
        </div>
        <div :class="'contents '+mobileClass">
            <div class="from-box">

                <div v-if="!mobileView" class="stitle"><span class="line">일반 설정</span>
                    <span class="question-box">
                                    <i class="fas fa-question">
                                        <div class="menu-title-tip">
                                              일반 설정
                <div class="description">
                  답안 즉시 공개를 설정하면, 시험을 마친 참가자에게 답안이 즉시 공개 됩니다.
시험문제 다운로드를 설정하면 시험을 마친 참가자는
해당 시험문제를 엑셀 파일 형태로 다운로드 받을 수 있는 버튼이 생성됩니다.

                <br><br>
                자세한 내용은 하단의 ‘자세히 알아보기’를 눌러 예시 화면을 살펴보세요
                                            </div>
                                        </div>
                                    </i>
                    </span>
                </div>
                <div class="title-desc"> 답안 즉시 공개를 설정하면, 시험을 마친 참가자에게 답안이 즉시 공개 됩니다.</div>

                <div class="question-answer-box">
                    <v-expand-transition>
                        <div id="guide-description" v-if="guideShow">
                            <div class="img">
                            <img style="max-width:100%;" src="../../../assets/guideImg/03_guide.jpg">
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
                            <div class="required-icon">답안 즉시 공개</div>
                            <div class="field-input">
                                <ul class="switch-ul">
                                    <li @click="setImm('yes')" :class="immClass.yes"> 예</li>
                                    <li @click="setImm('no')" :class="immClass.no"> 아니오</li>
                                </ul>
                            </div>
                        </li>
                        <li>
                            <div class="required-icon">시험문제 다운로드</div>
                            <div class="field-input">
                                <ul class="switch-ul">
                                    <li @click="setDown('yes')" :class="downClass.yes"> 예</li>
                                    <li @click="setDown('no')" :class="downClass.no"> 아니오</li>
                                </ul>
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
	import {mapGetters} from "vuex";
	import {
		API_URL_BROADCAST_LIVE_INFO,
		API_URL_BROADCAST_LIVE_UPDATE,
	} from '../../../api/urls';
	import apiService from '../../../api/apiService';

	export default {
		name: 'examSettingNormal',
		data() {
			return {
				insertFlag: false,
				mobileView: false,
				mobileClass: '',
			    no: '',
				guideTitle:' 자세히 알아보기',
				guideShow:false,
                guideClass:'',
				examImmAnswer:'yes',
			    examDown :'no',
                immClass: {
				    yes:'',
				    no:''
			    },
			    downClass:  {
					yes:'',
				    no:''
			    }
		    }
		},
		created() {
			this.no = this.getGno;
			this.getData();
		},
		computed: {
			...mapGetters('etc', ["getGno"]),

		},
		methods: {
			getData() {
				const frm = new FormData()
				frm.append('no', this.no)
				apiService.post(API_URL_BROADCAST_LIVE_INFO, frm, (res) => {
					if(res.info.examImmAnswer) {
						this.examImmAnswer = res.info.examImmAnswer;
						this.examDown = res.info.examDown;
						this.setImm(this.examImmAnswer);
						this.setDown(this.examDown);
					}
				});
			},
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

			setImm(cmd) {
				this.examImmAnswer = cmd;
				let yesActive = '';
				let noActive = '';
				switch(cmd) {
					case 'yes':
						yesActive = 'active';
						break;
					case 'no':
						noActive = 'active';
						break;
				}

				this.immClass = {
					yes:yesActive,
					no:noActive
				};
			},
			setDown(cmd) {
				this.examDown = cmd;
				let yesActive = '';
				let noActive = '';
				switch(cmd) {
					case 'yes':
						yesActive = 'active';
						break;
					case 'no':
						noActive = 'active';
						break;
				}

				this.downClass = {
					yes:yesActive,
					no:noActive
				};
			},

			validate() {
				this.formSubmit();

			},
			formSubmit() {
				if (this.insertFlag) return;
				this.insertFlag = true;

				const frm = new FormData()
				frm.append('no', this.no)
				frm.append('cmd', 'examSetting')

				frm.append('examImmAnswer',this.examImmAnswer)
				frm.append('examDown',this.examDown)

				this.$eventBus.$emit('overlay', 'show');
				apiService.postFile(API_URL_BROADCAST_LIVE_UPDATE, frm, (res) => {
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