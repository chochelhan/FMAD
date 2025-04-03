<template>
    <div :class="'mypage-container '+mobileClass">

        <div class="contents">
            <div class="from-box">

                <div class="stitle"><span class="line">참가자 개인별 상세 내역</span></div>
                <div class="data-list-box">
                    <ul class="data-list">
                        <li v-for="(data,idx) in dataList" @click="getDataInfo(idx)">
                            <div class="list">
                                <div class="subject">{{ data.name }}</div>
                                <div class="email">{{ data.email }}</div>
                            </div>
                            <div class="list">
                                <div :class="'jumsu '+data.join">{{ data.joinText }}</div>
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
            </div>
            <table id="excelTable" border="1" style="width:100%;">
                <thead>
                <tr>
                    <th colspan="3" style="height:50px"> 참가자 개인별 상세 내역</th>
                </tr>
                </thead>
                <thead>
                <tr>
                    <th style="height:40px;width:100px">번호</th>
                    <th style="height:40px;width:200px">이름</th>
                    <th style="height:40px;width:200px">완료여부</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(item,idx) in dataList">
                    <td style="text-align:center;height:25px;">{{ idx + 1 }}</td>
                    <td style="text-align:center">{{ item.name }}</td>
                    <td style="text-align:center">{{ item.joinText }}</td>

                </tr>
                </tbody>
            </table>
        </div>

    </div>
</template>


<script>
import JQ from 'jquery'
import {mapGetters} from "vuex";
import {
    API_URL_BROADCAST_LIVE_POLL_AFTER_WITH_USER_LIST
} from '../../../../api/urls';
import apiService from '../../../../api/apiService';

export default {
    name: 'afterPollUser',
    data() {
        return {
            mobileView: false,
            mobileClass: '',
            no: '',
            dataList: [],
        }
    },
    created() {
        if (this.$isMobile()) {
            this.mobileView = true;
            this.mobileClass = 'mobile'
        }
        this.no = this.getGno;
        this.getData();
    },
    computed: {
        ...mapGetters('etc', ["getGno"]),

    },
    methods: {
        getData() {
            const frm = new FormData()
            frm.append('gno', this.no)
            apiService.post(API_URL_BROADCAST_LIVE_POLL_AFTER_WITH_USER_LIST, frm, (ret) => {
                let joinUser = {};
                for (let data of ret.dataList) {
                    joinUser[data.uid] = data.no;
                }
                for (let user of ret.userList) {
                    if (joinUser[user.uid]) {
                        user.join = 'join';
                        user.joinText = '완료'
                        user.answerNo = joinUser[user.uid];
                    } else {
                        user.join = '';
                        user.joinText = '미완료'
                    }
                    this.dataList.push(user)
                }

            });
        },
        getDataInfo(idx) {
            let item = this.dataList[idx];
            if (item.join == 'join') {
                let path = this.$route.path.split('/');
                this.$router.push('/' + path[1] + '/' + this.no + '/afterPollUserReport/' + item.answerNo);
            }
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

            var fileName = '참가자 개인별 상세내역.xls';
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
        width: 1150px;
        height: 600px;
        overflow-y: auto;
        overflow-x: hidden;
        margin: 30px 0;
        padding: 50px;

        .data-list {
            width: 100%;
            display: flex;
            flex-wrap: wrap;

            li {
                cursor: pointer;
                width: 30.8%;
                margin: 0 39px 39px 0;
                height: 100px;
                padding: 35px 20px 0 20px;
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
                        color: #999;

                        &.join {
                            color: #E31717;
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
            height: auto;
            overflow-y: visible;
            overflow-x: hidden;
            margin: 30px 0;
            padding: 15px;

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
        .button-row {
            width: 100%;
            margin: 40px auto;
            display:flex;
            justify-content: space-between;
            button {
                width: 48%;
                border-radius:25px;
                min-height:50px;
                color: #fff;

                &.green {
                    margin-right:0;
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