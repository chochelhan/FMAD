<template>
    <div :class="'data-contents '+mobileClass">

        <div class="search-box">
            <div class="left-box">
                <div class="select-box">
                    <selectBox v-if="groupList.length>0"
                               :value="grp"
                               :items="groupList"
                               @onSelected="grpChange"
                    >
                    </selectBox>

                </div>

                <div class="select-box">
                    <selectBox v-if="bidList.length>0"
                               :value="bid"
                               :items="bidList"
                               @onSelected="bidChange"
                    >
                    </selectBox>
                </div>
            </div>
            <div class="right-box">
                <div class="select-box" v-if="!mobileView">
                    <selectBox v-if="!mobileView"
                               :value="itemLimit"
                               :items="itemLimitList"
                               @onSelected="itemLimitChange"
                    >
                    </selectBox>
                </div>
                <div class="reg-button-box">
                    <v-btn
                        v-if="!mobileView"
                        type="button"
                        @click="articleRegist()"
                        class="reg-button"
                    >
                        글쓰기
                    </v-btn>
                    <v-btn
                        type="button"
                        @click="articleRegist()"
                        class="reg-button"
                        v-if="mobileView"
                    >

                        <i class="fas fa-plus"></i>
                    </v-btn>
                </div>
            </div>
            <div style="clear:both"></div>
        </div>
        <div>
            <ul class="list-table">

                <li
                    v-for="item in dataList"
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
                        <div class="icon-box" v-if="!mobileView">
                            <img src="../../../../assets/images/ico_like_p.png">
                            <span class="like-text">{{ item.glike }}</span>
                            <img src="../../../../assets/images/ico_pm2.png">
                            <span class="like-text">{{ item.comm_num }}</span>
                        </div>

                    </div>
                    <div class="img-box">
                        <img :src="host+item.img" v-if="item.img">
                    </div>
                </li>
            </ul>

            <div v-if="dataList.length<1" class="empty-data">
                데이타가 존재하지 않습니다
            </div>

        </div>
        <div class="text-center pt-2">
            <paganation v-if="dataList.length>0"
                        :page="page"
                        :pageCount="pageCount"
                        :total="itemTotal"
                        :limit="itemLimit"
                        :pageInit="pageInit"
                        @getDataListByPaging="getData"
            ></paganation>
        </div>
        <div style="height:40px"></div>
        <v-dialog
            v-if="!mobileView"
            v-model="modalShow"
            width="780"
            persistent
            style="z-index:100;"
        >
            <userBoardRegist v-if="articleRegistShow" :ownerUid="ownerUid" :no="selectedNo"
                             @modalHide="modalHide"></userBoardRegist>
        </v-dialog>

    </div>
</template>


<script>
import AUTH from '../../../../api/auth'
import {
    HOST,
    API_URL_USER_BOARD_ARTICLE_LIST_BYUID,
    API_URL_USER_BOARD_ARTICLE_LIST
} from '../../../../api/urls';
import apiService from '../../../../api/apiService';
import {mapGetters} from "vuex";
import userBoardRegist from './userBoardRegist'
import selectBox from '../../../../components/selectBox/select';
import paganation from '../../../../components/paganation'
import JQ from "jquery";

export default {
    name: 'userBoardArticle',
    components: {
        userBoardRegist,
        selectBox,
        paganation
    },
    computed: {
        ...mapGetters('etc', ["getUid"]),
    },
    watch: {
        checkboxAll(val) {
            for (let key in this.nos) {
                if (val) {
                    this.nos[key] = true;
                } else {
                    this.nos[key] = false;
                }
            }
        },
        modalShow(val) {
            if (!val) {
                this.selectedNo = '';
                this.articleRegistShow = false;
            }
        },
        mobileModalShow(val) {
            if (!val) {
                this.selectedNo = '';
                this.articleRegistShow = false;
            }
        }


    },
    data() {
        return {
            mobileView: false,
            mobileClass: '',
            host: HOST,
            grp: 'all',
            grpList: [],
            bid: 'all',
            bidList: [],
            groupList: [],
            boardDatas: {},
            page: 1,
            nos: {},
            pageCount: 5,
            checkboxAll: false,
            itemLimit: 20,
            ownerUid: '',
            itemLimitList: [
                {value: 10, text: '10개'},
                {value: 15, text: '15개'},
                {value: 20, text: '20개'},
                {value: 50, text: '50개'},
                {value: 100, text: '100개'},
            ],
            itemTotal: 1,
            dataList: [],
            orgDataList: [],
            serverDataList: [],
            isLogin: false,
            isAdmin: false,
            modalShow: false,
            selectedNo: '',
            articleRegistShow: false,
            rauth: false,
            follower: false,
            uid: '',
            boardDataInfo: {},
            pageInit: false,
            mobileModalShow:false,
        }
    },
    created() {
        if (this.$isMobile()) {
            this.mobileView = true;
            this.mobileClass = 'mobile'
        }
        this.ownerUid = this.getUid;
        let memberInfo = AUTH.getSession(this.$isMobile());
        if (memberInfo.AUTHTOKEN) {
            this.isLogin = true;
            this.uid = memberInfo.uid;
            if (memberInfo.uid == this.ownerUid || memberInfo.uid == 'admin') {
                this.isAdmin = true;
            }
        }
        this.getServerData();

    },
    methods: {
        showView(item) {
            let vauth = false;
            if (this.uid && (this.uid == item.uid)) {
                vauth = true;
            } else {
                let board = this.boardDataInfo[item.bid];
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
                this.$router.push('/' + this.ownerUid + '/main/userBoard/view/' + item.no);
            } else {
                let params = {
                    message: '글보기 권한이 존재하지 않습니다',
                };
                this.$eventBus.$emit('modalOpen', params);
            }
        },
        modalHide(cmd) {
             this.mobileModalShow = false;
            this.modalShow = false;
            if (cmd == 'reload') {
                this.getServerArticleData();
            }
        },
        itemLimitChange(value) {
            this.itemLimit = value;
            this.getData(1);
        },
        grpChange(value) {
            this.grp = value;
            this.bidList = [];
            this.bid = 'all';
            this.bidList.push({text: '게시판 전체', value: 'all'});
            if (this.boardDatas[value]) {
                for (let brd of this.boardDatas[value]) {
                    this.bidList.push({text: brd.name, value: brd.code});
                }
            }
            this.getServerArticleData();

        },
        bidChange(value) {
            this.bid = value;
            this.getServerArticleData();
        },
        getServerData() {

            const frm = new FormData()
            frm.append('uid', this.ownerUid)
            apiService.post(API_URL_USER_BOARD_ARTICLE_LIST_BYUID, frm, (res) => {
                this.bidList = [];
                this.groupList = [];
                this.bidList.push({text: '게시판 전체', value: 'all'});
                this.groupList.push({text: '그룹 전체', value: 'all'});
                this.follower = res.follower;
                let rauth = false;
                for (let grp of res.boardInfo.content) {
                    this.groupList.push({text: grp.groupName, value: grp.code})
                    this.boardDatas[grp.code] = grp.boardList;
                    for (let brd of grp.boardList) {
                        switch (brd.rauth) {
                            case 'all':
                                rauth = true;
                                break;
                            case 'follwer':
                                if (this.isAdmin) rauth = true;
                                else if (this.follower) rauth = true;
                                break;
                            case 'user':
                                if (this.isLogin) rauth = true;
                                break;
                            default:
                                if (this.isAdmin) rauth = true;
                                break;
                        }
                        this.boardDataInfo[brd.code] = brd;
                    }
                }
                this.rauth = rauth;
                this.dataList = [];
                if (res.list.length > 0) {
                    this.serverDataList = res.list;
                    for (let item of this.serverDataList) {
                        if (item.notice == 'yes') {
                            item.subject = '[공지] ' + item.subject;
                        }
                        item.comm_num = (item.comm_num) ? item.comm_num : 0;
                        item.glike = (item.glike) ? item.glike : 0;
                        this.orgDataList.push(item);
                    }
                    this.getData(1);

                }
            });

        },
        getServerArticleData() {


            const frm = new FormData()
            frm.append('uid', this.ownerUid)
            frm.append('grp', this.grp)
            frm.append('bid', this.bid)
            apiService.post(API_URL_USER_BOARD_ARTICLE_LIST, frm, (res) => {
                this.dataList = [];
                this.orgDataList = [];
                if (res.list.length > 0) {
                    this.serverDataList = res.list;
                    for (let item of this.serverDataList) {
                        if (item.notice == 'yes') {
                            item.subject = '[공지] ' + item.subject;
                        }
                        item.comm_num = (item.comm_num) ? item.comm_num : 0;
                        item.glike = (item.glike) ? item.glike : 0;
                        this.orgDataList.push(item);
                    }
                    this.getData(1);
                } else {
                    this.serverDataList = [];
                }
            });

        },
        getData(page) {
            let start = (page - 1) * this.itemLimit;
            let end = start + this.itemLimit;
            this.itemTotal = this.orgDataList.length;

            let orgDataList = this.orgDataList.slice(start, end);
            this.dataList = [];
            let startNum = '';
            if (this.itemTotal >= this.itemLimit) {
                startNum = (this.itemTotal - ((page - 1) * this.itemLimit)) + 1;
            } else startNum = this.itemTotal
            let k = 0;
            this.nos = {};
            for (let item of orgDataList) {
                this.nos[item.no] = false;
                item.num = startNum - k;
                this.dataList.push(item);
                k++;

            }

        },
        articleRegist() {
            if (this.rauth) {
                if(this.mobileView) {
                    this.$router.push('/' + this.ownerUid + '/main/userBoard/regist/');
                } else {
                    this.modalShow = true;
                    this.articleRegistShow = true;
                }

            } else {
                let params = {
                    message: '글쓰기 권한이 존재하지 않습니다',
                };
                this.$eventBus.$emit('modalOpen', params);
            }
        }

    },
    updated() {
        this.pageInit = false;
    }

}
</script>

<style lang="scss" scoped="true">
.data-contents {
    width: 100%;

    .regist-button {
        margin: -10px 0 10px 0;

        .reg-button {
            width: 160px;
            border-radius: 20px;
            height: 40px;
        }
    }

    .regist-button-bottom {
        margin: 10px 0 0 0;

        .reg-button {
            width: 160px;
            border-radius: 20px;
            height: 40px;
        }
    }

    .search-box {
        margin: 10px 0 30px 0;

        .left-box {
            float: left;
            display: flex;

            .select-box {
                width: 220px;
                margin-right: 15px;
            }
        }

        .right-box {
            float: right;
            display: flex;

            .select-box {
                width: 160px;
                margin-right: 15px;
            }

            .reg-button-box {
                .reg-button {
                    width: 140px;
                    border-radius: 5px;
                    background: #686EFB;
                    color: #fff;
                    height: 40px;
                }
            }
        }

        .text-box {
            width: 350px;
            display: flex;

            i {
                position: relative;
                z-index: 10;
                margin: 13px 0 0 -25px;
            }
        }


    }

    .data-info-box {
        height: 30px;
        display: flex;
        justify-content: space-between;

        .total {
            font-size: 10pt;
            font-weight: bold;
            margin-right: 30px;
        }

        .select-box {
            width: 160px;
            display: flex;
            font-size: 10pt;
            font-weight: bold;
            margin-top: -8px;

            span {
                width: 150px;
                display: inline-block;
                margin-top: 8px;
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
                        background: #000;
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
                    -webkit-line-clamp: 2; /* 라인수 */
                    -webkit-box-orient: vertical;
                    word-wrap: break-word;
                    line-height: 14px;
                    height: 45px;
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

    .empty-data {
        height: 150px;
        text-align: center;
        line-height: 150px;
        font-size: 10pt;
        background: #fafafa;
        color: #000;
    }

    .submit-button-box {
        padding-top: 50px;
        text-align: right;

        .submit-button {

            width: 250px;
            min-height: 50px;
        }
    }

    &.mobile {
        width: 100%;
        .regist-button {
            margin: -10px 0 10px 0;
            .reg-button {
                width: 160px;
                border-radius: 20px;
                height: 40px;
            }
        }

        .regist-button-bottom {
            margin: 10px 0 0 0;

            .reg-button {
                width: 160px;
                border-radius: 20px;
                height: 40px;
            }
        }

        .search-box {
            margin: 10px 0 30px 0;
            position: relative;
            width:100%;
            overflow:hidden;
            display: flex;
            justify-content: space-between;
            .left-box {
                float: left;
                width:90%;
                min-width:90%;
                display: flex;
                .select-box {
                    width:50%;
                    margin-right:10px;
                }
            }

            .right-box {
                width:20%;
                float: right;
                display: flex;
                .select-box {
                    width:30px;
                    margin-right:0;
                }
                i {
                    color:#fff;
                    font-size:19pt;
                    margin-top:5px;
                }

                .reg-button-box {
                    position: fixed;
                    bottom: 65px;
                    right: 15px;
                    .reg-button {
                       width: 40px;
                        max-width: 40px;
                        min-width: 40px;
                        border-radius: 20px;
                        background: #686EFB;
                        color: #fff;
                        line-height:30px;
                        height:40px;
                        i {
                            margin-top:0;
                            font-size: 18px;
                        }
                    }
                }
            }

            .text-box {
                width:100%;
                display: flex;
                i {
                    position: relative;
                    z-index: 10;
                    margin: 13px 0 0 -25px;
                }
            }


        }


        .list-table {
            width: 100%;
            padding: 0;

            li {
                background: none;
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

        .empty-data {
            height: 150px;
            text-align: center;
            line-height: 150px;
            font-size: 10pt;
            background: #fafafa;
            color: #000;
        }

        .submit-button-box {
            padding-top: 50px;
            text-align: right;

            .submit-button {

                width: 250px;
                min-height: 50px;
            }
        }
        .mobile-screen-box {
            width:calc(100vw);
            position:fixed;
            top:0;
            left:0;
            z-index:150;
        }
        .meet-mobile-header {
            width: 100%;
            position: fixed;
            background: #141A2C;
            z-index: 90;
            top: 0;
            left: 0;
            height: 44px;
            display:flex;
            box-shadow: 0px 0px 9px #0000007A;
            .back-button {
                color:#fff;
                margin:10px 0 0 10px;
            }
            .header-title {
                text-align:left;
                padding:10px 0 0 15px;
                color:#fff;
                font-weight: 600;
            }
        }
    }
}
</style>
