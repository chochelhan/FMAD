<template>
    <div>
        <div class="form-box">
            <form novalidate @submit.prevent="validate">
                <div class="sub-title">{{boardName}} 게시글 작성</div>
                <ul class="form-basic">
                    <li class="item-list" id="subject">
                        <v-text-field
                            v-model="subject"
                            label="제목"
                            required
                            @input="$v.subject.$touch()"
                            @blur="$v.subject.$touch()"
                            :error-messages="subjectErrors"
                            outlined
                            :dense="dense"
                        ></v-text-field>
                    </li>
                    <li class="item-list" v-if="categoryUse" id="category">
                        <v-select
                            v-model="category"
                            :items="categorys"
                            label="카테고리"
                            outlined
                            :error-messages="categoryErrors"
                            @input="categoryTouch"
                            @blur="categoryTouch"
                            :dense="dense"
                        ></v-select>
                    </li>
                    <li class="item-list" id="contents">
                        <v-textarea
                            label="내용"
                            outlined
                            v-model="contents"
                            rows="18"
                            :error-messages="contentsErrors"
                            @input="$v.contents.$touch()"
                            @blur="$v.contents.$touch()"
                        ></v-textarea>
                    </li>

                </ul>
                <div class="sub-title" v-if="userInfoOpen">작성자 정보</div>
                <ul class="form-basic user-box" v-if="userInfoOpen">
                    <li class="item-list" id="name">
                        <v-text-field
                            v-model="name"
                            label="이름"
                            @input="nameTouch()"
                            @blur="nameTouch()"
                            :error-messages="nameErrors"
                            outlined
                            :dense="dense"
                        ></v-text-field>
                    </li>
                    <li class="item-list" id="upass">
                        <v-text-field
                            v-model="upass"
                            type="password"
                            label="비밀번호"
                            @input="upassTouch()"
                            @blur="upassTouch()"
                            :error-messages="upassErrors"
                            outlined
                            :dense="dense"
                        ></v-text-field>
                    </li>

                </ul>
                <div v-if="extra">
                    <div class="sub-title">추가 정보</div>
                    <ul class="extraVars">
                        <li v-for="(item,index) in extraVars" :key="index">
                            <div class="field-input" :id="index+'extraVars'">

                                <v-text-field
                                    v-if="item.type=='text'"
                                    v-model="item.value"
                                    :label="item.name"
                                    outlined
                                    :dense="dense"
                                    :error-messages="item.error"
                                    @input="extraValuesTouch(index)"
                                    @blur="extraValuesTouch(index)"
                                ></v-text-field>
                                <v-select
                                    v-else-if="item.type=='select'"
                                    v-model="item.value"
                                    :items="item.subItems"
                                    :label="item.name"
                                    :dense="dense"
                                    :error-messages="item.error"
                                    @input="extraValuesTouch(index)"
                                    @blur="extraValuesTouch(index)"
                                    outlined

                                ></v-select>
                                <div class="table-box" v-else-if="item.type=='checkbox'">
                                    <div class="label-title">{{item.name}}</div>
                                    <div class="table-content-box">
                                        <v-checkbox v-for="(subItem,subIndex) in item.subItems"
                                                    v-model="item.value"
                                                    :label="subItem.name"
                                                    :value="subItem.name"
                                                    style="margin-right:10px"
                                                    @change="extraValuesTouch(index)"
                                        ></v-checkbox>

                                    </div>
                                    <div class="required-error" v-if="item.value.length<1 && item.touch">
                                        {{item.name}}
                                        선택하세요
                                    </div>
                                </div>
                                <div class="table-box" v-else-if="item.type=='radio'">
                                    <div class="label-title">{{item.name}}</div>
                                    <div class="table-content-box">
                                        <v-radio-group v-model="item.value" row
                                                       :error-messages="item.error"
                                                       @change="extraValuesTouch(index)">
                                            <v-radio
                                                v-for="(subItem,subIndex) in item.subItems"
                                                :key="subIndex"
                                                :label="subItem.name"
                                                :value="subItem.name"

                                            ></v-radio>
                                        </v-radio-group>
                                    </div>
                                </div>
                                <v-textarea v-else-if="item.type=='textarea'"
                                            outlined
                                            v-model="item.value"
                                            :label="item.name"
                                            :error-messages="item.error"
                                            @input="extraValuesTouch(index)"
                                            @blur="extraValuesTouch(index)"
                                            rows="10"

                                ></v-textarea>
                            </div>
                        </li>
                    </ul>
                </div>
                <div class="sub-title" style="padding-bottom:10px;" v-if="atFileUse || atImgUse">{{fileTitle}}</div>
                <ul class="form-basic">

                    <li class="item-list" v-if="atImgUse" id="atImg">
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
                    <li class="item-list" v-if="atFileUse" id="atFile">
                        <div class="file-box">
                            <div class="file-names">
                                <v-chip
                                    class="ma-2"
                                    color="#CDDC39"
                                    text-color="black"
                                    v-for="(fitem,index) in fileList" :key="index"
                                >
                                    <span>{{fitem.name}}</span>
                                    <i @click="deleteFile(index)" class="fas fa-times-circle"></i>
                                </v-chip>
                            </div>
                            <div class="file-click">
                                <input ref="fileContainer" @change="onChangeFile" type="file"
                                       id="dfile">
                                <i class="fas fa-paperclip"></i>
                                파일 찾기
                            </div>
                        </div>
                    </li>
                </ul>
                <div class="submit-button-box">
                    <v-btn
                        class="cancle-button"
                        type="button"
                        @click="$router.go(-1)"
                        rounded

                    >
                        취 소
                    </v-btn>
                    <v-btn
                        class="submit-button"
                        color="primary"
                        type="submit"
                        rounded

                    >
                        확 인
                    </v-btn>
                </div>

            </form>
        </div>

    </div>
</template>


<script>
	import AUTH from '../../api/auth'
	import {validationMixin} from 'vuelidate'
	import {required} from 'vuelidate/lib/validators'
	import JQ from 'jquery'
	import {
		API_URL_BOARD_ARTICLE_INSERT,
		API_URL_BOARD_ADMIN_ARTICLE_INSERT,
		CONFIG_HEADER_FORM,
		API_URL_BOARD_ARTICLE_REGIST_INFO,
		API_URL_BOARD_ADMIN_ARTICLE_REGIST_INFO,
		CONFIG_HEADER_POST
	} from '../../api/urls';

	export default {
		name: 'articleRegist',
		mixins: [validationMixin],
		props: ["no", "bid", "isAdmin"],
		validations: {
			subject: {required},
			contents: {required},

		},
		computed: {
			subjectErrors() {
				const errors = []
				if (!this.$v.subject.$dirty) return errors
				!this.$v.subject.required && errors.push('제목을 입력하세요')
				return errors
			},
			contentsErrors() {
				const errors = []
				if (!this.$v.contents.$dirty) return errors
				!this.$v.contents.required && errors.push('내용을 입력하세요')
				return errors
			},
		},
		watch: {},
		data() {
			return {
				btype: '',
				subject: '',
				contents: '',
				boardName: '',
				category: '',
				categoryUse: false,
				categorys: [],
				overlay: false,
				fileList: [],
				imgList: [],
                imgObjList:[],

				categoryErrors: [],
				atFileUse: false,
				atImgUse: false,
				fileTitle: '',
				userInfoOpen: false,
				name: '',
				nameErrors: [],
				upass: '',
				upassErrors: [],
				extra: false,
				extraVars: [],
				dense: false,

			}
		},
		created() {
			if (this.isAdmin == 'admin') this.dense = true;
			this.getData();
		},
		methods: {
			getData() {
				const frm = new FormData()
				frm.append('bid', this.bid)
				if (this.no != 'new') frm.append('no', this.no)
             	let url = (this.isAdmin == 'admin') ? API_URL_BOARD_ADMIN_ARTICLE_REGIST_INFO : API_URL_BOARD_ARTICLE_REGIST_INFO;

				this.$http.post(url, frm, {headers: CONFIG_HEADER_POST}).then(res => {
					console.log(res)
					if (res.data.result == 'succ') {
						let info = res.data.board;
						if (this.isAdmin != 'admin') {
							let memberInfo = AUTH.getSession(this.$isMobile());
							if (!memberInfo.AUTHTOKEN) {
								this.userInfoOpen = true;
							}
							if (this.no != 'new') {
								if (!res.data.auth) {
									let prm = {
										message: '잘못된 접근입니다',

									};
									this.$eventBus.$emit('modalOpen', prm);
									this.$router.go(-1);
									return;
								}
							} else {
								if (!res.data.auth) {
									if (!memberInfo.AUTHTOKEN) {
										this.$router.push('/login');
										return;
									} else if (memberInfo.AUTHTOKEN) {
										let prm = {
											message: '접근할수 없는 회원등급입니다',
										};
										this.$eventBus.$emit('modalOpen', prm);
										this.$router.go(-1);
										return;
									}
								}
							}
						}
						this.btype = info.btype;
						this.boardName = info.name;

						if (info.categoryUse == 'yes') {
							this.categoryUse = true;
							for (let cate of info.categorys) {
								this.categorys.push({text: cate.name, value: cate.code})
							}
						}
						if (info.extraUse == 'yes') {
							this.extra = true;
							let value = '';
							this.extraVars = [];
							for (let item of info.extraVars) {
								switch (item.type) {
									case'select':
										for (let subItem of item.subItems) {
											subItem.text = subItem.name;
											subItem.value = subItem.name;

										}
										break;
									case 'checkbox':
										value = [];
										break;
								}
								item.value = value
								item.error = [];
								item.touch = false;
								this.extraVars.push(item);
							}
						}
						if (info.fileUse == 'yes') {
							this.atImgUse = (info.fileVars.atimg == 'yes') ? true : false;
							this.atFileUse = (info.fileVars.atfile == 'yes') ? true : false;
							if (this.atImgUse && this.atFileUse) {
								this.fileTitle = '이미지 및 파일첨부'
							} else if (this.atImgUse) {
								this.fileTitle = '이미지'
							} else if (this.atFileUse) {
								this.fileTitle = '파일첨부'
							}
						}

						if (this.no != 'new') {
							let articleInfo = res.data.info;
							console.log(articleInfo)
							this.subject = articleInfo.subject;
							this.category = articleInfo.category;
							this.contents = articleInfo.contents;
							if (info.extraUse == 'yes') {
								this.extraVars = articleInfo.extraVars;
							}
							if(articleInfo.vfiles) {
								for(let img of articleInfo.vfiles) {
					                let item = {name:img.orig_name}
					                this.imgList.push(item);
				                }

                            }

						}

					}

				});
			},
			categoryTouch() {
				this.categoryErrors = [];
				if (!this.category) {
					this.categoryErrors.push('카테고리를 선택하세요')
				}

			},
			nameTouch() {
				this.nameErrors = [];
				if (!this.name) {
					this.nameErrors.push('이름을 입력하세요')
				}

			},
			upassTouch() {
				this.upassErrors = [];
				if (!this.upass) {
					this.upassErrors.push('비밀번호를 하세요')
				} else {
					if(this.upass.length>10) {
						this.upassErrors.push('비밀번호는 10자 이하로 입력하세요')
					}
				}

			},
			onChangeFile() {
				const fileObj = this.$refs.fileContainer.files;
				let file = fileObj.length > 0 ? fileObj[0] : null;
				this.fileList.push(file);
			},
			deleteFile(index) {
				this.fileList.splice(index, 1);
			},
			onChangeImg() {
				const imgObj = this.$refs.imgContainer.files;
				let img = imgObj.length > 0 ? imgObj[0] : null;
				this.imgList.push(img);


			},
			deleteImg(index) {
				this.imgList.splice(index, 1);
			},
			extraValuesTouch(index) {
				let field = this.extraVars[index];
				if (field.req) {
					field.touch = true;
					switch (field.type) {
						case 'checkbox':
							break;
						case 'select':
						case 'radio':
							if (!field.value || field.value == '') {
								if (field.error.length < 1) {
									field.error.push(field.name + ' 선택하세요');
								}
							} else {
								field.error = [];
							}
							break;
						default:
							if (!field.value || field.value == '') {
								if (field.error.length < 1) {
									field.error.push(field.name + ' 입력하세요');
								}
							} else {
								field.error = [];
							}
							break;
					}

				}
			},
			validate() {


				this.$v.$touch()
				let moveItem = '';
				if (this.$v.$anyError) {
					for (let fld in this.$v.$params) {
						if (!this.$v[fld].required) {
							if (!moveItem) moveItem = fld;

						}
					}

				}
				if (this.categoryUse) {
					if (!this.category) {
						this.categoryErrors.push('카테고리를 선택하세요');
						if (!moveItem) moveItem = 'category';
					}

				}
				if (moveItem) {
					let top = JQ('#' + moveItem).offset().top - 170;
					if (top < 0) top = 0;
					JQ('html,body').animate({
						scrollTop: top,
					}, 200);
					return;
				}

				if (!this.$v.$anyError) {
					let validateFlag = true;
					if (this.userInfoOpen) {
						if (!this.name) {
							this.nameErrors.push('이름을 입력하세요')
							validateFlag = false;
							if (moveItem) moveItem = 'name';
						}
						if (!this.upass) {
							this.upassErrors = [];
							this.upassErrors.push('비밀번호를 하세요')
							validateFlag = false;
							if (moveItem) moveItem = 'upass';
						}
						if(this.upass.length>10) {
							this.upassErrors = [];
							this.upassErrors.push('비밀번호는 10자 이하로 입력하세요')
                            return;
						}

					}
					if (this.extra) {
						let k = 0;
						for (let item of this.extraVars) {
							if (item.req) {
								switch (item.type) {
									case 'checkbox':
										if (item.value.length < 1) {
											if (item.error.length < 1) {
												item.touch = true;
											}
											if (moveItem) moveItem = k + 'extraVars';
											validateFlag = false;
										}
										break;
									case 'select':
									case 'radio':
										if (!item.value || item.value == '') {
											if (item.error.length < 1) {
												item.error.push(item.name + ' 선택하세요');
											}
											if (moveItem) moveItem = k + 'extraVars';
											validateFlag = false;
										}
										break;
									default:
										if (!item.value || item.value == '') {
											if (item.error.length < 1) {
												item.error.push(item.name + ' 입력하세요');
											}
											if (moveItem) moveItem = k + 'extraVars';
											validateFlag = false;
										}
										break;
								}

							}
							k++;
						}
					}
					if (moveItem) {
						alert(moveItem)
						let top = JQ('#' + moveItem).offset().top - 170;
						if (top < 0) top = 0;
						JQ('html,body').animate({
							scrollTop: top,
						}, 200);
						return;
					}

					if (this.btype == 'blog' || this.btype == 'gallery') {
						if (this.imgList.length < 1) {
							let prm = {
								message: '이미지를 하나 이상 첨부하세요'
							};
							this.$eventBus.$emit('modalOpen', prm);
							validateFlag = false;
						}

					}

					if (!validateFlag) return;

					this.$eventBus.$emit('overlay', 'open');

					const frm = new FormData()
					frm.append('bid', this.bid)
					frm.append('subject', this.subject);
					frm.append('contents', this.contents);
					frm.append('category', this.category);
					if (this.userInfoOpen) {
						frm.append('name', this.name);
						frm.append('upass', this.upass);

					}
					if (this.extra) {
						frm.append('extraVars', JSON.stringify(this.extraVars));
					}
					if (this.imgList.length > 0) {
						let k = 1;
						for (let file of this.imgList) {
							frm.append('img' + k, file);
							k++;
						}
						frm.append('imgLength', k - 1);
					}
					if (this.fileList.length > 0) {
						let k = 1;
						for (let file of this.fileList) {
							frm.append('dfile' + k, file);
							k++;
						}
						frm.append('dfileLength', k - 1);
					}
					if (this.no != 'new') frm.append('no', this.no)
					let url = '';
					if (this.isAdmin == 'admin') url = API_URL_BOARD_ADMIN_ARTICLE_INSERT;
					else url = API_URL_BOARD_ARTICLE_INSERT;

					this.$http.post(url, frm, {headers: CONFIG_HEADER_FORM}).then(res => {

						this.$eventBus.$emit('overlay', 'hide');
						let result = res.data.result;
						let params = {}
						switch (result) {
							case 'imgError':
								params = {
									message: '지원하지 않는 이미지 파일형식입니다',
								};
								this.$eventBus.$emit('modalOpen', params);
								break;
							case 'dfileError':
								params = {
									message: '지원하지 않는 첨부파일 형식입니다',
								};
								this.$eventBus.$emit('modalOpen', params);
								break;

							case 'succ':
								let msg = (this.no != 'new') ? '정보가 변경되었습니다' : '게시글이 등록되었습니다';
								params = {
									message: msg,
									doAction: () => {
										this.$router.go(-1);

									}
								};
								this.$eventBus.$emit('modalOpen', params);

								break;
						}
					}).catch(function (error) {
						if (error.response) {
							// 요청이 이루어졌으며 서버가 2xx의 범위를 벗어나는 상태 코드로 응답했습니다.
							console.log(error.response.data);
							console.log(error.response.status);
							console.log(error.response.headers);
						}
						else if (error.request) {
							// 요청이 이루어 졌으나 응답을 받지 못했습니다.
							// `error.request`는 브라우저의 XMLHttpRequest 인스턴스 또는
							// Node.js의 http.ClientRequest 인스턴스입니다.
							console.log(error.request);
						}
						else {
							// 오류를 발생시킨 요청을 설정하는 중에 문제가 발생했습니다.
							console.log('Error', error.message);
						}
						console.log(error.config);
					});
				}
			}
		},
		mounted() {

		}

	}
</script>

<style lang="scss" scoped="true">
    .form-box {
        padding: 0;
        width: 900px;
        margin: 0;
        .sub-title {
            font-weight: bold;
            font-size: 11pt;
            text-align: left;
            padding: 20px 0 20px 20px;
        }
    }

    .submit-button-box {
        padding-top: 80px;
        text-align:center;
        .cancle-button {
            width:200px;
            height:60px;
            background:#999;
            color:#fff;
            font-size:12pt;
            margin-right:50px;
        }
        .submit-button {
            width:200px;
            font-size:12pt;
            height:60px;

        }
    }

    .form-basic {
        .item-list {
            display: flex;
            justify-content: space-between;
            .item-title {
                font-size: 11pt;
                font-weight: bold;
                color: #888;
            }
            .item-switch {
                margin-top: -20px;
            }
            &.file-input {
                justify-content: flex-start;
                i {
                    margin-top: 20px;
                    color: #2196F3;
                    font-size: 20pt;

                }
            }
        }
        &.user-box {
            display: flex;
            justify-content: space-between;
            li {
                width: 48%;
            }
        }
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

        }
        .file-click {
            position: relative;
            width: 200px;
            background: #03A9F4;
            border: solid 1px #03A9F4;
            text-align: center;
            color: #fff;
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

    .table-box-divice {
        border-top: solid 1px #777;
        margin-bottom: 30px;
    }

    .table-box-level {
        display: flex;
        justify-content: space-between;
        padding: 0 20px;
        margin: 0;
        li {
            margin: 0;
            text-align: right;
            &.item-title {
                width: 200px;
                font-size: 11pt;
                text-align: left;

            }
            .item-required {
                margin-top: 2px;
            }
            &.item-type {
                width: 180px;
            }
            &.item-button {
                width: 80px;
            }
            &.select-box {
                width: 300px;
            }
            &.desc-box {
                font-size: 11pt;
                color: #B71C1C;
                margin-bottom: 40px;
            }

        }
    }

    .rauth-text {
        font-size: 11pt;
        color: #B71C1C;
        text-align: center;
        padding-bottom: 30px;

    }

    ul.extraVars {
        margin: 0;
        li {
            display: flex;
            .field-input {
                width: 100%;

            }
            .table-box {
                margin-bottom: 20px;
                .required-error {
                    font-size: 9pt;
                    color: #F44336;
                    margin-top: -17px;
                }
                .label-title {
                    font-size: 11pt;
                    color: #000;
                }
                .table-content-box {
                    display: flex;
                    flex-wrap: wrap;
                }
            }
        }
    }


</style>