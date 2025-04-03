<template>
    <div class="article-contents">



        <div>
            <table class="list-table">
                <tbody>
                <tr @click="articleView(item.no)"
                    v-for="item in dataList"
                    :key="item.no"
                >
                    <td>{{ item.num }}</td>
                    <td style="text-align:left;padding-left:10px;">{{ item.subject }}</td>
                    <td>{{ item.name }}</td>
                    <td>{{ item.hitView }}</td>
                    <td>{{ item.rdate }}</td>
                    <td>

                    </td>
                </tr>
                </tbody>
            </table>
            <div v-if="!progress && dataList.length<1" class="empty-data">
                데이타가 존재하지 않습니다
            </div>
            <div v-if="progress" class="empty-data">
                <v-progress-circular
                    :size="50"
                    color="purple"
                    indeterminate
                ></v-progress-circular>
            </div>



        </div>
        <div style="height:40px"></div>
    </div>
</template>


<script>
	import AUTH from '../../../api/auth'

	export default {
		name: 'dcSkinArticleList',
        props:["boardInfo","articleList"],

        watch:{
	        articleList() {
		        this.bid = this.boardInfo.bid;
		        this.getServerData();
            },
	        boardInfo() {
	        	console.log('boardInfo')
		        this.bid = this.boardInfo.bid;
		        this.getServerData();
            }
        },
		data() {
			return {
				bid: '',
				cmd: 'subject',
				progress: true,
				dataList: [],

			}
		},
		created() {
			this.bid = this.boardInfo.bid;
			this.getServerData();
		},
		methods: {
			goPage(url) {
				this.$router.push(url);
			},
			articleView(no) {
				this.$router.push('/board/view/' + no);
			},
			getServerData() {
                    this.dataList = [];
					if (this.articleList.length > 0) {
						this.dataList = this.articleList;
					}
					this.progress = false;
			},

		},

	}
</script>

<style lang="scss" scoped="true">
    .subject {
        text-decoration: underline;
        cursor: pointer;
    }

    .article-contents {
        background: #ffff;
        padding:0;
        width: 100%;
        .form-item {
            width: 100%;
            padding: 30px 30px 0 30px;
            -webkit-box-shadow: 1px 1px 5px 1px rgba(0, 0, 0, 0.3);
            -moz-box-shadow: 1px 1px 5px 1px rgba(0, 0, 0, 0.3);
            box-shadow: 1px 1px 5px 1px rgba(0, 0, 0, 0.3);
            background: #fff;
            margin-bottom: 30px;
            border-radius: 10px;
            .form-sub-box {
                border-top: solid 1px #777;
            }
        }
        .search-box {
            margin: 20px 0 10px 0;
            display: flex;
            position: relative;
            .date-box {
                width: 160px;
                margin: 0 5px 0 0;
                display: flex;
                i {
                    position: relative;
                    z-index: 10;
                    margin: 13px 0 0 -25px;
                }
            }
            .select-box {
                margin: 0 5px 0 30px;
                width: 150px;
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
            .regist-button-box {
                margin:0;
                text-align:right;
                min-width:250px;
                .reg-button {
                    width:100px;
                    height:40px;
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
            border-spacing: 0;
            border-collapse: collapse;
            width: 100%;
            thead {
                th {
                    text-align: center;
                    background: #333;
                    padding: 10px 0;
                    color: #ffff;
                    font-size: 12pt;
                    &.sortBy {
                        cursor: pointer;
                        i {
                            font-size: 10pt;
                            color: #999;

                        }
                        .active {
                            i {
                                color: #fff;
                            }

                        }

                    }
                }

            }
            tbody {
                td {
                    cursor:pointer;
                    border-bottom: solid 1px #dcdcdc;
                    text-align: center;
                    padding: 10px 0;
                    font-size: 11pt;
                    .modify-button {
                        border-radius: 20px;
                        min-width: 60px;
                    }
                }
            }
        }
        .empty-data {
            height: 150px;
            text-align: center;
            line-height: 150px;
            font-size: 10pt;
            color: #000;
            border-bottom: solid 1px #dcdcdc;
        }
    }

</style>