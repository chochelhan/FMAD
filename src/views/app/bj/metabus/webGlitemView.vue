<template>
    <div class="webgl-contents">

        <div class="header-box">
            <div class="stitle">{{info.name}}</div>
            <div class="del-box"><i @click="close()" class="fa fa-times"></i></div>
        </div>

        <div class="article-info">
            <div class="img-box">
                <table>
                    <tr>
                        <td style="vertical-align:middle">
                            <img :src="host+info.img" >
                        </td>
                    </tr>
                </table>
            </div>
            <div class="content-box">
                <div class="g-title">
                    {{info.name}}
                </div>
                <div class="price">
                    <span>M</span> {{info.vprice}}
                </div>
            </div>
        </div>
        <div class="desc" v-html="info.summary">
        </div>
        <ul class="list-button-box" v-if="gHome">
            <li>
                <v-btn
                    class="buy-button"
                    type="button"
                    @click="goodsBuy()"
                >
                    구매하기
                </v-btn>
            </li>
        </ul>
        <ul class="list-button-box" v-else-if="itemType=='webReceivePresentItem'">
            <li v-if="mtype=='shop'">
                <v-btn
                    class="present-button"
                    type="button"
                    @click="goodsPresent()"
                >
                    선물하기
                </v-btn>
            </li>
        </ul>
        <ul class="list-button-box" v-else-if="itemType=='webReceiveItem'">
            <li>
                <v-btn
                    class="buy-button"
                    type="button"
                    @click="goodsBuy()"
                >
                    구매하기
                </v-btn>
            </li>
        </ul>
        <v-dialog
            v-model="modalShow"
            width="450"
            style="z-index:100;"
        >
            <div class="modal-container">
                <div class="header-box">
                    <div class="sub-title"> {{popTitle}}</div>
                    <span @click="modalShow=false"><i class="fa fa-times"></i></span>
                </div>
                <div v-if="presentResult">
                    <div class="modal-content comp">
                        <div class="comp-title">결제가 완료되었습니다.</div>
                        <div class="comp-msg">이제 팬들의 방에서 선물하신<br>아이템을 꾸며보세요.</div>
                        <div class="comp-img"><img src="../../../../assets/images/img_gift.gif"></div>
                    </div>
                    <ul class="button-box single" v-if="presentResult">
                        <li>
                            <v-btn
                                class="buy-button"
                                type="button"
                                @click="closeCompleteResult()"
                            >
                                확인
                            </v-btn>
                        </li>
                    </ul>
                </div>
                <div v-else>
                    <div class="modal-content">
                        <div class="info-box">

                            <div class="img-box">
                                <table>
                                    <tr>
                                        <td style="vertical-align:middle;text-align:center;"><img :src="host+info.img"></td>
                                    </tr>
                                </table>
                            </div>
                            <div class="content-box">
                                <div class="g-title">
                                    {{info.name}}
                                </div>
                                <div class="desc" v-html="info.summary">
                                </div>
                                <div class="price">
                                    <span>M</span> {{info.vprice}}
                                </div>
                            </div>
                        </div>

                        <ul v-if="gHome" class="home-input-box">
                            <li>
                                <v-text-field
                                    v-model="nameplate"
                                    label=""
                                    required
                                    @input="nameplateTouch()"
                                    @blur="nameplateTouch()"
                                    :error-messages="nameplateErrors"
                                    outlined
                                    dense
                                    placeholder="명패를 입력해주세요"
                                ></v-text-field>
                            </li>
                            <li>
                                <div class="file-box">
                                    <div class="file-names">
                                        <span class="inputText"> {{fileName}}</span>
                                    </div>
                                    <div class="file-click">
                                        <input ref="imgContainer" @change="onChangeImg" type="file" accept="image/*"
                                               id="vfile">
                                        <i class="fas fa-images"></i>
                                        이미지 찾기
                                    </div>
                                </div>
                            </li>
                        </ul>
                        <ul class="mileage-box">
                            <li>
                                <div class="mtitle">보유 마일리지</div>
                                <div class="mtext">{{havePoint}}</div>
                            </li>
                            <li>
                                <div class="mtitle">사용 마일리지</div>
                                <div class="mtext2">{{usePoint}}</div>
                            </li>
                            <li>
                                <div class="mtitle">잔여 마일리지</div>
                                <div class="mtext3">{{remainPoint}}</div>
                            </li>
                        </ul>
                    </div>
                    <ul class="button-box">
                        <li>
                            <v-btn
                                class="gray-button"
                                type="button"
                                @click="goMileage()"
                            >
                                마일리지 충전
                            </v-btn>
                        </li>
                        <li>
                            <v-btn
                                class="buy-button"
                                type="button"
                                @click="activeBuy()"
                            >
                                결제하기
                            </v-btn>
                        </li>
                    </ul>
                </div>
            </div>
        </v-dialog>
    </div>
</template>


<script>
	import AUTH from '../../../../api/auth'
	import UTIL from '../../../../api/util'
	import {
		HOST,
		API_URL_METABUS_GET_ITEM_APPLY,
		API_URL_METABUS_GET_ITEM_INFO_BY_CODE,
		API_URL_MEMBER_GET_BANK,
		API_URL_METABUS_GET_ITEM_PRESENT_GOODS,
		API_URL_METABUS_GET_ITEM_BUY_HOME,
		API_URL_METABUS_GET_ITEM_BUY_GOODS,
		API_URL_METABUS_PRESENT_IMMEDIATELY_APPLY,
	} from '../../../../api/urls';
	import apiService from '../../../../api/apiService';
	import {mapGetters} from "vuex";

	export default {
		name: 'webGlitemView',
		props: ["gHome", "gcode", "mtype","itemType"],
		computed: {
			...mapGetters('etc', ["getUid"]),
			...mapGetters('member', ["getMtype"])
		},
		watch: {

			getMtype(val) {
				let memberInfo = AUTH.getSession(this.$isMobile());
				if (memberInfo.AUTHTOKEN) {
					this.isLogin = true;
					this.uid = memberInfo.uid;

				} else {
					this.isLogin = false;
					this.uid = '';
				}
			},
			modalShow(val) {
				if (!val) {
					if (this.presentResult && this.payNo) {
						this.$emit('webGlModalHide', {type: 'present', pno: this.payNo.toString()});
					}
				}
			}

		},
		data() {
			return {
				host: HOST,
				isLogin: false,
				ownerUid: '',
				info: {},
				uid: '',
				pagecode: '',
				ptNo: '',
				modalShow: false,
				popTitle: '',
				buyType: '',
				payNo: '',
				usePoint: '',
				havePoint: '',
				remainPoint: '',
				nameplate: '',
				fileName: '',
				nameplateImg: '',
				presentResult: false,
				nameplateErrors: [],
			}
		},
		created() {
			this.ownerUid = this.getUid;
			let memberInfo = AUTH.getSession(this.$isMobile());
			if (memberInfo.AUTHTOKEN) {
				this.isLogin = true;
				this.uid = memberInfo.uid;

			}
			this.getData();

		},
		methods: {
			close() {
				this.$emit('webGlModalHide', {type: 'close'});
			},
			closeCompleteResult() {
				this.modalShow = false

			},
			getData() {

				const frm = new FormData()
				frm.append('gcode', this.gcode)
				let gHome = (this.gHome) ? 'home' : 'item';
				frm.append('itemType', gHome)
				apiService.post(API_URL_METABUS_GET_ITEM_INFO_BY_CODE, frm, (res) => {
					this.info = res.info;
					this.no = res.info.no;

				});

			},
			itemApply() {
				if (this.uid == this.ownerUid) {
					const frm = new FormData()
					frm.append('no', this.no)
					this.$eventBus.$emit('overlay', 'open');

					apiService.post(API_URL_METABUS_GET_ITEM_APPLY, frm, (res) => {
						this.$eventBus.$emit('overlay', 'hide');

						if (res.msg == 'isGoods') {
							let params = {
								message: '이미 적용된 아이템입니다',
							};
							this.$eventBus.$emit('modalOpen', params);
						} else if (res.msg == 'succ') {
							let params = {
								message: '아이템을 적용하였습니다',
							};
							this.$eventBus.$emit('modalOpen', params);
						}
					});
				}
			},
			goodsPresent() {
				if (this.uid) {
					this.getMyPoint();
					this.buyType = 'present';
					this.popTitle = '선물하기';
					this.modalShow = true;

				} else {
					let params = {
						message: '먼저 로그인 하세요',
					};
					this.$eventBus.$emit('modalOpen', params);
				}
			},
			goMileage() {
				this.$router.push('/main/mypage/myPoint')
			},
			activeBuy() {
				if (this.buyType == 'present') {
					this.presentAction();
				} else {
					if (this.gHome) {
						this.buyHomeAction();
					} else {
						this.buyAction();
					}
				}
			},
			buyHomeAction() {
				if (!this.nameplate) {
					this.nameplateTouch();
					return;
				}
				if (!this.fileName) {
					let params = {
						message: '이미지를 등록하세요',
					};
					this.$eventBus.$emit('modalOpen', params);
					return;
				}
				const frm = new FormData()
				frm.append('uid', this.uid)
				frm.append('no', this.no)
				frm.append('nameplate', this.nameplate)
				frm.append('nameplateImg', this.nameplateImg)

				this.$eventBus.$emit('overlay', 'open');

				apiService.postFile(API_URL_METABUS_GET_ITEM_BUY_HOME, frm, (res) => {
					this.$eventBus.$emit('overlay', 'hide');
					this.modalShow = false;
					if (res.msg == 'emptyPoint') {
						let params = {
							message: '보유 마일리지가 부족합니다',
						};
						this.$eventBus.$emit('modalOpen', params);
					} else if (res.msg == 'maxBuy') {
						let params = {
							message: '한월드(마을)에서 구매가능한 최대 집수는 3채 입니다',
						};
						this.$eventBus.$emit('modalOpen', params);


					} else if (res.msg == 'succ') {
						this.$emit('webGlModalHide', {type: 'homeBuy', uid: this.uid, nameplate: this.nameplate});
						let params = {
							message: '아이템을 구매하였습니다',
						};
						this.$eventBus.$emit('modalOpen', params);
					}
				});
			},
			buyAction() {
				const frm = new FormData()
				frm.append('uid', this.uid)
				frm.append('no', this.no)
				this.$eventBus.$emit('overlay', 'open');

				apiService.post(API_URL_METABUS_GET_ITEM_BUY_GOODS, frm, (res) => {
					this.$eventBus.$emit('overlay', 'hide');
					this.modalShow = false;
					if (res.msg == 'emptyPoint') {
						let params = {
							message: '보유 마일리지가 부족합니다',
						};
						this.$eventBus.$emit('modalOpen', params);
					} else if (res.msg == 'isGoods') {
						let params = {
							message: '이미 구매한 아이템입니다',
						};
						this.$eventBus.$emit('modalOpen', params);
					} else if (res.msg == 'succ') {
						let params = {
							message: '아이템을 구매하였습니다',
						};
						this.$emit('webGlModalHide', {type: 'itemBuy', resultType: res.resultType});
						this.$eventBus.$emit('modalOpen', params);
					}
				});
			},
			presentAction() {
				const frm = new FormData()
				frm.append('uid', this.uid)
				frm.append('targetUid', this.ownerUid);
				frm.append('no', this.no)
				this.$eventBus.$emit('overlay', 'open');

				apiService.post(API_URL_METABUS_GET_ITEM_PRESENT_GOODS, frm, (res) => {
					this.$eventBus.$emit('overlay', 'hide');
					if (res.msg == 'emptyPoint') {
						this.modalShow = false;

						let params = {
							message: '보유 마일리지가 부족합니다',
						};
						this.$eventBus.$emit('modalOpen', params);

					} else if (res.msg == 'complete') {
						this.popTitle = '결제완료';
						this.presentResult = true;

						this.payNo = res.payno;


					}
				});
			},
			goodsBuy() {
				if (this.uid) {
					this.getMyPoint();
					this.buyType = 'buy';
					this.popTitle = '구매하기';
					this.modalShow = true;
					this.nameplate = '';
					this.fileName = '';
					this.nameplateImg = '';

				} else {
					let params = {
						message: '먼저 로그인 하세요',
					};
					this.$eventBus.$emit('modalOpen', params);
				}
			},
			getMyPoint() {
				const frm = new FormData()
				apiService.post(API_URL_MEMBER_GET_BANK, frm, (res) => {
					if(!res.info.point)res.info.point=0;
					if(!this.info.price)this.info.price=0;
					this.havePoint = UTIL.numberFormat(res.info.point);
					if(this.info.price>0) {
						this.usePoint = '-' + UTIL.numberFormat(this.info.price);
					} else {
						this.usePoint = 0;
                    }
					let remainPoint = parseInt(res.info.point) - parseInt(this.info.price);
					if(isNaN(remainPoint)) {
						this.remainPoint = '마일리지 부족'
                    } else {
						if (remainPoint < 0) {
							this.remainPoint = '마일리지 부족'
						} else this.remainPoint = UTIL.numberFormat(remainPoint);
					}
				});
			},
			immediatelyPresnetAction(payno) {
				const frm = new FormData()
				frm.append('payno', payno)
				this.$eventBus.$emit('overlay', 'open');
				apiService.post(API_URL_METABUS_PRESENT_IMMEDIATELY_APPLY, frm, (res) => {
					this.$eventBus.$emit('overlay', 'hide');
					let msg = '';
					if (res.msg == 'isGoods') {
						msg = '죄송합니다<br>선택하는 시간동안 다른분이 먼저 아이템을 적용하였습니다<br>아이템은 1일후에 적용됩니다';
						this.$emit('webGlModalHide', {type: 'present', apply: 'reserve'});
					} else {
						msg = '아이템이 적용되었습니다';
						this.$emit('webGlModalHide', {type: 'present', apply: 'now'});
					}
					let params = {
						message: msg,
					};

					this.$eventBus.$emit('modalOpen', params);
				});
			},
			onChangeImg() {
				const imgObj = this.$refs.imgContainer.files;
				let img = imgObj.length > 0 ? imgObj[0] : null;
				this.fileName = img.name;
				this.nameplateImg = img;


			},
			nameplateTouch() {
				this.nameplateErrors = []
				if (!this.nameplate) {
					this.nameplateErrors.push('명패를 입력해주세요');
				}
			}


		}

	}
</script>

<style lang="scss" scoped="true">
    .webgl-contents {
        width: 100%;
        background: #fff;
        .header-box {
            border-bottom: solid 1px #dcdcdc;
            height: 60px;
            padding: 0 20px;
            display: flex;
            justify-content: space-between;
            .stitle {
                font-size: 14pt;
                font-weight: bold;
                padding: 0;
                color: #000;
                text-align: left;
                line-height: 60px;

            }
            .del-box {
                width: 10px;
                font-size: 14pt;
                color: #999;
                text-align: right;
                line-height: 60px;
                i {
                    cursor: pointer;
                }
            }

        }
        .article-info {
            width: 100%;
            padding: 20px;
            display: flex;
            .img-box {
                border: solid 1px #686EFB;
                width: 160px;
                padding: 0;
                text-align: center;
                margin: auto;
                height: 140px;
                table {
                    width: 100%;
                    td {
                        text-align: center;
                        height: 140px;
                        width: 100%;
                        overflow: hidden;
                        padding: 0;
                        img {
                            max-width: 100%;

                        }
                    }
                }

            }
            .content-box {
                width: 80%;
                margin-left: 30px;
                .g-title {
                    color: #000;
                    font-size: 14pt;
                    margin-top: 30px;
                    font-weight: bold;
                }
                .price {
                    color: #686EFB;
                    font-weight: bold;
                    margin: 50px 0 0 0;
                    span {
                        color: #fff;
                        font-weight: normal;
                        width: 18px;
                        height: 18px;
                        background: #686EFB;
                        border-radius: 50%;
                        text-align: center;
                        line-height: 18px;
                        display: inline-block;
                        font-size: 8pt;
                    }
                }

            }
        }
        .desc {
            color: #000;
            margin: 0 20px 20px 20px;
            background: #f4f4f4;
            border: solid 1px #DCDCDC;
            min-height: 150px;
            padding: 20px;
            font-size: 10pt;
            border-radius: 10px;
        }
        .list-button-box {
            padding: 0;
            display: flex;
            width: 100%;
            li {
                width: 100%;
                .present-button {
                    width: 100%;
                    backgroud: #fff;
                    border: solid 2px #686EFB;
                    height: 60px;
                    font-size: 14pt;
                    border-radius: 0;
                    color: #686EFB;
                }
                .buy-button {
                    width: 100%;
                    color: #fff;
                    background: #686EFB;
                    height: 60px;
                    font-size: 14pt;
                    border-radius: 0;
                }
                .g-button {
                    width: 100%;
                    height: 60px;
                    font-size: 14pt;
                    border-radius: 0;
                }
                &.wide-box {
                    .buy-button {
                        width: 100%;
                    }
                }
            }
        }

    }

    .modal-container {
        width: 100%;
        background: #fff;
        ul {
            padding: 0;
            li {

            }
        }

        .header-box {
            background: #fff;
            color: #000;
            display: flex;
            height: 70px;
            line-height: 70px;
            border-bottom: solid 1px #ccc;
            margin-bottom: 0;
            .sub-title {
                width: 98%;
                font-weight: bold;
                font-size: 14pt;
                padding-left: 30px;
            }
            span {
                width: 40px;
                text-align: center;
                margin-right: 10px;
                cursor: pointer;
                font-size: 17pt;
            }

        }
        .modal-content {
            padding: 30px 30px 50px 30px;
            margin: 0;
            .info-box {
                width: 100%;
                padding: 0;
                display: flex;
                .img-box {
                    border: solid 1px #EBEBEB;
                    width: 120px;
                    padding-top: 10px;
                    text-align: center;
                    max-height: 120px;
                    height: 100px;
                    overflow: hidden;
                    img {
                        max-width: 100%;
                        height: auto;
                    }

                }
                .content-box {
                    width: 80%;
                    margin-left: 30px;
                    .g-title {
                        color: #000;
                        font-size: 14pt;
                        font-weight: bold;
                    }
                    .desc {
                        color: #999;
                        margin: 4px 0 0 0;
                        height: 40px;
                        font-size: 10pt;
                        overflow-y: hidden;
                    }
                    .price {
                        color: #686EFB;
                        font-weight: bold;
                        margin: 0;
                        span {
                            color: #fff;
                            font-weight: normal;
                            width: 18px;
                            height: 18px;
                            background: #686EFB;
                            border-radius: 50%;
                            text-align: center;
                            line-height: 18px;
                            display: inline-block;
                            font-size: 8pt;
                        }
                    }
                }
            }
            .home-input-box {
                margin-top: 25px;
            }
            .mileage-box {
                margin-top: 40px;
                border: solid 1px #E7E7E7;
                border-radius: 19px;
                background: #F4F4F4;
                padding: 0 20px;
                li {
                    display: flex;
                    justify-content: space-between;
                    padding: 15px 0;
                    border-bottom: solid 1px #E7E7E7;
                    font-size: 11pt;
                    .mtitle {
                        color: #000;
                    }
                    .mtext {
                        color: #000;
                        font-weight: bold;
                    }
                    .mtext2 {
                        color: #FE6055;
                        font-weight: bold;
                    }
                    .mtext3 {
                        color: #686EFB;
                        font-weight: bold;
                    }

                }
            }

        }
        .button-box {
            padding: 0;
            display: flex;
            li {
                width: 50%;
                .buy-button {
                    width: 100%;
                    color: #fff;
                    background: #686EFB;
                    height: 60px;
                    font-size: 13pt;
                    border-radius: 0;
                }
                .gray-button {
                    width: 100%;
                    color: #fff;
                    background: #999;
                    height: 60px;
                    font-size: 13pt;
                    border-radius: 0;
                }
            }
            &.single {
                li {
                    width:100%;
                }
            }
        }
    }

    .file-box {
        margin: 0 0 30px 0;
        display: flex;
        width: 100%;
        padding: 0;
        min-height: 43px;
        .file-names {
            width: 100%;
            border: solid 1px #9E9E9E;
            border-right: none;
            border-radius: 5px 0 0 5px;
            padding: 0;
            i {
                margin: 3px 0 0 7px;
                cursor: pointer;
            }
            .inputText {
                display: inline-block;
                padding: 7px 0 0 10px;
            }

        }
        .file-click {
            position: relative;
            width: 200px;
            background: #fff;
            border: solid 1px #9E9E9E;
            text-align: center;
            color: #000;
            cursor: pointer;
            border-radius: 0 5px 5px 0;
            min-height: 43px;
            height: 40px;
            font-size: 10pt;
            padding-top: 8px;
            #vfile, #dfile {
                opacity: 0;
                width: 100%;
                position: absolute;
                right: 0;
                min-height: 43px;

                z-index: 2;
            }
            i {
                position: relative;
                top: 2px;
                font-size: 15pt;
                margin-right: 10px;

            }
        }
    }
</style>