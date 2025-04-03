<template>
    <div class="mypage-container">

        <div v-if="mobileView" class="top-menu-bar">
            <div class="top-menu-bar-content">
                <div class="back-button" @click="$router.go(-1)">
                    <i class="fas fa-chevron-left"></i>
                </div>
                <span class="m-title">문제/자료 관리</span>
            </div>
        </div>
        <div :class="'contents '+mobileClass">
            <div class="from-box">

                <div v-if="!mobileView" class="stitle"><span class="line">문제/자료관리</span>
                    <span class="question-box">
                                    <i class="fas fa-question">
                                        <div class="menu-title-tip">
                                             문제/자료관리
                                            <div class="description">
            수업에 필요한 자료와 링크를 저장하고 확인할 수 있습니다.
            파일 업로드 버튼을 통해 내 컴퓨터에 저장된 pdf 파일은 물론, 개인 구글 드라이브에 저장된 파일도 업로드하여 자료로 활용할 수 있습니다.
            또한 링크 공유도 내용과 URL을 입력하여 행사 중 참가자들에게 링크를 공유할 수 있습니다.<br><br>
            자세한 내용은 하단의 ‘자세히 알아보기’를 눌러 예시 화면을 살펴보세요

                                            </div>
                                        </div>
                                    </i>
                    </span>
                </div>
                <div class="title-desc"> 수업에 필요한 자료와 링크를 저장하고 확인할 수 있습니다.</div>

                <div class="question-answer-box">
                    <v-expand-transition>
                        <div id="guide-description" v-if="guideShow">
                            <div class="img">
                                <img style="max-width:100%;" src="../../../../assets/guideImg/06_guide.jpg">
                            </div>
                        </div>
                    </v-expand-transition>
                    <div class="quide-title-box" @click="guideToggle()">
                        <div :class="'quide-title '+guideClass">{{guideTitle}}</div>
                        <div class="guide-icon-box">
                            <div class="guide-icon">
                                <i v-if="!guideShow" class="fas fa-angle-down"></i>
                                <i v-else class="fas fa-angle-up"></i>
                            </div>
                        </div>
                    </div>
                </div>
                <ul class="category-box">
                    <li :class="cateClass[cate.code]" v-for="cate in categoryList" @click="showCategory(cate.code)">
                        {{cate.name}}
                    </li>
                </ul>
                <div class="data-list-box">
                    <ul class="data-list">
                        <li v-for="(data,idx) in dataList" :key="data.type+data.no">
                            <div class="del-box" @click="deleteData(data.type,data.no)"><i class="fas fa-times"></i>
                            </div>
                            <span class="gtype" @click="getDataInfo(idx)">{{data.typeName}}</span>
                            <div class="subject" @click="getDataInfo(idx)">
                            <span v-if="data.type=='zoomBoard' && data.notice" class="notice-mp">
                                <img src="../../../../assets/svg/ico_mp.svg" style="width:17px;">
                            </span>
                                {{data.name}}
                            </div>
                            <div class="date" @click="getDataInfo(idx)">{{data.viewDate}}</div>
                            <div class="file" v-if="data.fileName">
                                <i class="fas fa-paperclip"></i> {{data.fileName}}
                            </div>

                        </li>

                    </ul>
                </div>
                <div class="button-row">
                    <v-btn
                        type="button"
                        class="submit-button"
                        @click="showFileBox()">파일 업로드
                    </v-btn>
                </div>
            </div>

        </div>
        <v-dialog
            v-model="modalShow"
            width="420"
        >
            <div class="container-box" v-if="fileUploadShow">
                <div class="del-box" @click="hideFileBox()"><i class="fas fa-times"></i></div>
                <div class="gtitle">{{uploadFileTitle}}</div>
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
                <div class="google-drive-box" v-if="!uploadBoxShow">
                    <ul class="google-dirive">
                        <li v-for="(file,idx) in gDFileList" @click="uploadGoogleDrive(idx)">
                            <span class="filename">{{file.name}}</span>
                        </li>
                    </ul>
                </div>
            </div>
        </v-dialog>

        <v-dialog
            v-model="boardModalShow"
            width="800"
        >
            <boardRegist v-if="zoomBoardUpdateShow" @modalHIde="articleRegistHide" :no="articleNo"
                         :gno="gno"></boardRegist>
            <boardView v-if="zoomBoardViewShow" @modalHIde="boardListView" @articleUpdate="modifyArticle"
                       :no="selectedNo" :gno="gno"></boardView>
        </v-dialog>
    </div>
</template>


<script>
	import {mapGetters} from "vuex";
	import {
		API_URL_BROADCAST_LIVE_DATA_ALL_LIST,
		API_URL_BROADCAST_LIVE_DATA_FILE_INSERT,
	} from '../../../../api/urls';
	import apiService from '../../../../api/apiService';
	import boardRegist from '../board/boardRegist'
	import boardView from '../board/boardview'

	export default {
		name: 'liveDataList',
		components: {
			boardRegist,
			boardView
		},
		data() {
			return {
				guideTitle: ' 자세히 알아보기',
				guideShow: false,
				guideClass: '',
				mobileView: false,
				mobileClass: '',
				dataList: [],
				gno: '',
				fileView: false,
				fno: 0,
				sendFileParams: {},
				dataList: [],
				category: 'all',
				categoryList: [],
				cateClass: {},
				selectedNo: '',
				selectedType: '',
				fileUploadShow: false,
				gDFileList: [],
				uploadBoxShow: true,
				uploadFileTitle: '파일 업로드 하기',
				sourceDataList: {},
				subject: '',
				inputError: '',
				zoomBoardName: '게시판',
				boardModalShow: false,
				articleNo: '',
				zoomBoardViewShow: false,
				zoomBoardUpdateShow: false,
				modalShow: false,
				selectedNo: '',


			}
		},
		computed: {
			...mapGetters('etc', ["getGno"]),

		},
		created() {
			if (this.$isMobile()) {
				this.mobileView = true;
				this.mobileClass = 'mobile'
			}
			this.gno = this.getGno;
			this.getData();
		},

		methods: {
			getData() {
				const frm = new FormData()
				frm.append('gno', this.gno)
				this.dataList = [];
				apiService.post(API_URL_BROADCAST_LIVE_DATA_ALL_LIST, frm, (ret) => {
					let datas = [];
					let item = {};
					let rdate;
					let rdates;
					let prdate;
					let regdate;
					this.category = 'all';
					this.dataList = [];
					let fileLimitDate = '';
					if (ret.zoomBoardInfo) {
						if (ret.zoomBoardInfo.boardName) this.zoomBoardName = ret.zoomBoardInfo.boardName;
						if (ret.zoomBoardInfo.limitRegDate) {
							let limitDates = ret.zoomBoardInfo.limitRegDate.toString()
							fileLimitDate = limitDates.substring(0, 10);
						} else {
							let limitDates = ret.zoomBoardInfo.rdate.toString();
							fileLimitDate = limitDates.substring(0, 10);
						}
					}
					this.setCategoryList();

					for (let data of ret.examList) {
						rdates = data.rdate.toString();
						regdate = rdates.substring(0, 10);
						rdate = rdates[0].replace(':', '').replace('-', '').replace('T', '').replace(':', '').replace('-', '');
						prdate = parseInt(rdate);

						item = {
							name: data.subject,
							no: data.no,
							type: 'exam',
							typeName: '문제',
							viewDate: regdate,
							rdate: prdate
						}

						this.sourceDataList.problem.push(item)
						datas.push(item);
					}

					for (let fdata of ret.fileList) {
						rdates = fdata.rdate.toString();
						regdate = rdates.substring(0, 10);
						rdate = rdates[0].replace(':', '').replace('-', '').replace('T', '').replace(':', '').replace('-', '');
						prdate = parseInt(rdate);

						item = {
							name: fdata.name,
							no: fdata.no,
							ext: fdata.ext,
							type: 'data',
							typeName: '자료',
							url: fdata.url,
							viewDate: regdate,
							rdate: prdate

						}
						this.sourceDataList.data.push(item)
						datas.push(item);

					}
					for (let fdata of ret.articleList) {
						rdates = fdata.rdate.toString();
						regdate = rdates.substring(0, 10);
						rdate = rdates[0].replace(':', '').replace('-', '').replace('T', '').replace(':', '').replace('-', '');
						prdate = parseInt(rdate);
						if (fdata.fileName != 'undefined' && fdata.fileName) {
							fdata.fileName = fdata.fileName + '(다운로드 가능기간 ~ ' + fileLimitDate + ')';
						} else {
							fdata.fileName = '';
						}

						item = {
							name: fdata.subject,
							no: fdata.no,
							type: 'zoomBoard',
							typeName: this.zoomBoardName,
							viewDate: regdate,
							rdate: prdate,
							notice: ((fdata.notice == 'yes') ? true : false),
							fileName: fdata.fileName,
							info: fdata

						}
						this.sourceDataList.zoomBoard.push(item)
						datas.push(item);

					}
					datas.sort(function (a, b) { // 내림차순
						return b.rdate - a.rdate;
					});
					this.sourceDataList.all = datas;
					this.dataList = this.sourceDataList[this.category];
				});
			},
			guideToggle() {
				if (this.guideShow) {
					this.guideShow = false;
					this.guideTitle = '자세히 알아보기'
					this.guideClass = ''
				} else {
					this.guideShow = true;
					this.guideTitle = '접기'
					this.guideClass = 'center'
				}
			},
			setCategoryList() {
				this.categoryList = [
					{code: 'all', name: '전체'},
					{code: 'problem', name: '문제'},
					{code: 'data', name: '자료'},
					{code: 'zoomBoard', name: this.zoomBoardName}
				];
				let seleted = '';
				for (let cate of this.categoryList) {
					seleted = (cate.code == 'all') ? 'active' : '';
					this.cateClass[cate.code] = seleted;
					this.sourceDataList[cate.code] = [];
				}
			},
			showCategory(code) {

				this.category = code;
				this.dataList = this.sourceDataList[this.category];
				for (let key in this.cateClass) {
					if (key == code) this.cateClass[key] = 'active';
					else this.cateClass[key] = '';
				}
			},
			getDataInfo(idx) {
				let info = this.dataList[idx];
				let type = info.type;
				let no = info.no;
				let url = info.url
				switch (type) {
					case 'data':
						switch (info.ext) {
							case 'google':
								window.open('https://drive.google.com/file/d/' + url + '/view?ths=true', 'gWin', 'width=800,height=700,top=0,left=0');
								break;
							case 'hwp':
								let message = {
									message: '한글파일은 미리보기가 불가능합니다',
								};
								this.$eventBus.$emit('modalOpen', message);
								break;
							default:
								this.$router.push('/live/' + this.gno + '/dataList/fileView/' + no);
								/*
								this.sendFileParams = {
									gno: this.gno,
									name: info.name,
									url: url,
									rdate: info.viewDate,
									no: no
								};*/
								break;
						}
						break;
					case 'exam':
						this.$router.push('/live/' + this.gno + '/dataList/examModify/' + no);
						break;

					case 'zoomBoard':
						this.selectedNo = no;
						this.boardModalShow = true;
						this.zoomBoardViewShow = true;
						this.zoomBoardUpdateShow = false;

						break;
				}

			},
			boardListView(cmd) {
				if (cmd == 'deleteDone') {
					this.getData();
				}
				this.boardModalShow = false;
				this.zoomBoardViewShow = false;
			},
			modifyArticle(no) {
				this.articleNo = no;
				this.zoomBoardViewShow = false;
				this.zoomBoardUpdateShow = true;
			},
			articleRegistHide(cmd) {
				if (cmd == 'update') {
					this.getData();
				}
				this.boardModalShow = false;
				this.zoomBoardUpdateShow = false;
			},
			zoomBoardBoxHIde(event) {
				//console.log(event)
				switch (event.page) {
					case 'article':
						this.zoomBoardShow = false;
						this.zoomBoardViewShow = false;
						this.zoomBoardUpdateShow = false;
						break;
					case 'update':
						this.zoomBoardViewShow = false;
						this.zoomBoardUpdateShow = true;
						break;
					case 'delete':
						this.deleteData('zoomBoard', this.selectedArticleData.no);
						this.zoomBoardShow = false;
						this.zoomBoardViewShow = false;
						this.zoomBoardUpdateShow = false;
						break;
					case 'updateComplete':
						this.getData();
						this.zoomBoardShow = false;
						this.zoomBoardViewShow = false;
						this.zoomBoardUpdateShow = false;
						break;
				}
			},
			pageChange(event) {
				if (event.page == 'exam') {
					if (event.update) {
						//this.getData();
					}
					this.examView = false;
				} else {
					if (event.update) {
						this.getData();
					}
					this.fileView = false;
				}
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
			shareDataDeleteDo() {
				let params = {
					no: this.selectedNo,
					type: this.selectedType
				}
				switch (this.selectedType) {
					case 'link':
					case 'notice':
						this.zoomService.deleteBoardLink(params).subscribe(ret => {
							if (ret.result == 'succ') {
								this.getData();
							}
						})

						break;
					case 'zoomBoard':
						this.zoomService.deleteArticle(params).subscribe(ret => {
							if (ret.result == 'succ') {
								this.getData();
							}
						})
						break;
					default:
						this.zoomService.deleteProblemExam(params).subscribe(ret => {
							this.getData();

						})

						break;
				}

			},
			deleteData(type, no) {
				this.selectedNo = no;
				this.selectedType = type;
				let message = {
					type: 'confirm',
					message: '선택된 정보를 삭제하시겠습니까?',
					doAction: () => {
						this.shareDataDeleteDo();
					}
				};
				this.$eventBus.$emit('modalOpen', message);
			},

			showFileBox() {
				this.modalShow = true;
				this.uploadFileTitle = '파일 업로드 하기';
				this.fileUploadShow = true;
				this.uploadBoxShow = true;
			},
			hideFileBox() {
				this.modalShow = false;
				this.fileUploadShow = false;
			},
			getGoogleDrive() {
				/*
				if (this.googleApiService.checkGoogleToken()) {
					this.gDFileList = [];
					let url = 'https://www.googleapis.com/drive/v3/files?pageSize=50&key=';
					this.googleApiService.googleApiByGet(url).subscribe((ret) => {
						if (ret.files) {
							for (let item of ret.files) {
								if (item.mimeType != 'application/vnd.google-apps.folder') {
									this.gDFileList.push(item);
									this.uploadFileTitle = '구글 드라이브에서 선택하기';
									this.uploadBoxShow = false;
								}
							}
						}
					});
				} else {
					this.googleApiService.googleLogin();
				}
				*/
			},
			googleAuthTokenResult(params) {
				this.getGoogleDrive();
			},
			uploadGoogleDrive(idx) {
				let data = this.gDFileList[idx];
				let params = {
					gno: this.gno,
					ext: 'google',
					name: data.name,
					url: data.id
				}

				this.zoomService.uploadGoogleDrive(params).subscribe(ret => {
					if (ret.result == 'succ') {
						this.getData();
						this.fileUploadShow = false;
					}
				})
			}
		}

	}
</script>
<style lang="scss" scoped>
    ul {
        padding: 0;
    }

    .data-list-box {
        .data-list {
            display: flex;
            flex-wrap: wrap;
            li {
                -webkit-box-shadow: 1px 1px 9px -1px rgba(71, 70, 71, 0.53);
                -moz-box-shadow: 1px 1px 9px -1px rgba(71, 70, 71, 0.53);
                box-shadow: 1px 1px 9px -1px rgba(71, 70, 71, 0.53);
                width: 31%;
                margin: 0 40px 40px 0;
                height: 170px;
                padding: 30px 20px 0 30px;
                border-radius: 10px;
                position: relative;
                &:nth-child(3n) {
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
                width: auto;
                padding: 0 10px;
                display: inline-block;
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
            .file {
                padding-top: 5px;
                font-size: 11pt;
                i {
                    color: #1E90FF;
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

    .category-box {
        margin: 30px 0;
        display: flex;
        width: 500px;
        li {
            min-width: 70px;
            width: auto;
            padding: 0 10px;
            height: 30px;
            text-align: center;
            line-height: 30px;
            border-radius: 15px;
            background: #F4F4F4;
            margin-right: 15px;
            font-size: 10pt;
            cursor: pointer;
        }
        li.active {
            color: #fff;
            background: #2D8CFF;
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
    }
</style>