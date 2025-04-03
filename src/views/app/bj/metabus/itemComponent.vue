<template>
    <div :class="'data-contents '+mobileClass">
        <div class="search-box">
            <div class="text">아이템</div>
            <div class="left-box">
                <div class="select-box">
                    <selectBox v-if="itemCategorys.length>0"
                               :value="fcate"
                               :items="itemCategorys"
                               @onSelected="fcateChange"
                    >
                    </selectBox>

                </div>

                <div class="select-box">
                    <selectBox v-if="itemSubCategorys.length>0"
                               :value="scate"
                               :items="itemSubCategorys"
                               @onSelected="scateChange"
                    >
                    </selectBox>

                </div>

            </div>
            <div style="clear:both"></div>
        </div>
        <div>
            <ul class="list-table">

                <li
                    v-for="item in dataList"
                    :key="item.no+item.ptNo" @click="showView(item)">
                    <div class="img-box">
                        <img :src="host+item.img" v-if="item.img">

                    </div>
                    <div class="subject">{{item.name}}</div>
                    <div class="desc">{{item.summary}}</div>
                    <div class="price"><span>M</span> {{item.price}}</div>
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
	import AUTH from '../../../../api/auth'
	import {
		HOST,
     	API_URL_METABUS_GET_ITEM_LIST,
	} from '../../../../api/urls';
	import apiService from '../../../../api/apiService';
	import {mapGetters} from "vuex";
	import selectBox from '../../../../components/selectBox/select';

	export default {
		name: 'itemComponent',
		components: {
			selectBox
		},
		props: ["pageCode"],
		computed: {
			...mapGetters('etc', ["getUid"]),
		},
		watch: {
			pageCode() {
				this.itemCategorys = [];
				this.itemSubCategorys = [];
				this.dataList = [];
				this.fcate = 'all'
				this.scate = 'all'
				this.orgCategorys = {};
				this.serverDataList = [];
				this.getServerData();
			},


		},
		data() {
			return {
                mobileView: false,
                mobileClass: '',
				host: HOST,
				itemCategorys: [],
				itemSubCategorys: [],
				ownerUid: '',
				dataList: [],
				fcate: 'all',
				scate: 'all',
				orgCategorys: {},
				serverDataList: [],


			}
		},
		created() {
            if (this.$isMobile()) {
                this.mobileView = true;
                this.mobileClass = 'mobile'
            }
			this.ownerUid = this.getUid;
			this.getServerData();

		},
		methods: {

			showView(item) {
				let no;
				if(this.pageCode == 'goods') {
					no = item.no+'_'+item.ptNo
                } else {
					no = item.no;
				}
				this.$router.push('/' + this.ownerUid + '/main/metaroom/view/' + no+'/'+this.pageCode);

			},
			fcateChange(value) {
				this.fcate = value;

				this.scate = 'all';
				this.itemSubCategorys = [];
				this.itemSubCategorys.push({text: '2차 분류 전체', value: 'all'});
				for (let key in this.orgCategorys[this.fcate].subMenus) {
					let item = this.orgCategorys[this.fcate].subMenus[key];
					this.itemSubCategorys.push({text: item.name, value: item.code})
				}
				this.search();
			},
			scateChange(value) {
				this.scate = value;
				this.search();
			},
			getServerData() {


				const frm = new FormData()
				frm.append('pageCode', this.pageCode)
				frm.append('ownerUid', this.ownerUid);
				apiService.post(API_URL_METABUS_GET_ITEM_LIST, frm, (res) => {
					this.itemCategorys.push({text: '1차 분류 전체', value: 'all'});
					for (let item of res.categorys) {
						this.itemCategorys.push({text: item.name, value: item.code})
						this.orgCategorys[item.code] = item;
					}
					this.itemSubCategorys.push({text: '2차 분류 전체', value: 'all'});
					this.dataList = [];
					if (res.goodsList.length > 0) {
						for (let item of res.goodsList) {
							this.dataList.push(item)
							this.serverDataList.push(item);

						}
					}

				});

			},
			search() {
				this.dataList = [];
				this.serverDataList.filter(data => {
					let result = false;
					if (this.fcate != 'all') {
						if (this.fcate == data.category1) result = true;
					} else {
						result = true;
					}

					if (this.scate != 'all' && result) {
						if (this.scate == data.category2) result = true;
						else result = false;
					} else {
						if (result) result = true;
					}

					if (result) {
						console.log(data)
						this.dataList.push(data);
					}
				})
				this.dataList = _.orderBy(this.dataList, 'no', 'desc');


			},
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
            position: relative;
            padding-bottom: 15px;
            border-bottom: solid 1px #fff;
            z-index: 10;
            .text {
                float: left;
                font-size: 16pt;
                color: #fff;
                font-weight: bold;
                padding-right: 10px;
                line-height: 28pt;
            }
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

        }

        .list-table {
            width: 100%;
            padding: 0;
            display: flex;
            flex-wrap: wrap;
            li {
                border: solid 1px #686EFB;;
                width: 19%;
                margin-right: 1.25%;
                color: #fff;
                padding: 13px;
                margin-bottom: 20px;
                cursor: pointer;
                font-size: 10pt;
                &:nth-child(5n) {
                    margin-right: 0;

                }
                .img-box {
                    width: 100%;
                    text-align: center;
                    margin: auto;
                    height: 150px;
                    overflow: hidden;
                    img {
                        width: auto;
                        max-width:100%;
                        height: auto;
                    }

                }
                .subject {
                    margin-top: 20px;
                    font-weight: bold;
                }
                .desc {
                    color: #999;
                    margin: 4px 0 20px 0;
                }
                .price {
                    color: #686EFB;
                    font-weight: bold;
                    span {
                        color: #fff;
                        font-weight: normal;
                        width: 18px;
                        height: 18px;
                        background: #686EFB;
                        border-radius: 50%;
                        text-align: center;
                        line-height: 18px;
                        display: inline-block;
                        font-size: 8pt;
                    }
                }
            }
        }
        .empty-data {
            height: 150px;
            text-align: center;
            line-height: 150px;
            font-size: 10pt;
            background: #0F1421;
            color: #fff;
        }
        &.mobile {
            width: 100%;
            .search-box {
                margin: 10px 0 30px 0;
                position: relative;
                padding-bottom: 15px;
                border-bottom:none;
                z-index: 10;
                width:100%;
                display:block;
                .text {
                    float: left;
                    font-size: 14px;
                    color: #fff;
                    font-weight: bold;
                    padding-right: 10px;
                    line-height:28pt;
                }

                .left-box {
                    float: left;
                    display: flex;
                    width:100%;
                    margin-right:2%;
                    .select-box {
                        width: 50%;
                        margin-right: 15px;
                    }
                }


            }


            .list-table {
                width: 100%;
                padding: 0;
                display: flex;
                flex-wrap: wrap;
                li {
                    border: solid 1px #686EFB;;
                    width: 48%;
                    margin-right: 4%;
                    color: #fff;
                    padding: 13px;
                    margin-bottom: 20px;
                    cursor: pointer;
                    font-size: 10pt;
                    &:nth-child(5n) {
                        margin-right: 4%;

                    }
                    &:nth-child(2n) {
                        margin-right: 0;

                    }
                    .img-box {
                        width: 100%;
                        text-align: center;
                        margin: auto;
                        height: 80px;
                        overflow: hidden;
                        img {
                            width: auto;
                            max-width:100%;
                            height: auto;
                        }

                    }
                    .subject {
                        margin-top: 20px;
                        font-weight: bold;
                    }
                    .desc {
                        font-size: 12px;
                        color: #999;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        display: -webkit-box;
                        -webkit-line-clamp: 2; /* 라인수 */
                        -webkit-box-orient: vertical;
                        word-wrap: break-word;
                        line-height:120%;
                        height:30px;

                    }
                    .price {
                        color: #686EFB;
                        font-weight: bold;
                        span {
                            color: #fff;
                            font-weight: normal;
                            width: 18px;
                            height: 18px;
                            background: #686EFB;
                            border-radius: 50%;
                            text-align: center;
                            line-height: 18px;
                            display: inline-block;
                            font-size: 8pt;
                        }
                    }
                }
            }
            .empty-data {
                height: 150px;
                text-align: center;
                line-height: 150px;
                font-size: 12px;
                background: #0F1421;
                color: #fff;
            }
        }

    }
</style>