<template>
    <div class="mypage-container">
        <div :class="'contents '+mobileClass">

            <div v-if="!mobileView" class="stitle">
                <span>나의 팬 정보 보기</span>
            </div>
            <div v-if="!mobileView" class="title-desc">나를 구독하는 팬의 정보를 볼 수 있습니다.</div>

            <div class="search-box" v-if="!mobileView">
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
                                label="구독신청일"
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
                                label="구독신청일"
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
                        v-model="regAuth"
                        :items="regAuthItems"
                        label="모임개설여부"
                        outlined
                        dense
                    ></v-select>

                </div>

                <div class="select-box">
                    <v-select
                        v-model="cmd"
                        :items="searchItems"
                        label="검색어타입"
                        outlined
                        dense
                    ></v-select>

                </div>
                <div class="text-box">
                    <v-text-field
                        v-model="keyword"
                        label="검색어"
                        outlined
                        dense
                    ></v-text-field>
                    <i class="fas fa-search"></i>
                </div>
                <div class="data-remove-box">

                    <v-btn
                        class="btn"
                        depressed
                        @click="denyUser('no')"
                    >
                        차단처리
                    </v-btn>
                    <v-btn
                        class="btn"
                        depressed
                        @click="denyUser('yes')"
                    >
                        차단해제
                    </v-btn>

                    <v-btn
                        class="btn meet-button"
                        depressed
                        @click="setRegAuth('yes')"
                    >
                        모임개설허용
                    </v-btn>
                    <v-btn
                        class="btn meet-button"
                        depressed
                        @click="setRegAuth('no')"
                    >
                        모임개설해제
                    </v-btn>
                    <v-btn
                        depressed
                        class="excel-btn"
                        @click="downExcel()"
                    >
                        엑셀 다운로드
                    </v-btn>
                </div>
            </div>
            <div class="data-remove-box" v-else>

                <v-btn
                    class="btn"
                    depressed
                    @click="denyUser('no')"
                >
                    차단처리
                </v-btn>
                <v-btn
                    class="btn"
                    depressed
                    @click="denyUser('yes')"
                >
                    차단해제
                </v-btn>

                <v-btn
                    class="btn meet-button"
                    depressed
                    @click="setRegAuth('yes')"
                >
                    모임개설허용
                </v-btn>
                <v-btn
                    class="btn meet-button"
                    depressed
                    @click="setRegAuth('no')"
                >
                    모임개설해제
                </v-btn>

            </div>
            <table class="list-table" id="follower-excelTable" v-if="!mobileView">
                <thead>
                <tr>
                    <th style="width:80px;text-align:center;" v-if="!excelDownFlag">
                        <v-checkbox style="margin:-3px auto 0 auto;width:20px;height:20px;padding:0;"
                                    v-model="checkboxAll"
                                    label=""
                        ></v-checkbox>
                    </th>
                    <th style="width:80px">
                        번호
                    </th>
                    <th>
                        아이디
                    </th>
                    <th>
                        이름

                    </th>
                    <th>
                        이메일
                    </th>
                    <th>
                        연락처
                    </th>
                    <th>
                        구독 신청일
                    </th>
                    <th>
                        개인정보 활용동의
                    </th>
                    <th>
                        차단 처리
                    </th>
                    <th>
                        모임개설여부
                    </th>
                </tr>
                </thead>
                <tbody>
                <tr
                    v-for="item in dataList"
                    :key="item.no"
                >
                    <td style="text-align:center;" v-if="!excelDownFlag">
                        <v-checkbox style="margin:-3px auto 0 auto;width:20px;height:20px;padding:0;"
                                    v-model="nos[item.no]"
                        ></v-checkbox>
                    </td>
                    <td>{{ item.num }}</td>
                    <td>{{ item.uid }}</td>
                    <td>{{ item.unick }}</td>
                    <td>{{ item.email }}</td>
                    <td>{{ item.pcs }}</td>
                    <td>{{ item.rdate }}</td>
                    <td>{{ item.support }}</td>
                    <td>{{ item.deny }}</td>
                    <td>{{ item.regAuthView }}</td>
                </tr>
                </tbody>
            </table>
            <ul class="listUl" v-else>
                <li v-for="item in dataList" :key="item.no">
                    <div class="checkbox" v-if="!excelDownFlag">
                        <v-checkbox style="margin:-3px auto 0 auto;width:20px;height:20px;padding:0;"
                                    v-model="nos[item.no]"
                        ></v-checkbox>

                    </div>
                    <div class="left-gox">
                        <div class="bj">{{ item.unick }}({{ item.uid }})</div>
                        <div class="date">{{ item.email }} ({{item.pcs}})</div>

                    </div>
                    <div class="right-box">
                        <div class="status">개인정보 활용동의: {{ item.support }}</div>
                        <div class="price">차단 처리: {{ item.deny }}</div>
                        <div class="payResult">모임개설여부:{{ item.regAuthView }}</div>

                    </div>
                </li>
            </ul>
            <div v-if="dataList.length<1" class="empty-data">
                데이타가 존재하지 않습니다
            </div>
            <div class="text-center pt-2" v-if="!mobileView">
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
    </div>
</template>


<script>
import JQ from 'jquery'
import {
    API_URL_READ_USER_LIST,
    API_URL_READ_USER_DENY,
    API_URL_READ_USER_REGAUTH
} from '../../../api/urls';
import apiService from '../../../api/apiService';
import paganation from '../../../components/paganation'
import AUTH from '../../../api/auth'
import {mapActions} from "vuex";

export default {
    name: 'myFollower',
    components: {
        paganation
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
        stdate(val) {
            this.search()
        },
        endate(val) {
            this.search()
        },
        cmd() {
            this.keyword = '';
            this.search()
        },
        keyword() {

            this.search()
        },
        regAuth() {

            this.search()
        },


    },
    data() {
        return {
            mobileView: false,
            mobileClass: '',
            uno: '',
            page: 1,
            nos: {},
            pageCount: 5,
            keyword: '',
            cmd: 'name',
            checkboxAll: false,
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
                {value: 'uid', text: '아이디'}
            ],
            serverDataList: [],
            excelDownFlag: false,
            regAuth: '',
            regAuthItems: [
                {value: '', text: '전체'},
                {value: 'yes', text: '개설허용'},
                {value: 'no', text: '개설불가'}
            ],
            ownerUid: '',

        }
    },
    created() {
        if (this.$isMobile()) {
            this.mobileView = true;
            this.mobileClass = 'mobile'
            this.setClass('sub')
            this.setTitle('나의 팬정보 보기');
            this.setBackUrl('');
        }
        let memberInfo = AUTH.getSession(this.$isMobile());
        if (memberInfo.AUTHTOKEN) {
            this.uno = memberInfo.no;
            this.ownerUid = memberInfo.uid;
        }
        this.getServerData();

    },
    methods: {
        ...mapActions('mobile', ["setClass", "setTitle", "setBackUrl"]),
        getServerData() {
            this.orgDataList = [];
            const frm = new FormData()
            frm.append('uno', this.uno)
            frm.append('ownerUid', this.ownerUid)
            apiService.post(API_URL_READ_USER_LIST, frm, (res) => {
                //	console.log(res)
                if (res.list.length > 0) {

                    this.serverDataList = res.list;
                    for (let item of this.serverDataList) {
                        if (item.auth == 'yes') item.deny = 'X';
                        else item.deny = 'O';
                        if (item.supportMyInfo == 'yes') item.support = 'O'
                        else item.support = 'X';

                        if (item.regAuth == 'yes') item.regAuthView = 'O'
                        else item.regAuthView = 'X';

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
        search() {
            this.orgDataList = [];
            this.serverDataList.filter(data => {
                let result = true;
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
                            if (result) result = true;
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
                            if (result) result = true;
                        } else result = false;
                    }
                }
                if (this.regAuth) {
                    if (this.regAuth == data.regAuth) {
                        if (result) result = true;
                    } else {
                        result = false;
                    }
                }
                if (result) {
                    this.orgDataList.push(data);
                }
            })
            this.orgDataList = _.orderBy(this.orgDataList, 'no', 'desc');
            this.getData(1);
        },
        downExcel() {
            this.excelDownFlag = true;

        },
        denyUser(cmd) {
            let flag = false;

            let sendNos = [];
            for (let no in this.nos) {
                if (this.nos[no]) {
                    flag = true;
                    sendNos.push(no);
                }
            }
            if (!flag) {
                let params = {
                    message: '대상을 하나 이상 선택하세요',
                };
                this.$eventBus.$emit('modalOpen', params);
                return;
            }
            let msg = (cmd == 'yes') ? '차단해제' : '차단처리';
            let params = {
                type: 'confirm',
                message: '선택된 대상을 ' + msg + ' 하시겠습니까?',
                doAction: () => {

                    this.$eventBus.$emit('overlay', 'show');
                    const frm = new FormData()
                    frm.append('nos', JSON.stringify(sendNos))
                    frm.append('deny', cmd)
                    apiService.post(API_URL_READ_USER_DENY, frm, (res) => {
                        //	console.log(res)
                        this.dataList = [];
                        this.$eventBus.$emit('overlay', 'hide');
                        this.getServerData();
                    });
                }
            };
            this.$eventBus.$emit('modalOpen', params);


        },
        setRegAuth(cmd) {
            let flag = false;
            let sendNos = [];
            for (let no in this.nos) {
                if (this.nos[no]) {
                    flag = true;
                    sendNos.push(no);
                }
            }
            if (!flag) {
                let params = {
                    message: '대상을 하나 이상 선택하세요',
                };
                this.$eventBus.$emit('modalOpen', params);
                return;
            }
            let msg = (cmd == 'yes') ? '모임개설허용' : '모임개설해제';
            let params = {
                type: 'confirm',
                message: '선택된 대상을 ' + msg + ' 하시겠습니까?',
                doAction: () => {

                    this.$eventBus.$emit('overlay', 'show');
                    const frm = new FormData()
                    frm.append('nos', JSON.stringify(sendNos))
                    frm.append('regAuth', cmd)
                    apiService.post(API_URL_READ_USER_REGAUTH, frm, (res) => {
                        //	console.log(res)
                        this.dataList = [];
                        this.$eventBus.$emit('overlay', 'hide');
                        this.getServerData();
                    });
                }
            };
            this.$eventBus.$emit('modalOpen', params);
        }
    },
    updated() {
        if (this.excelDownFlag) {
            let tab_text = '<html xmlns:x="urn:schemas-microsoft-com:office:excel">';
            tab_text = tab_text + '<head><meta http-equiv="content-type" content="application/vnd.ms-excel; charset=UTF-8">';
            tab_text = tab_text + '<xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet>'
            tab_text = tab_text + '<x:Name>Sheet</x:Name>';
            tab_text = tab_text + '<x:WorksheetOptions><x:Panes></x:Panes></x:WorksheetOptions></x:ExcelWorksheet>';
            tab_text = tab_text + '</x:ExcelWorksheets></x:ExcelWorkbook></xml></head><body>';
            tab_text = tab_text + "<table border='1px'>";
            let exportTable = JQ('#follower-excelTable').clone();
            tab_text = tab_text + exportTable.html();
            tab_text = tab_text + '</table></body></html>';
            let data_type = 'data:application/vnd.ms-excel';
            let ua = window.navigator.userAgent;
            let msie = ua.indexOf("MSIE ");

            var fileName = '나의펜정보.xls';
            //Explorer 환경에서 다운로드
            if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)) {
                if (window.navigator.msSaveBlob) {
                    var blob = new Blob([tab_text], {
                        type: "application/csv;charset=utf-8;"
                    });
                    navigator.msSaveBlob(blob, fileName);
                }
            } else {
                var blob2 = new Blob([tab_text], {
                    type: "application/xls;charset=utf-8;"
                });
                var filename = fileName;
                var elem = window.document.createElement('a');
                elem.href = window.URL.createObjectURL(blob2);
                elem.download = filename;
                document.body.appendChild(elem);
                elem.click();
                document.body.removeChild(elem);
            }
            this.excelDownFlag = false;
        }
    }

}
</script>
<style lang="scss" scoped>
.contents {
    .search-box {
        margin: 20px 0 10px 0;
        display: flex;
        position: relative;

        .date-box {
            width: 130px;
            margin: 0 5px 0 0;
            display: flex;

            i {
                position: relative;
                z-index: 10;
                margin: 13px 0 0 -25px;
            }
        }

        .select-box {
            margin: 0 5px;
            width: 120px;
        }

        .text-box {
            width: 150px;
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
                width: 70px;
                background: #f4f4f4;
                border: solid 1px #C6C6C6;
                color: #000;
                height: 40px;
                border-radius: 0;
                margin-left: 10px;

                &.meet-button {
                    width: 100px;
                    border: none;
                    background: #2199E4;
                    color: #fff;
                }
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
                padding: 10px 0;
                font-size: 11pt;

                .modify-button {
                    border-radius: 20px;
                    min-width: 60px;
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
        padding: 30px 15px;

        .data-remove-box {
            width: 100%;
            display: flex;
            justify-content: space-between;

            .btn {
                width: 60px;
                background: #f4f4f4;
                border: solid 1px #C6C6C6;
                color: #000;
                height: 40px;
                border-radius: 0;
                font-size: 9pt;

                &.meet-button {
                    width: 90px;
                    border: none;
                    background: #2199E4;
                    color: #fff;
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

        .listUl {
            padding:0;
            li {
                padding:15px 0 5px 0;
                border-bottom:solid 1px #dcdcdc;
                display:flex;
                justify-content: space-between;
                .checkbox {
                    width:10%;
                    padding-top:17px;
                }
                .left-gox {
                    padding-left:10px;
                    width:45%;
                    text-align:left;
                    .date {
                        font-size:10px;
                        color:#999;
                    }
                    .bj {
                        font-size:14px;
                        font-weight:bold;

                    }

                }
                .right-box {
                    width:45%;
                    text-align:right;
                    padding-right:10px;
                    .payResult {
                        color:#999;
                        font-size:11px;
                    }
                    .price {
                        font-weight: bold;
                        font-size:11px;
                    }
                    .status {
                        font-size:11px;
                        color:#999;
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
}


</style>