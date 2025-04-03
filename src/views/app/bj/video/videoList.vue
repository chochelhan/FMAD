<template>
    <div :class="'data-contents '+mobileClass">
        <div class="main-container">

            <div class="reload-video-box" v-if="uid">
                <div class="msg">
                    새로고침 버튼을 눌러 유튜브에서 가져오는 영상을 업데이트 할 수 있습니다.
                </div>
                <div class="button">
                    <v-btn class="reload-button" outlined depress @click="videoReload()">
                        새로 고침
                    </v-btn>
                </div>
            </div>
            <div class="videos-box">

                <div class="title-box">
                    <div class="video-title">업로드한 동영상</div>
                    <div class="video-more" @click="videoMore()" v-if="!mobileView">모두 보기 <i class="fas fa-caret-right"></i></div>
                </div>
                <ul class="listUl">
                    <li v-for="(video,index) in videoList" class="swiper-box" @click="goVideo(video.no)">
                        <div class="img-box"
                             :style="{'background-image':'url('+video.thumbnails.medium.url+')','background-size':'cover','background-position':'center center'}">
                        </div>
                        <div class="ul-mobile-box">
                            <div class="subject">{{ video.title }}</div>
                            <div class="desc">{{ video.description }}</div>
                        </div>
                    </li>
                    <li class="empty-li" v-if="videoList.length<1">영상이 없습니다</li>
                </ul>
                <div class="video-more" @click="videoMore()" v-if="mobileView && videoList.length>0 && !videoMoreFlag">더보기</div>
            </div>
            <div class="videos-box">

                <div class="title-box">
                    <div class="video-title">인기 업로드</div>
                    <div class="video-more" @click="hitVideoMore()" v-if="!mobileView">모두 보기 <i class="fas fa-caret-right"></i></div>
                </div>
                <ul class="listUl">
                    <li v-for="(video,index) in hitVideoList" class="swiper-box" @click="goVideo(video.no)">
                        <div class="img-box"
                             :style="{'background-image':'url('+video.thumbnails.medium.url+')','background-size':'cover','background-position':'center center'}">
                        </div>
                        <div class="ul-mobile-box">
                            <div class="subject">{{ video.title }}</div>
                            <div class="desc">{{ video.description }}</div>
                        </div>
                    </li>
                    <li class="empty-li" v-if="hitVideoList.length<1">영상이 없습니다</li>
                </ul>
                <div class="video-more" @click="hitVideoMore()" v-if="mobileView && hitVideoList.length>0 && !hitVideoMoreFlag">더보기</div>
            </div>
        </div>

    </div>
</template>


<script>
import AUTH from '../../../../api/auth'
import {
    HOST,
    API_URL_YOUTUBE_GET_BJ_VIDEO_LIST
} from '../../../../api/urls';
import apiService from '../../../../api/apiService';
import {mapGetters} from "vuex";

export default {
    name: 'videoList',
    computed: {
        ...mapGetters('etc', ["getUid"]),
        ...mapGetters('member', ["getMtype"]),
    },
    watch: {
        getMtype(val) {
            this.setMemberInfo();
        },

    },
    data() {
        return {
            mobileView: false,
            mobileClass: '',
            host: HOST,
            videoList: [],
            allVideoList: [],
            hitVideoList: [],
            allHitVideoList: [],

            clientId: '99231061866-ukek1eir01bi44st3al0h0o4soi1q2ne.apps.googleusercontent.com',
            scope: 'https://www.googleapis.com/auth/youtube',
            uid: '',
            redirectUrl: 'https://www.fatmouse.co.kr/api/googleApi/redirect',
            hitVideoMoreFlag:false,
            videoMoreFlag:false,

        }
    },
    created() {
        if (this.$isMobile()) {
            this.mobileView = true;
            this.mobileClass = 'mobile'
        }
        this.ownerUid = this.getUid;
        this.getData();
        this.setMemberInfo();
    },
    methods: {
        getData() {

            const frm = new FormData()
            frm.append('uid', this.ownerUid)
            apiService.post(API_URL_YOUTUBE_GET_BJ_VIDEO_LIST, frm, (res) => {
                this.allVideoList = res.videoList;
                let k = 0;
                for (let video of this.allVideoList) {
                    if (k < 5) {
                        this.videoList.push(video);
                    }
                    k++;
                }
                this.allHitVideoList = res.hitVideoList;
                k = 0;
                for (let video of this.allHitVideoList) {
                    if (k < 5) {
                        this.hitVideoList.push(video);
                    }
                    k++;
                }


            });

        },
        setMemberInfo() {
            this.uid = '';
            let memberInfo = AUTH.getSession(this.$isMobile());
            if (memberInfo.AUTHTOKEN) {
                console.log(memberInfo)
                if (this.ownerUid == memberInfo.uid && memberInfo.mtype == 'shop') {

                    this.uid = memberInfo.uid;
                }
            }


        },
        videoReload() {
            window.open('https://accounts.google.com/o/oauth2/v2/auth?client_id=' + this.clientId + '&redirect_uri=' + this.redirectUrl + '&state=' + this.uid + '&access_type=offline&approval_prompt=force&response_type=code&scope=' + this.scope, 'loginWin', 'top=30,left=100,width=400,height=500');

        },
        videoMore() {
            this.videoList = [];
            for (let video of this.allVideoList) {
                this.videoList.push(video);
            }
            this.videoMoreFlag = true;
        },
        hitVideoMore() {
            this.hitVideoList = [];
            for (let video of this.allHitVideoList) {
                this.hitVideoList.push(video);
            }
            this.hitVideoMoreFlag = true;
        },
        goVideo(no) {
            this.$router.push('/videoView/' + no);
        }

    },
    updated() {

    }

}
</script>

<style lang="scss" scoped="true">
.data-contents {

    .reload-video-box {
        display: flex;
        justify-content: space-between;
        border-bottom: solid 1px #000;
        padding-bottom: 7px;
        margin-bottom: 40px;

        .msg {
            color: #666;
            font-size: 11pt;
        }

        .button {
            .reload-button {
                color: #000;
                border-radius: 0;
                margin-top: -4px;

            }
        }
    }

    .videos-box {
        min-height: 350px;
        padding: 0;
        position: relative;

        .title-box {
            width: 100%;
            display: flex;
            justify-content: space-between;
            margin-bottom: 15px;

            .video-title {
                width: 500px;
                color: #fff;
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
                color: #000;
                line-height: 130px;
                font-size: 15pt;
            }

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

    &.mobile {
        .reload-video-box {
            display: flex;
            justify-content: space-between;
            border-bottom: solid 1px #000;
            padding-bottom: 7px;
            margin-bottom: 40px;

            .msg {
                color: #000;
                font-size: 11px;
            }

            .button {
                .reload-button {
                    color: #000;
                    border-radius: 0;
                    margin-top: -4px;

                }
            }
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
                    width: auto;
                    color: #000;
                    font-weight: bold;
                    font-size: 15px;
                    text-align: left;
                }

            }

            .video-more {
                color:#fff;
                font-size: 14px;
                text-align: center;
                width:100%;
                height:40px;
                border:solid 1px #000;
                line-height:40px;
                margin-bottom:30px;
            }
            .listUl {
                padding: 0;
                display: block;

                .empty-li {
                    text-align: left;
                    color: #000;
                    line-height: 130px;
                    font-size: 12px;
                }

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

                    .ul-mobile-box {
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
        }
    }
}
</style>
