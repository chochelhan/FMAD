<template>

    <div :class="'exam-content '+mobileClass">
        <div class="title-box" v-if="!mobileView">
            <div class="dt-title">{{subject}}</div>
            <div class="del-box" v-if="dataList.length>0" @click="barHideBox()"><i class="fas fa-minus"></i></div>
            <div class="del-box" v-if="dataList.length<1" @click="pollClose()"><i class="fas fa-times"></i></div>
        </div>
        <div class="contents">
            <div class="data-list-box">
                <div style="text-align:center;padding-top:200px;color:#000;font-weight:bold;" v-if="dataList.length<1">
                    주최자가 사전에 설정한 투표가 없습니다
                </div>
                <div class="data-list-box" v-if="dataList.length>0">
                    <div class="data-list-item">
                        <ul class="data-list">
                            <li v-for="(item,idx) in dataList"  :class="item.active" @click="setAnswer(idx)">
                                <span>{{idx+1}}</span> {{item.answer}}
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        <div class="bottom-box">
            <div class="author"></div>
            <div class="timelimit"></div>
            <div class="button">
                <v-btn type="button" v-if="dataList.length>0" @click="problemSubmit()">{{buttonText}}</v-btn>
                <v-btn type="button" v-if="dataList.length<1" @click="pollClose()">닫 기</v-btn>
            </div>
        </div>
    </div>
</template>


<script>

	import {
		API_URL_BROADCAST_LIVE_VOTE_REPLY_INSERT,
		API_URL_BROADCAST_LIVE_VOTE_LIST
	} from '../../../../api/urls';
	import apiService from '../../../../api/apiService';

	export default {
		name: 'voteRun',
		props: ["recepiveData"],
		data() {
			return {
                mobileView: false,
                mobileClass: '',
				dataList: [],
				subject: '',
				name: '',
				uid: '',
				gno: '',
				userAnswer:[],
				multigoods:'',
				observeUser: false,
				buttonText: '제출하기',
			}
		},
		created() {
            if (this.$isMobile()) {
                this.mobileClass = 'mobile'
                this.mobileView = true;
            }
			this.observeUser = (localStorage.getItem("observeUser") == "yes") ? true : false;
			if (this.observeUser) this.buttonText = 'Skip';
			this.getPoll();
		},

		methods: {
			pollClose() {
				this.hideEventBox();
			},
			barHideBox() {
				this.$emit("sendDataEvent", {page: 'barHide', active: 'vote'});
			},
			hideEventBox() {
				this.$emit("sendDataEvent", {page: 'vote', active: 'voteHide'});
			},
			getPoll() {

				if (this.recepiveData.no < 1) return;
				this.gno = this.recepiveData.no;
				this.getPollInfo();
			},
			getPollInfo() {
				this.dataList = [];
				const frm = new FormData()
				frm.append('gno', this.gno)
				apiService.post(API_URL_BROADCAST_LIVE_VOTE_LIST, frm, (ret) => {

					this.subject = ret.info.subject
					this.multigoods = ret.info.multigood;
					if(this.multigoods == 'yes') {
						this.userAnswer = [];
					} else this.userAnswer = '';
					for(let item of ret.info.items) {
						this.dataList.push(item);
					}


				})
			},
			doError() {
				let message = {
					message: '잘못된 접근입니다',

				};
				this.$eventBus.$emit('modalOpen', message);
			},
			setAnswer(idx) {
				let i = 0;
				let result = '';
				for (let item of this.dataList) {
					if (this.multigoods == 'yes') {
						if (i == idx) {
							if (item.active == 'active') {
								item.active = '';
								result = 'minus';
							} else {
								item.active = 'active';
								result = 'plus';
							}
						}
					} else {
						if (i == idx) item.active = 'active';
						else item.active = '';
					}
				    this.$set(this.dataList,i,item)
					i++;

				}



				let good = (idx + 1);
				if(this.multigoods=='yes') {
					if(result == 'plus') {
						this.userAnswer.push(good);
					} else {
						let delIndex = 0;
						for(let anum of this.userAnswer) {
							if(parseInt(anum) == good) {
								this.userAnswer.splice(delIndex, 1);
							}
							delIndex++;
						}
					}
				} else {
					this.userAnswer = good;
				}

			},
			problemSubmit() {


				let answers ="";
				let anserFlg = false;
				if(this.multigoods=='yes') {
					anserFlg = (this.userAnswer.length>0)?true:false;
					answers = this.userAnswer.join(',');
				} else {
					anserFlg = (this.userAnswer)?true:false;
					answers = this.userAnswer;
				}
				if(!anserFlg && !this.observeUser ) {
					let message = {
						message: '답안을 선택하세요',
					};
					this.$eventBus.$emit('modalOpen', message);
					return;
				}
				const frm = new FormData()
				frm.append('gno', this.gno)
				frm.append('name', this.recepiveData.name);
				frm.append('uid', this.recepiveData.uid);
				frm.append('email', this.recepiveData.email);
				frm.append('answers', JSON.stringify(answers));
				this.$eventBus.$emit('overlay', 'show');
				apiService.post(API_URL_BROADCAST_LIVE_VOTE_REPLY_INSERT, frm, (ret) => {
					this.$eventBus.$emit('overlay', 'hide');
					this.gno = 0;
					this.$emit("sendDataEvent", {page: 'vote', active: 'replayVote'});
					let message = {
						message: '투표를 제출하였습니다',
					};
					this.$eventBus.$emit('modalOpen', message);

				});
			}
		}
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
            .dt-title {
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
            ul.exam-list {
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
                        padding: 20px 40px 5px 40px;
                        li {
                            cursor:pointer;
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
                            width:100%;
                            height:43px;
                            margin:auto;
                            border:none;
                            padding-left:20px;
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
                    width:0;
                    padding-left:0;
                }
                .timelimit {
                    width:0;

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