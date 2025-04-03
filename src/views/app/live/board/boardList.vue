<template>
    <div :class="'mypage-container '+compontentType">
        <div class="modal-header" v-if="!mobileView">
            <div class="center-title">
                게시글 보기
            </div>
            <div class="del-box" @click="close()">
                <i class="fas fa-times"></i>
            </div>
        </div>
        <div :class="'contents '+mobileClass">
            <ul class="article-list">
                <li v-for="(info,idx) in datas" @click="zoomBoardView(idx)">
                    <div class="subject">
                            <span v-if="info.notice=='yes'" class="notice-mp">
                                <img src="../../../../assets/svg/ico_mp.svg" style="width:17px;">
                            </span>
                        {{info.subject}}
                        <div class="date"><span style="font-weight:bold;color:#000;">{{info.userName}}</span>&nbsp; {{info.rdate.substring(0,10)}}</div>
                    </div>
                    <div class="file" v-if="info.fileView">
                        <i class="fas fa-paperclip"></i>  {{info.fileName}} (다운로드 가능기간 ~ {{info.limitDate}})
                    </div>
                </li>
            </ul>
        </div>
        <div class="modal-footer" v-if="!mobileView">
            <p class="submit-button-box">
                    <v-btn
                        type="button"
                        class="cancle-button"
                        @click="close()"
                    >
                        창닫기
                    </v-btn>

                </p>
        </div>


    </div>
</template>


<script>
	import {
		API_URL_BROADCAST_LIVE_BOARD_ARTICLE_LIST,
	} from '../../../../api/urls';
	import apiService from '../../../../api/apiService';

	export default {
		name: 'liveBoardList',
	    props:["gno","compontentType"],
		data() {
			return {
				mobileView: false,
				mobileClass: '',
				datas:[],

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
			zoomBoardView(idx) {
				let no = this.datas[idx].no;
				this.$emit("articleView",no);
            },
			getData() {
				const frm = new FormData()
				frm.append('gno', this.gno)

				apiService.post(API_URL_BROADCAST_LIVE_BOARD_ARTICLE_LIST, frm, (ret) => {

					this.datas = ret.list;
				});
			},

            close() {
	            if(this.compontentType=='live') {
		            this.$emit("hideEvent",{page:'list'});
	            } else {
		            this.$emit("modalHIde");
	            }
            },

		},

	}
</script>
<style lang="scss" scoped>
    .mypage-container {
        min-height:auto;
        background: #fff;
    }
    .modal-header {
        background:#fff;
        padding:20px;
        position:relative;
        border-bottom: solid 1px #dcdcdc;
        .center-title {
            text-align:center;
            font-weight:bold;
            color:#000;
            font-size:14pt;
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
            position:absolute;
            right:10px;
            top:15px;
            line-height:22px;
        }
    }
    .modal-footer {
        border-top: solid 1px #dcdcdc;
        background: #fff;
        padding:10px 0;
        .submit-button-box {
            background: #fff;
            width: 200px;
            margin:auto;
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
        background:#fafafa;
        max-height:500px;
        padding:20px;
        overflow-y:auto;
        .article-list {
            padding:0;
            li {
                margin:20px;
                background:#fff;
                padding:10px 20px;
                border-radius:10px;
                border:solid 1px #ccc;
                .subject {
                    color:#000;
                    font-weight:bold;
                    padding:10px 0;
                    font-size: 12pt;
                    cursor: pointer;
                }
                .date {
                    color:#999;
                    font-size:10pt;
                    padding-top:5px;
                    cursor: pointer;

                }
                .file {
                    font-size:11pt;
                    i {
                        color: #1E90FF;
                    }
                }

            }
        }
        &.mobile {
            width: 100%;
            padding: 20px 15px;
            background:#fafafa;
            max-height:auto;
            padding:0;
            overflow-y:visible;
            .article-list {
                padding: 0;
                li {
                    margin: 20px;
                    background: #fff;
                    padding: 10px 20px;
                    border-radius: 10px;
                    border: solid 1px #ccc;
                    .subject {
                        color: #000;
                        font-weight: bold;
                        padding: 10px 0;
                        font-size: 16px;
                        cursor: pointer;
                    }

                    .date {
                        color: #999;
                        font-size: 10pt;
                        padding-top: 5px;
                        cursor: pointer;

                    }

                    .file {
                        font-size: 11pt;

                        i {
                            color: #1E90FF;
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
    }


</style>