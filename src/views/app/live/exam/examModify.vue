<template>
    <div class="mypage-container">

        <div v-if="mobileView" class="top-menu-bar">
            <div class="top-menu-bar-content">
                <div class="back-button" @click="$router.go(-1)">
                    <i class="fas fa-chevron-left"></i>
                </div>
                <span class="m-title">{{title}} - 수정하기</span>
            </div>
        </div>
        <div :class="'contents '+mobileClass">
            <div class="from-box">

                <div v-if="!mobileView" class="stitle"><span class="line">{{title}} - 수정하기</span>
                </div>
                <div class="title-desc"> 문제를 수정할 수 있습니다.</div>
                <div class="data-list-container">
                    <div class="data-top">
                        <div class="check-box">
                            <v-checkbox class="chk"
                                        v-model="allCheck"
                                        value="all"
                                        label="전체 선택"
                            ></v-checkbox>
                        </div>
                        <div class="button-box">
                            <button type="button" class="del-button" @click="deleteCheckItem()">삭제</button>
                            <button type="button" class="list-button" @click="goList()">목록으로</button>
                        </div>
                    </div>
                    <div class="data-list-box">
                        <div class="data-list-item" v-for="(data,pIdx) in dataList">
                            <div class="data-list-top">

                                <div class="data-title">
                                    <v-checkbox class="chk"
                                                v-model="data.checked"
                                    ></v-checkbox>
                                    &nbsp; <span>{{pIdx+1}}.</span> {{data.question}}
                                </div>
                                <div class="modify-button" @click="updateButtonshow(pIdx)"><i
                                    class="fas fa-ellipsis-v"></i></div>
                                <div class="problem-item-update-box" v-if="data.show">
                                    <ul>
                                        <li @click="problemModify(pIdx)">
                                            수정하기
                                        </li>
                                        <li @click="problemDelete(pIdx)">
                                            삭제하기
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <ul class="data-list" v-if="data.prbType=='mchoice'">
                                <li v-for="(item,idx) in data.items" :class="((idx+1)==data.good)?'active':''">
                                    <span>{{idx+1}}</span> {{item.answer}}
                                </li>
                            </ul>
                            <div class="subjectAnswer" v-if="data.prbType=='subject'">
                                {{data.subjectGood}}
                            </div>
                        </div>
                    </div>
                </div>

            </div>
            <p class="submit-button-box">
                <v-btn
                    type="button"
                    class="cancle-button"
                    @click="dataReset()"
                >
                    취소
                </v-btn>
                <v-btn
                    type="button"
                    class="submit-button"
                    @click="dataSubmit()"
                >
                    확인
                </v-btn>
            </p>
        </div>
        <v-dialog
            v-model="examShow"
            width="65%"
        >
            <div :class="'contentsModal '+mobileClass">
                <div v-if="!mobileView" class="stitle"><span class="line">{{title}} - 수정하기</span>
                </div>
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
                    <ul class="problem-ul" v-if="prbType=='mchoice'">
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
                                        <span v-if="idx==0 && addButtonShow" class="plus" @click="addProblemItem()"><i
                                            class="fas fa-plus"></i></span>
                                        <span v-if="idx>0" @click="deleteProblemItem(idx)"><i class="fas fa-minus"></i></span>
                                    </div>
                                </li>
                            </ul>
                        </li>
                    </ul>
                    <ul class="field-box" v-if="prbType">
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
                                    outlined
                                ></v-text-field>
                                <div class="remain-box">남은배점 : <strong>{{remainJumsu}}</strong></div>
                            </div>
                        </li>
                    </ul>
                    <p class="submit-button-box">
                        <v-btn
                            type="button"
                            class="cancle-button"
                            @click="examShow=false"
                        >
                            취소
                        </v-btn>
                        <v-btn
                            type="submit"
                            class="submit-button"
                        >
                            확인
                        </v-btn>
                    </p>

                </form>
            </div>
        </v-dialog>
    </div>
</template>


<script>
	import {validationMixin} from 'vuelidate'
	import {required, numeric} from 'vuelidate/lib/validators'

	import {
		API_URL_BROADCAST_LIVE_GET_EXAM,
		API_URL_BROADCAST_LIVE_EXAM_DIRECT_INSERT,
	} from '../../../../api/urls';
	import apiService from '../../../../api/apiService';

	export default {
		name: 'examModify',
		mixins: [validationMixin],
		validations: {
			prbType: {required},
			question: {required},
			jumsu: {required, numeric},

		},
		watch: {
			allCheck(val) {
				for (let item of this.dataList) {
					if (val) {
						item.checked = true;
					} else item.checked = false;
				}
			},
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
		data() {
			return {
				mobileView: false,
				mobileClass: '',
				no: '',
                gno:'',
				allCheck: false,
				dataList: [],
				title: '',
				examShow: false,
				prbType: '',
				prbTypeList: [
					{text: '객관식', value: 'mchoice'},
					{text: '주관식', value: 'subject'},
				],
				question: '',
				jumsu: '',
				remainJumsu: 0,
				items: [],
				subjectGood: '',
				good: '',
				goodList: [],
				subjectGoodErrors: [],
				goodErrors: [],
				problemList: [],
				problemIndex: 0,
				updateItemIdx: '',
				addButtonShow: true,

			}
		},
		created() {
			this.no = this.$route.params.no;
			this.getData();
		},
		methods: {
			dataReset() {
			    this.getData();
            },
			getData() {
				const frm = new FormData()
				frm.append('no', this.no)
				apiService.post(API_URL_BROADCAST_LIVE_GET_EXAM, frm, (res) => {
					this.dataList = [];
					this.title = res.info.subject;
					this.gno = res.info.gno;
					for (let data of res.info.problems) {
						data.checked = false;
						data.show = false;
						this.dataList.push(data);
						this.totalJumsu = res.info.totalJumsu;
					}
				})
			},
			deleteCheckItem() {
				let flag = false;
				for (let item of this.dataList) {
					if (item.checked) {
						flag = true;
						break;
					}
				}
				let message;
				if (flag) {
					message = {
						type: 'confirm',
						message: '선택된 문제를 삭제하시겠습니까?',
						doAction: () => {
							let virtuals = [];
							for(let item of this.dataList) {
								if(!item.checked) {
									virtuals.push(item);
								}
							}
							this.dataList = virtuals;
							this.allCheck= false;
						}
					};
				} else {
					message = {
						type: 'alert',
						message: '대상을 하나이상 선택해주세요',
					};
				}
				this.$eventBus.$emit('modalOpen', message);

			},
			goList() {
				this.$router.push('/live/'+this.gno+'/dataList/all')
			},
			updateButtonshow(pIdx) {
				if (this.dataList[pIdx].show) {
					this.dataList[pIdx].show = false;
				} else {
					this.dataList[pIdx].show = true;
				}

			},
			problemModify(pIdx) {
				this.updateItemIdx = pIdx;
				let info = this.dataList[pIdx];
				this.question = info.question;
				this.prbType = info.prbType;
				if (this.prbType == 'subject') {
					this.subjectGood = info.subjectGood;
					this.items = [];
					let item = {answer: ''};
					this.items.push(item);
					item = {answer: ''};
					this.items.push(item);
					item = {answer: ''};
					this.items.push(item);
					item = {answer: ''};
					this.items.push(item);
					item = {answer: ''};
					this.items.push(item);
					this.good = 0;
				} else {
					this.good = info.good;
					this.items = info.items;
					this.subjectGood = '';
					this.goodList = [];
					for (let i = 1; i <= this.items.length; i++) {
						this.goodList.push({text: i + '번', value: i})
					}
				}
				this.jumsu = info.jumsu;
				let total = 0;
				for (let item of this.dataList) {
					total += item.jumsu;
				}

				this.remainJumsu = this.totalJumsu - total;
				this.examShow = true;
			},
			problemDelete(pIdx) {
				let message = {
					type: 'confirm',
					message: '문제를 삭제하시겠습니까?',
					doAction: () => {
						this.dataList.splice(pIdx,1)
					}
				};

				this.$eventBus.$emit('modalOpen', message);
			},
			itemAnswerTouch(idx) {
				this.items[idx].answerErrors = [];
				if (!this.items[idx].answer) {
					this.items[idx].answerErrors.push((idx + 1) + '번 답안을 입력하세요');
				}
			},
			addProblemItem() {
				let item = {answer: '', answerErrors: []};
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
				for (let i = 1; i <= this.items.length; i++) {
					this.goodList.push({text: i + '번', value: i})
				}
			},
			subjectGoodTouch() {
				this.subjectGoodErrors = [];
				if (!this.subjectGood) {
					this.subjectGoodErrors.push('정답 답안을 입력해주세요')
				}
			},
			goodTouch() {
				this.goodErrors = [];
				if (!this.good) {
					this.goodErrors.push('정답 답안을 선택해주세요')
				}
			},
			checkRemain() {
				let total = 0;
				for (let item of this.dataList) {
					total += item.jumsu;
				}
				total = total - this.dataList[this.updateItemIdx].jumsu;
				let remain = total;
				if (this.jumsu) {
					remain = parseInt(this.totalJumsu) - (remain + parseInt(this.jumsu));
					if (remain <= 0) {
						let jumsu = parseInt(this.totalJumsu) - total;

						setTimeout(() => {
							this.jumsu = jumsu;
						}, 100)
						this.remainJumsu = 0;
						return;
					}
				}
				this.remainJumsu = remain;
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
					if (this.remainJumsu > 0) {
						let msg = {
							message: '배점의 총합이 ' + this.totalJumsu + ' 보다 작습니다',
						};
						this.$eventBus.$emit('modalOpen', msg);
						return;
					}
					let problem = {
						idx: this.dataList[this.updateItemIdx].idx,
						question: this.question,
						items: this.items,
						good: this.good,
						prbType: this.prbType,
						subjectGood: this.subjectGood,
						jumsu: parseInt(this.jumsu),
                        checked:false,
                        show:false
					}
					this.$set(this.dataList,this.updateItemIdx,problem);
					this.examShow = false;
				}

			},
			dataSubmit() {
				if (this.insertFlag) return;
				this.insertFlag = true;

				const frm = new FormData()
				frm.append('no', this.no)
				frm.append('problems', JSON.stringify(this.dataList));
				this.$eventBus.$emit('overlay', 'show');
				apiService.post(API_URL_BROADCAST_LIVE_EXAM_DIRECT_INSERT, frm, (res) => {
					this.$eventBus.$emit('overlay', 'hide');
					let message = {
						message: '정보가 수정되었습니다',
					};

					this.$eventBus.$emit('modalOpen', message);
				})

			}

		},

	}
</script>
<style lang="scss" scoped>
    .contents {
        .data-list-container {
            border: solid 1px #DCDCDC;
            background: #F4F4F4;
            width: 100%;
            height: 600px;
            overflow-y: auto;
            overflow-x: hidden;
            margin: 30px 0;
            padding: 35px 50px;
            .data-top {
                padding-bottom: 3px;
                border-bottom: solid 1px #999;
                display: flex;
                .check-box {
                    width: 50%;
                    text-align: left;
                    padding-left: 10px;
                    font-size: 11pt;
                }
                .button-box {
                    width: 50%;
                    text-align: right;
                    padding-right: 10px;
                    padding-top:22px;
                    button {
                        width: 60px;
                        height: 30px;
                        text-align: center;
                        line-height: 30px;
                        border-radius: 15px;
                        font-size: 9pt;;
                        padding: 0;
                        border: solid 1px #999999;
                        background: #fff;
                        &:first-child {
                            background: #999;
                            margin-right: 10px;
                            color: #fff;
                            min-width: 45px;
                        }
                    }
                }
            }
            .data-list-box {
                margin-bottom: 20px;
                .data-list-item {
                    border: solid 1px #DCDCDC;
                    border-radius: 12px;
                    background: #E8F4FF;
                    margin: 20px 0 0 0;
                    .data-list-top {
                        background: #fff;
                        height: 60px;
                        line-height: 60px;
                        border-radius: 12px 12px 0 0;
                        border-bottom: solid 1px #dcdcdc;
                        display: flex;
                        position: relative;
                        .data-title {
                            width: 85%;
                            text-align: left;
                            font-size: 11pt;
                            color: #000;
                            font-weight: bold;
                            padding-left: 40px;
                            display: flex;
                            span {
                                padding-right:10px;
                            }
                        }
                        .modify-button {
                            width: 15%;
                            text-align: right;
                            padding-right: 25px;
                            color: #999;
                            font-size: 10pt;
                            cursor: pointer;

                        }
                        .problem-item-update-box {
                            position: absolute;
                            top: 20px;
                            right: 40px;
                            -webkit-box-shadow: 1px 1px 9px -1px rgba(71, 70, 71, 0.53);
                            -moz-box-shadow: 1px 1px 9px -1px rgba(71, 70, 71, 0.53);
                            box-shadow: 1px 1px 9px -1px rgba(71, 70, 71, 0.53);
                            width: 90px;
                            height: 70px;
                            border-radius: 5px;
                            background: #fff;
                            & > ul {
                                padding: 0;
                                margin: 10px 0 0 0;
                                & > li {
                                    padding: 7px 10px;
                                    color: #000;
                                    font-size: 10pt;
                                    margin: 0;
                                    text-align: center;
                                    height: auto;
                                    line-height: 100%;
                                    cursor: pointer;
                                    &:first-child {
                                        color: #2D8CFF;
                                    }
                                }
                            }
                        }
                    }
                    .data-list {
                        padding: 20px 40px 5px 40px;
                        li {
                            margin-bottom: 10px;
                            height: 45px;
                            padding: 0 5px 0 20px;
                            line-height: 45px;
                            font-size: 11pt;
                            background: #fff;
                            border: solid 1px #dcdcdc;
                            border-radius: 10px;
                            &.active {
                                background: #2D8CFF;
                                color: #fff;
                                span {
                                    border: solid 1px #fff;
                                }
                            }
                            span {
                                display: inline-block;
                                border: solid 1px #999;
                                width: 16px;
                                height: 16px;
                                border-radius: 8px;
                                line-height: 14px;
                                text-align: center;
                                font-size: 8pt;
                            }
                        }
                    }
                    .subjectAnswer {
                        margin: 20px 40px;
                        height: 45px;
                        padding: 0 5px 0 20px;
                        line-height: 45px;
                        font-size: 11pt;
                        background: #fff;
                        border: solid 1px #dcdcdc;
                        border-radius: 10px;
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

    .contentsModal {
        background: #fff;
        padding: 40px 50px;
        .submit-button-box {
            display: flex;
            width: 700px;
            margin: 80px auto;
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
        .stitle {
            font-size: 17pt;
            font-weight: bold;
            padding: 0 0 10px 0;
            color: #686EFB;
            border-bottom: solid 1px #dcdcdc;
            span.line {
                padding-bottom: 13px;
                border-bottom: solid 2px #686EFB;
            }

        }
        .field-box {
            padding: 0;
            & > li {
                border-bottom: solid 1px #DCDCDC;
                display: flex;
                padding: 25px 25px 0 25px;
                &:first-child {
                    border-top: solid 1px #dcdcdc;
                }
                .required-icon {
                    width: 220px;
                    color: #000;
                    font-weight: bold;
                    font-size: 12pt;
                    padding-top: 15px;
                }
                .field-input {
                    width: 60%;
                    .switch-ul {
                        width: 480px;
                        padding: 0;
                        display: flex;
                        margin-bottom: 25px;
                        li {
                            width: 50%;
                            border: solid 1px #dcdcdc;
                            text-align: center;
                            line-height: 55px;
                            height: 55px;
                            cursor: pointer;
                            &.active {
                                background: #686EFB;
                                color: #fff;
                            }
                            &:first-child {
                                border-right: none;
                                border-radius: 10px 0 0 10px;
                            }
                            &:last-child {
                                border-radius: 0 10px 10px 0;
                            }
                        }
                    }

                }
            }
        }
        .remain-box {
            width: 400px;
            padding: 20px 0 0 30px;

        }
        .field-input {
            h3 {
                margin: 10px 0 30px 0;
            }
        }
        .four-box {
            width: 90%;
            justify-content: center;
            .cancle-button {
                width: 30%;
                margin-right: 10px;
            }
            .submit-button {
                width: 30%;
            }
        }
        .problem-ul {
            border-top: solid 1px #999999;
            border-bottom: solid 1px #999999;
            margin: 0;
            height: auto;
            display: flex;
            padding: 0;
            .list-title {
                width: 60px;
                height: auto;
                padding-top: 15px;
                background: #EEEEEE;
                text-align: center;
                line-height: 180%;
                border-right: solid 1px #DCDCDC;
                font-size: 11pt;
                color: #000;
                font-weight: bold;

            }
            .list-content {
                width: 100%;
                .item-box {
                    li {
                        display: flex;
                        border-bottom: solid 1px #DCDCDC;
                        .th {
                            width: 160px;
                            padding: 35px 0 20px 20px;
                            font-size: 11pt;
                            color: #000;
                            font-weight: bold;
                        }
                        .td {
                            width: 60%;
                            position: relative;
                            text-align: left;
                            padding: 20px 0 0 0;

                        }
                        .control-box {
                            text-align: left;
                            margin: 20px 0 0 10px;
                            span {
                                display: inline-block;
                                width: 30px;
                                height: 30px;
                                border: solid 1px #999;
                                background: #F4F4F4;
                                border-radius: 15px;
                                text-align: center;
                                line-height: 30px;
                                margin-top: 15px;
                                cursor: pointer;
                                font-size: 10px;
                            }
                            span.plus {
                                background: #2D8CFF;
                                color: #fff;
                            }
                        }
                    }
                }
            }
        }
    }


</style>