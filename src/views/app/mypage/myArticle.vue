<template>
    <div class="mypage-container">


        <div :class="'contents '+mobileClass">

            <div v-if="!mobileView" class="stitle">
                <span>내가 쓴 글</span>
            </div>
            <div v-if="!mobileView" class="title-desc">작성한 글을 확인 할 수 있습니다.</div>
            <ul class="tab">
                <li v-for="mnu in myMenus" :class="mnu.gclass" :key="mnu.code" @click="showMyInfo(mnu.code)">
                    {{ mnu.name }}
                </li>
            </ul>
            <myBoardArticle v-if="myinfoView.board"></myBoardArticle>
            <myPhotoArticle v-else-if="myinfoView.photo"></myPhotoArticle>

        </div>
    </div>
</template>


<script>
import {
    HOST,
    API_URL_READ_MYUSER_LIST,
    API_URL_READ_USER_MYDELETE
} from '../../../api/urls';
import apiService from '../../../api/apiService';
import myBoardArticle from './myArticle/myBoardArticle';
import myPhotoArticle from './myArticle/myPhotoArticle';
import {mapActions} from "vuex";

export default {
    name: 'myArticle',
    components: {
        myBoardArticle,
        myPhotoArticle,
    },
    data() {
        return {
            host: HOST,
            mobileView: false,
            mobileClass: '',
            myMenus: [
                {name: '게시판', code: 'board', gclass: 'active'},
                {name: '사진첩', code: 'photo', gclass: ''},
            ],
            myinfoView: {
                board: true,
                photo: false,
                meet: false,
                code: false
            },
            dataList: [],
        }
    },
    created() {
        if (this.$isMobile()) {
            this.mobileView = true;
            this.mobileClass = 'mobile'
            this.setClass('sub')
            this.setTitle('내가 쓴 글');
            this.setBackUrl('');
        }
        this.getData();

    },
    methods: {
        ...mapActions('mobile', ["setClass", "setTitle", "setBackUrl"]),
        getData() {
            this.orgDataList = [];
            const frm = new FormData()
            apiService.post(API_URL_READ_MYUSER_LIST, frm, (res) => {
                //	console.log(res)
                this.dataList = [];
                if (res.list.length > 0) {
                    this.dataList = res.list;

                }
            });

        },
        showMyInfo(code) {
            for (let mnu of this.myMenus) {
                if (code == mnu.code) {
                    mnu.gclass = 'active'
                    this.myinfoView[mnu.code] = true;
                } else {
                    mnu.gclass = ''
                    this.myinfoView[mnu.code] = false;
                }
            }
            console.log(this.myMenus)
        }
    }

}
</script>
<style lang="scss" scoped>
.mypage-container {
    width: 100%;
    background: #fff;

    .contents {
        .tab {
            width: 500px;
            margin: auto;
            display: flex;
            padding: 0;

            li {
                width: 50%;
                cursor: pointer;
                color: #000;
                border: solid 1px #dcdcdc;
                border-left: none;
                text-align: center;
                height: 50px;
                line-height: 50px;

                &.active {
                    color: #fff;
                    background: #686EFB;
                }

                &:first-child {
                    border-left: solid 1px #dcdcdc;
                }
            }

        }

        .item-list {
            padding: 0;

            li {
                padding: 20px 0 20px 25px;
                display: flex;
                border-bottom: solid 1px #dcdcdc;

                &:first-child {
                    border-top: solid 1px #dcdcdc;
                }

                .img-box {
                    min-width: 100px;
                    width: 100px;
                    height: 100px;
                    min-height: 100px;
                    overflow: hidden;
                    text-align: center;
                    border-radius: 50%;
                    border: solid 1px #dcdcdc;
                    background: #686EFB;

                    img {
                        width: 100%;
                        min-height: 100px;

                    }

                    i {
                        color: #fff;
                        margin-top: 20px;
                        font-size: 38pt;
                    }
                }

                .info-box {
                    width: 90%;
                    padding-left: 20px;

                    .live-box {

                    }

                    .subject {
                        font-size: 14pt;
                        color: #000;
                        font-weight: bold;
                    }

                    .read-count {
                        font-size: 10pt;
                        color: #999;
                        margin: 3px 0 7px 0;
                    }

                    .desc {
                        font-size: 12pt;
                        color: #333;
                    }
                }

                .button-box {
                    width: 100px;

                    .del-btn {
                        margin-top: 10px;
                        background: #686EFB;
                        color: #fff;
                    }
                }
            }
        }

        .empty-data {
            height: 150px;
            text-align: center;
            line-height: 150px;
            font-size: 10pt;
            color: #000;
            border-bottom: solid 1px #dcdcdc;
        }

        &.mobile {
            width: 100%;
            max-width: 100%;
            overflow-x: hidden;
            padding:30px 0;

            .tab {
                width: 100%;
                display: flex;
                padding: 0 15px;
                margin-bottom: 20px;
                flex-wrap: wrap;

                li {
                    width: 50%;
                    height: 43px;
                    line-height: 43px;
                    font-size: 10pt;

                    &:nth-child(3n) {
                        border-top:none;
                        border-left: solid 1px #dcdcdc;
                    }

                    &.active {
                        color: #fff;
                        background: #686EFB;
                    }

                    &:first-child {
                        border-left: solid 1px #dcdcdc;
                    }
                    &:last-child {
                        border-top:none;
                    }
                }


            }

        }
    }
}
</style>
