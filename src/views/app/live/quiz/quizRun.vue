<template>
    <div :class="'exam-content '+mobileClass">
        <div class="title-box">
            <div class="exam-title">{{subject}}</div>
            <div class="del-box" v-if="!mobileView" @click="barHideBox()"><i class="fas fa-minus"></i></div>
        </div>
        <div class="contents">
            <div class="data-list-box">
                <div class="data-list-item">
                    <ul class="data-list" v-if="prbType=='mchoice'">
                        <li v-for="(item,idx) in dataList" :class="item.gclass" @click="setAnswer(idx)">
                            <span>{{idx+1}}</span> {{item.answer}}
                        </li>
                    </ul>
                    <div class="subjectAnswer" v-if="prbType=='subject'">
                        <input v-model="userAnswer" placeholder="답을 입력하세요">
                    </div>
                </div>
            </div>
        </div>
        <div class="bottom-box">
            <div class="author"></div>
            <div class="timelimit"></div>
            <div class="button">
                <v-btn type="button" @click="problemSubmit()">{{buttonText}}</v-btn>
            </div>
        </div>

    </div>
</template>


<script>
	import {
		API_URL_BROADCAST_LIVE_QUIZ_INFO,
		API_URL_BROADCAST_LIVE_QUIZ_REPLY_INSERT
	} from '../../../../api/urls';
	import apiService from '../../../../api/apiService';

	export default {
		name: 'quizRun',
		props: ["recepiveData"],
		data() {
			return {
                mobileView: false,
                mobileClass: '',
				no: '',
				uid: '',
				name: '',
				dataList: [],
				subject: '',
				userAnswer: '',
				info: {},
				prbType: '',
				observeUser: false,
				buttonText: '제출하기',

			}
		},
		created() {
            if (this.$isMobile()) {
                this.mobileClass = 'mobile'
                this.mobileView = true;
            }
			this.no = this.recepiveData.no;
			this.uid = this.recepiveData.uid;
			this.name = this.recepiveData.name;

			this.observeUser = (localStorage.getItem("observeUser") == "yes") ? true : false;
			if (this.observeUser) this.buttonText = 'Skip';

			this.getData();
		},
		methods: {
			hideEventBox() {
				this.$emit("sendDataEvent", {page: 'quiz'});
			},
			barHideBox() {
				this.$emit("sendDataEvent", {page: 'barHide', active: 'quiz'});
			},
			getData() {
				const frm = new FormData()
				frm.append('no', this.no)
				apiService.post(API_URL_BROADCAST_LIVE_QUIZ_INFO, frm, (ret) => {

					this.info = ret.info;
					this.prbType = this.info.prbType;
					this.subject = ret.info.question;
					if (this.prbType == 'mchoice') {
						for (let item of ret.info.items) {
							item.gclass = '';
							this.dataList.push(item);
						}
					}

				})
			},
			setAnswer(idx) {
				let i = 0;
				for (let item of this.dataList) {
					if (i == idx) item.gclass = 'active';
					else item.gclass = '';
					this.$set(this.dataList,i,item);
					i++;

				}
				let good = (idx + 1);
				this.userAnswer = good;
			},
			problemSubmit() {

				let answers = "";
				let anserFlg = false;
				anserFlg = (this.userAnswer) ? true : false;
				answers = this.userAnswer;
				if (!anserFlg && !this.observeUser) {
					let message = {
						message: '답안을 선택하세요',
					};
					this.$eventBus.$emit('modalOpen', message);
					return;
				}
				let result;
				if (this.prbType == 'mchoice') {
					if (this.info.good == this.userAnswer) result = 'good';
					else result = 'bad';
				} else {
					if (this.info.subjectGood == this.userAnswer) result = 'good';
					else result = 'bad';
				}
				const frm = new FormData()
				frm.append('pno', this.no)
				frm.append('name', this.name)
				frm.append('uid', this.uid)
				frm.append('answers', answers)
				frm.append('result', result)
				apiService.post(API_URL_BROADCAST_LIVE_QUIZ_REPLY_INSERT, frm, (ret) => {
					this.$emit("sendDataEvent", {page: 'quiz', active: 'replayQuiz'});
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
            background: #f4f4f4;
            padding: 40px 60px;
            height: 580px;
            overflow-y: auto;
            border-radius: 0 0 10px 10px;
            .data-list-box {
                margin-bottom: 20px;
                .data-list-item {
                    border: solid 1px #DCDCDC;
                    border-radius: 12px;
                    background: #E8F4FF;
                    margin: 20px 0 0 0;
                    .data-list {
                        padding: 20px 40px 5px 40px;
                        li {
                            cursor: pointer;
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
                        padding: 0;
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