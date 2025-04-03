<template>
    <div class="layout-page-container">
        <div class="left-container">
            <div id="default-left-menu">
                <div class="logo">
                    <img src="../../../assets/images/logo.png" @click="goHome()"/>
                </div>
                <ul class="menu-box">
                    <li v-for="(mnu,Index) in menus" :key="mnu.code" @click="goPageUrl(Index)" :class="mnu.active">
                        <img :src="host+'/common/img/'+mnu.icon">
                        {{mnu.name}}
                    </li>
                </ul>
                <ul class="banner-box" v-if="infpage">
                    <li v-for="banner in mainLeftBanners" @click="goBannerUrl(banner.glink)">
                        <img :src="host+banner.img">
                    </li>
                </ul>
                <ul class="banner-box" v-else>
                    <li></li>
                </ul>
                <div class="footer">
                    <div class="top-line"></div>
                    <div class="board-box">
                        <span @click="goCustomerPage('main')">고객센터</span>
                        <span class="dot">&middot;</span>
                        <span @click="goCustomerPage('qna')">의견보내기</span>
                        <span class="dot">&middot;</span>
                        <span @click="goCustomerPage('notice')">공지사항</span>
                    </div>
                    <ul class="address-box">
                        <li>주식회사 에프엠애드 대표이사 : 문성기</li>
                        <li>사업자번호 : 541-87-01651</li>
                        <!--li>통신판매번호 제2017-서울서초-0834</li-->
                        <li>주소 : 서울시 강남구 테헤란로20길20, 7층</li>
                        <li>고객센터 : 02-543-3567</li>
                    </ul>
                    <div class="agree-box">
                        <span @click="goAgree('agree')">이용약관</span>
                        <span class="dot">|</span>
                        <span @click="goAgree('privacy')">개인정보처리방침</span>
                    </div>

                    <div class="copyright">@2021 FATMOUSE</div>
                </div>
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


                <div class="login-box">
                    <div class="user-icon" v-if="!isLogin" @click="login()">
                        <i class="fas fa-user"></i>
                    </div>
                    <div class="user-icon" v-else @click="showMyMenu()">
                        <img v-if="photo" :src="host+photo">
                        <i v-if="!photo" class="fas fa-user"></i>
                    </div>
                    <div v-if="isLogin" class="mymenu-box">
                        <v-expand-transition>
                            <v-card class="mymenu-padding" v-if="myMenuShow" elevation="2">
                                <ul class="menu-box">
                                    <li @click="goMyHome()">MY HOME</li>
                                    <li @click="mypage('/main/mypage/broadcastSetting')">페이지 기본관리</li>
                                    <li @click="mypage('/main/mypage/updateMyInfo')">개인정보설정</li>
                                    <li @click="mypage('/main/mypage/myArticle')">내가 쓴 글</li>
                                    <li @click="logout()">로그아웃</li>
                                </ul>
                            </v-card>
                        </v-expand-transition>
                    </div>
                </div>

            </div>
            <router-view/>
        </div>
    </div>
</template>


<script>
	import {HOST} from '../../../api/urls';
	import {mapActions, mapGetters} from "vuex";
	import AUTH from '../../../api/auth';
	import JQ from 'jquery'

	export default {
		name: 'defaultLayout',
		computed: {
			...mapGetters('member', ["getUid"]),
			...mapGetters('etc', ["getPcmainLeftBanner", "getPcmainOwnerUid", "getSearchKeyword"])

		},
		watch: {
			'$route'(to, from) {
				let path = to.path.split('/');
				let infpage = true;
				for (let mnu of this.menus) {
					if (path[2] == mnu.code) {
						infpage = false;
						mnu.active = 'active';
					} else mnu.active = '';
				}
				if (path[2] != 'search') {
					this.keyword = '';
				}

				if (infpage) {
					if (path[2] == 'customer' || path[2] == 'search' || path[1] == 'board' || path[2] == 'agree') {
						this.infpage = false;
						return;
					}
					this.infpage = true;
					this.menus[3].active = 'active';

				} else this.infpage = false;

			},
			getUid(val) {
				if (val) {
					this.setMemberInfo();
				}
			},
			getPcmainOwnerUid(val) {
				if (val) {
					this.mainLeftBanners = this.getPcmainLeftBanner;
				} else {
					this.mainLeftBanners = [];
				}

			},
			getSearchKeyword(val) {
				this.keyword = val;
			},
			myMenuShow(val) {
				if (val) {
					let obj = this;
					setTimeout(() => {
						JQ(document).on('click', function () {
							obj.myMenuShow = false;
						})
					}, 100)
				} else {
					JQ(document).off('click');
				}
			}

		},
		data() {
			return {
				host: HOST,
				isLogin: false,
				mtype: '',
				keyword: '',
				menus: [
					{code: 'home', icon: 'ico_menu1.png', name: '홈', active: 'active'},
					{code: 'video', icon: 'ico_menu3.png', name: 'Youtube', active: ''},
					{code: 'bjList', icon: 'ico_menu4.png', name: '인플루언서', active: ''},
                    {code: 'instar', icon: 'ico_menu4.png', name: '인스타 셀럽', active: ''},
				],
				photo: '',
				myMenuShow: false,
				mainLeftBanners: [],
				infpage: true,
				myUid: '',
				searchView: false,
			}

		},
		created() {
			AUTH.setDevice(this.$isMobile());

			this.setMemberInfo();
			let path = this.$route.path.split('/');

			for (let mnu of this.menus) {
				if (path[2] == mnu.code) {
					this.infpage = false;
					mnu.active = 'active';
				} else mnu.active = '';
			}
			if (this.infpage) {
				if (path[2] == 'customer' || path[2] == 'search' || path[1] == 'board' || path[2] == 'agree') {
					this.infpage = false;
					//if (path[2] == 'search') {
						//console.log(this.$router.params)
					//}
					return;
				}
				this.menus[3].active = 'active';

			}

		},
		methods: {
			...mapActions('member', ["setMember", "setLoginBoxOpen"]),
			search() {
				if (!this.keyword) {
					let params = {
						message: '검색어를 입력하세요',
					}
					this.$eventBus.$emit('modalOpen', params);
					return;
				}
				let path = this.$route.path.split('/');
				if (path[2] != 'search') {
					this.$router.push('/main/search/' + this.keyword)
				} else {
					this.$eventBus.$emit('searchKeyword', this.keyword);
				}

			},
			googleYoutubeSync() {

            },
			goBannerUrl(url) {
			    window.open(url);
            },
			setMemberInfo() {
				let memberInfo = AUTH.getSession(this.$isMobile());
				if (memberInfo.AUTHTOKEN) {
                    if(memberInfo.mtype!='temp') {
                        this.isLogin = true;
                        this.mtype = memberInfo.mtype;
                        this.photo = memberInfo.photo;
                        this.myUid = memberInfo.uid;
                    }
				}
			},
			goHome() {
				for (let mnu of this.menus) {
					if (mnu.code == 'home') {
						mnu.active = 'active';
					} else mnu.active = '';
				}
				this.$router.push('/main/home');
			},

			goMyHome() {
				if (this.myUid == 'admin') {
					let params = {
						message: '관리자 페이지로 이동됩니다',
						doAction: () => {
							this.$router.push('/' + this.myUid);
						}
					}
					this.$eventBus.$emit('modalOpen', params);
				} else {
					this.$router.push('/' + this.myUid);
				}

			},
			login() {
				this.setLoginBoxOpen(true);
			},
			join() {
				this.$router.push('/join');
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
					message: '로그아웃 되었습니다',
					doAction: () => {
						this.$router.push({path: '/'});
					}
				}
				this.$eventBus.$emit('modalOpen', msgParams);

			},
			mypage(url) {
				this.$router.push(url);

			},
			showMyMenu() {
				if (this.myMenuShow) this.myMenuShow = false;
				else this.myMenuShow = true;
			},
			goPageUrl(index) {
				let k = 0;
				for (let mnu of this.menus) {
					if (index == k) {
						mnu.active = 'active';
					} else mnu.active = '';
					k++;
				}

				let url = this.menus[index].code;
				if(url=='world') {
					this.$router.push('/world/main');
                } else {
					this.$router.push('/main/' + url);
                }

			},
            goAgree(code) {
	            this.$router.push('/main/agree/'+code);
            },
			goCustomerPage(code) {
				switch (code) {
					case 'main':
						this.$router.push('/main/customer');
						break;
					case 'notice':
						this.$router.push('/board/list/notice');
						break;
					default:
						this.$router.push('/board/regist/userqna');
						break;
				}

			}


		}
	}
</script>

<style lang="scss" scoped="true">

    .layout-page-container {
        display: flex;
        .left-container {
            width: 315px;
            background:#181A1D;
            min-height: calc(100vh);
            #default-left-menu {
                position: sticky;
                top: -100px;
                .logo {
                    padding: 30px;
                    color: #fff;
                    font-size: 14pt;
                    img {
                        width:153px;
                        cursor: pointer;
                    }
                }
                .menu-box {
                    padding: 0;
                    margin: 0 30px 0 0;
                    li {
                        cursor: pointer;
                        font-size: 11pt;
                        color: #fff;
                        padding: 15px 0 15px 30px;
                        img {
                            width: 20px;
                            margin-right: 10px;
                            margin-bottom: -4px;
                        }
                        &.active {
                            background: #225CA2;
                        }

                    }
                }
                .banner-box {
                    margin: 50px 30px 30px 0;
                    min-height: 200px;
                    padding: 0;
                    li {
                        width: 280px;
                        height: 150px;
                        overflow: hidden;
                        margin-bottom: 15px;
                        cursor:pointer;
                        img {
                            width: 100%;
                            height: auto;
                        }
                    }
                }
                .footer {
                    .top-line {
                        margin-right: 30px;
                        border-top: solid 1px #4C5466;
                    }
                    .board-box {
                        margin: 18px 25px;
                        padding: 0;
                        span {
                            padding: 0 5px;
                            text-align: center;
                            color: #f4f4f4;
                            font-size: 11pt;
                            cursor: pointer;
                            &.dot {
                                cursor: default;
                                text-align: center;
                            }
                        }
                    }
                    .agree-box {
                        margin:20px 25px 50px 25px;
                        padding: 0;
                        span {
                            padding: 0 5px;
                            text-align: center;
                            color: #f4f4f4;
                            font-size: 11pt;
                            cursor: pointer;
                            &.dot {
                                cursor: default;
                                text-align: center;
                            }
                        }
                    }
                    .address-box {
                        margin: 15px 25px 10px 25px;
                        padding: 0;
                        color: #9DA0A6;
                        li {
                            font-size: 10pt;
                            line-height: 17pt;
                        }

                    }
                    .copyright {
                        margin: 18px 25px;
                        padding: 0;
                        color: #9DA0A6;
                        font-size: 10pt;
                    }
                }
            }
        }
        .main-container {
            width: calc(100vw - 315px);
            min-height: calc(100vh);
            background: #fff;
            .header {
                display: flex;
                height: 80px;
                padding: 15px 10px 15px 30px;
                justify-content: space-between;
                background: #F4F4F4;
                .search-box {
                    width: 60%;
                    .input-box {
                        width: 400px;
                        background: #fff;
                        height: 50px;
                        border:solid 1px #dcdcdc;
                        border-radius: 25px;
                        display: flex;
                        input {
                            width: 355px;
                            height: 45px;
                            border: none;
                            background: none;
                            padding: 7px 5px 5px 30px;
                            color: #555;
                            outline: none;
                        }
                        .search-button {
                            width: 40px;
                            height: 40px;
                            color: #fff;
                            border-radius: 50%;
                            background: #225CA2;
                            text-align: center;
                            line-height: 41px;
                            margin-top: 5px;
                            cursor: pointer;
                        }
                    }
                }
                .login-box {
                    width: 40%;
                    display: flex;
                    justify-content: flex-end;
                    padding-top: 3px;
                    position: relative;
                    .google-youtube-box {
                        margin-right:20px;
                        margin-top:3px;
                        .sync-button {
                            background: #225CA2;
                            COLOR:#FFF;
                        }
                    }
                    .user-icon {
                        cursor: pointer;
                        width: 46px;
                        height: 46px;
                        background: #225CA2;
                        border-radius: 50%;
                        overflow: hidden;
                        font-size: 16pt;
                        margin-right: 20px;
                        text-align: center;
                        line-height: 46px;
                        i {
                            color: #fff;
                        }
                        img {
                            width: 100%;
                            min-height: 46px;
                        }

                    }
                    .mymenu-box {
                        position: absolute;
                        top: 55px;
                        right: 20px;
                        width: 150px;
                        z-index: 1000;
                        .mymenu-padding {
                            .menu-box {
                                background: #fff;
                                padding: 18px 25px 0 25px;
                                border-radius: 5px;
                                li {
                                    font-size: 10pt;
                                    padding-bottom: 18px;
                                    font-weight: bold;
                                    cursor: pointer;
                                }
                            }
                        }
                    }
                }
            }
        }

    }


</style>
