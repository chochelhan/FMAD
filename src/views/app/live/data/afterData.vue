<template>
    <div :class="'mypage-container '+mobileClass">

        <div class="contents">
            <div class="from-box">
                <div class="stitle"><span class="line">공유 내역</span>
                </div>
                <div class="data-list-box">
                    <ul class="data-list">
                        <li v-for="(data,idx) in dataList" :key="data.type+data.no">
                            <span class="gtype">{{ data.typeName }}</span>
                            <div class="subject">
                                {{ data.name }}
                            </div>
                            <div class="date">{{ data.viewDate }}</div>
                        </li>
                        <li class="no-data" v-if="dataList.length<1"
                            style="width:100%;text-align:center;padding-top:60px;color:#000;font-weight: bold;">
                            공유 내역이 없습니다
                        </li>
                    </ul>
                </div>
            </div>

        </div>

    </div>
</template>


<script>
import {mapGetters} from "vuex";
import {
    API_URL_BROADCAST_LIVE_DATA_AFTER_LIST
} from '../../../../api/urls';
import apiService from '../../../../api/apiService';

export default {
    name: 'afterData',
    data() {
        return {
            mobileView: false,
            mobileClass: '',
            dataList: [],
            gno: '',
        }
    },
    computed: {
        ...mapGetters('etc', ["getGno"]),

    },
    created() {
        if (this.$isMobile()) {
            this.mobileView = true;
            this.mobileClass = 'mobile'
        }
        this.gno = this.getGno;
        this.getData();
    },

    methods: {
        getData() {
            const frm = new FormData()
            frm.append('gno', this.gno)
            apiService.post(API_URL_BROADCAST_LIVE_DATA_AFTER_LIST, frm, (ret) => {

                for (let fdata of ret.fileList) {
                    let rdates = fdata.rdate.toString();
                    let regdate = rdates.substring(0, 10);

                    let item = {
                        name: fdata.name,
                        no: fdata.no,
                        ext: fdata.ext,
                        type: 'data',
                        typeName: '자료',
                        url: fdata.url,
                        viewDate: regdate,

                    }
                    this.dataList.push(item);

                }
            });
        },

    }

}
</script>
<style lang="scss" scoped>
ul {
    padding: 0;
}

.mypage-container {
    .data-list-box {
        margin-top: 30px;
        .data-list {
            display: flex;
            flex-wrap: wrap;

            li {
                -webkit-box-shadow: 1px 1px 9px -1px rgba(71, 70, 71, 0.53);
                -moz-box-shadow: 1px 1px 9px -1px rgba(71, 70, 71, 0.53);
                box-shadow: 1px 1px 9px -1px rgba(71, 70, 71, 0.53);
                width: 31%;
                margin: 0 40px 40px 0;
                height: 170px;
                padding: 30px 20px 0 30px;
                border-radius: 10px;
                position: relative;

                &:nth-child(3n) {
                    margin-right: 0;
                }

                .del-box {
                    cursor: pointer;
                    position: absolute;
                    right: 10px;
                    top: 10px;
                    background: #999999;
                    width: 20px;
                    height: 20px;
                    text-align: center;
                    line-height: 20px;
                    border-radius: 10px;

                    i {
                        font-size: 10pt;
                        color: #fff;
                    }
                }
            }

            .gtype {
                width: auto;
                padding: 0 10px;
                display: inline-block;
                height: 20px;
                text-align: center;
                line-height: 20px;
                border-radius: 10px;
                font-size: 9pt;;
                color: #fff;
                background: #2D8CFF;

            }

            .subject {
                color: #000;
                font-weight: bold;
                padding: 10px 0;
                font-size: 12pt;
            }

            .date {
                color: #999;
                font-size: 10pt;

            }

            .file {
                padding-top: 5px;
                font-size: 11pt;

                i {
                    color: #1E90FF;
                }
            }
        }
    }

    &.mobile {
        .data-list-box {
            .data-list {
                width: 100%;
                display: flex;
                flex-wrap: wrap;

                li {
                    -webkit-box-shadow: 1px 1px 9px -1px rgba(71, 70, 71, 0.53);
                    -moz-box-shadow: 1px 1px 9px -1px rgba(71, 70, 71, 0.53);
                    box-shadow: 1px 1px 9px -1px rgba(71, 70, 71, 0.53);
                    width: 48%;
                    margin: 0 4% 20px 0;
                    height: 150px;
                    padding: 40px 0 0 30px;
                    border-radius: 10px;
                    position: relative;

                    &:nth-child(2n) {
                        margin-right: 0;
                    }

                    &:nth-child(3n) {
                        margin-right: 4%;
                    }

                    &.no-data {
                        margin-right: 0;
                    }

                    .del-box {
                        cursor: pointer;
                        position: absolute;
                        right: 10px;
                        top: 10px;
                        background: #999999;
                        width: 20px;
                        height: 20px;
                        text-align: center;
                        line-height: 20px;
                        border-radius: 10px;

                        i {
                            font-size: 10pt;
                            color: #fff;
                        }
                    }
                }

                .gtype {
                    width: 45px;
                    height: 20px;
                    text-align: center;
                    line-height: 20px;
                    border-radius: 10px;
                    font-size: 9pt;;
                    color: #fff;
                    background: #2D8CFF;
                    cursor: pointer;
                }

                .subject {
                    color: #000;
                    font-weight: bold;
                    padding: 10px 0;
                    font-size: 12pt;
                    cursor: pointer;
                }

                .date {
                    color: #999;
                    font-size: 10pt;
                    cursor: pointer;

                }
            }


        }
    }
}


</style>