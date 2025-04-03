<template>
    <div :class="'mypage-container '+compontentType+' '+mobileClass">
        <div class="modal-header" v-if="!mobileView">
            <div class="center-title">
                게시글 내역
            </div>
            <div class="del-box" @click="close()">
                <i class="fas fa-times"></i>
            </div>
        </div>
        <div :class="'contents '+mobileClass">
            <div class="subject">
                <span v-if="info.notice=='yes'" class="notice-mp">
                    <img src="../../../../assets/svg/ico_mp.svg" style="width:17px;">
                </span>
                {{info.subject}}
                <div class="date"><span style="font-weight:bold;color:#000;">{{info.userName}}</span>&nbsp; {{info.rdate}}
                </div>

                <div v-if="access=='meeting'" class="description" v-html="info.viewDescription">
                </div>
                <div v-if="compontentType!='after' && accessCode!='after' && (access=='meeting'  && (uid=='admin' || uid==info.uid))">
                    <ul class="upd-line" v-if="viewType=='live'">
                        <li @click="updateArticle()">수정</li>
                        <li @click="deleteArticle()">삭제</li>
                    </ul>
                </div>
            </div>
           <div class="description" v-if="access!='meeting'" v-html="info.viewDescription"></div>
            <div class="file" v-if="info.fileView" @click="fileDown()">
                <i class="fas fa-paperclip"></i> {{info.fileName}} (다운로드 가능기간 ~ {{info.limitDate}})
            </div>

            <div class="reple-box" v-if="access=='meeting' && repleUse=='yes'">
                <div class="gtitle">댓글({{repleCount}})</div>
                <div :class="'reple-content '+repleContentClass" v-if="accessCode!='after'  && viewType=='live'">
                    <div>
                        <input autocomplete="off" class="field" v-model="content" placeholder="댓글을 입력해주세요">
                        <div class="errorBox"  v-if="repleContentClass && !content">댓글을 입력해주세요</div>
                    </div>
                    <button class="repleButton" type="button" @click="insertReple()">작성</button>

                </div>
                <ul class="reple-list">
                    <li v-for="data in repleDatas">
                        <div class="del-box" v-if="uid=='admin' || uid==data.uid"
                             @click="deleteArticleReple(data.no)"><i class="fas fa-times"></i></div>
                        <div class="name">{{data.name}}</div>
                        <div class="content">{{data.content}}</div>
                        <div class="date">{{data.viewDate}}</div>
                    </li>
                </ul>
            </div>
        </div>
        <div  :class="'modal-footer '+mobileClass" v-if="accessCode!='after'">
            <div class="button-row" v-if="access!='meeting'">
                <button  type="button" class="cancle" @click="deleteArticle()">삭제
                </button>
                <button type="button" @click="updateArticle()">수정</button>
            </div>
            <div class="navi-row" v-if="access=='meeting'">
                <div :class="activePrev" @click="articlePrevMove()"><i class="fas fa-angle-left"></i> 이전</div>
                <div :class="activeNext" @click="articleNextMove()">다음 <i class="fas fa-angle-right"></i></div>
            </div>
        </div>


    </div>
</template>


<script>
	import UTIL from '../../../../api/util';
	import AUTH from '../../../../api/auth'
	import {
		API_URL_BROADCAST_LIVE_BOARD_ARTICLE_VIEW_INFO,
		API_URL_BROADCAST_LIVE_BOARD_REPLE_UPDATE,
		API_URL_BROADCAST_LIVE_BOARD_REPLE_LIST,
		API_URL_BROADCAST_LIVE_BOARD_REPLE_DELETE,
		API_URL_BROADCAST_LIVE_BOARD_ARTICLE_DELETE
	} from '../../../../api/urls';
	import apiService from '../../../../api/apiService';

	export default {
		name: 'liveBoardView',
		props: ["no", "gno","compontentType"],
		data() {
			return {
				mobileView: false,
				mobileClass: '',
				info: {},
				viewDate: '',
				access: 'meeting',
				title: '',
				repleCount: 0,
				content: '',
                selectedNo:'',
				repleContentClass: '',
				repleDatas: [],
				uid:'',
                uno:'',
				prevNo: '',
				nextNo: '',
				activePrev: '',
				activeNext: '',
				currentIndex: '',
				lastIndex: '',
				repleUse: 'yes',
				accessCode: '',
				viewType: 'live',
				downLimit: 'ing',
				limitRegDate: '',

			}
		},
		created() {
            if (this.$isMobile()) {
                this.mobileClass = 'mobile'
                this.mobileView = true;
            }
			let memberInfo = AUTH.getSession(this.$isMobile());
			if (memberInfo.AUTHTOKEN) {
				this.uid = memberInfo.uid;
				this.uno = memberInfo.no;

			}
			this.selectedNo = this.no;
			this.getData();
		},
		methods: {
			getData() {
				const frm = new FormData()
				frm.append('no', this.selectedNo)
				frm.append('gno', this.gno)
            	apiService.post(API_URL_BROADCAST_LIVE_BOARD_ARTICLE_VIEW_INFO, frm, (ret) => {
					this.info = ret.info;
					this.info.viewDescription = UTIL.nl2brContent(this.info.description);
					this.info.fileView = (this.info.fileName && this.info.fileName != 'undefined') ? true : false;
				    if(this.uid) {
						if(this.uid!='admin') {
							if(ret.boardInfo.uno==this.uno)this.uid='admin'
						}
					}
					if(ret.boardInfo) {
						if(ret.boardInfo.repleUse)this.repleUse = ret.boardInfo.repleUse
						if(ret.boardInfo.downLimit)this.downLimit = ret.boardInfo.downLimit;
						if(ret.boardInfo.limitRegDate)this.limitRegDate = ret.boardInfo.limitRegDate;
					}
					this.repleDatas = [];
					this.repleCount = (ret.repleList) ? ret.repleList.length : 0;
					if(ret.repleList) {
						for (let data of ret.repleList) {
							data.viewDate = data.rdate.substring(0,10)
							this.repleDatas.push(data);
						}
					}
					if(!ret.prevNo) {
						this.activePrev = 'disabled';
						this.prevNo = '';
					} else {
						this.prevNo = ret.prevNo;
						this.activePrev = '';
					}

					if(!ret.nextNo)	{
						this.activeNext = 'disabled';
						this.nextNo = '';
					}  else {
						this.nextNo = ret.nextNo;
						this.activeNext = '';
					}
				});
			},

			close() {
				if(this.compontentType=='live') {
					this.$emit("hideEvent",{page:'view'});
				} else {
					this.$emit("modalHIde",'none');
				}
			},
			articlePrevMove()  {
				if(this.activePrev != 'disabled') {
					this.selectedNo = this.prevNo;
					this.getData();
				}
			},
			articleNextMove() {
				if(this.activeNext != 'disabled') {
					this.selectedNo = this.nextNo;
					this.getData();
				}

			},
			deleteArticleReple(no) {
				let message = {
					type: 'confirm',
					message: '선택된 댓글을 삭제하시겠습니까?',
					doAction:()=>{
						const frm = new FormData()
						frm.append('no', no)
						frm.append('pno', this.selectedNo)
						this.$eventBus.$emit('overlay', 'show');
						apiService.post(API_URL_BROADCAST_LIVE_BOARD_REPLE_DELETE, frm, (ret) => {
							this.$eventBus.$emit('overlay', 'hide');
							let  message = {
								message: '댓글이 삭제되었습니다',

							};
							this.$eventBus.$emit('modalOpen', message);
							this.repleDatas = [];
							this.repleCount = (ret.repleList) ? ret.repleList.length : 0;
							if(ret.repleList) {
								for (let data of ret.repleList) {
									data.viewDate = data.rdate.substring(0,10)
									this.repleDatas.push(data);
								}
							}

						});
                    }
				};
				this.$eventBus.$emit('modalOpen', message);
			},
            insertReple() {
				if (!this.content) {
					this.repleContentClass = 'empty';
					return;
				}
				let memberInfo = AUTH.getSession(this.$isMobile());
				let uid = '';
				let name = '';
				if (memberInfo.AUTHTOKEN) {
					uid = memberInfo.userId;
					name = memberInfo.name;
				} else {
					uid = sessionStorage.getItem('joinUid');
					name = sessionStorage.getItem('userName');
				}

				const frm = new FormData()
				frm.append('pno', this.selectedNo)
				frm.append('uid', uid)
				frm.append('name', name)
				frm.append('content',this.content);
				this.$eventBus.$emit('overlay', 'show');
				apiService.post(API_URL_BROADCAST_LIVE_BOARD_REPLE_UPDATE, frm, (ret) => {
					this.$eventBus.$emit('overlay', 'hide');
						this.content = '';
					    this.repleContentClass = '';
						let  message = {
							message: '댓글이 저장되었습니다',
							doAction:()=> {
                                this.getRepleList();
                            }
						};
					    this.$eventBus.$emit('modalOpen', message);

				});
			},
			getRepleList() {
				const frm = new FormData()
				frm.append('pno', this.selectedNo)
				apiService.post(API_URL_BROADCAST_LIVE_BOARD_REPLE_LIST, frm, (ret) => {
					this.repleDatas = [];
					this.repleCount = (ret.repleList) ? ret.repleList.length : 0;
					if(ret.repleList) {
						for (let data of ret.repleList) {
							data.viewDate = data.rdate.substring(0,10)
							this.repleDatas.push(data);
						}
					}

				});
			},
			deleteArticle() {
				let message = {
					type: 'confirm',
					message: '게시글을 삭제하시겠습니까?',
					doAction:()=>{
						const frm = new FormData()
						frm.append('no', this.selectedNo)
						this.$eventBus.$emit('overlay', 'show');
						apiService.post(API_URL_BROADCAST_LIVE_BOARD_ARTICLE_DELETE, frm, (ret) => {
							this.$eventBus.$emit('overlay', 'hide');
							let  message = {
								message: '게시글이 삭제되었습니다',
								doAction:()=> {
									if(this.compontentType=='live') {
										this.$emit("hideEvent",{page:'view'});
									} else {
										this.$emit("modalHIde",'deleteDone');
									}
                                }
							};
							this.$eventBus.$emit('modalOpen', message);

						});
					}
				};
				this.$eventBus.$emit('modalOpen', message);
			},
			updateArticle(){
				this.$emit("articleUpdate",this.selectedNo);
			},
			fileDown() {
				if(this.viewType == 'after') {
					if(this.downLimit != 'ing') {
						let limitDates = this.limitRegDate.split('T');
						let limitDate = limitDates[0]+' 23:59:59';
						let fendate = new Date(limitDate);
						let nowDate = new Date();
						if(fendate.getTime()>= nowDate.getTime()) {
							location.href = '/server/zoom/filedown?file='+this.info.fileUrl;
						}

					}
				} else {
					location.href = '/server/zoom/filedown?file='+this.info.fileUrl;
				}

			}
		},

	}
</script>
<style lang="scss" scoped>
    .mypage-container {
        min-height: auto;
        background: #fff;
    }

    .modal-header {
        background: #fff;
        padding: 20px;
        border-bottom: solid 1px #DCDCDC;
        position: relative;
        .center-title {
            text-align: center;
            font-weight: bold;
            color: #000;
            font-size: 14pt;
        }
        .del-box {
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: #999;
            color: #fff;
            text-align: center;
            font-size: 10pt;
            margin: 10px 10px 0 0;
            cursor: pointer;
            position: absolute;
            right: 10px;
            top: 15px;
            line-height: 22px;
        }
    }

    .modal-footer {
        border-top: solid 1px #ccc;
        background: #fff;
        padding: 25px 0;
        .navi-row {
            display: flex;
            width: 120px;
            margin: auto;
            div {
                width: 60px;
                text-align: center;
                font-weight: bold;
                cursor: pointer;
                color: #000;
                &.disabled {
                    color: #C3C3C3;
                }
            }
        }
        .submit-button-box {
            background: #fff;
            width: 200px;
            margin: auto;
            .cancle-button {
                width: 100%;
                border-radius: 0;
                padding: 0;
                background: #999999;
                color: #fff;
                min-height: 50px;
                font-size: 12pt;
            }
        }
    }

    .contents {
        background: #fafafa;
        max-height: 500px;
        padding: 20px;
        overflow-y: auto;
        .subject {
            background: #fff;
            font-weight: bold;
            padding: 20px;
            color: #000;
            border: solid 1px #f6f6f6;
            font-size: 12pt;
            .date {
                font-size: 10pt;
                color: #999;
                font-weight: normal;
                padding: 10px 0 20px 0;
            }
        }
        .description {
            background: #fff;
            padding: 20px;
            border: none;
            border-top: solid 1px #DCDCDC;
            font-size: 11pt;
            color: #000;
            height: auto;
            min-height: auto;

        }
        .upd-line {
            display: flex;
            width: 80px;
            padding: 0;
            margin: 0;
            li {
                width: 40px;
                text-align: right;
                font-size: 10pt;
                font-weight: normal;
                color: #999;
                cursor: pointer;
                &:first-child {
                    border-right: solid 1px #999;
                    text-align: left;
                }
            }
        }
        .file {
            margin: 20px 0;
            background: #fff;
            padding: 20px;
            color: #000;
            border: solid 1px #f6f6f6;
            i {
                color: #1E90FF;
            }
        }
        .reple-box {
            background: #fff;
            border: solid 1px #f6f6f6;
            padding: 20px;
            .gtitle {
                font-size: 12pt;
                font-weight: bold;
                color: #000;
                border-bottom: solid 1px #000;
                padding-bottom: 10px;
            }
            .reple-content {
                padding: 10px 0;
                position: relative;
                width: 100%;
                display: flex;
                background:#fff;
                border-bottom: solid 1px #dfdfdf;
                .field {
                    margin: 0;
                    padding: 0;
                    background: #fafafa;
                    border: solid 1px #999;
                    border-radius: 10px 0 0 10px;
                    width: 640px;
                    height: 40px;
                    padding-left: 10px;
                    font-size: 10pt;
                }
                .repleButton {
                    background: #686EFB;
                    color:#fff;
                    text-align:center;
                    line-height:40px;
                    height: 40px;
                    width: 60px;
                    font-size:10pt;
                    border-radius: 0 10px 10px 0;
                }
                &.empty {
                    background:#fff;
                    .errorBox {
                        width:100%;
                        background:#fff;
                        padding: 5px 10px;
                        color: #f00;
                        font-size: 9pt;

                    }
                }
            }
            .reple-list {
                li {
                    position: relative;
                    padding: 10px;
                    border-bottom: solid 1px #dfdfdf;
                    .name {
                        color: #000;
                    }

                    .content {
                        color: #000;
                        padding: 5px 0;
                    }
                    .date {
                        font-size: 10pt;
                        color: #999;
                        font-weight: normal;
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
            }
        }
        &.mobile {
            width: 100%;
            padding:20px 15px;
            background: #fafafa;
            max-height:auto;
            height:auto;
            overflow-y: auto;
            .subject {
                padding:15px;

            }
            .description {
                padding:10px;
                font-size: 10pt;

            }
            .upd-line {
                display: flex;
                width: 80px;
                padding: 0;
                margin: 0;
                li {
                    width: 40px;
                    text-align: right;
                    font-size: 10pt;
                    font-weight: normal;
                    color: #999;
                    cursor: pointer;
                    &:first-child {
                        border-right: solid 1px #999;
                        text-align: left;
                    }
                }
            }
            .file {
                margin: 20px 0;
                background: #fff;
                padding: 20px;
                font-size:14px;
                color: #000;
                border: solid 1px #f6f6f6;
                i {
                    color: #1E90FF;
                }
            }
            .reple-box {
                background: #fff;
                border: solid 1px #f6f6f6;
                padding:15px;
                width: 100%;
                .gtitle {
                    font-size: 14px;
                }
                .reple-content {
                    padding:10px 0;
                    position: relative;
                    width: 100%;
                    display: flex;
                    background: #fff;
                    border-bottom: solid 1px #dfdfdf;
                    .field {
                        margin: 0;
                        padding: 0 0 0 10px;
                        background: #fafafa;
                        border: solid 1px #999;
                        border-radius: 10px 0 0 10px;
                        width:calc(100vw - 120px);
                        height:40px;
                        font-size: 10pt;
                    }
                    .repleButton {
                        background: #686EFB;
                        color: #fff;
                        text-align: center;
                        line-height: 40px;
                        height: 40px;
                        width: 60px;
                        min-width:60px;
                        font-size: 10pt;
                        border-radius: 0 10px 10px 0;
                    }

                    &.empty {
                        background: #fff;
                        width: 100%;
                        .errorBox {
                            width: 100%;
                            background: #fff;
                            padding: 5px 10px;
                            color: #f00;
                            font-size: 9pt;

                        }
                    }
                }

                .reple-list {
                    li {
                        position: relative;
                        padding:10px;
                        border-bottom: solid 1px #dfdfdf;

                        .name {
                            font-size: 13px;
                            color: #000;
                        }

                        .content {
                            color: #000;
                            font-size: 13px;
                            padding: 5px 0;
                        }

                        .date {
                            font-size: 11px;
                            color: #999;
                            font-weight: normal;
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
                }
            }
        }

    }
    .live {
        .contents {
            height: 550px;
            max-height: 550px;
        }
        &.mobile {
            .contents {
                height: auto;
                max-height: auto;
            }

        }
    }



</style>