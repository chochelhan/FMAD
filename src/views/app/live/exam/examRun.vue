<template>
    <div  :class="'exam-content '+mobileClass">
        <div class="title-box" v-if="!mobileView">
            <div class="gtitle">{{subject}}</div>
            <div class="del-box" v-if="examResultCheck!='resultView'" @click="barHideBox()"><i class="fas fa-minus"></i>
            </div>
        </div>
        <div class="contents" v-if="examResultCheck!='resultView'">
            <div class="data-list-box">
                <div class="data-list-item" v-for="(data,pIdx) in dataList">
                    <div class="data-list-top" :id="'itemfocus'+(pIdx+1)">
                        <div class="gtitle"><span>{{pIdx+1}}.</span> {{data.question}}</div>
                    </div>
                    <ul class="data-list" v-if="data.prbType=='mchoice'">
                        <li v-for="(item,idx) in data.items" :class="item.gclass" @click="setAnswer(pIdx,idx)">
                            <span>{{idx+1}}</span> {{item.answer}}
                        </li>
                    </ul>
                    <div class="subjectAnswer" v-if="data.prbType=='subject'">
                        <input v-model="data.userAnswer" placeholder="답을 입력하세요">
                    </div>
                </div>
            </div>
        </div>
        <div class="contents" v-if="examResultCheck=='resultView'">
            <div class="data-list-box">
                <div class="data-list-item" v-for="(data,pIdx) of dataList">
                    <div class="data-list-top" :id="'itemfocus'+(pIdx+1)">
                        <div class="gtitle"><span>{{pIdx+1}}.</span> {{data.question}}</div>
                    </div>
                    <ul class="data-list" v-if="data.prbType=='mchoice'">
                        <li v-for="(item,idx) in data.items" :class="((idx+1)==data.good)?'active':''">
                            <span>{{idx+1}}</span> {{item.answer}}
                        </li>
                    </ul>
                    <div class="subjectAnswer addpadding" v-if="data.prbType=='subject'">
                        {{data.subjectGood}}
                    </div>
                </div>
            </div>
        </div>

        <div class="bottom-box" v-if="examResultCheck!='resultView'">
            <div class="author">출제자 : <span>{{author}}</span></div>
            <div class="timelimit">제한시간 : <span>{{timelimit}}</span>분</div>
            <div class="button">
                <v-btn class="primay-btn" type="button" @click="problemSubmit()" v-if="!observeUser">
                    제출하기
                </v-btn>
                <v-btn class="primay-btn" type="button" @click="problemSubmit()" v-if="observeUser">
                    Skip
                </v-btn>
            </div>
        </div>
        <div class="bottom-box single-button-box" v-if="examResultCheck=='resultView'" style="text-align:center">
            <div class="single-button">
            <v-btn class="primay-btn" type="button" @click="hideEventBox()">
                창닫기
            </v-btn>
            </div>
        </div>
    </div>
</template>


<script>
	import {
		API_URL_BROADCAST_LIVE_GET_EXAM,
		API_URL_BROADCAST_LIVE_EXAM_REPLY_INSERT
	} from '../../../../api/urls';
	import apiService from '../../../../api/apiService';

	export default {
		name: 'examView',
		props: ["recepiveData", "examResultCheck"],
		data() {
			return {
                mobileView: false,
                mobileClass: '',
				no: '',
				uid: '',
				name: '',
				examList: [],
				dataList: [],
				observeUser: false,
				subject: '',
				timelimit: '',
				author: '',

			}
		},
		created() {
            if (this.$isMobile()) {
                this.mobileClass = 'mobile'
                this.mobileView = true;
            }
			this.observeUser = (localStorage.getItem("observeUser") == "yes") ? true : false;
			if(this.examResultCheck=='resultView') {
				this.no = this.recepiveData.resultNo;

			} else {
				this.no = this.recepiveData.no;
				this.uid = this.recepiveData.uid;
				this.name = this.recepiveData.name;
			}
			this.getData();
		},
		methods: {
			hideEventBox() {
				this.$emit("sendDataEvent", {page: 'exam'});
			},
			barHideBox() {
				this.$emit("sendDataEvent", {page: 'barHide', active: 'exam'});
			},
			getData() {
				const frm = new FormData()
				frm.append('no', this.no)
              	apiService.post(API_URL_BROADCAST_LIVE_GET_EXAM, frm, (ret) => {
					this.subject = ret.info.subject;
					this.timelimit = ret.info.timelimit;
					this.author = ret.info.author;
					for (let item of ret.info.problems) {
						item.gclass = '';
						this.dataList.push(item);
					}

				})
			},
			setAnswer(pIdx, idx) {
				let i = 0;
				for (let item of this.dataList[pIdx].items) {
					if (i == idx) item.gclass = 'active';
					else item.gclass = '';
					this.$set(this.dataList[pIdx], i, item);
					i++;
				}
				let good = (idx + 1);
				this.dataList[pIdx].userAnswer = good;

			},
			problemSubmit() {

				let flag = true;
				let answers = [];
				let gtotal = 0;
				let pResult = 'bad';
				let jumsu = 0;
				let k = 1;
				let goodResult = '';
				for (let problem of this.dataList) {
					if (!problem.userAnswer && !this.observeUser) {
						let message = {
							message: k + '번 답을 입력하세요',
						};
						this.$eventBus.$emit('modalOpen', message);
						return;
					}
					if (problem.prbType == 'mchoice') {
						if (parseInt(problem.good) == problem.userAnswer) {
							pResult = 'good';
							jumsu = jumsu + parseInt(problem.jumsu);
							gtotal++;

						} else pResult = 'bad';
						goodResult = problem.good;
					} else {
						if (problem.subjectGood == problem.userAnswer) {
							pResult = 'good';
							jumsu = jumsu + parseInt(problem.jumsu);
							gtotal++;
						} else pResult = 'bad';
						goodResult = problem.subjectGood;
					}
					let item = {good: goodResult, userAnswer: problem.userAnswer, result: pResult};
					answers.push(item);
					k++;
				}
				let ptotal = this.dataList.length;

				const frm = new FormData()
				frm.append('pno', this.no)
				frm.append('name', this.name)
				frm.append('uid', this.uid)
				frm.append('gtotal', gtotal);
				frm.append('jumsu', jumsu);
				frm.append('ptotal', ptotal);
				frm.append('answers', JSON.stringify(answers));

				apiService.post(API_URL_BROADCAST_LIVE_EXAM_REPLY_INSERT, frm, (ret) => {
					this.$emit("sendDataEvent", {page: 'exam', active: 'replayExam'});
					this.recepiveData.no = 0;
					let message = {
						message: '답안을 제출하였습니다',
					};
					this.$eventBus.$emit('modalOpen', message);

				});
			}


		},

	}
</script>
<style lang="scss" scoped>
    ul {
        padding: 0;
    }

    .exam-content {
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
            .gtitle {
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
            background: #f4f4f4;
            padding: 40px 60px;
            height: 645px;
            overflow-y: auto;
            border-radius: 0 0 10px 10px;
            ul.exam-list {
                padding: 0;
                li {
                    width: 100%;
                    height: 45px;
                    line-height: 45px;
                    color: #000;
                    margin: 10px 0;
                    border-radius: 10px;
                    padding-left: 30px;
                    background: #fff;
                    border: solid 1px #dcdcdc;
                    cursor: pointer;
                    font-size: 11pt;
                    display: flex;
                    .subject {
                        width: 800px;
                    }
                    .author {
                        width: 100px;
                    }
                    .timelimit {
                        width: 100px;
                    }
                    &:hover {
                        background: #1E90FF;
                        color: #fff;
                    }
                    &.complete {
                        background: #207245;
                        color: #fff;
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
                        .gtitle {
                            width: 85%;
                            text-align: left;
                            font-size: 11pt;
                            color: #000;
                            font-weight: bold;
                            padding-left: 40px;
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
                        input {
                            border-radius: 10px;
                            width: 100%;
                            height: 43px;
                            margin: auto;
                            border: none;
                            padding-left: 20px;
                        }

                    }
                }
            }
        }
        .bottom-box {
            height: 65px;
            line-height: 65px;
            border-top: solid 1px #dcdcdc;
            display: flex;
            padding: 0 20px;
            font-size: 10pt;
            .author {
                width: 150px;
                padding-left: 40px;
                span {
                    color: #000;
                    font-weight: bold;
                }
            }
            .timelimit {
                width: 700px;
                span {
                    color: #2D8CFF;
                    font-weight: bold;
                }

            }
            .button {
                button {
                    width: 250px;
                    height: 40px;
                    line-height:40px;
                    border-radius: 20px;
                    color: #fff;
                    background: #5E65E3;
                }
            }
        }
        &.mobile {
            width:100%;
            height:auto;
            -webkit-box-shadow:none;
            -moz-box-shadow:none;
            box-shadow:none;
            border-radius:0;
            position:relative;
            left:0;
            top:0;
            background: #ffffff;
            margin:0;
            .contents {
                background: #f4f4f4;
                padding:20px 15px;
                height:auto;
                overflow-y:visible;
                border-radius: 0;
                ul.exam-list {
                    padding:0;
                    li {
                        width: 100%;
                        height: 45px;
                        line-height: 45px;
                        color: #000;
                        margin:10px 0;
                        border-radius: 10px;
                        padding-left:30px;
                        background: #fff;
                        border: solid 1px #dcdcdc;
                        cursor: pointer;
                        font-size: 11pt;
                        display: flex;
                        .subject {
                            width:80%;
                        }
                        .author {
                            width: 80px;
                        }
                        .timelimit {
                            width: 50px;
                        }
                        &:hover {
                            background: #1E90FF;
                            color: #fff;
                        }
                        &.complete {
                            background:#207245;
                            color:#fff;
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
                            .dt-title {
                                width: 85%;
                                text-align: left;
                                font-size: 11pt;
                                color: #000;
                                font-weight: bold;
                                padding-left: 40px;
                            }
                        }
                        .data-list {
                            padding:20px 20px 5px 20px;
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
            .bottom-box {
                height: 65px;
                line-height: 65px;
                border-top: solid 1px #dcdcdc;
                display:flex;
                padding:0 20px;
                font-size:10pt;
                .author {
                    display:none;
                    width:0;
                    padding-left:0;
                }
                .timelimit {
                    width:0;
                    display:none;

                }
                .button {
                    width:100%;
                    button {
                        width:100%;
                        height:40px;
                        margin:auto;
                        border-radius:0;
                        color:#fff;
                        background: #5E65E3;
                    }
                }
            }
        }

    }





</style>