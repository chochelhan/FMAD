<template>
    <div :class="'mypage-container '+compontentType+' '+mobileClass">
        <div class="modal-header" v-if="!mobileView">
            <div class="center-title">
                {{title}}
            </div>
            <div class="del-box" @click="close()">
                <i class="fas fa-times"></i>
            </div>
        </div>
        <form novalidate @submit.prevent="validate">
            <div :class="'contents '+mobileClass">
                <div class="from-box">

                    <ul class="field-box">
                        <li>
                            <div class="required-icon">제목</div>
                            <div class="field-input">
                                <v-text-field
                                    v-model="subject"
                                    required
                                    background-color="#fff"
                                    placeholder="제목을 입력하세요"
                                    :error-messages="subjectErrors"
                                    @input="$v.subject.$touch()"
                                    @blur="$v.subject.$touch()"
                                    outlined
                                    :dense="dense"
                                ></v-text-field>
                            </div>
                        </li>
                        <li>
                            <div class="required-icon">내용</div>
                            <div class="field-input">
                                <v-textarea
                                    outlined
                                    background-color="#fff"
                                    placeholder="내용을 입력하세요"
                                    v-model="description"
                                    :error-messages="descriptionErrors"
                                    @input="$v.description.$touch()"
                                    @blur="$v.description.$touch()"
                                    rows="10"

                                ></v-textarea>
                            </div>
                        </li>
                        <li v-if="ufileView">
                            <div class="required-icon">파일 업로드</div>
                            <div class="field-input">
                                <div class="file-box">
                                    <div class="file-names" style="background:#fff;">
                                        {{fileName}}

                                    </div>
                                    <div class="file-click">
                                        <input ref="imgContainer" @change="onChangeImg" type="file"
                                               id="vfile">
                                        파일 찾기
                                    </div>
                                </div>
                                <div class="file-message">&#8251; {{limitFileSize/(1024*1024)}}MB 이하로 제한됩니다</div>

                            </div>
                        </li>
                        <li v-if="noticeView">
                            <div class="required-icon">공지글 지정</div>
                            <div class="field-input">
                                <ul class="switch-ul">
                                    <li @click="setNotice('yes')" :class="noticeClass.yes"> 예</li>
                                    <li @click="setNotice('no')" :class="noticeClass.no"> 아니오</li>
                                </ul>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
            <div :class="'modal-footer '+mobileClass">
                <p class="submit-button-box">
                    <v-btn
                        type="button"
                        class="cancle-button"
                        @click="close()"
                        v-if="!mobileView"
                    >
                        취소
                    </v-btn>
                    <v-btn
                        type="submit"
                        class="submit-button"
                    >
                        확인
                    </v-btn>
                </p>
            </div>
        </form>

    </div>
</template>


<script>
	import AUTH from '../../../../api/auth'
	import {validationMixin} from 'vuelidate'
	import {required} from 'vuelidate/lib/validators'
	import UTIL from '../../../../api/util';
	import {
		API_URL_BROADCAST_LIVE_BOARD_ARTICLE_INFO,
		API_URL_BROADCAST_LIVE_BOARD_ARTICLE_UPDATE,
	} from '../../../../api/urls';
	import apiService from '../../../../api/apiService';

	export default {
		name: 'liveBoardRegist',
		mixins: [validationMixin],
		validations: {
			subject: {required},
			description: {required},

		},
		props: ["gno", "no", "compontentType"],
		data() {
			return {
				insertFlag: false,
				mobileView: false,
				mobileClass: '',
				title: '게시글 작성',
				subject: '',
				description: '',
				notice: 'yes',
				fileName: '',
				profileImg: '',
				fileExt: '',
				noticeView: false,
				uid: '',
				userName: '',
				uno: '',
				limitFileSize: 1048576,
				noticeClass: {
					yes: 'active',
					no: ''
				},
				ufileAuth: 'host',
				ufileView: false,
                dense:false,

			}
		},
		created() {
            if (this.$isMobile()) {
                this.mobileClass = 'mobile'
                this.mobileView = true;
                this.dense = true;
            }
			let memberInfo = AUTH.getSession(this.$isMobile());
			if (memberInfo.AUTHTOKEN) {
				this.uid = memberInfo.uid;
				this.uno = memberInfo.no;

			}
			this.getData();
		},
		computed: {
			subjectErrors() {
				const errors = []
				if (!this.$v.subject.$dirty) return errors
				if (!this.$v.subject.required) {
					errors.push('제목을 입력하세요')
				}
				return errors
			},
			descriptionErrors() {
				const errors = []
				if (!this.$v.description.$dirty) return errors
				if (!this.$v.description.required) {
					errors.push('내용을 입력하세요')
				}
				return errors
			},

		},
		methods: {
			getData() {
				const frm = new FormData()
				frm.append('gno', this.gno)
				if (this.no != 'new' && this.no) {
					frm.append('no', this.no)
				}
				apiService.post(API_URL_BROADCAST_LIVE_BOARD_ARTICLE_INFO, frm, (ret) => {

					if (this.uid == 'admin') {
						this.noticeView = true;
						this.notice = 'yes';
					} else this.notice = 'no';
					if (ret.boardInfo) {
						if (this.notice == 'no' && this.uno == ret.boardInfo.uno) {
							this.noticeView = true;
							this.notice = 'yes';
						}

						// console.log(ret.boardInfo);
						this.ufileAuth = ret.boardInfo.ufileAuth
						if (ret.boardInfo.limitRegDate) {
							let limiDates = ret.boardInfo.limitRegDate.split('T');
							let limiDate = limiDates[0] + ' 23:59:59';
							let fendate = new Date(limiDate);
							let nowDate = new Date();
							if (fendate.getTime() >= nowDate.getTime()) {
								this.limitFileSize = 1024 * 1024 * ret.boardInfo.limitFileSize;

							}
						}
					}
					switch (this.ufileAuth) {
						case 'host':
							if (this.noticeView) this.ufileView = true;
						case 'user':
							if (this.uno > 0) {
								this.ufileView = true;
							}
						case 'all':
							this.ufileView = true;
							break;

					}
					if (ret.info && this.no != 'new' && this.no) {
						this.subject = ret.info.subject;
						this.description = UTIL.br2nl(ret.info.description);
						this.setNotice(ret.info.notice)
						this.fileName = ret.info.fileName;
					}
				});
			},
			onChangeImg() {
				const imgObj = this.$refs.imgContainer.files;
				let img = imgObj.length > 0 ? imgObj[0] : null;
				this.fileName = img.name;
				this.profileImg = img;


			},
			setNotice(cmd) {
				this.notice = cmd;
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

				this.noticeClass = {
					yes: yesActive,
					no: noActive
				};
			},
			close() {
				if(this.compontentType=='live') {
					this.$emit("hideEvent",{page:'regist'});
                } else {
					this.$emit("modalHIde",'none');
				}
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
				if (this.no != 'new' && this.no) frm.append('no', this.no)
				frm.append('gno', this.gno)
				frm.append('subject', this.subject)
				frm.append('description', this.description)
				frm.append('notice', this.notice)
				if (this.profileImg) {
					frm.append('datafile', this.profileImg)
					frm.append('fileName', this.fileName)
					let extes = this.fileName.split('.');
					let ext = extes[(extes.length - 1)]
					frm.append('ext', ext)
				}

				this.$eventBus.$emit('overlay', 'show');
				apiService.postFile(API_URL_BROADCAST_LIVE_BOARD_ARTICLE_UPDATE, frm, (res) => {
					this.$eventBus.$emit('overlay', 'hide');
					let params = {}
					this.insertFlag = false;
					params = {
						message: '정보가 저장되었습니다',
						doAction: () => {
							if(this.compontentType=='live') {
								this.$emit("hideEvent",{page:'regist'});
							} else {
								this.$emit("modalHIde",'update');
							}
						}
					};
					this.$eventBus.$emit('modalOpen', params);


				})
			},
		},

	}
</script>
<style lang="scss" scoped>
    .mypage-container {
        min-height: auto;
        background: #fff;
        &.mobile {
            width:100%;
            max-width:100%;
            position:relative;
            top:0;
            left:0;
        }
    }

    .modal-header {
        background: #fff;
        padding: 20px;
        position: relative;
        border-bottom: solid 1px #dcdcdc;
        .center-title {
            text-align: center;
            font-weight: bold;
            color: #000;
            font-size: 14pt;
        }
        .del-box {
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: #999;
            color: #fff;
            text-align: center;
            font-size: 10pt;
            margin: 10px 10px 0 0;
            cursor: pointer;
            position: absolute;
            right: 10px;
            top: 15px;
            line-height: 22px;
        }
    }

    .modal-footer {
        background: #fff;
        padding: 10px 0;
        border-top: solid 1px #dcdcdc;
        .submit-button-box {
            background: #fff;
            display: flex;
            width: 700px;
            margin: auto;
            justify-content: space-between;
            .cancle-button {
                width: 48%;
                border-radius: 0;
                padding: 0;
                background: #999999;
                color: #fff;
                min-height: 60px;
                font-size: 12pt;
            }
            .submit-button {
                width: 48%;
                border-radius: 0;
                padding: 0;
                background: #686EFB;
                color: #fff;
                min-height: 60px;
                font-size: 12pt;

            }
        }
        &.mobile {
            width:100%;
            padding:15px 15px 40px 15px;
            background:none;
            border-top:none;
            .submit-button-box {
                width:100%;
                margin: auto;

                justify-content: space-between;
                .cancle-button {
                    width: 48%;
                    border-radius: 0;
                    padding: 0;
                    background: #999999;
                    color: #fff;
                    min-height: 50px;
                    font-size: 14px;
                }
                .submit-button {
                    width:100%;
                    border-radius: 0;
                    padding: 0;
                    background: #686EFB;
                    color: #fff;
                    min-height: 50px;
                    font-size: 14px;

                }
            }
        }
    }

    .contents {
        background: #fafafa;
        max-height: 500px;
        overflow-y: auto;
        .file-message {
            margin: -22px 0 10px 0;
            font-size: 10pt;
        }
        .field-box {
            padding: 0;
            & > li {
                border-bottom: solid 1px #DCDCDC;
                display: flex;
                padding: 25px 25px 0 25px;
                &:first-child {
                    padding-top: 0;
                    border-top: none;
                }
                .required-icon {
                    width: 150px;
                    color: #000;
                    font-weight: bold;
                    font-size: 12pt;
                    padding-top: 15px;

                }
                .field-input {
                    width: 70%;
                    .switch-ul {
                        width: 100%;
                        padding: 0;
                        display: flex;
                        margin-bottom: 25px;
                        li {
                            background: #fff;
                            width: 50%;
                            border: solid 1px #dcdcdc;
                            text-align: center;
                            line-height: 55px;
                            height: 55px;
                            cursor: pointer;
                            &.active {
                                background: #686EFB;
                                color: #fff;
                            }
                            &:first-child {
                                border-right: none;
                                border-radius: 10px 0 0 10px;
                            }
                            &:last-child {
                                border-radius: 0 10px 10px 0;
                            }
                        }
                    }

                }
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
        &.mobile {

            width: 100%;
            padding:20px 15px;
            .file-message {
                margin: -22px 0 10px 0;
                font-size: 10pt;
            }
            .field-box {
                width:100%;
                padding: 0;
                & > li {
                    display:block;
                    padding:0 15px 0 15px;
                    .required-icon {
                        width:100%;
                        color: #000;
                        font-weight: bold;
                        font-size: 12px;
                        padding:10px 0;

                    }
                    .field-input {
                        width:100%;
                        .switch-ul {
                            width: 100%;
                            padding: 0;
                            display: flex;
                            margin-bottom: 25px;
                            li {
                                background: #fff;
                                width: 50%;
                                border: solid 1px #dcdcdc;
                                text-align: center;
                                line-height: 40px;
                                height: 40px;
                                cursor: pointer;
                                &.active {
                                    background: #686EFB;
                                    color: #fff;
                                }
                                &:first-child {
                                    border-right: none;
                                    border-radius: 10px 0 0 10px;
                                }
                                &:last-child {
                                    border-radius: 0 10px 10px 0;
                                }
                            }
                        }

                    }
                }
            }
            .file-box {
                margin: 0 0 25px 0;
                display: flex;
                width: 100%;
                padding: 0;
                min-height: 45px;
                .file-names {
                    width: 100%;
                    border: solid 1px #9E9E9E;
                    border-right: none;
                    border-radius: 5px 0 0 5px;
                    padding: 10px 0 0 10px;
                    font-size:12px;
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
                    cursor: pointer;
                    border-radius: 0 5px 5px 0;
                    min-height: 45px;
                    font-size:14px;
                    padding-top: 14px;
                    #vfile, #dfile {
                        opacity: 0;
                        width: 100%;
                        position: absolute;
                        right: 0;
                        min-height: 45px;
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

    }

    .live {
        .contents {
            height: 550px;
            max-height: 550px;
            overflow-y: auto;
            .field-box {
                & > li {
                    &:first-child {
                        padding-top: 30px;
                        border-top: none;
                    }

                }
            }
        }
    }


</style>