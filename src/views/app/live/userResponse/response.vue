<template>
    <div :class="'exam-content '+mobileClass">
        <div class="title-box" v-if="!mobileView">
            <div class="gtitle">{{subject}}</div>
            <div class="del-box" @click="barHideBox()"><i class="fas fa-minus"></i></div>
        </div>
        <div class="contents">
            <div class="data-list-box">
                <div class="data-list-item" v-for="(item,idx) in dataList">
                    <div class="data-list-top">
                        <div class="gtitle"><span>{{idx+1}}.</span> {{item.name}}</div>
                        <div class="result">{{item.complete}}</div>
                    </div>
                </div>
            </div>
        </div>
        <div class="bottom-box">
            <div class="author">
                <div v-if="type=='insertProblem'">
                    출제자 :<br v-if="mobileView"> <span>{{author}}</span>
                </div>

            </div>
            <div class="timelimit">
                <div v-if="type=='insertProblem'">제한시간 :<br v-if="mobileView"> <span>{{timelimit}}</span>분</div>
            </div>
            <div class="remain-time">
                <div v-if="type=='insertProblem'">남은시간 : <br v-if="mobileView"><span>{{remainTime}}</span>분 <span>{{remainSec}}</span>초</div>
            </div>
            <div class="button">
                <v-btn type="button" @click="forecEnd()"> {{endButtonMsg}}</v-btn>
            </div>
        </div>

    </div>
</template>


<script>
	import {
		API_URL_BROADCAST_LIVE_USER_RESPONSE_INFO
	} from '../../../../api/urls';
	import apiService from '../../../../api/apiService';

	export default {
		name: 'response',
		props: ["params"],
		data() {
			return {
			    mobileView:false,
                mobileClass:'',
				dataList: [],
				pno: 0,
				no: 0,
				type: '',
				author: '',
				timelimit: '',
				subject: '',
				remainTime: 10,
				remainSec: '',
				intreval: null,
				endButtonMsg: '강제종료',
				endProblem: false,
			}
		},
		created() {
            if (this.$isMobile()) {
                this.mobileClass = 'mobile'
                this.mobileView = true;

            }
			this.$eventBus.$on('liveUserResponse', this.parentAction);

			this.pno = this.params.mno;
			this.no = this.params.no;
			this.type = this.params.type;
			this.getMeetingUser();
		},
		methods: {
			getMeetingUser() {
				this.dataList = [];
	            const frm = new FormData();
	            frm.append('no', this.no)
				frm.append('pno', this.pno)
				frm.append('gtype', this.type)
	            apiService.post(API_URL_BROADCAST_LIVE_USER_RESPONSE_INFO, frm, (ret) => {
						if(ret.info.no<1)return;
						let joinUserList = {};
						switch(this.type) {
							case 'insertProblem':
								this.subject = ret.info.subject+' - 시험관리';
								this.author = ret.info.author;
								this.timelimit = parseInt(ret.info.timelimit);
								this.checkTime();
								break;
							case 'insertPoll':
								this.subject = ret.info.subject+' - 설문관리';
								if(ret.joinUserList) {
									for(let item of ret.joinUserList) {
										joinUserList[item.uid] = item.uid;
									}
								}
								break;
							case 'insertVote':
								this.subject = ret.info.subject+' - 투료관리';
								if(ret.joinUserList) {
									for(let item of ret.joinUserList) {
										joinUserList[item.uid] = item.uid;
									}
								}

								break;
							case 'insertQuiz':
								this.subject = ret.info.question+' - 간단퀴즈관리';
								break;
						}
						let k=0;
						for(let item of ret.userList) {
							if(item.status=='join') {
								if(joinUserList[item.uid]) {
									item.complete = '제출완료';
									k++;
								}  else item.complete = '';
								this.dataList.push(item)
							}
						}
						if((this.type == 'insertPoll' || this.type == 'insertVote') && (k==this.dataList.length)) {
							this.endProblem = true;
							this.endButtonMsg = '조사완료';
						}

                    this.$emit("hideEvent", {page:'userResponse',action:'setSubject',title:this.subject});

				});
			},
			parentAction(params) {
				if(params.uid) {
					let resultNum = 0;
					for (let item of this.dataList) {
						if(item.uid == params.uid) {
							item.complete = '제출완료';
						}
						if(item.complete == '제출완료') {
							resultNum++;
						}
					}
					switch(this.type) {
						case 'insertProblem':
							if (resultNum == this.dataList.length) {
								clearInterval(this.intreval);
								this.endButtonMsg = '제출완료';
								this.endProblem = true;
							}
							break;
						case 'insertQuiz':
							if (resultNum == this.dataList.length) {
								this.endProblem = true;
								this.endButtonMsg = '제출완료';
								this.endProblem = true;
							}
							break;
						case 'insertPoll':
						case 'insertVote':
							if (resultNum == this.dataList.length) {
								this.endProblem = true;
								this.endButtonMsg = '조사완료';
							}
							break;
					}
				}

			},
			forecEnd() {
				if(this.intreval!=null)clearInterval(this.intreval);
				let act = 'end';
				if(this.endProblem) {
					act = 'end';
				}  else act = 'forceEnd';
				this.$emit("hideEvent", {page:'userResponse',action:act,gtype:this.type});
			},
			checkTime() {
				this.remainTime = this.timelimit;
				this.remainSec = 0;

				let sec = 0;
				this.intreval = setInterval(()=> {
					this.remainSec = sec;
					sec--;
					if(sec < 0) {
						this.remainTime--;
						sec=59;
					}

					if(this.remainTime<=0 && sec<=0) {
						this.remainSec = 0;
						this.endButtonMsg = '시험종료';
						this.endProblem = true;
						clearInterval(this.intreval);
					}

				},1000)
			},
			barHideBox() {
				this.$emit("hideEvent", {page:'userResponse',action:'barHide',gtype:this.type});
			},

		},
        beforeDestroy() {
	        this.$eventBus.$off('liveUserResponse');
	        if(this.intreval)clearInterval(this.intreval);
        }

	}
</script>
<style lang="scss" scoped>
    ul {
        padding: 0;
    }

    .exam-content {
        width: 700px;
        height: 700px;
        -webkit-box-shadow: 1px 1px 9px -1px rgba(71, 70, 71, 0.53);
        -moz-box-shadow: 1px 1px 9px -1px rgba(71, 70, 71, 0.53);
        box-shadow: 1px 1px 9px -1px rgba(71, 70, 71, 0.53);
        border-radius: 10px;
        position: absolute;
        left: 50%;
        top: 50%;
        background: #ffffff;
        z-index: 100;
        margin: -350px 0 0 -350px;
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
            height: 580px;
            overflow-y: auto;
            border-radius: 0 0 10px 10px;
            .data-list-box {
                margin-bottom: 20px;
                .data-list-item {
                    border: solid 1px #DCDCDC;
                    border-radius: 12px;
                    background: #E8F4FF;
                    margin: 14px 0 0 0;
                    .data-list-top {
                        background: #fff;
                        height: 60px;
                        line-height: 60px;
                        border-radius: 12px;
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
                        .result {
                            color: #ff0000;
                            font-weight: bold;
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
            .remain-time {
                width: 200px;
                span {
                    color: #ff0000;
                    font-weight: bold;
                }
            }
            .button {
                button {
                    width: 250px;
                    height: 40px;
                    line-height: 40px;
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
            margin:20px 0 0 0;
            .contents {
                background: #f4f4f4;
                padding:0 15px;
                height:auto;
                overflow-y:visible;
                border-radius: 0;
                .data-list-box {
                    margin-bottom:20px;
                    .data-list-item {
                        border: solid 1px #DCDCDC;
                        border-radius: 12px;
                        background: #E8F4FF;
                        margin: 14px 0 0 0;
                        .data-list-top {
                            background: #fff;
                            height: 60px;
                            line-height: 60px;
                            border-radius: 12px;
                            display: flex;
                            position: relative;
                            font-size:14px;
                            .gtitle {
                                width: 85%;
                                text-align: left;
                                font-size: 11pt;
                                color: #000;
                                font-weight: bold;
                                padding-left: 40px;
                            }
                            .result {
                                color: #ff0000;
                                font-weight: bold;
                            }
                        }
                    }
                }
            }
            .bottom-box {
                position:fixed;
                bottom:0;
                width:100%;
                height: 65px;
                line-height:120%;
                background:#fff;
                border-top:solid 1px #dcdcdc;
                display: flex;
                padding:15px 15px 0 15px;
                font-size: 10pt;

                .author {
                    width:80px;
                    padding:0;
                    span {
                        color: #000;
                        font-weight: bold;
                    }
                }
                .timelimit {
                    width:80px;
                    span {
                        color: #2D8CFF;
                        font-weight: bold;
                    }

                }
                .remain-time {
                    width: 100px;
                    span {
                        color: #ff0000;
                        font-weight: bold;
                    }
                }
                .button {
                    button {
                        width:80px;
                        height: 40px;
                        line-height: 40px;
                        border-radius:0;
                        color: #fff;
                        background: #5E65E3;
                    }
                }
            }
        }
    }




</style>