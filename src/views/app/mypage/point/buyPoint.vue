<template>
    <div class="member-container">
        <div id="screenLayout" :class="'myPaymentFrameLayout '+mobileClass" v-if="paymentFrameShow">
            <div id="bannerPaymentFrameBox">
                <iframe id="bannerPaymentFrame" :src="paymentFrameSrc" frameborder="0"
                        scrolling="0"></iframe>
            </div>
        </div>
        <div :class="'contents '+mobileClass">
            <div class="from-box">
                <form novalidate @submit.prevent="validate">
                    <ul class="field-box">
                        <li>
                            <div class="square-box">
                                <div class="gtitle">보유 마일리지</div>
                                <div class="gprice">{{myPoint}}<span>원</span></div>
                            </div>
                        </li>

                        <li>
                            <div class="input-title">충전금액</div>
                            <ul class="price-box">
                                <li v-for="item in priceList" :class="item.gclass" @click="setPrice(item.price)">+{{item.price}}만</li>
                            </ul>
                            <div class="field-input">

                                <v-text-field
                                    v-model="viewPrice"
                                    readonly
                                    label=""
                                    suffix="원"
                                    :dense="dense"
                                    required
                                    @input="$v.price.$touch()"
                                    @blur="$v.price.$touch()"
                                    :error-messages="priceErrors"
                                    outlined
                                ></v-text-field>
                            </div>
                        </li>

                        <li>
                            <div class="input-title">결제방법</div>
                            <div class="field-input">
                                <v-radio-group v-model="payMethod" row>
                                    <v-radio
                                        color="#686EFB"
                                        label="신용카드"
                                        value="card"
                                    ></v-radio>
                                    <v-radio
                                        color="#686EFB"
                                        label="계좌이체"
                                        value="bank"
                                    ></v-radio>
                                </v-radio-group>

                            </div>

                        </li>
                        <li>
                            <div class="solid-box">
                                <div class="solit-title">결제시 주의사항</div>
                                <div class="text">
                                    - 신용카드 충전 서비스는 결제대행업체(PG사) 와의
                                    제휴된 신용카드만<br v-if="!mobileView"> <span style="padding-left:7px;">이용 가능합니다.</span><br><br>
                                    - 충전된 마일리지는 메타룸에서만 이용이 가능하며
                                    출금이<br v-if="!mobileView"> <span style="padding-left:7px;">불가능합니다.</span>

                                </div>
                            </div>
                        </li>
                        <li>
                            <div class="radio-box">
                                <div class="radio-box-item" @click="setAgree()">
                                    <div :class="'icon-box '+agreeGclass">
                                        <i class="fas fa-check"></i>
                                    </div>
                                    <div class="text">구매에 동의합니다</div>
                                </div>
                            </div>
                        </li>
                    </ul>


                    <p>
                        <v-btn
                            type="submit"
                            class="submit-button" style="background:#686EFB;color:#fff;"
                        >
                            마일리지 충전하기
                        </v-btn>
                    </p>

                </form>
            </div>

        </div>

    </div>
</template>


<script>
	import UTIL from '../../../../api/util'
	import {validationMixin} from 'vuelidate'
	import {required, email} from 'vuelidate/lib/validators'
	import {
		API_URL_MEMBER_UPDATE,
		API_URL_MEMBER_GET_BANK,
		API_URL_MEMBER_POINT_PAYMENT,
	} from '../../../../api/urls';
	import apiService from '../../../../api/apiService';

	export default {
		name: 'buyPoint',
		mixins: [validationMixin],
		validations: {
			price: {required},


		},
		data() {
			return {
				paymentFrameShow: false,
				paymentFrameSrc: '',
				insertFlag: false,
				price: '',
				myPoint:0,
				priceList:[
					{price:100,gclass:''},
					{price:10,gclass:''},
					{price:5,gclass:''},
					{price:1,gclass:''},
                ],
				mobileView: false,
				mobileClass: '',
				agreeGclass: '',
	            viewPrice:'',
				payMethod:'card',
                memberInfo:{},
                dense:false,
			}
		},
		created() {
			if (this.$isMobile()) {
				this.mobileView = true;
				this.mobileClass = 'mobile'
                this.dense = true;
			}
			this.$eventBus.$on('pointPaymentClose', this.pointPaymentClose);
			this.getMemberInfo();
		},
		computed: {
			priceErrors() {
				const errors = []
				if (!this.$v.price.$dirty) return errors
				!this.$v.price.required && errors.push('충전금액을 선택하세요')
				return errors
			},


		},
		methods: {
			getMemberInfo() {
				const frm = new FormData()
				apiService.post(API_URL_MEMBER_GET_BANK, frm, (res) => {
					if(res.info.point)this.myPoint = UTIL.numberFormat(res.info.point);
					this.memberInfo = res.info;
				})
            },
			validate() {

				this.$v.$touch()
				if (!this.$v.$anyError) {
					this.formSubmit();
				}

			},
			setPrice(price) {
			    for(let item of this.priceList) {
			    	if(item.price==price)item.gclass='active';
			    	else item.gclass=''
                }
                this.price = price * 10000;
                this.viewPrice = UTIL.numberFormat(this.price);
            },
			setAgree() {
				if (this.agreeGclass == 'active') {
					this.agreeGclass = ''
				} else {
					this.agreeGclass = 'active'
				}
			},
			formSubmit() {
                if(!this.agreeGclass) {
	                let params = {
		                message: '결제시 주의사항에 동의해주세요',
	                };
	                this.$eventBus.$emit('modalOpen', params);
	                return;
                }
				if (this.insertFlag) return;
				this.insertFlag = true;

				const frm = new FormData()
				frm.append('price', this.price)
				frm.append('paymentMethod',this.payMethod);
				this.$eventBus.$emit('overlay', 'open');

				apiService.post(API_URL_MEMBER_POINT_PAYMENT, frm, (res) => {
					this.$eventBus.$emit('overlay', 'hide');
                   this.insertFlag = false;
                        if(res.orderId) {
	                        this.setBannerPaymentFrame(res.orderId);
                        }


				})
			},
			setBannerPaymentFrame(orderId) {
				this.paymentFrameShow = true;
                let device = (this.mobileView)?'m':'pc';
				this.paymentFrameSrc = 'https://duckku.com/api/danalPayment/pointPayment?orderId=' +orderId+'&device='+device+'&name='+this.memberInfo.name+'&email='+this.memberInfo.email+'&itemName=마일리지충전';
			},
			pointPaymentClose(cmd) {
				this.paymentFrameShow = false;
				this.paymentFrameSrc = '';
				let params = {};
				switch(cmd) {
					case 'succ':
						params = {
							message: '마일리지를 충전하였습니다',
							doAction: () => {
                                this.$emit('goHistory');
							}
						};
						this.$eventBus.$emit('modalOpen', params);
						break;
					case 'fail':
						params = {
							message: '결제에 실패하였습니다',
						};
						this.$eventBus.$emit('modalOpen', params);
						break;

				}
			}
		},
        beforeDestroy() {
	        this.$eventBus.$off('pointPaymentClose');
        }

	}
</script>
<style lang="scss" scoped>
    .member-container {
        width: 100%;
        background: #fff;
        padding: 0;
        .contents {
            width: 100%;
            margin: auto;
            padding: 30px 0 80px 0;
            text-align: center;
            .submit-button {
                margin: 50px auto 0 auto;
                width: 100%;
                border-radius: 0;
                min-height: 70px;
                font-size: 12pt;
            }

            .stitle {
                font-size: 20pt;
                font-weight: bold;
                padding: 0 0 30px 0;
            }
            .sub-title {
                font-size: 16pt;
                font-weight: bold;
                padding: 20px 0 15px 0;
            }
            .space {
                height: 20px;
            }
            .uidResultClass {
                margin: -25px 0 10px 0;
                font-size: 9pt;
                &.succ {
                    color: #303E9F;
                }
                &.double {
                    color: #f00;
                }
            }
            .field-box {
                padding: 0;
                width: 100%;
                margin: 0;
                li {
                    width: 100%;
                    border: none;
                    display: inline-block;
                    padding-left: 0;
                    padding-right: 0;
                    .field-input {
                        width: 100%;

                    }
                    .date-box {
                        width: 100%;
                    }

                }
            }
            .price-box {
                padding:0;
                display:flex;
                justify-content: space-between;
                margin-bottom:10px;
                li {
                    width:24.5%;
                    height:50px;
                    text-align:center;
                    font-size:10pt;
                    color:#fff;
                    line-height:50px;
                    background:#DCDCDC;
                    cursor:pointer;
                    &.active {
                        background:#686EFB;
                    }
                }
            }
            .solid-box {
                border:solid 1px #E8E8E8;
                background:#F4F4F4;
                text-align:left;
                padding:20px;
                font-size:10pt;
                .solit-title {
                    font-weight:bold;
                    margin-bottom:10px;
                    color:#000;
                }
                .text {
                    color:#777;
                }
             }
            .square-box {
                border:solid 3px #686EFB;
                width:100%;
                padding:25px 15px 0 15px;
                height:74px;
                display:flex;
                justify-content: space-between;
                .gtitle {
                    font-size:11pt;
                    color:#686EFB;
                }
                .gprice {
                    margin-top:-8px;
                    color:#FF5A4E;
                    font-size:18pt;
                    font-weight:bold;
                    span {
                        color:#000;
                        font-size:11pt;
                        font-weight:normal;
                    }
                }
            }
            .radio-box {
                margin-top: -5px;
                margin-bottom: 10px;
                .radio-box-item {
                    display: flex;
                    cursor: pointer;
                    .icon-box {
                        width: 30px;
                        height: 30px;
                        border-radius: 50%;
                        text-align: center;
                        color: #dcdcdc;
                        border: solid 1px #ccc;
                        line-height: 30px;
                        margin-right: 5px;
                        &.active {
                            background: #686EFB;
                            color: #fff;
                        }
                    }
                    .text {
                        font-size: 10pt;
                        padding-top: 5px;
                    }
                }

            }
            .input-title {
                font-size:11pt;
                color:#000;
                text-align:left;
                margin:10px 0;
            }
            &.mobile {
                width: 100%;
                padding:0;
                .submit-button {
                    margin: 30px auto 0 auto;
                    width:100%;
                    border-radius: 0;
                    min-height:50px;
                    font-size: 10pt;
                }
                .square-box {
                    padding:13px 15px 0 15px;
                    height:50px;

                }
                .price-box {
                    li {
                        height:40px;
                        line-height:40px;
                    }
                }
                .input-title {
                    margin:5px 0;
                }
                .solid-box {
                    border:solid 1px #E8E8E8;
                    background:#F4F4F4;
                    text-align:left;
                    padding:10px;
                    font-size:8pt;
                    .solit-title {
                        font-weight:bold;
                        margin-bottom:9px;
                        color:#000;
                    }
                    .text {
                        color:#777;
                    }
                }

            }

        }

    }
    #screenLayout {
        width: 100%;
        height: calc(100vh);
        top: 0;
        left: 0;
        background: rgba(0, 0, 0, 0.5);
        position: fixed;
        z-index: 1000000;
        #bannerPaymentFrameBox {
            width: 660px;
            height: 495px;
            margin: 150px auto 0 auto;
            background: #fff;
            #bannerPaymentFrame {
                width: 660px;
                height: 495px;

            }
        }
        &.mobile {
            #bannerPaymentFrameBox {
                width:100%;
                height: calc(100vh);
                margin:0;
                background: #fff;
                #bannerPaymentFrame {
                    width:100%;
                    height: calc(100vh);

                }

            }

        }
    }
    .myPaymentFrameLayout {
        &.mobile {
            width: 100%;
            height: calc(100vh);
            top: 0;
            left: 0;
            background: rgba(0, 0, 0, 0.5);
            position: fixed;
            z-index: 1000000;

            #my-bannerPaymentFrameBox {
                width:100%;
                min-height: calc(100vh);
                margin:0;
                background: #fff;
            }
        }
    }
</style>