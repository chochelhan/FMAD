<template>
    <div>
        <div class="stitle">
            <span>{{title}}</span>
        </div>
        <div class="view-header">
            <div class="subject">{{articleInfo.subject}}</div>
            <div class="author-box">
                <div>
                    <span class="author">{{articleInfo.name}}</span>
                </div>
                <div class="rdate">{{articleInfo.rdate}}</div>
            </div>
        </div>
        <div class="view-contents" v-html="articleInfo.contents">
        </div>

        <div class="extra-contents" v-if="extraVars.length>0">
            <ul class="extraVars">
                <li v-for="item in extraVars" :class="item.type" v-if="item.value">
                    <div class="item-title">
                        {{item.name}}
                    </div>
                    <div class="item-value">
                        {{item.value}}
                    </div>

                </li>
            </ul>

        </div>
        <ul class="update-button">
            <li></li>
            <li>
                <v-btn
                    class="list-button"
                    type="button"
                    color="primary"
                    rounded
                    outlined
                    @click="$router.go(-1)"
                >
                    목록으로
                </v-btn>
            </li>

            <li>
                <div v-if="modifyButton">
                <v-btn
                    class="upd-button"
                    type="button"
                    color="light-blue"
                    rounded
                    outlined
                    @click="goUpdate()"
                >
                    수정
                </v-btn>
                <v-btn
                    class="upd-button"
                    type="button"
                    color="orange"
                    rounded
                    outlined
                    @click="deleteArticle()"
                >
                    삭제
                </v-btn>
                </div>
            </li>
        </ul>

    </div>
</template>


<script>
	import AUTH from '../../api/auth'
	import UTIL from '../../api/util'
    import {
		API_URL_BOARD_ARTICLE_INFO,
		API_URL_BOARD_ARTICLE_CHECKUPASS,
		API_URL_BOARD_ADMIN_ARTICLE_INFO,
		API_URL_BOARD_ADMIN_ARTICLE_DELETE,
		API_URL_BOARD_ARTICLE_DELETE,
		CONFIG_HEADER_POST
	} from '../../api/urls';

	export default {
		name: 'duckkuArticleView',

		props: ["no", "isAdmin"],
		data() {
			return {
				extraVars: [],
				articleInfo: {},
				modifyButton:false,
                rlauth:false,
                rwauth:false,
				memberInfo:{},
                title:'',
			}
		},
		created() {
			this.memberInfo = AUTH.getSession(this.$isMobile());
			this.getData();
		},
		methods: {
			getData() {
				const frm = new FormData()
				frm.append('no', this.no)

				let url = (this.isAdmin == 'admin') ? API_URL_BOARD_ADMIN_ARTICLE_INFO : API_URL_BOARD_ARTICLE_INFO;
				this.$http.post(url, frm, {headers: CONFIG_HEADER_POST}).then(res => {
					if(res.data.result == 'noAuth') {
						if (!this.memberInfo.AUTHTOKEN) {
							this.$router.push('/login');
						} else {
							let prm = {
								message: '접근불가능한 회원등급입니다',
								doAction: () => {
									this.$router.push('/');
								}
							};
							this.$eventBus.$emit('modalOpen', prm);
						}
						return;
					} else if(res.data.result == 'succ') {
						if (this.isAdmin == 'admin' && res.data.isAdmin != 'admin') {
							this.$router.push('/');
							return;
						}
						let info = res.data.board;
						this.title = info.name;
						this.modifyButton = res.data.modifyButton;
						this.rlauth = res.data.rlauth;
						this.rwauth = res.data.rwauth;
						this.articleInfo = res.data.info;
						this.articleInfo.contents = UTIL.nl2brContent(this.articleInfo.contents)
                        if (this.articleInfo.extraVars) {
							for (let item of this.articleInfo.extraVars) {
								if (item.type == 'checkbox') {
									item.value = item.value.join(', ');
								}
								this.extraVars.push(item);
							}

						}
					}
				});
			},
			goUpdate() {
				if(this.isAdmin=='admin') {
					this.$router.push('/admin/boardArticle/' + this.articleInfo.bid + '/regist/'+this.articleInfo.no);
                } else {
					this.memberInfo = AUTH.getSession(this.$isMobile());
					if(!this.memberInfo.no) {
                        let params = {
						    doAction:(upass)=>{
							    this.checkPassword(upass,'update')
                            }
                        }
                        this.$eventBus.$emit('upassOpen',params);
                    } else {
						this.$router.push('/board/regist/' + this.articleInfo.bid + '/' + this.articleInfo.no);
					}
				}
			},
            checkPassword(upass,cmd) {
	            this.$eventBus.$emit('overlay', 'open');
	            const frm = new FormData()
	            frm.append('no', this.no)
	            frm.append('upass',upass)
                this.$http.post(API_URL_BOARD_ARTICLE_CHECKUPASS, frm, {headers: CONFIG_HEADER_POST}).then(res => {
	            	//onsole.log(res.data)
		            this.$eventBus.$emit('overlay', 'hide');
		            if(res.data.result=='succ') {
		            	if(cmd=='update')this.$router.push('/board/regist/' + this.articleInfo.bid + '/' + this.articleInfo.no);
		            	else this.doDeleteArticle();
                    } else {
			            let params = {
				            message:'잘못된 비밀번호 입니다',

			            };
			            this.$eventBus.$emit('modalOpen', params);
                    }

	            });
            },
			deleteArticle() {
				let params = {
					type: 'confirm',
					message: '해당 게시물을 삭제하시겠습니까?',
					doAction: () => {

						if (this.isAdmin == 'admin') {
							this.doDeleteArticle()
						} else {
							this.memberInfo = AUTH.getSession(this.$isMobile());
							if (!this.memberInfo.no) {
								let pms = {
									doAction: (upass) => {
										this.checkPassword(upass,'delete')

									}
								}
								this.$eventBus.$emit('upassOpen', pms);
							} else {
								this.doDeleteArticle()
							}
						}
					}
				};
				this.$eventBus.$emit('modalOpen', params);

			},
			doDeleteArticle() {
				this.$eventBus.$emit('overlay', 'open');
				const frm = new FormData()
				frm.append('no', this.no)
				let url = (this.isAdmin == 'admin')?API_URL_BOARD_ADMIN_ARTICLE_DELETE:API_URL_BOARD_ARTICLE_DELETE;
				this.$http.post(url, frm, {headers: CONFIG_HEADER_POST}).then(res => {
					//onsole.log(res.data)
					this.$eventBus.$emit('overlay', 'hide');
					if(res.data.result=='succ') {
						let params = {
							message:'게시글이 삭제되었습니다',
							doAction:()=> {
								this.$router.go(-1);
                            }
						};
						this.$eventBus.$emit('modalOpen', params);
					} else {
						let params = {
							message:'잘못된 접근입니다',

						};
						this.$eventBus.$emit('modalOpen', params);
					}

				});
            }

		},
		mounted() {

		}

	}
</script>

<style lang="scss" scoped="true">
    .view-header {
        margin-top:30px;
        border-top: solid 1px #434343;
        border-bottom: solid 1px #434343;
        padding: 20px 20px 10px 20px;
        .subject {
            font-weight: bold;
            color: #000;
            font-size: 20pt;
        }
        .author-box {
            padding-top: 10px;
            display: flex;
            justify-content: space-between;
            .author {
                color: #000;
                display: inline-block;
                margin-right: 30px;

            }
            .hit {
                color: #999;
                display: inline-block;
                margin-right: 50px;
            }
            .rdate {
                color: #999;
            }
        }
    }

    .extra-contents {
        ul.extraVars {
            margin: 0;
            padding:40px 20px 30px 20px;

            li {
                margin:0;
                display: flex;
                font-size: 10pt;
                border-bottom:solid 1px #ccc;
                .item-title {
                    font-weight: bold;
                    color: #000;
                    min-width: 250px;
                    background:#f4f4f4;
                    padding:15px;
                    border-right:solid 1px #ccc;
                    border-left:solid 1px #ccc;

                }
                .item-value {
                    padding:15px;
                    width:90%;
                    border-right:solid 1px #ccc;
                }
                &:first-child {
                    border-top-left-radius:10px ;
                    border-top-right-radius:10px ;
                    border-top:solid 1px #ccc;
                    .item-title {
                        border-top-left-radius:10px ;
                    }
                    .item-value {
                        border-top-right-radius:10px ;
                    }
                }
                &:last-child {
                    border-bottom-left-radius:10px ;
                    border-bottom-right-radius:10px ;
                    .item-title {
                        border-bottom-left-radius:10px ;

                    }
                    .item-value {
                        border-bottom-right-radius:10px ;

                    }
                }
            }
        }
    }

    .view-contents {
        padding: 30px 20px 0 20px;
        min-height:200px;
        color: #777;
    }
    .update-button {
        display:flex;
        padding:0;
        justify-content: space-between;
        li {
            width:30%;
            text-align:center;
            .list-button {
                margin-top:80px;
                width:300px;
                height:60px;
            }
            &:last-child {
                padding-top:10px;
                text-align:right;
                .upd-button {
                    color: #fff;
                    margin-right: 20px;
                }
            }
        }
    }


</style>