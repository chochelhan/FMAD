<template>
    <div :class="'mypage-container '+mobileClass">
        <div v-if="mobileView" class="mobile-tab-box">
            <div class="m-title">STEP01. 내 라이브</div>
            <ul class="tab-ul">
                <li class="active">내라이브 정보</li>
                <li @click="goSetting()">환경 설정</li>
            </ul>
        </div>
        <div class="contents">
            <div class="from-box">
                <div v-if="!mobileView" class="stitle"><span class="line">내 라이브 정보</span>
                    <span class="question-box">
                                    <i class="fas fa-question">
                                        <div class="menu-title-tip">
                                            내 라이브 정보
                                            <div class="description">
                                            참가자 초대와 관련된 설정을 진행할 수 있습니다.
                                            URL을 복사하여 참가자에게 링크를 전달하거나,
                                            이메일, 문자, 카카오톡 초대를 이용하여 링크를 전달할 수도 있습니다.
                                            </div>
                                        </div>
                                    </i>
                    </span>
                </div>
                <div v-if="!mobileView" class="title-desc">참가자 초대와 관련된 설정을 진행할 수 있습니다.</div>
                <form novalidate @submit.prevent="validate">
                    <ul class="field-box">
                        <li>
                            <div class="required-icon">내 라이브 이름</div>
                            <div class="field-input">
                                <v-text-field
                                    v-model="name"
                                    required
                                    :error-messages="nameErrors"
                                    @input="$v.name.$touch()"
                                    @blur="$v.name.$touch()"
                                    outlined
                                    :dense="dense"
                                ></v-text-field>
                            </div>
                        </li>
                        <li style="padding-bottom:35px;">
                            <div class="required-icon">내 라이브 URL
                                <span class="question-box">
            <i class="fas fa-question">
              <div class="menu-title-tip">
                내 라이브 URL
                <div class="description">
                복사하기 버튼을 클릭하여 손쉽게 라이브 주소를 복사할 수 있습니다.
                복사한 링크를 참석자들에게 전달하여 라이브를 진행해 보세요.
                </div>
              </div>
            </i>
          </span>
                            </div>
                            <div class="field-input url">
                                {{url}}
                            </div>
                            <div class="copy-box">
                                <v-btn class="copy-button" type="button" depressed @click="urlCopy()">복사하기</v-btn>
                            </div>
                        </li>
                        <li style="padding-bottom:20px;">
                            <div class="required-icon">사용자 초대하기
                                <span class="question-box">
            <i class="fas fa-question">
              <div class="menu-title-tip">
                사용자 초대하기
                <div class="description">
                  이메일, 문자, 카카오톡 초대 버튼을 통해 초대링크를 전달할 수 있습니다.
                </div>
              </div>
            </i>
          </span>
                            </div>
                            <div class="field-input">
                                <span class="share" @click="showInvate('mail')"><img
                                    src="../../../assets/svg/ico_inv1.svg"></span>
                                <span class="share" @click="showInvate('pcs')"><img
                                    src="../../../assets/svg/ico_inv2.svg"></span>
                                <span class="share" @click="showInvate('kakao')"><img
                                    src="../../../assets/svg/ico_inv3.svg"></span>
                            </div>
                        </li>
                        <li>
                            <div class="required-icon">방송 로고 변경하기
                                <span class="question-box">
            <i class="fas fa-question">
              <div class="menu-title-tip">
                방송로고 변경하기
                <div class="description">
                  로고 변경 시 수업/회의가 진행되는 페이지에서 변경된 로고로 수업/회의가 진행됩니다.
          변경이 없을 시, 라이브고의 로고가 노출됩니다.
                </div>
              </div>
            </i>
          </span>
                            </div>
                            <div class="field-input">
                                <div class="file-box">
                                    <div class="file-names">
                                        {{fileName}}

                                    </div>
                                    <div class="file-click">
                                        <input ref="imgContainer" @change="onChangeImg" type="file" accept="image/*"
                                               id="vfile">
                                        파일 찾기
                                    </div>
                                </div>

                            </div>
                        </li>

                    </ul>
                    <p class="submit-button-box">
                        <v-btn
                            type="button"
                            class="cancle-button"
                            v-if="!mobileView"
                        >
                            취소
                        </v-btn>
                        <v-btn
                            type="submit"
                            class="submit-button"
                        >
                            저장
                        </v-btn>
                    </p>

                </form>
            </div>

        </div>
        <v-dialog
            v-model="modalShow"
            width="500"
            style="z-index:100;"
        >
            <div class="modal-box">
                <div class="screen-header">
                    <div class="del-box" @click="modalShow=false"><i class="fas fa-times"></i></div>
                </div>
                <div class="summary">초대링크를 전송할 {{shareText}} 입력해 주세요<br>여러 사람에게 전달하는 경우 따옴표로 구분 지어 주세요.</div>
                <div class="field-box">
                    <v-text-field
                        v-model="emails"
                        required
                        :dense="dense"
                        :error-messages="emailErrors"
                        @input="emailTouch()"
                        @blur="emailTouch()"
                        :placeholder="sharePlaceHolder"
                        outlined
                    ></v-text-field>
                </div>
                <div class="modal-button-box">
                    <v-btn color="primary" type="button" @click="sendInvite()">확인</v-btn>
                </div>
            </div>
        </v-dialog>

    </div>
</template>


<script>
	import {mapGetters} from "vuex";
	import {validationMixin} from 'vuelidate'
	import {required} from 'vuelidate/lib/validators'
	import {
		API_URL_BROADCAST_LIVE_INFO,
		API_URL_BROADCAST_LIVE_UPDATE,
		API_URL_BROADCAST_LIVE_INVITED_USER
	} from '../../../api/urls';
	import apiService from '../../../api/apiService';
	import AUTH from '../../../api/auth';

	export default {
		name: 'liveInfo',
		mixins: [validationMixin],
		validations: {
			name: {required},

		},
		data() {
			return {
				insertFlag: false,
				name: '',
				mobileView: false,
				mobileClass: '',
				profileImg: '',
				fileName: '',
				url: '',
				no: '',
                mobileNo:'',
				modalShow: false,
				shareText: '',
				shareFieldName: '',
				sharePlaceHolder: '',
				cmd: '',
				emails: '',
				memberInfo: {},
				emailErrors: [],
                dense:false,
			}
		},
		created() {
			this.no = this.getGno;
			let memberInfo = AUTH.getSession(this.$isMobile());
			if (memberInfo.AUTHTOKEN) {
				this.memberInfo = memberInfo;

			}
			if(this.$isMobile()) {
			    this.mobileClass ='mobile'
                this.mobileView = true;
			    this.dense = true;
            }

			this.getData();
		},
		computed: {
			...mapGetters('etc', ["getGno"]),
			nameErrors() {
				const errors = []
				if (!this.$v.name.$dirty) return errors
				if (!this.$v.name.required) {
					errors.push('내 라이브 이름을 입력하세요')
				}
				return errors
			},


		},
		methods: {
		    goSetting() {
		      this.$router.push('/live/'+this.no+'/liveSetting')
            },
			emailTouch() {
				this.emailErrors = []
				if (!this.emails) {
					this.emailErrors.push(this.shareFieldName + ' 입력하세요')
				}
			},
			getData() {
				const frm = new FormData()
                frm.append('no', this.no)
				apiService.post(API_URL_BROADCAST_LIVE_INFO, frm, (res) => {
                    console.log('-------')
				    console.log(res)
					this.name = res.info.title;
					this.fileName = res.info.logoName;

					this.url = location.protocol + '//' + location.host + '/userLiveIntro/' + this.no;
				});
			},
			onChangeImg() {
				const imgObj = this.$refs.imgContainer.files;
				let img = imgObj.length > 0 ? imgObj[0] : null;
				this.fileName = img.name;
				this.profileImg = img;


			},
			showInvate(cmd) {
				this.cmd = cmd;
				if (cmd != 'kakao') {
					this.modalShow = true;
					if (cmd == 'pcs') {
						this.shareText = '전화번호를 -없이';
						this.shareFieldName = '전화번호를'
						this.sharePlaceHolder = '예)01023456783,0101234567'
					} else {
						this.shareText = '이메일 계정을';
						this.shareFieldName = '이메일을'
						this.sharePlaceHolder = '예)example@example.com,host@host.com'
					}
					this.emails = '';
				} else {
					this.kaksoSend()
				}
			},
			kaksoSend() {
				let shareUrl = this.url;
				let title = this.memberInfo.name + '님의 Duckku Bj 라이브 초대';
				let description = '안녕하세요, ' + this.memberInfo.name + '님의 Duckku Bj 라이브  초대되었습니다.';
				Kakao.Link.sendDefault({
					objectType: 'feed',
					content: {
						title: title,
						description: description,
						imageUrl: '',
						link: {
							mobileWebUrl: shareUrl,
						},
					},
					buttons: [
						{
							title: '웹으로 이동',
							link: {
								mobileWebUrl: shareUrl,
							},
						},

					]
				});
			},
			sendInvite() {
				if (this.emails) {
					let msg = '';
					if (this.cmd == 'pcs') {
						msg = '문자를'
					} else {
						msg = '메일을'
					}
					const frm = new FormData()
					frm.append('url', this.url)
					frm.append('emails', this.emails)
					frm.append('name', this.memberInfo.name)
					frm.append('cmd', this.cmd)
					apiService.post(API_URL_BROADCAST_LIVE_INVITED_USER, frm, (res) => {
						this.modalShow = false;
						let message = {
							message: '초대' + msg + ' 발송하였습니다',
						};
						this.$eventBus.$emit('modalOpen', message);

					});
				} else {
					this.emailTouch();
				}
			},
			urlCopy() {
				const selBox = document.createElement('textarea');
				selBox.style.position = 'fixed';
				selBox.style.left = '0';
				selBox.style.top = '0';
				selBox.style.opacity = '0';
				selBox.value = this.url;
				document.body.appendChild(selBox);
				selBox.focus();
				selBox.select();
				document.execCommand('copy');
				document.body.removeChild(selBox);
				let message = {
					message: '내라이브 URL을 클립보드에 복사하였습니다',
				};
				this.$eventBus.$emit('modalOpen', message);
			},
			validate() {

				this.$v.$touch()
				if (!this.$v.$anyError) {
					this.formSubmit();
				}


			},
			formSubmit() {
				if (this.insertFlag) return;
				this.insertFlag = true;

				const frm = new FormData()
				frm.append('title', this.name)
				frm.append('no', this.no)
				frm.append('cmd', 'logoImg')

				if (this.profileImg) {
					frm.append('logo', this.profileImg)
				}
				this.$eventBus.$emit('overlay', 'show');
				apiService.postFile(API_URL_BROADCAST_LIVE_UPDATE, frm, (res) => {
					this.$eventBus.$emit('overlay', 'hide');
					let params = {}
					this.insertFlag = false;
					params = {
						message: '정보가 저장되었습니다',

					};
					this.$eventBus.$emit('modalOpen', params);


				})
			},
		},

	}
</script>
<style lang="scss" scoped>
.mobile-tab-box {
    width:100%;
    margin:0;
    .m-title {
        font-weight:bold;
        font-size:12pt;
        text-align:center;

    }
    .tab-ul {
        width:100%;
        padding:0;
        margin:20px 0 0 0;
        display: flex;
        border-top:solid 1px #dcdcdc;
        border-bottom:solid 1px #dcdcdc;
        li {
            width:50%;
            line-height:45px;
            height:45px;
            font-size:11pt;
            text-align:center;
            &.active {
                border-right:solid 1px #dcdcdc;
                background:#EC2625;
                color:#fff;
            }
        }
    }
}
    .contents {
        .share {
            padding-right: 15px;
            cursor: pointer;
            img {
                margin-top: 8px;
                width: 40px;
            }
        }
        .url {
            margin-top: 10px;
            max-width: 589px;
        }
        .copy-box {
            .copy-button {
                height: 40px;
                background: #F4F4F4;
                border: solid 1px #999;
                color: #000;
                line-height: 20px;
                width: 100px;
                border-radius: 5px;
                text-align: center;
                margin-top: 5px;
                padding: 0;
            }
        }
        .file-box {
            margin: 0 0 25px 0;
            display: flex;
            width: 100%;
            padding: 0;
            min-height: 50px;
            .file-names {
                width: 100%;
                border: solid 1px #9E9E9E;
                border-right: none;
                border-radius: 5px 0 0 5px;
                padding: 15px 0 0 10px;
                i {
                    margin: 3px 0 0 7px;
                    cursor: pointer;
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


    }

    .modal-box {
        background: #fff;
        padding: 0;
        .screen-header {
            position: relative;
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
            padding-top: 60px;
            text-align: center;
            line-height: 150%;
            font-size: 11pt;
            color: #000;

        }

        .field-box {
            margin: 20px;
            height: 95px;
            .field {
                width: 100%;
            }
        }
        .modal-button-box {
            button {
                width: 100%;
                height: 50px;
                border-radius: 0;
            }
        }
    }
    .mobile {
        .file-box {
            min-height: 35px;
            .file-names {
                width: 100%;
                height:40px;
                border: solid 1px #9E9E9E;
                border-right: none;
                border-radius: 5px 0 0 5px;
                padding:8px 0 0 5px;
                font-size:11px;
                i {
                    margin: 3px 0 0 7px;
                    cursor: pointer;
                }

            }
            .file-click {
                position: relative;
                width: 100px;
                background: #fff;
                border: solid 1px #9E9E9E;
                text-align: center;
                color: #000;
                font-size:10pt;
                cursor: pointer;
                border-radius: 0 5px 5px 0;
                min-height: 40px;
                height: 40px;
                padding-top: 8px;
                #vfile, #dfile {
                    opacity: 0;
                    width: 100%;
                    position: absolute;
                    right: 0;
                    min-height: 40px;
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
    }
</style>