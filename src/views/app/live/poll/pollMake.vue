<template>
    <div class="mypage-container">

        <div v-if="mobileView" class="top-menu-bar">
            <div class="top-menu-bar-content">
                <div class="back-button" @click="$router.go(-1)">
                    <i class="fas fa-chevron-left"></i>
                </div>
                <span class="m-title">설문조사 관리</span>

            </div>
        </div>
        <div :class="'contents '+mobileClass">
            <div class="from-box">

                <div v-if="!mobileView" class="stitle"><span class="line">설문조사 관리</span>
                    <span class="question-box">
                                    <i class="fas fa-question">
                                        <div class="menu-title-tip">
                                              설문조사 관리
                <div class="description">
                   수업/회의에 사용할 설문조사 정보를 사전에 작업하여 저장할 수 있습니다.<br>
            설문조사 제목은 기본 정보로 꼭 입력합니다.<br><br>
          하단 문항 유형을 설정하고 제목을 입력하여 손쉽게 설문조사 정보를 설정할 수 있습니다.<br>
          자세한 내용은 하단의 ‘자세히 알아보기’를 눌러 예시 화면을 살펴보세요
                                            </div>
                                        </div>
                                    </i>
                    </span>
                </div>
                <div class="title-desc"> 수업/회의에 사용할 설문조사 정보를 사전에 작업하여 저장할 수 있습니다.</div>

                <div class="question-answer-box">
                    <v-expand-transition>
                        <div id="guide-description" v-if="guideShow">
                            <div class="img">
                                <img style="max-width:100%;" src="../../../../assets/guideImg/07_guide.jpg">
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
                            <div class="required-icon">설문조사 제목</div>
                            <div class="field-input">
                                <v-text-field
                                    v-model="subject"
                                    required
                                    placeholder="설문조사 제목을 입력하세요"
                                    :error-messages="subjectErrors"
                                    @input="$v.subject.$touch()"
                                    @blur="$v.subject.$touch()"
                                    outlined
                                ></v-text-field>
                            </div>
                        </li>
                        <li>
                            <div class="required-icon">문항 번호</div>
                            <div class="field-input">
                                <h3>{{problemIndex + 1}} 번</h3>
                            </div>
                        </li>
                        <li>
                            <div class="required-icon">문항 유형</div>
                            <div class="field-input">
                                <v-select
                                    v-model="prbType"
                                    :items="prbTypeList"
                                    outlined
                                    placeholder="문항유형을 선택하세요"
                                    :error-messages="prbTypeErrors"
                                    @input="$v.prbType.$touch()"
                                    @blur="$v.prbType.$touch()"
                                ></v-select>
                            </div>
                        </li>
                        <li>
                            <div class="required-icon">문항 제목</div>
                            <div class="field-input">
                                <v-text-field
                                    v-model="question"
                                    required
                                    placeholder="제목을 입력하세요"
                                    :error-messages="questionErrors"
                                    @input="$v.question.$touch()"
                                    @blur="$v.question.$touch()"
                                    outlined
                                ></v-text-field>
                            </div>
                        </li>
                    </ul>
                    <ul class="problem-ul"  v-if="prbType=='mchoice'">
                        <li class="list-title">
                            답<br>안<br>선<br>택
                        </li>
                        <li class="list-content">
                            <ul class="item-box">
                                <li v-for="(item,idx) in items">
                                    <div class="th">
                                        답안 선택 {{idx+1}}
                                    </div>
                                    <div class="td">
                                        <v-text-field
                                            v-model="item.answer"
                                            placeholder="답안 선택값을 입력해주세요"
                                            :error-messages="item.answerErrors"
                                            @input="itemAnswerTouch(idx)"
                                            @blur="itemAnswerTouch(idx)"
                                            outlined
                                        ></v-text-field>
                                    </div>
                                    <div class="control-box">
                                        <span v-if="idx==0 && addButtonShow" class="plus" @click="addProblemItem()" ><i class="fas fa-plus"></i></span>
                                        <span v-if="idx>0" @click="deleteProblemItem(idx)" ><i class="fas fa-minus"></i></span>
                                    </div>
                                </li>
                            </ul>
                        </li>
                    </ul>
                    <ul  class="field-box" v-if="prbType=='mchoice'">
                        <li>
                            <div class="required-icon">다중선택 허용여부</div>
                            <div class="field-input">
                                <v-select
                                    v-model="multigood"
                                    :items="multigoodList"
                                    outlined
                                    placeholder="다중선택 허용여부를 선택하세요"
                                    :error-messages="multigoodErrors"
                                    @input="multigoodTouch()"
                                    @blur="multigoodTouch()"
                                ></v-select>
                            </div>

                        </li>

                    </ul>
                    <p class="submit-button-box four-box">
                        <v-btn
                            type="button"
                            class="cancle-button"
                            @click="problemDelete()"
                        >
                            취소
                        </v-btn>
                        <v-btn
                            v-if="problemIndex>0"
                            type="button"
                            class="cancle-button"
                            @click="goBack()"
                        >
                            이전문제
                        </v-btn>
                        <v-btn
                            type="button"
                            class="submit-button"
                            @click="addProblem()"
                        >
                            저장하고 다음문제 설정
                        </v-btn>
                        <v-btn
                            type="submit"
                            class="submit-button"
                        >
                            출제완료
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
		API_URL_BROADCAST_LIVE_POLL_INSERT
	} from '../../../../api/urls';
	import apiService from '../../../../api/apiService';

	export default {
		name: 'pollMake',
		mixins: [validationMixin],
       validations: {
			prbType: {required},
			question: {required},
			subject: {required},

		},
       data() {
			return {
				insertFlag: false,
				mobileView: false,
				mobileClass: '',
				guideTitle:' 자세히 알아보기',
				guideShow:false,
				guideClass:'',
			    prbType:'',
				prbTypeList:[
                    {text:'객관식',value:'mchoice'},
					{text:'주관식',value:'subject'},
                ],
				multigood:'',
				multigoodErrors:[],
				multigoodList:[
					{text:'가능',value:'yes'},
					{text:'불가능',value:'no'},
				],
                subject:'',
				question:'',
				items:[],
				addButtonShow:true,
				problemList:[],
				problemIndex:0,
				gno:'',

		    }
		},
		created() {
            this.setChoiceProblem();
			this.gno = this.getGno;
		},
		computed: {
			...mapGetters('etc', ["getGno"]),
			prbTypeErrors() {
				const errors = []
				if (!this.$v.prbType.$dirty) return errors
				if (!this.$v.prbType.required) {
					errors.push('문항유형을 선택하세요')
				}
				return errors
			},
			subjectErrors() {
				const errors = []
				if (!this.$v.subject.$dirty) return errors
				if (!this.$v.subject.required) {
					errors.push('설문조사 제목을 입력하세요')
				}
				return errors
			},
			questionErrors() {
				const errors = []
				if (!this.$v.question.$dirty) return errors
				if (!this.$v.question.required) {
					errors.push('문항제목을 입력하세요')
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
			setChoiceProblem() {
				this.problemList = [];
				this.items = [];
				this.prbType = '';
				this.question = '';
				this.multigood = '';
				for(let i=0; i<5; i++) {
					let item = {answer: '', answerErrors:[]};
					this.items.push(item);
				}
			},
			itemAnswerTouch(idx) {
                this.items[idx].answerErrors = [];
                if(!this.items[idx].answer) {
	                this.items[idx].answerErrors.push((idx+1)+'번 답안을 입력하세요');
                }
            },
			multigoodTouch() {
				this.multigoodErrors = [];
				if(!this.multigood) {
					this.multigoodErrors.push('다중선택 허용여부를 선택하세요');
				}
			},
			addProblemItem() {
				let item = {answer: '', answerErrors:[]};
				this.items.push(item);
				if (this.items.length >= 5) {
					this.addButtonShow = false;
				}

			},
			deleteProblemItem(idx) {
				this.items.splice(idx, 1);
				if (this.items.length < 5) {
					this.addButtonShow = true;
				}
			},
			goBack() {
				//this.problemList.splice(this.problemIndex,1)
				this.problemIndex--;
				this.setProblem();

			},
			problemDelete() {
				this.problemIndex = 0;
				this.setChoiceProblem();
			},
			addProblem(){
				this.$v.$touch()
				if (!this.$v.$anyError) {
					let flag = true;
					if (this.prbType == 'mchoice') {
						let idx = 0;
						for (let item of this.items) {
							if (!item.answer) {
								flag = false;
								this.itemAnswerTouch(idx)
							}
							idx++;
						}
						if(!this.multigood) {
							this.multigoodTouch();
							flag = false;
                        }
					}
					if (!flag) {
						return;
					}
					let problem = {
						question: this.question,
						items: this.items,
						prbType: this.prbType,
						multigood:this.multigood
					}
					if (this.problemIndex >= this.problemList.length) {
						this.problemList.push(problem);
						this.problemIndex = this.problemList.length;
					} else {
						this.problemList[this.problemIndex] = problem; // 기존 값 수정
						this.problemIndex++;
					}
					if (this.problemIndex < this.problemList.length) {
						this.setProblem();
					} else {

						this.question = '';
						this.prbType = '';
						this.items = [];
						for(let i=0; i<5; i++) {
							let item = {answer: '', answerErrors:[]};
							this.items.push(item);
						}
						this.$v.$reset();
					}
				}
			},
			setProblem() {
				let problem = this.problemList[this.problemIndex];
				this.question = problem.question;
				this.prbType = problem.prbType;
				if (problem.prbType != 'subject') {
					this.items = [];
					for (let item of problem.items) {
						this.items.push(item);
					}
					if (this.items.length < 5) {
						this.addButtonShow = true;
					} else {
						this.addButtonShow = false;
					}
					this.multigood = problem.multigood;
				}
			},
			validate() {
				this.$v.$touch()
				if (!this.$v.$anyError) {
					let flag = true;
					if (this.prbType == 'mchoice') {
						let idx = 0;
						for (let item of this.items) {
							if (!item.answer) {
								flag = false;
								this.itemAnswerTouch(idx)
							}
							idx++;
						}
						if(!this.multigood) {
							this.multigoodTouch();
							flag = false;
						}
					}
					if (!flag) {
						return;
					}
					this.formSubmit();
				}

			},
			formSubmit() {
				if (this.insertFlag) return;
				this.insertFlag = true;
				let problem = {
					question: this.question,
					items: this.items,
					multigood:this.multigood,
					prbType: this.prbType,

				}

				if(this.problemIndex >= this.problemList.length) {

					this.problemList.push(problem);
				} else {
					this.problemList[this.problemIndex] = problem; // 기존 값 수정
				}

				const frm = new FormData()
				frm.append('gno', this.gno)
				frm.append('subject', this.subject)
				frm.append('problems', JSON.stringify(this.problemList))
				frm.append('status', 'ready')
				this.$eventBus.$emit('overlay', 'show');
				apiService.post(API_URL_BROADCAST_LIVE_POLL_INSERT, frm, (res) => {
					this.$eventBus.$emit('overlay', 'hide');
					let params = {}
					this.insertFlag = false;
					params = {
						message: '정보가 저장되었습니다',
                        doAction:()=> {
							this.problemShow = false;
                        }

					};
					this.$eventBus.$emit('modalOpen', params);


				})
			},
		},

	}
</script>
<style lang="scss" scoped>
    .contents {
        .remain-box {
            width:400px;
            padding:20px 0 0 30px;


        }
        .field-input {
            h3 {
                margin:10px 0 30px 0;
            }
        }
        .four-box {
            width:90%;
            justify-content: center;
            .cancle-button {
                width: 23%;
                margin-right:10px;
            }
            .submit-button {
                width: 23%;
                margin-right:10px;
            }
        }
        .problem-ul {
            border-top:solid 1px #999999;
            border-bottom:solid 1px #999999;
            margin:0;
            height:auto;
            display:flex;
            padding:0;
            .list-title {
                width:60px;
                height:auto;
                padding-top:15px;
                background:#EEEEEE;
                text-align:center;
                line-height:180%;
                border-right:solid 1px #DCDCDC;
                font-size: 11pt;
                color: #000;
                font-weight:bold;

            }
            .list-content {
                width:100%;
                .item-box {
                    li {
                        display:flex;
                        border-bottom: solid 1px #DCDCDC;
                        .th {
                            width:160px;
                            padding: 35px 0 20px 20px;
                            font-size: 11pt;
                            color: #000;
                            font-weight:bold;
                        }
                        .td {
                            width: 60%;
                            position: relative;
                            text-align: left;
                            padding: 20px 0 0 0;

                        }
                        .control-box {
                            text-align: left;
                            margin:20px 0 0 10px;
                            span {
                                display:inline-block;
                                width:30px;
                                height:30px;
                                border:solid 1px #999;
                                background: #F4F4F4;
                                border-radius:15px;
                                text-align:center;
                                line-height:30px;
                                margin-top:15px;
                                cursor:pointer;
                                font-size:10px;
                            }
                            span.plus {
                                background: #2D8CFF;
                                color:#fff;
                            }
                        }
                    }
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