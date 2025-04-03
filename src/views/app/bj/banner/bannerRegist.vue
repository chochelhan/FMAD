<template>
    <div :class="'modal-container '+mobileClass">
        <div class="header-box" v-if="!mobileView">
            <div class="sub-title">{{topTitle}}</div>
            <span @click="modalHide()"><i class="fa fa-times"></i></span>
        </div>
        <div class="form-box">
            <ul class="banner-tab" v-if="!modify">
                <li v-for="banner in bannerList" :class="'tab-item '+banner.gclass" @click="selectBanner(banner.code)">
                    {{banner.name}}
                </li>
            </ul>
            <div class="choice-banner-img" v-if="!modify">
                <img src="../../../../assets/images/img_ad_pc1.png" v-if="imgView.pcmain">
                <img src="../../../../assets/images/img_ad_pc1.png" v-else-if="imgView.pcbrd">
                <img src="../../../../assets/images/img_ad_pc1.png" v-else-if="imgView.mobmain">
                <img src="../../../../assets/images/img_ad_pc1.png" v-else-if="imgView.mobbrd">
            </div>
            <div class="banner-guide" v-if="!modify">
                <div class="banner-guide-title">{{bannerTitle[bannerType]}}</div>
                <div class="banner-guide-desc" v-html="bannerDesc[bannerType]"></div>
            </div>
            <div :class="'stitle '+titleClass"><span class="line">{{title}}</span></div>
            <form novalidate @submit.prevent="validate">
                <ul class="form-basic">
                    <li class="item-list" v-if="!modify">
                        <div class="sub-title">광고 유형 선택</div>
                        <v-radio-group v-if="!mobileView" class="radio-box" row v-model="bannerType">
                            <v-radio
                                color="#686EFB"
                                v-for="item in bannerList"
                                :key="item.code"
                                :label="item.name"
                                :value="item.code"
                            ></v-radio>
                        </v-radio-group>
                        <v-radio-group v-if="mobileView" class="radio-box" cols v-model="bannerType">
                            <v-radio
                                color="#686EFB"
                                v-for="item in bannerList"
                                :key="item.code"
                                :label="item.name"
                                :value="item.code"
                            ></v-radio>
                        </v-radio-group>
                    </li>
                    <li class="item-list" v-if="!modify">
                        <div class="sub-title">광고 상품 선택</div>
                        <v-radio-group v-if="!mobileView" class="radio-box" row v-model="bannerCode">
                            <v-radio
                                color="#686EFB"
                                v-for="item in codeList"
                                :key="item.code"
                                :label="item.name"
                                :value="item.code"
                            ></v-radio>
                        </v-radio-group>
                        <v-radio-group v-if="mobileView" class="radio-box" cols v-model="bannerCode">
                            <v-radio
                                color="#686EFB"
                                v-for="item in codeList"
                                :key="item.code"
                                :label="item.name"
                                :value="item.code"
                            ></v-radio>
                        </v-radio-group>
                    </li>
                    <li class="item-list">
                        <div class="sub-title">배너 이미지</div>
                        <div class="file-box">
                            <div class="file-names">
                                <span class="inputText"> {{fileName}}</span>
                            </div>
                            <div class="file-click">
                                <input ref="imgContainer" @change="onChangeImg" type="file" accept="image/*" id="vfile">
                                <i class="fas fa-images"></i>
                                이미지 찾기
                            </div>
                        </div>
                        <div v-if="imgGuide" style="margin:-20px 0 10px 0;font-size:10pt;">{{imgGuide}}</div>
                        <div class="img-preview" v-if="modify">
                            <img :src="host+previewImg">
                        </div>

                    </li>
                    <li class="item-list">
                        <div class="sub-title">링크 URL</div>
                        <v-text-field
                            v-model="glink"
                            label=""
                            required
                            @input="$v.glink.$touch()"
                            @blur="$v.glink.$touch()"
                            :error-messages="glinkErrors"
                            outlined
                            placeholder="링크 URL을 입력해주세요"
                        ></v-text-field>
                    </li>
                    <li class="item-list">
                        <div class="sub-title">광고 노출일</div>
                        <div class="date-input-box">
                            <div class="date-input">
                                <v-menu
                                    ref="stPicker"
                                    v-model="stPicker"
                                    :close-on-content-click="false"
                                    :return-value.sync="stdate"
                                    transition="scale-transition"
                                    offset-y
                                    min-width="auto"
                                >
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-text-field
                                            v-model="stdate"
                                            label="광고시작일"
                                            readonly
                                            @input="$v.stdate.$touch()"
                                            @blur="$v.stdate.$touch()"
                                            :error-messages="stdateErrors"
                                            v-bind="attrs"
                                            outlined
                                            v-on="on"
                                        ></v-text-field>
                                    </template>
                                    <v-date-picker
                                        v-model="stdate"
                                        scrollable
                                    >
                                        <v-spacer></v-spacer>
                                        <v-btn
                                            text
                                            color="primary"
                                            @click="stPicker = false"
                                        >
                                            취소
                                        </v-btn>
                                        <v-btn
                                            text
                                            color="primary"
                                            @click="$refs.stPicker.save(stdate)"
                                        >
                                            확인
                                        </v-btn>
                                    </v-date-picker>
                                </v-menu>
                            </div>
                            <div class="date-input">
                                <v-menu
                                    ref="enPicker"
                                    v-model="enPicker"
                                    :close-on-content-click="false"
                                    :return-value.sync="endate"
                                    transition="scale-transition"
                                    offset-y
                                    min-width="auto"
                                >
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-text-field
                                            v-model="endate"
                                            label="광고종료일"
                                            readonly
                                            @input="$v.endate.$touch()"
                                            @blur="$v.endate.$touch()"
                                            :error-messages="endateErrors"
                                            v-bind="attrs"
                                            outlined
                                            v-on="on"
                                        ></v-text-field>
                                    </template>
                                    <v-date-picker
                                        v-model="endate"
                                        scrollable
                                    >
                                        <v-spacer></v-spacer>
                                        <v-btn
                                            text
                                            color="primary"
                                            @click="enPicker = false"
                                        >
                                            취소
                                        </v-btn>
                                        <v-btn
                                            text
                                            color="primary"
                                            @click="$refs.enPicker.save(endate)"
                                        >
                                            확인
                                        </v-btn>
                                    </v-date-picker>
                                </v-menu>
                            </div>
                        </div>
                    </li>
                    <li class="item-list">
                        <div class="date-input-box">
                            <div class="date-input">
                                <div class="sub-title">신청자 성명</div>
                                <v-text-field
                                    v-model="name"
                                    label=""
                                    required
                                    @input="$v.name.$touch()"
                                    @blur="$v.name.$touch()"
                                    :error-messages="nameErrors"
                                    outlined
                                    placeholder="성명을 입력해주세요"
                                ></v-text-field>
                            </div>
                            <div class="date-input">
                                <div class="sub-title">연락처</div>
                                <v-text-field
                                    v-model="pcs"
                                    label=""
                                    required
                                    @input="$v.pcs.$touch()"
                                    @blur="$v.pcs.$touch()"
                                    :error-messages="pcsErrors"
                                    outlined
                                    placeholder="연락처를 입력해주세요"
                                ></v-text-field>
                            </div>
                        </div>
                    </li>
                    <li class="item-list">
                        <div class="sub-title">이메일</div>
                        <v-text-field
                            v-model="email"
                            label=""
                            required
                            @input="$v.email.$touch()"
                            @blur="$v.email.$touch()"
                            :error-messages="emailErrors"
                            outlined
                            placeholder="이메일을 입력해주세요"
                        ></v-text-field>

                    </li>
                    <li class="item-list">
                        <div class="sub-title">요청사항</div>
                        <v-text-field
                            v-model="content"
                            label=""
                            outlined
                            placeholder="요청사항을 입력해주세요"
                        ></v-text-field>
                    </li>
                    <li class="item-box" v-if="!modify">
                        <div>광고비</div>
                        <div class="price">{{resultPrice}}<span>원</span></div>
                    </li>
                    <li class="item-list" v-if="!modify">
                        <div class="sub-title">결제수단</div>
                        <v-radio-group class="radio-box" row v-model="paymentMethod">
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
                    </li>
                </ul>

                <div class="submit-button-box">
                    <v-btn
                        class="submit-button"
                        type="submit"

                    >
                        {{buttonText}}
                    </v-btn>
                </div>

            </form>
        </div>

    </div>
</template>


<script>

	import AUTH from '../../../../api/auth'
	import UTIL from '../../../../api/util'
	import {validationMixin} from 'vuelidate'
	import {required, email} from 'vuelidate/lib/validators'
	import {BANNER} from '../../../../config/banner'
	import {
		HOST,
		API_URL_BANNER_USER_SETTING_INFO,
		API_URL_BANNER_USER_APPLY
	} from '../../../../api/urls';
	import apiService from '../../../../api/apiService';

	export default {
		name: 'bannerRegist',
		mixins: [validationMixin],
		validations: {
			glink: {required},
			email: {required, email},
			pcs: {required},
			name: {required},
			stdate: {required},
			endate: {required},
		},
		props: ["ownerUid", "bannerData"],
		computed: {
			nameErrors() {
				const errors = []
				if (!this.$v.name.$dirty) return errors
				!this.$v.name.required && errors.push('신청자성명을 입력하세요')
				return errors
			},
			glinkErrors() {
				const errors = []
				if (!this.$v.glink.$dirty) return errors
				!this.$v.glink.required && errors.push('링크URL을 입력하세요')
				return errors
			},
			emailErrors() {
				const errors = []
				if (!this.$v.email.$dirty) return errors
				!this.$v.email.required && errors.push('이메일을 입력하세요')
				!this.$v.email.email && errors.push('잘못된 이메일입니다')
				return errors
			},
			pcsErrors() {
				const errors = []
				if (!this.$v.pcs.$dirty) return errors
				!this.$v.pcs.required && errors.push('연락처를 입력하세요')
				return errors
			},

			stdateErrors() {
				const errors = []
				if (!this.$v.stdate.$dirty) return errors
				!this.$v.stdate.required && errors.push('광고시작일을 입력하세요')
				return errors
			},
			endateErrors() {
				const errors = []
				if (!this.$v.endate.$dirty) return errors
				!this.$v.endate.required && errors.push('광고종료일을 입력하세요')
				return errors
			},

		},
		watch: {
			bannerType(val) {
				for (let banner of this.bannerList) {
					if (banner.code == val) {
						banner.gclass = 'active'
						this.imgView[banner.code] = true;
						this.codeList = banner.codeList;
						this.bannerTypeName = banner.name;
					} else {
						banner.gclass = ''
						this.imgView[banner.code] = false;
					}
				}
				this.imgGuide = '';
				this.bannerTitle = {
					pcmain: 'PC 메인 광고',
					pcbrd: 'PC 방송화면 광고',
					mobmain: 'MOBILE 메인 광고',
					mobbrd: 'MOBILE 방송화면 광고'
				};
				this.bannerCode = '';
				this.bannerCodeName = '';
			},
			bannerCode(code) {
				if (code) {
					this.price = this.bannerPriceList[code] * this.dayCount;
					this.resultPrice = UTIL.numberFormat(this.price);
					for (let sub of this.codeList) {
						if (sub.code == code) {
							this.bannerCodeName = sub.name;
							this.imgGuide = '적정 이미지 사이즈는 '+this.bannerInfos[this.bannerType][code].size+'px 입니다';
						}
					}
					switch (this.bannerType) {
						case 'pcbrd':
							this.bannerTitle.pcbrd = 'PC 메인 광고 - ' + this.bannerCodeName;
							break;
                        case 'pcmain':
	                        this.bannerTitle.pcmain = 'PC 방송화면 광고 - ' + this.bannerCodeName;
	                        break;
						case 'mobmain':
							this.bannerTitle.mobmain = 'MOBILE 메인 광고 - ' + this.bannerCodeName;
							break;
						case 'mobbrd':
							this.bannerTitle.mobbrd = 'MOBILE 방송화면 광고 - ' + this.bannerCodeName;
							break;

					}

				} else {
					this.price = 0;
					this.resultPrice = 0;
					this.bannerCodeName = '';
				}
			},
			dayCount(val) {
				if (this.modify) return;
				if (this.bannerCode) {
					this.price = this.bannerPriceList[this.bannerCode] * val;
					this.resultPrice = UTIL.numberFormat(this.price);
				} else {
					this.price = 0;
					this.resultPrice = 0;
				}
			},
			stdate(val) {
				if (this.modify) return;
				if (val) {
					let ndate = new Date();
					let nowdate = new Date(ndate.getFullYear(), ndate.getMonth(), ndate.getDate(), 1, 1, 1);
					let stdates = val.split('-');
					let stmonth = parseInt(stdates[1]) - 1;
					let stday = parseInt(stdates[2]);
					let stdate = new Date(stdates[0], stmonth, stday, 1, 1, 1);
					if (stdate.getTime() - nowdate.getTime() < 0) {
						let params = {
							message: '시작일은 오늘날짜와 같거나 미래여야 합니다',
						};
						this.$eventBus.$emit('modalOpen', params);
						this.stdate = '';
						return;
					}
					if (this.endate) {
						let endates = this.endate.split('-');
						let enmonth = parseInt(endates[1]) - 1;
						let enday = parseInt(endates[2]);
						let endate = new Date(endates[0], enmonth, enday, 1, 1, 1);

						if (endate.getTime() - stdate.getTime() <= 0) {
							let params = {
								message: '시작일은 종료일보다 과거이어야 합니다',
							};
							this.$eventBus.$emit('modalOpen', params);
							this.stdate = '';
							this.dayCount = 1;
						} else {
							let dayTerm = endate.getTime() - stdate.getTime();
							this.dayCount = (dayTerm / (24 * 3600)) / 1000;

						}
					}
				} else {
					this.dayCount = 1;
				}
			},
			endate(val) {
				if (this.modify) return;
				if (val && this.stdate) {
					let endates = val.split('-');
					let enmonth = parseInt(endates[1]) - 1;
					let enday = parseInt(endates[2]);
					let endate = new Date(endates[0], enmonth, enday, 1, 1, 1);

					let stdates = this.stdate.split('-');
					let stmonth = parseInt(stdates[1]) - 1;
					let stday = parseInt(stdates[2]);
					let stdate = new Date(stdates[0], stmonth, stday, 1, 1, 1);

					if (endate.getTime() - stdate.getTime() <= 0) {
						let params = {
							message: '종료일은 시작일보다 미래이어야 합니다',
						};
						this.$eventBus.$emit('modalOpen', params);
						this.endate = '';
						this.dayCount = 1;
					} else {
						let dayTerm = endate.getTime() - stdate.getTime();
						this.dayCount = (dayTerm / (24 * 3600)) / 1000;

					}

				} else {
					this.dayCount = 1;
				}
			},
		},
		data() {
			return {
				host: HOST,
				buttonText: '신청하기',
				bannerList: [],
				codeList: [],
				imgView: {
					pcmain: true,
					pcbrd: false,
					mobmain: false,
					mobbrd: false,
				},
				bannerDesc: {
					pcmain: '광고에 대한 설명<br>광고에 대한 설명',
					pcbrd: '',
					mobmain: '',
					mobbrd: '',
				},
				bannerTitle: {
					pcmain: 'PC 메인 광고',
					pcbrd: 'PC 방송화면 광고',
					mobmain: 'MOBILE 메인 광고',
					mobbrd: 'MOBILE 방송화면 광고',
				},
				bannerInfos:{},
				imgGuide:'',
				name: '',
				content: '',
				fileName: '',
				img: '',
				paymentMethod: 'card',
				bannerType: '',
				bannerCode: '',
				bannerTypeName: '',
				bannerCodeName: '',
				stdate: '',
				endate: '',
				stPicker: false,
				enPicker: false,
				glink: '',
				pcs: '',
				email: '',
				resultPrice: '0',
				price: 0,
				bannerPriceList: {},
				dayCount: 1,
				modify: false,
				topTitle: '광고 문의',
				title: '광고 하기',
				titleClass: '',
				previewImg: '',
				no: '',
                mobileView: false,
                mobileClass: '',

			}
		},
		created() {
            if (this.$isMobile()) {
                this.mobileView = true;
                this.mobileClass = 'mobile'

            }
			if (this.bannerData) {
				this.modify = true;
				this.topTitle = '광고 수정';
				this.title = '광고 수정';
				this.buttonText = '수정하기',
					this.titleClass = 'upd';
				this.glink = this.bannerData.glink;
				this.stdate = this.bannerData.stdate;
				this.endate = this.bannerData.endate;
				this.endate = this.bannerData.endate;
				this.name = this.bannerData.name;
				this.pcs = this.bannerData.pcs;
				this.email = this.bannerData.email;
				this.content = this.bannerData.content;
				this.previewImg = this.bannerData.img;
				this.no = this.bannerData.no;

			} else {
				let memberInfo = AUTH.getSession(this.$isMobile());
				if (!memberInfo.AUTHTOKEN) {
					this.$emit('bannerModalHide')
				}
				this.email = memberInfo.email;
				this.name = memberInfo.name;
				this.getData();
			}
		},
		methods: {

			modalHide() {
				this.$emit('bannerModalHide')
			},

			selectBanner(code) {
				this.bannerType = code;

			},
			getData() {
				const frm = new FormData()
				frm.append('uid', this.ownerUid)

				apiService.post(API_URL_BANNER_USER_SETTING_INFO, frm, (res) => {
					this.bannerList = [];
					let firstCode = '';
					let firstIndex = '';
					let index = 0;
					this.bannerPriceList = {};
					this.bannerInfos = {};
					for (let item of BANNER) {
						let codeList = [];
						let codeData = {};
						for (let data of item.codeList) {
							codeData[data.code] = data;
							let itemData = {};
							itemData.name = data.name;
							itemData.code = data.code;
							if (res.info && res.info[data.code]) {
								if (res.info[data.code].displayType) {
									itemData.displayType = res.info[data.code].displayType;
								} else {
									itemData.displayType = 'random';
								}
								if (res.info[data.code].price) {
									itemData.price = res.info[data.code].price;
								} else {
									itemData.price = 1000;
								}
								if (res.info[data.code].guse) {
									itemData.use = res.info[data.code].guse;
								} else {
									itemData.use = 'yes'
								}

							} else {
								itemData.displayType = 'random';
								itemData.price = 1000;
								itemData.use = 'yes'
							}
							if (itemData.use == 'yes') {
								codeList.push(itemData);
								this.bannerPriceList[data.code] = itemData.price;
							}
						}

						this.bannerInfos[item.code] = codeData;
						if (codeList.length > 0) {
							if (!firstCode) {
								firstCode = item.code;
								firstIndex = index;
							}
							let bannerItem = {code: item.code, name: item.name, codeList: codeList, gclass: ''}
							this.bannerList.push(bannerItem)
						}
						index++;
					}
					if (firstCode) {
						for (let banner of this.bannerList) {
							if (banner.code == firstCode) {
								banner.gclass = 'active'
								this.bannerTypeName = banner.name;
							} else {
								banner.gclass = ''
							}

						}
						this.bannerType = firstCode;
						this.codeList = this.bannerList[firstIndex].codeList;
					} else {
						this.$emit('bannerModalHide')
					}

				});
			},
			onChangeImg() {
				const imgObj = this.$refs.imgContainer.files;
				let img = imgObj.length > 0 ? imgObj[0] : null;
				this.fileName = img.name;
				this.img = img;


			},
			validate() {
				if (!this.modify) {
					if (!this.bannerCode) {
						let params = {
							message: '광고 상품을 선택해주세요',
						};
						this.$eventBus.$emit('modalOpen', params);
						return;
					}
					if (!this.fileName) {
						let params = {
							message: '배너 이미지를 첨부해주세요',
						};
						this.$eventBus.$emit('modalOpen', params);
						return;
					}
				}
				this.$v.$touch()
				if (!this.$v.$anyError) {
					this.$eventBus.$emit('overlay', 'open');
					const frm = new FormData()


					frm.append('name', this.name);
					frm.append('content', this.content);
					frm.append('email', this.email);
					if (!this.modify) {
						frm.append('paymentMethod', this.paymentMethod);
						frm.append('bannerType', this.bannerType);
						frm.append('bannerCode', this.bannerCode);
						frm.append('targetUid', this.ownerUid)
						frm.append('price', this.price);
					} else {
						frm.append('no', this.no);
					}
					if (this.img) frm.append('img', this.img);

					frm.append('pcs', this.pcs);
					frm.append('glink', this.glink);

					frm.append('stdate', this.stdate);
					frm.append('endate', this.endate);

					apiService.postFile(API_URL_BANNER_USER_APPLY, frm, (res) => {

						this.$eventBus.$emit('overlay', 'hide');
						let result = res.result;
						let params = {}
						switch (result) {
							case 'imgError':
								params = {
									message: '지원하지 않는 이미지 파일형식입니다',
								};
								this.$eventBus.$emit('modalOpen', params);
								break;
							case 'succ':
								if (!this.modify) {
									let paymentParams = {
										orderId: res.orderId,
										name: this.name,
										email: this.email,
										bannerCode: this.bannerCode,
										itemName: this.bannerTypeName + ' ' + this.bannerCodeName,
									}
									this.$emit('bannerPaymentHide', paymentParams);
									return;
								} else {
									let msg = '광고가 수정되었습니다';
									params = {
										message: msg,
										doAction: () => {
											this.$emit('bannerModalHide', 'reload');
										}
									};
									this.$eventBus.$emit('modalOpen', params);
								}
								break;
						}
					});
				}
			}
		},
		mounted() {

		}

	}
</script>

<style lang="scss" scoped="true">
    .modal-container {
        width: 100%;
        background: #fff;
        height: 670px;


        ul {
            padding: 0;
        }

        .header-box {
            background: #202124;
            color: #fff;
            display: flex;
            height: 50px;
            line-height: 50px;

            .sub-title {
                width: 98%;
                font-weight: bold;
                font-size: 14pt;
                padding-left: 50px;
            }

            span {
                width: 40px;
                text-align: center;
                margin-right: 10px;
                cursor: pointer;
            }

        }

        .form-box {
            padding: 50px 30px;
            height: 620px;
            overflow: auto;

            .sub-title {
                color: #000;
                font-weight: bold;
                font-size: 11pt;
                text-align: left;
                padding: 10px 0 5px 0;
            }

            .banner-tab {
                display: flex;
                padding: 0;
                border: solid 1px #E9E9E9;

                li.tab-item {
                    height: 50px;
                    text-align: center;
                    line-height: 50px;
                    width: 100%;
                    border-right: solid 1px #E9E9E9;
                    color: #999;
                    cursor: pointer;

                    &:last-child {
                        border-right: none;
                    }

                    &.active {
                        background: #686EFB;
                        color: #fff;
                    }
                }
            }

            .choice-banner-img {
                margin: 35px 0 20px 0;
                width: 100%;
                height: 400px;

                img {
                    width: 100%;
                }
            }

            .banner-guide {
                .banner-guide-title {
                    font-size: 21pt;
                    font-weight: bold;
                    color: #000;
                }

                .banner-guide-desc {
                    margin-top: 7px;
                    font-size: 10pt;
                    color: #999;
                }
            }

            .stitle {
                font-size: 17pt;
                font-weight: bold;
                padding: 0 0 10px 0;
                color: #686EFB;
                border-bottom: solid 1px #dcdcdc;

                span.line {
                    padding-bottom: 13px;
                    border-bottom: solid 2px #686EFB;
                }

                margin: 30px 0 30px 0;

                &.upd {
                    margin: 0 0 30px 0;
                }

            }

            .radio-box {
                margin-top: -3px;
            }
        }

        .date-input-box {
            display: flex;
            justify-content: space-between;

            .date-input {
                width: 49%;
            }
        }

        .submit-button-box {
            padding-top: 40px;
            text-align: center;

            .submit-button {
                width: 330px;
                font-size: 12pt;
                height: 60px;
                background: #686EFB;
                color: #fff;
                border-radius: 0;

            }
        }

        .item-box {
            border: solid 4px #686EFB;
            display: flex;
            justify-content: space-between;
            padding: 10px;

            div {
                width: 45%;
                text-align: left;
                font-size: 12pt;
                color: #686EFB;
                padding-top: 7px;

                &.price {
                    padding-top: 0;
                    text-align: right;
                    color: #FF5E53;
                    font-size: 17pt;
                    font-weight: bold;

                    span {
                        font-size: 10pt;
                        color: #000;
                        font-weight: normal;
                        display: inline-block;
                        margin-top: -3px;

                    }
                }
            }

        }

        .file-box {
            margin: 0 0 30px 0;
            display: flex;
            width: 100%;
            padding: 0;
            min-height: 50px;

            .file-names {
                width: 100%;
                border: solid 1px #9E9E9E;
                border-right: none;
                border-radius: 5px 0 0 5px;
                padding: 4px 0 0 0;

                i {
                    margin: 3px 0 0 7px;
                    cursor: pointer;
                }

                .inputText {
                    display: inline-block;
                    padding: 13px 0 0 10px;
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
                min-height: 60px;
                padding-top: 18px;

                #vfile, #dfile {
                    opacity: 0;
                    width: 100%;
                    position: absolute;
                    right: 0;
                    min-height: 60px;

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

        .img-preview {
            padding-bottom: 20px;

            img {
                max-width: 100%;
            }
        }
        &.mobile {
            height:calc(100vh - 50px);
            overflow-y:auto;
            .form-box {
                padding:40px 15px;
                height:auto;
                overflow:visible;
                .banner-tab {
                    display: flex;
                    padding: 0;
                    border: solid 1px #E9E9E9;
                    flex-wrap: wrap;
                    font-size:14px;
                    li.tab-item {
                        height: 40px;
                        line-height: 40px;
                        width:50%;
                        border-right: solid 1px #E9E9E9;
                        color: #999;
                        cursor: pointer;

                        &:nth-child(2n) {
                            border-right:none;
                        }
                        &:nth-child(3n) {
                            border-top: solid 1px #E9E9E9;
                        }
                        &:last-child {
                            border-top: solid 1px #E9E9E9;
                            border-right: none;
                        }

                        &.active {
                            background: #686EFB;
                            color: #fff;
                        }
                    }
                }

                .choice-banner-img {
                    margin: 35px 0 20px 0;
                    width: 100%;
                    height:auto;

                    img {
                        width: 100%;
                    }
                }
                .banner-guide {
                    .banner-guide-title {
                        font-size: 15pt;
                        font-weight: bold;
                        color: #000;
                    }

                    .banner-guide-desc {
                        margin-top: 7px;
                        font-size: 10pt;
                        color: #999;
                    }
                }

                .stitle {
                    font-size: 13pt;
                    font-weight: bold;
                    padding: 0 0 10px 0;
                    color: #686EFB;
                    border-bottom: solid 1px #dcdcdc;

                    span.line {
                        padding-bottom: 13px;
                        border-bottom: solid 2px #686EFB;
                    }

                    margin: 30px 0 30px 0;

                    &.upd {
                        margin: 0 0 30px 0;
                    }

                }

                .radio-box {
                    margin-top: -3px;
                }
            }

            .date-input-box {
                display: block;
                .date-input {
                    width: 100%;
                }
            }

            .submit-button-box {
                padding-top: 40px;
                text-align: center;

                .submit-button {
                    width: 330px;
                    font-size: 12pt;
                    height: 60px;
                    background: #686EFB;
                    color: #fff;
                    border-radius: 0;

                }
            }

            .item-box {
                border: solid 4px #686EFB;
                display: flex;
                justify-content: space-between;
                padding: 10px;

                div {
                    width: 45%;
                    text-align: left;
                    font-size: 12pt;
                    color: #686EFB;
                    padding-top: 7px;

                    &.price {
                        padding-top: 0;
                        text-align: right;
                        color: #FF5E53;
                        font-size: 17pt;
                        font-weight: bold;

                        span {
                            font-size: 10pt;
                            color: #000;
                            font-weight: normal;
                            display: inline-block;
                            margin-top: -3px;

                        }
                    }
                }

            }

            .file-box {
                margin: 0 0 30px 0;
                display: flex;
                width: 100%;
                padding: 0;
                min-height: 50px;

                .file-names {
                    width: 100%;
                    border: solid 1px #9E9E9E;
                    border-right: none;
                    border-radius: 5px 0 0 5px;
                    padding: 4px 0 0 0;

                    i {
                        margin: 3px 0 0 7px;
                        cursor: pointer;
                    }

                    .inputText {
                        display: inline-block;
                        padding: 13px 0 0 10px;
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
                    min-height: 60px;
                    padding-top: 18px;

                    #vfile, #dfile {
                        opacity: 0;
                        width: 100%;
                        position: absolute;
                        right: 0;
                        min-height: 60px;

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

            .img-preview {
                padding-bottom: 20px;

                img {
                    max-width: 100%;
                }
            }
        }
    }
</style>