<template>
    <div :class="'mypage-container '+mobileClass">

        <div class="contents">
            <div class="from-box">

                <div class="stitle"><span class="line">{{ examTitle }} -  내역</span></div>
                <div class="data-list-box">
                    <div class="data-list-header">
                        <ul class="th-box">
                            <li>문항</li>
                            <li>정답</li>
                        </ul>
                        <ul class="td-box">
                            <li>{{ info.question }}</li>
                            <li v-if="info.prbType=='mchoice'">{{ info.good }}</li>
                            <li v-if="info.prbType!='mchoice'">{{ info.subjectGood }}</li>
                        </ul>
                    </div>
                    <div class="right-box"><span></span> 오답</div>
                    <div class="data-list-header list-body">
                        <ul class="th-box">
                            <li>이름</li>
                            <li>정답여부</li>
                        </ul>
                        <ul class="td-box" v-for="data in dataList">
                            <li>{{ data.name }}</li>
                            <li :class="'td '+data.result">{{ data.resultView }}</li>
                        </ul>
                    </div>
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
                        <th colspan="2" style="height:50px"> {{ examTitle }} 내역</th>
                    </tr>
                    <tr>
                        <th colspan="2" style="height:50px"></th>
                    </tr>
                    <tr>
                        <th style="height:50px">문항</th>
                        <th style="height:50px">정답</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td style="text-align:center;height:50px">{{ info.question }}</td>
                        <td style="text-align:center;height:50px;" v-if="info.prbType=='mchoice'">{{ info.good }}</td>
                        <td style="text-align:center;height:50px;" v-if="info.prbType!='mchoice'">
                            {{ info.subjectGood }}
                        </td>
                    </tr>
                    </tbody>
                    <thead>
                    <tr>
                        <th colspan="2" style="height:50px"></th>
                    </tr>
                    <tr>
                        <th style="height:40px;width:250px">이름</th>
                        <th style="height:40px;width:250px">정답여부</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="item in exceldataList">
                        <td style="text-align:center;height:30px">{{ item.name }}</td>
                        <td style="text-align:center">{{ item.resultView }}</td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>


<script>
import JQ from 'jquery'
import {
    API_URL_BROADCAST_LIVE_QUIZ_AFTER_USER_REPORT
} from '../../../../api/urls';
import apiService from '../../../../api/apiService';

export default {
    name: 'afterQuizView',
    data() {
        return {
            mobileView: false,
            mobileClass: '',
            dataList: [],
            exceldataList: [],
            examTitle: '',
            pno: '',
            info: {},
        }
    },
    created() {
        if (this.$isMobile()) {
            this.mobileView = true;
            this.mobileClass = 'mobile'
        }
        this.pno = this.$route.params.pno;
        this.getData();
    },
    methods: {
        getData() {
            const frm = new FormData()
            frm.append('pno', this.pno)
            apiService.post(API_URL_BROADCAST_LIVE_QUIZ_AFTER_USER_REPORT, frm, (ret) => {

                this.examTitle = ret.info.question;
                this.info = ret.info;
                let dataList = ret.dataList;
                for (let dt of dataList) {
                    if (dt.result == 'bad') {
                        dt.resultView = 'X';
                    } else dt.resultView = 'O';
                    this.exceldataList.push(dt);
                    this.dataList.push(dt);
                }


            });
        },
        getDataInfo(no) {
            let path = this.$route.path.split('/');
            this.$router.push('/' + path[1] + '/' + this.no + '/examReportView/' + no);
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
        border: solid 1px #DCDCDC;
        background: #F4F4F4;
        width: 100%;
        height: 600px;
        overflow-y: auto;
        overflow-x: hidden;
        margin: 30px 0;
        padding: 50px;

        .data-list-header {
            border: solid 1px #dcdcdc;
            border-radius: 5px;
            padding: 0;
            background: #fff;

            .th-box {
                display: flex;
                background: #E8F4FF;
                border-bottom: solid 1px #dcdcdc;
                padding: 12px 0;
                border-radius: 5px 5px 0 0;

                li {
                    width: 33.33%;
                    text-align: center;
                    font-size: 10pt;
                    color: #000;

                }

            }

            .td-box {
                display: flex;
                padding: 5px 0;

                li {
                    width: 33.33%;
                    text-align: center;
                    font-size: 12pt;
                    color: #000;
                    font-weight: bold;

                    .email {
                        font-size: 9pt;
                        color: #999;
                    }

                    &.jumsu {
                        padding-top: 8px;
                        color: #E31818;

                        span {
                            font-size: 9pt;
                            color: #999;
                        }
                    }

                    &.total {
                        padding-top: 8px;
                        color: #1E90FF;

                        span {
                            color: #000;
                        }
                    }
                }
            }
        }

        .right-box {
            text-align: right;
            font-size: 10pt;
            margin: 20px 0 5px 0;

            span {
                background: #FAD7D7;
                display: inline-block;
                width: 12px;
                height: 12px;
            }
        }

        .data-list {
            width: 100%;

            .list-items {
                margin-bottom: 10px;
                background: #fff;
                border: solid 1px #dcdcdc;
                border-radius: 5px;

                .list-items-ul {
                    display: flex;

                    .list-item {
                        border-right: solid 1px #dcdcdc;
                        text-align: center;

                        &:last-child {
                            border-right: none;
                        }

                        width: 50%;
                        font-size: 10pt;
                        color: #000;

                        .th {
                            padding: 6px 0;
                            background: #E8F4FF;
                            border-bottom: solid 1px #dcdcdc;

                        }

                        .td {
                            font-weight: bold;
                            padding: 12px 0;

                            &.bad {
                                background: #FAD7D7;
                            }
                        }
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
            height: auto;
            overflow-y: visible;
            overflow-x: hidden;
            padding: 15px;

        }

        .button-row {
            width: 100%;
            margin: 40px auto;
            display: flex;
            justify-content: space-between;

            button {
                width: 48%;
                border-radius: 0;
                min-height: 50px;
                margin-right: 0;
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