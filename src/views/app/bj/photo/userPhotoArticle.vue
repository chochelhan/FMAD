<template>
    <div :class="'data-contents '+mobileClass">

        <div class="search-box">
            <div class="left-box">
                <div class="select-box">
                    <selectBox v-if="partList.length>0"
                               :value="part"
                               :items="partList"
                               @onSelected="partChange"
                    >
                    </selectBox>

                </div>


            </div>
            <div class="right-box">
                <div class="select-box">
                    <selectBox
                        :value="itemLimit"
                        :items="itemLimitList"
                        @onSelected="itemLimitChange"
                    >
                    </selectBox>
                </div>
                <div class="reg-button-box" v-if="isAdmin">
                    <v-btn
                        type="button"
                        @click="articleRegist()"
                        class="reg-button"
                        v-if="!mobileView"
                    >

                        글쓰기
                    </v-btn>
                    <v-btn
                        type="button"
                        @click="articleRegist()"
                        class="reg-button"
                        v-if="mobileView"
                    >

                        <i class="fas fa-plus"></i>
                    </v-btn>
                </div>
            </div>
            <div style="clear:both"></div>
        </div>
        <div>
            <ul class="list-table">

                <li
                    v-for="item in dataList"
                    :key="item.no" @click="showView(item)">
                    <div class="dark-screen"></div>
                    <div class="img-box">
                        <img :src="host+item.img" v-if="item.img">
                        <div class="icon-box">
                            <img src="../../../../assets/images/ico_like.png">
                            <span class="like-text">{{item.glike}}</span>
                            <img src="../../../../assets/images/ico_pm.png">
                            <span class="like-text">{{item.comm_num}}</span>
                        </div>
                    </div>

                </li>
            </ul>

            <div v-if="dataList.length<1" class="empty-data">
                데이타가 존재하지 않습니다
            </div>

        </div>
        <div class="text-center pt-2">
            <paganation v-if="dataList.length>0"
                        :page="page"
                        :pageCount="pageCount"
                        :total="itemTotal"
                        :limit="itemLimit"
                        :pageInit="pageInit"
                        @getDataListByPaging="getData"
            ></paganation>
        </div>
        <div style="height:40px"></div>
        <v-dialog
            v-if="!mobileView"
            v-model="modalShow"
            width="780"
            persistent
            style="z-index:100;"
        >
            <userPhotoRegist v-if="articleRegistShow" :ownerUid="ownerUid" :no="selectedNo"
                             @modalHide="modalHide"></userPhotoRegist>
        </v-dialog>

    </div>
</template>


<script>
	import AUTH from '../../../../api/auth'
	import {
		HOST,
		API_URL_USER_PHOTO_ARTICLE_LIST_BYUID,
		API_URL_USER_PHOTO_ARTICLE_LIST
	} from '../../../../api/urls';
	import apiService from '../../../../api/apiService';
	import {mapGetters} from "vuex";
	import userPhotoRegist from './userPhotoRegist'
	import selectBox from '../../../../components/selectBox/select';
	import paganation from '../../../../components/paganation'
    import JQ from "jquery"
	export default {
		name: 'userPhotoArticle',
		components: {
			userPhotoRegist,
			selectBox,
			paganation
		},
		computed: {
			...mapGetters('etc', ["getUid"]),
		},
		watch: {
			checkboxAll(val) {
				for (let key in this.nos) {
					if (val) {
						this.nos[key] = true;
					} else {
						this.nos[key] = false;
					}
				}
			},
			modalShow(val) {
				if (!val) {
					this.selectedNo = '';
					this.articleRegistShow = false;
				}
			},



		},
		data() {
			return {
                mobileView: false,
                mobileClass: '',
				host: HOST,
				part: 'all',
				partList: [],
				page: 1,
				nos: {},
				pageCount: 5,
				checkboxAll: false,
				itemLimit: 20,
				ownerUid: '',
				itemLimitList: [
					{value: 10, text: '10개'},
					{value: 15, text: '15개'},
					{value: 20, text: '20개'},
					{value: 50, text: '50개'},
					{value: 100, text: '100개'},
				],
				itemTotal: 1,
				dataList: [],
				orgDataList: [],
				serverDataList:[],
				isLogin: false,
				isAdmin: false,
				modalShow: false,
                selectedNo: '',
				articleRegistShow: false,
				uid: '',
				pageInit: false,
                title:'',

			}
		},
		created() {
            if (this.$isMobile()) {
                this.mobileView = true;
                this.mobileClass = 'mobile'
            }
			this.ownerUid = this.getUid;
			let memberInfo = AUTH.getSession(this.$isMobile());
			if (memberInfo.AUTHTOKEN) {
				this.isLogin = true;
				this.uid = memberInfo.uid;
				if (this.uid == this.ownerUid || this.uid == 'admin') {
					this.isAdmin = true;
				}

			}
			this.getServerData();

		},
		methods: {
			showView(item) {
				this.$router.push('/' + this.ownerUid + '/main/userPhoto/view/' + item.no);

			},
			modalHide(cmd) {
			        this.modalShow = false;
                    this.articleRegistShow = false;

				if (cmd == 'reload') {
					this.getServerArticleData();
				}
			},
			itemLimitChange(value) {
				this.itemLimit = value;
				this.getData(1);
			},
			partChange(value) {
				this.part = value;
				this.getServerArticleData();
			},
			getServerData() {

				const frm = new FormData()
				frm.append('uid', this.ownerUid)
				apiService.post(API_URL_USER_PHOTO_ARTICLE_LIST_BYUID, frm, (res) => {
					this.partList.push({text: '분류 전체', value: 'all'});
					for (let grp of res.boardInfo.content) {
						this.partList.push({text: grp.name, value: grp.code})
					}
					if (res.list.length > 0) {
						this.serverDataList = res.list;
						for (let item of this.serverDataList) {
							item.comm_num = (item.comm_num) ? item.comm_num : 0;
							item.glike = (item.glike) ? item.glike : 0;
							item.img = item.vfiles[0].url;
							this.orgDataList.push(item);
						}
						this.getData(1);
					}
				});

			},
			getServerArticleData() {


				const frm = new FormData()
				frm.append('uid', this.ownerUid)
				frm.append('bid', this.part)
				apiService.post(API_URL_USER_PHOTO_ARTICLE_LIST, frm, (res) => {
					this.dataList = [];
					if (res.list.length > 0) {
						this.serverDataList = res.list;
						this.orgDataList = [];
						for (let item of this.serverDataList) {
							item.comm_num = (item.comm_num) ? item.comm_num : 0;
							item.glike = (item.glike) ? item.glike : 0;
							item.img = item.vfiles[0].url;
							this.orgDataList.push(item);
						}
						this.getData(1);
					} else {
						this.serverDataList = [];
						this.orgDataList=[];
						this.dataList = [];
                    }
				});

			},
			getData(page) {
				let start = (page - 1) * this.itemLimit;
				let end = start + this.itemLimit;
				this.itemTotal = this.orgDataList.length;

				let orgDataList = this.orgDataList.slice(start, end);
				this.dataList = [];
				let startNum = '';
				if (this.itemTotal >= this.itemLimit) {
					startNum = (this.itemTotal - ((page - 1) * this.itemLimit)) + 1;
				} else startNum = this.itemTotal
				let k = 0;
				this.nos = {};
				for (let item of orgDataList) {
					this.nos[item.no] = false;
					item.num = startNum - k;
					this.dataList.push(item);
					k++;

				}

			},
			articleRegist() {
			    if(this.mobileView) {
                    this.$router.push('/' + this.ownerUid + '/main/userPhoto/regist');
                } else {
                    this.modalShow = true;
                    this.articleRegistShow = true;
                }



			}

		},
		updated() {

		}

	}
</script>

<style lang="scss" scoped="true">
    .data-contents {
        width: 100%;
        .regist-button {
            margin: -10px 0 10px 0;
            .reg-button {
                width: 160px;
                border-radius: 20px;
                height: 40px;
            }
        }
        .regist-button-bottom {
            margin: 10px 0 0 0;
            .reg-button {
                width: 160px;
                border-radius: 20px;
                height: 40px;
            }
        }
        .search-box {
            margin: 10px 0 30px 0;
            position:relative;
            z-index:10;
            .left-box {
                float: left;
                display: flex;
                .select-box {
                    width: 220px;
                    margin-right: 15px;
                }
            }
            .right-box {
                float: right;
                display: flex;
                .select-box {
                    width: 160px;
                    margin-right: 15px;
                }
                .reg-button-box {
                    .reg-button {
                        width: 140px;
                        border-radius: 5px;
                        background: #686EFB;
                        color: #fff;
                        height: 40px;
                    }
                }
            }
            .text-box {
                width: 350px;
                display: flex;
                i {
                    position: relative;
                    z-index: 10;
                    margin: 13px 0 0 -25px;
                }
            }

        }
        .data-info-box {
            height: 30px;
            display: flex;
            justify-content: space-between;
            .total {
                font-size: 10pt;
                font-weight: bold;
                margin-right: 30px;
            }
            .select-box {
                width: 160px;
                display: flex;
                font-size: 10pt;
                font-weight: bold;
                margin-top: -8px;
                span {
                    width: 150px;
                    display: inline-block;
                    margin-top: 8px;
                }
            }

        }
        .list-table {
            width: 100%;
            padding: 0;
            display: flex;
            flex-wrap: wrap;
            li {
                width: 18.4%;
                margin-right:2%;
                &:nth-child(5n) {
                    margin-right:0;
                }
                color: #fff;
                padding:0;
                margin-bottom: 12px;
                cursor: pointer;
                position:relative;
                .dark-screen {
                    width:100%;
                    height:230px;
                    position:absolute;
                    left:0;
                    top:0;
                    background:rgba(0,0,0,0.3);

                }
                &:hover {
                    .dark-screen {
                        display:none;
                    }
                }

                .img-box {
                    width: 100%;
                    cursor: pointer;
                    height: 230px;
                    overflow: hidden;
                    img {

                        width: 100%;
                        min-height:230px;
                    }
                    .icon-box {
                        width:100%;
                        position:absolute;
                        bottom:10px;
                        margin-top: 10px;
                        display:flex;
                        justify-content: flex-end;
                        img {
                            width: 20px;
                            min-height:auto;
                            cursor: pointer;
                        }
                        span {
                            color: #fff;
                            font-size: 12pt;
                            display: inline-block;
                            margin:0 20px 0 0;
                            padding-left: 7px;
                            position: relative;
                            top: 2px;
                        }
                    }
                }
            }
        }
        .empty-data {
            height: 150px;
            text-align: center;
            line-height: 150px;
            font-size: 10pt;
            background: #fafafa;
            color: #000;
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
            .regist-button {
                margin: -10px 0 10px 0;
                .reg-button {
                    width: 160px;
                    border-radius: 20px;
                    height: 40px;
                }
            }
            .regist-button-bottom {
                margin: 10px 0 0 0;
                .reg-button {
                    width: 40px;
                    border-radius: 20px;
                    height: 40px;

                }
            }
            .search-box {
                margin:10px 0 30px 0;
                position:relative;
                width:100%;
                z-index:10;
                .left-box {
                    float: left;
                    display: flex;
                    width:48%;
                    .select-box {
                        width:100%;
                        margin-right:0;
                    }
                }
                .right-box {
                    float: right;
                    display: flex;
                    width:48%;
                    .select-box {
                        width:100%;
                        margin-right:0;
                    }
                    .reg-button-box {
                        position:fixed;
                        bottom:65px;
                        right:15px;
                        .reg-button {

                            width:40px;
                            max-width:40px;
                            min-width:40px;
                            border-radius: 20px;
                            background: #686EFB;
                            color: #fff;
                            height: 40px;
                            font-size:18px;
                        }
                    }
                }
                .text-box {
                    width: 350px;
                    display: flex;
                    i {
                        position: relative;
                        z-index: 10;
                        margin: 13px 0 0 -25px;
                    }
                }

            }
            .data-info-box {
                height: 30px;
                display: flex;
                justify-content: space-between;
                .total {
                    font-size: 10pt;
                    font-weight: bold;
                    margin-right: 30px;
                }
                .select-box {
                    width: 160px;
                    display: flex;
                    font-size: 10pt;
                    font-weight: bold;
                    margin-top: -8px;
                    span {
                        width: 150px;
                        display: inline-block;
                        margin-top: 8px;
                    }
                }

            }
            .list-table {
                width: 100%;
                padding:0;
                display:flex;
                justify-content: space-between;
                li {
                    width:49%;
                    margin-right:2%;
                    &:nth-child(2n) {
                        margin-right:0;
                    }
                    margin-right:0;
                    color: #000;
                    padding:0;
                    margin-bottom: 20px;
                    position:relative;
                    .dark-screen {
                        width:100%;
                        height:150px;
                        position:absolute;
                        left:0;
                        top:0;
                        background:rgba(0,0,0,0.1);
                    }
                    &:hover {
                        .dark-screen {
                            display:none;
                        }
                    }

                    .img-box {
                        width: 100%;
                        height: 150px;
                        overflow: hidden;
                        img {
                            width: 100%;
                            min-height:150px;
                        }
                        .icon-box {
                            width:100%;
                            position:absolute;
                            bottom:10px;
                            margin-top: 10px;
                            display:flex;
                            justify-content: flex-end;
                            img {
                                width: 20px;
                                min-height:auto;
                                cursor: pointer;
                            }
                            span {
                                color: #fff;
                                font-size: 12pt;
                                display: inline-block;
                                margin:0 20px 0 0;
                                padding-left: 7px;
                                position: relative;
                                top: 2px;
                            }
                        }
                    }
                }
            }
            .empty-data {
                height: 150px;
                text-align: center;
                background: #fafafa;
                line-height: 150px;
                font-size: 12px;
                color: #000;
            }
            .submit-button-box {
                padding-top: 50px;
                text-align: right;
                .submit-button {

                    width: 250px;
                    min-height: 50px;
                }
            }
            .mobile-screen-box {
                width:calc(100vw);
                position:fixed;
                top:0;
                left:0;
                z-index:150;
            }
            .meet-mobile-header {
                width: 100%;
                position: fixed;
                background: #141A2C;
                z-index: 90;
                top: 0;
                left: 0;
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
    }
</style>
