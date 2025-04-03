<template>
    <div :class="'data-contents '+mobileClass">
        <div class="search-box" v-if="!mobileView">
            <div class="text">아이템</div>
        </div>
        <div class="article-info">
            <div class="img-box">
                <img :src="host+info.img">
            </div>
            <div class="content-box">
                <div class="g-title">
                    {{info.name}}
                </div>
                <div class="price">
                    <span>M</span> {{info.vprice}}
                </div>
                <div class="desc" v-html="info.summary">
                </div>


                <ul class="list-button-box" v-if="pagecode=='myitem'">
                    <li class="wide-box" >
                        <v-btn
                            class="g-button"
                            type="button"
                            color="#686EFB"
                            outlined
                            @click="itemApply()"
                        >
                            적용하기
                        </v-btn>
                    </li>
                </ul>
                <ul class="list-button-box" v-else-if="pagecode=='list' && mtype=='shop'">
                    <li>
                        <v-btn
                            class="present-button"
                            type="button"
                            @click="goodsPresent()"
                        >
                            선물하기
                        </v-btn>

                    </li>
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
                <ul class="list-button-box" v-else-if="pagecode=='list'">
                    <li class="wide-box" >
                        <v-btn
                            class="buy-button"
                            type="button"
                            @click="goodsBuy()"
                        >
                            구매하기
                        </v-btn>
                    </li>
                </ul>


            </div>
            <div class="mobile-list-button" v-if="mobileView">
                <span @click="$router.back()">목록</span>
            </div>
        </div>
        <v-dialog
            v-model="modalShow"
            width="450"
            style="z-index:100;"
        >
            <div :class="'modal-container '+mobileClass">
                <div class="header-box">
                    <div class="sub-title"> {{popTitle}}</div>
                    <span @click="modalShow=false"><i class="fa fa-times"></i></span>
                </div>
                <div class="modal-content" v-if="!presentResult">
                    <div class="info-box">
                        <div class="img-box">
                            <img :src="host+info.img">
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
                <ul class="button-box" v-if="!presentResult">
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
                <div class="modal-content comp" v-if="presentResult">
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
        </v-dialog>
    </div>
</template>


<script>
	import AUTH from '../../../../api/auth'
	import UTIL from '../../../../api/util'
	import {
		HOST,
		API_URL_METABUS_GET_ITEM_APPLY,
		API_URL_METABUS_GET_ITEM_INFO,
		API_URL_MEMBER_GET_BANK,
		API_URL_METABUS_GET_ITEM_PRESENT_GOODS,
		API_URL_METABUS_GET_ITEM_BUY_GOODS,
		API_URL_METABUS_PRESENT_IMMEDIATELY_APPLY,
	} from '../../../../api/urls';
	import apiService from '../../../../api/apiService';
	import {mapGetters} from "vuex";

	export default {
		name: 'itemView',
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
				if(!val) {
					this.presentResult=false;
				}
            }
		},
		data() {
			return {
				host: HOST,
				isLogin: false,
				no: '',
				ownerUid: '',
				info: {},
				uid: '',
				pagecode: '',
				ptNo: '',
				modalShow: false,
				popTitle: '',
				buyType:'',
                usePoint:'',
			    havePoint:'',
				remainPoint:'',
				mtype:'',
				presentResult:false,
                mobileClass:'',
                mobileView:false,

			}
		},
		created() {
            if (this.$isMobile()) {
                this.mobileView = true;
                this.mobileClass = 'mobile'

            }
			this.ownerUid = this.getUid;
			let memberInfo = AUTH.getSession(this.$isMobile());
			if (memberInfo.AUTHTOKEN) {
				this.isLogin = true;
				this.uid = memberInfo.uid;

			}
			this.pagecode = this.$route.params.pagecode;
			if (this.pagecode == 'goods') {
				let no = this.$route.params.no;
				let nos = no.split('_');
				this.no = nos[0];
				this.ptNo = nos[1];
			} else {
				this.no = this.$route.params.no;
			}

			this.getData();

		},
		methods: {
            closeCompleteResult() {
	           this.modalShow=false
            },
			getData() {

				const frm = new FormData()
				frm.append('no', this.no)
				frm.append('ownerUid', this.ownerUid)
				apiService.post(API_URL_METABUS_GET_ITEM_INFO, frm, (res) => {
					this.info = res.info;
					this.mtype = res.mtype;
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
	            if(this.buyType == 'present') {
		            this.presentAction();
                } else {
		            this.buyAction();
                }
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
		           /*
		            } else if (res.msg == 'confirm') {
			            let params = {
				            type:'confirm',
			            	message: '바로 적용이 가능합니다<br>적용하시겠습니까?',
                            doAction:()=> {
				            	this.immediatelyPresnetAction(res.payno);
                            }
			            };
			            this.$eventBus.$emit('modalOpen', params);
                    */
		            } else if (res.msg == 'complete') {

			            this.popTitle = '결제완료';
			            this.presentResult = true;

		            }
	            });
            },
			goodsBuy() {
				if (this.uid) {
					this.getMyPoint();
					this.buyType = 'buy';
					this.popTitle = '구매하기';
					this.modalShow = true;


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
					if(res.msg =='isGoods') {
						msg = '죄송합니다<br>선택하는 시간동안 다른분이 먼저 아이템을 적용하였습니다<br>아이템은 1일후에 적용됩니다';
                    } else {
						msg = '아이템이 적용되었습니다';
                    }
					let params = {
						message: msg,
					};
					this.$eventBus.$emit('modalOpen', params);
				});
            }


		}

	}
</script>

<style lang="scss" scoped="true">
    .data-contents {
        width: 100%;
        .search-box {
            margin: 10px 0 30px 0;
            padding-bottom: 15px;
            border-bottom: solid 1px #fff;
            .text {
                font-size: 16pt;
                color: #fff;
                font-weight: bold;
            }

        }

        .article-info {
            width: 100%;
            padding: 0;
            display: flex;
            .img-box {
                border: solid 1px #686EFB;
                width: 300px;
                padding: 20px;
                text-align: center;
                margin: auto;
                height: 300px;
                overflow: hidden;
                img {
                    width: auto;
                    max-width: 100%;
                    height: auto;
                }

            }
            .content-box {
                width: 80%;
                margin-left: 30px;
                .g-title {
                    color: #fff;
                    font-size: 20pt;
                    margin-top: 20px;
                    font-weight: bold;
                }
                .desc {
                    color: #999;
                    margin: 4px 0 20px 0;
                    height: 70px;
                    overflow-y: hidden;
                }
                .price {
                    color: #686EFB;
                    font-weight: bold;
                    margin: 30px 0 35px 0;
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
                .list-button-box {
                    padding: 0;
                    display: flex;
                    li {
                        width: 340px;
                        .present-button {
                            width: 300px;
                            backgroud: #fff;
                            border: solid 2px #686EFB;
                            height: 60px;
                            font-size: 15pt;
                            border-radius: 0;
                            color: #686EFB;
                        }
                        .buy-button {
                            width: 300px;
                            color: #fff;
                            background: #686EFB;
                            height: 60px;
                            font-size: 15pt;
                            border-radius: 0;
                        }
                        .g-button {
                            width: 300px;
                            height: 60px;
                            font-size: 15pt;
                            border-radius: 0;
                        }
                        &.wide-box {
                            .buy-button {
                                width: 570px;
                            }
                        }
                    }
                }
            }
        }
        &.mobile {
            .article-info {
                width: 100%;
                padding: 0;
                display: block;
                .img-box {
                    border: solid 1px #686EFB;
                    width:100%;
                    padding: 20px;
                    text-align: center;
                    margin: auto;
                    height:250px;
                    overflow: hidden;
                    img {
                        width: auto;
                        max-width: 100%;
                        height: auto;
                    }

                }
                .content-box {
                    width:100%;
                    margin-left:0;
                    .g-title {
                        color: #fff;
                        font-size: 14px;
                        margin-top: 20px;
                        font-weight: bold;
                    }
                    .desc {
                        color: #999;
                        margin: 4px 0 10px 0;
                        height: 70px;
                        font-size:12px;
                        overflow-y: hidden;
                    }
                    .price {
                        color: #686EFB;
                        font-weight: bold;
                        margin:10px 0;
                        margin:10px 0;
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
                            font-size: 10pt;
                        }
                    }
                    .list-button-box {
                        padding: 0 0 20px 0;
                        display: flex;
                        justify-content: space-between;
                        li {
                            &:last-child {
                                margin-right: 0;
                            }
                            width:50%;
                            margin-right:10px;
                            .present-button {
                                width: 100%;
                                backgroud: #fff;
                                border: solid 2px #686EFB;
                                height: 50px;
                                font-size: 14px;
                                border-radius: 0;
                                color: #686EFB;
                            }
                            .buy-button {
                                width: 100%;
                                color: #fff;
                                background: #686EFB;
                                height: 50px;
                                font-size: 14px;
                                border-radius: 0;
                            }
                            .g-button {
                                width: 100%;
                                height: 50px;
                                font-size: 14px;
                                border-radius: 0;
                            }
                            &.wide-box {
                                .buy-button {
                                    width:100%;
                                }
                            }
                        }
                    }
                }
                .mobile-list-button {
                    text-align:center;
                    text-decoration: underline;
                    font-size:13px;
                    color:#999;
                    margin-bottom:40px;
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
            margin-bottom:0;
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
            padding:30px 30px 50px 30px;
            margin:0;
            .info-box {
                width: 100%;
                padding:0;
                display: flex;
                .img-box {
                    border: solid 1px #EBEBEB;
                    width:120px;
                    padding-top: 10px;
                    text-align: center;
                    max-height: 120px;
                    height: 100px;
                    overflow: hidden;
                    img {
                        width: auto;
                        max-width: 100%;
                        height: auto;
                    }

                }
                .content-box {
                    width: 80%;
                    margin-left: 30px;
                    .g-title {
                        color: #000;
                        font-size:14pt;
                        font-weight: bold;
                    }
                    .desc {
                        color: #999;
                        margin: 4px 0 0 0;
                        height: 40px;
                        font-size:10pt;
                        overflow-y: hidden;
                    }
                    .price {
                        color: #686EFB;
                        font-weight: bold;
                        margin:0;
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
            .mileage-box {
                margin-top:40px;
                border:solid 1px #E7E7E7;
                border-radius:19px;
                background:#F4F4F4;
                padding:0 20px;
                li {
                    display:flex;
                    justify-content: space-between;
                    padding:15px 0;
                    border-bottom:solid 1px #E7E7E7;
                    font-size:11pt;
                    .mtitle {
                        color:#000;
                    }
                    .mtext {
                        color:#000;
                        font-weight:bold;
                    }
                    .mtext2 {
                        color:#FE6055;
                        font-weight:bold;
                    }
                    .mtext3 {
                        color:#686EFB;
                        font-weight:bold;
                    }


                }

            }
            &.comp {
                 padding:30px 0 20px 0;
                text-align:center;
                .comp-title {
                    color:#000;
                    font-size:17pt;
                    font-weight:bold;
                }
                .comp-msg {
                    font-size:11pt;
                    margin-top:15px;
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
        &.mobile {
            .header-box {
                height: 50px;
                line-height: 50px;
                .sub-title {
                    font-size: 15px;

                }
                span {
                    font-size: 17px;
                }

            }
            .modal-content {
                padding:30px 30px 50px 30px;
                margin:0;
                .info-box {
                    .content-box {
                        .g-title {
                            font-size:14px;
                        }
                        .desc {
                            font-size:12px;
                        }
                    }
                }
                .mileage-box {
                    li {
                        font-size:13px;

                    }

                }
                &.comp {
                    .comp-title {
                        font-size:17px;
                    }
                    .comp-msg {
                        font-size:11px;
                    }
                }

            }
            .button-box {
                li {
                    .buy-button {
                        height: 50px;
                        font-size: 14px;

                    }
                    .gray-button {
                        height: 50px;
                        font-size: 14px;

                    }
                }
            }
        }
    }

</style>