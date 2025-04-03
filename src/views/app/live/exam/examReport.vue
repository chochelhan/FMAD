<template>
    <div :class="'mypage-container '+mobileClass">

        <div class="contents">
            <div class="from-box">

                <div class="stitle"><span class="line">{{ examTitle }} -  내역</span></div>
                <div class="data-list-box">
                    <ul class="data-list">
                        <li v-for="data in dataList" @click="getDataInfo(data.no)">
                            <div class="list">
                                <div class="subject">{{ data.name }}</div>
                                <div class="email">{{ data.email }}</div>
                            </div>
                            <div class="list">
                                <div class="jumsu">{{ data.jumsu }}<span>점</span></div>
                                <div class="result">(채점내역 : {{ data.gtotal }}/{{ data.ptotal }})</div>
                            </div>
                        </li>
                    </ul>
                </div>
                <div class="button-row">
                    <v-btn
                        type="button"
                        class="green"
                        @click="excelDown()">엑셀로 다운로드
                    </v-btn>
                    <v-btn
                        type="button"
                        class="submit-button"
                        @click="goList()">목록으로
                    </v-btn>
                </div>
                <table id="excelTable" border="1" style="width:100%;">
                    <thead>
                    <tr>
                        <th colspan="5" style="height:50px"> {{ examTitle }} - 내역 ({{ rdate }})</th>
                    </tr>
                    </thead>
                    <thead>
                    <tr>
                        <th style="height:40px;width:100px">번호</th>
                        <th style="height:40px;width:200px">이름</th>
                        <th style="height:40px;width:200px">이메일</th>
                        <th style="height:40px;width:200px">점수</th>
                        <th style="height:40px;width:200px">채점내역</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(item,idx) in dataList">
                        <td style="text-align:center;height:25px;">{{ idx + 1 }}</td>
                        <td style="text-align:center">{{ item.name }}</td>
                        <td style="text-align:center">{{ item.email }}</td>
                        <td style="text-align:center">{{ item.jumsu }}</td>
                        <td style="text-align:center"> {{ item.gtotal }} &nbsp;/&nbsp;
                            {{ item.ptotal }}
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>

        </div>

    </div>
</template>


<script>
import JQ from 'jquery'
import {mapGetters} from "vuex";
import {
    API_URL_BROADCAST_LIVE_GET_EXAM_USER_LIST
} from '../../../../api/urls';
import apiService from '../../../../api/apiService';

export default {
    name: 'afterReport',
    data() {
        return {
            mobileView: false,
            mobileClass: '',
            gno: '',
            no: '',
            dataList: [],
            examTitle: '',
            rdate: '',
        }
    },
    created() {
        if (this.$isMobile()) {
            this.mobileView = true;
            this.mobileClass = 'mobile'
        }
        this.gno = this.getGno;
        this.no = this.$route.params.examNo;
        this.getData();
    },
    computed: {
        ...mapGetters('etc', ["getGno"]),

    },
    methods: {
        getData() {
            const frm = new FormData()
            frm.append('no', this.no)
            apiService.post(API_URL_BROADCAST_LIVE_GET_EXAM_USER_LIST, frm, (ret) => {

                this.examTitle = ret.info.subject;
                this.dataList = ret.dataList;
                let rdates = ret.info.rdate;
                this.rdate = rdates.substring(1, 10)


            });
        },
        getDataInfo(no) {
            let path = this.$route.path.split('/');
            this.$router.push('/' + path[1] + '/' + this.gno + '/examReportView/' + this.no + '/' + no);
        },
        goList() {
            this.$router.go(-1);
        },
        excelDown() {
            var tab_text = '<html xmlns:x="urn:schemas-microsoft-com:office:excel">';
            tab_text = tab_text + '<head><meta http-equiv="content-type" content="application/vnd.ms-excel; charset=UTF-8">';
            tab_text = tab_text + '<xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet>'
            tab_text = tab_text + '<x:Name>Sheet</x:Name>';
            tab_text = tab_text + '<x:WorksheetOptions><x:Panes></x:Panes></x:WorksheetOptions></x:ExcelWorksheet>';
            tab_text = tab_text + '</x:ExcelWorksheets></x:ExcelWorkbook></xml></head><body>';
            tab_text = tab_text + "<table border='1px'>";
            var exportTable = JQ('#excelTable').clone();
            tab_text = tab_text + exportTable.html();
            tab_text = tab_text + '</table></body></html>';
            var data_type = 'data:application/vnd.ms-excel';
            var ua = window.navigator.userAgent;
            var msie = ua.indexOf("MSIE ");

            var fileName = this.examTitle + '.xls';
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
        }

    },

}
</script>
<style lang="scss" scoped>
ul {
    padding: 0;

    li {

    }
}

.mypage-container {
    .data-list-box {
        margin-top: 30px;
        border: solid 1px #DCDCDC;
        background: #F4F4F4;
        width: 100%;
        height: 580px;
        overflow-y: auto;
        overflow-x: hidden;
        padding: 50px;
        .data-list {
            width: 100%;
            display: flex;
            flex-wrap: wrap;

            li {
                cursor: pointer;
                width: 31%;
                margin: 0 40px 40px 0;
                height: 100px;
                padding: 20px;
                border-radius: 10px;
                background: #fff;
                border: solid 1px #dcdcdc;
                position: relative;
                &:nth-child(3n) {
                    margin-right: 0;
                }

                &:hover {
                    border: solid 1px #2D8CFF;
                }

                display: flex;

                .list {
                    font-size: 9pt;
                    width: 50%;

                    .subject {
                        text-align: left;
                        color: #000;
                        font-size: 16pt;
                        font-weight: bold;
                    }

                    .jumsu {
                        text-align: right;
                        font-size: 16pt;
                        font-weight: bold;
                        color: #E31717;

                        span {
                            font-size: 10pt;
                            font-weight: normal;
                            color: #000;
                        }
                    }

                    .email {
                        margin-top: 5px;
                        text-align: left;
                    }

                    .result {
                        margin-top: 5px;
                        text-align: right;
                        color: #000;
                        font-weight: bold;

                    }
                }

            }
        }

    }

    .button-row {
        width: 630px;
        margin: 40px auto;

        button {
            width: 300px;
            border-radius: 30px;
            min-height: 60px;
            color: #fff;

            &.green {
                margin-right: 30px;
                background: #207245;
                color: #fff;
            }

            &.submit-button {
                background: #686EFB;
            }
        }
    }

    #excelTable {
        display: none;

        th, td {
            text-align: center;
        }
    }

    &.mobile {
        .data-list-box {
            width: 100%;
            height:auto;
            overflow-y: visible;
            overflow-x: hidden;
            padding:15px;
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
                    padding:15px 0 0 10px;
                    border-radius: 10px;
                    position: relative;

                    &:nth-child(2n) {
                        margin-right: 0;
                    }

                    &:nth-child(3n) {
                        margin-right:4%;
                    }

                    &.no-data {
                        margin-right: 0;
                    }
                    display: block;
                    .list {
                        font-size: 9pt;
                        width: 100%;
                        .subject {
                            text-align: left;
                            color: #000;
                            font-size: 12pt;
                            font-weight: bold;
                        }

                        .jumsu {
                            text-align:left;
                            font-size: 12pt;
                            font-weight: bold;
                            color: #E31717;
                            span {
                                font-size: 10pt;
                                font-weight: normal;
                                color: #000;
                            }
                        }

                        .email {
                            margin-top: 5px;
                            text-align: left;
                        }

                        .result {
                            margin-top: 5px;
                            text-align:left;
                            color: #000;
                            font-weight: bold;

                        }
                    }

                }


            }

        }
        .button-row {
            width:100%;
            margin: 40px auto;
            display:flex;
            justify-content: space-between;
            button {
                width: 48%;
                border-radius:0;
                min-height:50px;
                margin-right:0;
                color: #fff;
                &.green {
                    background: #207245;
                    color: #fff;
                }

                &.submit-button {
                    background: #686EFB;
                }
            }
        }
    }
}

</style>