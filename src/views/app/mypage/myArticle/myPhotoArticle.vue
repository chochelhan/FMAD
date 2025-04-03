<template>
    <div :class="'data-contents '+mobileClass">

        <div>
            <ul class="list-table">

                <li
                    v-for="item in dataList"
                    :key="item.no"  @click="showView(item)">
                    <div class="dark-screen"></div>
                    <div class="img-box">
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
		name: 'myPhotoArticle',
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
				this.$router.push('/' + item.ownerUid + '/main/userPhoto/view/' + item.no);

			},
			getServerData() {

				const frm = new FormData()
				frm.append('cmd', 'photo')
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
        &.mobile {
            padding:0 15px;
            .list-table {
                li {
                    width: 49%;
                    margin-right:2%;
                    &:nth-child(2n) {
                        margin-right:0;
                    }
                    color: #fff;
                    padding:0;
                    margin-bottom: 12px;
                    cursor: pointer;
                    position:relative;
                    .dark-screen {
                        height:150px;


                    }
                    .img-box {
                        height: 150px;
                        img {
                            width: 100%;
                            min-height:150px;
                        }

                    }
                }
            }
        }

    }
</style>