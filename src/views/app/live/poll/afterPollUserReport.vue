<template>
    <div :class="'mypage-container '+mobileClass">

        <div class="contents">
            <div class="from-box">

                <div  class="stitle"><span class="line">참가자 개인별 상세 내역 - {{subject}} 상세 내역</span></div>
                <div class="data-list-box">
                    <div class="data-list-item" v-for="(data,idx) in dataList">
                        <table class="data-list">
                            <thead>
                            <tr>
                                <th>문항</th>
                                <th>{{data.question}}</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <td>답변</td>
                                <td class="answer">
                                    {{data.answer}}
                                </td>
                            </tr>
                            </tbody>
                        </table>
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
            </div>
            <table id="excelTable" border="1" style="width:100%;">
                <thead>
                <tr>
                    <th colspan="3" style="height:50px"> 참가자 개인별  상세 내역 - {{subject}} 상세 내역 </th>
                </tr>
                </thead>
                <thead>
                <tr>
                    <th  style="height:40px;width:100px">번호</th>
                    <th  style="height:40px;width:200px">문항</th>
                    <th  style="height:40px;width:200px">답변</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(item,idx) in dataList">
                    <td style="text-align:center;height:25px;">{{idx+1}}</td>
                    <td style="text-align:center">{{item.question}}</td>
                    <td style="text-align:center">{{item.answer}}</td>

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
		API_URL_BROADCAST_LIVE_POLL_AFTER_WITH_USER_INFO
	} from '../../../../api/urls';
	import apiService from '../../../../api/apiService';

	export default {
		name: 'afterPollUserReport',
		data() {
			return {
				mobileView: false,
				mobileClass: '',
				subject: '',
			    totalCount: '',
				gno: '',
                no:'',
				dataList: [],
		 	}
		},
		created() {
            if (this.$isMobile()) {
                this.mobileView = true;
                this.mobileClass = 'mobile'
            }
			this.gno = this.getGno;
			this.no = this.$route.params.userNo;
			this.getData();
		},
		computed: {
			...mapGetters('etc', ["getGno"]),

		},
		methods: {
			getData() {
				const frm = new FormData()
				frm.append('gno', this.gno)
				frm.append('no', this.no)
				apiService.post(API_URL_BROADCAST_LIVE_POLL_AFTER_WITH_USER_INFO, frm, (ret) => {
					this.subject = ret.name;
					let items= {};
					let keynum = '';
					let answer = {};
					let data = {};
					let answerList = [];
					let problems = ret.problems;
					let answers = ret.answers;
					for(let key in problems) {
						answer = answers[key];
						items = problems[key].items;
						data = {};
						data.question = problems[key].question;
						if (problems[key].prbType == 'subject') {
							data.answer = answer.singleAnswer;
						} else {
							if (problems[key].multigood == 'yes') {
								answerList = [];
								for (let ans of answer.multiAnswer) {
									keynum = parseInt(ans) - 1;
									answerList.push(ans + '(' + items[keynum].answer + ')');
								}
								data.answer = answerList.join(', ');

							} else {
								keynum = parseInt(answer.singleAnswer) - 1;
								data.answer = answer.singleAnswer + '(' + items[keynum].answer + ')';
							}
						}
						this.dataList.push(data);
					}

				});
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

				var fileName = '참가자 개인별 상세내역 - ' + this.subject + ' 상세내역.xls';
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
            background: #F4F4F4;
            border: solid 1px #DCDCDC;
            padding: 10px 40px 40px 40px;

            .data-list {
                width: 100%;
                color: #000;
                margin: 30px 0 10px 0;
                font-size: 11pt;

                th {
                    &:first-child {
                        width: 200px;
                        border-right: none;

                    }

                    text-align: center;
                    background: #E8F4FF;
                    border: solid 1px #DCDCDC;
                    height: 40px;
                    line-height: 40px;
                    font-weight: normal;
                }

                tbody tr {
                    td {
                        height: 50px;
                        background: #FFFFFF;
                        border: solid 1px #DCDCDC;
                        border-top: none;
                        text-align: center;

                        &:first-child {
                            border-right: none;
                        }

                        &.answer {
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
    }

</style>