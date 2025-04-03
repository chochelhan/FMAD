<template>
    <div class="mypage-container">
        <div class="contents" v-if="!mobileView">

            <div class="stitle">
                <span>이용 중인 광고</span>
            </div>
            <div class="title-desc">이용 중인 광고를 볼 수 있습니다.</div>

            <table class="list-table">
                <thead>
                <tr>
                    <th style="width:220px">
                        기간
                    </th>
                    <th>
                        유튜버 이름
                    </th>
                    <th>
                        결제여부

                    </th>
                    <th>
                        금액
                    </th>
                    <th>
                        진행사항
                    </th>
                    <th>
                        세부내역보기
                    </th>
                </tr>
                </thead>
                <tbody>
                <tr
                    v-for="item in dataList"
                    :key="item.no"
                >
                    <td style="text-align:center;">
                        {{ item.stdate }} ~ {{ item.endate }}
                    </td>
                    <td>{{ item.targetName }}({{ item.targetUid }})</td>
                    <td>{{ item.payResult }}</td>
                    <td><span class="price">{{ item.price }}</span>원</td>
                    <td>
                        <div :class="item.status">{{ item.statsName }}</div>
                    </td>
                    <td>
                        <div class="underline" @click="showDetail(item)">보기</div>
                    </td>
                </tr>
                </tbody>
            </table>

            <div v-if="dataList.length<1" class="empty-data">
                데이타가 존재하지 않습니다
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
        </div>
        <div class="mobile" v-else>

            <ul class="listUl">
                <li
                    v-for="item in dataList"
                    :key="item.no"
                >
                    <div class="left-gox">
                        <div class="date">{{ item.stdate }} ~ {{ item.endate }}</div>
                        <div class="bj">{{ item.targetName }}({{ item.targetUid }})</div>
                        <div class="underline" @click="showDetail(item)">
                            <i class="fas fa-angle-down" v-if="!item.view"></i>
                            <i class="fas fa-angle-up" v-else></i>
                        </div>
                    </div>
                    <div class="right-box">
                        <div :class="item.status">{{ item.statsName }}</div>
                        <div class="price">{{ item.price }}원</div>
                        <div class="payResult">{{ item.payResult }}</div>

                    </div>
                </li>
            </ul>

            <div v-if="dataList.length<1" class="empty-data">
                데이타가 존재하지 않습니다
            </div>
        </div>
        <v-dialog
            v-model="modalShow"
            width="450"
            style="z-index:100;"
        >
            <div class="modal-container">
                <div class="header-box">
                    <div class="stitle"><span>세부내역</span></div>
                </div>
                <div class="form-box">
                    <ul class="form-basic" style="margin-top:20px;">
                        <li>
                            <div class="gtitle">광고유형 / 광고상품</div>
                            <div class="gtext">{{ bannerType }} / {{ bannerCode }}</div>
                        </li>
                        <li>
                            <div class="gtitle">링크 URL</div>
                            <div class="gtext">{{ detailView.glink }}</div>
                        </li>
                        <li>
                            <div class="gtitle">광고 노출일</div>
                            <div class="gtext">{{ detailView.stdate }} ~ {{ detailView.endate }}</div>
                        </li>
                        <li>
                            <div class="gtitle">신청자 성명</div>
                            <div class="gtext">{{ detailView.name }}</div>
                        </li>
                        <li>
                            <div class="gtitle">이메일</div>
                            <div class="gtext">{{ detailView.email }}</div>
                        </li>
                        <li>
                            <div class="gtitle">요청사항</div>
                            <div class="gtext">{{ detailView.content }}</div>
                        </li>
                    </ul>
                </div>

            </div>
        </v-dialog>
    </div>
</template>


<script>
import {
    API_URL_BANNER_USER_MYBANNER_LIST
} from '../../../../api/urls';
import apiService from '../../../../api/apiService';
import paganation from '../../../../components/paganation'
import AUTH from '../../../../api/auth'
import {BANNER} from '../../../../config/banner'
import {mapActions} from "vuex";

export default {
    name: 'useBanner',
    components: {
        paganation
    },
    data() {
        return {
            mobileView: false,
            mobileClass: '',
            uno: '',
            page: 1,
            pageCount: 5,
            modalShow: false,
            keyword: '',
            cmd: 'name',
            itemLimit: 20,
            pageInit: false,
            itemLimitList: [
                5, 10, 15, 20, 50, 100
            ],
            itemTotal: 1,
            dataList: [],
            orgDataList: [],
            stdate: '',//new Date().toISOString().substr(0, 10),
            stDatePicker: false,
            endate: '',//new Date().toISOString().substr(0, 10),
            enDatePicker: false,
            searchItems: [
                {value: 'name', text: '이름'},
                {value: 'uid', text: '아이디'},
            ],
            serverDataList: [],
            bannerType: '',
            bannerCode: '',
            detailView: {},

        }
    },
    created() {
        if (this.$isMobile()) {
            this.setClass('sub')
            this.setTitle('이용중인 광고');
            this.setBackUrl('');
            this.mobileView = true;
            this.mobileClass = 'mobile'
        }
        let memberInfo = AUTH.getSession(this.$isMobile());
        if (memberInfo.AUTHTOKEN) {
            this.uno = memberInfo.no;
        }
        this.getServerData();

    },
    methods: {
        ...mapActions('mobile', ["setClass", "setTitle", "setBackUrl"]),
        getServerData() {
            this.orgDataList = [];
            const frm = new FormData()
            frm.append('uno', this.uno)
            apiService.post(API_URL_BANNER_USER_MYBANNER_LIST, frm, (res) => {
                if (res.list.length > 0) {
                    this.serverDataList = res.list;
                    for (let item of this.serverDataList) {

                        if (item.paymentResult == 'yes') {
                            switch (item.status) {
                                case 'ready':
                                    item.statsName = '대기중';
                                    break;
                                case 'ing':
                                    item.statsName = '진행중';
                                    break;
                                case 'end':
                                    item.statsName = '종료';
                                    break;
                                case 'stop':
                                    item.statsName = '중지';
                                    break;
                            }
                            item.payResult = '완료'
                        } else {
                            item.statsName = '-';
                            item.payResult = '미결제';
                        }

                        this.orgDataList.push(item);
                    }
                    this.getData(1);
                } else {
                    this.dataList = [];
                    this.itemTotal = 0;
                }
            });

        },
        getData(page) {
            let start = (page - 1) * this.itemLimit;
            let end = start + this.itemLimit;
            this.itemTotal = this.orgDataList.length;

            let orgDataList = this.orgDataList.slice(start, end);
            this.dataList = [];
            let k = 0;
            this.nos = {};
            for (let item of orgDataList) {
                this.dataList.push(item);
                k++;

            }

        },
        showDetail(item) {
            console.log(item)
            for (let banner of BANNER) {
                if (banner.code == item.bannerType) {
                    this.bannerType = banner.name;
                    for (let sub of banner.codeList) {
                        if (sub.code == item.bannerCode) this.bannerCode = sub.name;
                    }
                }
            }
            this.modalShow = true;
            this.detailView = item;
        },
    }

}
</script>
<style lang="scss" scoped>
.list-table {
    border-spacing: 0;
    border-collapse: collapse;
    width: 100%;

    thead {
        th {
            border-top: solid 1px #C6C6C6;
            text-align: center;
            background: #f4f4f4;
            padding: 10px 0;
            color: #000;
            font-size: 12pt;
            border-bottom: solid 1px #DCDCDC;
        }

    }

    tbody {
        td {
            border-bottom: solid 1px #dcdcdc;
            text-align: center;
            padding: 15px 0;
            font-size: 11pt;

            .modify-button {
                border-radius: 20px;
                min-width: 60px;
            }

            .price {
                color: #FF584C;
                font-weight: bold;
            }

            .ing {
                color: #686EFB;
            }

            .underline {
                color: #686EFB;
                text-decoration: underline;
                cursor: pointer;
            }

        }
    }
}
.mobile {
    padding:0 15px;
    .listUl {
        padding:0;
        li {
            padding:15px 0 5px 0;
            border-bottom:solid 1px #dcdcdc;
            display:flex;
            justify-content: space-between;
            .left-gox {
                width:50%;
                text-align:left;
                .date {
                    font-size:10px;
                    color:#999;
                }
                .bj {
                    font-size:14px;
                    font-weight:bold;

                }
                .underline {
                    font-size:18pt;
                    color:#999;
                }
            }
            .right-box {
                width:50%;
                text-align:right;
                .payResult {
                    color:#999;
                    font-size:10px;
                }
                .price {
                    color: #FF584C;
                    font-weight: bold;
                    font-size:16px;
                }
                .statbox {
                    font-size:10px;
                    color:#999;
                    &.ing {
                        color: #686EFB;
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
    color: #000;
    border-bottom: solid 1px #dcdcdc;
}

.modal-container {
    width: 100%;
    background: #fff;
    padding: 30px 30px 60px 30px;

    .header-box {
        .stitle {
            font-size: 17pt;
            font-weight: bold;
            padding: 0 0 10px 0;
            color: #686EFB;
            border-bottom: solid 1px #dcdcdc;

            span {
                padding-bottom: 13px;
                border-bottom: solid 2px #686EFB;
            }
        }

    }

    ul {
        padding: 0;

        li {
            margin-bottom: 20px;

            .gtitle {
                font-size: 10pt;
                color: #999;
            }

            .gtext {
                font-size: 11pt;
                color: #000;
                font-weight: bold;
            }
        }
    }
}


</style>