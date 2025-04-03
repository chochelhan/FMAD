<template>
    <div :class="'page-container '+mobileClass">
        <div class="live-box" @click="goMainVideo()" v-if="liveInfo.no">
            <div class="bigimg-box" v-if="liveInfo.thumbnails"
                 :style="{'background-image':'url('+liveInfo.thumbnails.medium.url+')','background-size':'cover','background-position':'center center'}">
            </div>
            <div class="info-box">
                <div class="subject">
                    {{ liveInfo.title }}
                </div>
                <div class="desc">
                    {{ liveInfo.description }}
                </div>
            </div>
        </div>
        <div class="videos-box">

            <div class="title-box">
                <div class="video-title">재생목록</div>
            </div>
            <ul class="listUl">
                <li v-for="(video,index) in videoList" class="swiper-box" @click="goVideo(video)">
                    <div class="img-box"
                         :style="{'background-image':'url('+video.thumbnails.medium.url+')','background-size':'cover','background-position':'center center'}">
                    </div>
                    <div class="info-box">
                        <div class="subject">{{ video.title }}</div>
                        <div class="desc">{{ video.description }}</div>
                    </div>
                </li>
                <li class="empty-li" v-if="videoList.length<1">영상이 없습니다</li>
            </ul>

        </div>
        <div class="list-title">게시판</div>
        <ul class="list-table">

            <li
                v-for="item in articleList"
                :key="item.no" @click="showView(item)">
                <div class="info-box">
                    <div class="info-author">
                        <div class="author-img">
                            <img v-if="item.photo" :src="host+item.photo">
                            <i class="fas fa-user" v-else></i>
                        </div>
                        <div class="author-title">
                            <div class="author-name">
                                {{ item.name }}
                            </div>
                            <div class="author-rdate">
                                {{ item.rdate }}
                            </div>
                        </div>
                    </div>
                    <div class="info-subject">{{ item.subject }}</div>
                    <div class="info-content" v-html="item.contents"></div>
                </div>
                <div class="img-box">
                    <img :src="host+item.img" v-if="item.img">
                </div>
            </li>
            <li class="empty-li" v-if="articleList.length<1">자료가 없습니다</li>
        </ul>
    </div>
</template>

<script>
import AUTH from '../../../api/auth'
import {
    HOST,
    API_URL_YOUTUBE_GET_BJ_HOME
} from '../../../api/urls';
import apiService from '../../../api/apiService';
import {mapGetters} from "vuex";

export default {
    name: 'BjHome',
    computed: {
        ...mapGetters('etc', ["getUid"]),
        ...mapGetters('member', ["getMtype"]),
    },
    watch: {
        getMtype(val) {
            this.setMemberInfo();
        },
        getUid(val) {
            this.uid = val;
            this.getData();
        }
    },
    data() {
        return {
            mobileView: false,
            mobileClass: '',
            host: HOST,
            uid: '',
            videoList: [],
            liveInfo: {},
            articleList: [],
            isAdmin: false,
            memberUid: '',
            boardInfo: {},
            follower: false,
        }
    },
    created() {
        if (this.$isMobile()) {
            this.mobileView = true;
            this.mobileClass = 'mobile'
        }
        this.uid = this.getUid;
        this.getData();

    },
    methods: {
        setMemberInfo() {
            let memberInfo = AUTH.getSession(this.$isMobile());
            if (memberInfo.AUTHTOKEN) {
                this.memberUid = memberInfo.uid;
                this.isAdmin = (memberInfo.uid == this.uid) ? true : false;
            }


        },
        getData() {

            const frm = new FormData()
            frm.append('uid', this.uid)
            apiService.post(API_URL_YOUTUBE_GET_BJ_HOME, frm, (res) => {
                this.videoList = res.videoList;
                if (res.liveInfo) {
                    this.liveInfo = res.liveInfo;
                }
                this.articleList = res.articleList;

                for (let grp of res.boardInfo.content) {
                    for (let brd of grp.boardList) {
                        this.boardInfo[brd.code] = brd;
                    }
                }
                this.follower = res.follower;


            });

        },
        goMainVideo() {
            if (this.liveInfo.liveNo) {
                if (this.isAdmin) {
                    this.$router.push('/hostLive/' + this.liveInfo.liveNo);
                } else {
                    this.$router.push('/userLiveIntro/' + this.liveInfo.liveNo);
                }
            } else {
                this.$router.push('/videoView/' + this.liveInfo.no);
            }
        },
        goVideo(item) {
            if (item.url) {
                if (this.isAdmin) {
                    this.$router.push('/hostLive/' + this.liveInfo.liveNo);
                } else {
                    this.$router.push('/userLiveIntro/' + this.liveInfo.liveNo);
                }
            } else {
                this.$router.push('/videoView/' + item.no);
            }
        },
        showView(item) {
            let vauth = false;
            if (this.memberUid && (this.memberUid == item.uid)) {
                vauth = true;
            } else {
                let board = this.boardInfo[item.bid];
                switch (board.vauth) {
                    case 'all':
                        vauth = true;
                        break;
                    case 'follwer':
                        if (this.isAdmin) vauth = true;
                        else if (this.follower) vauth = true;
                        break;
                    case 'user':
                        if (this.isLogin) vauth = true;
                        break;
                    default:
                        if (this.isAdmin) vauth = true;
                        break;
                }
            }
            if (vauth) {
                this.$router.push('/' + this.uid + '/main/userBoard/view/' + item.no);
            } else {
                let params = {
                    message: '글보기 권한이 존재하지 않습니다',
                };
                this.$eventBus.$emit('modalOpen', params);
            }
        },


    }
}
</script>
<style lang="scss" scoped="true">
.page-container {

    .live-box {
        display: flex;
        height: 250px;
        overflow-y: hidden;
        margin-bottom: 50px;
        cursor: pointer;

        .bigimg-box {
            width: 470px;
            height: 250px;
            overflow: hidden;
        }

        .info-box {
            margin-left: 20px;

            .subject {
                font-weight: bold;
                color: #000;
                font-size: 18pt;
                margin: 20px 0;
            }

            .desc {
                color: #555;
                font-size: 10pt;

            }
        }
    }

    .list-title {
        color: #000;
        font-weight: bold;
        font-size: 13pt;
        text-align: left;
        margin-bottom: 15px;
    }

    .videos-box {
        min-height: auto;
        padding: 0;
        position: relative;

        .title-box {
            width: 100%;
            display: flex;

            justify-content: space-between;
            margin-bottom: 15px;

            .video-title {
                width: 500px;
                color: #000;
                font-weight: bold;
                font-size: 13pt;
                text-align: left;
            }

            .video-more {
                cursor: pointer;
                color: #000;
                font-size: 11pt;
                text-align: right;

                i {
                    font-size: 15pt;
                }
            }
        }

        .listUl {
            padding: 0;
            display: flex;
            flex-wrap: wrap;

            .empty-li {
                text-align: left;
                color: #fff;
                line-height: 130px;
                font-size: 15pt;
            }

            .swiper-box {
                color: #000;
                margin-bottom: 60px;
                width: 18.4%;
                margin-right: 2%;

                &:nth-child(5n) {
                    margin-right: 0;
                }

                cursor: pointer;

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
    }

    .list-table {
        width: 100%;
        padding: 0;

        li {
            background: #fafafa;
            color: #000;
            padding: 30px;
            margin-bottom: 20px;
            display: flex;
            cursor: pointer;

            .info-box {
                width: 90%;

                .info-author {
                    display: flex;
                    cursor: pointer;

                    .author-img {
                        width: 40px;
                        height: 40px;
                        text-align: center;
                        border-radius: 50%;
                        line-height: 45px;
                        background: #fff;
                        overflow: hidden;
                        margin-right: 10px;

                        img {
                            width: 100%;
                        }

                        i {
                            color: #686EFB;
                            font-size: 16pt;
                        }
                    }

                    .author-title {
                        .author-name {
                            font-size: 12pt;
                        }

                        .author-rdate {
                            font-size: 10pt;
                            color: #999;
                        }
                    }
                }

                .info-subject {
                    font-size: 15pt;
                    font-weight: bold;
                    margin: 10px 0 5px 0;


                }

                .info-content {
                    font-size: 12pt;
                    color: #999;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    display: -webkit-box;
                    -webkit-line-clamp: 4; /* 라인수 */
                    -webkit-box-orient: vertical;
                    word-wrap: break-word;
                    line-height: 14px;
                    height: 90px;
                    cursor: pointer;
                }

            }

            .img-box {
                cursor: pointer;
                min-width: 250px;
                width: 250px;
                height: 170px;
                overflow: hidden;

                img {
                    width: 100%;
                }

            }
        }
    }

    &.mobile {
        .live-box {
            display: block;
            height: auto;
            overflow-y: visible;
            margin-bottom: 30px;

            .bigimg-box {
                width: 100%;
                height: 186px;
                overflow: hidden;
            }

            .info-box {
                margin-left: 0;

                .subject {
                    font-weight: bold;
                    color: #000;
                    font-size: 14px;
                    margin: 10px 0 5px 0;
                }

                .desc {
                    color: #999;
                    font-size: 10px;

                }
            }
        }

        .list-title {
            color: #000;
            font-weight: bold;
            font-size: 15px;
            text-align: left;
            margin-bottom: 15px;
        }

        .videos-box {
            min-height:auto;
            padding: 0;
            position: relative;

            .title-box {
                width: 100%;
                display: flex;
                justify-content: space-between;
                margin-bottom: 15px;

                .video-title {
                    width: auto;
                    color: #000;
                    font-weight: bold;
                    font-size: 15px;
                    text-align: left;
                }

                .video-more {
                    cursor: pointer;
                    color: #686EFB;
                    font-size: 11pt;
                    text-align: right;

                    i {
                        font-size: 15pt;
                    }
                }
            }

            .listUl {
                padding: 0;
                display: block;

                .swiper-box {
                    color: #000;
                    margin-bottom: 20px;
                    width:100%;
                    margin-right:0;
                    cursor: pointer;
                    display: flex;
                    justify-content: space-between;
                    .img-box {
                        width: 120px;
                        min-width: 120px;
                        margin-right:10px;
                        height: 67px;
                        overflow: hidden;

                    }

                    .info-box {
                        width:80%;
                        .subject {

                            margin-top: 1px;
                            font-weight: bold;
                            font-size: 14px;
                            width: 100%;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: normal;
                            line-height: 1.4;
                            height: 40px;
                            text-align: left;
                            word-wrap: break-word;
                            display: -webkit-box;
                            -webkit-line-clamp: 2;
                            -webkit-box-orient: vertical;

                        }

                        .desc {
                            font-size: 10px;
                            color: #999;
                            margin-top:2px;
                            width: 100%;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: normal;
                            line-height: 1.4;
                            height: 30px;
                            text-align: left;
                            word-wrap: break-word;
                            display: -webkit-box;
                            -webkit-line-clamp: 2;
                            -webkit-box-orient: vertical;

                        }
                    }

                }
            }
            .empty-li {
                font-size:12px;
            }
        }

        .list-table {
            width: 100%;
            padding: 0;

            li {
                background: #fff;
                color: #000;
                padding:0;
                border-bottom:solid 1px  #0F1421;
                margin-bottom: 20px;
                display: flex;
                .info-box {
                    width: 90%;

                    .info-author {
                        display: flex;
                        cursor: pointer;

                        .author-img {
                            width: 24px;
                            height: 24px;
                            text-align: center;
                            border-radius: 50%;
                            line-height: 24px;
                            background: #fff;
                            overflow: hidden;
                            margin-right:5px;
                            margin-top:4px;
                            img {
                                width: 100%;
                            }

                            i {
                                color: #686EFB;
                                font-size: 12pt;
                            }
                        }

                        .author-title {
                            .author-name {
                                font-size: 11px;
                            }

                            .author-rdate {
                                font-size: 9px;
                                color: #999;
                            }
                        }
                    }

                    .info-subject {
                        font-size: 14px;
                        font-weight: bold;
                        margin: 10px 0 5px 0;


                    }

                    .info-content {
                        font-size: 12px;
                        color: #999;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        display: -webkit-box;
                        -webkit-line-clamp: 2; /* 라인수 */
                        -webkit-box-orient: vertical;
                        word-wrap: break-word;
                        line-height:120%;
                        height: 35px;
                        cursor: pointer;
                    }

                    .icon-box {
                        margin-top: 10px;

                        img {
                            width: 20px;
                            cursor: pointer;
                        }

                        span {
                            color: #686EFB;
                            font-size: 12pt;
                            display: inline-block;
                            margin: 0 20px 0 0;
                            padding-left: 7px;
                            position: relative;
                            top: -4px;
                        }
                    }
                }

                .img-box {
                    cursor: pointer;
                    min-width: 85px;
                    width: 85px;
                    height: 85px;
                    overflow: hidden;

                    img {
                        width: 100%;
                        min-height:85px;
                    }

                }
            }
        }
        .empty-li {
            font-size:12px;
        }
    }
}
</style>
