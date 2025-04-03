<template>
    <div class="mypage-container">
        <div id="my-screenLayout" :class="'myPaymentFrameLayout '+mobileClass" v-if="paymentFrameShow">
            <div id="my-bannerPaymentFrameBox">
                <iframe id="bannerPaymentFrame" :src="paymentFrameSrc" style="width:100%;height:495px;" frameborder="0"
                        scrolling="0"></iframe>
            </div>
        </div>
        <div class="contents" v-if="!mobileView">

            <div class="stitle">
                <span>광고 이용자 관리</span>

            </div>
            <div class="req-button">
                <div class="req-button-box">
                    <v-btn
                        class="active-button" depressed
                        @click="showBannerRegist()"
                    >
                        광고 하기
                    </v-btn>

                    <v-btn
                        class="active-button" depressed
                        @click="requireSettle()"
                    >
                        정산 신청
                    </v-btn>
                </div>
            </div>
            <div class="title-desc">광고 이용자를 관리할 수 있습니다.</div>

            <div class="search-box">
                <div class="date-box">
                    <v-menu
                        ref="stDatePicker"
                        v-model="stDatePicker"
                        :close-on-content-click="false"
                        :return-value.sync="stdate"
                        transition="scale-transition"
                        offset-y
                        min-width="auto"
                    >
                        <template v-slot:activator="{ on, attrs }">
                            <v-text-field
                                v-model="stdate"
                                label="결제일(시작)"
                                readonly
                                height="30"
                                v-bind="attrs"
                                outlined
                                dense
                                v-on="on"
                            ></v-text-field>
                        </template>
                        <v-date-picker
                            v-model="stdate"
                            scrollable
                        >
                            <v-spacer></v-spacer>
                            <v-btn
                                text
                                color="primary"
                                @click="stDatePicker = false"
                            >
                                취소
                            </v-btn>
                            <v-btn
                                text
                                color="primary"
                                @click="$refs.stDatePicker.save(stdate)"
                            >
                                확인
                            </v-btn>
                        </v-date-picker>
                    </v-menu>
                    <i class="far fa-calendar-alt"></i>
                </div>
                <div class="date-box">
                    <v-menu
                        ref="enDatePicker"
                        v-model="enDatePicker"
                        :close-on-content-click="false"
                        :return-value.sync="endate"
                        transition="scale-transition"
                        offset-y
                        min-width="auto"
                    >
                        <template v-slot:activator="{ on, attrs }">
                            <v-text-field
                                v-model="endate"
                                label="결제일(종료)"
                                readonly
                                outlined
                                dense
                                v-bind="attrs"
                                v-on="on"
                            ></v-text-field>
                        </template>
                        <v-date-picker
                            v-model="endate"
                            scrollable
                        >
                            <v-spacer></v-spacer>
                            <v-btn
                                text
                                color="primary"
                                @click="enDatePicker = false"
                            >
                                취소
                            </v-btn>
                            <v-btn
                                text
                                color="primary"
                                @click="$refs.enDatePicker.save(endate)"
                            >
                                확인
                            </v-btn>
                        </v-date-picker>
                    </v-menu>
                    <i class="far fa-calendar-alt"></i>
                </div>
                <div class="select-box">
                    <v-select
                        v-model="cmd"
                        :items="searchItems"
                        outlined
                        dense
                    ></v-select>

                </div>
                <div class="text-box">
                    <v-text-field
                        v-model="keyword"
                        label=""
                        placeholder="검색어를 입력해주세요"
                        outlined
                        dense
                    ></v-text-field>
                    <i class="fas fa-search"></i>
                </div>
            </div>

            <table class="list-table">
                <thead>
                <tr>
                    <th style="width:220px">
                        기간
                    </th>
                    <th>
                        이름(아이디)
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
                    <th>
                        수정/중지
                    </th>
                    <th>
                        정산여부
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
                    <td>{{ item.name }}({{ item.uid }})</td>
                    <td>{{ item.payResult }}</td>
                    <td><span class="price">{{ item.priceView }}</span>원</td>
                    <td>
                        <div :class="item.status">{{ item.statsName }}</div>
                    </td>
                    <td>
                        <div class="underline" @click="showDetail(item)">보기</div>
                    </td>
                    <td>
                        <v-btn class="gray-button a" v-if="item.paymentResult == 'yes'" depressed
                               @click="modifyBanner(item)">수정
                        </v-btn>
                        <v-btn class="gray-button" depressed v-if="item.status=='ing' && item.paymentResult == 'yes'"
                               @click="stopBanner(item.no)">중지
                        </v-btn>
                        <v-btn class="active-button" depressed v-if="item.status=='stop' && item.paymentResult == 'yes'"
                               @click="activeBanner(item.no)">실행
                        </v-btn>
                        <div v-if="item.paymentResult != 'yes'">
                            -
                        </div>

                    </td>
                    <td>
                        <div :class="'settle'+item.settle">{{ item.settleName }}</div>
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
        <div class="mobile-contents" v-else>
            <div class="fixed-top">
                <ul class="top-button">
                    <li>
                        <i class="fas fa-search" @click="mobileModalOpen('search')"></i>
                    </li>
                    <li>
                        <i class="fas fa-ellipsis-v" @click="mobileModalOpen('suggest')"></i>
                    </li>
                </ul>
            </div>
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
                        <div :class="'statbox '+item.status">{{ item.statsName }}</div>
                        <div class="price">{{ item.price }}원</div>
                        <div class="payResult">{{ item.payResult }}</div>

                    </div>
                </li>
            </ul>

            <div v-if="dataList.length<1" class="empty-data">
                데이타가 존재하지 않습니다
            </div>
            <v-dialog
                v-model="mobileModalShow"
                width="100%"
                style="z-index:100;"
            >
                <div class="mobile-modal-layout" v-if="mobileSuggestShow">
                    <div class="close-box"><i @click="mobileModalHide()" class="fa fa-times"></i></div>
                    <ul class="req-button-box">
                        <li @click="showBannerRegist()">
                            광고 하기
                        </li>

                        <li @click="requireSettle()">
                            정산 신청
                        </li>
                    </ul>
                </div>
                <div class="mobile-modal-layout" v-if="mobileSearchShow">
                    <div class="close-box"><i @click="mobileModalHide()" class="fa fa-times"></i></div>
                    <div class="search-box">
                        <div class="date-box" style="margin-top:10px;">
                            <v-menu
                                ref="stDatePicker"
                                v-model="stDatePicker"
                                :close-on-content-click="false"
                                :return-value.sync="stdate"
                                transition="scale-transition"
                                offset-y
                                min-width="auto"
                            >
                                <template v-slot:activator="{ on, attrs }">
                                    <v-text-field
                                        v-model="stdate"
                                        label="결제일(시작)"
                                        readonly
                                        height="30"
                                        v-bind="attrs"
                                        outlined
                                        dense
                                        v-on="on"
                                    ></v-text-field>
                                </template>
                                <v-date-picker
                                    v-model="stdate"
                                    scrollable
                                >
                                    <v-spacer></v-spacer>
                                    <v-btn
                                        text
                                        color="primary"
                                        @click="stDatePicker = false"
                                    >
                                        취소
                                    </v-btn>
                                    <v-btn
                                        text
                                        color="primary"
                                        @click="$refs.stDatePicker.save(stdate)"
                                    >
                                        확인
                                    </v-btn>
                                </v-date-picker>
                            </v-menu>
                        </div>
                        <div class="date-box">
                            <v-menu
                                ref="enDatePicker"
                                v-model="enDatePicker"
                                :close-on-content-click="false"
                                :return-value.sync="endate"
                                transition="scale-transition"
                                offset-y
                                min-width="auto"
                            >
                                <template v-slot:activator="{ on, attrs }">
                                    <v-text-field
                                        v-model="endate"
                                        label="결제일(종료)"
                                        readonly
                                        outlined
                                        dense
                                        v-bind="attrs"
                                        v-on="on"
                                    ></v-text-field>
                                </template>
                                <v-date-picker
                                    v-model="endate"
                                    scrollable
                                >
                                    <v-spacer></v-spacer>
                                    <v-btn
                                        text
                                        color="primary"
                                        @click="enDatePicker = false"
                                    >
                                        취소
                                    </v-btn>
                                    <v-btn
                                        text
                                        color="primary"
                                        @click="$refs.enDatePicker.save(endate)"
                                    >
                                        확인
                                    </v-btn>
                                </v-date-picker>
                            </v-menu>
                        </div>
                        <div class="select-box">
                            <v-select
                                v-model="cmd"
                                :items="searchItems"
                                outlined
                                dense
                            ></v-select>

                        </div>
                        <div class="text-box">
                            <v-text-field
                                v-model="keyword"
                                label=""
                                placeholder="검색어를 입력해주세요"
                                outlined
                                dense
                            ></v-text-field>

                        </div>
                        <div class="button-box">
                            <v-btn class="submit-button" type="button" @click="search()">검색하기</v-btn>
                        </div>
                    </div>
                </div>
            </v-dialog>
        </div>
        <v-dialog
            v-model="modalShow"
            width="450"
            style="z-index:100;"
        >
            <div class="detail-container">
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
        <v-dialog
            v-if="!mobileView"
            v-model="updateModalShow"
            width="680"
            style="z-index:100;"
        >
            <bannerRegist v-if="bannerRegistShow" :ownerUid="uid" :bannerData="bannerData"
                          @bannerModalHide="bannerModalHide" @bannerPaymentHide="setBannerPaymentFrame"></bannerRegist>
        </v-dialog>
        <div class="screenBox" v-if="mobileView && updateModalShow">
            <div class="mobile-header">
                <div class="back-button" @click="updateModalShow=false">
                    <i class="fas fa-arrow-left"></i>
                </div>
                <div class="header-title">
                    광고 문의
                </div>
            </div>
            <bannerRegist v-if="bannerRegistShow" :ownerUid="uid" :bannerData="bannerData"
                          @bannerModalHide="bannerModalHide" @bannerPaymentHide="setBannerPaymentFrame"></bannerRegist>
        </div>
    </div>
</template>


<script>
import {
    API_URL_BANNER_USER_PAYMENT_LIST,
    API_URL_BANNER_USER_UPDATE_GIVEW,
    API_URL_BANNER_USER_REQUIRED_SETTLE
} from '../../../../api/urls';
import apiService from '../../../../api/apiService';
import paganation from '../../../../components/paganation'
import AUTH from '../../../../api/auth'
import UTIL from '../../../../api/util'
import {BANNER} from '../../../../config/banner'
import bannerRegist from '../../bj/banner/bannerRegist'
import {mapActions} from "vuex";

export default {
    name: 'bannerUsers',
    components: {
        paganation,
        bannerRegist
    },
    watch: {
        updateModalShow(val) {
            if (!val) {
                this.bannerRegistShow = false;
            }
        },
        stdate(val) {
            if(!this.mobileView) {
                this.search()
            }
        },
        endate(val) {
            if(!this.mobileView) {
                this.search()
            }
        },
        cmd() {
            this.keyword = '';
            if(!this.mobileView) {
                this.search()
            }
        },
        keyword() {
            if(!this.mobileView) {
                this.search()
            }
        },


    },
    data() {
        return {
            paymentFrameShow: false,
            paymentFrameSrc: '',
            mobileView: false,
            mobileClass: '',
            uno: '',
            uid: '',
            page: 1,
            updateModalShow: false,
            bannerRegistShow: false,
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
            bannerData: {},
            totalPrice: 0,
            mobileModalShow: false,
            mobileSuggestShow: false,
            mobileSearchShow: false,

        }
    },
    created() {
        if (this.$isMobile()) {
            this.mobileView = true;
            this.mobileClass = 'mobile'
            this.setClass('sub')
            this.setTitle('광고 이용자 관리');
            this.setBackUrl('');
        }
        let memberInfo = AUTH.getSession(this.$isMobile());
        if (memberInfo.AUTHTOKEN) {
            this.uno = memberInfo.no;
            this.uid = memberInfo.uid;
        }
        this.$eventBus.$on('bannerPaymentClose', this.bannerPaymentClose);
        this.getServerData('init');

    },
    methods: {
        ...mapActions('mobile', ["setClass", "setTitle", "setBackUrl"]),
        getServerData(cmd) {
            this.orgDataList = [];
            const frm = new FormData()
            frm.append('uno', this.uno)
            apiService.post(API_URL_BANNER_USER_PAYMENT_LIST, frm, (res) => {
                if (res.list.length > 0) {
                    this.serverDataList = res.list;
                    let totalPrice = 0;
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
                        if (item.settle == 'yes') {
                            item.settleName = '정산완료';
                        } else {
                            item.settleName = '미정산';
                        }
                        if (item.paymentResult == 'yes' && item.status == 'end' && item.settle != 'yes') {

                            totalPrice += parseInt(item.price);
                        }
                        this.orgDataList.push(item);
                    }
                    this.totalPrice = UTIL.numberFormat(totalPrice);
                    if (cmd == 'init') {
                        this.getData(1);
                    } else {
                        this.search();
                    }

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
        search() {
            if(this.mobileView) {
                this.mobileModalHide();

            }
            this.orgDataList = [];
            this.serverDataList.filter(data => {
                let result = false;
                let keywordResult = false;
                if (this.keyword) {
                    switch (this.cmd) {
                        case 'name':
                            keywordResult = data.name.includes(this.keyword)
                            break;
                        case 'uid':
                            keywordResult = data.uid.includes(this.keyword)
                            break;
                    }
                }
                if (this.keyword) {
                    if (keywordResult) result = true;
                    else result = false;
                } else result = true;

                if (this.stdate) {
                    if (!data.rdate) {
                        result = false;
                    } else {
                        let stDataVal = this.stdate.split('-');
                        let stDate = new Date(stDataVal[0], parseInt(stDataVal[1]) - 1, stDataVal[2]);

                        let rDataVal = data.rdate.split('-');
                        let rDate = new Date(rDataVal[0], parseInt(rDataVal[1]) - 1, rDataVal[2]);

                        if (rDate >= stDate) {
                            result = true;
                        } else result = false;
                    }
                }
                if (this.endate) {
                    if (!data.rdate) {
                        result = false;
                    } else {
                        let enDataVal = this.endate.split('-');
                        let enDate = new Date(enDataVal[0], parseInt(enDataVal[1]) - 1, enDataVal[2]);

                        let rDataVal = data.rdate.split('-');
                        let rDate = new Date(rDataVal[0], parseInt(rDataVal[1]) - 1, rDataVal[2]);

                        if (rDate <= enDate) {
                            result = true;
                        } else result = false;
                    }
                }
                if (result) {
                    this.orgDataList.push(data);
                }
            })
            this.orgDataList = _.orderBy(this.orgDataList, 'no', 'desc');
            this.getData(1);
        },
        showDetail(item) {
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
        showBannerRegist() {
            this.bannerData = '';
            this.updateModalShow = true;
            this.bannerRegistShow = true;
        },
        modifyBanner(item) {
            this.bannerData = item;
            this.updateModalShow = true;
            this.bannerRegistShow = true;
        },
        bannerModalHide(cmd) {
            this.updateModalShow = false;
            if (cmd == 'reload') {
                this.getServerData('reload')
            }
        },
        activeBanner(no) {
            this.doAction(no, 'yes');
        },
        stopBanner(no) {
            this.doAction(no, 'no');
        },
        doAction(no, cmd) {
            let msg = (cmd == 'yes') ? '실행' : '중지';
            let params = {
                type: 'confirm',
                message: '선택된 광고를 ' + msg + ' 하시겠습니까?',
                doAction: () => {
                    this.$eventBus.$emit('overlay', 'show');
                    const frm = new FormData()
                    frm.append('no', no)
                    frm.append('gview', cmd)
                    apiService.post(API_URL_BANNER_USER_UPDATE_GIVEW, frm, (res) => {
                        this.$eventBus.$emit('overlay', 'hide');
                        this.getServerData('reload')
                    });
                }
            };
            this.$eventBus.$emit('modalOpen', params);

        },
        requireSettle() {
            let contparams = {
                type: 'confirm',
                message: this.totalPrice + '원 정산을 진행 시겠습니까?',
                doAction: () => {
                    this.$eventBus.$emit('overlay', 'show');
                    const frm = new FormData()
                    apiService.post(API_URL_BANNER_USER_REQUIRED_SETTLE, frm, (res) => {
                        this.$eventBus.$emit('overlay', 'hide');
                        let msg = (res.msg == 'succ') ? '정산 신청이 완료되었습니다' : '신청할 미정산 내역이 존재하지 않습니다.<br>(진행사항이 종료가 되었고 결제가 완료인 경우에만 정산 신청을 할 수 있습니다)';
                        let params = {
                            message: msg,
                        };
                        this.$eventBus.$emit('modalOpen', params);
                        this.getServerData('reload')
                    });
                }
            }
            this.$eventBus.$emit('modalOpen', contparams);

        },
        setBannerPaymentFrame(params) {
            this.updateModalShow = false;
            this.bannerRegistShow = false;
            this.paymentFrameShow = true;
            let device = (this.mobileView)?'m':'pc';
            this.paymentFrameSrc = '/api/danalPayment/bannerPayment?orderId=' + params.orderId + '&device='+device+'&name=' + params.name + '&email=' + params.email + '&itemName=' + params.itemName;

        },
        bannerPaymentClose(cmd) {
            this.paymentFrameShow = false;
            this.paymentFrameSrc = '';
            let params = {};
            switch (cmd) {
                case 'succ':
                    params = {
                        message: '광고가 신청되었습니다',
                        doAction: () => {
                            this.getServerData('reload')
                        }
                    };
                    this.$eventBus.$emit('modalOpen', params);
                    break;
                case 'fail':
                    params = {
                        message: '결제에 실패하였습니다',
                    };
                    this.$eventBus.$emit('modalOpen', params);
                    break;

            }
        },
        mobileModalOpen(cmd) {
            this.mobileModalShow = true;
            switch (cmd) {
                case 'search':
                    this.mobileSearchShow = true;
                    this.mobileSuggestShow = false;
                    break;
                default:
                    this.mobileSearchShow = false;
                    this.mobileSuggestShow = true;
                    break;

            }
        },
        mobileModalHide() {
            this.mobileModalShow = false;
            this.mobileSearchShow = false;
            this.mobileSuggestShow = false;

        }

    },
    beforeDestroy() {
        this.$eventBus.$off('bannerPaymentClose');

    },

}
</script>
<style lang="scss" scoped>
.contents {
    .req-button {
        position: relative;

        .req-button-box {
            position: absolute;
            right: 10px;
            top: -47px;
            display: flex;

            .active-button {
                background: #686EFB;
                border-radius: 0;
                color: #fff;
                height: 43px;
                margin-left: 10px;

                &:first-child {
                    background: #fafafa;
                    color: #000;
                    border: solid 1px #dcdcdc;
                }
            }
        }
    }

    .search-box {
        margin: 20px 0 10px 0;
        display: flex;
        position: relative;

        .date-box {
            width: 160px;
            margin: 0 5px 0 0;
            display: flex;

            i {
                position: relative;
                z-index: 10;
                margin: 13px 0 0 -25px;
            }
        }

        .select-box {
            margin: 0 5px 0 30px;
            width: 130px;
        }

        .text-box {
            width: 300px;
            display: flex;

            i {
                position: relative;
                z-index: 10;
                margin: 13px 0 0 -25px;
            }
        }

        .data-remove-box {
            position: absolute;
            display: flex;
            right: 0;

            .btn {
                width: 80px;
                background: #f4f4f4;
                border: solid 1px #C6C6C6;
                color: #000;
                height: 40px;
                border-radius: 0;
                margin-left: 10px;

            }

            .excel-btn {
                width: 120px;
                height: 40px;
                background: #1B7444;
                color: #fff;
                border-radius: 0;
                margin-left: 10px;

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

                .gray-button {
                    background: #f4f4f4;
                    border: solid 1px #dcdcdc;
                    border-radius: 0;

                    &.a {
                        margin-right: 10px;
                    }
                }

                .active-button {
                    background: #686EFB;
                    border-radius: 0;
                    color: #fff;
                }
            }
        }
    }

    .settleyes {
        color: #55C579;
    }

    .empty-data {
        height: 150px;
        text-align: center;
        line-height: 150px;
        font-size: 10pt;
        color: #000;
        border-bottom: solid 1px #dcdcdc;
    }
}

.mobile-contents {
    padding:0 15px;
    .fixed-top {
        position: fixed;
        top: 0;
        right: 20px;
        z-index: 132;
        width: 50px;

        .top-button {
            display: flex;
            width: 100%;
            justify-content: space-between;
            padding: 0;

            li {
                padding-top: 8px;
                color: #fff;

                &:first-child {
                    font-size: 14pt;
                }

                &:last-child {
                    padding-top: 10px;
                }
            }
        }
    }
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
    .empty-data {

        height: 150px;
        text-align: center;
        line-height: 150px;
        font-size: 10pt;
        color: #000;
        border-bottom: solid 1px #dcdcdc;
    }
}
.mobile-modal-layout {
    background:#fff;
    padding:10px;
    .close-box {
        text-align:right;
        font-size:15pt;
    }
    .req-button-box {
        padding:0;
        li {
            padding:0 0 10px 10px;

        }
    }
    .search-box {
        padding:0 10px;
        .submit-button {
            width:calc(100% + 40px);
            margin:0 0 -10px -20px;
            background:#686EFB;
            height:50px;
            color:#fff;
            border-radius:0;
        }
    }


}

.detail-container {
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

#my-screenLayout {
    width: 100%;
    height: calc(100vh);
    top: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.5);
    position: fixed;
    z-index: 1000000;

    #my-bannerPaymentFrameBox {
        width: 660px;
        height: 495px;
        margin: 150px auto 0 auto;
        background: #fff;
    }
}
.myPaymentFrameLayout {
    &.mobile {
        width: 100%;
        height: calc(100vh);
        top: 0;
        left: 0;
        background: rgba(0, 0, 0, 0.5);
        position: fixed;
        z-index: 1000000;

        #my-bannerPaymentFrameBox {
            width:100%;
            min-height: calc(100vh);
            margin:0;
            background: #fff;
        }
    }
}
.screenBox {
    z-index: 1000001;
    width:100%;
    height:calc(100vh);
    position:fixed;
    top:0;
    left:0;
    background:#fff;
    .mobile-header {
        width: 100%;
        background: #141A2C;
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
</style>