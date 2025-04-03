<template>
    <v-app id="inspire">
        <div v-if="isLogin">
            <v-navigation-drawer
                v-model="drawer"
                app
            >


                <div class="left-menu-header">
                    <div class="admin-info-box">
                        <div class="photo">
                            <i class="fas fa-user"></i>
                        </div>
                        <div class="text-button">
                            <span @click="updateAdminPass()">비밀번호변경</span>
                            <span class="dot">|</span>
                            <span @click="logout()">로그아웃</span>
                        </div>
                    </div>
                </div>

                <div class="left-menu-content">
                    <div class="menu-box" v-for="(menu,index) in menus" :key="index">
                        <div class="menu-title" v-if="!menu.url" @click="menuToggle(index)">
                            <i :class="'icon '+menu.icon"></i>
                            {{menu.name}}
                            <i class="arrow fas fa-angle-up" v-if="menu.view"></i>
                            <i class="arrow fas fa-angle-down" v-if="!menu.view"></i>
                        </div>
                        <div class="menu-title" @click="directPage(menu)" v-else>
                            <i :class="'icon '+menu.icon"></i>
                            {{menu.name}}
                            <i class="arrow fas fa-angle-right"></i>
                        </div>

                        <v-expand-transition>
                            <div class="sub-menu-box-padding"  v-if="menu.view">
                                <ul class="sub-menu-box">
                                    <li v-for="subItem in menu.subMenus">

                                        <div class="sub-child-box" v-if="subItem.icon">
                                            <div class="sub-child-menu sub-parent-menu">
                                                <i :class="'sub-icon '+subItem.icon"></i>
                                                {{subItem.name}}
                                            </div>
                                            <div v-for="lastItem in subItem.subList" :class="'sub-child-menu '+lastItem.gclass"
                                                 @click="goSubMenuPage(menu, subItem,lastItem)">
                                                <i class="far fa-dot-circle"></i>
                                                {{lastItem.name}}
                                                <i class="sub-arrow fas fa-angle-right"></i>
                                            </div>

                                        </div>
                                        <div :class="'sub-menu-item '+subItem.gclass" v-else-if="subItem.url!='none'"
                                             @click="goPage(menu, subItem)">
                                            <i class="fas fa-dot-circle" style="margin-right:2px;"></i> {{subItem.name}}
                                            <i class="arrow fas fa-angle-right"></i>
                                        </div>
                                        <div v-else class="empty-sub-menu">
                                            <i class="fas fa-ghost"></i>
                                            {{subItem.name}}

                                        </div>

                                    </li>
                                </ul>
                            </div>
                        </v-expand-transition>
                    </div>
                </div>
            </v-navigation-drawer>

            <v-app-bar app>
                <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
                <v-toolbar-title>
                   FMAD
                </v-toolbar-title>

            </v-app-bar>

            <v-main>
                <div class="navation-title-box" v-if="nfTitle || nsTitle">
                    <div class="navation-title">
                        {{nsTitle}}
                    </div>
                    <div class="navation-sub-title" v-if="nfTitle">
                        <span class="main-navi">{{nfTitle}}</span>
                        <i class="arrow fas fa-angle-right" v-if="middleTitle"></i>
                        <span v-if="middleTitle" class="sub-navi">{{middleTitle}}</span>
                        <i class="arrow fas fa-angle-right"></i>
                        <span class="sub-navi">{{nsTitle}}</span>
                    </div>
                </div>
                <div class="content-container">
                    <router-view/>
                </div>
            </v-main>
        </div>
        <div v-else>
            <Login @loginResult="setLogin"></Login>
        </div>
    </v-app>
</template>

<script>
	import Login from './login'
	import AUTH from '../../api/auth'
	import apiService from '../../api/apiService'
	import {ADMIN_MENU} from '../../config/adminMenu'
	import {
		API_URL_MEMBER_ADMIN_ALLGETCONFIG,
		API_URL_BOARD_ADMIN_GETBOARDLIST,
		CONFIG_HEADER_POST,
	} from '../../api/urls';

	export default {
		components: {
			Login
		},
		data: () => ({
			menus: [],
			nfTitle: '',
			nsTitle: '',
			mainNaviIcon: '',
			drawer: null,
			isLogin: false,
			messageShow: false,
			sessionId: '',
			userMessageList: [],
			message: {},
			jsonRpcClientWs: null,
			ws_uri: '',
			connected: false,
			socketInitCall: null,
			noticeColor: '#ccc',
			middleTitle: '',


		}),
		created() {
			AUTH.setDevice(false);
			let memberInfo = AUTH.getSession(false);
			this.$eventBus.$on('boardUpdate', this.menuUpdate);
			if (memberInfo.uid && memberInfo.uid=='admin') {
				this.isLogin = true;
				//this.$router.push('/admin/member/list')
				this.setConfig();
			}

		},
		methods: {
			setLogin() {
				this.isLogin = true;
				this.setConfig();
			},
			setConfig() {
				const frm = new FormData()
				apiService.post(API_URL_MEMBER_ADMIN_ALLGETCONFIG, frm, (res) => {
					this.menus = [];
					let boards = [];
					if (res.info) boards = res.info.boards;
					for (let menu of ADMIN_MENU) {
						let selectedSubMenu = '';
						switch (menu.id) {
							case 'board':
								selectedSubMenu = menu.subMenus[menu.subMenus.length - 1];
								if (!selectedSubMenu.icon) continue;
								selectedSubMenu.subList = [];
								if (boards.length > 0) {
									for (let board of boards) {
										let subMenus = {name: board.name, url: '/admin/boardArticle/' + board.bid};
										selectedSubMenu.subList.push(subMenus)
									}
								} else {
									//let subMenus = {name: '게시판 미셍성', url: 'none'};
									//selectedSubMenu.subList.push(subMenus)
								}
								break;

						}
						this.menus.push(menu);
					}
					this.setActive();

				});

			},
			menuUpdate() {
				const frm = new FormData()
				this.$http.post(API_URL_BOARD_ADMIN_GETBOARDLIST, frm, {headers: CONFIG_HEADER_POST}).then(res => {

					let boards = res.data.list;
					for (let menu of ADMIN_MENU) {
						if (menu.id == 'isboard') {
							menu.subMenus = [];
							for (let board of boards) {
								let subMenus = {name: board.name, url: '/admin/boardArticle/' + board.bid};
								menu.subMenus.push(subMenus)
							}
						}

					}
				});
			},
			menuToggle(index) {
				let k = 0;
				for (let menu of ADMIN_MENU) {
					if (index == k) {
						if (menu.view) menu.view = false;
						else menu.view = true;
					} else {
						if (menu.view) menu.view = false;
					}
					k++;
				}

			},
            setActive() {
	            let path = this.$route.path.split('/');
	            if(!path[2]) {
                    location.href='/admin/member/list';
                    return;
                } else if(path[3] || path[2] == 'boardList') {
		            let url = '';
	            	if(path[2] == 'boardList') {
			            url = '/admin/' + path[2]
		           } else {
			            url = '/admin/' + path[2] + '/' + path[3]
		            }
		            if(path[2] == 'boardList' || path[2] == 'boardRegist' || path[2] == 'boardArticle') {
	                    path[2] = 'board';
                    }
                    let mainItem = {};
	            	let item = {};
	            	let boardArticleListFlag = false;
	            	let lastItem = {};
		            for (let menuItem of this.menus) {
			            if (menuItem.id == path[2]) {
				            menuItem.view = true;
				            mainItem = menuItem;
				            if (menuItem.subMenus) {
					            for (let subMenuItem of menuItem.subMenus) {
						            if (url == subMenuItem.url) {
						            	subMenuItem.gclass = 'active';
							            item = subMenuItem;
						            } else {
						            	subMenuItem.gclass = '';
						            }
						            if (subMenuItem.subList) {
							            if(path[2] == 'board') {
								            for (let ltitem of subMenuItem.subList) {
								                if (ltitem.url == url) {
									                item = subMenuItem;
									                boardArticleListFlag = true;
									                lastItem = ltitem;
								                	ltitem.gclass = 'active';
								                } else {
								                    ltitem.gclass = '';
								                }
								            }
							            }
						            }

					            }
				            }
			            }
		            }

		            this.nfTitle = mainItem.name;

		            if(boardArticleListFlag) {
			            this.nsTitle = lastItem.name;
			            this.middleTitle = item.name;
                    } else {
			            this.nsTitle = item.name;
			            this.middleTitle = '';
		            }

		            this.mainNaviIcon = mainItem.icon;


	            }
            },
			goPage(mainItem, item) {
				if (item.url == 'none') return;
				this.nfTitle = mainItem.name;
				this.nsTitle = item.name;
				this.middleTitle = '';
				this.mainNaviIcon = mainItem.icon;

				for(let menuItem of this.menus) {
					if(menuItem.subMenus) {
						for(let subMenuItem of menuItem.subMenus) {
							if(item.url == subMenuItem.url)subMenuItem.gclass = 'active';
							else subMenuItem.gclass = '';
							if (subMenuItem.subList) {
								for(let ltitem of subMenuItem.subList) {
									ltitem.gclass = '';
                                }
							}

                        }
                    }
                }

				this.$router.push(item.url);


			},
			goSubMenuPage(menu, subItem, lastItem) {
				this.nfTitle = menu.name;
				this.middleTitle = subItem.name;
				this.nsTitle = lastItem.name;
				this.mainNaviIcon = menu.icon;
				this.$router.push(lastItem.url);
				if (menu.id == 'board') {

					for(let menuItem of this.menus) {
						if(menuItem.subMenus) {
							for(let subMenuItem of menuItem.subMenus) {
								subMenuItem.gclass = '';
							}
						}
					}
					for(let litem of subItem.subList) {
						if(litem.url == lastItem.url)litem.gclass = 'active';
						else litem.gclass = '';
                    }
					this.$eventBus.$emit('articleListChange', lastItem.url);

				}

			},
			directPage(mainItem) {
				this.nfTitle = '';
				this.nsTitle = mainItem.name;
				this.mainNaviIcon = mainItem.icon;
				this.$router.push(mainItem.url);
			},
			logout() {
				AUTH.logout(false);
				this.isLogin = false;
			},
			getFormatDate(date) {
				let year = date.getFullYear();
				let month = (1 + date.getMonth());
				month = month >= 10 ? month : '0' + month;
				let day = date.getDate();
				day = day >= 10 ? day : '0' + day;
				let hour = date.getHours();
				hour = (hour >= 10) ? hour : '0' + hour;
				let min = date.getMinutes();
				min = (min >= 10) ? min : '0' + min;
				return year + '-' + month + '-' + day + ' ' + hour + ':' + min;
			}
		}
	}
</script>
<style lang="scss">
    .page-contents {
        background: #ffff;
        padding: 40px;
        -webkit-box-shadow: 0px 1px 6px 0px rgba(0, 0, 0, 0.2);
        -moz-box-shadow: 0px 1px 6px 0px rgba(0, 0, 0, 0.1);
        box-shadow: 0px 1px 6px 0px rgba(0, 0, 0, 0.2);
        border-radius: 10px;
        width: 100%;
        .regist-button {
            margin: -10px 0 10px 0;
            .reg-button {
                width: 160px;
                border-radius: 20px;
                height: 40px;
            }
        }
        .regist-button-bottom {
            margin: 10px 0 0 0;
            .reg-button {
                width: 160px;
                border-radius: 20px;
                height: 40px;
            }
        }
        .form-item {
            width: 100%;
            padding: 30px 30px 0 30px;
            -webkit-box-shadow: 1px 1px 5px 1px rgba(0, 0, 0, 0.3);
            -moz-box-shadow: 1px 1px 5px 1px rgba(0, 0, 0, 0.3);
            box-shadow: 1px 1px 5px 1px rgba(0, 0, 0, 0.3);
            background: #fff;
            margin-bottom: 30px;
            border-radius: 10px;
            .form-sub-box {
                border-top: solid 1px #777;
            }
        }
        .search-box {
            margin: 20px 0 10px 0;
            display: flex;
            position: relative;
            .date-box {
                width: 160px;
                margin: 0 5px 0 0;
                display: flex;
                i {
                    position: relative;
                    z-index: 10;
                    margin: 13px 0 0 -25px;
                }
            }
            .select-box {
                margin: 0 5px 0 30px;
                width: 150px;
            }
            .text-box {
                width: 350px;
                display: flex;
                i {
                    position: relative;
                    z-index: 10;
                    margin: 13px 0 0 -25px;
                }
            }
            .data-remove-box {
                position: absolute;
                display: flex;
                right: 0;
                .checkbox-box {
                    width: 60px;
                    border-radius: 20px 0 0 20px;
                    height: 37px;
                    border: solid 2px #F44336;
                    padding-left: 20px;

                }
                .remove-button {
                    width: 60px;
                    border-radius: 0 20px 20px 0;
                    height: 37px;
                    padding-right: 25px;

                }
            }

        }
        .data-info-box {
            height: 30px;
            display: flex;
            justify-content: space-between;
            .total {
                font-size: 10pt;
                font-weight: bold;
                margin-right: 30px;
            }
            .select-box {
                width: 160px;
                display: flex;
                font-size: 10pt;
                font-weight: bold;
                margin-top: -8px;
                span {
                    width: 150px;
                    display: inline-block;
                    margin-top: 8px;
                }
            }

        }
        .list-table {
            border-spacing: 0;
            border-collapse: collapse;
            width: 100%;
            thead {
                th {
                    text-align: center;
                    background: #333;
                    padding: 10px 0;
                    color: #ffff;
                    font-size: 12pt;
                    &.sortBy {
                        cursor: pointer;
                        i {
                            font-size: 10pt;
                            color: #999;

                        }
                        .active {
                            i {
                                color: #fff;
                            }

                        }

                    }
                }

            }
            tbody {
                td {
                    border-bottom: solid 1px #dcdcdc;
                    text-align: center;
                    padding: 10px 0;
                    font-size: 11pt;
                    .modify-button {
                        border-radius: 20px;
                        min-width: 60px;
                    }
                }
            }
        }
        .empty-data {
            height: 150px;
            text-align: center;
            line-height: 150px;
            font-size: 10pt;
            color: #000;
            border-bottom: solid 1px #dcdcdc;
        }
        .submit-button-box {
            padding-top: 50px;
            text-align: right;
            .submit-button {

                width: 250px;
                min-height: 50px;
            }
        }
    }
</style>
<style lang="scss" scoped="true">

    .left-menu-header {
        width: 100%;
        height: 250px;
        background: #0088cc;
        .admin-info-box {
            width: 160px;
            padding-top: 50px;
            margin: auto;
            .photo {
                margin: auto;
                width: 130px;
                height: 130px;
                background: #fff;
                border-radius: 50%;
                text-align: center;
                line-height: 170px;
                i {
                    color: #0088cc;
                    font-size: 60pt;
                }
            }
            .text-button {
                width:110%;
                span {
                    cursor: pointer;
                    color: #fff;
                    margin-right: 5px;
                    &:last-child {
                        margin-right: 0;
                    }
                    &.dot {
                        cursor: default;
                    }
                }
            }
        }
    }

    .left-menu-content {
        background: #fafafa;
        padding: 20px 0;
        min-height: calc(100vh - 250px);
        .menu-box {
            padding: 0;
            margin: 0;
            .menu-title {
                margin: 17px 0 17px 20px;
                font-weight: bold;
                font-size: 12pt;
                cursor: pointer;
                position: relative;
                i.arrow {
                    position: absolute;
                    right: 20px;
                    top: 3px;
                }
                i.icon {
                    margin-right: 6px;
                }
            }
            .sub-menu-box-padding {
                .sub-menu-box {
                    padding: 0;
                    background: #f4f4f4;
                    margin: 0;
                    li {
                        color: #222;
                        font-size: 10pt;
                        padding: 0;
                        cursor: pointer;
                        position: relative;
                        font-weight: bold;
                        .sub-menu-item {
                            padding: 10px 0 10px 30px;
                            &.active {
                                color:#1976D2;
                            }
                        }
                        i {
                            color: #999;
                        }
                        i.arrow {
                            color: #222;
                            position: absolute;
                            right: 20px;
                            top: 14px;
                            font-size: 11pt;

                        }
                        &:last-child {
                            padding-bottom: 20px;
                            border-bottom: solid 1px #dcdcdc;
                            i.arrow {
                                top: 14px;
                            }
                        }

                        &:first-child {
                            border-top: solid 1px #dcdcdc;
                            padding-top: 20px;
                            i.arrow {
                                top: 31px;
                            }
                        }
                        .empty-sub-menu {
                            color: #000;
                            i {
                                color: #D81B60;
                                margin-right: 10px;
                            }
                        }
                        .sub-child-box {
                            margin: 5px 10px;
                            padding: 0;
                            background: #f1f1f1;
                            -webkit-box-shadow: 0px 1px 6px 0px rgba(0, 0, 0, 0.2);
                            -moz-box-shadow: 0px 1px 6px 0px rgba(0, 0, 0, 0.1);
                            box-shadow: 0px 1px 6px 0px rgba(0, 0, 0, 0.2);
                            border-radius: 10px;
                            .sub-child-menu {
                                font-weight: normal;
                                padding: 9px 0 9px 20px;
                                position: relative;
                                border-bottom: solid 1px #ccc;
                                border-left: solid 1px #ccc;
                                border-right: solid 1px #ccc;
                                position: relative;
                                .sub-arrow {
                                    position: absolute;
                                    right: 10px;
                                    top: 10px;

                                }
                                &.active {
                                    color:#1976D2;
                                }
                                &:last-child {
                                    border-bottom: none;
                                    border-radius: 0 0 10px 10px;

                                }
                                &.sub-parent-menu {
                                    border-radius: 10px 10px 0 0;
                                    font-weight: bold;
                                    background: #000;
                                    border-top: solid 1px #000;
                                    border-left: solid 1px #000;
                                    border-right: solid 1px #000;
                                    color: #fff;
                                    .sub-icon {
                                        color: #fff;
                                        font-size: 12pt;
                                        margin-right: 5px;
                                    }
                                }
                            }

                        }

                    }
                }
            }
        }
    }

    .navation-title-box {
        height: auto;
        padding: 20px 0 20px 40px;
        background: #fff;
        border-bottom: solid 1px #dcdcdc;

        .navation-title {
            font-size: 14pt;
            margin: 0 10px;
            color: #000;
            font-weight: bold;

        }
        .navation-sub-title {
            font-size: 10pt;
            color: #999;
            margin-top: 5px;
            .main-navi {
                margin: 0 10px;
                color: #3F86FC;

            }
            i.arrow {
                margin-right: 10px;
            }
            .sub-navi {

            }

        }
    }

    .content-container {
        padding: 20px;
        background: #fafafa;
        min-height: calc(100vh - 65px);

    }

    .fa-user-lock {
        cursor: pointer;
        margin: 0;
        font-size: 15pt;
        position: relative;
        top: 3px;
        color: #000;

    }

</style>
