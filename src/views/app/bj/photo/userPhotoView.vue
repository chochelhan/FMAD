<template>
    <div :class="'data-contents '+acceptType+' '+mobileClass">

        <div class="article-info">
            <div class="img-box" v-if="info.vfiles">
                <div class="img" v-for="img in info.vfiles"><img :src="host+img.url"></div>
            </div>
            <div class="content-box" v-html="info.contents"></div>
            <div class="author-title">
                <div class="author-name">
                    {{info.name}}
                </div>
                <div class="author-rdate">
                    {{rdate}}
                </div>
            </div>

            <div class="list-button-box">
                <ul class="mofify-button-box" v-if="mobileView && !selectedNo && (isAdmin=='admin' || (uid && uid==info.uid))">
                    <li class="mofify-box">

                        <v-btn
                            class="upd-button"
                            type="button"
                            color="light-blue"
                            rounded
                            outlined
                            @click="modifyInfo()"
                        >
                            수정
                        </v-btn>
                        <v-btn
                            class="upd-button"
                            type="button"
                            color="orange"
                            rounded
                            outlined
                            @click="deleteInfo()"
                        >
                            삭제
                        </v-btn>
                    </li>
                    <li @click="$router.go(-1)" v-if="!selectedNo">
                        목록
                    </li>
                </ul>
                <ul>
                    <li :class="'like-button '+glikeClass" @click="setLike()">
                        <img src="../../../../assets/images/ico_like.png">
                        <span style="color:#fff;" >{{info.glike}}</span>
                    </li>
                    <li @click="snsOpen()" style="color:#fff;">
                        공유하기

                    </li>

                    <li class="space">

                    </li>
                    <li class="mofify-box"  style="display: flex;" v-if="!mobileView && !selectedNo && (isAdmin=='admin' || (uid && uid==info.uid))">
                        <v-btn
                            class="upd-button"
                            type="button"
                            color="light-blue"
                            rounded
                            outlined
                            @click="modifyInfo()"
                        >
                            수정
                        </v-btn>
                        <v-btn
                            class="upd-button"
                            type="button"
                            color="orange"
                            rounded
                            outlined
                            @click="deleteInfo()"
                        >
                            삭제
                        </v-btn>
                    </li>
                    <li @click="$router.go(-1)"  style="color:#fff;" v-if="!selectedNo && !mobileView">
                        목록
                    </li>
                </ul>
                <v-card class="update-type-box" v-if="snsPannelShow" elevation="2"
                        width="130">
                    <ul>
                        <li @click="snsShare('fb')">페이스북</li>
                        <li @click="snsShare('ko')">카카오톡</li>
                        <li @click="snsShare('nb')">네이버밴드</li>
                        <li @click="snsShare('ln')">라인</li>
                    </ul>
                </v-card>

            </div>
        </div>
        <div class="comment-info">
            <comment :parent="'userPhoto'" :acceptType="commentAcceptType"  :parentNo="no" :rwauth="rwauth" :isAdmin="isAdmin"></comment>
        </div>
        <v-dialog
            v-model="modalShow"
            width="780"
            style="z-index:100;"
        >
            <userPhotoRegist v-if="articleRegistShow" :ownerUid="ownerUid" :no="no"
                             @modalHide="modalHide"></userPhotoRegist>
        </v-dialog>
    </div>
</template>


<script>
	import AUTH from '../../../../api/auth'
	import {
		HOST,
		API_URL_USER_PHOTO_ARTICLE_REGIST_INFO,
		API_URL_USER_PHOTO_ARTICLE_LIKE_UPDATE,
		API_URL_USER_PHOTO_ARTICLE_DELETE

	} from '../../../../api/urls';
	import apiService from '../../../../api/apiService';
	import {mapGetters} from "vuex";
	import Comment from '../../../../components/comment/comment';
	import userPhotoRegist from './userPhotoRegist'

	export default {
		name: 'userPhotoView',
		components: {
			Comment,
			userPhotoRegist
		},
		props:["selectedNo","acceptType"],
		computed: {
			...mapGetters('etc', ["getUid"]),
		},
		data() {
			return {
                mobileClass:'',
                mobileView:false,
				snsPannelShow:false,
				host: HOST,
				isLogin: false,
				no: '',
				ownerUid: '',
				subject: '',
				photo: '',
				info: {},
				rwauth: false,
				isAdmin: '',
				rdate: '',
				uid: '',
				glikeClass: '',
				modalShow: false,
				articleRegistShow: false,
				commentAcceptType:'',

			}
		},
		created() {
			if(this.acceptType=='chat')this.commentAcceptType = 'white';
            if (this.$isMobile()) {
                this.mobileView = true;
                this.mobileClass = 'mobile'
            }

			this.ownerUid = this.getUid;
			let memberInfo = AUTH.getSession(this.$isMobile());
			if (memberInfo.AUTHTOKEN) {
				this.isLogin = true;
				this.uid = memberInfo.uid;
				this.rwauth = true;
				if (memberInfo.uid == 'admin' || this.uid == this.ownerUid) this.isAdmin = 'admin';

			}
			if(this.selectedNo) {
				this.no = this.selectedNo;
			} else {
				this.no = this.$route.params.no;
			}
			this.getData();

		},
		methods: {
			modalHide(cmd) {
				this.modalShow = false;
				this.articleRegistShow = false;
				if (cmd == 'reload') {
					this.getData();
				}
			},
            snsOpen() {
	            if(this.snsPannelShow)this.snsPannelShow = false
                else this.snsPannelShow = true
            },
			snsShare(sns) {
				let img = (this.info.vfiles) ? this.info.vfiles[0].url : '';
				let title = this.info.contents;
				let no = this.info.no;

				let snsParams = {};
				snsParams.stype = sns;
				snsParams.currentUrl = this.ownerUid + '/main/userPhoto/view/'+this.no
				snsParams.no = no;
				snsParams.img = img;
				snsParams.title = title;
				this.$eventBus.$emit('snsGo', snsParams);

			},

			modifyInfo() {
                if (this.$isMobile()) {
                    this.$router.push('/'+this.ownerUid + '/main/userPhoto/modify/'+this.no)
                } else {
                    this.modalShow = true;
                    this.articleRegistShow = true;
                }

			},
			deleteInfo() {
				let params = {
					type: 'confirm',
					message: '게시글을 삭제 하시겠습니까?',
					doAction: () => {
						this.doDelete();
					}
				};
				this.$eventBus.$emit('modalOpen', params);
			},
			doDelete() {
				const frm = new FormData()
				frm.append('no', this.no)
				apiService.post(API_URL_USER_PHOTO_ARTICLE_DELETE, frm, (res) => {
					this.$router.go(-1);
					let params = {
						message: '게시글이 삭제 되었습니다',
					};
					this.$eventBus.$emit('modalOpen', params);
				});
			},
			getData() {

				const frm = new FormData()
				frm.append('uid', this.ownerUid)
				frm.append('no', this.no)
				apiService.post(API_URL_USER_PHOTO_ARTICLE_REGIST_INFO, frm, (res) => {
					this.info = res.info;
					this.info.glike = (this.info.glike) ? this.info.glike : 0;
					if (this.info.extraVars) {
						if (this.uid) {
							if (this.info.extraVars[this.uid]) {
								this.glikeClass = 'active';
							}
						}
					}
					this.rdate = this.info.rdate.substring(0, 10)

				});

			},
			setLike() {
				if (this.uid) {
					const frm = new FormData()
					frm.append('uid', this.uid)
					frm.append('no', this.no)
					apiService.post(API_URL_USER_PHOTO_ARTICLE_LIKE_UPDATE, frm, (res) => {
						this.info.glike = res.glike;
						if (this.glikeClass == 'active') this.glikeClass = '';
						else this.glikeClass = 'active';
					});
				} else {
					let params = {
						message: '먼저 로그인 하세요',
					};
					this.$eventBus.$emit('modalOpen', params);
				}
			}


		}

	}
</script>

<style lang="scss" scoped="true">
    .data-contents {
        width: 800px;
        margin: 20px auto;
        .article-info {
            color: #000;
            .subject {
                font-size: 20pt;
                margin-bottom: 15px;
            }
            .author-title {
                display: flex;
                font-size: 10pt;
                color: #999;
                .author-name {
                    margin-right:10px;
                }
                .author-rdate {

                }
            }

            .content-box {
                font-size: 12pt;
                margin: 10px 0;

            }

            .img-box {
                width: 100%;
                img {
                    max-width: 100%;
                    margin-bottom: 20px;
                }

            }
            .list-button-box {
                border-top: solid 1px #000;
                padding-top: 20px;
                margin-top: 30px;
                position:relative;
                .update-type-box {
                    position: absolute;
                    z-index: 10;
                    left: 88px;
                    top:64px;
                    & > ul {
                        padding: 15px 0 0 0;
                        & > li {
                            text-align: center;
                            padding-bottom: 15px;
                            font-size: 10pt;
                            color: #000;
                            cursor:pointer;
                            font-weight: bold;
                        }
                    }
                }
                & > ul {
                    padding: 0;
                    display: flex;
                    & > li {
                        width: 100px;
                        height: 37px;
                        line-height: 37px;
                        margin-right: 15px;
                        text-align: center;
                        background: #1F2940;
                        font-size: 10pt;
                        border-radius: 5px;
                        cursor: pointer;
                        img {
                            width: 17px;
                            margin-top: 8px;
                        }

                        &.space {
                            width: 70%;
                            background: none;
                            cursor: default;

                        }
                        &.mofify-box {
                            min-width: 150px;
                            background: none;
                            cursor: default;
                            .upd-button {
                                margin-right: 10px;
                            }
                        }
                        &.like-button {
                            text-align: left;
                            padding-left: 20px;
                            span {
                                padding-left: 10px;
                                font-size: 12pt;
                                position: relative;
                                top: -1px;
                            }
                            &.active {
                                background: #686EFB;
                            }
                        }
                    }
                }
            }
        }
        &.chat {
            .article-info {
                color: #000;
            }
            .list-button-box {
                color:#fff;
            }
        }
        &.mobile {
            width:100%;
            margin:20px auto;
            .article-info {
                color: #000;
                .subject {
                    font-size: 20pt;
                    margin-bottom: 15px;
                }
                .author-title {
                    display: flex;
                    font-size: 10pt;
                    color: #999;
                    .author-name {
                        margin-right:10px;
                    }
                    .author-rdate {

                    }
                }

                .content-box {
                    font-size: 12pt;
                    margin: 10px 0;

                }

                .img-box {
                    width: 100%;
                    img {
                        max-width: 100%;
                        margin-bottom: 20px;
                    }

                }
                .list-button-box {
                    border-top:solid 1px #000;
                    padding-top:20px;
                    margin-top:30px;
                    position:relative;
                    .update-type-box {
                        position: absolute;
                        z-index: 10;
                        left: 88px;
                        top:64px;
                        & > ul {
                            padding: 15px 0 0 0;
                            & > li {
                                text-align: center;
                                padding-bottom: 15px;
                                font-size: 10pt;
                                color: #000;
                                cursor:pointer;
                                font-weight: bold;
                            }
                        }
                    }
                    & > ul {
                        padding: 0;
                        display: flex;
                        &.mofify-button-box {
                            width:100%;
                            justify-content: space-between;
                            margin-bottom:30px;
                            li {

                                &.mofify-box {
                                    background: none;
                                    min-width:200px;
                                    background: none;
                                    cursor: default;
                                    .upd-button {
                                        margin-right: 10px;
                                    }
                                }
                            }
                        }
                        & > li {
                            width:100px;
                            height: 37px;
                            line-height: 37px;
                            margin-right: 15px;
                            text-align: center;
                            background: #1F2940;
                            font-size: 10pt;
                            border-radius: 5px;
                            cursor: pointer;
                            img {
                                width: 17px;
                                margin-top: 8px;
                            }

                            &.space {
                                width: 10%;
                                background: none;
                                cursor: default;

                            }

                            &.like-button {
                                text-align: left;
                                color:#fff;
                                padding-left: 20px;
                                span {
                                    padding-left: 10px;
                                    font-size: 12pt;
                                    position: relative;
                                    top: -1px;
                                }
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
</style>
