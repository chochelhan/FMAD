<template>
    <div :class="'mypage-container '+mobileClass">

        <div class="contents">
            <div class="from-box">

                <div v-if="!mobileView" class="stitle">
                    <span>방송 내역</span>
                </div>
                <div v-if="!mobileView" class="title-desc">DUCKKU BJ 에서 진행했던 방송 내역 입니다.</div>
                <ul class="live-list" v-if="videoList.length >0">
                    <li v-for="video in videoList" :key="video.no">
                        <div class="del-box"  @click="deleteLive(video.no)">
                            <i class="fas fa-times"></i>
                        </div>
                        <div class="info-box" @click="goLive(video.no)">
                            <div :class="'status '+video.status">
                                {{video.statusText}}
                            </div>
                            <div class="g-title">{{video.title}}</div>
                            <div class="rdate">{{video.rdate}}</div>
                        </div>
                    </li>

                </ul>

                <div v-else class="empty-data">
                    데이타가 존재하지 않습니다
                </div>

            </div>

        </div>

    </div>
</template>


<script>
	import {
		API_URL_BROADCAST_LIVE_MYLIST,
		API_URL_BROADCAST_LIVE_DELETE
	} from '../../../api/urls';
	import apiService from '../../../api/apiService';
    import {mapActions} from "vuex";

	export default {
		name: 'broadcastList',
		data() {
			return {
				mobileView: false,
				mobileClass: '',
				videoList: [],

			}
		},
		created() {
			if (this.$isMobile()) {
				this.mobileView = true;
				this.mobileClass = 'mobile'
                this.setClass('sub')
                this.setTitle('방송 내역');
                this.setBackUrl('');
			}
			this.getData();
		},

		methods: {
            ...mapActions('mobile', ["setClass", "setTitle", "setBackUrl"]),
			getData() {

				const frm = new FormData()

                apiService.post(API_URL_BROADCAST_LIVE_MYLIST, frm, (res) => {
					for (let video of res.info) {
						video.statusText = (video.status == 'ready') ? '방송가능' : '방송종료';
						video.rdate = video.rdate.substring(0, 10);
						this.videoList.push(video);
                	}
				});
			},
			goLive(no) {
				this.$router.push('/live/' + no)
			},
			deleteLive(no) {
				let params = {
					type: 'confirm',
					message: '방송을 삭제하시겠습니까?',
					doAction: () => {
						const frm = new FormData()
                        frm.append('no',no)
						apiService.post(API_URL_BROADCAST_LIVE_DELETE, frm, (res) => {
							this.deleteResult()
						});
					}
				}
				this.$eventBus.$emit('modalOpen', params);
            },
			deleteResult() {
				this.videoList = [];
				this.getData();
				let params = {
					message: '방송이 삭제되었습니다',

				}
				this.$eventBus.$emit('modalOpen', params);
            }
		}

	}
</script>
<style lang="scss" scoped>
.mypage-container {
    .contents {
        .live-list {
            display: flex;
            flex-wrap: wrap;
            padding: 0;

            li {
                width: 31%;
                height: 150px;
                border: solid 1px #dcdcdc;
                border-radius: 10px;
                margin-right: 2.5%;
                margin-top: 33px;
                padding-left: 20px;

                &:nth-child(3n) {
                    margin-right: 0;
                }

                .del-box {
                    float: right;
                    width: 18px;
                    height: 18px;
                    border-radius: 50%;
                    background: #999;
                    color: #fff;
                    text-align: center;
                    font-size: 10pt;
                    margin: 10px 10px 0 0;
                    cursor: pointer;

                }

                .info-box {
                    cursor: pointer;

                    .status {
                        margin-top: 33px;
                        width: 60px;
                        height: 20px;
                        background: #999;
                        color: #fff;
                        border-radius: 10px;
                        text-align: center;
                        font-size: 9pt;

                        &.ready {
                            background: #686EFB;
                        }
                    }

                    .g-title {
                        font-weight: bold;
                        color: #000;
                        font-size: 12pt;
                    }

                    .rdate {
                        color: #999;
                        font-size: 10pt;
                    }
                }
            }
        }


    }

    &.mobile {
        .contents {
            .live-list {
                display: flex;
                flex-wrap: wrap;
                padding: 0;

                li {
                    width: 48%;
                    height: 135px;
                    border: solid 1px #dcdcdc;
                    border-radius: 10px;
                    margin-right:4%;
                    margin-top: 15px;
                    padding-left:20px;
                    &:nth-child(3n) {
                        margin-right: 4%;
                    }
                    &:nth-child(2n) {
                        margin-right:0;
                    }

                    .del-box {
                        float: right;
                        width: 18px;
                        height: 18px;
                        border-radius: 50%;
                        background: #999;
                        color: #fff;
                        text-align: center;
                        font-size: 10pt;
                        margin: 10px 10px 0 0;
                        cursor: pointer;

                    }

                    .info-box {
                        cursor: pointer;

                        .status {
                            margin-top: 33px;
                            width: 60px;
                            height: 20px;
                            background: #999;
                            color: #fff;
                            border-radius: 10px;
                            text-align: center;
                            font-size: 9pt;

                            &.ready {
                                background: #686EFB;
                            }
                        }

                        .g-title {
                            margin-top:10px;
                            font-weight: bold;
                            color: #000;
                            font-size: 16px;
                            height:40px;
                        }

                        .rdate {
                            color: #999;
                            font-size: 12px;
                        }
                    }
                }
            }


        }
    }
}

</style>