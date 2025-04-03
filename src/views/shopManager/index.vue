<template>
    <v-app id="inspire">
        <div v-if="isLogin">
            <v-navigation-drawer
                v-model="drawer"
                app
            >
                <div class="left-menu-header">
                    <span @click="logout()">로그아웃</span>
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
                            <ul class="sub-menu-box" v-if="menu.view">
                                <li v-for="subItem in menu.subMenus">
                                    <div class="sub-child-box" v-if="subItem.icon">
                                        <div class="sub-child-menu sub-parent-menu">
                                            <i :class="'sub-icon '+subItem.icon"></i>
                                            {{subItem.name}}
                                        </div>
                                        <div v-for="lastItem in subItem.subList" class="sub-child-menu"
                                             @click="goSubMenuPage(menu, subItem,lastItem)">
                                            <i class="far fa-dot-circle" style="margin-right:2px;"></i>
                                            {{lastItem.name}}
                                            <i class="sub-arrow fas fa-angle-right"></i>
                                        </div>

                                    </div>
                                    <div class="sub-menu-item" v-else-if="subItem.url!='none'"
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
                        </v-expand-transition>
                    </div>
                </div>
            </v-navigation-drawer>

            <v-app-bar app>
                <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
                <v-toolbar-title>Application</v-toolbar-title>

                <div class="notice-list">
                </div>
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
            <shopManagerLogin @loginResult="setLogin"></shopManagerLogin>
        </div>
    </v-app>
</template>

<script>
	import shopManagerLogin from './login'
	import AUTH from '../../api/auth'
	import {shopManagerMenu} from '../../config/shopManagerMenu'
	import {
		API_URL_MEMBER_SHOP_MANAGER_LOGINCHECK,
	} from '../../api/urls';
	import apiService from '../../api/apiService';


	export default {
		components: {
			shopManagerLogin
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
			middleTitle: '',


		}),
		created() {
			AUTH.setDevice(false);
			let memberInfo = AUTH.getSession(false);
			if (memberInfo.uid) {
				this.isLogin = true;
				this.setConfig();
			}

		},
		methods: {
			setLogin() {
				this.isLogin = true;
				this.setConfig();
			},
			setConfig() {
				apiService.post(API_URL_MEMBER_SHOP_MANAGER_LOGINCHECK, {},(res) => {
					for (let menu of shopManagerMenu) {
						this.menus.push(menu);
					}

				});

			},
			menuToggle(index) {
				let k = 0;
				for (let menu of shopManagerMenu) {
					if (index == k) {
						if (menu.view) menu.view = false;
						else menu.view = true;
					} else {
						if (menu.view) menu.view = false;
					}
					k++;
				}

			},
			goPage(mainItem, item) {
				if (item.url == 'none') return;
				this.nfTitle = mainItem.name;
				this.nsTitle = item.name;
				this.middleTitle = '';
				this.mainNaviIcon = mainItem.icon;
				this.$router.push(item.url);


			},
			goSubMenuPage(menu, subItem, lastItem) {
				this.nfTitle = menu.name;
				this.middleTitle = subItem.name;
				this.nsTitle = lastItem.name;
				this.mainNaviIcon = menu.icon;
				this.$router.push(lastItem.url);
				if (menu.id == 'board') {
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
        height: 200px;
        background: #0088cc;
    }

    .left-menu-content {
        background: #fafafa;
        padding: 20px 0;
        min-height: calc(100vh - 200px);
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

                    }
                    i {
                        color: #999;
                    }
                    i.arrow {
                        color: #222;
                        position: absolute;
                        right: 20px;
                        top: 15px;
                        font-size: 11pt;

                    }
                    &:first-child {
                        border-top: solid 1px #dcdcdc;
                        padding-top: 20px;
                        i.arrow {
                            top: 24px;
                        }
                    }
                    &:last-child {
                        padding-bottom: 20px;
                        border-bottom: solid 1px #dcdcdc;
                        i.arrow {
                            top: 14px;
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

                            .sub-arrow {
                                position: absolute;
                                right: 10px;
                                top: 13px;

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

    .notice-list {
        position: absolute;
        .show-box {
            top: -14px;
            left: -40px;
            position: relative;
            i {
                font-size: 18pt;
                cursor: pointer;
            }
        }
        .list-table-layout {
            overflow: auto;
            height: calc(100vh - 100px);
            width: calc(100vw - 100px);
            position: absolute;
            z-index: 1000;
            display: flex;
            flex-wrap: wrap;
            padding: 20px;
            border-radius: 10px;
            right: -80px;
            background: #fff;
            -webkit-box-shadow: 0px 1px 6px 0px rgba(0, 0, 0, 0.2);
            -moz-box-shadow: 0px 1px 6px 0px rgba(0, 0, 0, 0.1);
            box-shadow: 0px 1px 6px 0px rgba(0, 0, 0, 0.2);

            .chat-container {
                position: relative;
                margin: 0 30px 30px 0;
                .chat-message {
                    width: 400px;
                    height: 500px;
                    -webkit-box-shadow: 1px 1px 9px -1px rgba(71, 70, 71, 0.3);
                    -moz-box-shadow: 1px 1px 9px -1px rgba(71, 70, 71, 0.3);
                    box-shadow: 1px 1px 9px -1px rgba(71, 70, 71, 0.3);
                    background: #fff;
                    border-radius: 10px;
                    .message-header {
                        background: #1E90FF;
                        color: #fff;
                        border-radius: 10px 10px 0 0;
                        height: 50px;
                        line-height: 50px;
                        text-align: center;
                        font-size: 12pt;
                        i {
                            position: absolute;
                            right: 10px;
                            top: 8px;
                            font-size: 12pt;
                            cursor: pointer;
                        }
                        &.alertbox {
                            background: #F23565;
                        }
                    }
                    .message-box {
                        background: #fafafa;
                        height: 388px;
                        overflow: auto;
                        position: relative;
                        .message-data {
                            .rdate {
                                font-size: 9pt;
                                &.admin {
                                    text-align: left;
                                    margin: 10px 0 3px 15px;

                                }
                                &.me {
                                    padding-left: 10px;
                                    text-align: right;
                                    margin: 10px 15px 3px 0;
                                }
                            }
                            span {
                                background: #fff;
                                margin: 0 10px 10px 10px;
                                padding: 10px;
                                border: solid 1px #dfdfdf;
                                border-radius: 8px;
                                width: auto;
                                min-width: 60%;
                                max-width: 95%;
                                &.admin {
                                    float: left;

                                }
                                &.me {
                                    float: right;
                                    text-align: right;
                                    background: #FF8080;
                                    color: #fff;

                                }
                            }
                        }
                    }
                    .message-input {
                        margin: 5px;
                        display: flex;
                        textarea {
                            border: solid 1px #dfdfdf;
                            width: 340px;
                            padding: 5px;
                            height: 50px;
                            border-radius: 7px 0 0 7px;
                        }
                        .send-button {
                            width: 60px;
                            height: 50px;
                            background: #1E90FF;
                            color: #fff;
                            border-radius: 0 7px 7px 0;
                        }
                    }
                }
            }
        }
    }

    .screen-layout {
        position: fixed;
        top: 0;
        left: 0;
        z-index: 1029;
        background: rgba(255, 255, 255, 0.1);
        width: calc(100vw);
        max-width: 100%;
        overflow: hidden;
        height: calc(100vh);
        .screen-content {
            width: 500px;
            max-height: 470px;
            -webkit-box-shadow: 1px 1px 9px -1px rgba(71, 70, 71, 0.53);
            -moz-box-shadow: 1px 1px 9px -1px rgba(71, 70, 71, 0.53);
            box-shadow: 1px 1px 9px -1px rgba(71, 70, 71, 0.53);
            border-radius: 10px;
            height: auto;
            background: #fff;
            margin: 0 0 0 -250px;
            padding: 0;
            position: absolute;
            left: 50%;
            top: 70px;
            .data-contents {
                padding: 20px;
                .msg-title {
                    padding-top: 0;
                    font-weight: bold;
                    font-size: 16pt;
                    color: #000;
                    span {
                        color: #333;
                        font-size: 12pt;
                        font-weight: normal;
                        padding-left: 15px;
                    }
                    .volume {
                        font-size: 17pt;
                        color: #999;
                        cursor: pointer;
                        padding: 2px 0 0 25px;
                    }
                }

                .msg-date {
                    padding: 15px 0;
                    color: #666;
                    font-size: 11pt;
                    font-weight: normal;

                }

                .msg-content {
                    line-height: 140%;
                    p {
                        line-height: 140%;
                    }
                    max-width: 100%;
                    overflow-y: auto;
                    overflow-x: hidden;
                    word-break: break-all;
                    height: 50px;
                }
            }
        }

    }
</style>