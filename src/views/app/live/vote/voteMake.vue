<template>
    <div class="mypage-container">

        <div v-if="mobileView" class="top-menu-bar">
            <div class="top-menu-bar-content">
                <div class="back-button" @click="$router.go(-1)">
                    <i class="fas fa-chevron-left"></i>
                </div>
                <span class="m-title">투표 관리</span>

            </div>
        </div>
        <div :class="'contents '+mobileClass">
            <div class="from-box">

                <div v-if="!mobileView" class="stitle"><span class="line">투표 관리</span>
                    <span class="question-box">
                                    <i class="fas fa-question">
                                        <div class="menu-title-tip">
                                             투표 관리
                <div class="description">
                   수업/회의에  사용할 투표 정보를 사전에 작업하여 저장할 수 있습니다.

투표 제목은 기본 정보로 꼭 입력해야 하며,<br> 하단 선택지 항목을 입력하여 손쉽게 설문조사 정보를 설정할 수 있습니다.<br><br>
자세한 내용은 하단의 ‘자세히 알아보기’를 눌러 예시 화면을 살펴보세요
                                            </div>
                                        </div>
                                    </i>
                    </span>
                </div>
                <div class="title-desc"> 수업/회의에 사용할 투표 정보를 사전에 작업하여 저장할 수 있습니다.</div>

                <div class="question-answer-box">
                    <v-expand-transition>
                        <div id="guide-description" v-if="guideShow">
                            <div class="img">
                                <img style="max-width:100%;" src="../../../../assets/guideImg/08_guide.jpg">
                            </div>
                        </div>
                    </v-expand-transition>
                    <div class="quide-title-box" @click="guideToggle()">
                        <div :class="'quide-title '+guideClass">{{guideTitle}}</div>
                        <div class="guide-icon-box">
                            <div class="guide-icon">
                                <i v-if="!guideShow" class="fas fa-angle-down"></i>
                                <i v-else class="fas fa-angle-up"></i>
                            </div>
                        </div>
                    </div>
                </div>

                <form novalidate @submit.prevent="validate">
                    <ul class="field-box">
                        <li>
                            <div class="required-icon">제목 입력</div>
                            <div class="field-input">
                                <v-text-field
                                    v-model="subject"
                                    required
                                    placeholder="제목을 입력하세요"
                                    :error-messages="subjectErrors"
                                    @input="$v.subject.$touch()"
                                    @blur="$v.subject.$touch()"
                                    outlined
                                ></v-text-field>
                            </div>
                        </li>

                    </ul>
                    <ul class="problem-ul">
                        <li class="list-title">
                            선<br>택<br>지
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
                                        <span v-if="idx>1" @click="deleteProblemItem(idx)"><i class="fas fa-minus"></i></span>
                                    </div>
                                </li>
                            </ul>
                        </li>
                    </ul>
                    <ul class="field-box">
                        <li>
                            <div class="required-icon">다중선택 허용여부</div>
                            <div class="field-input">
                                <v-select
                                    v-model="multigood"
                                    :items="multigoodList"
                                    outlined
                                    placeholder="다중선택 허용여부를 선택하세요"
                                    :error-messages="multigoodErrors"
                                    @input="$v.multigood.$touch()"
                                    @blur="$v.multigood.$touch()"
                                ></v-select>
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
                            작성완료
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
		API_URL_BROADCAST_LIVE_VOTE_INSERT
	} from '../../../../api/urls';
	import apiService from '../../../../api/apiService';

	export default {
		name: 'voteMake',
		mixins: [validationMixin],
		validations: {
			subject: {required},
			multigood: {required},
		},
		data() {
			return {
				insertFlag: false,
				mobileView: false,
				mobileClass: '',
				guideTitle: ' 자세히 알아보기',
				guideShow: false,
                addButtonShow:false,
				insertFlag:false,
				guideClass: '',
				multigood: '',
				multigoodList: [
					{text: '가능', value: 'yes'},
					{text: '불가능', value: 'no'},
				],
				subject: '',
				items: [],
				gno: '',

			}
		},
		created() {
			this.setChoiceProblem();
			this.gno = this.getGno;
		},
		computed: {
			...mapGetters('etc', ["getGno"]),
			subjectErrors() {
				const errors = []
				if (!this.$v.subject.$dirty) return errors
				if (!this.$v.subject.required) {
					errors.push('설문조사 제목을 입력하세요')
				}
				return errors
			},
			multigoodErrors() {
				const errors = []
				if (!this.$v.multigood.$dirty) return errors
				if (!this.$v.multigood.required) {
					errors.push('다중선택 허용여부를 선택하세요')
				}
				return errors
			},


		},
		methods: {
			guideToggle() {
				if (this.guideShow) {
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
				this.items = [];
				this.multigood = '';
				for (let i = 0; i < 5; i++) {
					let item = {answer: '', answerErrors: []};
					this.items.push(item);
				}
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
			validate() {
				this.$v.$touch()
				if (!this.$v.$anyError) {
					let flag = true;
					let idx = 0;
					for (let item of this.items) {
						if (!item.answer) {
							flag = false;
							this.itemAnswerTouch(idx)
						}
						idx++;
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
				frm.append('subject', this.subject)
				frm.append('multigood', this.multigood)
				frm.append('items', JSON.stringify(this.items))
				frm.append('status', 'ready')
				this.$eventBus.$emit('overlay', 'show');
				apiService.post(API_URL_BROADCAST_LIVE_VOTE_INSERT, frm, (res) => {
					this.$eventBus.$emit('overlay', 'hide');
					let params = {}
					this.insertFlag = false;
					params = {
						message: '정보가 저장되었습니다',
						doAction: () => {
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
                width: 23%;
                margin-right: 10px;
            }
            .submit-button {
                width: 23%;
                margin-right: 10px;
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
        &.mobile {
            width: 100%;
            padding: 70px 20px 100px 20px;
            width: auto;

        }

    }


</style>