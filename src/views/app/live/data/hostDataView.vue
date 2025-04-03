<template>
    <div :class="'exam-content '+mobileClass">
        <div class="title-box" v-if="!mobileView">
            <div class="dt-title">자료공유</div>
            <div class="del-box" @click="hideEventBox()"><i class="fas fa-times"></i></div>
        </div>
        <div class="contents">
            <div class="data-list-box">
                <ul class="data-list">
                    <li v-for="(data,idx) in dataList" :key="data.type+data.no" @click="getDataInfo(idx)">
                        <span class="gtype" >자료</span>
                        <div class="subject">
                            {{data.name}}
                        </div>
                        <div class="date">{{data.viewDate}}</div>

                    </li>

                </ul>
            </div>
        </div>
        <div class="bottom-box">
            <div class="button">
                <v-btn class="cancle" type="button" v-if="!mobileView"  @click="hideEventBox()">닫기</v-btn>
                <v-btn
                    type="button"
                    class="submit-button"
                    @click="showFileBox()">파일 업로드
                </v-btn>
            </div>
        </div>
        <v-dialog
            v-model="modalShow"
            width="420"
        >
            <div :class="'container-box '+mobileClass" v-if="fileUploadShow">
                <div class="del-box" @click="hideFileBox()"><i class="fas fa-times"></i></div>
                <div class="gtitle">파일 업로드 하기</div>
                <div class="uploadBox" v-if="uploadBoxShow">
                    <ul class="button-list">
                        <li>
                            <v-btn
                                type="button"
                                class="submit-button">파일 선택하기<input type="file"
                                                                    id="uploadFile"
                                                                    @change="openFile"
                                                                    accept='.hwp,.pdf,.xls,.docx,.doc,.xlsx'/>
                            </v-btn>
                        </li>
                        <!--li>
                            <img src="../../../../assets/img/btn_googlee.png" style="width:100%;cursor:pointer;"
                                 @click="getGoogleDrive()">
                        </li-->
                    </ul>
                    <div class="tip" style="padding-top:10px;">
                        &#8251; 지원 파일 확장자 : doc, xlsx, ppt, pdf, hwp<br>
                        &#8251; 1MB 이하로 제한됩니다.
                    </div>
                </div>
                <!--div class="google-drive-box" v-if="!uploadBoxShow">
                    <ul class="google-dirive">
                        <li v-for="(file,idx) in gDFileList" @click="uploadGoogleDrive(idx)">
                            <span class="filename">{{file.name}}</span>
                        </li>
                    </ul>
                </div-->
            </div>
        </v-dialog>
    </div>
</template>


<script>
	import {mapGetters} from "vuex";
    import {
	    API_URL_BROADCAST_LIVE_DATA_LIST,
	    API_URL_BROADCAST_LIVE_DATA_FILE_INSERT,
	    API_URL_BROADCAST_LIVE_DATA_FILE_SHARE
	} from '../../../../api/urls';
	import apiService from '../../../../api/apiService';

	export default {
		name: 'liveHostDataView',
      	data() {
			return {
				mobileView: false,
				mobileClass: '',
                dataList:[],
				modalShow: false,
				fileUploadShow:false,
				uploadBoxShow:'',

			}
		},
        props:["gno"],
		created() {
			if(this.$isMobile()) {
				this.mobileView = true;
				this.mobileClass = 'mobile'
			}
			this.getData();
		},

		methods: {
			hideEventBox() {
				this.$emit("hideEvent",{page:'data'});
			},
			getData() {
				const frm = new FormData()
                frm.append('gno',this.gno)
				apiService.post(API_URL_BROADCAST_LIVE_DATA_LIST, frm, (res) => {
					this.dataList = [];
					for(let item of res.fileList) {
						let rdate = item.rdate.toString();
						item.viewDate = rdate.substring(0,10)
						this.dataList.push(item);
					}
				});
			},
			openFile(event) {

				let file = event.target.files[0];
				let filename = file.name;
				let exts = filename.split('.');
				let ext = exts[exts.length - 1];


				const frm = new FormData()
				frm.append('gno', this.gno)
				frm.append('ext', ext)
				frm.append('name', filename)
				frm.append('dataFile', file)
				this.$eventBus.$emit('overlay', 'show');
				apiService.postFile(API_URL_BROADCAST_LIVE_DATA_FILE_INSERT, frm, (res) => {
					this.$eventBus.$emit('overlay', 'hide');
					this.getData();
					this.fileUploadShow = false;
					this.modalShow = false;

				});

			},
			showFileBox() {
				this.modalShow = true;
				this.fileUploadShow = true;
				this.uploadBoxShow = true;
			},
			hideFileBox() {
				this.modalShow = false;
				this.fileUploadShow = false;
			},
			getDataInfo(idx) {
				let fdata = this.dataList[idx];
				let msg = (fdata.ext == 'hwp') ? 'hwp 파일은 다운로드만 가능합니다<br>자료를 공유 하시겠습니까?' : '선택된 자료를 공유하시겠습니까?';
				let message = {
					type: 'confirm',
					message: msg,
					doAction:()=>{
						this.shareDataChoice(fdata);
                    }
				};
				this.$eventBus.$emit('modalOpen', message);

            },
			shareDataChoice(fdata) {
				const frm = new FormData()
				frm.append('no',fdata.no)
				apiService.postFile(API_URL_BROADCAST_LIVE_DATA_FILE_SHARE, frm, (res) => {
					this.$emit("hideEvent",{page:'data',action:'share',fdata:fdata});
				});
            }
		}

	}
</script>
<style lang="scss" scoped>
    ul {
        padding:0;
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
            .dt-title {
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
            padding: 40px 60px;
            height: 580px;
            overflow-y: auto;
            border-radius: 0 0 10px 10px;
            .data-list-box {
                .data-list {
                    display: flex;
                    flex-wrap: wrap;
                    li {
                        background: #fff;
                        -webkit-box-shadow: 1px 1px 9px -1px rgba(71, 70, 71, 0.53);
                        -moz-box-shadow: 1px 1px 9px -1px rgba(71, 70, 71, 0.53);
                        box-shadow: 1px 1px 9px -1px rgba(71, 70, 71, 0.53);
                        width: 31%;
                        margin: 0 30px 30px 0;
                        height: 140px;
                        padding: 18px 0 0 30px;
                        border-radius: 10px;
                        position: relative;
                        &:nth-child(3n) {
                            margin-right: 0;
                        }

                    }
                    .gtype {
                        display: inline-block;
                        height: 21px;
                        min-width: 50px;
                        padding: 0 10px;
                        text-align: center;
                        line-height: 20px;
                        border-radius: 10px;
                        font-size: 9pt;
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
        }
        .bottom-box {
            height: 65px;
            line-height: 65px;
            border-top: solid 1px #dcdcdc;
            padding:0 20px;
            font-size:10pt;
            .button {
                width:530px;
                margin:auto;
                button {
                    width:250px;
                    height:40px;
                    border-radius:20px;
                    color:#fff;
                    background: #5E65E3;
                    &.cancle {
                        background:#999;
                        margin-right:30px;
                    }
                }
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
                padding:20px 20px;
                height:auto;
                overflow-y:visible;
                border-radius:0;
                .data-list-box {
                    .data-list {
                        display: flex;
                        flex-wrap: wrap;
                        li {
                            background: #fff;
                            -webkit-box-shadow: 1px 1px 9px -1px rgba(71, 70, 71, 0.53);
                            -moz-box-shadow: 1px 1px 9px -1px rgba(71, 70, 71, 0.53);
                            box-shadow: 1px 1px 9px -1px rgba(71, 70, 71, 0.53);
                            width: 48%;
                            margin: 0 4% 10px 0;
                            height: 140px;
                            padding: 18px 0 0 15px;
                            border-radius: 10px;
                            position: relative;
                            &:nth-child(3n) {
                                margin-right: 4%;
                            }
                            &:nth-child(2n) {
                                margin-right: 0;
                            }

                        }
                        .gtype {
                            display: inline-block;
                            height: 21px;
                            min-width: 50px;
                            padding: 0 10px;
                            text-align: center;
                            line-height: 20px;
                            border-radius: 10px;
                            font-size: 9pt;
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


    .container-box {
        width: 420px;
        height: 340px;
        margin: 0;
        position: relative;
        padding: 50px 30px 30px 30px;
        background: #fff;
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
        .gtitle {
            text-align: center;
            font-size: 15pt;
            color: #000;
            margin-bottom: 30px;
        }
        .button-list {
            li {
                width: 100%;
                height: 50px;
                margin: 15px 0;
                button {
                    width: 100%;
                    border-radius: 25px;
                    height: 50px;
                    position: relative;
                    background: #686EFB;
                    color: #fff;
                    input {
                        position: absolute;
                        opacity: 0;
                        width: 100%;
                        height: 50px;
                        top: 0;
                        left: 0;
                        cursor: pointer;
                    }
                }
            }
            &.link-box {
                li {
                    height: 60px;
                    input {
                        width: 100%;
                        height: 50px;
                        padding-left: 20px;
                        border-radius: 25px;
                        background: #fafafa;
                        border: solid 1px #dcdcdc;

                    }
                    .error {
                        padding: 0 10px 15px 20px;
                        text-align: left;
                        color: #f00;
                        font-size: 9pt;
                    }
                }
            }

        }
        .tip {
            margin-top: 30px;
            color: #999;
            font-size: 11pt;
            line-height: 150%;
        }
        .google-drive-box {
            height: 200px;
            border: solid 1px #999;
            border-radius: 8px;
            overflow-y: auto;
            .google-dirive {
                li {
                    padding: 7px 0 7px 10px;
                    font-size: 10pt;
                    cursor: pointer;
                    border-bottom: solid 1px #dcdcdc;
                }
            }
        }
        &.mobile {
            width: 100%;
            height: 300px;
            margin: 0;
            position: relative;
            padding: 50px 30px 30px 30px;
            background: #fff;
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
            .gtitle {
                text-align: center;
                font-size: 12pt;
                color: #000;
                margin-bottom: 30px;
            }
            .button-list {
                li {
                    width: 100%;
                    height: 50px;
                    margin: 15px 0;
                    button {
                        width: 100%;
                        border-radius: 25px;
                        height: 50px;
                        position: relative;
                        background: #686EFB;
                        color: #fff;
                        input {
                            position: absolute;
                            opacity: 0;
                            width: 100%;
                            height: 50px;
                            top: 0;
                            left: 0;
                            cursor: pointer;
                        }
                    }
                }
                &.link-box {
                    li {
                        height: 60px;
                        input {
                            width: 100%;
                            height: 50px;
                            padding-left: 20px;
                            border-radius: 25px;
                            background: #fafafa;
                            border: solid 1px #dcdcdc;

                        }
                        .error {
                            padding: 0 10px 15px 20px;
                            text-align: left;
                            color: #f00;
                            font-size: 9pt;
                        }
                    }
                }

            }
            .tip {
                margin-top: 30px;
                color: #999;
                font-size: 11px;
                line-height:150%;
            }
            .google-drive-box {
                height: 200px;
                border: solid 1px #999;
                border-radius: 8px;
                overflow-y: auto;
                .google-dirive {
                    li {
                        padding: 7px 0 7px 10px;
                        font-size: 10pt;
                        cursor: pointer;
                        border-bottom: solid 1px #dcdcdc;
                    }
                }
            }
        }
    }
</style>