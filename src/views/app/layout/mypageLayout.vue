<template>
    <div class="layout-page-container">
        <div class="left-container">
            <div class="logo">
                <img src="../../../assets/images/logo.png"  @click="$router.push('/')"/>
            </div>
            <div class="myinfo-box">
                <div>
                    <div class="myImg-box">
                        <img v-if="photo" :src="host+photo"/>
                        <i v-if="!photo" class="fas fa-user"></i>
                    </div>
                    <div class="myname">{{name}}</div>
                </div>
                <div class="myUrl"  @click="goMyHome()">duckku.com/{{memberInfo.uid}}</div>
            </div>
            <div class="menu-box">
                <div v-for="(menu,index) in myMenus">
                    <div class="menu-header" @click="menuToggle(index)">
                        {{menu.name}}
                        <i v-if="!menu.view && menu.subMenus" class="fas fa-sort-down"></i>
                        <i v-if="menu.view && menu.subMenus" class="fas fa-sort-up"></i>
                    </div>
                    <v-expand-transition v-if="menu.subMenus">
                        <ul class="menu-ul" v-if="menu.view">
                            <li :class="'menu-li '+subMnu.gclass" v-for="(subMnu,subIndex) in menu.subMenus"
                                @click="goMypageUrl(index,subMnu.code)">
                                {{subMnu.name}}
                            </li>
                        </ul>
                    </v-expand-transition>
                </div>
            </div>
            <div class="footer">

            </div>
        </div>
        <div class="main-container">
            <div class="header">
                <div class="search-box">
                    <form novalidate @submit.prevent="search">
                    <div class="input-box">
                        <input type="text" v-model="keyword" placeholder="Search">
                        <div class="search-button" @click="search()">
                            <i class="fas fa-chevron-right"></i>
                        </div>
                    </div>
                    </form>
                </div>
                <ul class="login-box">
                    <li class="my-box">
                        <div class="user-icon" @click="showMyMenu()">
                            <img v-if="photo" :src="host+photo">
                            <i v-if="!photo" class="fas fa-user"></i>
                        </div>
                        <div class="mymenu-box">
                            <v-expand-transition>
                                <v-card class="mymenu-padding" v-if="myMenuShow" elevation="2">

                                    <ul class="menu-box">

                                        <li @click="goMyHome()">MY HOME</li>
                                        <li @click="mypage('broadcastSetting')">페이지 기본관리</li>
                                        <li @click="mypage('updateMyInfo')">개인정보설정</li>
                                        <li @click="mypage('myArticle')">내가 쓴 글</li>
                                        <li @click="logout()">로그아웃</li>
                                    </ul>
                                </v-card>
                            </v-expand-transition>
                        </div>

                    </li>
                </ul>
            </div>
            <router-view/>
        </div>
    </div>
</template>


<script>
	import {mapActions, mapGetters} from "vuex";
	import AUTH from '../../../api/auth';
	import {HOST, API_URL_BROADCAST_GET_MY_BROADCASTINFO} from '../../../api/urls';
	import apiService from '../../../api/apiService';

	export default {
		name: 'defaultLayout',
		computed: {
			...mapGetters('member', [ "getBrocastChange"])
		},
		watch: {
			getBrocastChange(val) {
			 	if (val) {
				  this.setMemberInfo();
				  this.setBrocastChange(false);
				}
			},


		},
		data() {
			return {
				host: HOST,
				mtype: '',
				memberInfo: {},
				name: '',
				myMenus: [],
				menuPanel: '',
				keyword: '',
				photo: '',
				myMenuShow: false,
				broadcastShow:false,


			}

		},
		created() {
			AUTH.setDevice(this.$isMobile());
			this.setMemberInfo();
			this.setMenus();
		},
		methods: {
			...mapActions('member', ["setMember", "setBrocastChange"]),
			search() {
				if(!this.keyword) {
					let params = {
						message:'검색어를 입력하세요',
					}
					this.$eventBus.$emit('modalOpen', params);
					return;
				}
				let path = this.$route.path.split('/');
				if(path[2]!='search') {
					this.$router.push('/main/search/' + this.keyword)
				} else {
					this.$eventBus.$emit('searchKeyword',this.keyword);
				}

			},
			showBrocast() {
				this.myMenuShow = false;
				if(this.broadcastShow)this.broadcastShow = false;
				else this.broadcastShow = true;

            },
			showMyMenu() {
				this.broadcastShow = false;
				if (this.myMenuShow) this.myMenuShow = false;
				else this.myMenuShow = true;

			},
			setMenus() {
				let myMenus = [];
                myMenus.push({
                    name: '페이지 기본관리', view: false, subMenus: [
                        {name: '페이지 기본관리', code: 'broadcastSetting', gclass: ''},
                        {name: '게시판 관리', code: 'userBoard', gclass: ''},
                    ]
                });
                myMenus.push({name: '개인정보 설정', view: false,code: 'updateMyInfo'});
				myMenus.push({name: '내가 쓴 글', view: false, code: 'myArticle'});
				let path = this.$route.path.split('/');
				let code = path[3];
				for (let mnu of myMenus) {
					if (mnu.subMenus) {
						let menuView = false;
						for (let smnu of mnu.subMenus) {
							if (smnu.code == code) {
								smnu.gclass = 'active';
								menuView = true;
							} else smnu.gclass = '';
						}
						if (menuView) {
							mnu.view = true;
						}
					}
				}

				this.myMenus = myMenus;


			},
			menuToggle(index) {
				let i = 0;
				let moveCode = '';
				for (let mnu of this.myMenus) {

					if (i == index) {
						mnu.view = true;
						if(mnu.code)moveCode = mnu.code;
					} else {
						mnu.view = false;
					}
					i++;
				}
				if(moveCode)this.$router.push({path: '/main/mypage/' + moveCode});
			},
			setMemberInfo() {
				let memberInfo = AUTH.getSession(this.$isMobile());
				if (memberInfo.AUTHTOKEN) {
					this.mtype = memberInfo.mtype;
					this.memberInfo = memberInfo;
					this.photo = this.memberInfo.photo;
					if (this.mtype == 'shop') {
						this.getMyBroadCastInfo();
					} else {
						this.name = this.memberInfo.unick;
					}


				} else {
					this.$router.push('/');
				}
			},
			getMyBroadCastInfo() {
				const frm = new FormData()
				apiService.post(API_URL_BROADCAST_GET_MY_BROADCASTINFO, frm, (res) => {
					if (res.info.name) {
						this.name = res.info.name;
					} else {
						this.name = this.memberInfo.unick;
					}
				});
			},
			goMyHome() {
				if(this.memberInfo.uid =='admin') {
					let params = {
						message:'관리자 페이지로 이동됩니다',
						doAction:()=>{
							this.$router.push('/' + this.memberInfo.uid);
						}
					}
					this.$eventBus.$emit('modalOpen', params);
				} else {
					this.$router.push('/' + this.memberInfo.uid);
				}

			},
			goMypageUrl(index, cmd) {
				for (let mnu of this.myMenus) {
					if (mnu.subMenus) {
						for (let smnu of mnu.subMenus) {
							if (cmd == smnu.code) smnu.gclass = 'active'
							else smnu.gclass = '';
						}

					}
				}

				this.$router.push({path: '/main/mypage/' + cmd});

			},
			logout() {
				this.myMenuShow = false;
				this.isLogin = false;
				AUTH.logout(this.$isMobile());
				let params = {
					name: '',
					no: '',
					uid: '',
					mtype: '',
					level: '',
				}
				this.setMember(params);
				let msgParams = {
					message:'로그아웃 되었습니다',
					doAction:()=>{
						this.$router.push({path: '/'});
					}
				}
				this.$eventBus.$emit('modalOpen', msgParams);
			},
			mypage(code) {
				for (let mnu of this.myMenus) {
					if (mnu.subMenus) {
						for (let smnu of mnu.subMenus) {
							if (code == smnu.code) smnu.gclass = 'active'
							else smnu.gclass = '';
						}

					}
				}

				this.$router.push({path: '/main/mypage/' + code});
				this.broadcastShow = false;
				this.myMenuShow = false;

			},


		}
	}
</script>

<style lang="scss" scoped="true">
    .layout-page-container {
        display: flex;
        .left-container {
            width: 315px;
            background: #181A1D;
            min-height: calc(100vh);
            .logo {
                padding: 30px;
                img {
                    width:153px;
                    cursor: pointer;
                }
            }
            .myinfo-box {
                color: #fff;
                text-align: center;
                margin-bottom: 30px;
                .myImg-box {
                    width: 120px;
                    height: 120px;
                    margin: auto;
                    border-radius: 50%;
                    overflow: hidden;
                    background: #225CA2;
                    img {
                        width: 100%;
                        min-height: 100%;
                    }
                    i {
                        font-size: 40pt;
                        margin-top: 28px;
                    }
                }
                .myname {
                    font-size: 17pt;
                    font-weight: bold;
                    margin: 16px 0 0 0;

                }
                .myUrl {
                    color: #fafafa;
                    cursor:pointer;
                    font-size: 12pt;
                }
            }
            .menu-box {
                padding: 0;
                margin: 0 30px;
                color: #fff;
                cursor: pointer;
                .menu-header {
                    padding: 10px 0;
                    font-size: 11pt;
                    color:#fff;
                    position: relative;
                    i {
                        font-size: 15pt;
                        position: absolute;
                        right: 1px;
                        &.fa-sort-up {
                            top: 18px;
                        }
                    }
                }
                .menu-ul {
                    padding: 0;
                    margin: 0;
                    li {
                        cursor: pointer;
                        font-size: 10pt;
                        color: #999;
                        padding: 15px 0 15px 30px;
                        &.active {
                            color: #fff;
                            background: #225CA2;
                        }

                    }
                }
            }
        }
        .main-container {
            width: calc(100vw - 315px);
            min-height: calc(100vh);
            background: #14192C;
            .header {
                display: flex;
                height: 80px;
                padding: 15px 10px 15px 30px;
                justify-content: space-between;
                .search-box {
                    width: 80%;
                    .input-box {
                        width: 400px;
                        background: #1F2940;
                        height: 50px;
                        border-radius: 25px;
                        display: flex;
                        input {
                            width: 355px;
                            height: 45px;
                            border: none;
                            background: none;
                            padding: 7px 5px 5px 30px;
                            color: #fff;
                            outline: none;
                        }
                        .search-button {
                            width: 40px;
                            height: 40px;
                            color: #fff;
                            border-radius: 50%;
                            background: #686DFC;
                            text-align: center;
                            line-height: 41px;
                            margin-top: 5px;
                            cursor: pointer;
                        }
                    }
                }
                .login-box {
                    width: 20%;
                    display: flex;
                    justify-content: flex-end;
                    padding-top: 3px;
                    li {
                        color: #fff;
                        margin-right: 20px;
                        cursor: pointer;
                        .play-button {
                            cursor: pointer;
                            width: 150px;
                            height: 45px;
                            min-height: 45px;
                            background: #FF584C;
                            border-radius: 25px;
                            font-size: 13pt;
                            padding-left: 20px;
                            i {
                                margin-top: 3px;
                                margin-right: 5px;
                            }
                        }
                        .mymenu-box {
                            width:150px;
                            position: absolute;
                            top: 70px;
                            right: 96px;
                            z-index:1000;
                            .mymenu-padding {
                                .menu-box {
                                    background: #fff;
                                    padding: 18px 0 0 25px;
                                    border-radius: 5px;
                                    li {
                                        font-size: 10pt;
                                        padding-bottom: 18px;
                                        font-weight: bold;
                                        cursor: pointer;
                                        color:#000;
                                    }
                                }
                            }
                        }
                        &.my-box {
                            width:46px;
                            position: relative;
                            .user-icon {
                                cursor: pointer;
                                width: 46px;
                                height: 46px;
                                background: #5E65E3;
                                border-radius: 50%;
                                font-size: 16pt;
                                margin-right: 20px;
                                overflow:hidden;
                                text-align: center;
                                line-height: 46px;
                                i {
                                    color: #fff;
                                }
                                img {
                                    width:100%;
                                    min-height:46px;
                                }

                            }
                            .mymenu-box {
                                top: 55px;
                                right: 0;
                            }
                        }
                    }
                }
            }
        }

    }


</style>
