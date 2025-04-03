<template>
    <div :class="'page-container '+mobileClass">
        <div class="mobile-header" v-if="mobileView">
            <div class="back-button" @click="$router.back()">
                <i class="fas fa-arrow-left"></i>
            </div>
            <div class="user-box">
                <input type="text" v-model="keywordString"/>
                <div class="search-box" @click="searchString()">
                    <i class="fas fa-search"></i>
                </div>
            </div>

        </div>
        <div class="main-container">
            <div class="search-result-box">
                <div v-if="searchResult">
                    <span class="bold">'{{keyword}}'</span> 검색결과 <span class="color">{{searchCount}}</span>건이 있습니다.
                </div>
                <div v-else-if="keyword">
                    <span class="bold">'{{keyword}}'</span> 검색결과가  존재하지 않습니다.
                </div>
                <div v-else>
                    검색어를 입력하세요
                </div>
            </div>
            <div class="videos-box" v-if="videos.length>0">

                <div class="video-title">영상보기</div>
                <ul class="listUl">
                    <li v-for="video in videos" :key="video.videoId" class="swiper-box" @click="goVideo(video)">
                        <div class="img-box"
                             :style="{'background-image':'url('+video.thumbnails.medium.url+')','background-size':'cover','background-position':'center center'}">
                        </div>
                        <div class="subject">{{video.title}}</div>
                        <div class="desc">{{video.description}}</div>
                    </li>
                </ul>
                <div v-if="moreShow">
                    <v-btn class="more-button" outlined @click="moreVideo()">더보기</v-btn>
                </div>
            </div>
            <div class="folling-box"  v-if="bjList.length>0">
                <div class="folling-title">인플루언서</div>

                <swiper :options="swiperOption">
                    <swiper-slide v-for="info in bjList" class="swiper-box">
                        <div class="padding-box">
                            <div class="top-box">
                                <div class="img-box" @click="goBj(info.uid)">
                                    <img v-if="info.photo" :src="host+info.photo">
                                    <i class="fas fa-user" v-else></i>
                                </div>
                                <div class="info-box" @click="goBj(info.uid)">
                                    <div class="subject">{{info.name}}</div>
                                    <div class="desc">구독자 {{info.mypen}}명</div>
                                </div>
                            </div>
                        </div>
                    </swiper-slide>
                </swiper>
                <div class="video-button-next" id="NextButton" slot="button-next"><i
                    class="fas fa-chevron-right"></i></div>
                <div class="video-button-prev" id="PrevButton" slot="button-prev"><i
                    class="fas fa-chevron-left"></i></div>

            </div>
        </div>
    </div>
</template>

<script>
	import {mapActions} from "vuex";
	import {
	    HOST,
		API_URL_YOUTUBE_GET_SEARCH
	} from '../../../api/urls';
	import apiService from '../../../api/apiService';

	export default {
		name:'searchPage',
		data() {
			return {
			    host:HOST,
                mobileView: false,
                mobileClass: '',
				allVideos:[],
				videos:[],
                keyword:'',
				bjList:[],
				searchResult:true,
				searchCount:0,
				swiperOption: {
					slidesPerView: 5,
					spaceBetween: 20,
					loop: false,
					navigation: {
						nextEl: '#NextButton',
						prevEl: '#PrevButton',
					},
				},
				moreShow:false,
                videoPage:0,
                keywordString:'',

			};
		},
		created() {
            if (this.$isMobile()) {
                this.setClass('none')
                this.setTitle('');
                this.setBackUrl('');
                this.mobileView = true;
                this.mobileClass = 'mobile'
                this.searchResult = false;
                this.swiperOption = {
                    slidesPerView: 1,
                        spaceBetween:0,
                        loop: false,
                        navigation: {
                        nextEl: '#NextButton',
                            prevEl: '#PrevButton',
                    }
                };

            } else {
                this.$eventBus.$on('searchKeyword', this.search);
                this.keyword = this.$route.params.keyword;
                this.setSearchKeyword(this.keyword);
                this.getData();
            }
		},
		methods: {
            ...mapActions('mobile', ["setClass", "setTitle", "setBackUrl"]),
			...mapActions('etc', ["setSearchKeyword"]),
			getData() {
				const frm = new FormData()
                frm.append('keyword',this.keyword)
				this.videos = [];
				apiService.post(API_URL_YOUTUBE_GET_SEARCH, frm, (res) => {
					this.allVideos = res.videos;
                    let videoStart = 0;
					let k;
					for (k=videoStart; k<(videoStart+10); k++) {
						if(this.allVideos[k]) {
							let item = this.allVideos[k];
							this.videos.push(item);
						}

					}
					this.videoPage = 1;
					this.moreShow = (this.allVideos.length>k)?true:false;


                    this.bjList = res.users;
					this.searchCount = this.allVideos.length + this.bjList.length
                  	if(this.searchCount>0) {
						this.searchResult = true;
                    } else this.searchResult = false;

				});
			},
            search(keyword) {
			    this.keyword = keyword;
			    this.getData();
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
			goBj(uid) {
				this.$router.push('/' + uid)
			},
			moreVideo() {
				let videoStart = this.videoPage * 10;
				let k;
				for (k=videoStart; k<(videoStart+10); k++) {
					if(this.allVideos[k]) {
						let item = this.allVideos[k];
						this.videos.push(item);
					}

				}
				this.videoPage = this.videoPage + 1;
				this.moreShow = (this.allVideos.length>k)?true:false;
			},
            searchString() {
                this.search(this.keywordString);
            }
		},
        beforeDestroy() {
            if (!this.$isMobile()) {
                this.$eventBus.$off('searchKeyword');
            } else {
                this.keyword = '';
            }
        }

	}
</script>
<style lang="scss" scoped="true">
.mobile-header {
    width: 100%;
    position: fixed;
    background: #141A2C;
    z-index: 90;
    top: 0;
    left: 0;
    height: 44px;
    display:flex;
    justify-content: space-between;
    box-shadow: 0px 0px 9px #0000007A;
    color:#fff;
    .back-button {
        width:40px;
        margin:10px 0 0 10px;
    }
    .user-box {
        width:80%;
        margin:10px 10px 0 10px;
        position:relative;
        input {
            width:100%;
            border:solid 1px #DCDCDC;
            height:28px;
            border-radius:15px;
            color:#000;
            padding:10px;
            font-size:10pt;
            margin-right:10px;
        }
        .search-box {
            position:absolute;
            top:3px;
            right:10px;
            i {
                font-size: 11pt;
            }
        }
    }
}
.page-container {
    .more-button {
        background: none;
        width: 100%;
        min-height: 50px;
        border-radius: 0;
        color: #000;
        border: solid 1px #DCDCDC;
    }

    .search-result-box {
        margin: 0 40px 50px 40px;
        color: #000;
        text-align: center;
        font-size: 19pt;
        height: 120px;
        line-height: 120px;
        border-bottom: solid 2px #DCDCDC;

        span.bold {
            font-weight: bold;
        }

        span.color {
            font-weight: bold;
            color: #686EFB;
            font-size: 21pt;
        }
    }

    .videos-box {
        height: auto;
        margin: 40px;
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
                color: #000;
                margin-bottom: 60px;
                cursor: pointer;
                width: 18.4%;
                margin-right: 2%;

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

    .folling-box {
        height: 230px;
        padding: 40px;
        margin-bottom: 30px;
        position: relative;

        .folling-title {
            color: #000;
            font-weight: bold;
            font-size: 13pt;
            margin-bottom: 15px;
        }

        .video-button-next {
            position: absolute;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: rgba(0, 0, 0, 0.5);
            color: #fff;
            top: 105px;
            right: 12px;
            z-index: 10;
            font-size: 15pt;
            text-align: center;
            line-height: 50px;
            cursor: pointer;

        }

        .video-button-prev {
            position: absolute;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: rgba(0, 0, 0, 0.5);
            color: #fff;
            top: 105px;
            left: 12px;
            z-index: 100;
            font-size: 15pt;
            text-align: center;
            line-height: 50px;
            cursor: pointer;

        }

        .swiper-button-disabled {
            display: none;
        }

        .swiper-button-hidden {
            display: none;
        }

        .swiper-box {
            color: #fff;
            margin-bottom: 60px;
            cursor: pointer;
            background: #0F1421;

            .padding-box {
                padding: 15px 15px;

                .top-box {
                    display: flex;

                    .img-box {
                        width: 70px;
                        min-width: 70px;
                        height: 70px;
                        min-height: 70px;
                        border-radius: 50%;
                        background: #686EFB;
                        overflow: hidden;
                        text-align: center;

                        img {
                            min-width: 100%;
                            min-height: 70px;
                        }

                        i {
                            color: #fff;
                            font-size: 28pt;
                            margin-top: 15px;
                        }

                    }

                    .info-box {
                        margin-left: 10px;

                        .subject {
                            margin-top: 10px;
                            font-weight: bold;
                            font-size: 13pt;
                            text-align: left;
                            color: #fff;
                            font-weight: bold;

                        }

                        .desc {
                            font-size: 10pt;
                            color: #999;
                            margin-top: 10px;
                        }
                    }
                }

                .folling-button-box {
                    overflow: hidden;
                    margin-top: 15px;

                    .folling-button {
                        width: 100%;
                        padding: 0;
                        height: 40px;
                        background: #1F2940;
                        color: #999999;
                        text-align: center;
                        border-radius: 3px;

                        i {
                            margin-right: 5px;
                        }

                        &.myBj {
                            background: #686EFB;
                            color: #fff;

                        }
                    }
                }
            }
        }
    }
    &.mobile {
        width:100%;
        background:#141A2C;
        min-height:calc(100vh);
        .more-button {
            background: none;
            width: 100%;
            min-height: 40px;
            border-radius: 0;
            color: #fff;
            border: solid 1px #fff;
        }

        .search-result-box {
            margin: 0 15px 20px 15px;
            color: #fff;
            text-align: center;
            font-size: 14px;
            height: 120px;
            line-height: 120px;
            border-bottom: solid 2px #fff;

            span.color {
                font-size: 16px;
            }
        }
        .user-box {
            input {
                color:#fff;
            }
        }
        .videos-box {
            height: auto;
            margin:15px;
            position: relative;

            .video-title {
                color: #fff;
                font-weight: bold;
                font-size: 12pt;
                margin-bottom: 15px;
            }
            .listUl {
                padding: 0;
                display: flex;
                flex-wrap: wrap;
                .swiper-box {
                    color: #fff;
                    margin-bottom: 60px;
                    cursor: pointer;
                    width: 49%;
                    margin-right: 2%;
                    &:nth-child(5n) {
                        margin-right: 2%;
                    }
                    &:nth-child(2n) {
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
                        font-size: 12pt;
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

        .folling-box {
            height: 230px;
            padding:15px;
            margin-bottom:30px;
            position: relative;

            .folling-title {
                color: #fff;
                font-weight: bold;
                font-size: 12pt;
                margin-bottom: 15px;
            }

            .video-button-next {
                position: absolute;
                width: 50px;
                height: 50px;
                border-radius: 50%;
                background: rgba(0, 0, 0, 0.5);
                color: #fff;
                top: 80px;
                right: 2px;
                z-index: 10;
                font-size: 15pt;
                text-align: center;
                line-height: 50px;
                cursor: pointer;

            }

            .video-button-prev {
                position: absolute;
                width: 50px;
                height: 50px;
                border-radius: 50%;
                background: rgba(0, 0, 0, 0.5);
                color: #fff;
                top: 80px;
                left:2px;
                z-index: 100;
                font-size: 15pt;
                text-align: center;
                line-height: 50px;
                cursor: pointer;

            }

            .swiper-button-disabled {
                display: none;
            }

            .swiper-button-hidden {
                display: none;
            }

            .swiper-box {
                color: #fff;
                margin-bottom:60px;
                cursor: pointer;
                background: #0F1421;
                .padding-box {
                    padding: 15px 15px;

                    .top-box {
                        display: flex;

                        .img-box {
                            width: 70px;
                            min-width: 70px;
                            height: 70px;
                            min-height: 70px;
                            border-radius: 50%;
                            background: #686EFB;
                            overflow: hidden;
                            text-align: center;

                            img {
                                min-width: 100%;
                                min-height: 70px;
                            }

                            i {
                                color: #fff;
                                font-size: 28pt;
                                margin-top: 15px;
                            }

                        }

                        .info-box {
                            margin-left: 10px;

                            .subject {
                                margin-top: 10px;
                                font-weight: bold;
                                font-size: 13pt;
                                text-align: left;
                                color: #fff;
                                font-weight: bold;

                            }

                            .desc {
                                font-size: 10pt;
                                color: #999;
                                margin-top: 10px;
                            }
                        }
                    }

                    .folling-button-box {
                        overflow: hidden;
                        margin-top: 15px;

                        .folling-button {
                            width: 100%;
                            padding: 0;
                            height: 40px;
                            background: #1F2940;
                            color: #999999;
                            text-align: center;
                            border-radius: 3px;

                            i {
                                margin-right: 5px;
                            }

                            &.myBj {
                                background: #686EFB;
                                color: #fff;

                            }
                        }
                    }
                }
            }
        }
    }
}
</style>
