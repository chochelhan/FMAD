<template>
    <div class="video-page-container">
        <div class="main-container">
            <div class="banner-box">
                <img src="../../../../assets/images/main_banner.png"/>
            </div>
            <div class="videos-box">
                <div class="video-title">최신 영상</div>
                <ul class="list">
                    <li v-for="video in lasetestVideos" class="swiper-box"
                        @click="goVideo(video.liveNo,video.no,video.uid)">
                        <div class="img-box"
                             :style="{'background-image':'url('+video.thumbnails.medium.url+')','background-size':'cover','background-position':'center center'}">

                        </div>
                        <div class="info-box">
                            <div class="subject">
                                {{ video.title }}
                            </div>
                            <div class="desc">
                                {{ video.description }}
                            </div>
                        </div>
                    </li>

                </ul>
                <div class="video-button-box" v-if="moreLastestShow">
                    <v-btn class="button" outlined color="#999" @click="moreLastestVideo()"
                           style="border-radius:0;background:#fafafa;">
                        <span style="color:#000;">더보기</span>
                    </v-btn>
                </div>
            </div>

            <div v-if="isLogin">
                <div class="videos-box">
                    <div class="video-title">구독 영상</div>
                    <div class="empty-div" v-if="myReadVideos.length<1">구독 영상이 없습니다</div>
                    <div v-else>
                        <ul class="list">
                            <li v-for="video in myReadVideos" @click="goVideo(video.liveNo,video.no,video.uid)">
                                <div class="img-box"
                                     :style="{'background-image':'url('+video.thumbnails.medium.url+')','background-size':'cover','background-position':'center center'}"></div>
                                <div class="info-box">
                                    <div class="subject">{{ video.title }}</div>
                                    <div class="desc">{{ video.description }}
                                    </div>
                                </div>
                            </li>
                        </ul>
                        <div class="video-button-box" v-if="moreMyReadShow">
                            <v-btn class="button" outlined color="#999"  @click="moreMyReadVideo()"
                                   style="border-radius:0;background:#fafafa;">
                                <span style="color:#000;">더보기</span>
                            </v-btn>
                        </div>
                    </div>
                </div>

            </div>
            <div class="videos-box">

                <div class="video-title">인기 영상</div>

                <ul class="list">
                    <li v-for="video in hitVideos" @click="goVideo(video.liveNo,video.no,video.uid)">
                        <div class="img-box"
                             :style="{'background-image':'url('+video.thumbnails.medium.url+')','background-size':'cover','background-position':'center center'}"></div>
                        <div class="info-box">
                            <div class="subject">{{ video.title }}</div>
                            <div class="desc">{{ video.description }}
                            </div>
                        </div>
                    </li>
                </ul>
                <div class="video-button-box" v-if="moreHitShow">
                    <v-btn class="button" outlined color="#999" @click="moreHitVideo()"
                           style="border-radius:0;background:#fafafa;">
                        <span style="color:#000;">더보기</span>
                    </v-btn>
                </div>
            </div>

        </div>
    </div>
</template>

<script>
import {mapActions, mapGetters} from "vuex";
import AUTH from '../../../../api/auth';
import JQ from 'jquery';
import {
    HOST,
    API_URL_YOUTUBE_GET_MAIN_VIDEO_LIST
} from '../../../../api/urls';
import apiService from '../../../../api/apiService';

export default {
    name: 'mobileMainPage',
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
            host: HOST,
            lasetestPage: 1,
            livePage: 1,
            myReadPage: 1,
            hitPage: 1,
            myPage: 1,
            moreLastestShow:false,
            moreLiveShow:false,
            moreMyReadShow:false,
            moreHitShow:false,
            moreMyShow:false,

            orglasetestVideos: [],
            orgliveVideos: [],
            orgmyReadVideos: [],
            orghitVideos: [],
            orgmyVideos: [],
            lasetestVideos: [],
            liveVideos: [],
            myReadVideos: [],
            myFollingList: [],
            hitFollingList: [],
            hitVideos: [],
            isLogin: false,
            myUid: '',
            mtype: '',
            myVideos: [],
            myFollingSwiperOption: {
                slidesPerView: 1,
                loop: false,
                navigation: {
                    nextEl: '#myFollingNextButton',
                    prevEl: '#myFollingPrevButton',
                },
            },
            hitFollingSwiperOption: {
                slidesPerView: 1,
                loop: false,
                navigation: {
                    nextEl: '#hitFollingNextButton',
                    prevEl: '#hitFollingPrevButton',
                },
            },


        };
    },
    created() {
        this.setClass('main')
        this.setTitle('');
        this.setBackUrl('');
        this.setMemberInfo();
    },
    methods: {
        ...mapActions('mobile', ["setClass", "setTitle", "setBackUrl"]),
        getData() {
            const frm = new FormData()
            apiService.post(API_URL_YOUTUBE_GET_MAIN_VIDEO_LIST, frm, (res) => {
                this.orglasetestVideos = res.lastestVideos;
                this.orgliveVideos = res.liveVideos;
                this.orgmyReadVideos = res.myReadVideos;
                this.orgmyVideos = res.myVideos;
                this.orghitVideos = res.hitVideoList;

                this.setLasetestVideos()
                this.setLiveVideos()
                this.setMyReadVideos()
                this.setMyVideos()
                this.setHitVideos()
                this.hitFollingList = res.hitFollingList;
                this.myFollingList = res.myFollingList;


            });
        },
        setLasetestVideos() {
            let k=0;
            this.lasetestVideos = [];
            for (let item of this.orglasetestVideos) {
                if(k < (this.lasetestPage*4)) {
                    this.lasetestVideos.push(item)
                }
                k++;
            }
            if(this.lasetestVideos.length >= this.orglasetestVideos.length) {
                this.moreLastestShow = false;
            } else {
                this.moreLastestShow = true;
            }
        },
        moreLastestVideo() {
            this.lasetestPage++;
            this.setLasetestVideos()
        },
        setLiveVideos() {
            let k=0;
            this.liveVideos = [];
            for (let item of this.orgliveVideos) {
                if(k < (this.livePage*4)) {
                    this.liveVideos.push(item)
                }
                k++;
            }
            if(this.liveVideos.length >= this.orgliveVideos.length) {
                this.moreLiveShow = false;
            } else {
                this.moreLiveShow = true;
            }
        },
        moreLiveVideo() {
            this.livePage++;
            this.setLiveVideos()
        },
        setMyReadVideos() {
            let k=0;
            this.myReadVideos = [];
            for (let item of this.orgmyReadVideos) {
                if(k < (this.myReadPage*4)) {
                    this.myReadVideos.push(item)
                }
                k++;
            }
            if(this.myReadVideos.length >= this.orgmyReadVideos.length) {
                this.moreMyReadShow = false;
            } else {
                this.moreMyReadShow = true;
            }
        },
        moreMyReadVideo() {
            this.myReadPage++;
            this.setMyReadVideos()
        },
        setMyVideos() {
            let k=0;
            this.myVideos = [];
            for (let item of this.orgmyVideos) {
                if(k < (this.myPage*4)) {
                    this.myVideos.push(item)
                }
                k++;
            }
            if(this.myVideos.length >= this.orgmyVideos.length) {
                this.moreMyShow = false;
            } else {
                this.moreMyShow = true;
            }
        },
        moreMyVideo() {
            this.myPage++;
            this.setMyVideos()
        },
        setHitVideos() {
            let k=0;
            this.hitVideos = [];
            for (let item of this.orghitVideos) {
                if(k < (this.hitPage*4)) {
                    this.hitVideos.push(item)
                }
                k++;
            }
            if(this.hitVideos.length >= this.orghitVideos.length) {
                this.moreHitShow = false;
            } else {
                this.moreHitShow = true;
            }
        },
        moreHitVideo() {
            this.hitPage++;
            this.setHitVideos()
        },
        setMemberInfo() {
            let memberInfo = AUTH.getSession(this.$isMobile());
            if (memberInfo.AUTHTOKEN) {
                if (memberInfo.mtype != 'temp') {
                    this.isLogin = true;
                    this.mtype = memberInfo.mtype;
                    this.myUid = memberInfo.uid;
                } else {
                    this.isLogin = false;
                    this.mtype = '';
                    this.myUid = '';
                }
            } else {
                this.isLogin = false;
                this.mtype = '';
                this.myUid = '';
            }
            this.getData();
        },
        goVideo(liveNo, no, uid) {
            if (liveNo) {
                if (this.myUid == uid) {
                    this.$router.push('/hostLive/' + liveNo);
                } else {
                    this.$router.push('/userLiveIntro/' + liveNo);
                }
            } else {
                this.$router.push('/videoView/' + no);
            }
        },
        goFollower(uid) {
            this.$router.push('/' + uid);
        }
    },


}
</script>
<style lang="scss" scoped="true">
.video-page-container {
    margin-bottom: 48px;
    background: #fff;
    min-height: calc(100vh - 48px);

    .banner-box {
        padding-right: 0;

        img {
            width: 100%;
            min-height: 202px;
        }
    }

    .videos-box {
        height: auto;
        padding: 10px;
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

        .list {
            margin-bottom: 10px;
            cursor: pointer;
            padding: 0;

            li {
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
                        color: #fff;
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

    .folling-box {
        height: 230px;
        padding: 20px;
        position: relative;

        .folling-title {
            color: #000;
            font-weight: 600;
            font-size: 11pt;
            margin-left: -10px;
            margin-bottom: 10px;
        }


        .swiper-box {
            color: #fff;
            margin-bottom: 60px;
            cursor: pointer;
            background: #0F1421;

            .padding-box {
                display: flex;
                padding: 25px 15px;

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
                        width: 100%;
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

        }
    }
}
</style>
