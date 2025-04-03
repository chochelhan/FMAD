<template>
    <div class="mypage-container">

        <div v-if="mobileView" class="top-menu-bar">
            <div class="top-menu-bar-content">
                <div class="back-button" @click="$router.go(-1)">
                    <i class="fas fa-chevron-left"></i>
                </div>
                <span class="m-title">게시판 관리</span>

            </div>
        </div>
        <div :class="'contents '+mobileClass">
            <div class="from-box">

                <div v-if="!mobileView" class="stitle"><span class="line">게시판 관리</span>
                    <span class="question-box">
                                    <i class="fas fa-question">
                                        <div class="menu-title-tip">
                                            게시판 관리
                                            <div class="description">
                                                 다양한 용도로 사용할 수 있는 게시판에 대한 내용이 있습니다.
                                                게시판 명칭을 변경할 수 있고, 글쓰기 및 첨부파일 사용 여부, 댓글 허용 여부도 주최자의 의도에 따라 설정할 수 있습니다.<br>
                                                또한 첨부파일의 용량은 최대 1MB까지 기본제공하고 있으나,
                                                사용 목적에 맞게 일시적으로 용량과 사용기간을 확장하여 설정할 수 있습니다.
                                            </div>
                                        </div>
                                    </i>
                    </span>
                    <div class="button-right-box">
                        <v-btn
                            type="button"
                            class="submit-button"
                            @click="showBoard()">게시판 미리보기
                        </v-btn>
                    </div>
                </div>
                <div class="title-desc">다양한 용도로 사용할 수 있는 게시판에 대한 내용이 있습니다.</div>

                <ul class="field-box">
                    <li>
                        <div class="required-icon">게시판 명칭 변경</div>
                        <div class="field-input">
                            <v-text-field
                                v-model="boardName"
                                required
                                placeholder="게시판 이름을 입력하세요"
                                :error-messages="boardNameErrors"
                                @input="boardNameTouch()"
                                @blur="boardNameTouch()"
                                outlined
                            ></v-text-field>
                        </div>
                    </li>
                    <li>
                        <div class="required-icon">글쓰기 권한</div>
                        <div class="field-input">
                            <ul class="switch-ul three-box">
                                <li @click="setAuthWrite('host')" :class="writeClass.host"> 주최자 본민만</li>
                                <li @click="setAuthWrite('user')" :class="writeClass.user"> 로그인한 참가자 포함</li>
                                <li @click="setAuthWrite('all')" :class="writeClass.all"> 참가자 모두 포함</li>
                            </ul>
                        </div>
                    </li>
                    <li>
                        <div class="required-icon">첨부파일 사용 여부</div>
                        <div class="field-input">
                            <ul class="switch-ul three-box">
                                <li @click="setUseFile('host')" :class="ufileClass.host"> 주최자 본민만</li>
                                <li @click="setUseFile('user')" :class="ufileClass.user"> 로그인한 참가자 포함</li>
                                <li @click="setUseFile('all')" :class="ufileClass.all"> 참가자 모두 포함</li>

                            </ul>
                        </div>
                    </li>
                    <li>
                        <div class="required-icon">게시글 댓글 허용</div>
                        <div class="field-input">
                            <ul class="switch-ul three-box">
                                <li @click="setAuthReple('yes')" :class="repleClass.yes"> 사용</li>
                                <li @click="setAuthReple('no')" :class="repleClass.no"> 미사용</li>
                            </ul>
                        </div>
                    </li>
                </ul>
                <p class="submit-button-box">
                    <v-btn
                        type="button"
                        class="cancle-button"
                    >
                        취소
                    </v-btn>
                    <v-btn
                        type="button"
                        class="submit-button"
                        @click="settingSubmit()"
                    >
                        확인
                    </v-btn>
                </p>
                <div class="sub-title">첨부파일 용량 설정</div>
                <div class="sub-title-desc">게시판의 첨부파일 용량을 설정 할 수 있습니다. (게시글 당 첨부파일 용량이 아닌, 모든 게시글에 적용되는 첨부 파일 용량입니다.)
                </div>
                <ul class="field-box">
                    <li>
                        <div class="required-icon">현재 사용가능 첨부파일 용량</div>
                        <div class="field-input">
                            <div class="file-size">{{fileSizeText}}</div>
                        </div>
                    </li>
                    <li>
                        <div class="required-icon">첨부파일 용량 변경</div>
                        <div class="field-input">
                            <ul class="switch-ul three-box">
                                <li @click="setUseFileSize('1')" :class="ufileSizeClass['1f']"> ~ 1MB</li>
                                <li @click="setUseFileSize('20')" :class="ufileSizeClass['20f']"> ~ 20MB</li>
                                <li @click="setUseFileSize('50')" :class="ufileSizeClass['50f']"> ~ 50MB</li>
                                <li @click="setUseFileSize('100')" :class="ufileSizeClass['100f']"> ~ 100MB</li>
                                <li @click="setUseFileSize('500')" :class="ufileSizeClass['500f']"> ~ 500MB</li>
                            </ul>
                        </div>
                    </li>
                    <li>
                        <div class="required-icon">다운로드 가능기한 설정</div>
                        <div class="field-input">
                            <ul class="switch-ul three-box">
                                <li @click="setDownLimit('ing')" :class="downLimitClass.ing"> 라이브 중에만 가능</li>
                                <li @click="setDownLimit('after')" :class="downLimitClass.after"> 라이브 종료 후에도 가능</li>
                            </ul>
                        </div>
                    </li>
                    <li class="payment-guide-li">
                        <div class="required-icon">상품 구매하기</div>
                        <div class="payment-guide-box">
                            <div class="payment-box" v-if="paymentBoxShow">
                                <div class="summary">
                                    <div class="sub-title">첨부파일 용량변경 {{fileSizeText}}</div>
                                    <div class="in-box">
                                        <ul class="amt-box">
                                            <li @click="amtMinus()">-</li>
                                            <li class="amt">{{amt}}</li>
                                            <li @click="amtPlus()">+</li>
                                        </ul>
                                        <div class="price">
                                            <span class="blue-item">{{priceText}}</span>원
                                        </div>
                                    </div>
                                </div>
                                <div class="button">
                                    <v-btn
                                        type="button"
                                        class="payment-button"
                                        @click="payment()">상품 구매하기
                                    </v-btn>
                                </div>
                            </div>
                            &#8251; 라이브고에서 기본으로 제공하는 게시글 파일첨부의 용량은 최대1MB입니다.<br>
                            &nbsp;&nbsp;&nbsp; 하지만 용도에 따라 첨부파일의 용량을 일시적으로 확장하여 참가자들에게 원활하게 파일을 공유할 수 있습니다.
                            <br><br>
                            &#8251; 각 용량별 가격은 아래와 같으며, 일시적으로 확장되는 기간은 1일 입니다.
                            <ul class="price-item">
                                <li>~ 1MB : <span>무료</span></li>
                                <li v-for="item in pricePolitics">
                                    ~ {{item.disk}} : <span>{{item.price}}</span>원(1일 기준)
                                </li>
                            </ul>
                            &#8251; 라이브 행사 종료 후에도 방문자들에게 파일을 공유하고 싶은 경우, 파일 다운로드 가능 기한 설정을 "라이브 종료 후에도 가능"으로<br>
                            &nbsp;&nbsp;&nbsp; 설정 후에 다운로드 가능한 일수만큼 수량을 선택해주시기 바랍니다.<br>
                            &nbsp;&nbsp;&nbsp; (EX - 라이브 행사 종료후에도 1주일간 방문자들에게 파일을 공유하고 싶은 경우, 수량을 7개 선택해 주시면 됩니다)
                        </div>
                    </li>
                    <li>
                        <div class="required-icon">
                            게시글 작성하기
                            <div style="font-size:10pt;color:#999;font-weight:normal">
                                생성한 게시판에 게시글을 작성합니다
                            </div>
                        </div>
                        <div class="field-input right-box">
                            <v-btn
                                type="button"
                                class="submit-button"
                                @click="writeZoomBoard()">게시글 작성
                            </v-btn>
                        </div>
                    </li>
                </ul>
                <div style="height:60px"></div>
            </div>

        </div>
        <v-dialog
            v-model="modalShow"
            width="800"
            >
            <boardRegist v-if="zoomBoardRegistShow" @modalHIde="articleRegistHide" :no="articleNo" :gno="gno"></boardRegist>
            <boardList v-if="zoomBoardListShow" @modalHIde="modalShow=false"  @articleView="articleView" :gno="gno"></boardList>
            <boardView v-if="zoomBoardViewShow" @modalHIde="boardListView" @articleUpdate="modifyArticle"  :no="selectedNo"  :gno="gno"></boardView>
        </v-dialog>
    </div>
</template>


<script>
    import boardRegist from './boardRegist'
    import boardList from './boardList'
    import boardView from './boardview'
    import {mapGetters} from "vuex";
	import UTIL from '../../../../api/util';
	import {
		API_URL_BROADCAST_LIVE_BOARD_INFO,
		API_URL_BROADCAST_LIVE_BOARD_UPDATE,
	} from '../../../../api/urls';
	import apiService from '../../../../api/apiService';

	export default {
		name: 'liveBoardSetting',
        components:{
	        boardRegist,
	        boardList,
	        boardView
        },
		data() {
			return {
				insertFlag: false,
				mobileView: false,
				mobileClass: '',
				articleNo:'new',
			    zoomBoardRegistShow:false,
				selectedNo:'',
				zoomBoardViewShow:false,
                modalShow:false,
				no: '',
				gno: '',
				boardName: '',
				boardNameErrors: [],
				writeAuth: 'host',
				writeClass: {
					host: 'active',
					user: '',
					all: '',
				},
				ufileAuth: 'host',
				ufileClass: {
					host: 'active',
					user: '',
					all: '',
				},
				repleUse: 'yes',
				repleClass: {
					yes: 'active',
					no: ''
				},
				ufileSizeClass: {
					'1f': 'active',
					'20f': '',
					'50f': '',
					'100f': '',
					'500f': '',
				},
				downLimitClass: {
					ing: 'active',
					after: '',
				},
				fileSize: '1',
				downLimit: 'ing',
				priceText: '',
				amt: 1,
				orgPrice: '',
				paymentBoxShow: false,
				zoomBoardListShow: false,
				paymentInfo: {},
				limitFileSize: '',
				limitFileAmt: '',
				limitRegDate: '',
				price: '',
				fileSizeText: '~1MB (첨부파일 용량 확장 구매내역이 없습니다.)',
				pgfileSizeText: '',
				updateFlag: false,
				pricePolitics: [
					{disk: '20MB', price: '2,500'},
					{disk: '50MB', price: '5,000'},
					{disk: '100MB', price: '8,350'},
					{disk: '500MB', price: '15,000'},
				],
			}
		},
		created() {
			this.gno = this.getGno;
			this.getData();
		},
		computed: {
			...mapGetters('etc', ["getGno"]),

		},
		methods: {
			getData() {
				const frm = new FormData()
				frm.append('gno', this.gno)
				apiService.post(API_URL_BROADCAST_LIVE_BOARD_INFO, frm, (res) => {
					if (res.info) {
						this.no = res.info.no;
						/*
                        if(ret.memberInfo.filesize>0) {
                            //ret.memberInfo.fileamt;
                            let fileEnDates = ret.memberInfo.fileEnDate.split('T');
                            let fileEnDate = fileEnDates[0]+' 23:59:59';
                            let fendate = new Date(fileEnDate);
                            let nowDate = new Date();
                            if(fendate.getTime()>= nowDate.getTime()) {

                                this.fileSizeText = '~'+ret.memberInfo.filesize+'MB ('+fileEnDates[0]+')';
                                this.limitFileSize = ret.memberInfo.filesize;
                                this.limitFileAmt = ret.memberInfo.fileamt;
                                this.limitRegDate =  fileEnDate;
                            }

                        }
                        */
						let info = res.info;
						this.updateFlag = true;
						this.boardName = info.boardName;
						this.setAuthWrite(info.writeAuth);
						this.setUseFile(info.ufileAuth)
						this.setAuthReple(info.repleUse);
						this.setDownLimit(info.downLimit)

					}
				});
			},
			settingSubmit() {

				if (!this.boardName) {
					this.boardNameTouch()
					return;
				}
				const frm = new FormData()
				frm.append('gno', this.gno);
				frm.append('writeAuth', this.writeAuth);
				frm.append('ufileAuth', this.ufileAuth);
				frm.append('repleUse', this.repleUse);
				frm.append('fileSize', this.fileSize);
				frm.append('boardName', this.boardName);
				frm.append('downLimit', this.downLimit);
				if (this.no) frm.append('no', this.no);
				if (this.limitFileSize > 0) {
					frm.append('limitFileSize', this.limitFileSize);
					frm.append('limitAmt', this.limitFileAmt);
					frm.append('limitRegDate', this.limitRegDate);
				}
				this.$eventBus.$emit('overlay', 'show');
				apiService.post(API_URL_BROADCAST_LIVE_BOARD_UPDATE, frm, (res) => {
					this.$eventBus.$emit('overlay', 'hide');
					let msg = (this.updateFlag) ? '수정' : '저장'
					let message = {
						message: '게시판 정보가 ' + msg + ' 되었습니다',

					};
					this.$eventBus.$emit('modalOpen', message);
				});

			},
			payment() {
				this.paymentInfo = {
					fileSize: this.fileSize,
					amt: this.amt,
					price: this.price,
					orgprice: UTIL.numberFormat(this.orgPrice)
				}
				this.screenPgShow = true;
			},
			boardNameTouch() {
				this.boardNameErrors = []
				if (!this.boardName) {
					this.boardNameErrors.push('게시판 이름를 입력하세요')
				}
			},
			setAuthWrite(cmd) {

				this.writeAuth = cmd;
				let allActive = '';
				let userActive = '';
				let hostActive = '';
				switch (cmd) {
					case 'all':
						allActive = 'active';
						break;
					case 'user':
						userActive = 'active';
						break;
					case 'host':
						hostActive = 'active';
						break;
				}
				this.writeClass = {
					all: allActive,
					user: userActive,
					host: hostActive
				}
			},
			setUseFile(cmd) {

				this.ufileAuth = cmd;
				let allActive = '';
				let userActive = '';
				let hostActive = '';
				switch (cmd) {
					case 'all':
						allActive = 'active';
						break;
					case 'user':
						userActive = 'active';
						break;
					case 'host':
						hostActive = 'active';
						break;
				}
				this.ufileClass = {
					all: allActive,
					user: userActive,
					host: hostActive
				}
			},
			setAuthReple(cmd) {
				this.repleUse = cmd;
				let yesActive = '';
				let noActive = '';
				switch (cmd) {
					case 'yes':
						yesActive = 'active';
						break;
					case 'no':
						noActive = 'active';
						break;
				}

				this.repleClass = {
					yes: yesActive,
					no: noActive
				};
			},
			setUseFileSize(cmd) {
				this.fileSize = cmd;
				let aActive = '';
				let bActive = '';
				let cActive = '';
				let dActive = '';
				let eActive = '';
				let price = 0;
				switch (cmd) {
					case '1':
						aActive = 'active';
						this.pgfileSizeText = '~ 1MB';
						break;
					case '20':
						bActive = 'active';
						this.pgfileSizeText = '~ 20MB';
						price = 2500;
						break;
					case '50':
						cActive = 'active';
						this.pgfileSizeText = '~ 50MB';
						price = 5000;
						break;
					case '100':
						dActive = 'active';
						this.pgfileSizeText = '~ 100MB';
						price = 8350;
						break;
					case '500':
						eActive = 'active';
						this.pgfileSizeText = '~ 500MB';
						price = 15000;
						break;
				}
				this.fileSizeText = this.pgfileSizeText;
				if (price > 0) {
					this.price = price * this.amt;
					this.orgPrice = price;
					this.priceText = UTIL.numberFormat(this.price)
					this.paymentBoxShow = true;
				} else {
					this.paymentBoxShow = false;
				}

				this.ufileSizeClass = {
					'1f': aActive,
					'20f': bActive,
					'50f': cActive,
					'100f': dActive,
					'500f': eActive,
				};

			},
			amtMinus() {
				if (this.amt == 1) return;
				this.amt--;
				this.setAmt()
			},
			amtPlus() {
				this.amt++;
				this.setAmt()
			},
			setAmt() {
				this.price = this.orgPrice * this.amt;
				this.priceText = UTIL.numberFormat(this.price);
			},
			setDownLimit(cmd) {
				if (!this.updateFlag) {
					let message = {
						message: '게시판 정보를 먼저 저장하세요',

					};
					this.$eventBus.$emit('modalOpen', message);
					return;
				}

				this.downLimit = cmd;
				let ingActive = '';
				let afterActive = '';
				switch (cmd) {
					case 'ing':
						ingActive = 'active';
						break;
					case 'after':
						afterActive = 'active';
						break;
				}

				this.downLimitClass = {
					ing: ingActive,
					after: afterActive
				};
				let params = {
					mno: this.mno,
					downLimit: this.downLimit,
				}
				//this.zoomService.setZoomBoardDownLimit(params).subscribe(ret=>{

				//})

			},
			writeZoomBoard() {
				if (!this.updateFlag) {
					let message = {
						message: '게시판 정보를 먼저 저장하세요',
					};
					this.$eventBus.$emit('modalOpen', message);
					return;
				}
				this.articleNo = 'new';
				this.modalShow = true;
				this.zoomBoardRegistShow = true;
				this.zoomBoardListShow = false;
				this.zoomBoardViewShow = false;
			},
			showBoard() {
				this.modalShow = true;
				this.zoomBoardRegistShow = false;
				this.zoomBoardListShow = true;
				this.zoomBoardViewShow = false;
            },
			articleView(no) {
				this.selectedNo = no;
				this.zoomBoardViewShow = true;
				this.zoomBoardRegistShow = false;
				this.zoomBoardListShow = false;
            },
			boardListView(cmd) {
				this.zoomBoardRegistShow = false;
				this.zoomBoardListShow = true;
				this.zoomBoardViewShow = false;
            },
			modifyArticle(no) {
				this.articleNo = no;
				this.zoomBoardRegistShow = true;
				this.zoomBoardListShow = false;
				this.zoomBoardViewShow = false;
            },
            articleRegistHide(cmd) {
				if(this.articleNo == 'new') {
					this.modalShow = false;
                } else {
					this.articleView(this.articleNo)
                }
            }
		},

	}
</script>
<style lang="scss" scoped>
    .payment-guide-li {
        background: #F4F4F4;
        border-left: solid 1px #DCDCDC;
        border-right: solid 1px #DCDCDC;
        .payment-guide-box {
            padding: 20px 0;
            font-size: 11pt;
            .price-item {
                margin: 0;
                padding: 10px 0 20px 0;
                li {
                    color: #000;
                    font-weight: bold;
                    span {
                        color: #2D8CFF;
                    }
                }
            }
            .payment-box {
                margin-right: 20px;
                margin-bottom: 20px;
                display: flex;
                border-top: solid 1px #ccc;
                border-bottom: solid 1px #ccc;
                padding: 20px 30px;
                background: #fff;
                .summary {
                    width: 65%;
                    padding: 0;
                    .sub-title {
                        font-size: 11pt;
                        padding: 0;
                        margin: 0;
                    }
                    .in-box {
                        margin-top: 15px;
                        display: flex;
                        .amt-box {
                            width: 300px;
                            padding: 0;
                            margin: 0;
                            display: flex;
                            li {
                                text-align: center;
                                line-height: 35px;
                                width: 40px;
                                height: 35px;
                                border: solid 1px #ccc;
                                background: #fafafa;
                                font-size: 14pt;
                                cursor: pointer;
                                &.amt {
                                    width: 50px;
                                    color: #000;
                                    font-size: 12pt;
                                    font-weight: bold;
                                    border-left: none;
                                    border-right: none;
                                    background: #fff;
                                    cursor: default;
                                }
                            }
                        }
                        .price {
                            padding-top: 10px;
                            color: #000;
                            font-weight: bold;
                            span {
                                background: none;
                                color: #2D8CFF;
                                font-size: 14pt;
                            }
                        }
                    }
                }
                .button {
                    text-align: right;
                    width: 35%;
                    max-height: 75px;
                    .payment-button {
                        width: 270px;
                        height: 70px;
                        border-radius: 35px;
                        background: #686EFB;
                        color: #fff;
                    }
                }
            }
        }
    }

    .right-box {
        text-align: right;
        min-width: 80%;
        padding-bottom: 25px;
        .submit-button {
            width: 400px;
            border-radius: 0;
            padding: 0;
            background: #686EFB;
            color: #fff;
            min-height: 60px;
            border-radius: 30px;
        }
    }
    .stitle {
        position: relative;
        .button-right-box {
            position: absolute;
            right: 10px;
            top:-10px;
            .submit-button {
                width:250px;
                border-radius: 0;
                padding: 0;
                background: #686EFB;
                color: #fff;
                min-height:50px;
                line-height:50px;
                border-radius: 25px;
            }
        }
    }

    .contents {
        .file-size {
            margin:15px 0 35px 0;
        }
        .share {
            padding-right: 15px;
            cursor: pointer;
            img {
                margin-top: 8px;
                width: 40px;
            }
        }
        .flex-box {
            display: flex;
            .chk {
                margin-right: 20px;
            }
        }

        &.mobile {
            width: 100%;
            padding: 70px 20px 100px 20px;
            width: auto;

        }

    }


</style>