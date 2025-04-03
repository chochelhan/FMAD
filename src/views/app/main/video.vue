<template>
    <div :class="'page-container '+mobileClass">

        <div class="main-container">
            <div class="videos-box">

                <div class="video-title">영상보기</div>
                <ul class="listUl">
                    <li v-for="(video,index) in videos" class="swiper-box" @click="goVideo(video)">
                        <div class="img-box" v-if="!video.play"
                             :style="{'background-image':'url('+video.thumbnails.medium.url+')','background-size':'cover','background-position':'center center'}">
                        </div>
                        <div class="info-box">
                            <div class="subject">{{ video.title }}</div>
                            <div class="desc">{{ video.description }}</div>
                        </div>
                    </li>
                </ul>
            </div>

        </div>
    </div>
</template>

<script>
import {
    API_URL_YOUTUBE_GET_VIDEO_LIST
} from '../../../api/urls';
import apiService from '../../../api/apiService';
import {mapActions} from "vuex";

export default {
    name: 'videoPage',
    data() {
        return {
            mobileView: false,
            mobileClass: '',
            videos: [],

        };
    },
    created() {
        if (this.$isMobile()) {
            this.setClass('main')
            this.setTitle('');
            this.setBackUrl('');
            this.mobileView = true;
            this.mobileClass = 'mobile'
        }
        this.getData();
    },
    methods: {
        ...mapActions('mobile', ["setClass", "setTitle", "setBackUrl"]),
        getData() {
            const frm = new FormData()

            apiService.post(API_URL_YOUTUBE_GET_VIDEO_LIST, frm, (res) => {
                this.videos = res.videos;

            });
        },
        goVideo(item) {
            if (item.liveNo) {
                if (this.myUid == item.uid) {
                    this.$router.push('/hostLive/' + item.liveNo);
                } else {
                    this.$router.push('/userLiveIntro/' + item.liveNo);
                }
            } else {
                this.$router.push('/videoView/' + item.no);
            }
        },
    },

}
</script>
<style lang="scss" scoped="true">
.page-container {
    .videos-box {
        height: auto;
        margin: 40px;
        position: relative;

        .video-title {
            color: #000;
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
        width:100%;
        padding:0 0 48px 0;
        margin:0;
        .videos-box {
            height: auto;
            padding: 10px;
            margin:0;
            position: relative;

            .video-title {
                color: #000;
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
                width:100%;
                margin-bottom: 10px;
                cursor: pointer;
                padding: 0;
                display: block;
                li.swiper-box {
                    display: flex;
                    justify-content: space-between;
                    width: 100%;
                    height: 67px;
                    overflow: hidden;
                    margin-bottom: 10px;
                    .img-box {
                        width: 120px;
                        min-width: 120px;
                        height: 67px;
                        overflow: hidden;
                        margin-right: 10px;

                    }

                    .info-box {
                        .subject {
                            margin-top:0;
                            color: #000;
                            font-size: 10pt;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: normal;
                            line-height: 1.4;
                            height: 37px;
                            overflow: hidden;
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

        .empty-div {
            color: #000;
            line-height: 50px;
            text-align: center;
            font-size: 10pt;
        }


    }
}
</style>
