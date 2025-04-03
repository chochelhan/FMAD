<template>
    <div class="layout-page-container">
        <div class="left-container">

            <div class="logo" @click="$router.push('/')">
                <img src="../../../assets/images/logo.png"/>
            </div>
            <div class="menu-box">
                <div v-for="(menu,index) in myMenus">
                    <div class="menu-header" @click="menuToggle(index)">
                        {{menu.name}}
                        <i v-if="!menu.view" class="fas fa-sort-down"></i>
                        <i v-if="menu.view" class="fas fa-sort-up"></i>
                    </div>
                    <v-expand-transition>
                        <ul class="menu-ul" v-if="menu.view">
                            <li :class="'menu-li '+subMnu.gclass" v-for="(subMnu,subIndex) in menu.subMenus"
                                @click="goMypageUrl(index,subMnu.code)">
                                {{subMnu.name}}
                                <i v-if="subMnu.code=='examSetting' && !subMnu.gclass" class="fas fa-angle-down"></i>
                                <i v-if="subMnu.code=='examSetting' && subMnu.gclass=='active'"
                                   class="fas fa-angle-up"></i>
                                <ul class="eaxm-ul" v-if="subMnu.code=='examSetting' && subMnu.gclass=='active'">
                                    <li :class="'exam-li '+exam.gclass" v-for="exam in subMnu.subList"
                                        @click="goEaxmUrl(exam.code)">
                                        {{exam.name}}
                                    </li>
                                </ul>
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
                    <div class="input-box">
                        <input type="text" v-model="keyword" placeholder="Search">
                        <div class="search-button">
                            <i class="fas fa-chevron-right"></i>
                        </div>
                    </div>
                </div>
                <ul class="login-box">
                    <li>
                        <v-btn type="button" class="play-button" style="color:#fff" @click="playLive()">
                            <div style="margin-top:-5px;">
                                <i class="fas fa-video"></i>
                                방송 하기
                            </div>
                        </v-btn>
                    </li>
                    <li @click="mypage()">
                        <div class="my-box">
                            <i class="fas fa-user"></i>
                        </div>
                    </li>
                </ul>
            </div>
            <router-view/>
        </div>
    </div>
</template>


<script>
	import {mapActions} from "vuex";
	import AUTH from '../../../api/auth';
	import {HOST, API_URL_BROADCAST_LIVE_INFO_WITH_OWNER} from '../../../api/urls';
	import apiService from '../../../api/apiService';
	import JQ from 'jquery'
	export default {
		name: 'liveLayout',
		data() {
			return {
				memberInfo: {},
				myMenus: [],
				menuPanel: '',
				keyword: '',
				gno: '',
				status:'',

			}

		},
		created() {
			AUTH.setDevice(this.$isMobile());
			this.gno = this.$route.params.no;
			this.setGno(this.gno);
			this.setMemberInfo();
			this.getLiveInfo();
		},
		methods: {
			...mapActions('etc', ["setGno"]),
            getLiveInfo() {
	            const frm = new FormData()
	            frm.append('no', this.gno)
	            apiService.post(API_URL_BROADCAST_LIVE_INFO_WITH_OWNER, frm, (ret) => {
                    this.status = ret.info.status;
		            this.setMenus();
	            });
            },
			setMenus() {

                let afterClass = (this.status=='complete')?'':'disabled';
				let myMenus = [
					{
						name: 'STEP01. 내 라이브', view: false, subMenus: [
							{name: '내 라이브 정보', code: 'liveInfo', gclass: 'active'},
							{name: '환경 설정', code: 'liveSetting', gclass: ''},
						]
					},
					{
						name: 'STEP02. 사용 전 관리', view: false, subMenus: [
							{
								name: '시험 설정', code: 'examSetting', gclass: '', subList: [
									{name: '일반 설정', code: 'normal', gclass: ''},
									{name: '수기로 입력', code: 'direct', gclass: ''},
									{name: '엑셀로 업로드', code: 'excel', gclass: ''},
								]
							},
							{name: '문제/자료 관리', code: 'dataList', gclass: ''},
							{name: '설문조사 관리', code: 'pollList', gclass: ''},
							{name: '투표 관리', code: 'voteList', gclass: ''},
							{name: '게시판 관리', code: 'boardSetting', gclass: ''},
						]
					},
					{
						name: 'STEP03. 사용 후 관리', view: false, subMenus: [
							{name: '시험 내역', code: 'afterExam', gclass: afterClass},
							{name: '간단 퀴즈 내역', code: 'afterQuiz', gclass: afterClass},
							{name: '채팅 내역', code: 'afterChat', gclass: afterClass},
							{name: '설문조사 내역', code: 'afterPoll', gclass: afterClass},
							{name: '투표 내역', code: 'afterVote', gclass: afterClass},
							{name: '공유 내역', code: 'afterData', gclass: afterClass},
							{name: '게시판 내역', code: 'afterBoard', gclass: afterClass},
							{name: '참가자 정보', code: 'afterUser', gclass: afterClass},
						]
					},

				]
				let path = this.$route.path.split('/');
				let code = path[3];
				for (let mnu of myMenus) {
					if (mnu.subMenus) {
						let menuView = false;
						for (let smnu of mnu.subMenus) {
							if (smnu.code == code) {
								smnu.gclass = 'active';
								menuView = true;
								if (code == 'examSetting' && path[4]) {
									for (let exam of smnu.subList) {
										if (exam.code == path[4]) {
											exam.gclass = 'active'
										}
									}
								}
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
				for (let mnu of this.myMenus) {
					if (i == index) mnu.view = true;
					else mnu.view = false;
					i++;
				}
			},
			setMemberInfo() {
				let memberInfo = AUTH.getSession(this.$isMobile());
				if (memberInfo.AUTHTOKEN) {
					this.memberInfo = memberInfo;
				} else {
					this.$router.push('/');
				}
			},
			goMypageUrl(index, cmd) {
				let k=0;
				let goDeny = false;
				for (let submnu of this.myMenus) {

					for (let mnu of submnu.subMenus) {
							if (cmd == mnu.code) {
								if(k==2 && this.status!='complete') {
									goDeny = true;
								} else {
									mnu.gclass = 'active'
								}
							} else {
								if(k==2 && this.status!='complete') {
									mnu.gclass = 'disabled'
								} else {
									mnu.gclass = ''
								}
                            }

							if (mnu.code == 'examSetting' && cmd != 'examSetting') {
								for (let exam of mnu.subList) {
									exam.gclass = ''
								}
							}

					}
					k++;
				}
				if (cmd != 'examSetting' && !goDeny) {
					this.$router.push('/live/' + this.gno + '/' + cmd);
				}

			},
			goEaxmUrl(code) {
				for (let mnu of this.myMenus[1].subMenus[0].subList) {
					if (code == mnu.code) mnu.gclass = 'active';
					else mnu.gclass = '';
				}
				this.$router.push('/live/' + this.gno + '/examSetting/' + code);

			},
			playLive() {
				if(this.status=='ready') {
					let width = JQ(window).width();
					let height = JQ(window).height() + 200;

					window.open('/hostLive/' + this.gno, 'hostLiveWin', 'width=' + width + ',height=' + height)
				} else {
					let msg = (this.status=='ing')?'현재 진행중인':'이미 종료된'
					let  message = {
						message: msg+' 방송입니다',
					};
					this.$eventBus.$emit('modalOpen', message);
                }
				//window.open('/hostLive/'+this.gno,'hostLiveWin')
            },
			mypage() {
				this.$router.push('/main/mypage/broadcastList');
			}


		}
	}
</script>

<style lang="scss" scoped="true">
    .layout-page-container {
        display: flex;
        .left-container {
            width: 315px;
            background: #1F2A40;
            min-height: calc(100vh);
            .logo {
                padding: 30px;
                cursor: pointer;
               img {
                   width: 153px;
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
                    background: #5E65E3;
                    border: solid 2px #fff;
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
                    font-size: 12pt;
                }
            }
            .menu-box {
                padding: 0;
                margin: 0 30px;
                background: #1F2A40;
                color: #fff;
                cursor: pointer;
                .menu-header {
                    padding: 10px 0;
                    font-size: 11pt;
                    color: #5E65E3;
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
                    .menu-li {
                        cursor: pointer;
                        font-size: 10pt;
                        color: #fff;
                        padding: 15px 0 15px 30px;
                        position: relative;
                        &.active {
                            background: #686DFC;
                        }
                        &.disabled {
                            color:#999;
                        }
                        i {
                            position: absolute;
                            right: 10px;
                            top: 17px;
                            &.fa-angle-up {

                            }
                        }
                        .eaxm-ul {
                            position: relative;
                            z-index: 10;
                            padding: 7px 0;
                            margin: 15px 0 -14px -30px;
                            background: #fff;
                            .exam-li {
                                cursor: pointer;
                                font-size: 10pt;
                                padding: 7px 0 7px 30px;
                                color: #333;
                                &.active {
                                    color: #686DFC;
                                    font-weight: bold;
                                }
                            }
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
                    width: 60%;
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
                    width: 40%;
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
                        .my-box {
                            width: 45px;
                            height: 45px;
                            margin: auto;
                            border-radius: 50%;
                            overflow: hidden;
                            background: #5E65E3;
                            text-align: center;
                            i {
                                font-size: 14pt;
                                margin-top: 13px;
                            }
                        }
                    }
                }
            }
        }

    }


</style>