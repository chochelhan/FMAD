<template>
    <div :class="'data-container '+mobileClass">
        <div class="screenLayout" v-if="screenShow">
            <div class="name-box" v-if="nameBoxShow">
                <div class="screen-header">
                    <!--div class="del-box" (click)="confirmGoHome()"><i class="fas fa-times"></i></div-->
                </div>
                <form novalidate @submit.prevent="nameSubmit">
                    <div class="summary">강의자의 요청에 따라<br> 입장시 사용할 이름을 입력해 주세요.</div>
                    <div class="field-box">

                        <v-text-field
                            v-model="name"
                            required
                            label="이름"
                            placeholder="이름을 입력하세요"
                            :error-messages="nameErrors"
                            @input="nameTouch()"
                            @blur="nameTouch()"
                            outlined
                        ></v-text-field>
                    </div>
                    <div class="button-box">
                        <v-btn
                            type="submit"
                            class="submit-button"
                        >
                            계속하기
                        </v-btn>
                    </div>
                </form>
            </div>
            <div class="name-box" v-if="emailBoxShow && reqdataEmail">
                <div class="screen-header">
                    <!--div class="del-box" (click)="emailBoxClose()"><i class="fas fa-times"></i></div-->
                </div>
                <form novalidate @submit.prevent="emailSubmit">
                    <div class="summary">강의자의 요청에 따라<br> 입장시 사용할 이메일을 입력해 주세요.</div>
                    <div class="field-box">
                        <v-text-field
                            v-model="email"
                            required
                            label="이메일"
                            placeholder="이메일을 입력하세요"
                            :error-messages="emailErrors"
                            @input="emailTouch()"
                            @blur="emailTouch()"
                            outlined
                        ></v-text-field>
                    </div>
                    <div class="button-box">
                        <v-btn
                            type="submit"
                            class="submit-button"
                        >
                            계속하기
                        </v-btn>
                    </div>
                </form>
            </div>

            <div class="name-box add-data-box" v-if="addDataBoxShow">
                <div class="screen-header">
                    <!--div class="del-box" (click)="addDataBoxClose()"><i class="fas fa-times"></i></div-->
                </div>
                <form novalidate @submit.prevent="addDataSubmit">
                    <div class="summary">강의자의 요청에 따라<br> 입장시 사용할 정보를 입력해 주세요.</div>
                    <div class="field-box" v-if="reqdataJob">
                        <v-text-field
                            v-model="job"
                            required
                            label="소속"
                            placeholder="소속을 입력하세요"
                            :error-messages="jobErrors"
                            @input="jobTouch()"
                            @blur="jobTouch()"
                            outlined
                        ></v-text-field>
                    </div>
                    <div class="field-box" v-if="reqdataPart">
                        <v-text-field
                            v-model="part"
                            required
                            label="부서"
                            placeholder="부서를 입력하세요"
                            :error-messages="partErrors"
                            @input="partTouch()"
                            @blur="partTouch()"
                            outlined
                        ></v-text-field>

                    </div>
                    <div class="field-box" v-if="reqdataPosi">
                        <v-text-field
                            v-model="posi"
                            required
                            label="직급"
                            placeholder="직급을 입력하세요"
                            :error-messages="posiErrors"
                            @input="posiTouch()"
                            @blur="posiTouch()"
                            outlined
                        ></v-text-field>

                    </div>
                    <div class="field-box" v-if="reqdataSex" style="padding-bottom:40px;">
                        <!--mat-label>성별</mat-label-->
                        <v-radio-group
                            v-model="sex"
                            row
                        >
                            <v-radio
                                label="남"
                                value="man"
                            ></v-radio>
                            <v-radio
                                label="여"
                                value="woman"
                            ></v-radio>
                        </v-radio-group>
                    </div>
                    <div class="button-box">
                        <v-btn
                            type="submit"
                            class="submit-button"
                        >
                            계속하기
                        </v-btn>
                    </div>
                </form>
            </div>


            <div class="name-box login-box" v-if="loginBoxShow">
                <div class="screen-header">
                </div>
                <div class="screen-title">웹라이브 로그인</div>
                <div class="summary">강의자의 요청에 따라 <br>채팅참여를 위해 로그인을 진행해 주세요<br>회원가입이 되어있지 않은 경우<br>
                    로그인 페이지에서 회원가입이 가능합니다.
                </div>
                <div class="button-row">
                    <v-btn
                        type="button"
                        class="cancle-button"
                        @click="goChat()"
                    >
                        계속하기
                    </v-btn>

                    <v-btn
                        type="button"
                        class="submit-button"
                        @click="goLogin()"
                    >
                        로그인하기
                    </v-btn>
                </div>
            </div>
        </div>
        <div class="screenLayout" v-if="enterBoxShow && meetingInfo.status != 'complete'">
            <div class="name-box enter-box">
                <div class="screen-title">
                    <div class="logo" v-if="!logoUrl"><img src="../../../../assets/images/logo.png"></div>
                    <div class="logo" v-if="logoUrl"><img :src="host+logoUrl"></div>
                </div>
                <div class="sub-subject-box">
                    <h3>{{subject}}</h3>
                    <div class="author">{{author}}</div>
                </div>
                <div class="button-single-row">
                    <v-btn
                        type="button"
                        class="submit-button"
                        @click="joinMeeting()">
                        입장하기
                    </v-btn>

                </div>
            </div>
        </div>
    </div>
</template>


<script>
	import {mapActions, mapGetters} from "vuex";
	import AUTH from '../../../../api/auth';
	import JQ from 'jquery'
	import {
		HOST,
		API_URL_BROADCAST_LIVE_INFO
	} from '../../../../api/urls';
	import apiService from '../../../../api/apiService';

	export default {
		name: 'userVideoIntro',
		computed: {
			...mapGetters('member', ["getUid"])
		},
		watch: {
			getUid(val) {
				if (val) {
					this.loginBoxShow = false;
					this.setMemberInfo();
					this.checkMemberInfo(this.chatRoomNo);
					this.joinMeeting();

				}
			}

		},
		data() {
			return {
				isLogin: false,
				mtype: '',
				host: HOST,
				keyword: '',
				DEBUG: false,
				no: '',
				memberInfo: {},
				chatUno: '',
				chatRoomNo: '',
				subject: '',
				joinUid: '',
				screenShow: false,
				meetingInfo: {},
				nameBoxShow: false,
				loginBoxShow: false,
				chatAnyWayGo: false,
				initShow: false,

				/* add params */
				acceptType: '',
				safety: '',
				reqdataEmail: true,
				reqdataJob: false,
				reqdataPart: false,
				reqdataPosi: false,
				reqdataSex: false,
				safetyEmails: [],
				emailBoxShow: false,
				addDataBoxShow: false,
				enterBoxShow: true,
				author: '',
				logoUrl: '',
				name: '',
				email: '',
				job: '',
				posi: '',
				part: '',
				sex: 'man',
				nameErrors: [],
				emailErrors: [],
				jobErrors: [],
				posiErrors: [],
				partErrors: [],
				sexErrors: [],
                mobileView: false,
                mobileClass: '',

			}

		},
		created() {
            if (this.$isMobile()) {
                this.mobileView = true;
                this.mobileClass = 'mobile'
                this.setClass('none')
            }
		    AUTH.setDevice(this.$isMobile());
			let path = this.$route.path.split('/');
			this.no = path[2];
			if (!this.no) {
				this.$router.push('/')
			}
			this.setMemberInfo();
			this.getData();
		},
		methods: {
            ...mapActions('mobile', ["setClass"]),
            ...mapActions('member', ["setLoginBoxOpen"]),
			getData() {
				const frm = new FormData()
				frm.append('no', this.no)
				apiService.post(API_URL_BROADCAST_LIVE_INFO, frm, (ret) => {
					this.meetingInfo = ret.info;
					if (!this.DEBUG) {
						if (this.meetingInfo.status == 'complete') {
						    let message = {
                                message: '종료된 방송입니다',

                            };
                            this.$eventBus.$emit('modalOpen', params);
							return;
						}
					} else this.meetingInfo.status = 'ready';
					this.no = this.meetingInfo.no;

					this.acceptType = (this.meetingInfo.acceptType) ? this.meetingInfo.acceptType : 'yes';

					if (this.meetingInfo.reqdata) {
						let reqdata = this.meetingInfo.reqdata;
						this.reqdataJob = (reqdata.job == 'yes') ? true : false;
						this.reqdataPart = (reqdata.part == 'yes') ? true : false;
						this.reqdataPosi = (reqdata.posi == 'yes') ? true : false;
						this.reqdataSex = (reqdata.sex == 'yes') ? true : false;
					}
					this.logoUrl = (ret.info.logo) ? ret.info.logo : '';
					this.author = ret.hostInfo.name;
					this.subject = this.meetingInfo.title;
					this.safety = (this.meetingInfo.safety) ? this.meetingInfo.safety : 'yes';
					if (this.meetingInfo.safety == 'yes' && this.meetingInfo.safetyEmails) {
						let safetyEmails = this.meetingInfo.safetyEmails.split(',');
						let addEmails = [];
						for (let email of safetyEmails) {
							let checkEmails = email.split(/\n/g);
							if (checkEmails.length > 1) {
								for (let em of checkEmails) {
									addEmails.push(em.trim());
								}
							} else {
								addEmails.push(email.trim())
							}
						}
						if (this.meetingInfo.observeEmails) {
							let observeEmails = this.meetingInfo.observeEmails.split(',')
							for (let email of observeEmails) {
								let checkEmails = email.split(/\n/g);
								if (checkEmails.length > 1) {
									for (let em of checkEmails) {
										addEmails.push(em.trim());
									}
								} else {
									addEmails.push(email.trim())
								}
							}
						}
						this.safetyEmails = addEmails;
						this.reqdataEmail = true;
					} else {
						this.meetingInfo.safety = 'no';
					}

                    this.checkMemberInfo(ret.hostInfo.uid);


				})
			},
			nameTouch() {
				this.nameErrors = [];
				if (!this.name) {
					this.nameErrors.push('이름을 입력하세요')
				}
			},
			emailTouch() {
				this.emailErrors = [];
				if (!this.email) {
					this.emailErrors.push('이메일을 입력하세요')
				}
			},
			jobTouch() {
				this.jobErrors = [];
				if (!this.job) {
					this.jobErrors.push('소속을 입력하세요')
				}
			},
			partTouch() {
				this.partErrors = [];
				if (!this.part) {
					this.partErrors.push('부서를 입력하세요')
				}
			},
			posiTouch() {
				this.posiErrors = [];
				if (!this.posi) {
					this.posiErrors.push('직급을 입력하세요')
				}
			},
			setMemberInfo() {
                if(location.hostname=='localhost')return;
				let memberInfo = AUTH.getSession(this.$isMobile());
				if (memberInfo.AUTHTOKEN) {
					this.isLogin = true;
					this.mtype = memberInfo.mtype;
					this.memberInfo = memberInfo;
				}
			},
			checkMemberInfo(hostUid) {
                if (this.isLogin) {
                  	if (this.memberInfo.uid != hostUid) {
						this.name = this.memberInfo.name;
						this.email = (this.memberInfo.email)?this.memberInfo.email:'ast@nt.com';
						this.joinUid = this.memberInfo.uid;

					} else {
						let params = {
							message: '잘못된 접근입니다',
                            doAction:()=> {
								this.$router.push('/');
                            }
						}
						this.$eventBus.$emit('modalOpen', params);
						return;
					}
				} else {

                    this.memberInfo = null;
					if (localStorage.getItem('joinRoom') != this.no.toString()) {
						let randumNum = (Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000);
						this.joinUid = hostUid + randumNum;

						localStorage.setItem('joinRoom', this.no.toString());
						localStorage.setItem('joinUid', this.joinUid);
					} else {
						this.joinUid = localStorage.getItem('joinUid');
					}
					//this.jsonRpcService.setting(this.joinUid);
				}
            	this.chatRoomNo = hostUid;
				this.initShow = true;
			},
			joinMeeting() {
				this.enterBoxShow = false;
				if (this.meetingInfo.joinUser == 'user' && this.memberInfo == null && !this.chatAnyWayGo) {
					this.loginBoxShow = true;
					this.screenShow = true;
					return;
				}
				if (!this.name) {
					this.nameBoxShow = true;
					this.screenShow = true;
					return;
				}
				if (this.memberInfo == null && !this.email && this.reqdataEmail) {
					this.emailBoxShow = true;
					this.screenShow = true;
					return;
				}
				if (localStorage.getItem("observeUser") != "yes") {
					if (this.reqdataJob || this.reqdataPart || this.reqdataPosi || this.reqdataSex) {
						this.addDataBoxShow = true;
						this.screenShow = true;
						return;
					}
				}


				let params = {
					roomNo: this.chatRoomNo,
					roomType: 'youtube',
					roomHost: 'no',
				};
				sessionStorage.setItem('chatRoomNo', this.chatRoomNo);
				sessionStorage.setItem('joinUid', this.joinUid);
				sessionStorage.setItem('userName', this.name);
				sessionStorage.setItem('userEmail', this.email);
                let uid = sessionStorage.getItem('joinUid');
                let userName = sessionStorage.getItem('userName');
                let userEmail = sessionStorage.getItem('userEmail');
              	this.showLiveBrocastByJsonRpc();
				/*
                let Interval = setInterval(() => {
                    if (this.jsonRpcService.sessionId) {
                        this.jsonRpcService.checkZoomRefreshUser(params);
                        clearInterval(Interval);
                    }
                }, 100)
                */
			},
			confirmGoHome() {
				this.screenShow = false;
				this.nameBoxShow = false;
			},
			nameSubmit() {
				if (this.name) {
					this.nameBoxShow = false;
					this.screenShow = false;
					this.joinMeeting();
				} else {
					this.nameTouch()
				}

			},
			goChat() {
				this.chatAnyWayGo = true;
				this.loginBoxShow = false;
				this.screenShow = false;
				this.joinMeeting();
			},
			goLogin() {
				this.setLoginBoxOpen(true);
			},
			emailBoxClose() {
				this.emailBoxShow = false;
				this.screenShow = false;

			},
			emailSubmit() {
				if (this.email) {
					let pattern = /^[_a-zA-Z0-9-\.]+@[\.a-zA-Z0-9-]+\.[a-zA-Z]+$/;
					if (!pattern.test(this.email)) {
						this.emailErrors = [];
						this.emailErrors.push('잘못된 형식의 이메일 입니다')

						return;
					}

					if (this.safety == 'yes' && this.safetyEmails.length > 0) {

						let sefetyFlag = false;
						for (let em of this.safetyEmails) {
							if (em == this.email.trim()) {
								sefetyFlag = true;
								break;
							}
						}
						if (!sefetyFlag) {
							this.emailErrors = [];
							this.emailErrors.push('허가된지 않은 이메일 입니다')
							return;
						}
					}
					if (this.meetingInfo.observeEmails) {
						let observeEmails = this.meetingInfo.observeEmails.split(',')
						for (let email of observeEmails) {
							let checkEmails = email.split(/\n/g);
							if (checkEmails.length > 1) {
								for (let em of checkEmails) {
									if (em.trim() == this.email.trim()) {
										localStorage.setItem("observeUser", "yes")
									}
								}
							} else {
								if (email.trim() == this.email.trim()) {
									localStorage.setItem("observeUser", "yes")
								}

							}
						}
					}
					this.emailBoxShow = false;
					this.screenShow = false;
					this.joinMeeting();
				} else {
					this.emailTouch();
				}
			},
			addDataSubmit() {

				sessionStorage.setItem('userJob', '');
				sessionStorage.setItem('userPart', '');
				sessionStorage.setItem('userPosi', '');
				sessionStorage.setItem('userSex', '');

				let nextFlag = false;
				if (this.reqdataJob) {
					if (this.job) {
						nextFlag = true;
						sessionStorage.setItem('userJob', this.job);
					} else {
						this.jobTouch();
						nextFlag = false;
					}
				}
				if (this.reqdataPart) {
					if (this.part) {
						nextFlag = true;
						sessionStorage.setItem('userPart', this.part);
					} else {
						nextFlag = false;
						this.partTouch();
					}
				}
				if (this.reqdataPosi) {
					if (this.posi) {
						nextFlag = true;
						sessionStorage.setItem('userPosi', this.posi);
					} else {
						nextFlag = false;
						this.posiTouch();
					}
				}

				if (this.reqdataSex) {
					sessionStorage.setItem('userSex', this.sex);
				}
				if (nextFlag) {

					sessionStorage.setItem('chatRoomNo', this.chatRoomNo);
					sessionStorage.setItem('joinUid', this.joinUid);
					sessionStorage.setItem('userName', this.name);
					sessionStorage.setItem('userEmail', this.email);

					this.addDataBoxShow = false;
					this.screenShow = false;

                    this.showLiveBrocastByJsonRpc();
				}
			},
			addDataBoxClose() {
				this.addDataBoxShow = false;
				this.screenShow = false;
			},
			showLiveBrocastByJsonRpc() {
				const frm = new FormData()
                frm.append('no', this.no)
				apiService.post(API_URL_BROADCAST_LIVE_INFO, frm, (ret) => {
					let message = {};
					switch(ret.info.status) {
						case 'complete':
							message = {
								message: '종료된 방송입니다',
							}
							this.$eventBus.$emit('modalOpen', message);
							break;
						case 'ready':

							message = {
								message: '준비중인 방송입니다',
							}
							this.$eventBus.$emit('modalOpen', message);
							break;

						case 'ing':
							let width = JQ(window).width();
							let height = JQ(window).height() + 200;
							if(this.mobileView) {
                                this.$router.push('/userLiveMobile/' + this.no);

                            } else {
                                window.open('/userLive/' + this.no, 'userLiveWin', 'width=' + width + ',height=' + height);
                            }

							break;
					}
				});

            }


		}
	}
</script>

<style lang="scss" scoped="true">
.data-container {
    .screenLayout {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 10;
        background: rgba(255, 255, 255, 0.1);

        .name-box {
            width: 400px;
            height: 300px;
            -webkit-box-shadow: 1px 1px 9px -1px rgba(71, 70, 71, 0.53);
            -moz-box-shadow: 1px 1px 9px -1px rgba(71, 70, 71, 0.53);
            box-shadow: 1px 1px 9px -1px rgba(71, 70, 71, 0.53);
            border-radius: 10px;
            position: absolute;
            left: 50%;
            top: 50%;
            background: #ffffff;
            margin: -160px 0 0 -200px;
            padding: 60px 20px 0 20px;

            &.rtq-box {
                width: 500px;
                height: 580px;
                margin: -290px 0 0 -250px;

                textarea {
                    height: 300px;
                }
            }

            &.add-data-box {
                height: auto;
                padding-bottom: 30px;
                margin-top: -300px

            }

            .screen-header {
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

            .summary {
                text-align: center;
                line-height: 150%;
                font-size: 11pt;
                color: #000;

            }

            .field-box {
                margin: 20px 0 0 0;

                .field {
                    width: 100%;
                }
            }

            .button-box {
                button {
                    width: 100%;
                    height: 50px;
                    border-radius: 25px;
                    background: #5E65E3;
                    color: #fff;
                }
            }

            &.login-box {
                .screen-title {
                    text-align: center;
                    font-weight: bold;
                    color: #000;
                    font-size: 12pt;
                    margin-bottom: 17px;
                }

                .button-row {
                    margin-top: 24px;
                    width: 100%;

                    button {
                        width: 48%;
                        height: 50px;
                        border-radius: 25px;
                        background: #5E65E3;
                        color: #fff;

                        &:first-child {
                            margin-right: 4%;
                            background: #999;
                        }
                    }

                }

            }
        }

        &.black {
            background: rgba(0, 0, 0, 0.4);
        }
    }


    .enter-box {
        text-align: center;

        .screen-title {
            font-weight: bold;
            color: #1E90FF;
            font-size: 17pt;

            img {
                max-width: 120px;
                max-height: 50px;
            }
        }

        .sub-subject-box {
            width: 100%;
            height: 75px;
            background: #fafafa;
            padding: 15px;
            margin: 20px 0;

            h3 {

                font-size: 13pt;
                font-weight: bold;
                color: #000;
                padding: 0;
                margin: 0 0 3px 0;
            }

            .author {

                font-size: 11pt;
                color: #999;
            }
        }

        .button-single-row {
            padding-top: 10px;

            .submit-button {
                width: 100%;
                height: 50px;
                border-radius: 25px;
                background: #5E65E3;
                color: #fff;
            }
        }
    }
    &.mobile {
        .screenLayout {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 10;
            background: rgba(0,0,0, 0.4);

            .name-box {
                width: 80%;
                height: 300px;
                -webkit-box-shadow: 1px 1px 9px -1px rgba(71, 70, 71, 0.53);
                -moz-box-shadow: 1px 1px 9px -1px rgba(71, 70, 71, 0.53);
                box-shadow: 1px 1px 9px -1px rgba(71, 70, 71, 0.53);
                border-radius: 10px;
                position: absolute;
                left: 50%;
                top: 50%;
                background: #ffffff;
                margin: -150px 0 0 -40%;
                padding: 60px 20px 0 20px;

                &.rtq-box {
                    width: 80%;
                    height: 580px;
                    margin: -290px 0 0 -40%;

                    textarea {
                        height: 300px;
                    }
                }

                &.add-data-box {
                    height: auto;
                    padding-bottom: 30px;
                    margin-top: -300px

                }

                .screen-header {
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

                .summary {
                    text-align: center;
                    line-height: 150%;
                    font-size: 11pt;
                    color: #000;

                }

                .field-box {
                    margin: 20px 0 0 0;

                    .field {
                        width: 100%;
                    }
                }

                .button-box {
                    button {
                        width: 100%;
                        height: 50px;
                        border-radius: 25px;
                        background: #5E65E3;
                        color: #fff;
                    }
                }

                &.login-box {
                    .screen-title {
                        text-align: center;
                        font-weight: bold;
                        color: #000;
                        font-size: 12pt;
                        margin-bottom: 17px;
                    }

                    .button-row {
                        margin-top: 24px;
                        width: 100%;

                        button {
                            width: 48%;
                            height: 50px;
                            border-radius: 25px;
                            background: #5E65E3;
                            color: #fff;

                            &:first-child {
                                margin-right: 4%;
                                background: #999;
                            }
                        }

                    }

                }
            }

            &.black {
                background: rgba(0, 0, 0, 0.4);
            }
        }


        .enter-box {
            text-align: center;

            .screen-title {
                font-weight: bold;
                color: #1E90FF;
                font-size: 17pt;

                img {
                    max-width: 120px;
                    max-height: 50px;
                }
            }

            .sub-subject-box {
                width: 100%;
                height: 75px;
                background: #fafafa;
                padding: 15px;
                margin: 20px 0;

                h3 {

                    font-size: 13pt;
                    font-weight: bold;
                    color: #000;
                    padding: 0;
                    margin: 0 0 3px 0;
                }

                .author {

                    font-size: 11pt;
                    color: #999;
                }
            }

            .button-single-row {
                padding-top: 10px;

                .submit-button {
                    width: 100%;
                    height: 50px;
                    border-radius: 25px;
                    background: #5E65E3;
                    color: #fff;
                }
            }
        }
    }

}
</style>