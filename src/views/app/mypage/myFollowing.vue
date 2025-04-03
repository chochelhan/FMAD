<template>
    <div class="mypage-container">

        <div :class="'contents '+mobileClass">

            <div v-if="!mobileView" class="stitle">
                <span>구독 관리</span>
            </div>
            <div v-if="!mobileView"  class="title-desc">현재 구독중인 유튜버(BJ)들 내역입니다</div>


            <ul class="item-list">
                <li v-for="item in dataList"
                    :key="item.no"
                >
                   <div class="img-box">
                       <img v-if="item.photo" :src="host+item.photo">
                       <i  v-if="!item.photo" class="fas fa-user"></i>
                   </div>
                    <div class="info-box">
                        <div class="live-box"></div>
                        <div class="subject">{{item.name}}</div>
                        <div class="read-count">구독자 {{item.mypen}}</div>
                        <div class="desc">{{item.msg}}</div>

                    </div>
                    <div class="button-box" v-if="!mobileView">
                        <v-btn

                            depressed
                            class="del-btn"
                            @click="deleteItem(item.no)"
                        >
                            <i class="fas fa-heart"></i>
                            구독
                        </v-btn>
                    </div>
                    <div class="button-box" v-else>
                         <i class="fas fa-heart"></i>

                    </div>
                </li>

            </ul>
            <div v-if="dataList.length<1" class="empty-data">
                데이타가 존재하지 않습니다
            </div>
        </div>
    </div>
</template>


<script>
	import {
		HOST,
		API_URL_READ_MYUSER_LIST,
		API_URL_READ_USER_MYDELETE
	} from '../../../api/urls';
	import apiService from '../../../api/apiService';
    import {mapActions} from "vuex";
	export default {
		name: 'myFollowing',
		data() {
			return {
				host:HOST,
				mobileView: false,
				mobileClass: '',
				dataList: [],
			}
		},
		created() {
			if (this.$isMobile()) {
				this.mobileView = true;
				this.mobileClass = 'mobile'
                this.setClass('sub')
                this.setTitle('구독 관리');
                this.setBackUrl('');
			}
			this.getData();

		},
		methods: {
            ...mapActions('mobile', ["setClass", "setTitle", "setBackUrl"]),
			getData() {
				this.orgDataList = [];
				const frm = new FormData()
				apiService.post(API_URL_READ_MYUSER_LIST, frm, (res) => {
					//	console.log(res)
					this.dataList = [];
					if (res.list.length > 0) {
						this.dataList = res.list;

					}
				});

			},
			deleteItem(no) {
				let params = {
					type: 'confirm',
					message: '구독해제 하시겠습니까?',
					doAction: () => {

						this.$eventBus.$emit('overlay', 'show');
						const frm = new FormData()
						frm.append('no',no)
						apiService.post(API_URL_READ_USER_MYDELETE, frm, (res) => {
							//	console.log(res)
							this.$eventBus.$emit('overlay', 'hide');
							this.getData();
						});
					}
				};
				this.$eventBus.$emit('modalOpen', params);


			}
		}

	}
</script>
<style lang="scss" scoped>
.contents {
    .item-list {
        padding: 0;

        li {
            padding: 20px 0 20px 25px;
            display: flex;
            border-bottom: solid 1px #dcdcdc;

            &:first-child {
                border-top: solid 1px #dcdcdc;
            }

            .img-box {
                min-width: 100px;
                width: 100px;
                height: 100px;
                min-height: 100px;
                overflow: hidden;
                text-align: center;
                border-radius: 50%;
                border: solid 1px #dcdcdc;
                background: #686EFB;

                img {
                    width: 100%;
                    min-height: 100px;

                }

                i {
                    color: #fff;
                    margin-top: 20px;
                    font-size: 38pt;
                }
            }

            .info-box {
                width: 90%;
                padding-left: 20px;

                .live-box {

                }

                .subject {
                    font-size: 14pt;
                    color: #000;
                    font-weight: bold;
                }

                .read-count {
                    font-size: 10pt;
                    color: #999;
                    margin: 3px 0 7px 0;
                }

                .desc {
                    font-size: 12pt;
                    color: #333;
                }
            }

            .button-box {
                width: 100px;

                .del-btn {
                    margin-top: 10px;
                    background: #686EFB;
                    color: #fff;
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
    &.mobile {
        padding:20px 15px;
        .item-list {
            padding: 0;
            li {
                padding:10px 0;
                display: flex;
                border-bottom: solid 1px #dcdcdc;

                &:first-child {
                    border-top:none;
                }

                .img-box {
                    min-width: 45px;
                    width: 45px;
                    height: 45px;
                    min-height: 45px;
                    overflow: hidden;
                    text-align: center;
                    border-radius: 50%;
                    border: solid 1px #dcdcdc;
                    background: #686EFB;
                    img {
                        width: 100%;
                        min-height: 45px;

                    }

                    i {
                        color: #fff;
                        margin-top: 10px;
                        font-size:18pt;
                    }
                }

                .info-box {
                    width: 90%;
                    padding-left: 20px;

                    .live-box {

                    }

                    .subject {
                        font-size: 11pt;
                        color: #000;
                        font-weight: 600;
                    }

                    .read-count {
                        font-size: 8pt;
                        color: #999;
                        margin: 3px 0 7px 0;
                    }

                    .desc {
                        font-size: 12pt;
                        color: #333;
                    }
                }

                .button-box {
                    padding-top:10px;
                    width: 40px;
                    color: #686EFB;
                    font-size:16pt;
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
}
</style>