<template>
    <div :class="'page-container '+mobileClass">

        <div class="contents">
            <div class="from-box">
                <div class="input-header">
                    <div class="title-box">
                        챗봇 사용
                    </div>
                    <div class="switch-box">
                        <v-switch
                            color="#F2554C"
                            v-model="use"
                            value="yes"
                            inset
                        ></v-switch>
                    </div>
                </div>
                <!--div class="item-title">
                    버튼명
                </div>
                <div class="input-header">
                    <div class="field-input">
                        <input type="text"
                                v-model="name"
                                placeholder="버튼명을 입력하세요"
                                @blur="nameTouch()"
                        ></input>
                    </div>
                </div-->
                <div class="button-box">
                    <div class="item-title">
                        질답 설정
                    </div>
                    <div class="excel-button-box" id="excel-button-box">
                        <v-btn
                            type="button"
                            class="upd-button" @click="addData">
                            추가
                        </v-btn>
                        <v-btn
                            type="button"
                            @click="excelDown"
                            class="excel-button">
                            엑셀양식 다운로드
                        </v-btn>
                        <v-btn
                            type="button"
                            @click="excelUpload"
                            class="excel-button">
                            엑셀양식 업로드
                        </v-btn>
                        <input type="file" @change="readExcel" style="display:none" ref="excelfile"
                               accept=".xls,.xlsx">

                    </div>
                    <div class="excel-button-box-mobile" v-if="mobileView">
                        <i class="fas fa-ellipsis-v" @click="showButtonOpen()"></i>
                    </div>

                </div>
                <ul class="list-table">
                    <li v-for="(item,index) in dataList">
                        <div class="text-field">
                            <input type="text"
                                   v-model="item.question"
                                   placeholder="질문을 입력하세요"
                                   @blur="questionTouch(index)"

                            />
                            <input type="text"
                                   v-model="item.answer"
                                   placeholder="답변을 입력하세요"
                                   @blur="answerTouch(index)"
                                   outlined
                            />
                        </div>
                        <div class="del-box">
                            <i class="fas fa-trash-alt" @click="deleteData(index)"></i>
                        </div>
                    </li>
                </ul>
            </div>

        </div>
        <table id="excelTable" style="display:none;">
            <tr>
                <th>질문</th>
                <th>답변</th>
            </tr>
            <tr v-for="(item,index) in dataList">
                <td>{{ item.question }}</td>
                <td>{{ item.answer }}</td>
            </tr>
        </table>
    </div>
</template>


<script>
import {mapActions, mapGetters} from "vuex";
import {
    API_URL_LINK_CHATBOT_UPDATE, API_URL_LINK_LINK_CHATBOT_LIST
} from '../../../../api/urls';
import apiService from '../../../../api/apiService';
import JQ from 'jquery'
import XLSX from 'xlsx'

export default {
    name: 'linkMainChatbot',
    computed: {
        ...mapGetters('link', ["getChatbotUse", "getChatbotList", "getServerFlag", "getChatbotServerFlag"]),
    },
    watch: {
        getServerFlag(val) {
            if (val) {
                this.setUseData();
            }
        },
        getChatbotServerFlag(val) {
            if (val) {
                this.setListData();
            }
        },
        use(val) {
            let check = false;
            for (let item of this.dataList) {
                if (item.question && item.answer) {
                    check = true;
                }
            }
            if (!check && val && this.dataList.length < 1) {
                this.addData()
            }
            this.useSubmit(val)

        }
    },
    data() {
        return {
            insertFlag: false,
            dataList: [],
            mobileView: false,
            mobileClass: '',
            name: '',
            use: 'yes',
        }
    },
    created() {
        if (this.$isMobile()) {
            this.mobileView = true;
            this.mobileClass = 'mobile'
        }
        if (this.getServerFlag) {
            this.setUseData();
        }
        if (this.getChatbotServerFlag) {
            this.setListData();
        }

    },
    methods: {
        ...mapActions('link', ["setChatbotUse", "setChatbotList"]),
        setUseData() {
            this.use = (this.getChatbotUse == 'yes') ? 'yes' : '';

        },
        setListData() {
            if (this.getChatbotList) {
                for (let item of this.getChatbotList) {
                    this.dataList.push(item)
                }

            }

        },
        addData() {
            let item = {question: '', answer: ''}
            this.dataList.unshift(item)
        },
        questionTouch(index) {
            this.validate(index);
        },
        answerTouch(index) {
            this.validate(index);
        },
        nameTouch() {
            // this.validate();
        },
        deleteData(index) {
            let item = this.dataList[index]
            if (item.question && item.answer) {
                let params = {
                    type: 'confirm',
                    message: '삭제하시겠습니까?',
                    doAction: () => {
                        if (this.insertFlag) return;
                        this.insertFlag = true;
                        const frm = new FormData()
                        frm.append('idx', item.idx)
                        frm.append('action', 'delete')
                        this.$eventBus.$emit('overlay', 'show');
                        apiService.post(API_URL_LINK_CHATBOT_UPDATE, frm, (res) => {
                            this.$eventBus.$emit('overlay', 'hide');
                            if (res.result == 'succ' && res.data.result) {
                                this.dataList.splice(index, 1)
                                this.setChatbotList(this.dataList)
                            }
                            this.insertFlag = false;

                        })

                    }
                }
                this.$eventBus.$emit('modalOpen', params)
            } else {
                this.dataList.splice(index, 1)
            }


        },
        showButtonOpen() {
            JQ('#excel-button-box').toggle();
        },
        validate(index) {
            let item = this.dataList[index];
            if (item.question && item.answer) {
                this.formSubmit(item, index);
            }
        },
        formSubmit(sendData, index) {
            if (this.insertFlag) return;
            this.insertFlag = true;
            const frm = new FormData()
            frm.append('question', sendData.question)
            frm.append('answer', sendData.answer)
            frm.append('action', 'insert')
            if (sendData.idx) {
                frm.append('idx', sendData.idx)
            }
            apiService.post(API_URL_LINK_CHATBOT_UPDATE, frm, (res) => {
                if (res.result == 'succ' && res.data.result) {
                    if (!sendData.idx) {
                        this.dataList[index].idx = res.data.idx;
                    }
                    this.setChatbotList(this.dataList)
                }
                this.insertFlag = false;

            })
        },
        useSubmit(use) {
            if (this.insertFlag) return;
            this.insertFlag = true;
            const frm = new FormData()
            let useVal = (use) ? 'yes' : 'no';
            frm.append('action', 'use')
            frm.append('use', useVal)
            apiService.post(API_URL_LINK_CHATBOT_UPDATE, frm, (res) => {
                this.setChatbotUse(useVal)
                this.insertFlag = false;

            })
        },
        excelUpload() {
            this.$refs.excelfile.click();
        },
        readExcel(event) {
            let file = event.target.files[0];
            const fileName = file.name;
            const reader = new FileReader();
            let tmpResult = {};
            reader.onload = (e) => {
                let data = e.target.result;
                data = new Uint8Array(data);
                let excelFile = XLSX.read(data, { type: "array" });

                excelFile.SheetNames.forEach(function (sheetName) {
                    const roa = XLSX.utils.sheet_to_json(excelFile.Sheets[sheetName], {header: 1});
                    if (roa.length) tmpResult[sheetName] = roa;
                });
                this.serverUpload(tmpResult.Sheet1);
            };
            reader.readAsArrayBuffer(file);

        },
        serverUpload(list) {
            this.$refs.excelfile.value = null;
            if (list) {
                if (this.insertFlag) return;
                this.insertFlag = true;
                let excelList = [];
                for(let key in list) {
                    if(key>0) {
                        if(list[key][0] && list[key][1]) {
                            excelList.push({question: list[key][0], answer: list[key][1]})
                        }
                    }
                }
                if(excelList.length>0) {
                    const frm = new FormData()
                    frm.append('action', 'multiInsert')
                    frm.append('data', JSON.stringify(excelList))
                    this.$eventBus.$emit('overlay', 'show');
                    apiService.post(API_URL_LINK_CHATBOT_UPDATE, frm, (res) => {
                        this.$eventBus.$emit('overlay', 'hide');
                        this.insertFlag = false;
                        this.getInitData();

                    })
                } else {
                    let params = {
                        message: '엑셀파일을 확인하세요',
                    };
                    this.$eventBus.$emit('modalOpen', params);
                }
            }
        },
        getInitData() {
            const frm = new FormData()
            apiService.post(API_URL_LINK_LINK_CHATBOT_LIST, frm, (res) => {
                if (res.result == 'succ') {
                    this.setChatbotList(res.list)
                    for (let item of res.list) {
                        this.dataList.push(item)
                    }
                }
            })
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

            var fileName = '챗봇질의응답.xls';
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
.page-container {
    width: 100%;
    display: flex;
    min-height: calc(100vh);
    background: #F4F4F4;

    .contents {
        .from-box {
            width: 880px;

            .item-title {
                font-size: 18px;
                font-weight: 600;
                color: #333;
                margin-bottom: 6px;
            }

            .input-header {
                display: flex;
                justify-content: space-between;
                width: 100%;
                height: 56px;
                border-radius: 5px;
                background: #fff;
                padding: 16px 18px;
                margin-bottom: 54px;

                .field-input {
                    padding: 0;
                    width: 100%;

                    input[type="text"] {
                        margin-top: -6px;
                        width: 100%;
                        background: #fff;
                        border: none;
                        height: 40px;

                        &:focus {
                            outline: none;
                        }

                    }
                }

                .title-box {
                    color: #333;
                    font-size: 16px;
                    font-weight: 600;
                }

                .switch-box {
                    margin-top: -20px;
                    text-align: right;
                }
            }

            .button-box {
                display: flex;
                justify-content: space-between;

                .excel-button-box {
                    text-align: right;

                    .excel-button {
                        background: #1C653E;
                        border-radius: 6px;
                        color: #fff;
                        margin-left: 10px;
                        height: 36px;
                    }

                    .upd-button {
                        background: #F2554C;
                        border-radius: 6px;
                        color: #fff;
                        height: 36px;

                    }
                }
            }

            .list-table {
                margin-top: 20px;
                padding: 0 0 20px 0;
                width: 100%;

                li {
                    background: #fff;
                    padding: 14px 18px;
                    display: flex;
                    display: flex;
                    border-radius: 6px;
                    justify-content: space-between;
                    margin-bottom: 20px;

                    .text-field {
                        width: 809px;

                        input[type="text"] {
                            padding-left: 10px;
                            width: 100%;
                            background: #686EFB0F 0% 0% no-repeat padding-box;
                            border: 1px solid #DCDCDC;
                            height: 45px;

                            &:first-child {
                                margin-bottom: 8px;
                            }

                        }
                    }

                    .del-box {
                        padding-top: 35px;
                        text-align: center;
                        color: #999;
                        font-size: 14pt;
                        cursor: pointer;

                    }
                }
            }
        }
    }

    &.mobile {
        width: 100%;
        display: block;
        min-height: 300px;

        .contents {
            .from-box {
                width: 100%;

                .item-title {
                    font-size: 18px;
                    font-weight: 600;
                    color: #333;
                    margin-bottom: 6px;
                }

                .input-header {
                    display: flex;
                    justify-content: space-between;
                    width: 100%;
                    height: 56px;
                    border-radius: 5px;
                    background: #fff;
                    padding: 16px 18px;
                    margin-bottom: 54px;

                    .field-input {
                        padding: 0;
                        width: 100%;

                        input[type="text"] {
                            margin-top: -6px;
                            width: 100%;
                            background: #fff;
                            border: none;
                            height: 40px;

                            &:focus {
                                outline: none;
                            }

                        }
                    }

                    .title-box {
                        color: #333;
                        font-size: 16px;
                        font-weight: 600;
                    }

                    .switch-box {
                        margin-top: -20px;
                        text-align: right;
                    }
                }

                .button-box {
                    position: relative;
                    color: #999;

                    i {
                        font-size: 16pt;
                        margin-top: 3px;
                    }

                    .excel-button-box {
                        display: none;
                        text-align: right;
                        width: 200px;
                        padding: 20px;
                        background: #fff;
                        border-radius: 5px;
                        border: solid 1px #ccc;
                        position: absolute;
                        right: 0;
                        top: 30px;

                        .excel-button {
                            width: 100%;
                            margin: 10px 0 0 0;

                        }

                        .upd-button {
                            width: 100%;

                        }
                    }
                }

                .list-table {
                    margin-top: 5px;
                    padding: 0 0 20px 0;
                    width: 100%;

                    li {
                        .text-field {
                            width: 100%;

                        }

                        .del-box {
                            padding-left: 15px;
                        }
                    }
                }
            }
        }

    }

}


</style>