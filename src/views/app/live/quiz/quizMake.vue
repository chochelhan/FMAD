<template>
    <div :class="'exam-make-box '+mobileClass">
        <div class="title-box" v-if="!mobileView">
            <div class="exam-title">간단 퀴즈 만들기</div>
            <div class="del-box" @click="hideEventBox()"><i class="fas fa-times"></i></div>
        </div>
        <div class="contents">
                <form novalidate @submit.prevent="validate">
                    <ul class="field-box">
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
                                    :dense="dense"
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
                                    :dense="dense"
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
                                    outlined
                                    :dense="dense"
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
                    </ul>
                    <p class="submit-button-box">
                        <v-btn v-if="!mobileView"
                            type="button"
                            class="cancle-button"
                            @click="hideEventBox()"
                        >
                            취소
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
</template>


<script>
	import AUTH from '../../../../api/auth';
	import {validationMixin} from 'vuelidate'
	import {required, numeric} from 'vuelidate/lib/validators'
	import {
		API_URL_BROADCAST_LIVE_QUIZ_INSERT
	} from '../../../../api/urls';
	import apiService from '../../../../api/apiService';

	export default {
		name: 'quizMake',
		mixins: [validationMixin],
        props:["gno"],
		validations: {
			prbType: {required},
			question: {required},

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
				items:[],
				addButtonShow:true,
				subjectGood:'',
                good:'',
                goodList: [],
				subjectGoodErrors:[],
				goodErrors:[],
                dense:false,


		    }
		},
		created() {
            if (this.$isMobile()) {
                this.mobileClass = 'mobile'
                this.mobileView = true;
                this.dense = true;
            }
			let memberInfo = AUTH.getSession(this.$isMobile());
			if (memberInfo.AUTHTOKEN) {
				this.setChoiceProblem();
			}
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


		},
		methods: {
			hideEventBox() {
				this.$emit("hideEvent",{page:'quiz'});
			},
			setChoiceProblem() {
				this.problemList = [];
				this.items = [];
				this.subjectGood = '';
				this.prbType = '';

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

				const frm = new FormData()
				frm.append('gno', this.gno)
				frm.append('question', this.question)
				frm.append('good', this.good)
				frm.append('items', JSON.stringify(this.items))
				frm.append('prbType',this.prbType)
				frm.append('subjectGood', this.subjectGood)

				this.$eventBus.$emit('overlay', 'show');
				apiService.post(API_URL_BROADCAST_LIVE_QUIZ_INSERT, frm, (res) => {
					this.$eventBus.$emit('overlay', 'hide');
					let params = {}
					this.insertFlag = false;
					params = {
						message: '간단 퀴즈를 출제하였습니다',
                        doAction:()=> {
	                        this.$emit("hideEvent",{page:'quiz',action:'sendQuiz',no:res.no});
                        }

					};
					this.$eventBus.$emit('modalOpen', params);

				})
			},
		},

	}
</script>
<style lang="scss" scoped>
    ul {
        padding:0;
    }
    .exam-make-box {
        width: 1100px;
        height: 700px;
        -webkit-box-shadow: 1px 1px 9px -1px rgba(71, 70, 71, 0.53);
        -moz-box-shadow: 1px 1px 9px -1px rgba(71, 70, 71, 0.53);
        box-shadow: 1px 1px 9px -1px rgba(71, 70, 71, 0.53);
        border-radius: 10px;
        position: absolute;
        left: 50%;
        top: 50%;
        background: #ffffff;
        margin: -350px 0 0 -550px;
        .title-box {
            height: 55px;
            line-height: 55px;
            border-bottom: solid 1px #dcdcdc;
            position: relative;
            .exam-title {
                font-size: 12pt;
                font-weight: bold;
                color: #000;
                text-align: center;
            }
            .del-box {
                cursor: pointer;
                position: absolute;
                right: 15px;
                top: 17px;
                background: #999999;
                width: 20px;
                height: 20px;
                text-align: center;
                line-height: 20px;
                border-radius: 10px;
                i {
                    font-size: 10pt;
                    color: #fff;
                }
            }
        }
        .contents {
            padding: 40px 60px;
            height: 645px;
            overflow-y: auto;
            border-radius: 0 0 10px 10px;

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
                                width:190px;
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
        }
        .submit-button-box {
            display: flex;
            width: 700px;
            margin: 40px auto 0 auto;
            justify-content: space-between;
            .cancle-button {
                width: 48%;
                border-radius: 0;
                padding: 0;
                background: #999999;
                color: #fff;
                min-height: 70px;
                font-size: 14pt;
            }
            .submit-button {
                width: 48%;
                border-radius: 0;
                padding: 0;
                background: #686EFB;
                color: #fff;
                min-height: 70px;
                font-size: 14pt;

            }
        }
        &.mobile {
            width:100%;
            height:auto;
            -webkit-box-shadow:none;
            -moz-box-shadow: none;
            box-shadow: none;
            border-radius:0;
            position:relative;
            left:0;
            top:0;
            background: #ffffff;
            margin:20px 0 0 0;
            .contents {
                padding:0 15px;
                height:auto;
                border-radius:0;

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
            .submit-button-box {
                display: flex;
                width:100%;
                margin: 40px auto 0 auto;
                justify-content: space-between;
                .cancle-button {
                    width: 48%;
                    border-radius: 0;
                    padding: 0;
                    background: #999999;
                    color: #fff;
                    min-height: 70px;
                    font-size: 14pt;
                }
                .submit-button {
                    width:100%;
                    border-radius: 0;
                    padding: 0;
                    background: #686EFB;
                    color: #fff;
                    min-height:50px;
                    font-size: 14px;

                }
            }
        }
    }


</style>