<template>
    <div  :class="'mypage-container '+mobileClass">

        <div class="contents">
            <div class="from-box">

                <div class="stitle"><span class="line">게시판 내역</span></div>
                <div class="data-list-box">
                    <ul class="data-list">
                        <li v-for="(data,idx) in dataList">
                            <div class="del-box" @click="deleteArticle(idx,data.no)"><i class="fas fa-times"></i>
                            </div>
                            <div class="subject" @click="getDataInfo(data.no)">
                                <span v-if="data.notice" class="notice-mp">
                                    <img src="../../../../assets/svg/ico_mp.svg" style="width:17px;">
                                </span>
                                {{data.name}}
                            </div>
                            <div class="date" @click="getDataInfo(data.no)"><span style="font-weight:bold;color:#000;">{{data.userName}}</span>&nbsp;
                                {{data.viewDate}}
                            </div>
                            <div class="file" v-if="data.fileName">
                                <i class="fas fa-paperclip"></i> {{data.fileName}}
                            </div>
                        </li>
                    </ul>
                    <div class="no-data" v-if="dataList.length<1"
                         style="width:100%;text-align:center;padding-top:60px;color:#000;font-weight: bold;">
                        생성된 게시글이 없습니다
                    </div>
                </div>
            </div>
        </div>
        <v-dialog
            v-if="!mobileView"
            v-model="modalShow"
            width="800"
        >
            <boardView v-if="zoomBoardViewShow" @modalHIde="boardViewHide"  :compontentType="compontentType" :no="selectedNo"  :gno="gno"></boardView>
        </v-dialog>
        <div class="screenBox" v-if="mobileView && modalShow">
            <div class="mobile-header">
                <div class="back-button" @click="modalShow=false">
                    <i class="fas fa-arrow-left"></i>
                </div>
                <div class="header-title">
                    게시글 보기
                </div>
            </div>
            <boardView v-if="zoomBoardViewShow" @modalHIde="boardViewHide"  :compontentType="compontentType" :no="selectedNo"  :gno="gno"></boardView>
        </div>
    </div>
</template>


<script>
	import {mapGetters} from "vuex";
	import boardView from './boardview'
	import {
		API_URL_BROADCAST_LIVE_BOARD_ARTICLE_LIST_WIDTH_BOARDINFO,
		API_URL_BROADCAST_LIVE_BOARD_ARTICLE_DELETE
	} from '../../../../api/urls';
	import apiService from '../../../../api/apiService';

	export default {
		name: 'afterBoard',
		components:{
			boardView
		},
		data() {
			return {
				mobileView: false,
				mobileClass: '',
				gno: '',
				dataList: [],
				selectedNo:'',
				zoomBoardViewShow:false,
				modalShow:false,
				compontentType:'after'

			}
		},
		created() {
            if (this.$isMobile()) {
                this.mobileView = true;
                this.mobileClass = 'mobile'
            }
			this.gno = this.getGno;
			this.getData();
		},
		computed: {
			...mapGetters('etc', ["getGno"]),

		},
		methods: {
			getData() {
				const frm = new FormData()
				frm.append('gno', this.gno)
				apiService.post(API_URL_BROADCAST_LIVE_BOARD_ARTICLE_LIST_WIDTH_BOARDINFO, frm, (ret) => {
					let zoomBoardInfo = ret.zoomBoardInfo;
					let fileLimitDate;
					if(zoomBoardInfo.limitRegDate) {
						let limitDates = zoomBoardInfo.limitRegDate.toString();
						fileLimitDate = limitDates.substring(0,10);
					} else {
						let limitDates = zoomBoardInfo.rdate.toString();
						fileLimitDate = limitDates.substring(0,10);
					}
					for (let fdata of ret.articleList) {
						let rdates = fdata.rdate.toString();
						let regdate = rdates.substring(0,10);
						let rdate = rdates.replace(':', '').replace('-', '').replace(':', '').replace('-', '');
						let prdate = parseInt(rdate);
						fdata.fileName = (fdata.fileName!='undefined' && fdata.fileName)?fdata.fileName:'';
						fdata.limitDate = fileLimitDate
						let item = {
							name: fdata.subject,
							no: fdata.no,
							type: 'board',
							typeName: '게시판',
							viewDate: regdate,
							rdate: prdate,
							userName:fdata.userName,
							notice:((fdata.notice=='yes')?true:false),
							fileName:fdata.fileName,
							info:fdata,
						}
						this.dataList.push(item);
					}
					console.log(this.dataList)
				});
			},
			getDataInfo(no) {
				this.selectedNo = no;
				this.modalShow = true;
				this.zoomBoardViewShow = true;


			},
			boardViewHide() {
				this.selectedNo = '';
				this.modalShow = false;
				this.zoomBoardViewShow = false;

			},
			deleteArticle(idx,no) {
				let message = {
					type: 'confirm',
					message: '게시글을 삭제하시겠습니까?',
					doAction:()=>{
						const frm = new FormData()
						frm.append('no',no)
						this.$eventBus.$emit('overlay', 'show');
						apiService.post(API_URL_BROADCAST_LIVE_BOARD_ARTICLE_DELETE, frm, (ret) => {
							this.$eventBus.$emit('overlay', 'hide');
							let  message = {
								message: '게시글이 삭제되었습니다',
								doAction:()=> {
									this.dataList.splice(idx,1)
								}
							};
							this.$eventBus.$emit('modalOpen', message);

						});
					}
				};
				this.$eventBus.$emit('modalOpen', message);
			},

		},

	}
</script>
<style lang="scss" scoped>
    ul {
        padding: 0;
        li {

        }
    }
    .no-data {
        -webkit-box-shadow: 1px 1px 9px -1px rgba(71, 70, 71, 0.53);
        -moz-box-shadow: 1px 1px 9px -1px rgba(71, 70, 71, 0.53);
        box-shadow: 1px 1px 9px -1px rgba(71, 70, 71, 0.53);
        height: 150px;
        border-radius: 10px;
    }
    .mypage-container {
        .data-list-box {
            margin-top: 30px;

            .data-list {
                display: flex;
                flex-wrap: wrap;

                li {
                    -webkit-box-shadow: 1px 1px 9px -1px rgba(71, 70, 71, 0.53);
                    -moz-box-shadow: 1px 1px 9px -1px rgba(71, 70, 71, 0.53);
                    box-shadow: 1px 1px 9px -1px rgba(71, 70, 71, 0.53);
                    width: 31%;
                    margin: 0 40px 40px 0;
                    height: 150px;
                    padding: 30px 0 0 30px;
                    border-radius: 10px;
                    position: relative;

                    &:nth-child(3n) {
                        margin-right: 0;
                    }

                    .del-box {
                        cursor: pointer;
                        position: absolute;
                        right: 10px;
                        top: 10px;
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

                .gtype {
                    width: auto;
                    padding: 0 10px;
                    display: inline-block;
                    height: 20px;
                    text-align: center;
                    line-height: 20px;
                    border-radius: 10px;
                    font-size: 9pt;;
                    color: #fff;
                    background: #2D8CFF;
                    cursor: pointer;
                }

                .subject {
                    color: #000;
                    font-weight: bold;
                    padding: 10px 0;
                    font-size: 12pt;
                    cursor: pointer;
                }

                .date {
                    color: #999;
                    font-size: 10pt;
                    cursor: pointer;

                }

                .file {
                    padding-top: 5px;
                    font-size: 11pt;

                    i {
                        color: #1E90FF;
                    }
                }
            }
        }
        &.mobile {
            .data-list-box {
                .data-list {
                    width: 100%;
                    display: flex;
                    flex-wrap: wrap;
                    padding:0;
                    li {
                        -webkit-box-shadow: 1px 1px 9px -1px rgba(71, 70, 71, 0.53);
                        -moz-box-shadow: 1px 1px 9px -1px rgba(71, 70, 71, 0.53);
                        box-shadow: 1px 1px 9px -1px rgba(71, 70, 71, 0.53);
                        width: 48%;
                        margin: 0 4% 20px 0;
                        height:150px;
                        padding:20px 0 0 10px;
                        border-radius: 10px;
                        position: relative;

                        &:nth-child(2n) {
                            margin-right: 0;
                        }
                        &:nth-child(3n) {
                            margin-right: 4%;
                        }
                        &.no-data {
                            margin-right:0;
                        }
                        .del-box {
                            cursor: pointer;
                            position: absolute;
                            right: 10px;
                            top: 10px;
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

                    .gtype {
                        width: 45px;
                        height: 20px;
                        text-align: center;
                        line-height: 20px;
                        border-radius: 10px;
                        font-size: 9pt;;
                        color: #fff;
                        background: #2D8CFF;
                        cursor: pointer;
                    }

                    .subject {
                        color: #000;
                        font-weight: bold;
                        padding: 10px 0;
                        font-size: 12pt;
                        cursor: pointer;
                    }

                    .date {
                        color: #999;
                        font-size: 10pt;
                        cursor: pointer;

                    }
                }

                .button-row {
                    width: 100%;
                    margin: 40px auto;

                    button {
                        width: 100%;
                        border-radius: 30px;
                    }
                }
            }
        }
    }
    .screenBox {
        z-index:101;
        width:100%;
        height:calc(100vh);
        position:fixed;
        top:0;
        left:0;
        background:#fff;
        .mobile-header {
            width: 100%;
            background: #141A2C;
            height: 44px;
            display:flex;
            box-shadow: 0px 0px 9px #0000007A;
            .back-button {
                color:#fff;
                margin:10px 0 0 10px;
            }
            .header-title {
                text-align:left;
                padding:10px 0 0 15px;
                color:#fff;
                font-weight: 600;
            }
        }

    }
</style>