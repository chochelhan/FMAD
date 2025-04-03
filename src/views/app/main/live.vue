<template>
    <div :class="'live-page-container '+mobileClass">
        <div class="main-container">
            <div class="videos-box">
                <div class="video-title">생방송 중</div>
                <ul class="listUl">
                    <li v-for="(video,index) in liveVideos" class="swiper-box" @click="goVideo(video)">
                        <div class="img-box"
                             :style="{'background-image':'url('+video.thumbnails.medium.url+')','background-size':'cover','background-position':'center center'}">
                        </div>
                        <div class="subject">{{video.title}}</div>
                        <div class="desc">{{video.description}}</div>
                    </li>
                </ul>
                <div v-if="liveMoreShow">
                    <v-btn class="more-button" outlined @click="moreLiveVideo()">더보기</v-btn>
                </div>
                <div class="empty-div" v-if="liveVideos.length<1">생방송 중인 영상이 없습니다</div>
            </div>
            <div class="videos-box">

                <div class="video-title">최근 실시간 스트리밍</div>
                <ul class="listUl">
                    <li v-for="(video,index) in lasetestLiveVideos" class="swiper-box" @click="goVideo(video)">
                        <div class="img-box"
                             :style="{'background-image':'url('+video.thumbnails.medium.url+')','background-size':'cover','background-position':'center center'}">
                        </div>
                        <div class="subject">{{video.title}}</div>
                        <div class="desc">{{video.description}}</div>
                    </li>
                </ul>
                <div v-if="lastestMoreShow">
                    <v-btn class="more-button" outlined @click="moreLastestVideo()">더보기</v-btn>
                </div>
                <div class="empty-div" v-if="lasetestLiveVideos.length<1">최근 실시간 스트리밍 영상이 없습니다</div>

            </div>
        </div>
    </div>
</template>

<script>

	import {mapActions, mapGetters} from "vuex";
	import AUTH from '../../../api/auth';
	import {
		API_URL_YOUTUBE_GET_LIVE_VIDEO_LIST
	} from '../../../api/urls';
	import apiService from '../../../api/apiService';

	export default {
		name: 'LivePage',
		computed: {
			...mapGetters('member', ["getUid", "getMtype"])
		},
		watch: {
			getUid(val) {
				this.setMemberInfo();

			},

		},
		data() {
			return {
                mobileView:false,
                mobileClass:'',
				allLasetestLiveVideos: [],
				lasetestLiveVideos: [],
				allLiveVideos: [],
				liveVideos: [],
				lastestMoreShow: false,
				liveMoreShow: false,
				lastestPage:0,
				livePage:0,
				myUid:'',

			};
		},
		created() {
		    if(this.$isMobile()) {
                this.setClass('main')
                this.setTitle('');
                this.setBackUrl('');
                this.mobileView = true;
                this.mobileClass = 'mobile'
            }
			this.setMemberInfo()
		},
		methods: {
            ...mapActions('mobile', ["setClass", "setTitle", "setBackUrl"]),
			setMemberInfo() {
				let memberInfo = AUTH.getSession(this.$isMobile());
				if (memberInfo.AUTHTOKEN) {
					this.myUid = memberInfo.uid;
				} else {
					this.myUid = '';
				}
				this.getData();
			},
			getData() {
				const frm = new FormData()

				apiService.post(API_URL_YOUTUBE_GET_LIVE_VIDEO_LIST, frm, (res) => {

					this.allLasetestLiveVideos = res.lastestVideos;
					this.allLiveVideos = res.liveVideos;

					let start = this.lastestPage * 5;
					let k;
					for (k=start; k<(start+5); k++) {
						if(this.allLasetestLiveVideos[k]) {
							let item = this.allLasetestLiveVideos[k];
							this.lasetestLiveVideos.push(item);
						}

					}
					this.lastestPage = this.lastestPage + 1;
					this.lastestMoreShow = (this.allLasetestLiveVideos.length>k)?true:false;

					let liveStart = this.livePage * 5;
					for (k=liveStart; k<(liveStart+5); k++) {
						if(this.allLiveVideos[k]) {
							let item = this.allLiveVideos[k];
							this.liveVideos.push(item);
						}

					}
					this.livePage = this.livePage + 1;
					this.liveMoreShow = (this.allLiveVideos.length>k)?true:false;
				});
			},
			goVideo(item) {
				if(item.liveNo) {
					if(this.myUid==item.uid) {
						this.$router.push('/hostLive/' + item.liveNo);
					} else {
						this.$router.push('/userLiveIntro/' + item.liveNo);
					}
				} else {
					this.$router.push('/videoView/' + item.no);
				}
			},
			moreLastestVideo() {
				let start = this.lastestPage * 5;
				let k= 0;
				for (k=start; k<(start+5); k++) {
					if(this.allLasetestLiveVideos[k]) {
	                    let item = this.allLasetestLiveVideos[k];
	                    this.lasetestLiveVideos.push(item);
                    }
				}
				this.lastestPage = this.lastestPage + 1;
				this.lastestMoreShow = (this.allLasetestLiveVideos.length>k)?true:false;

			},
			moreLiveVideo() {
				let liveStart = this.livePage * 5;
				for (k=liveStart; k<(liveStart+5); k++) {
					if(this.allLiveVideos[k]) {
						let item = this.allLiveVideos[k];
						this.liveVideos.push(item);
					}

				}
				this.livePage = this.livePage + 1;
				this.liveMoreShow = (this.allLiveVideos.length>k)?true:false;
			}
		},

	}
</script>
<style lang="scss" scoped="true">
.live-page-container {
    .empty-div {
        text-align: left;
        color: #fff;
        line-height: 200px;
        font-size: 15pt;
    }

    .more-button {
        background: none;
        width: 100%;
        min-height: 50px;
        border-radius: 0;
        color: #fff;
        border: solid 1px #fff;
    }

    .videos-box {
        min-height: 350px;
        padding: 40px;
        position: relative;

        .video-title {
            color: #fff;
            font-weight: bold;
            font-size: 13pt;
            margin-bottom: 15px;
        }

        .listUl {
            padding: 0;
            display: flex;
            flex-wrap: wrap;

            .swiper-box {
                color: #fff;
                width: 18.4%;
                margin-right: 2%;
                margin-bottom: 60px;
                cursor: pointer;

                &:nth-child(5n) {
                    margin-right: 0;
                }

                .img-box {
                    width: 100%;
                    height: 130px;
                    overflow: hidden;

                }

                .subject {
                    margin-top: 10px;
                    font-weight: bold;
                    font-size: 13pt;
                    width: 100%;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: normal;
                    line-height: 1.4;
                    height: 46px;
                    text-align: left;
                    word-wrap: break-word;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;

                }

                .desc {
                    font-size: 10pt;
                    color: #999;
                    margin-top: 5px;
                    width: 100%;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: normal;
                    line-height: 1.4;
                    height: 34px;
                    text-align: left;
                    word-wrap: break-word;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;

                }

            }
        }
    }
    &.mobile {
        padding-bottom: 48px;
        background: #13192C;
        min-height:calc(100vh);
        .empty-div {
            color: #fff;
            line-height:100px;
            text-align: center;
            font-size: 10pt;
        }

        .more-button {;
            margin-top:10px;
        }

        .videos-box {
            min-height:100px;
            padding:10px;
            position: relative;

            .video-title {
                color: #fff;
                font-weight: 600;
                font-size: 12pt;
                margin-bottom: 10px;
            }

            .video-button-box {
                padding-top: 10px;
                .button {
                    width: 100%;
                }
            }

            .listUl {
                padding: 0;
                display: flex;
                flex-wrap: wrap;

                .swiper-box {
                    color: #fff;
                    width:100%;
                    margin-right:0;
                    margin-bottom:10px;

                    .img-box {
                        width: 100%;
                        height: 186px;
                        overflow: hidden;
                    }

                    .subject {
                        margin-top: 10px;
                        font-weight: normal;
                        font-size: 10pt;
                        width: 100%;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: normal;
                        line-height: 1.4;
                        height: 37px;
                        text-align: left;
                        word-wrap: break-word;
                        display: -webkit-box;
                        -webkit-line-clamp: 2;
                        -webkit-box-orient: vertical;

                    }

                    .desc {
                        margin-top: 3px;
                        font-size: 8pt;
                        color: #999;
                        width: 100%;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: normal;
                        line-height: 1.4;
                        height: 34px;
                        text-align: left;
                        word-wrap: break-word;
                        display: -webkit-box;
                        -webkit-line-clamp: 2;
                        -webkit-box-orient: vertical;

                    }

                }
            }
        }
    }
}
</style>
