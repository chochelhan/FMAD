<template>
    <div :class="'contents '+mobileClass">
                <form novalidate @submit.prevent="validate">
                    <ul class="field-box">
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
                                    :dense="dense"
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
                                    :dense="dense"
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
                                            :dense="dense"
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
                    <ul  class="field-box" v-if="prbType">
                        <li>
                            <div class="required-icon">정답 답안</div>
                            <div class="field-input" v-if="prbType=='subject'">
                                <v-text-field
                                    v-model="subjectGood"
                                    placeholder="답안을 입력해 주세요"
                                    :error-messages="subjectGoodErrors"
                                    @input="subjectGoodTouch()"
                                    @blur="subjectGoodTouch()"
                                    :dense="dense"
                                    outlined
                                ></v-text-field>
                            </div>
                            <div class="field-input" v-else>
                                <v-select
                                    v-model="good"
                                    :items="goodList"
                                    outlined
                                    placeholder="답안을 선택하세요"
                                    :error-messages="goodErrors"
                                    @input="goodTouch()"
                                    @blur="goodTouch()"
                                    :dense="dense"
                                ></v-select>
                            </div>
                        </li>
                        <li>
                            <div class="required-icon">배점</div>
                            <div class="field-input" style="display:flex;">
                                <v-text-field
                                    v-model="jumsu"
                                    required
                                    placeholder="배점을 숫자로 입력하세요"
                                    :error-messages="jumsuErrors"
                                    @input="$v.jumsu.$touch()"
                                    @blur="$v.jumsu.$touch()"
                                    :dense="dense"
                                    outlined
                                ></v-text-field>
                                <div class="remain-box">남은배점 : <strong>{{remainJumsu}}</strong></div>
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
                            v-if="remainJumsu>0 || nextButton"
                            type="button"
                            class="submit-button"
                            @click="addProblem()"
                        >
                            저장하고 다음문제 설정
                        </v-btn>
                        <v-btn
                            v-if="remainJumsu<=0"
                            type="submit"
                            class="submit-button"
                        >
                            출제완료
                        </v-btn>
                    </p>

                </form>
    </div>
</template>


<script>
	import {validationMixin} from 'vuelidate'
	import {required, numeric} from 'vuelidate/lib/validators'
	import {
		API_URL_BROADCAST_LIVE_EXAM_DIRECT_INSERT
	} from '../../../../api/urls';
	import apiService from '../../../../api/apiService';

	export default {
		name: 'examDirectMake',
		mixins: [validationMixin],
        props:["sendParams"],
		validations: {
			prbType: {required},
			question: {required},
			jumsu: {required,numeric},

		},
        watch:{
			problemShow(val) {
				if(!val) {
					this.$emit('backChange')
                }
            }
        },
		data() {
			return {
				insertFlag: false,
				mobileView: false,
				mobileClass: '',
			    prbType:'',
				prbTypeList:[
                    {text:'객관식',value:'mchoice'},
					{text:'주관식',value:'subject'},
                ],
				question:'',
				jumsu:'',
				remainJumsu:0,
				items:[],
				addButtonShow:true,
				subjectGood:'',
                good:'',
                goodList: [],
				subjectGoodErrors:[],
				goodErrors:[],
				problemList:[],
				problemIndex:0,
				problemShow:true,
				nextButton:true,
                dense:false,

		    }
		},
		created() {
            if (this.$isMobile()) {
                this.mobileClass = 'mobile'
                this.mobileView = true;
                this.dense = true;
            }
            this.setChoiceProblem();
		},
		computed: {
			prbTypeErrors() {
				const errors = []
				if (!this.$v.prbType.$dirty) return errors
				if (!this.$v.prbType.required) {
					errors.push('문항유형을 선택하세요')
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
			jumsuErrors() {
				const errors = []
				if (!this.$v.jumsu.$dirty) return errors
				if (!this.$v.jumsu.required) {
					errors.push('배점을 입력하세요')
					return errors
				}
				if (!this.$v.jumsu.numeric) {
					errors.push('배점은 숫자만 입력가능합니다')
					return errors
				}
				this.checkRemain();
				return errors

			},

		},
		methods: {
			setChoiceProblem() {
				this.problemList = [];
				this.items = [];
				this.subjectGood = '';
				this.prbType = '';
				this.remainJumsu = this.sendParams.totalJumsu;

				this.question = '';
				this.good = 0;
				for(let i=0; i<5; i++) {
					let item = {answer: '', answerErrors:[]};
					this.items.push(item);
				}
				this.setGoodList();
			},
			itemAnswerTouch(idx) {
                this.items[idx].answerErrors = [];
                if(!this.items[idx].answer) {
	                this.items[idx].answerErrors.push((idx+1)+'번 답안을 입력하세요');
                }
            },
			addProblemItem() {
				let item = {answer: '', answerErrors:[]};
				this.items.push(item);
				this.setGoodList();
				if (this.items.length >= 5) {
					this.addButtonShow = false;
				}

			},
			deleteProblemItem(idx) {
				this.items.splice(idx, 1);
				if (this.items.length < 5) {
					this.addButtonShow = true;
				}
				this.setGoodList();
			},
			setGoodList() {
			    this.goodList = [];
			    for(let i=1; i<=this.items.length; i++) {
			    	this.goodList.push({text:i+'번',value:i})
                }
            },
            subjectGoodTouch() {
	            this.subjectGoodErrors = [];
	            if(!this.subjectGood) {
		            this.subjectGoodErrors.push('정답 답안을 입력해주세요')
                }
            },
            goodTouch() {
	            this.goodErrors = [];
	            if(!this.good) {
		            this.goodErrors.push('정답 답안을 선택해주세요')
	            }
            },
			checkRemain() {
				let total = 0;
				let i = 0;
				for(let item of this.problemList) {
					if(i != this.problemIndex) {
						total+= parseInt(item.jumsu);
					}
					i++;
				}
				let remain = total;
				if(this.jumsu) {
						remain = parseInt(this.sendParams.totalJumsu) - (remain + parseInt(this.jumsu));
						if(remain <= 0) {
							let jumsu = parseInt(this.sendParams.totalJumsu) - total;

							setTimeout(()=>{
								this.jumsu = jumsu;
                            },100)
							this.remainJumsu = 0;
							this.nextButton = false;
							return;
						} else {
							this.nextButton = true;
                        }
				}
         		this.remainJumsu = remain;
			},
			goBack() {
				let length = this.problemList.length;
				if (length < 1) this.problemShow = false;
				else {
					if (this.problemIndex < 1) this.problemShow = false;
					else {
						this.nextButton = true;
						this.problemList.splice(this.problemIndex,1)
						this.problemIndex--;
						this.setProblem();
					}
				}
			},
			problemDelete() {
				this.problemList = [];
				this.problemIndex = 0;
				this.remainJumsu = this.totalJumsu;
				this.problemShow = false;
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
						if (!this.good) {
							this.goodTouch();
							flag = false;
						}

					} else {
						if (!this.subjectGood) {
							flag = false;
							this.subjectGoodTouch()
						}

					}
					if (!flag) {
						return;
					}

					let problem = {
						question: this.question,
						items: this.items,
						good: this.good,
						prbType: this.prbType,
						subjectGood: this.subjectGood,
						jumsu: parseInt(this.jumsu)
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
						this.good = 0;
						this.subjectGood = '';
						this.prbType = '';
						this.jumsu = '';
						this.nextButton = false;
						this.items = [];
						for(let i=0; i<5; i++) {
							let item = {answer: '', answerErrors:[]};
							this.items.push(item);
						}
						this.setGoodList();
						this.$v.$reset();
					}
				}
			},
			setProblem() {
				let problem = this.problemList[this.problemIndex];
				this.question = problem.question;
				this.prbType = problem.prbType;
				this.jumsu = problem.jumsu.toString();
				if (problem.prbType == 'subject') {
					this.subjectGood = problem.subjectGood;

				} else {
					this.items = [];
					for (let item of problem.items) {
						this.items.push(item);
					}
					if (this.items.length < 5) {
						this.addButtonShow = true;
					} else {
						this.addButtonShow = false;
					}
					this.good = problem.good;
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
						if (!this.good) {
							this.goodTouch();
							flag = false;
						}

					} else {
						if (!this.subjectGood) {
							flag = false;
							this.subjectGoodTouch()
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
					good: this.good,
					prbType: this.prbType,
					subjectGood: this.subjectGood,
					jumsu: parseInt(this.jumsu)
				}
				if(this.problemIndex >= this.problemList.length) {
					this.problemList.push(problem);
				} else {
					this.problemList[this.problemIndex] = problem; // 기존 값 수정
				}
				const frm = new FormData()
				frm.append('gno', this.sendParams.gno)
				frm.append('subject', this.sendParams.name)
				frm.append('author', this.sendParams.author)
				frm.append('problems', JSON.stringify(this.problemList))
				frm.append('status', 'ready')
				frm.append('timelimit', this.sendParams.timelimit)
				frm.append('totalJumsu', this.sendParams.totalJumsu)

				this.$eventBus.$emit('overlay', 'show');
				apiService.post(API_URL_BROADCAST_LIVE_EXAM_DIRECT_INSERT, frm, (res) => {
					this.$eventBus.$emit('overlay', 'hide');
					let params = {}
					this.insertFlag = false;

					if(this.sendParams.sendType=='immExam') {

						this.$emit('submitResult',res.no);
					} else {
						params = {
							message: '정보가 저장되었습니다',
							doAction: () => {
								this.problemShow = false;
							}

						};
						this.$eventBus.$emit('modalOpen', params);
                    }

				})
			},
		},

	}
</script>
<style lang="scss" scoped>
    .contents {
        padding:0;
        margin:0;
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
                width: 30%;
                margin-right:10px;
            }
            .submit-button {
                width: 30%;
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
            max-width:calc(100vw);
            width: 100%;
            padding:20px 0;
            .remain-box {
                width:35%;
                padding:10px 0 0 10px;
                font-size:12px;


            }
            .field-input {
                h3 {
                    margin:10px 0;
                }
            }
            .four-box {
                width:100%;
                max-width:calc(100vw);
                justify-content: center;
                .cancle-button {
                    width:auto;
                    padding:0 10px;
                    margin-right:10px;
                    font-size:12px;
                    height:50px;
                    min-height:50px;
                }
                .submit-button {
                    width:auto;
                    padding:0 10px;
                    font-size:12px;
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
                    padding:0;
                    .item-box {
                        padding:0;
                        li {
                            display:flex;
                            border-bottom: solid 1px #DCDCDC;
                            .th {
                                width:80px;
                                padding: 20px 0 0 10px;
                                font-size: 12px;
                                color: #000;
                                font-weight:bold;
                            }
                            .td {
                                width:60%;
                                position: relative;
                                text-align: left;
                                padding:10px 0 0 0;

                            }
                            .control-box {
                                text-align: left;
                                margin:10px 0 0 10px;
                                span {
                                    display:inline-block;
                                    width:30px;
                                    height:30px;
                                    border:solid 1px #999;
                                    background: #F4F4F4;
                                    border-radius:15px;
                                    text-align:center;
                                    line-height:30px;
                                    margin-top:5px;
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

        }

    }


</style>