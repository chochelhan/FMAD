<template>
    <div class="video-page-container">
        <div class="main-container">
            <div class="banner-box">
                <img src="../../../../assets/images/main_banner.png"/>
            </div>
            <div class="videos-box">
                <div class="video-title">최신 영상</div>
                <ul class="swiper-box">
                    <li v-for="video in lasetestVideos">
                        <div @click="goVideo(video.liveNo,video.no,video.uid)" class="img-box"
                             :style="{'background-image':'url('+video.thumbnails.medium.url+')','background-size':'cover','background-position':'center center'}"></div>
                        <div class="subject" @click="goVideo(video.liveNo,video.no,video.uid)">{{ video.title }}</div>
                        <div class="desc" @click="goVideo(video.liveNo,video.no,video.uid)">{{ video.description }}
                        </div>
                    </li>
                </ul>
                <div class="btn" v-if="!lateMoreHide" @click="more('lasetest')">더보기</div>
            </div>
            <div v-if="isLogin">
                <div class="videos-box">

                    <div class="video-title">구독 영상</div>
                    <ul class="swiper-box">
                        <li v-for="video in myReadVideos">
                            <div @click="goVideo(video.liveNo,video.no,video.uid)" class="img-box"
                                 :style="{'background-image':'url('+video.thumbnails.medium.url+')','background-size':'cover','background-position':'center center'}"></div>
                            <div @click="goVideo(video.liveNo,video.no,video.uid)" class="subject">{{ video.title }}
                            </div>
                            <div @click="goVideo(video.liveNo,video.no,video.uid)" class="desc">{{ video.description }}
                            </div>
                        </li>
                    </ul>
                    <div class="btn" v-if="!readMoreHide" @click="more('myRead')">더보기</div>
                </div>

            </div>
            <div class="videos-box">

                <div class="video-title">인기 영상</div>
                <ul class="swiper-box">
                    <li v-for="video in hitVideoList">
                        <div @click="goVideo(video.liveNo,video.no,video.uid)" class="img-box"
                             :style="{'background-image':'url('+video.thumbnails.medium.url+')','background-size':'cover','background-position':'center center'}"></div>
                        <div @click="goVideo(video.liveNo,video.no,video.uid)" class="subject">{{ video.title }}</div>
                        <div @click="goVideo(video.liveNo,video.no,video.uid)" class="desc">{{ video.description }}
                        </div>

                    </li>
                </ul>
                <div class="btn" v-if="!hitMoreHide" @click="more('hit')">더보기</div>
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
        name: 'pcMainPage',
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
                lasetestVideos: [],
                hitVideoList: [],
                myReadVideos: [],
                lasetestOrgVideos: [],
                hitOrgVideoList: [],
                myOrgReadVideos: [],
                isLogin: false,
                myUid: '',
                mtype: '',
                hitCnt: 10,
                readCnt: 10,
                lateCnt: 10,
                hitMoreHide: false,
                readMoreHide:  false,
                lateMoreHide:  false,


            };
        },
        created() {
            this.setMemberInfo();
        },
        methods: {
            getData() {
                const frm = new FormData()
                apiService.post(API_URL_YOUTUBE_GET_MAIN_VIDEO_LIST, frm, (res) => {

                    this.lastestOrgVideos = res.lastestVideos;
                    if(10 >= this.lastestOrgVideos.length) {
                        this.lateMoreHide = true;
                    }
                    let k = 0;
                    for (const item of res.lastestVideos) {
                        if (k < 10) {
                            this.lasetestVideos.push(item)
                        }
                        k++;
                    }
                    if (this.isLogin) {
                        this.myOrgReadVideos = res.myReadVideos
                        if(10 >= this.myOrgReadVideos.length) {
                            this.readMoreHide = true;
                        }

                        k = 0;
                        for (const item of res.myReadVideos) {
                            if (k < 10) {
                                this.myReadVideos.push(item)
                            }
                            k++;
                        }

                    }
                    this.hitOrgVideoList = res.hitVideoList;
                    if(10 >= this.hitOrgVideoList.length) {
                        this.hitMoreHide = true;
                    }

                    k = 0;
                    for (const item of res.hitVideoList) {
                        if (k < 10) {
                            this.hitVideoList.push(item)
                        }
                        k++;
                    }

                });
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
            more(type) {
                let k = 1;
                switch (type) {
                    case 'lasetest':
                        for (const item of this.lastestOrgVideos) {
                            if (this.lateCnt < k && (this.lateCnt + 5) >= k) {
                                this.lasetestVideos.push(item)
                            }
                            k++;
                        }
                        this.lateCnt = this.lateCnt + 5;
                        if(this.lateCnt >= this.lastestOrgVideos.length) {
                            this.lateMoreHide = true;
                        }
                        break;
                    case 'myRead':
                        for (const item of this.myOrgReadVideos) {
                            if (this.readCnt < k && (this.readCnt + 5) >= k) {
                                this.myReadVideos.push(item)
                            }
                            k++;
                        }
                        this.readCnt = this.readCnt + 5;
                        if(this.readCnt >= this.myOrgReadVideos.length) {
                            this.readMoreHide = true;
                        }
                        break;
                    case 'hit':
                        for (const item of this.hitOrgVideoList) {
                            if (this.hitCnt < k && (this.hitCnt + 5) >= k) {
                                this.hitVideoList.push(item)
                            }
                            k++;
                        }
                        this.hitCnt = this.hitCnt + 5;
                        if(this.hitCnt >= this.hitOrgVideoList.length) {
                            this.hitMoreHide = true;
                        }
                        break;
                }
            },
        }


    }
</script>
<style lang="scss" scoped="true">
    .video-page-container {
        padding-bottom: 40px;

        .banner-box {
            width: 100%;
            background: #000;
            padding-right: 10px;

            img {
                width: 100%;
                min-height: 400px;
            }
        }

        .videos-box {
            padding: 40px;
            position: relative;

            .video-title {
                color: #000;
                font-weight: bold;
                font-size: 13pt;
                margin-bottom: 15px;
            }

            .swiper-box {
                padding: 0;
                color: #000;
                margin-bottom:30px;
                display: flex;
                flex-wrap: wrap;

                li {
                    width: calc(((100vw - 310px) - 200px) / 5);
                    margin-right: 23px;
                    margin-bottom: 40px;
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
                        margin-top: 15px;
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

            .btn {
                width: 100%;
                height: 60px;
                line-height: 60px;
                text-align: center;
                background: #F4F4F4;
                border: solid 1px #dcdcdc;
                cursor: pointer;
            }
        }

        .empty-div {
            text-align: left;
            color: #fff;
            line-height: 200px;
            font-size: 15pt;
        }
    }
</style>
