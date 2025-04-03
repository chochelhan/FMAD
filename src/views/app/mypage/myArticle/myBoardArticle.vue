<template>
    <div :class="'data-contents '+mobileClass">
        <div>
            <ul class="list-table">
                <li
                    v-for="item in dataList"
                    :key="item.no"  @click="showView(item)">
                    <div class="info-box">
                        <div class="info-author">
                            <div class="author-img">
                                <img v-if="item.photo" :src="host+item.photo">
                                <i class="fas fa-user" v-else></i>
                            </div>
                            <div class="author-title">
                                <div class="author-name">
                                    {{item.name}}
                                </div>
                                <div class="author-rdate">
                                    {{item.rdate}}
                                </div>
                            </div>
                        </div>
                        <div class="info-subject">{{item.subject}}</div>
                        <div class="info-content" v-html="item.contents"></div>

                    </div>
                    <div class="img-box" >
                        <img :src="host+item.img" v-if="item.img">
                    </div>
                </li>
            </ul>

            <div v-if="dataList.length<1" class="empty-data">
                데이타가 존재하지 않습니다
            </div>

        </div>
        <div style="height:40px"></div>

    </div>
</template>


<script>
	import {
		HOST,
		API_URL_MEMBER_MY_ARTICLE_LIST
	} from '../../../../api/urls';
	import apiService from '../../../../api/apiService';
   export default {
		name: 'myBoardArticle',
		data() {
			return {
				host: HOST,
				dataList: [],
                mobileView: false,
                mobileClass: '',

			}
		},
		created() {
			this.getServerData();
            if (this.$isMobile()) {
                this.mobileView = true;
                this.mobileClass = 'mobile'

            }

		},
		methods: {
			showView(item) {
				this.$router.push('/' + item.ownerUid + '/main/userBoard/view/' + item.no);

			},
			getServerData() {

				const frm = new FormData()
				frm.append('cmd', 'board')
				apiService.post(API_URL_MEMBER_MY_ARTICLE_LIST, frm, (res) => {
					this.dataList = [];
					if (res.list.length > 0) {
						for(let item of res.list) {
							if(item.notice=='yes') {
								item.subject = '[공지] '+item.subject;

                            }
							item.comm_num = (item.comm_num)?item.comm_num:0;
							item.glike = (item.glike)?item.glike:0;
							this.dataList.push(item)
                        }
					}
				});

			},


		},

	}
</script>

<style lang="scss" scoped="true">
    .data-contents {
        width: 100%;
        margin-top:25px;
        .list-table {
            width: 100%;
            padding: 0;
            li {
                border:solid 1px #dcdcdc;
                background: #fff;
                padding: 20px;
                margin-bottom: 15px;
                display: flex;
                cursor:pointer;
                .info-box {
                    width: 90%;
                    padding:10px 0 0 10px;
                    .info-author {
                        display: flex;
                        cursor:pointer;
                        .author-img {
                            width:40px;
                            height:40px;
                            text-align:center;
                            border-radius: 50%;
                            line-height:45px;
                            background:#686EFB;
                            overflow:hidden;
                            margin-right:10px;
                            img {
                                width:100%;
                                min-height:40px;
                            }
                            i {
                                color:#fff;
                                font-size:16pt;
                            }
                        }
                        .author-title {
                            .author-name {
                                font-size: 12pt;
                            }
                            .author-rdate {
                                font-size: 10pt;
                                color: #999;
                            }
                        }
                    }
                    .info-subject {
                        font-size: 15pt;
                        font-weight: bold;
                        margin:10px 0 5px 0;


                    }
                    .info-content {
                        font-size: 12pt;
                        color: #999;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        display: -webkit-box;
                        -webkit-line-clamp: 2; /* 라인수 */
                        -webkit-box-orient: vertical;
                        word-wrap:break-word;
                        line-height:14px;
                        height: 45px;
                        cursor:pointer;
                    }
                    .icon-box {
                        margin-top:10px;
                        img {
                            width:20px;
                            cursor:pointer;
                        }
                        span {
                            color:#686EFB;
                            font-size:12pt;
                            display:inline-block;
                            margin:0 20px 0 0;
                            padding-left:7px;
                            position:relative;
                            top:-4px;
                        }
                    }
                }
                .img-box {
                    cursor:pointer;
                    min-width: 250px;
                    width: 250px;
                    height:150px;
                    overflow:hidden;
                    img {
                        width: 100%;
                        min-height:150px;
                    }

                }
            }
        }
        .empty-data {
            height: 150px;
            text-align: center;
            line-height: 150px;
            font-size: 10pt;
            background: #fff;
            color: #999;
            border-top:solid 1px #dcdcdc;
            border-bottom:solid 1px #dcdcdc;
        }
        .submit-button-box {
            padding-top: 50px;
            text-align: right;
            .submit-button {

                width: 250px;
                min-height: 50px;
            }
        }
        &.mobile {
            padding:0 15px;
            .list-table {
                width: 100%;
                padding: 0;
                li {
                    border:none;
                    border-bottom:solid 1px #dcdcdc;
                    padding:10px 0;
                    margin-bottom:0;
                    .info-box {
                        width: 90%;
                        padding:10px 0 0 10px;
                        .info-author {
                            padding:0;
                            margin-top:-4px;
                            display: flex;
                            cursor:pointer;
                            .author-img {
                                width:26px;
                                height:26px;
                                line-height:27px;
                                margin-right:10px;
                                img {
                                    width:100%;
                                    min-height:26px;
                                }
                                i {
                                    color:#fff;
                                    font-size:11pt;
                                }
                            }
                            .author-title {
                                .author-name {
                                    font-size:8pt;
                                    color:#000;
                                    font-weight:600;
                                }
                                .author-rdate {
                                    font-size: 7pt;
                                    color: #999;
                                }
                            }
                        }
                        .info-subject {
                            font-size: 11pt;
                            font-weight: bold;
                            margin:0;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            display: -webkit-box;
                            -webkit-line-clamp: 2; /* 라인수 */
                            -webkit-box-orient: vertical;
                            word-wrap:break-word;
                            line-height:120%;
                            height: 30px;
                        }
                        .info-content {
                            padding-top:5px;
                            font-size:8pt;
                            height:20px;
                            color: #999;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            display: -webkit-box;
                            -webkit-line-clamp:1; /* 라인수 */
                            -webkit-box-orient: vertical;
                            word-wrap:break-word;

                        }
                        .icon-box {
                            margin-top:10px;
                            img {
                                width:20px;
                                cursor:pointer;
                            }
                            span {
                                color:#686EFB;
                                font-size:12pt;
                                display:inline-block;
                                margin:0 20px 0 0;
                                padding-left:7px;
                                position:relative;
                                top:-4px;
                            }
                        }
                    }
                    .img-box {
                        margin-left:10px;
                        min-width:85px;
                        width: 85px;
                        height:85px;
                        overflow:hidden;
                        img {
                            width: 100%;
                            min-height:85px;
                        }

                    }
                }
            }
            .empty-data {
                height: 150px;
                text-align: center;
                line-height: 150px;
                font-size: 10pt;
                background: #fff;
                color: #999;
                border-top:solid 1px #dcdcdc;
                border-bottom:solid 1px #dcdcdc;
            }
            .submit-button-box {
                padding-top: 50px;
                text-align: right;
                .submit-button {

                    width: 250px;
                    min-height: 50px;
                }
            }
        }
    }
</style>