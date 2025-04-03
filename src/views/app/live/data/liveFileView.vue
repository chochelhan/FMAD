<template>
    <div :class="'exam-content '+mobileClass">
        <div class="title-box" v-if="!mobileView">
            <div class="exam-title">{{subject}}</div>
            <div class="del-box" @click="hideEventBox()"><i class="fas fa-times"></i></div>
        </div>
        <div class="contents">
            <div v-if="hwpShow">
                <div class="file-title">{{subject}}</div>
                <div class="file-button">
                    <v-btn
                        type="button"
                        class="primay-btn"
                        @click="fileDownload()">파일 다운로드
                    </v-btn>
                </div>
                <iframe id="downloadFrame"></iframe>
            </div>
            <div v-else>
                <iframe id="viewFrame" class="data-list-container" frameborder="0">This is an embedded <a
                    target='_blank'
                    href='http://office.com'>Microsoft
                    Office</a> document, powered by <a target='_blank' href='http://office.com/webapps'>Office
                    Online</a>.
                </iframe>
            </div>
        </div>
        <div class="bottom-box"  v-if="!mobileView">
            <v-btn
                type="button"
                class="primay-btn"
                @click="hideEventBox()">닫기
            </v-btn>
        </div>

    </div>
</template>


<script>
	import {
		API_URL_BROADCAST_LIVE_DATA_INFO,
	} from '../../../../api/urls';
	import apiService from '../../../../api/apiService';

	export default {
		name: 'liveFileView',
		props: ["no"],
		data() {
			return {
                mobileView: false,
                mobileClass: '',
				subject: '',
				hwpShow: false,
				filname: '',
			}
		},
		created() {
		  	if (this.$isMobile()) {
				this.mobileView = true;
				this.mobileClass = 'mobile'
			}
			this.getData();
		},

		methods: {
			hideEventBox() {
				this.$emit("hideEvent", {page: 'fileView'});
			},
			getData() {
				const frm = new FormData()
				frm.append('no', this.no)
				apiService.post(API_URL_BROADCAST_LIVE_DATA_INFO, frm, (res) => {
					this.subject = res.info.name;
					if (res.info.ext == 'hwp') {
						this.hwpShow = true;
					} else {
						let hostName = location.hostname;
						let protocol = location.protocol;
						this.filename = protocol + '//' + hostName + res.info.url;

						let frame = document.getElementById('viewFrame');
						frame.setAttribute('src', 'https://view.officeapps.live.com/op/embed.aspx?src=' + this.filname);
					}
				});
			},
			fileDownload() {
				let frame = document.getElementById('downloadFrame');
				frame.setAttribute('src','/api/broadcastData/fileDown?no='+this.no);
            }

		}

	}
</script>
<style lang="scss" scoped>
    ul {
        padding: 0;
    }

    .exam-content {
        width: 1100px;
        height: 700px;
        -webkit-box-shadow: 1px 1px 9px -1px rgba(71, 70, 71, 0.53);
        -moz-box-shadow: 1px 1px 9px -1px rgba(71, 70, 71, 0.53);
        box-shadow: 1px 1px 9px -1px rgba(71, 70, 71, 0.53);
        border-radius: 10px;
        position: absolute;
        left: 50%;
        top: 50%;
        background: #ffffff;
        margin: -350px 0 0 -550px;
        .title-box {
            height: 55px;
            line-height: 55px;
            border-bottom: solid 1px #dcdcdc;
            position: relative;
            .exam-title {
                font-size: 12pt;
                font-weight: bold;
                color: #000;
                text-align: center;
            }
            .del-box {
                cursor: pointer;
                position: absolute;
                right: 15px;
                top: 17px;
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
        .contents {
            background: #f4f4f4;
            padding: 20px;
            height: 580px;
            overflow-y: auto;
            #viewFrame {
                width: 100%;
                height: 540px;
            }
            .file-title {
                text-align:center;
                margin:100px 0 60px 0;
                font-weight:bold;
                color:#000;

            }
            .file-button {
                width: 250px;
                margin:auto;
                .primay-btn {
                    width: 250px;
                    height: 50px;
                    color: #fff;
                    margin: auto;
                    border-radius:0;
                    background: #5E65E3;
                }

            }
            #downloadFrame {
                display:none;
            }

        }

        .bottom-box {
            height: 65px;
            line-height: 65px;
            border-top: solid 1px #dcdcdc;
            display: flex;
            padding: 0 20px;
            font-size: 10pt;
            .primay-btn {
                width: 250px;
                height: 40px;
                color: #fff;
                margin: auto;
                border-radius: 20px;
                background: #5E65E3;
            }

        }
        &.mobile {
            width:100%;
            height:auto;
            -webkit-box-shadow:none;
            -moz-box-shadow:none;
            box-shadow:none;
            border-radius:0;
            position:relative;
            left:0;
            top:0;
            background: #ffffff;
            margin:0;
            .contents {
                background: #f4f4f4;
                padding:20px 15px;
                height:auto;
                overflow-y:visible;
                border-radius: 0;
                ul.exam-list {
                    padding:0;
                    li {
                        width: 100%;
                        height: 45px;
                        line-height: 45px;
                        color: #000;
                        margin:10px 0;
                        border-radius: 10px;
                        padding-left:30px;
                        background: #fff;
                        border: solid 1px #dcdcdc;
                        cursor: pointer;
                        font-size: 11pt;
                        display: flex;
                        .subject {
                            width:80%;
                        }
                        .author {
                            width: 80px;
                        }
                        .timelimit {
                            width: 50px;
                        }
                        &:hover {
                            background: #1E90FF;
                            color: #fff;
                        }
                        &.complete {
                            background:#207245;
                            color:#fff;
                        }
                    }
                }
                .data-list-box {
                    margin-bottom: 20px;
                    .data-list-item {
                        border: solid 1px #DCDCDC;
                        border-radius: 12px;
                        background: #E8F4FF;
                        margin: 20px 0 0 0;
                        .data-list-top {
                            background: #fff;
                            height: 60px;
                            line-height: 60px;
                            border-radius: 12px 12px 0 0;
                            border-bottom: solid 1px #dcdcdc;
                            display: flex;
                            position: relative;
                            .dt-title {
                                width: 85%;
                                text-align: left;
                                font-size: 11pt;
                                color: #000;
                                font-weight: bold;
                                padding-left: 40px;
                            }
                        }
                        .data-list {
                            padding:20px 20px 5px 20px;
                            li {
                                margin-bottom: 10px;
                                height: 45px;
                                padding: 0 5px 0 20px;
                                line-height: 45px;
                                font-size: 11pt;
                                background: #fff;
                                border: solid 1px #dcdcdc;
                                border-radius: 10px;
                                &.active {
                                    background: #2D8CFF;
                                    color: #fff;
                                    span {
                                        border: solid 1px #fff;
                                    }
                                }
                                span {
                                    display: inline-block;
                                    border: solid 1px #999;
                                    width: 16px;
                                    height: 16px;
                                    border-radius: 8px;
                                    line-height: 14px;
                                    text-align: center;
                                    font-size: 8pt;
                                }
                            }
                        }
                        .subjectAnswer {
                            margin: 20px 40px;
                            height: 45px;
                            padding: 0 5px 0 20px;
                            line-height: 45px;
                            font-size: 11pt;
                            background: #fff;
                            border: solid 1px #dcdcdc;
                            border-radius: 10px;
                        }
                    }
                }
            }
            .bottom-box {
                height: 65px;
                line-height: 65px;
                border-top: solid 1px #dcdcdc;
                display:flex;
                padding:0 20px;
                font-size:10pt;
                .author {
                    width:0;
                    padding-left:0;
                }
                .timelimit {
                    width:0;

                }
                .button {
                    width:100%;
                    button {
                        width:100%;
                        height:40px;
                        margin:auto;
                        border-radius:0;
                        color:#fff;
                        background: #5E65E3;
                    }
                }
            }
        }
    }

</style>