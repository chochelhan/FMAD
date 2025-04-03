<template>
    <div :class="'component-content '+mobileClass">

        <div class="contents">
            <div class="stitle" v-html="title"></div>
            <div class="from-box" v-if="contentShow.part">
                <ul class="field-icon-box">
                    <li @click="setMyPart('a')">
                        <div :class="'icon-box '+gclass.a">
                            <img src="../../../../assets/images/ico_f1.png">

                        </div>
                        <div class="text">뉴스/정치</div>
                    </li>
                    <li @click="setMyPart('b')">
                        <div :class="'icon-box '+gclass.b">
                            <img src="../../../../assets/images/ico_f2.png">

                        </div>
                        <div class="text">뷰티/패션</div>
                    </li>
                    <li @click="setMyPart('c')">
                        <div :class="'icon-box '+gclass.c">
                            <img src="../../../../assets/images/ico_f3.png">

                        </div>
                        <div class="text">코미디</div>
                    </li>

                </ul>
                <ul class="field-icon-box">
                    <li @click="setMyPart('d')">
                        <div :class="'icon-box '+gclass.d">
                            <img src="../../../../assets/images/ico_f4.png">
                        </div>
                        <div class="text">스포츠</div>
                    </li>
                    <li @click="setMyPart('e')">
                        <div :class="'icon-box '+gclass.e">
                            <img src="../../../../assets/images/ico_f5.png">
                        </div>
                        <div class="text">음악</div>
                    </li>
                    <li @click="setMyPart('f')">
                        <div :class="'icon-box '+gclass.f">
                            <img src="../../../../assets/images/ico_f6.png">
                        </div>
                        <div class="text">기술</div>
                    </li>
                </ul>
                <ul class="field-icon-box">
                    <li @click="setMyPart('g')">
                        <div :class="'icon-box '+gclass.g">
                            <img src="../../../../assets/images/ico_f7.png">
                        </div>
                        <div class="text">게임</div>
                    </li>
                    <li @click="setMyPart('h')">
                        <div :class="'icon-box '+gclass.h">
                            <img src="../../../../assets/images/ico_f8.png">
                        </div>
                        <div class="text">요리/건강</div>
                    </li>
                    <li @click="setMyPart('i')">

                        <div :class="'icon-box '+gclass.i">
                            <img src="../../../../assets/images/ico_f9.png">
                        </div>
                        <div class="text">영화/엔터테인먼트</div>
                    </li>

                </ul>
                <div class="button-box">
                    <v-btn
                        type="button"
                        class="sub-single-button"
                        @click="goNext(1)"
                    >
                        다음
                    </v-btn>
                </div>
            </div>
            <div class="from-box" v-if="contentShow.broadcast">
                <div class="part-box">
                    <swiper :options="swiperOption" class="slideAuto">
                        <swiper-slide class="slideItem">
                            <div :class="'icon-box '+gBrdclass.a" @click="setMyBroadcastPart('a')">
                                <img src="../../../../assets/images/ico_f1.png">

                            </div>
                            <div class="text">뉴스/정치</div>
                        </swiper-slide>
                        <swiper-slide class="slideItem">
                            <div :class="'icon-box '+gBrdclass.b" @click="setMyBroadcastPart('b')">
                                <img src="../../../../assets/images/ico_f2.png">

                            </div>
                            <div class="text">뷰티/패션</div>
                        </swiper-slide>
                        <swiper-slide class="slideItem">
                            <div :class="'icon-box '+gBrdclass.c" @click="setMyBroadcastPart('c')">
                                <img src="../../../../assets/images/ico_f3.png">

                            </div>
                            <div class="text">코미디</div>
                        </swiper-slide>
                        <swiper-slide class="slideItem">
                            <div :class="'icon-box '+gBrdclass.d" @click="setMyBroadcastPart('d')">
                                <img src="../../../../assets/images/ico_f4.png">
                            </div>
                            <div class="text">스포츠</div>
                        </swiper-slide>
                        <swiper-slide class="slideItem">
                            <div :class="'icon-box '+gBrdclass.e" @click="setMyBroadcastPart('e')">
                                <img style="width:20px" src="../../../../assets/images/ico_f5.png">
                            </div>
                            <div class="text">음악</div>
                        </swiper-slide>
                        <swiper-slide class="slideItem">
                            <div :class="'icon-box '+gBrdclass.f" @click="setMyBroadcastPart('f')">
                                <img src="../../../../assets/images/ico_f6.png">
                            </div>
                            <div class="text">기술</div>
                        </swiper-slide>
                        <swiper-slide class="slideItem">
                            <div :class="'icon-box '+gBrdclass.g" @click="setMyBroadcastPart('g')">
                                <img src="../../../../assets/images/ico_f7.png">
                            </div>
                            <div class="text">게임</div>
                        </swiper-slide>
                        <swiper-slide class="slideItem">
                            <div :class="'icon-box '+gBrdclass.h" @click="setMyBroadcastPart('h')">
                                <img style="width:20px" src="../../../../assets/images/ico_f8.png">
                            </div>
                            <div class="text">요리/건강</div>
                        </swiper-slide>
                        <swiper-slide class="slideItem">

                            <div :class="'icon-box '+gBrdclass.i" @click="setMyBroadcastPart('i')">
                                <img style="width:20px" src="../../../../assets/images/ico_f9.png">
                            </div>
                            <div class="text">영화/엔터테인먼트</div>
                        </swiper-slide>
                    </swiper>
                    <div>
                        <div class="swiper-button-next-box"><i class="fas fa-chevron-circle-right"></i></div>
                        <div class="swiper-button-prev-box"><i class="fas fa-chevron-circle-left"></i></div>
                    </div>
                </div>
                <div class="bj-box">
                    <ul class="bj-list">
                        <li v-for="bj in bjList">
                            <div class="img-box">
                                <div v-if="bj.photo">
                                    <img :src="host+bj.photo">
                                </div>
                                <div v-else>
                                    <i class="fas fa-user"></i>
                                </div>
                            </div>
                            <div class="info-box">
                                <div class="subject">
                                    {{bj.subject}}
                                </div>
                                <div class="read-box">
                                    구독자   {{bj.mypen}}명
                                </div>
                            </div>
                            <div class="read-button-box">
                                <v-btn
                                    type="button"
                                    :class="'read-button '+bj.likeClass"

                                    @click="setTempMyLike(bj.no)"
                                >
                                    구독
                                </v-btn>
                            </div>
                        </li>
                        <li class="empty-box" v-if="bjList.length<1">
                            {{bjEmptyText}}
                        </li>
                    </ul>
                </div>
                <div class="button-box">
                    <v-btn
                        type="button"
                        class="cancle-button"
                        @click="goBack(1)"
                    >
                        이전
                    </v-btn>
                    <v-btn
                        type="button"
                        class="sub-button"
                        @click="goNext(2)"
                    >
                        다음
                    </v-btn>
                </div>
            </div>
            <div class="from-box" v-if="contentShow.join">
                <form novalidate @submit.prevent="validate">
                    <ul class="field-box">
                        <li>
                            <div class="field-input">

                                <v-text-field
                                    v-model="name"
                                    label="이름"
                                    required
                                    @input="$v.name.$touch()"
                                    @blur="$v.name.$touch()"
                                    :error-messages="nameErrors"
                                    outlined
                                ></v-text-field>
                            </div>
                        </li>

                        <li>
                            <div class="date-input">
                                <v-menu
                                    ref="birthPicker"
                                    v-model="birthPicker"
                                    :close-on-content-click="false"
                                    :return-value.sync="birth"
                                    transition="scale-transition"
                                    offset-y
                                    min-width="auto"
                                >
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-text-field
                                            v-model="birth"
                                            label="생년월일"
                                            readonly
                                            @input="$v.birth.$touch()"
                                            @blur="$v.birth.$touch()"
                                            :error-messages="birthErrors"
                                            v-bind="attrs"
                                            outlined
                                            v-on="on"
                                        ></v-text-field>
                                    </template>
                                    <v-date-picker
                                        v-model="birth"
                                        scrollable
                                    >
                                        <v-spacer></v-spacer>
                                        <v-btn
                                            text
                                            color="primary"
                                            @click="birthPicker = false"
                                        >
                                            취소
                                        </v-btn>
                                        <v-btn
                                            text
                                            color="primary"
                                            @click="$refs.birthPicker.save(birth)"
                                        >
                                            확인
                                        </v-btn>
                                    </v-date-picker>
                                </v-menu>
                            </div>
                        </li>
                        <li v-if="!linktreeUid">
                            <div class="field-input">

                                <v-text-field
                                    v-model="email"
                                    label="이메일"
                                    @input="$v.email.$touch()"
                                    @blur="$v.email.$touch()"
                                    :error-messages="emailErrors"
                                    outlined
                                ></v-text-field>
                                <div v-if="emailResultClass" :class="'uidResultClass '+emailResultClass">
                                    {{emailResultMessage}}
                                </div>
                            </div>
                            <div class="radio-box">
                                <div class="radio-box-item" @click="setEmailReceive()">
                                    <div :class="'icon-box '+emailGclass">
                                        <i class="fas fa-check"></i>
                                    </div>
                                    <div class="text">이메일 수신동의</div>
                                </div>
                            </div>
                        </li>
                        <li style="padding-top:15px;">
                            <div class="field-input">

                                <v-text-field
                                    v-model="pcs"
                                    label="휴대폰 번호"
                                    @input="$v.pcs.$touch()"
                                    @blur="$v.pcs.$touch()"
                                    :error-messages="pcsErrors"
                                    outlined
                                ></v-text-field>
                            </div>
                            <div class="radio-box">
                                <div class="radio-box-item" @click="setSmsReceive()">
                                    <div :class="'icon-box '+smsGclass">
                                        <i class="fas fa-check"></i>
                                    </div>
                                    <div class="text">SMS 수신동의</div>
                                </div>
                            </div>
                        </li>

                    </ul>

                    <div class="button-box">
                        <v-btn
                            type="button"
                            class="cancle-button"
                            @click="goBack(2)"
                        >
                            이전
                        </v-btn>
                        <v-btn
                            type="submit"
                            class="sub-button"
                        >
                            {{joinButtonText}}
                        </v-btn>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>


<script>
	import {validationMixin} from 'vuelidate'
	import {required, email, numeric, minLength, maxLength} from 'vuelidate/lib/validators'

	import {
		HOST,
		API_URL_BROADCAST_LIST_BY_VTYPE,
		API_URL_MEMBER_EMAILCHECK,
		CONFIG_HEADER_POST
	} from '../../../../api/urls';

	export default {
		name: 'addInfo',
		mixins: [validationMixin],
		props: ["mtype","snsJoinMove","stepChange"],
		validations: {
			email: {required, email},
			name: {required},
			pcs: {required, numeric},
			birth: {required},
		},
        watch: {
            stepChange(val) {
                this.goBack(val)
            }
        },
		data() {
			return {
                linktreeUid:'',
				host: HOST,
				name: '',
				pcs: '',
				email: '',
				mobileView: false,
				mobileClass: '',
				succEmail: false,
				emailResultClass: '',
				emailResultMessage: '',
				birth: '',
				birthPicker: false,
				smsGclass: '',
				emailGclass: '',
				smsSend: 'no',
				emailSend: 'no',
				contentShow: {
					part: true,
					broadcast: false,
					join: false,
				},
				title: '',
				myBjList: {},
				gclass: {
					a: '',
					b: '',
					c: '',
					d: '',
					e: '',
					f: '',
					g: '',
					h: '',
					i: '',
				},
				gBrdclass: {
					a: '',
					b: '',
					c: '',
					d: '',
					e: '',
					f: '',
					g: '',
					h: '',
					i: '',
				},
				step: 1,
				swiperOption: {
					slidesPerView: 'auto',
					navigation: {
						nextEl: '.swiper-button-next-box',
						prevEl: '.swiper-button-prev-box',
					}
				},
				myTypes:[],
				myBroadcastType: '',
				bjList: [],
				joinButtonText: '가입완료',
				bjEmptyText:'관심있는 방송을 선택해주세요',
			}
		},
		created() {
		    if(sessionStorage.getItem('linktreeUid'))this.linktreeUid = sessionStorage.getItem('linktreeUid');
			if (this.$isMobile()) {
				this.mobileView = true;
				this.mobileClass = 'mobile'
			}
			this.title = '좋아하는 분야를<br>선택해주세요'
			if (this.mtype == 'shop') {
				this.joinButtonText = '다음';
			}
			if(this.snsJoinMove) {
				let info = JSON.parse(sessionStorage.getItem('snsJoinInfo'));
				sessionStorage.setItem('snsJoinInfo','');
				this.name = info.name;
				if(info.pcs) {
					this.pcs  =info.pcs.toString().replace('-','').replace('-','');

				}
				if(info.email) {
					this.email = info.email;
					this.$v.email.$touch()
				}

			}
		},
		computed: {

			emailErrors() {
				const errors = []
				if (!this.$v.email.$dirty) return errors
				!this.$v.email.required && errors.push('이메일을 입력하세요')
				!this.$v.email.email && errors.push('잘못된 이메일입니다')
				if (this.$v.email.required && this.$v.email.email) {
					const frm = new FormData()
					frm.append('email', this.email)
					this.$http.post(API_URL_MEMBER_EMAILCHECK, frm, {headers: CONFIG_HEADER_POST}).then(res => {
						let result = res.data.result;
						let params = {}
						if (this.$v.email.required && this.$v.email.email) {
							if (result == "succ") {
								this.succEmail = true;
								this.emailResultClass = 'succ'
								this.emailResultMessage = '사용가능한 이메일 입니다';
							} else {
								this.succEmail = false;
								this.emailResultClass = 'double'
								this.emailResultMessage = '중복된 이메일 입니다';
							}
						}
					});

				} else {
					this.succEmail = false;
					this.emailResultClass = '';

				}

				return errors
			},
			nameErrors() {
				const errors = []
				if (!this.$v.name.$dirty) return errors
				!this.$v.name.required && errors.push('이름 입력하세요')
				return errors
			},
			pcsErrors() {
				const errors = []
				if (!this.$v.pcs.$dirty) return errors
				if (!this.$v.pcs.required) {
					errors.push('휴대폰 번호를 입력하세요')
					return errors
				}
				if (!this.$v.pcs.numeric) {
					errors.push('휴대폰 번호는 숫자만 입력가능합니다')
					return errors
				}
				return errors
			},
			birthErrors() {
				const errors = []
				if (!this.$v.birth.$dirty) return errors
				!this.$v.birth.required && errors.push('생년월일을 입력하세요')
                if(this.$v.birth.required) {
	                let birth = this.$v.birth.$model;
	                let birthes = birth.toString().split('-')
                    let birthDate = parseInt(birthes[0])+parseInt(birthes[1])+parseInt(birthes[2])
                    let now = new Date();
	                let nowDate = now.getFullYear()+(now.getMonth()+1)+now.getDate();
	                if(nowDate<=birthDate) {
		                errors.push('생년월일은 오늘이전의 날짜를 입력하세요')
                        this.birth = '';
                    }
	                return errors
                } else {
	                return errors
                }
			},

		},
		methods: {
			goBack(step) {
				switch (step) {
					case 1:
						this.contentShow = {
							part: true,
							broadcast: false,
							join: false,
						}
						this.title = '좋아하는 분야를<br>선택해주세요'
						break;
					case 2:
						this.contentShow = {
							part: false,
							broadcast: true,
							join: false,
						}
						this.title = '관심있는 방송을<br>선택해 주세요';
						break;
				}
				this.step = step;
				if(this.$isMobile()) {
                    this.$emit('stepChangeEvent', this.step);
                }
			},
			setMyPart(type) {

				if(this.gclass[type]=='active') {
					this.gclass[type]=''
					this.myTypes[type] = '';
				} else {
					this.gclass[type]='active'
					this.myTypes[type] = type;
				}


			},
			setMyBroadcastPart(type) {
				this.myBroadcastType = type;
				for (let key in this.gBrdclass) {
					if (key == type) {
						this.gBrdclass[key] = 'active';
					} else this.gBrdclass[key] = '';
				}
				this.bjList = [];
				const frm = new FormData()
				frm.append('yType', this.myBroadcastType)
				this.$http.post(API_URL_BROADCAST_LIST_BY_VTYPE, frm, {headers: CONFIG_HEADER_POST}).then(res => {
					let result = res.data.result;
					if (result == "succ") {
						for (let bj of res.data.list) {
							if (this.myBjList[bj.no + 'bj']) bj.likeClass = 'active';
							else bj.likeClass = '';
							if(!bj.mypen)bj.mypen = 0;
							bj.subject = (bj.bjInfo) ? bj.bjInfo.name : bj.name;
							this.bjList.push(bj);

						}
						if(this.bjList.length<1) {
							this.bjEmptyText = '등록된 방송이 없습니다';
                        }
					}
				});
			},
			goNext(step) {
				switch (step) {
					case 1:
						let mtypeflag = false;
                        for(let key in this.myTypes) {
                        	if(this.myTypes[key]) {
		                        mtypeflag = true;
		                        break;
                            }
                        }
						if (!mtypeflag) {
							let params = {
								message: '좋아하는 분야를 선택해주세요',
							};
							this.$eventBus.$emit('modalOpen', params);
							return;
						}
						this.contentShow = {
							part: false,
							broadcast: true,
							join: false,
						}
						this.title = '관심있는 방송을<br>선택해 주세요';
						//this.setMyBroadcastPart(this.myType);
						break;
					case 2:
						let flag = false;
						for (let key in this.myBjList) {
							if (this.myBjList[key]) {
								flag = true;
								break;
							}
						}
						//if (!flag) {
							//let params = {
							//	message: '관심있는 방송을 하나이상 선택해주세요',
							//};
							//this.$eventBus.$emit('modalOpen', params);
							//return;
						//}
						this.contentShow = {
							part: false,
							broadcast: false,
							join: true,
						}
						this.title = '기타 정보를<br>입력해 주세요';
						break;
				}
				this.step = step + 1;
                if(this.$isMobile()) {
                    this.$emit('stepChangeEvent', this.step);
                }

			},
			setTempMyLike(no) {
				let active = true;
				if (this.myBjList[no + 'bj']) {
					active = false;
					delete this.myBjList[no + 'bj'];
				} else {

					this.myBjList[no + 'bj'] = no;
				}
				for (let bj of this.bjList) {
					if (bj.no == no) {
						if (active) bj.likeClass = 'active';
						else bj.likeClass = '';
					}
				}

			},
			setEmailReceive() {
				if (this.emailGclass == 'active') {
					this.emailGclass = ''
					this.emailSend = 'no'
				} else {
					this.emailGclass = 'active'
					this.emailSend = 'yes'
				}
			},
			setSmsReceive() {
				if (this.smsGclass == 'active') {
					this.smsGclass = ''
					this.smsSend = 'no'
				} else {
					this.smsGclass = 'active'
					this.smsSend = 'yes'
				}
			},
			validate() {
				this.$v.$touch()
                if(this.linktreeUid) {
                    if(this.name && this.pcs && this.birth) {
                        let params = {
                            name: this.name,
                            pcs: this.pcs,
                            birth: this.birth,
                            smsSend: this.smsSend,
                            myType: this.myTypes,
                            myBroadcastType: this.myBroadcastType,
                            myBjList: this.myBjList,

                        }
                        this.$emit('addinfoResult', params)
                    }

                } else {
                    if (!this.$v.$anyError && this.succEmail) {
                        let params = {
                            name: this.name,
                            pcs: this.pcs,
                            email: this.email,
                            birth: this.birth,
                            smsSend: this.smsSend,
                            emailSend: this.emailSend,
                            myType: this.myTypes,
                            myBroadcastType: this.myBroadcastType,
                            myBjList: this.myBjList,

                        }
                        this.$emit('addinfoResult', params)

                    }
                }

			}
		},

	}
</script>
<style lang="scss" scoped>
    .component-content {
        width: 100%;
        background: #fff;
        .contents {
            width: 360px;
            margin: auto;
            padding: 0;
            .from-box {
                background: #fff;
            }
            .button-box {
                width: 450px;
                display: flex;
                margin-top: 50px;
                margin-left: -45px;
                .cancle-button {
                    width: 50%;
                    color: #fff;
                    height: 65px;
                    border-radius: 0;
                    background: #999999;
                }
                .sub-button {
                    width: 50%;
                    color: #fff;
                    height: 65px;
                    border-radius: 0;
                    background: #686EFB;
                }
                .sub-single-button {
                    width: 100%;
                    color: #fff;
                    height: 65px;
                    border-radius: 0;
                    background: #686EFB;
                }
            }
            .submit-button {
                margin: 40px 0 0 0;
                width: 100%;
                border-radius: 0;
                padding: 0;
                background: #686EFB;
                color: #fff;
                min-height: 65px;
                font-size: 12pt;

            }

            .stitle {
                font-size: 18pt;
                font-weight: bold;
                text-align: center;
                padding-bottom: 20px;
                border-bottom: solid 1px #dcdcdc;
                margin-bottom: 20px;
            }
            .tip {
                font-size: 10pt;
                text-align: center;
                padding-bottom: 10px;
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
                margin: 0;
                li {
                    .field-input {
                        width: 100%;

                    }
                    .date-input {
                        width: 100%;

                    }
                }
            }

            .double-box {
                padding: 0;
                margin: 20px 0 0 0;
                display: flex;
                li {
                    width: 50%;
                    border: solid 1px #dcdcdc;
                    color: #999;
                    text-align: center;
                    height: 50px;
                    line-height: 50px;
                    cursor: pointer;
                    &.active {
                        background: #686EFB;
                        color: #fff;
                    }
                    &:first-child {
                        border-right: none;

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
            .field-icon-box {
                padding: 0;
                width: 340px;
                margin: 0 auto 10px auto;
                display: flex;
                justify-content: space-between;
                li {
                    text-align: center;
                    .icon-box {
                        width: 90px;
                        height: 90px;
                        background: #DCDCDC;
                        border-radius: 50%;
                        text-align: center;
                        line-height: 110px;
                        cursor: pointer;
                        img {

                        }
                        &.active {
                            background: #686EFB;
                        }
                    }
                    .text {
                        font-size: 10pt;
                        margin-top: 5px;
                    }

                }
            }
            .part-box {
                position: relative;
                .swiper-button-next-box {
                    color: #000;
                    position: absolute;
                    right: -35px;
                    top: 13px;
                    font-size: 25pt;
                }
                .swiper-button-prev-box {
                    color: #000;
                    position: absolute;
                    left: -35px;
                    top: 13px;
                    font-size: 25pt;
                }
                .slideAuto {
                    display: flex;
                    .slideItem {
                        width: 70px;
                        text-align: center;
                        .icon-box {
                            width: 50px;
                            height: 50px;
                            background: #DCDCDC;
                            border-radius: 50%;
                            text-align: center;
                            line-height: 60px;
                            cursor: pointer;
                            margin: auto;
                            img {
                                width: 25px;
                            }
                            &.active {
                                background: #686EFB;
                            }
                        }
                        .text {
                            text-align: center;
                            font-size: 9pt;
                            margin-top: 5px;
                            color: #000;
                            font-weight: bold;
                        }
                    }
                }
            }
            .bj-box {
                padding: 15px;
                background: #141A2C;
                max-height: 300px;
                overflow: auto;
                .bj-list {
                    padding: 0;
                    li {
                        &.empty-box {
                            text-align:center;
                            color:#fff;
                            display: block;
                            font-size:10pt;
                            height:110px;
                            line-height:70px;
                        }
                        border-bottom: solid 1px #DCDCDC;
                        display: flex;
                        padding: 20px 0;
                        &:last-child {
                            border-bottom: none;
                        }
                        .img-box {
                            width: 70px;
                            height: 70px;
                            border-radius: 50%;
                            overflow: hidden;
                            background: #686EFB;
                            text-align:center;
                            img {
                                width: 100%;
                                min-height: 70px;
                            }
                            i {
                                color:#fff;
                                font-size:28pt;
                                margin-top:15px;
                            }
                        }
                        .info-box {
                            width: 210px;
                            overflow-x: hidden;
                            padding: 3px 0 0 10px;
                            .subject {
                                color: #dcdcdc;
                                font-weight: bold;
                                font-size: 12pt;
                                height: 41px;
                                overflow: hidden;
                                line-height: 130%;
                            }
                            .read-box {
                                margin-top: 5px;
                                font-size: 10pt;
                                color: #999;
                            }
                        }
                        .read-button-box {

                            width: 70px;
                            .read-button {
                                margin: 20px 0 0 0;
                                background: #999;
                                color: #fff;
                                &.active {
                                    background: #686EFB;
                                }
                            }

                        }
                    }
                }
            }

        }
        &.mobile {
            padding: 10px 10px 30px 10px;
            .contents {
                width:100%;
                margin: auto;
                padding: 0;
                .from-box {
                    background: #fff;
                }
                .button-box {
                    width:100%;
                    display: flex;
                    margin-top: 50px;
                    margin-left:0;
                    .cancle-button {
                        width: 50%;
                        color: #fff;
                        height:50px;
                        border-radius: 0;
                        background: #999999;
                    }
                    .sub-button {
                        width: 50%;
                        color: #fff;
                        height:50px;
                        border-radius: 0;
                        background: #686EFB;
                    }
                    .sub-single-button {
                        width: 100%;
                        color: #fff;
                        height: 50px;
                        border-radius: 0;
                        background: #686EFB;
                    }
                }
                .submit-button {
                    margin: 40px 0 0 0;
                    width: 100%;
                    border-radius: 0;
                    padding: 0;
                    background: #686EFB;
                    color: #fff;
                    min-height:50px;
                    font-size: 12pt;

                }

                .stitle {
                    font-size: 14pt;
                    font-weight: bold;
                    text-align: center;
                    padding-bottom: 10px;
                    border-bottom:none;
                    margin-bottom:20px;
                }
                .tip {
                    font-size: 9pt;
                    text-align: center;
                    padding-bottom: 10px;
                }
                .sub-title {
                    font-size: 12pt;
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
                    margin: 0;
                    li {
                        .field-input {
                            width: 100%;

                        }
                        .date-input {
                            width: 100%;

                        }
                    }
                }

                .double-box {
                    padding: 0;
                    margin: 20px 0 0 0;
                    display: flex;
                    li {
                        width: 50%;
                        border: solid 1px #dcdcdc;
                        color: #999;
                        text-align: center;
                        height: 50px;
                        line-height: 50px;
                        cursor: pointer;
                        &.active {
                            background: #686EFB;
                            color: #fff;
                        }
                        &:first-child {
                            border-right: none;

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
                .field-icon-box {
                    padding: 0;
                    width:100%;
                    margin: 0 auto 10px auto;
                    display: flex;
                    justify-content: space-between;
                    li {
                        text-align: center;
                        .icon-box {
                            width: 80px;
                            height: 80px;
                            background: #DCDCDC;
                            border-radius: 50%;
                            text-align: center;
                            line-height: 100px;
                            img {

                            }
                            &.active {
                                background: #686EFB;
                            }
                        }
                        .text {
                            font-size: 9pt;
                            margin-top: 5px;
                            width:80px;
                        }

                    }
                }
                .part-box {
                    position: relative;
                    .swiper-button-next-box {
                        display:none;
                    }
                    .swiper-button-prev-box {
                        display:none;
                    }
                    .slideAuto {
                        display: flex;
                        .slideItem {
                            width: 70px;
                            text-align: center;
                            .icon-box {
                                width: 40px;
                                height: 40px;
                                background: #DCDCDC;
                                border-radius: 50%;
                                text-align: center;
                                line-height: 49px;
                                cursor: pointer;
                                margin: auto;
                                img {
                                    width: 20px;
                                }
                                &.active {
                                    background: #686EFB;
                                }
                            }
                            .text {
                                text-align: center;
                                font-size: 8pt;
                                margin-top: 5px;
                                color: #000;
                                font-weight: bold;
                            }
                        }
                    }
                }
                .bj-box {
                    padding: 15px;
                    background: #141A2C;
                    max-height: 300px;
                    overflow: auto;
                    .bj-list {
                        padding: 0;
                        li {
                            &.empty-box {
                                text-align:center;
                                color:#fff;
                                display: block;
                                font-size:10pt;
                                height:110px;
                                line-height:70px;
                            }
                            border-bottom: solid 1px #DCDCDC;
                            display: flex;
                            padding:15px 0;
                            &:last-child {
                                border-bottom: none;
                            }
                            .img-box {
                                min-width:58px;
                                width: 58px;
                                height: 58px;
                                border-radius: 50%;
                                overflow: hidden;
                                background: #686EFB;
                                text-align:center;
                                img {
                                    width: 100%;
                                    min-height: 58px;
                                }
                                i {
                                    color:#fff;
                                    font-size:25pt;
                                    margin-top:12px;
                                }
                            }
                            .info-box {
                                width: 200px;
                                overflow-x: hidden;
                                padding: 3px 0 0 10px;
                                .subject {
                                    color: #dcdcdc;
                                    font-weight: bold;
                                    font-size: 11pt;
                                    height:31px;
                                    overflow: hidden;
                                    line-height: 130%;
                                }
                                .read-box {
                                    margin-top: 5px;
                                    font-size: 10pt;
                                    color: #999;
                                }
                            }
                            .read-button-box {
                                width: 70px;
                                .read-button {
                                    margin: 10px 0 0 0;
                                    background: #999;
                                    color: #fff;
                                    &.active {
                                        background: #686EFB;
                                    }
                                }

                            }
                        }
                    }
                }

            }


        }

    }


</style>