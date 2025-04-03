<template>
    <div :class="'modal-container '+mobileClass">
        <div class="header-box" v-if="!mobileView">
            <div class="sub-title"> {{title}}</div>
            <span @click="modalHide('none')"><i class="fa fa-times"></i></span>
        </div>
        <div class="form-box">
            <form novalidate @submit.prevent="validate">
                <ul class="form-basic">
                    <li class="item-list">
                        <v-select id="grp"
                                  class="selectBox"
                                  v-model="part"
                                  :items="partList"
                                  label="분류 선택"
                                  outlined
                                  :error-messages="partErrors"
                                  @input="partTouch"
                                  @blur="partTouch"
                                  :dense="dense"
                        ></v-select>
                    </li>
                    <!--li class="item-list" id="subject">

                        <ul class="radio-box" style="margin-top:-8px;" v-if="isAdmin">
                            <li @click="setNotice()">
                                <div :class="'icon-box '+noticeClass">
                                    <i class="fas fa-check"></i>
                                </div>
                                <div class="text">공지글</div>
                            </li>
                        </ul>
                    </li-->
                    <li class="item-list" id="contents">
                        <quill-editor
                            ref="myQuillEditor"
                            class="editor"
                            v-model="contents"
                            :options="editorOption"
                            cols="20"
                            @change="onEditorChange($event)"
                        ></quill-editor>
                    </li>

                </ul>
                <div class="sub-title" style="padding-bottom:10px;">이미지 첨부</div>
                <ul class="form-basic">

                    <li class="item-list" id="atImg">
                        <div class="file-box">
                            <div class="file-names">
                                <v-chip
                                    class="ma-2"
                                    color="orange"
                                    text-color="white"
                                    v-for="(fitem,index) in imgList" :key="index"
                                >
                                    <span>{{fitem.name}}</span>
                                    <i @click="deleteImg(index)" class="fas fa-times-circle"></i>
                                </v-chip>
                            </div>
                            <div class="file-click">
                                <input ref="imgContainer" @change="onChangeImg" type="file" accept="image/*" id="vfile">
                                <i class="fas fa-images"></i>
                                이미지 찾기
                            </div>
                        </div>


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
	import {validationMixin} from 'vuelidate'
	import {required} from 'vuelidate/lib/validators'
	import JQ from 'jquery'
	import {
		API_URL_USER_PHOTO_ARTICLE_REGIST_INFO,
		API_URL_USER_PHOTO_ARTICLE_REGIST
	} from '../../../../api/urls';
	import apiService from '../../../../api/apiService';
	import 'quill/dist/quill.core.css'
	import 'quill/dist/quill.snow.css'
	import 'quill/dist/quill.bubble.css'
	import {quillEditor} from 'vue-quill-editor'

	export default {
		name: 'userPhotoRegist',
		mixins: [validationMixin],
		validations: {
			subject: {required},

		},
		props: ["ownerUid", "no"],
		components: {
			quillEditor,
		},
		data() {
			return {
                mobileView: false,
                mobileClass: '',
				title: '사진첩 작성',
				groupList: [],
				part: '',
				partList: [],
				notice: '',
                dense:false,
				noticeClass: '',
				contents: '',
				partErrors: [],
				isLogin: false,
				memberInfo: {},
				imgList:[],
				buttonText: '사진첩 작성하기',
				editorOption: {
					theme: 'snow',
					placeholder: '내용을 입력하세요',
					modules: {
						toolbar: [
							[{'header': [1, 2, 3, 4, 5, 6, false]}],
							[{'color': []}, {'background': []}],
							['bold', 'italic', 'underline', 'strike'],

						],
						clipboard: {
							matchVisual: false
						}
					}
				},
				isAdmin: false,
                mobileOwnerUid:'',
                mobileNo:'',
			}
		},
		created() {
            if (this.$isMobile()) {
                this.mobileView = true;
                this.mobileClass = 'mobile'
                this.mobileOwnerUid = this.$route.params.uid;
                this.mobileNo = this.$route.params.no;
                this.dense = true;
            }
			let memberInfo = AUTH.getSession(this.$isMobile());
			if (memberInfo.AUTHTOKEN) {
				this.isLogin = true;
				this.memberInfo = memberInfo;
			}
			this.getData();
		},
		methods: {
			onEditorChange({quill, html, text}) {
				this.contents = html

			},
			modalHide(cmd) {
				this.$emit('modalHide', cmd)
			},
			setNotice() {
				if (!this.notice) {
					this.notice = 'yes'
					this.noticeClass = 'active'
				} else {
					this.notice = ''
					this.noticeClass = ''
				}
			},
			getData() {
				const frm = new FormData()
                if(this.mobileOwnerUid) {
                    frm.append('uid',this.mobileOwnerUid)
                } else {
                    frm.append('uid', this.ownerUid)
                }

				if (this.no) {
					frm.append('no', this.no)
					this.title = '사진첩 수정'
					this.buttonText = '사진첩 수정하기';

				} else if(this.mobileNo) {
                    frm.append('no', this.mobileNo)
                    this.title = '사진첩 수정'
                    this.buttonText = '사진첩 수정하기';
                }
				apiService.post(API_URL_USER_PHOTO_ARTICLE_REGIST_INFO, frm, (res) => {
					let boardinfos = res.board.content;
					this.ownerNo = res.board.ownerNo;
					for (let part of boardinfos) {
						this.partList.push({text: part.name, value: part.code});
					}

					if (this.no || this.mobileNo) {

						let articleInfo = res.info;
					    this.part = articleInfo.bid;
						this.subject = articleInfo.subject;
						this.contents = articleInfo.contents;
						if (articleInfo.notice == 'yes') {
							this.notice = 'yes'
							this.noticeClass = 'active'
						}
						if (articleInfo.vfiles) {
							for(let img of articleInfo.vfiles) {
								this.imgList.push(img)
							}

						}


					}


				});
			},
			partTouch() {
				this.partErrors = [];
				if (!this.part) {
					this.partErrors.push('분류를 선택하세요')
				}

			},
			deleteImg(index) {
				this.imgList.splice(index, 1);
			},
			onChangeImg() {
				const imgObj = this.$refs.imgContainer.files;
				let img = imgObj.length > 0 ? imgObj[0] : null;
				this.imgList.push(img);


			},
			validate() {


				if (!this.part) {
					this.partTouch();
					return;

				}

				if (!this.contents) {
					let params = {
						message: '내용을 입력하세요',
					};
					this.$eventBus.$emit('modalOpen', params);
					return;
				}

				this.$eventBus.$emit('overlay', 'open');

				const frm = new FormData()
				frm.append('subject', '사진첩');
				frm.append('contents', this.contents);
				frm.append('notice', this.notice);
				//frm.append('rauth', this.rauth);

				frm.append('ownerNo', this.ownerNo);

				if ((this.no && this.no != 'new') || this.mobileNo) {
				    if(this.mobileNo) {
                        frm.append('no', this.mobileNo)
                    } else {
                        frm.append('no', this.no)
                    }
					let isImgs = [];
					if (this.imgList.length > 0) {
						for (let file of this.imgList) {
							if (!file.type) {
								isImgs.push(file);
							}
						}
					}
					frm.append('isImgs', JSON.stringify(isImgs))

				}
				if (this.imgList.length > 0) {
					let k = 1;
					for (let file of this.imgList) {
						if (file.type) {
							frm.append('img' + k, file);
							k++;
						}
					}
					frm.append('imgLength', k - 1);
				} else {
					let params = {
						message: '이미지를 1개이상 첨부하세요',
					};
					this.$eventBus.$emit('modalOpen', params);
					return;
				}
				frm.append('bid', this.part)

				apiService.postFile(API_URL_USER_PHOTO_ARTICLE_REGIST, frm, (res) => {

					this.$eventBus.$emit('overlay', 'hide');
					let result = res.msg;
					let params = {}
					switch (result) {
						case 'imgError':
							params = {
								message: '지원하지 않는 이미지 파일형식입니다',
							};
							this.$eventBus.$emit('modalOpen', params);
							break;
						case 'succ':
							let msg = (this.no || this.mobileNo) ? '정보가 변경되었습니다' : '사진첩이 등록되었습니다';
							params = {
								message: msg,
								doAction: () => {
                                    if (!this.$isMobile()) {
                                        this.$emit('modalHide', 'reload')
                                    }
								}
							};
                            if (this.$isMobile()) {
                                this.$router.go(-1)
                            }
							this.$eventBus.$emit('modalOpen', params);
							break;
					}
				});

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
                font-weight: bold;
                font-size: 11pt;
                text-align: left;
                padding: 20px 0 20px 20px;
            }
        }

        .double-select {
            display: flex;
            justify-content: space-between;

            .selectBox {
                max-width: 49%;
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

        .editor {
            height: 150px;
            margin-bottom: 40px;
        }

        .file-box {
            margin: 10px 0 30px 0;
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

        ul.radio-box {
            margin: 10px 0 30px 0;
            display: flex;
            width: 100%;
            padding: 0;

            li {
                margin-right: 20px;
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
        &.mobile {
            width: 100%;
            background: #fff;
            height:auto;
            min-height:calc(100vh);
            .form-box {
                padding: 70px 15px 30px 15px;
                height:auto;
                .sub-title {
                    font-weight: bold;
                    font-size: 11pt;
                    text-align: left;
                    padding: 20px 0 20px 20px;
                }
                .form-basic {
                    padding:0;
                    .item-list {

                    }
                }
            }

            .double-select {
                display: flex;
                justify-content: space-between;

                .selectBox {
                    max-width: 49%;
                }
            }

            .submit-button-box {
                padding-top: 40px;
                text-align: center;

                .submit-button {
                    width:100%;
                    font-size: 12pt;
                    height: 50px;
                    background: #686EFB;
                    color: #fff;
                    border-radius: 0;

                }
            }

            .editor {
                height: 150px;
                margin-bottom: 40px;
            }

            .file-box {
                margin: 10px 0 30px 0;
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
                    width: 140px;
                    background: #fff;
                    border: solid 1px #9E9E9E;
                    text-align: center;
                    color: #000;
                    cursor: pointer;
                    border-radius: 0 5px 5px 0;
                    min-height: 60px;
                    padding-top: 18px;
                    font-size:12px;
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
                        font-size:15px;
                        margin-right:5px;

                    }
                }
            }

            ul.radio-box {
                margin: 10px 0 30px 0;
                display: flex;
                width: 100%;
                padding: 0;

                li {
                    margin-right: 20px;
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
        }

    }
</style>