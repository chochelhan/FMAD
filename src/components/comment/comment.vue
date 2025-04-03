<template>
    <div :class="acceptType+' layout-box '+parent+' '+mobileClass">
        <div class="header-box" v-if="parent=='timeline && mobileView'" id="comment-header-top">
            <div class="sub-title"> 댓글 <span>{{totalReple}}</span></div>
            <span @click="modalHide('none')"><i class="fa fa-times"></i></span>
        </div>
        <div class="form-box">
            <div class="sub-title" v-if="parent!='timeline'" id="comment-header-top">댓글 <span>{{totalReple}}</span>
            </div>
            <form novalidate @submit.prevent="validate">
                <ul class="form-basic">
                    <li class="item-list" id="contents">
                        <div class="author-box">
                            <div class="user-round">
                                <i class="fas fa-user"></i>
                                <!--div class="name">{{userName}}</div-->
                            </div>
                        </div>
                        <div class="textarea-box">
                            <v-text-field
                                label=""
                                background-color="white"
                                outlined
                                placeholder="댓글을 입력하세요"
                                v-model="contents"
                                :error-messages="contentsErrors"
                                @input="$v.contents.$touch()"
                                @blur="$v.contents.$touch()"
                                :dense="dense"
                            ></v-text-field>
                        </div>
                        <div class="submit-button-box" v-if="!no">
                            <v-btn
                                class="submit-button"
                                type="submit"
                            >
                                댓글쓰기
                            </v-btn>
                        </div>
                        <div class="submit-button-box update-button-box" v-if="no">
                            <v-btn
                                class="submit-button"
                                type="submit"
                            >
                                댓글수정
                            </v-btn>
                            <v-btn
                                @click="formReset()"
                                class="cnc-button"
                                type="button"
                            >
                                취 소
                            </v-btn>
                        </div>
                    </li>

                </ul>
            </form>
            <div class="list-box">
                <ul class="comment-list">
                    <li class="list-data" v-for="(item,index) in commentList" :key="index">
                        <div class="comment-content">
                            <div class="comment-header">
                                <div class="author-box">
                                    <div class="user-round">
                                        <img v-if="item.data.photo" :src="host+item.data.photo">
                                        <i v-if="!item.data.photo" class="fas fa-user"></i>
                                    </div>
                                    <div class="author-info">
                                        <div class="author-name">
                                            {{item.data.name}}
                                        </div>
                                        <div class="rdate">
                                            {{item.data.rdate}}
                                        </div>
                                    </div>
                                </div>
                                <div class="upd-button-box">
                                    <!--div>
                                        <v-btn
                                            :class="'like-button '+item.data.myFavorite"
                                            type="button"
                                            @click="setMyFavorite(item.data)"
                                        >
                                            <img v-if="item.data.myFavorite!='yes'"
                                                 src="../../assets/images/ico_like_g.png">
                                            <img v-if="item.data.myFavorite=='yes'"
                                                 src="../../assets/images/ico_like_p.png">

                                            <span>{{item.data.glike}}</span>
                                        </v-btn>

                                    </div-->
                                    <div class="upd-button-area"
                                         v-if="!item.data.uid || (item.data.uid && (item.data.uid==memberInfo.uid))">
                                        <v-btn
                                            class="upd-button"
                                            type="button"
                                            color="light-blue"
                                            rounded
                                            outlined
                                            @click="modifyItem(item.data)"
                                        >
                                            수정
                                        </v-btn>
                                        <v-btn
                                            class="upd-button"
                                            type="button"
                                            color="orange"
                                            rounded
                                            outlined
                                            @click="deleteItem(item.data)"
                                        >
                                            삭제
                                        </v-btn>
                                    </div>
                                </div>
                            </div>
                            <div class="comment">
                                <div class="content" v-html="item.data.contents">

                                </div>
                                <div class="reple-box">
                                    <v-btn
                                        v-if="!item.data.repleOpen"
                                        class="reple-count-button"
                                        type="button"
                                        @click="repleOpen(item.data)"
                                    >
                                        댓글 {{item.repleList.length}}
                                    </v-btn>

                                </div>
                            </div>

                        </div>
                        <div class="comment-reple-content" v-if="item.data.repleOpen">
                            <form novalidate @submit.prevent="validateReple(index,item.data.no)">
                                <ul class="form-basic">
                                    <li class="item-list" :id="'reple-contents'+index">
                                        <div class="text-box">
                                            <v-text-field
                                                label=""
                                                outlined
                                                :dense="dense"
                                                background-color="white"
                                                placeholder="댓글을 입력하세요"
                                                v-model="repleContents[index]"
                                                :error-messages="repleContentErrors[index]"
                                                @input="repleContentTouch(index)"
                                                @blur="repleContentTouch(index)"

                                            ></v-text-field>
                                        </div>
                                        <div class="submit-button-box update-button-box"
                                             v-if="repleNo && index==repleIndex">
                                            <v-btn
                                                class="submit-button"
                                                type="submit"
                                            >
                                                댓글수정
                                            </v-btn>
                                            <v-btn
                                                @click="repleFormReset(index)"
                                                class="cnc-button"
                                                type="button"
                                            >
                                                취 소
                                            </v-btn>
                                        </div>
                                        <div class="submit-button-box" v-else>
                                            <v-btn
                                                class="submit-button"
                                                type="submit"
                                            >
                                                댓글쓰기
                                            </v-btn>
                                        </div>

                                    </li>

                                </ul>
                            </form>
                            <ul class="comment-reple-list">
                                <li v-for="(subItem,subIndex) in item.repleList" :key="index+subIndex"
                                    class="comment-content">
                                    <div class="author-box">
                                        <div class="author">{{subItem.name}}</div>
                                        <div class="rdate">
                                            {{subItem.rdate}}
                                        </div>
                                    </div>
                                    <div class="comment">
                                        <div class="content" v-html="subItem.contents">

                                        </div>

                                    </div>
                                    <div class="upd-button-box">
                                        <div class="upd-button-area" v-if="!subItem.uid || subItem.uid==memberInfo.uid">
                                            <v-btn
                                                class="upd-button"
                                                type="button"
                                                color="light-blue"
                                                rounded
                                                outlined
                                                @click="modifyRepleItem(index,subItem)"
                                            >
                                                수정
                                            </v-btn>
                                            <v-btn
                                                class="upd-button"
                                                type="button"
                                                color="orange"
                                                rounded
                                                outlined
                                                @click="deleteItem(subItem)"
                                            >
                                                삭제
                                            </v-btn>
                                        </div>
                                    </div>

                                </li>
                            </ul>
                        </div>
                    </li>
                </ul>
            </div>
            <div class="text-center pt-2">
                <paganation v-if="commentList.length>0"
                            :page="page"
                            :pageCount="pageCount"
                            :total="itemTotal"
                            :limit="itemLimit"
                            :pageInit="pageInit"
                            @getDataListByPaging="getPageData"
                ></paganation>
            </div>
        </div>
        <v-dialog
            v-model="userInfoOpen"
            persistent
            class="dialog-container"
            max-width="500px"
            max-height="500px"
        >
            <div style="background:#fff;border-radius:10px;">
                <div
                    style="height:60px;text-align:center;position:relative;background:#fafafa;border-bottom:solid 1px #ccc;border-radius:10px 10px 0 0;">
                    <div style="font-weight:bold;font-size:15pt;line-height:60px;">작성자 정보</div>
                    <div class="dialog-button"
                         style="cursor:pointer;position:absolute;top:18px;right:18px;width:26px;height:26px;border-radius:15px;background:#000;color:#fff;line-height:30px;"
                         @click="checkUpassReset()">
                        <i class="fas fa-times" style="margin:0 0 0 1px"></i></div>
                </div>
                <form novalidate @submit.prevent="userInfovalidate">
                    <div class="frame-box">
                        <ul class="form-basic user-box">
                            <li class="item-list" id="name" v-if="!modifyCheck">
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
                        <div class="button-box">
                            <v-btn
                                class="cancle-button"
                                type="button"
                                rounded
                                @click="checkUpassReset()"
                            >
                                취 소
                            </v-btn>
                            <v-btn
                                class="reg-button"
                                color="primary"
                                type="submit"
                                rounded
                            >
                                확 인
                            </v-btn>
                        </div>
                    </div>
                </form>
            </div>

        </v-dialog>
    </div>
</template>


<script>
	import paganation from '../paganation'
	import AUTH from '../../api/auth'
	import UTIL from '../../api/util'
	import {validationMixin} from 'vuelidate'
	import {required} from 'vuelidate/lib/validators'
	import JQ from 'jquery'
	import {
		API_URL_COMMENT_INSERT,
		API_URL_COMMENT_LIST,
		API_URL_COMMENT_DELETE,
		API_URL_COMMENT_GLIKE,
		CONFIG_HEADER_POST
	} from '../../api/urls';
	import apiService from '../../api/apiService';

	export default {
		name: 'articleRegist',
		components: {
			paganation
		},
		mixins: [validationMixin],
		props: ["parentNo", "parent", "isAdmin", "rwauth", "acceptType"],
		validations: {
			contents: {required},

		},
		computed: {
			contentsErrors() {
				const errors = []
				if (!this.$v.contents.$dirty) return errors
				!this.$v.contents.required && errors.push('댓글을 입력하세요')
				return errors
			},
		},
		watch: {},
		data() {
			return {
                dense:false,
                mobileClass:'',
                mobileView:false,
				contents: '',
				userInfoOpen: false,
				name: '',
				nameErrors: [],
				upass: '',
				upassErrors: [],
				dense: true,
				memberInfo: {},
				userName: '',
				no: '',
				commentList: [],
				modifyCheck: false,
				updItem: {},
				delItem: {},
				repleContents: [],
				repleContentErrors: [],
				repleNo: '',
				insertType: 'main',
				gno: '',
				repleCont: '',
				repleIndex: '',
				page: 1,
				pageCount: 5,
				itemLimit: 10,
				pageInit: false,
				itemTotal: 1,
				totalReple: 0,
			}
		},
		created() {
            if (this.$isMobile()) {
                this.mobileView = true;
                this.mobileClass = 'mobile'
                this.dense = true;
            }
			this.memberInfo = AUTH.getSession(this.$isMobile());
			if (this.memberInfo.AUTHTOKEN) {
				this.userName = this.memberInfo.name;
			} else {
				this.userName = '비회원';
			}

			if (this.isAdmin == 'admin') this.dense = true;
			this.getData();
		},
		methods: {
			getData() {
				const frm = new FormData()
				frm.append('parent', this.parent)
				frm.append('parent_no', this.parentNo)
				apiService.post(API_URL_COMMENT_LIST, frm, (res) => {
					this.orgDataList = res.list;
					this.totalReple = res.list.length;
					this.getPageData(this.page);

				});
			},
			getPageData(page) {
				let start = (page - 1) * this.itemLimit;
				let end = start + this.itemLimit;
				this.itemTotal = this.orgDataList.length;
				this.page = page;

				let orgDataList = this.orgDataList.slice(start, end);
				this.commentList = [];
				let startNum = '';
				if (this.itemTotal >= this.itemLimit) {
					startNum = (this.itemTotal - ((page - 1) * this.itemLimit)) + 1;
				} else startNum = this.itemTotal
				for (let item of orgDataList) {
					//if (item.repleList.length > 0) {
					//	item.data.repleOpen = true;
					//} else item.data.repleOpen = false;
					item.data.repleOpen = false;
					this.commentList.push(item);
				}

			},
			repleOpen(item) {
				if (item.repleOpen) {
					item.repleOpen = false;
				} else item.repleOpen = true;
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
					if (this.upass.length > 10) {
						this.upassErrors.push('비밀번호는 10자 이하로 입력하세요')
					}
				}

			},
			repleContentTouch(index) {
				let contents = this.repleContents[index];
				this.repleContentErrors[index] = [];
				if (!contents) {
					this.repleContentErrors[index].push('댓글을 입력하세요');
				}
			},
			modifyItem(item) {
				this.insertType = 'main';
				this.updItem = item;
				if (!this.memberInfo.uid) {
					this.modifyCheck = true;
					this.upassErrors = [];
					this.upass = '';
					this.userInfoOpen = true;
					return;
				}
				this.doModifyItem();

			},
			modifyRepleItem(index, item) {
				this.repleIndex = index;
				this.insertType = 'reple';
				this.updItem = item;
				if (!this.memberInfo.uid) {
					this.modifyCheck = true;
					this.upassErrors = [];
					this.upass = '';
					this.userInfoOpen = true;
					return;
				}
				this.doRepleModifyItem();

			},
			doRepleModifyItem() {
				this.repleNo = this.updItem.no;

				this.repleContents[this.repleIndex] = UTIL.br2nl(this.updItem.contents);
				this.repleContentErrors[this.repleIndex] = [];
				let top = JQ('#reple-contents' + this.repleIndex).offset().top - 170;
				if (top < 0) top = 0;
				JQ('html,body').animate({
					scrollTop: top,
				}, 200);
			},
			doModifyItem() {

				this.no = this.updItem.no;
				this.contents = UTIL.br2nl(this.updItem.contents);
				let top = JQ('#comment-header-top').offset().top - 170;
				if (top < 0) top = 0;
				JQ('html,body').animate({
					scrollTop: top,
				}, 200);
			},
			deleteItem(item) {
				this.delItem = item;
				if (!this.memberInfo.uid) {
					this.modifyCheck = true;
					this.upassErrors = [];
					this.upass = '';
					this.userInfoOpen = true;
					return;
				}
				this.doDeleteItem();
			},
			doDeleteItem() {
				let params = {
					type: 'confirm',
					message: '해당 댓글을 삭제하시겠습니까?',
					doAction: () => {
						this.$eventBus.$emit('overlay', 'open');
						let frm = new FormData();
						frm.append('no', this.delItem.no)
						this.delItem = {};
						apiService.post(API_URL_COMMENT_DELETE, frm, (res) => {
							this.$eventBus.$emit('overlay', 'hide');
							this.getData();
							let msg = '댓글이 삭제되었습니다';
							this.parentReload()
							params = {
								message: msg,
							};
							this.$eventBus.$emit('modalOpen', params);

						});
					}
				};
				this.$eventBus.$emit('modalOpen', params);
			},
			validate() {
				if (!this.rwauth) {
					if (!this.memberInfo.AUTHTOKEN) {
						//this.$router.push('/login')
						//return;
					}
					let msg = '댓글을 쓸수 있는 권한이 존재하지 않습니다';
					let params = {
						message: msg,
					};
					this.$eventBus.$emit('modalOpen', params);
					return;
				}

				this.insertType = 'main';
				this.modifyCheck = false;
				this.doRegist();

			},
			userInfovalidate() {
				if (this.modifyCheck) {
					if (!this.upass) {
						this.upassErrors = [];
						this.upassErrors.push('비밀번호를 입력하세요')
						return;
					}
					if (this.upass.length > 10) {
						this.upassErrors.push('비밀번호는 10자 이하로 입력하세요')
					}

				} else {
					if (!this.upass || !this.name) {
						if (!this.name) {
							this.nameErrors = [];
							this.nameErrors.push('이름을 입력하세요')
						}
						if (!this.upass) {
							this.upassErrors = [];
							this.upassErrors.push('비밀번호를 입력하세요')
						}
						return;
					}
					if (this.upass.length > 10) {
						this.upassErrors.push('비밀번호는 10자 이하로 입력하세요')
						return;
					}

				}
				this.userInfoOpen = false;
				if (this.modifyCheck) {
					if (this.delItem.no) {
						if (this.upassCheck(this.delItem)) {
							this.doDeleteItem();
						}

					} else if (this.updItem.no) {
						if (this.upassCheck(this.updItem)) {

							if (this.insertType == 'reple') {
								this.doRepleModifyItem();
							} else {
								this.doModifyItem();
							}


						}

					}
				} else {

					this.userName = this.name;
					if (this.insertType == 'reple') {
						this.doRepleRegist();
					} else this.doRegist();
				}

			},
			upassCheck(item) {
				if (item.upass == this.upass) {
					return true;
				} else {
					let params = {
						message: '잘못된 비밀번호입니다',
					};
					this.$eventBus.$emit('modalOpen', params);
					return false;
				}
			},
			doRegist() {
				this.$v.$touch()
				if (!this.$v.$anyError) {

					if (!this.no && !this.memberInfo.AUTHTOKEN) {
						if (!this.upass || !this.name) {
							this.nameErrors = [];
							this.name = '';
							this.upassErrors = [];
							this.upass = '';

							this.userInfoOpen = true;
							return;
						}
					}

					this.$eventBus.$emit('overlay', 'open');
					let frm = new FormData();
					frm.append('parent', this.parent)
					frm.append('parent_no', this.parentNo);
					frm.append('contents', this.contents);
					frm.append('name', this.name);
					frm.append('upass', this.upass);
					if (this.no) frm.append('no', this.no)

					apiService.post(API_URL_COMMENT_INSERT, frm, (res) => {
						this.$eventBus.$emit('overlay', 'hide');
						let result = res.result;
						let params = {}
						if (result == 'succ') {
							this.$v.$reset()
							this.contents = '';
							let msg = '';
							if (this.no) {
								msg = '정보가 변경되었습니다'
							} else {
								msg = '댓글이 등록되었습니다';
								this.parentReload()
							}
							if (this.no) {
								this.no = '';
								this.updItem = {};
							}
							this.getData();

							params = {
								message: msg,
								doAction: () => {

								}
							};
							this.$eventBus.$emit('modalOpen', params);


						} else {
							params = {
								message: '댓글등록에 실패하였습니다',
							};
							this.$eventBus.$emit('modalOpen', params);

						}
					});
				}
			},
			validateReple(index, gno) {
				if (!this.rwauth) {
					if (!this.memberInfo.AUTHTOKEN) {
						//this.$router.push('/login')
						//return;
					}
					let msg = '댓글을 쓸수 있는 권한이 존재하지 않습니다';
					params = {
						message: msg,
					};
					this.$eventBus.$emit('modalOpen', params);
					return;
				}

				this.modifyCheck = false;
				let contents = this.repleContents[index];
				if (!contents) {
					this.repleContentErrors[index] = [];
					this.repleContentErrors[index].push('댓글을 입력하세요');
					return;
				}
				this.gno = gno;
				this.insertType = 'reple';
				this.repleIndex = index;
				this.repleCont = contents;
				if (!this.repleNo && !this.memberInfo.AUTHTOKEN) {
					if (!this.upass || !this.name) {
						this.nameErrors = [];
						this.name = '';
						this.upassErrors = [];
						this.upass = '';
						this.userInfoOpen = true;
						return;
					}
				}
				this.doRepleRegist();

			},
			doRepleRegist() {
				if (!this.rwauth) {
					return;
				}
				this.$eventBus.$emit('overlay', 'open');
				let frm = new FormData();
				frm.append('parent', this.parent)
				frm.append('parent_no', this.parentNo);
				frm.append('contents', this.repleCont);
				frm.append('name', this.name);
				frm.append('upass', this.upass);
				frm.append('gno', this.gno);
				if (this.repleNo) frm.append('no', this.repleNo)

				apiService.post(API_URL_COMMENT_INSERT, frm, (res) => {
					this.$eventBus.$emit('overlay', 'hide');
					let result = res.result;
					let params = {}
					if (result == 'succ') {
						this.repleCont = '';
						this.repleContents[this.repleIndex] = '';

						let msg = '';
						if (this.repleNo) {
							msg = '정보가 변경되었습니다'
						} else {
							msg = '댓글이 등록되었습니다';

						}

						if (this.repleNo) {
							this.repleNo = '';
							this.updItem = {};
						}
						this.repleIndex = '';
						this.getData();

						params = {
							message: msg,
							doAction: () => {

							}
						};
						this.$eventBus.$emit('modalOpen', params);


					} else {
						params = {
							message: '댓글등록에 실패하였습니다',
						};
						this.$eventBus.$emit('modalOpen', params);

					}
				});
			},
			checkUpassReset() {
				this.modifyCheck = false,
					this.no = '';
				this.delItem = {};
				this.updItem = {};
				this.userInfoOpen = false;
			},
			formReset() {
				this.modifyCheck = false,
					this.no = '';
				this.updItem = {};
				this.$v.$reset()
				this.contents = '';
			},
			repleFormReset(index) {
				this.modifyCheck = false,
					this.repleNo = '';
				this.updItem = {};
				this.delItem = {};
				this.repleContents[this.repleIndex] = '';
				this.repleContentErrors[this.repleIndex] = [];
				this.repleIndex = '';


			},
			setMyFavorite(data) {
				let frm = new FormData();
				frm.append('no', data.no)
				apiService.post(API_URL_COMMENT_GLIKE, frm, (res) => {
					data.glike = res.glike;
					data.myFavorite = (data.myFavorite == 'yes') ? 'no' : 'yes';

				});
			},
			parentReload() {
				if (this.parent == 'timeline') {
					this.$emit('parentReload')
				}
			},
			modalHide(cmd) {
				this.$emit('modalHide', cmd)
			},

		},


	}
</script>

<style lang="scss" scoped="true">

    .form-box {
        padding: 0;
        width: 100%;
        margin: 0;
        color: #000;
        .sub-title {
            font-weight: bold;
            font-size: 16pt;
            text-align: left;
            padding: 50px 0 15px 0;
            border-bottom: solid 1px #000;
        }
        #comment-header-top {
            span {
                color: #686EFB;
            }
        }
        &.chat {

        }
    }

    .form-basic {
        margin-top: 20px;
        padding: 0;
        .item-list {
            display: flex;
            justify-content: flex-start;
            .author-box {
                min-width: 65px;
                text-align: center;
                .user-round {

                    width: 55px;
                    height: 55px;
                    background: #686EFB;
                    color: #fff;
                    border-radius: 50%;
                    i {
                        font-size: 17pt;
                        margin-top: 14px;
                    }
                    .name {
                        border-top: solid 1px #fafafa;
                        width: 90%;
                        margin: 5px auto 0 auto;
                        padding: 5px 0 0 0;
                    }
                }
            }
            .textarea-box {
                width: 90%;
            }
            .submit-button-box {
                width: 80px;
                margin: 0;
                padding: 0;
                .submit-button {
                    background: #686EFB;
                    color: #fff;
                    width: 100%;
                    height: 55px;
                    border-radius: 0 5px 5px 0;
                }
                &.update-button-box {
                    .submit-button {
                        background: #686EFB;
                        color: #fff;
                        width: 100%;
                        height: 30px;
                        border-radius: 0 5px 0 0;
                    }
                    .cnc-button {
                        width: 100%;
                        height: 25px;
                        background: #999;
                        color: #fff;
                        border-radius: 0 0 5px 0;
                    }
                }
            }

        }
    }

    .list-box {
        border-top: solid 1px #000;
        background: #fafafa;
        .comment-list {
            padding: 0;
            margin: 0;
            li.list-data {
                padding: 10px 30px 20px 30px;
                border-bottom: solid 1px #000;
                .comment-content {
                    .comment-header {
                        padding: 17px 0;
                        position: relative;
                        .author-box {
                            min-width: 140px;
                            padding: 5px 0 0 0;
                            display: flex;

                            .user-round {
                                width: 55px;
                                height: 55px;
                                background: #686EFB;
                                color: #fff;
                                text-align: center;
                                border-radius: 50%;
                                margin-right: 10px;
                                i {
                                    font-size: 17pt;
                                    margin-top: 14px;
                                }
                            }
                            .author-info {
                                padding-top: 5px;
                                .author-name {
                                    font-size: 14pt;
                                }
                                .rdate {
                                    font-size: 10pt;
                                    color: #999;
                                }
                            }
                        }
                        .upd-button-box {
                            position: absolute;
                            right: 0;
                            top: 10px;
                            text-align: left;
                            .like-button {
                                width: 100px;
                                border-radius: 5px;
                                color: #fff;
                                background: #1F2940;
                                img {
                                    width: 17px;
                                }
                                span {
                                    padding-left: 10px;
                                }
                                &.yes {
                                    span {
                                        color: #686EFB;
                                    }
                                }
                            }
                            .upd-button-area {
                                margin-top: 7px;
                                display: flex;
                                .upd-button {
                                    max-width: 50px;
                                    min-width: 50px;
                                    height: 30px;
                                    font-size: 9pt;
                                    &:first-child {
                                        margin-right: 5px;
                                    }
                                }
                            }
                        }
                    }
                    .comment {
                        width: 100%;
                        color: #000;
                        padding-right: 20px;
                        .content {
                            font-size: 12pt;
                            min-height: 46px;
                        }
                        .reple-box {
                            .reple-count-button {
                                background: #1F2940;
                                color: #fff;
                                border-radius: 5px;
                                border: none;

                            }
                        }

                    }
                }
                .comment-reple-content {
                    padding: 0;
                    margin-bottom: 20px;
                    .form-basic {
                        padding: 0;
                        .item-list {
                            display: flex;
                            justify-content: flex-start;
                            .text-box {
                                width: 90%;
                            }
                            .submit-button-box {
                                width: 80px;
                                margin: 0;
                                padding: 0;
                                .submit-button {
                                    background: #686EFB;
                                    color: #fff;
                                    width: 100%;
                                    height: 55px;
                                    border-radius: 0 5px 5px 0;
                                }
                                &.update-button-box {
                                    height: 55px;
                                    .submit-button {
                                        height: 30px;
                                        margin: 0;
                                        border-radius: 0 5px 0 0;
                                    }
                                    .cnc-button {
                                        width: 100%;
                                        height: 25px;
                                        border-radius: 0 0 5px 0;
                                    }
                                }
                            }

                        }
                    }
                    .comment-reple-list {
                        border-top: solid 1px #434343;
                        padding: 0;
                        li.comment-content {
                            padding: 10px 0;
                            border-bottom: solid 1px #434343;
                            display: flex;
                            .author-box {
                                min-width: 140px;
                                padding: 5px 0 0 0;
                                .author {

                                }
                                .rdate {
                                    font-size: 10pt;
                                    color: #999;
                                }

                            }
                            .comment {
                                .content {
                                    min-height: 20px;
                                }

                            }
                            .upd-button-area {
                                display: flex;
                                .upd-button {
                                    height: 27px;
                                    min-width: 50px;
                                    width: 50px;
                                    margin-left: 5px;
                                }
                            }
                            &:last-child {
                                border-bottom: none;
                            }
                        }
                    }
                }
            }
        }
    }

    .frame-box {
        padding: 50px 20px 40px 20px;
        .button-box {
            text-align: center;
            .cancle-button {
                width: 150px;
                height: 50px;
                background: #999;
                color: #fff;
                margin-right: 20px;
            }
            .reg-button {
                width: 150px;
                height: 50px;

            }
        }
    }

    .timeline {
        background: #fff;
        padding: 0;
        .header-box {
            background: #fff;
            color: #000;
            display: flex;
            height: 70px;
            line-height: 70px;
            border-bottom: solid 1px #ccc;
            .sub-title {
                width: 98%;
                font-weight: bold;
                font-size: 14pt;
                padding-left: 30px;
                span {
                    color: #686EFB;
                }
            }
            span {
                width: 40px;
                text-align: center;
                margin-right: 10px;
                cursor: pointer;
                font-size: 17pt;
            }

        }
        .content {
            color: #999;
        }
        .form-box {
            padding: 0 30px 40px 30px;
            width: 100%;
            margin: 0;
            color: #000;
            max-height: 600px;
            overflow: auto;
            .sub-title {
                font-weight: bold;
                font-size: 16pt;
                text-align: left;
                padding: 50px 0 15px 0;
                border-bottom: solid 1px #000;
            }
            .list-box {
                border-top: solid 1px #000;
                background: #fff;

            }
        }
    }

    .white {
        background: #fff;
        padding: 0;
        .sub-title {
            width: 98%;
            font-weight: bold;
            font-size: 14pt;
            padding-left: 30px;
            span {
                color: #686EFB;
            }
        }
        .content {
            color: #999;
        }
        .form-box {
            padding: 0 30px 40px 30px;
            width: 100%;
            margin: 0;
            color: #000;
            .sub-title {
                font-weight: bold;
                font-size: 16pt;
                text-align: left;
                padding: 50px 0 15px 0;
                border-bottom: solid 1px #000;
            }
            .list-box {
                border-top: solid 1px #000;
                background: #fff;

            }
        }
    }
    .mobile {
        margin-bottom:60px;
        .form-box {
            padding: 0;
            width: 100%;
            margin: 0;
            color: #000;
            .sub-title {
                font-weight: bold;
                font-size: 14px;
                text-align: left;
                padding: 50px 0 15px 0;
                border-bottom: solid 1px #000;
            }
            #comment-header-top {
                span {
                    color: #686EFB;
                }
            }

        }
        .form-basic {
            .item-list {
                .author-box {
                    min-width:40px;
                    text-align: center;
                    .user-round {
                        margin-top:5px;
                        width: 30px;
                        height: 30px;
                        border-radius: 50%;
                        i {
                            font-size: 12pt;
                            margin-top: 6px;
                        }
                        .name {
                            border-top: solid 1px #fafafa;
                            width: 90%;
                            margin: 5px auto 0 auto;
                            padding: 5px 0 0 0;
                        }
                    }
                }
                .textarea-box {
                    width: 90%;
                }
                .submit-button-box {
                    width: 50px;
                    margin-right:15px;
                    padding: 0;
                    .submit-button {
                        background: #686EFB;
                        color: #fff;
                        width: 100%;
                        height: 40px;
                        font-size:12px;
                        border-radius: 0 5px 5px 0;
                    }
                    &.update-button-box {
                        .submit-button {
                            background: #686EFB;
                            color: #fff;
                            width: 100%;
                            height: 20px;
                            font-size:12px;
                            border-radius: 0 5px 0 0;
                        }
                        .cnc-button {
                            width: 100%;
                            height: 20px;
                            background: #999;
                            color: #fff;
                            font-size:12px;
                            border-radius: 0 0 5px 0;
                        }
                    }
                }

            }
        }
        .list-box {
            border-top: solid 1px #000;
            background: #fafafa;
            .comment-list {
                padding: 0;
                margin: 0;
                li.list-data {
                    padding: 10px;
                    border-bottom: solid 1px #000;
                    .comment-content {
                        .comment-header {
                            padding:17px 0;
                            position: relative;
                            .author-box {
                                min-width:40px;
                                padding: 5px 0 0 0;
                                display: flex;

                                .user-round {
                                    width:30px;
                                    height: 30px;
                                    margin-right: 10px;
                                    i {
                                        font-size: 12pt;
                                        margin-top: 6px;
                                    }
                                }
                                .author-info {
                                    padding-top:0;
                                    .author-name {
                                        font-size: 14px;
                                    }
                                    .rdate {
                                        font-size: 10px;
                                        color: #999;
                                    }
                                }
                            }
                            .upd-button-box {
                                position: absolute;
                                right: 0;
                                top: 10px;
                                text-align: right;
                                .like-button {
                                    width:60px;
                                    border-radius: 5px;
                                    color: #999;
                                    background: #1F2940;
                                    img {
                                        width: 17px;
                                    }
                                    span {
                                        padding-left: 10px;
                                    }
                                    &.yes {
                                        span {
                                            color: #686EFB;
                                        }
                                    }
                                }
                                .upd-button-area {
                                    margin-top: 7px;
                                    display: flex;
                                    .upd-button {
                                        max-width: 50px;
                                        min-width: 50px;
                                        height: 30px;
                                        font-size: 9pt;
                                        &:first-child {
                                            margin-right: 5px;
                                        }
                                    }
                                }
                            }
                        }
                        .comment {
                            width: 100%;
                            color: #000;
                            padding-right: 20px;
                            .content {
                                font-size: 12px;
                                min-height: 46px;
                            }
                            .reple-box {
                                .reple-count-button {
                                    background: #1F2940;
                                    color: #fff;
                                    border-radius: 5px;
                                    font-size:12px;
                                    border: none;

                                }
                            }

                        }
                    }
                    .comment-reple-content {
                        padding: 0;
                        margin-bottom: 20px;
                        .form-basic {
                            padding: 0;
                            .item-list {
                                display: flex;
                                justify-content: flex-start;
                                .text-box {
                                    width: 90%;
                                }
                                .submit-button-box {
                                    width: 50px;
                                    margin: 0;
                                    padding: 0;
                                    .submit-button {
                                        background: #686EFB;
                                        color: #fff;
                                        width: 100%;
                                        height: 40px;
                                        border-radius: 0 5px 5px 0;
                                    }
                                    &.update-button-box {
                                        height: 40px;
                                        .submit-button {
                                            height: 20px;
                                            margin: 0;
                                            border-radius: 0 5px 0 0;
                                        }
                                        .cnc-button {
                                            width: 100%;
                                            height: 20px;
                                            border-radius: 0 0 5px 0;
                                        }
                                    }
                                }

                            }
                        }
                        .comment-reple-list {
                            border-top: solid 1px #434343;
                            padding: 0;
                            li.comment-content {
                                padding: 10px 0;
                                border-bottom: solid 1px #434343;
                                display: flex;
                                .author-box {
                                    min-width:70px;
                                    padding: 5px 0 0 0;
                                    .author {
                                        font-size:12px;
                                    }
                                    .rdate {
                                        font-size: 10px;
                                        color: #999;
                                    }

                                }
                                .comment {
                                    .content {
                                        text-align:left;
                                        font-size:11px;
                                        min-height: 20px;
                                    }

                                }
                                .upd-button-area {
                                    display: flex;
                                    .upd-button {
                                        height: 27px;
                                        min-width: 50px;
                                        width: 50px;
                                        margin-left: 5px;
                                    }
                                }
                                &:last-child {
                                    border-bottom: none;
                                }
                            }
                        }
                    }
                }
            }
        }
    }


</style>
