<template>
    <div :class="'live-content-box '+mobileClass">
        <div class="exam-content" v-if="!problemShow">
            <div class="title-box" v-if="!mobileView">
                <div class="exam-title">저장된 시험 불러오기</div>
                <div class="del-box" @click="hideEventBox()"><i class="fas fa-times"></i></div>
            </div>
            <div class="contents">
                <ul class="exam-list">
                    <li v-for="data in examList" :class="data.status" @click="getProblem(data.no,data.status)">
                        <div class="subject">{{data.name}}</div>
                        <div class="author">{{data.author}}</div>
                        <div class="timelimit">{{data.timelimit}} 분</div>
                    </li>
                </ul>
            </div>
        </div>
        <div class="exam-content" id="problem-box" v-else>
            <div class="title-box"  v-if="!mobileView">
                <div class="exam-title">{{subject}}</div>
                <div class="del-box" @click="goList()"><i class="fas fa-times"></i></div>
            </div>
            <div class="contents">
                <div class="data-list-box">
                    <div class="data-list-item" v-for="(data,pIdx) in dataList">
                        <div class="data-list-top">
                            <div class="exam-title"><span>{{pIdx+1}}.</span> {{data.question}}</div>
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
            <div class="bottom-box" v-if="!mobileView">
                <div class="author">출제자 : <span>{{author}}</span></div>
                <div class="timelimit">제한시간 : <span>{{timelimit}}</span>분</div>
                <div class="button">
                    <v-btn class="btn" type="button" v-if="viewType=='live'"
                            @click="takeProblem()">화면에 적용하기
                    </v-btn>
                    <v-btn  class="btn" type="button" v-if="viewType=='after'" @click="goList()">
                        목록으로
                    </v-btn>
                </div>
            </div>
            <div class="bottom-box"  v-if="mobileView">
                <div class="button">
                    <v-btn  class="btn" type="button" @click="goList()">
                        목록으로
                    </v-btn>
                    <v-btn class="btn" type="button" v-if="viewType=='live'"
                           @click="takeProblem()">화면에 적용하기
                    </v-btn>

                </div>

            </div>
        </div>

    </div>
</template>


<script>
	import {
		API_URL_BROADCAST_LIVE_EXAM_LIST,
		API_URL_BROADCAST_LIVE_GET_EXAM,
		API_URL_BROADCAST_LIVE_UPDATE_EXAM_STATUS
	} from '../../../../api/urls';
	import apiService from '../../../../api/apiService';

	export default {
		name: 'examView',
		props: ["gno"],
		data() {
			return {
                mobileView: false,
                mobileClass: '',
				no: '',
				problemShow: false,
				examList: [],
				dataList: [],
				subject: '',
				timelimit: '',
				author: '',
				viewType: 'live',

			}
		},
		created() {
            if (this.$isMobile()) {
                this.mobileClass = 'mobile'
                this.mobileView = true;

            }
			this.getData();
		},
		methods: {
			hideEventBox() {
				this.$emit("hideEvent",{page:'exam'});
			},
			getData() {
				let urls = this.$route.path.split('/');
				if (urls[1] == 'afterVideo') {
					this.viewType = 'after';
				}
				const frm = new FormData()
				frm.append('gno', this.gno)
                apiService.post(API_URL_BROADCAST_LIVE_EXAM_LIST, frm, (ret) => {

					let item = {};
					let rdate;
					let checkDate;
					let rdates;
					let prdate;
					let regdate;
					for (let data of ret.examList) {
						item = {
							name: data.subject,
							no: data.no,
							author: data.author,
							timelimit: data.timelimit,
							viewDate: data.rdate,
							status: data.status
						}
						this.examList.push(item)
					}

				})
			},
			getProblem(no, status) {
				if (status == 'complete') {
					let message = {
						message: '이미 출제된 시험입니다',

					};
					this.$eventBus.$emit('modalOpen', message);
				} else {
					this.no = no;
					this.getProblemInfo();
					this.problemShow = true;
				}
			},
			goList() {
				this.problemShow = false;

			},
			getProblemInfo() {
				this.dataList = [];
				const frm = new FormData()
				frm.append('no', this.no)
				apiService.post(API_URL_BROADCAST_LIVE_GET_EXAM, frm, (ret) => {

					//console.log(ret.result);
					this.subject = ret.info.subject;
					//this.totalJumsu = parseInt(ret.result.totalJumsu);
					this.timelimit = ret.info.timelimit;
					this.author = ret.info.author;
					for(let item of ret.info.problems) {
						item.show = false;
						item.checked = false;
						this.dataList.push(item);
					}

				})
			},
			takeProblem() {
				this.$emit("hideEvent",{page:'exam',action:'sendProblem',no:this.no});
				const frm = new FormData()
				frm.append('no', this.no)
				frm.append('status', 'complete')
				apiService.post(API_URL_BROADCAST_LIVE_UPDATE_EXAM_STATUS, frm, (ret) => {

                })

			},

		},

	}
</script>
<style lang="scss" scoped>
    ul {
        padding:0;
    }
    .live-content-box {
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

                            .exam-title {
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
                        }
                    }
                }
            }
        }

        #problem-box {

            .contents {
                height: 580px;
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
                    .btn {
                        width: 250px;
                        height: 40px;
                        background: #5E65E3;
                        color: #fff;
                        border-radius: 20px;
                    }
                }
            }
        }
        &.mobile {
            .exam-content {
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
                margin:20px 0 0 0;
                .contents {
                    padding:0 15px;
                    border-radius:0;
                    ul.exam-list {
                        padding:0;
                        li {
                            width: 100%;
                            height: 45px;
                            line-height: 45px;
                            color: #000;
                            margin: 10px 0;
                            border-radius: 10px;
                            padding-left: 20px;
                            background: #fff;
                            border: solid 1px #dcdcdc;
                            cursor: pointer;
                            font-size: 11pt;
                            display: flex;
                            .subject {
                                width:90%;
                            }
                            .author {
                                width: 80px;
                                min-width: 80px;
                            }
                            .timelimit {
                                width: 60px;
                                min-width: 60px;
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
                                .exam-title {
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
                            }
                        }
                    }
                }
            }

            #problem-box {

                .contents {
                    height:auto;
                }
                .bottom-box {
                    height: 60px;
                    background:none;
                    border-top: solid 1px #dcdcdc;
                    padding:0;
                    position:fixed;
                    bottom:0;
                    left:0;
                    width:100%;
                    font-size: 10pt;
                    .button {
                        width:100%;
                        display: flex;
                        .btn {
                            width:50%;
                            height: 60px;
                            background: #5E65E3;
                            color:#fff;
                            border-radius:0;
                            &:first-child {
                                background:#999;
                            }
                        }
                    }
                }
            }
        }
    }
</style>