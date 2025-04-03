<template>
    <div  :class="'mypage-container '+mobileClass">

        <div class="contents">
            <div class="from-box">

                <div class="stitle"><span class="line"> 채팅 내역</span></div>
                <div class="data-list-chat-box">
                    <ul>
                        <li v-for="msg in dataList" :class="msg.user">
                            <span class="date">{{msg.time}}</span>
                            <span class="from">{{msg.from}}</span>
                            <span class="msg">{{msg.msg}}</span>
                        </li>
                        <li v-if="dataList.length < 1">
                            <div style="width:100%;text-align:center;color:#000;font-weight: bold;font-size:10pt;">진행한
                                채팅이 없습니다
                            </div>
                        </li>
                    </ul>
                </div>
                <div class="button-row" v-if="dataList.length>0">
                    <v-btn
                        type="button"
                        class="submit-button"
                        @click="download()">TXT 다운로드
                    </v-btn>

                </div>
            </div>

        </div>

    </div>
</template>


<script>
	import JQ from 'jquery'
	import AUTH from '../../../../api/auth';
	import {mapGetters} from "vuex";
	import {
		API_URL_BROADCAST_LIVE_CHAT_AFTER_LIST
	} from '../../../../api/urls';
	import apiService from '../../../../api/apiService';

	export default {
		name: 'afterChat',
		data() {
			return {
				mobileView: false,
				mobileClass: '',
				no: '',
				dataList: [],
				memberInfo:{},
			}
		},
		created() {
            if (this.$isMobile()) {
                this.mobileView = true;
                this.mobileClass = 'mobile'
            }
			this.no = this.getGno;
			this.memberInfo = AUTH.getSession(this.$isMobile());
			this.getData();
		},
		computed: {
			...mapGetters('etc', ["getGno"]),

		},
		methods: {
			getData() {
				const frm = new FormData()
				frm.append('gno', this.no)

				apiService.post(API_URL_BROADCAST_LIVE_CHAT_AFTER_LIST, frm, (ret) => {
					for (let msg of ret.messages) {
						if (msg.from == '나') {
							msg.user = 'me';
							msg.from = this.memberInfo.name;
						}
						msg.time = msg.time.replace('오후', '').replace('오전', '')
						this.dataList.push(msg);
					}


				})
			},
			download() {
				let tab_text = "";
				for (let msg of this.dataList) {
					if (msg.from == '나') {
						msg.from = this.memberInfo.name;
					}
					msg.time = msg.time.replace('오후', '').replace('오전', '')
					tab_text += msg.time + '  ' + msg.from + '  ' + msg.msg + "\r\n";
				}
				var data_type = 'data:text/plain';
				var ua = window.navigator.userAgent;
				var msie = ua.indexOf("MSIE ");

				var fileName = '채팅내역.txt';
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
						type: "text/plain;"
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
    .data-list-chat-box {
        margin-top: 30px;
        background: #F4F4F4;
        border: solid 1px #DCDCDC;
        padding: 40px;
        width: 100%;
        position: relative;

        ul {
            width: 100%;

            li {
                color: #000;
                padding: 10px 0;
                font-size: 10pt;

                &.me {
                    color: #309DD7;
                }

                .noData {
                    width: 100%;
                    text-align: center;
                    padding: 100px 0 0 480px;
                    color: #000;
                    font-weight: bold;
                    border: solid 1px #000;

                }

                span {
                    display: inline-block;

                    &.date {
                        width: 60px;
                    }
                }

                .from {
                    font-weight: bold;
                    padding: 0 20px;
                }

            }
        }

    }

    .button-row {
        width: 100%;
        margin: 40px auto;
        text-align: center;

        button {
            width: 300px;
            border-radius: 40px;
            min-height: 60px;

            &.submit-button {
                background: #686EFB;
                color: #fff;
            }
        }
    }
    &.mobile {
        .data-list-chat-box {
            padding:15px;
            width: 100%;
            position: relative;
            ul {
                width: 100%;
                li {
                    color: #000;
                    padding: 10px 0;
                    font-size: 10pt;
                    &.me {
                        color: #309DD7;
                    }
                    .noData {
                        width: 100%;
                        text-align: center;
                        padding: 100px 0 0 480px;
                        color: #000;
                        font-weight: bold;
                        border: solid 1px #000;

                    }
                    span {
                        display: inline-block;
                        &.date {
                            width: 60px;
                        }
                    }

                    .from {
                        font-weight: bold;
                        padding: 0 20px;
                    }

                }
            }

        }

        .button-row {
            width: 100%;
            margin: 40px auto;
            text-align: center;
            button {
                width:80%;
                border-radius: 40px;
                min-height:50px;
                &.submit-button {
                    background: #686EFB;
                    color: #fff;
                }
            }
        }
    }
}

</style>