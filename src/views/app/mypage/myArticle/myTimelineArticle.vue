<template>
    <div :class="'timeline-container '+mobileClass">
        <ul class="comment-list-box">
            <li class="comment-list" v-for="(item,index) in dataList">
                <div class="padding-box">
                    <div class="list-header">
                        <div class="img-box">
                            <img :src="host+item.photo" v-if="item.photo">
                            <i v-else class="fas fa-user"></i>
                        </div>
                        <div class="name-box">
                            <div class="name">{{ item.name }}</div>
                            <div class="time">{{ item.rdate }}</div>
                        </div>

                        <div class="modify">
                            <i class="fas fa-ellipsis-v" @click="editShow(index)"></i>
                            <v-card class="update-type-box" v-if="item.updatePannelShow" elevation="2"
                                    width="130">
                                <ul>
                                    <li @click="showUpdateBox(item.no,index)">수정하기</li>
                                    <li @click="deleteData(item.no,index)">삭제하기</li>
                                </ul>
                            </v-card>
                        </div>
                    </div>

                    <div class="item-text" v-html="item.contents">
                    </div>
                </div>
                <div class="imgs-box">
                    <div v-if="item.vfiles.length>0">
                        <div class="swiper-container" v-if="item.vfiles.length>1">
                            <swiper :options="swiperOption">
                                <swiper-slide v-for="img in item.vfiles">
                                    <img :src="host+img.url">
                                </swiper-slide>
                                <div class="swiper-pagination" slot="pagination"></div>
                            </swiper>
                        </div>
                        <div v-else>
                            <img :src="host+item.vfiles[0].url">
                        </div>
                    </div>
                </div>
                <div class="padding-box">
                    <div class="reple-info">
                        <span>좋아요 {{ item.glike }}개</span> . <span>댓글 {{ item.comm_num }}개</span>
                    </div>

                </div>
                <!--ul class="reple-change">
                    <li @click="setFavorite(item.no,index)">
                        <img v-if="item.myFav" src="../../../../assets/img/ico_pm1_s.png"/>
                        <img v-else src="../../../../assets/img/ico_pm1.png"/>
                        좋아요
                    </li>
                    <li @click="showReple(item.no,index)"><img src="../../../../assets/img/ico_pm2.png"/>댓글</li>
                    <li @click="snsShow(index)" style="padding-top:3px;"><img src="../../../../assets/img/ico_pm3.png"/>공유하기
                        <v-card class="update-type-box" v-if="item.snsPannelShow" elevation="2"
                                width="130">
                            <ul>
                                <li @click="snsShare('fb',index)">페이스북</li>
                                <li @click="snsShare('ko',index)">카카오톡</li>
                                <li @click="snsShare('nb',index)">네이버밴드</li>
                                <li @click="snsShare('ln',index)">라인</li>
                            </ul>
                        </v-card>
                    </li>
                </ul-->

            </li>
        </ul>
        <div v-if="dataList.length<1" class="empty-data">
            데이타가 존재하지 않습니다
        </div>
        <v-dialog
            v-model="modalShow"
            width="780"
            style="z-index:100;"
        >
            <timelineRegist v-if="articleRegistShow" :ownerUid="ownerUid" :no="selectedNo"
                            @modalHide="modalHide"></timelineRegist>
        </v-dialog>
    </div>
</template>

<script>
import AUTH from '../../../../api/auth'
import {
    HOST,
    API_URL_MEMBER_MY_ARTICLE_LIST,
    API_URL_USER_TIMELINE_LIKE_UPDATE,
    API_URL_USER_TIMELINE_DELETE
} from '../../../../api/urls';
import apiService from '../../../../api/apiService';
import {mapGetters} from "vuex";
import timelineRegist from '../../bj/timeline/timelineRegist'

export default {
    name: 'myTimelineArticle',
    components: {
        timelineRegist,
    },
    watch: {
        modalShow(val) {
            if (!val) {
                this.repleRegistShow = false;
                this.articleRegistShow = false;
            }
        },

    },
    data() {
        return {
            articleRegistShow: false,
            modalShow: false,
            rauth: false,
            isAdmin: false,
            host: HOST,
            updateIndex: '',
            updateNo: '',
            dataList: [],
            userInfo: {},
            memberImg: '',
            total: 0,
            total_page: 1,
            page: 1,
            content: '',
            removeCount: 0,
            no: '',
            isLogin: false,
            checklimit: 20,
            limit: 20,
            memberNo: '',
            createFlag: true,
            selectedIndex: '',
            rwauth: false,
            swiperOption: {
                slidesPerView: 1,
                autoHeight: true,
                pagination: {
                    el: '.swiper-pagination',
                }
            },
            ownerUid: '',
            uid: '',
            follower: false,
            selectedNo: '',
            repleRegistShow: false,
            mobileView: false,
            mobileClass: '',
        }
    },
    created() {
        this.init();
        if (this.$isMobile()) {
            this.mobileView = true;
            this.mobileClass = 'mobile'

        }
    },
    methods: {
        modalHide(cmd) {
            this.modalShow = false;
            this.articleRegistShow = false;
            this.repleRegistShow = false;
            if (cmd == 'reload') {
                this.getDataList();
            }
        },
        pageReload() {
            this.getDataList();
        },
        init() {

            this.updateIndex = '';
            this.updateNo = '';
            this.dataList = [];
            this.total = 0;
            this.total_page = 1;
            this.page = 1;
            this.checklimit = this.limit;

            this.getDataList();
        },
        getDataList() {

            const frm = new FormData()
            frm.append('cmd', 'timeline')
            apiService.post(API_URL_MEMBER_MY_ARTICLE_LIST, frm, (res) => {
                this.dataList = [];
                for (let data of res.list) {
                    data.myFav = '';
                    if (data.extraVars) {
                        if (this.uid) {
                            if (data.extraVars[this.uid]) {
                                data.myFav = 'active';
                            }
                        }
                    }
                    data.snsPannelShow = false;
                    data.updatePannelShow = false;
                    this.dataList.push(data)
                }

                this.follower = res.follower;
                if (this.isLogin) this.rauth = true;
            });

        },
        setFavorite(no, index) {
            let item = this.dataList[index]

            if (this.uid && item.uid != this.uid) {
                const frm = new FormData()
                frm.append('uid', this.uid)
                frm.append('no', no)
                apiService.post(API_URL_USER_TIMELINE_LIKE_UPDATE, frm, (res) => {
                    item.glike = res.glike;
                    if (item.myFav == 'active') item.myFav = '';
                    else item.myFav = 'active';
                });
            } else if (this.uid) {
                let params = {
                    message: '자신이 작성한 글에는 좋아요를 할수 없습니다',
                };
                this.$eventBus.$emit('modalOpen', params);
            } else {
                let params = {
                    message: '먼저 로그인 하세요',
                };
                this.$eventBus.$emit('modalOpen', params);
            }

        },
        editShow(index) {
            let item = this.dataList[index]
            if (item.updatePannelShow) item.updatePannelShow = false;
            else item.updatePannelShow = true;

        },
        showWrite() {
            if (this.rauth) {
                this.selectedNo = 'new';
                this.modalShow = true;
                this.articleRegistShow = true;
            } else {
                let params = {
                    message: '글쓰기 권한이 존재하지 않습니다',
                };
                this.$eventBus.$emit('modalOpen', params);
            }
        },

        showUpdateBox(no, index) {
            this.selectedNo = no;
            this.modalShow = true;
            this.articleRegistShow = true;
            this.selectedIndex = index;

        },
        deleteData(no, index) {
            let params = {
                type: 'confirm',
                message: '글을 삭제 하시겠습니까?',
                doAction: () => {
                    const frm = new FormData()
                    frm.append('no', no);
                    apiService.post(API_URL_USER_TIMELINE_DELETE, frm, (res) => {
                        this.dataList.splice(index, 1)
                    });

                }
            };
            this.$eventBus.$emit('modalOpen', params);
        },

        /// 기존작업 /////
        snsShow(index) {
            let item = this.dataList[index]
            if (item.snsPannelShow) item.snsPannelShow = false;
            else item.snsPannelShow = true;
        },
        snsShare(sns, index) {
            let item = this.dataList[index]

            let img = (item.vfiles) ? item.vfiles[0] : '';
            let title = item.contents;
            let no = item.no;

            let snsParams = {};
            snsParams.stype = sns;
            snsParams.currentUrl = this.ownerUid + '/main/timeline/list'
            snsParams.no = no;
            snsParams.img = img;
            snsParams.title = title;
            this.$eventBus.$emit('snsGo', snsParams);

        },
        /**
         *@ 댓글 영역
         *
         ***/
        showReple(no, index) {
            this.updateIndex = index;
            this.updateNo = no;
            if (this.isLogin) this.rwauth = true;
            else this.rwauth = false;
            this.modalShow = true;
            this.repleRegistShow = true;

        },
        updateRepleResult(total) {
            var item = this.dataList[this.updateIndex]
            item.subCnt = total;

            this.updateIndex = '';
        },
        scrollHandler() {
            var obj = this;
            var height = $(window).height();
            var total_page = obj.total_page;
            var page = obj.page;
            var top = $(window).scrollTop() + height;


            if ($('.comment-list-box').html()) {
                if (parseFloat($('.comment-list-box > li:last-child').offset().top) <= (parseFloat(top) + 100)) {
                    if (total_page > page) {
                        obj.page++;
                        obj.getCommentList();
                    }
                }
            }

        },

    },

}
</script>

<style lang="scss" scoped>

.timeline-container {
    min-height: calc(100vh);
    height: auto;
    width: 800px;
    margin: auto;

    .comment-info {
        padding: 0 30px 30px 30px;
        background: #141A2C;
        border: solid 3px #fafafa;
    }

    .input-box-layout {
        width: 100%;
        padding: 20px;
        background: #fff;
        display: flex;

        .img-box {
            width: 40px;
            height: 40px;
            overflow: hidden;
            border-radius: 50%;
            background: #6C5DB1;
            text-align: center;

            img {
                width: 40px;
                min-height: 40px;
            }

            i {
                line-height: 40px;
                color: #fff;
            }
        }

        .input-box {
            margin-left: 15px;
            display: flex;

            .text {
                height: 40px;
                line-height: 28px;
                border: solid 1px #dcdcdc;
                width: 590px;
                padding-left: 15px;
                background: #F4F4F4;
                outline: none;
                border-radius: 5px;
                line-height: 40px;
                font-size: 10pt;

            }

            .submit-button {
                margin-left: 10px;
                background: #686EFB;
                border-radius: 5px;
                color: #fff;
                width: 100px;
                height: 40px;

            }
        }

    }

    .comment-list-box {
        width: 100%;
        max-width: 100%;
        padding: 0;
        margin: 25px 0 0 0;
        vertical-align: top;

        .comment-list {
            background: #fff;
            border: solid 1px #dcdcdc;
            width: 100%;
            padding: 15px 0;
            margin: 0 0 15px 0;
            border-bottom: 1px solid rgba(#000, .2);

            .padding-box {
                margin: 15px;

                .list-header {
                    display: flex;

                    .img-box {
                        background: #6C5DB1;
                        color: #fff;
                        width: 40px;
                        height: 40px;
                        overflow: hidden;
                        border-radius: 50%;
                        text-align: center;

                        img {
                            width: 40px;
                            min-height: 40px;
                        }

                        i {
                            line-height: 40px;
                            color: #fff;
                        }

                    }

                    .name-box {
                        padding-left: 5px;
                        margin-top: -4px;
                        width: 60%;

                        .name {
                            color: #000;
                            font-size: 12pt;
                            font-weight: bold;
                        }

                        .time {
                            color: #999;
                            font-size: 8pt;
                        }
                    }

                    .modify {
                        width: 35%;
                        text-align: right;
                        position: relative;
                        cursor: pointer;
                        padding-top: 3px;

                        i {
                            font-size: 13pt;
                            color: #ccc;
                        }

                        .update-type-box {
                            position: absolute;
                            z-index: 10;
                            right: 0;

                            ul {
                                padding: 15px 0 0 0;

                                li {
                                    text-align: center;
                                    padding-bottom: 15px;
                                    font-size: 10pt;
                                    color: #000;
                                    font-weight: bold;
                                }
                            }
                        }
                    }
                }

                .item-text {
                    color: #000;
                    font-size: 12pt;
                    padding: 15px 0 0 0;
                }
            }

            .imgs-box {
                min-height: 300px;
                overflow: hidden;

                img {
                    width: 100%;
                }
            }

            .padding-box.bottom-line {
                display: flex;
                padding-top: 10px;
                padding-bottom: 25px;
                border-bottom: solid 1px #dcdcdc;

                .reple-info {
                    width: 70%;
                    font-size: 10pt;
                    color: #000;
                    font-weight: bold;
                }

            }

            .reple-change {
                display: flex;
                padding: 20px 0 22px 0;

                li {
                    font-size: 10pt;
                    color: #999;
                    width: 33.3%;
                    text-align: center;
                    position: relative;
                    cursor: pointer;

                    img {
                        width: 18px;
                        margin-right: 5px;
                    }

                    .update-type-box {
                        position: absolute;
                        z-index: 10;
                        right: 70px;
                        margin-top: 7px;

                        ul {
                            padding: 15px 0 0 0;

                            li {
                                width: 100%;
                                text-align: center;
                                padding-bottom: 15px;
                                font-size: 10pt;
                                color: #000;
                                font-weight: bold;
                            }
                        }
                    }
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
        border-top: solid 1px #dcdcdc;
        border-bottom: solid 1px #dcdcdc;
    }

    &.mobile {
        width: 100%;

        .input-box-layout {
            width: 100%;
            padding: 20px;
            background: #fff;
            display: flex;

            .img-box {
                width: 40px;
                height: 40px;
                overflow: hidden;
                border-radius: 50%;
                background: #6C5DB1;
                text-align: center;

                img {
                    width: 40px;
                    min-height: 40px;
                }

                i {
                    line-height: 40px;
                    color: #fff;
                }
            }

            .input-box {
                margin-left: 15px;
                display: flex;

                .text {
                    height: 40px;
                    line-height: 28px;
                    border: solid 1px #dcdcdc;
                    width: 590px;
                    padding-left: 15px;
                    background: #F4F4F4;
                    outline: none;
                    border-radius: 5px;
                    line-height: 40px;
                    font-size: 10pt;

                }

                .submit-button {
                    margin-left: 10px;
                    background: #686EFB;
                    border-radius: 5px;
                    color: #fff;
                    width: 100px;
                    height: 40px;

                }
            }

        }

        .comment-list-box {
            width: 100%;
            max-width: 100%;
            padding: 0;
            margin: 25px 0 0 0;
            vertical-align: top;

            .comment-list {
                background: #fff;
                border: none;
                border-bottom: solid 1px #dcdcdc;
                width: 100%;
                padding: 15px 0;
                margin: 0 0 15px 0;
                border-bottom: 1px solid rgba(#000, .2);

                .padding-box {
                    margin:10px 15px;
                    .list-header {
                        display: flex;

                        .img-box {
                            background: #6C5DB1;
                            color: #fff;
                            width: 28px;
                            height: 28px;
                            overflow: hidden;
                            border-radius: 50%;
                            text-align: center;

                            img {
                                width: 40px;
                                min-height: 28px;
                            }

                            i {
                                line-height: 28px;
                                color: #fff;
                            }

                        }

                        .name-box {
                            margin-top: -4px;

                            .name {
                                color: #000;
                                font-size: 10pt;
                                font-weight: bold;
                            }

                            .time {
                                color: #999;
                                font-size: 7pt;
                            }
                        }

                        .modify {
                            width: 35%;
                            text-align: right;
                            position: relative;
                            cursor: pointer;
                            padding-top: 3px;

                            i {
                                font-size: 13pt;
                                color: #ccc;
                            }

                            .update-type-box {
                                position: absolute;
                                z-index: 10;
                                right: 0;

                                ul {
                                    padding: 15px 0 0 0;

                                    li {
                                        text-align: center;
                                        padding-bottom: 15px;
                                        font-size: 10pt;
                                        color: #000;
                                        font-weight: bold;
                                    }
                                }
                            }
                        }
                    }

                    .item-text {
                        color: #000;
                        font-size: 10pt;
                        font-weight: bold;
                        padding: 15px 0 0 0;
                    }
                }

                .imgs-box {
                    min-height: 201px;
                    overflow: hidden;

                    img {
                        width: 100%;
                        min-height: 201px;
                    }
                }

                .reple-info {
                    font-size: 8pt;
                    color: #000;
                    font-weight: bold;
                }

                .reple-change {
                    display: flex;
                    padding: 20px 0 22px 0;

                    li {
                        font-size: 10pt;
                        color: #999;
                        width: 33.3%;
                        text-align: center;
                        position: relative;
                        cursor: pointer;

                        img {
                            width: 18px;
                            margin-right: 5px;
                        }

                        .update-type-box {
                            position: absolute;
                            z-index: 10;
                            right: 70px;
                            margin-top: 7px;

                            ul {
                                padding: 15px 0 0 0;

                                li {
                                    width: 100%;
                                    text-align: center;
                                    padding-bottom: 15px;
                                    font-size: 10pt;
                                    color: #000;
                                    font-weight: bold;
                                }
                            }
                        }
                    }

                }
            }
        }
    }
}
</style>