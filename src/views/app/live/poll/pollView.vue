<template>

    <div :class="'exam-content '+mobileClass">
        <div class="title-box" v-if="!mobileView">
            <div class="dt-title">{{subject}}</div>
            <div class="del-box" @click="hideEventBox()"><i class="fas fa-times"></i></div>
        </div>
        <div class="contents">
            <div class="data-list-box">
                <div class="data-list-item" v-for="(data,pIdx) in dataList">
                    <div class="data-list-top">
                        <div class="dt-title"><span>{{pIdx+1}}.</span> {{data.question}}</div>
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
        <div class="bottom-box">
            <div class="author"></div>
            <div class="timelimit"></div>
            <div class="button">
                <v-btn color="submit-button" type="button" v-if="viewType=='live'"  @click="takeProblem()">화면에 적용하기</v-btn>
                <v-btn color="submit-button" type="button" v-if="viewType=='after'"  @click="hideEventBox()">닫기</v-btn>
            </div>
        </div>
    </div>
</template>


<script>

	import {
		API_URL_BROADCAST_LIVE_POLL_LIST,
		API_URL_BROADCAST_LIVE_UPDATE_POLL_STATUS
	} from '../../../../api/urls';
	import apiService from '../../../../api/apiService';

	export default {
		name: 'pollView',
        props:["gno"],
	   data() {
			return {
                mobileView: false,
                mobileClass: '',
				no:'',
		        dataList:[],
		        viewType:'live',
		        subject: '',
		        status: '',

		    }
		},
		created() {
            if (this.$isMobile()) {
                this.mobileClass = 'mobile'
                this.mobileView = true;
            }
            this.getPoll();
		},

		methods: {
			hideEventBox() {
				this.$emit("hideEvent",{page:'poll'});
			},
			getPoll() {
				//if(urls[1]=='live') {
				//	this.viewType = 'after';
				//}
				this.dataList = [];
				const frm = new FormData()
				frm.append('gno', this.gno)
				apiService.post(API_URL_BROADCAST_LIVE_POLL_LIST, frm, (ret) => {

						this.subject = ret.info.subject;
						this.no = parseInt(ret.info.no);
						this.status = ret.info.status;
						for (let item of ret.info.problems) {
							item.show = false;
							item.checked = false;
							this.dataList.push(item);
						}


				})
			},
			takeProblem() {
				if(!this.no)return;
				if(this.status=='complete') {
					let message = {
						message: '이미 조사완료된 설문입니다',
					};
					this.$eventBus.$emit('modalOpen', message);
					return;
				}

				const frm = new FormData()
				frm.append('no', this.no)
				frm.append('status', 'complete')
				apiService.post(API_URL_BROADCAST_LIVE_UPDATE_POLL_STATUS, frm, (res) => {
					this.$emit("hideEvent",{page:'poll',action:'sendPoll',no:this.gno});
				})

			}

		}

	}
</script>
<style lang="scss" scoped>
    ul {
        padding:0;
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
        .bottom-box {
            height: 65px;
            line-height: 65px;
            border-top: solid 1px #dcdcdc;
            display:flex;
            padding:0 20px;
            font-size:10pt;
            .author {
                width:150px;
                padding-left:40px;
                span {
                    color:#000;
                    font-weight:bold;
                }
            }
            .timelimit {
                width:700px;
                span {
                    color:#2D8CFF;
                    font-weight:bold;
                }

            }
            .button {
                button {
                    width:250px;
                    height:40px;
                    border-radius:20px;
                    color:#fff;
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