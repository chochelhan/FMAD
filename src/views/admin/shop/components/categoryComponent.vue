<template>
    <div>
        <div class="form-box">
            <form novalidate @submit.prevent="validate">
                <ul class="menu-box">
                    <li class="menu-item">
                        <div class="sub-title">
                            1차 카테고리
                            <v-btn
                                class="reg-button"
                                color="primary"
                                type="button"
                                rounded
                                @click="createMenu()"
                                outlined>
                                1차 카테고리 생성
                            </v-btn>
                        </div>

                        <v-expansion-panels
                            v-model="menuPanel"
                            focusable>
                            <draggable v-model="menuList" style="width:100%;">

                                <v-expansion-panel
                                    v-for="(item,index) in menuList"
                                    :key="index"

                                >
                                    <v-expansion-panel-header>
                                        {{item.name}}
                                    </v-expansion-panel-header>
                                    <v-expansion-panel-content>

                                        <ul class="menu-ul">
                                            <li class="menu-li">
                                                <div class="menu-li-item">
                                                    <div class="text-box wide">
                                                        <v-text-field
                                                            v-model="item.name"
                                                            label="1차 카테고리명"
                                                            outlined
                                                            dense
                                                            :error-messages="item.nameErrors"
                                                            @input="nameTouch('menu',index)"
                                                            @blur="nameTouch('menu',index)"
                                                        ></v-text-field>
                                                    </div>
                                                    <!--div class="menu-code">
                                                        {{item.code}}
                                                    </div-->
                                                </div>
                                            </li>
                                            <li class="menu-li">
                                                <div class="menu-li-item">
                                                    <div class="text-box checkbox">
                                                        <v-checkbox class="item-required"
                                                                    v-model="item.view"
                                                                    label="카테고리 표시"
                                                                    value="yes"
                                                                    color="primary"
                                                        ></v-checkbox>
                                                    </div>
                                                    <div class="menu-button">

                                                        <v-btn
                                                            class="upd-button"
                                                            color="pink"
                                                            type="button"
                                                            rounded
                                                            @click="menuDelete('menu',index)"
                                                            outlined>
                                                            삭제
                                                        </v-btn>
                                                    </div>
                                                </div>
                                            </li>
                                        </ul>
                                    </v-expansion-panel-content>
                                </v-expansion-panel>
                            </draggable>
                        </v-expansion-panels>

                    </li>
                    <li class="menu-item">
                        <div class="sub-title">2차 카테고리
                            <v-btn
                                class="reg-button"
                                color="primary"
                                type="button"
                                rounded
                                @click="createSubMenu()"
                                outlined>
                                2차 카테고리 생성
                            </v-btn>
                        </div>
                        <v-expansion-panels
                            v-model="subMenuPanel"
                            focusable>
                            <draggable v-model="subMenuList" style="width:100%;">
                                <v-expansion-panel
                                    v-for="(item,index) in subMenuList"
                                    :key="index"
                                >
                                    <v-expansion-panel-header>
                                        {{item.name}}
                                    </v-expansion-panel-header>
                                    <v-expansion-panel-content>

                                        <ul class="menu-ul">
                                            <li class="menu-li">
                                                <div class="menu-li-item">
                                                    <div class="text-box wide">
                                                        <v-text-field
                                                            v-model="item.name"
                                                            label="2차 카테고리명"
                                                            outlined
                                                            dense
                                                            :error-messages="item.nameErrors"
                                                            @input="nameTouch('sub',index)"
                                                            @blur="nameTouch('sub',index)"
                                                        ></v-text-field>
                                                    </div>
                                                    <!--div class="menu-code">
                                                        {{item.code}}
                                                    </div-->
                                                </div>
                                            </li>
                                            <li class="menu-li">
                                                <div class="menu-li-item">
                                                    <div class="text-box checkbox">
                                                        <v-checkbox class="item-required"
                                                                    v-model="item.view"
                                                                    label="카테고리 표시"
                                                                    value="yes"
                                                                    color="primary"
                                                        ></v-checkbox>
                                                    </div>
                                                    <div class="menu-button">

                                                        <v-btn
                                                            class="upd-button"
                                                            color="pink"
                                                            type="button"
                                                            rounded
                                                            @click="menuDelete('sub',index)"
                                                            outlined>
                                                            삭제
                                                        </v-btn>
                                                    </div>
                                                </div>
                                            </li>

                                        </ul>
                                    </v-expansion-panel-content>
                                </v-expansion-panel>
                            </draggable>

                        </v-expansion-panels>
                    </li>
                    <li class="menu-item">
                        <div class="sub-title">
                            3차 카테고리
                            <v-btn
                                class="reg-button"
                                color="primary"
                                type="button"
                                rounded
                                @click="createLastMenu()"
                                outlined>
                                3차 카테고리 생성
                            </v-btn>
                        </div>
                        <v-expansion-panels
                            v-model="lastMenuPanel"
                            focusable>
                            <draggable v-model="lastMenuList" style="width:100%;">
                                <v-expansion-panel
                                    v-for="(item,index) in lastMenuList"
                                    :key="index"
                                >
                                    <v-expansion-panel-header>
                                        {{item.name}}
                                    </v-expansion-panel-header>
                                    <v-expansion-panel-content>

                                        <ul class="menu-ul">
                                            <li class="menu-li">
                                                <div class="menu-li-item">
                                                    <div class="text-box wide">
                                                        <v-text-field
                                                            v-model="item.name"
                                                            label="3차 카테고리명"
                                                            outlined
                                                            dense
                                                            :error-messages="item.nameErrors"
                                                            @input="nameTouch('last',index)"
                                                            @blur="nameTouch('last',index)"
                                                        ></v-text-field>
                                                    </div>
                                                    <!--div class="menu-code">
                                                        {{item.code}}
                                                    </div-->
                                                </div>
                                            </li>
                                            <li class="menu-li">
                                                <div class="menu-li-item">
                                                    <div class="text-box checkbox">
                                                        <v-checkbox class="item-required"
                                                                    v-model="item.view"
                                                                    label="카테고리 표시"
                                                                    value="yes"
                                                                    color="primary"
                                                        ></v-checkbox>
                                                    </div>
                                                    <div class="menu-button">

                                                        <v-btn
                                                            class="upd-button"
                                                            color="pink"
                                                            type="button"
                                                            rounded
                                                            @click="menuDelete('last',index)"
                                                            outlined>
                                                            삭제
                                                        </v-btn>
                                                    </div>
                                                </div>
                                            </li>
                                        </ul>
                                    </v-expansion-panel-content>
                                </v-expansion-panel>
                            </draggable>

                        </v-expansion-panels>
                    </li>

                </ul>

                <div class="submit-button-box">
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
	import {
		API_URL_SHOP_CATEGORY_ADMIN_UPDATE,
		API_URL_SHOP_CATEGORY_ADMIN_INFO
	} from '../../../../api/urls';
	import apiService from '../../../../api/apiService';
	import draggable from "vuedraggable";

	export default {
		name: 'shopCategoryComponent',
        components: {
			draggable,
		},
		watch: {
			menuPanel(val) {
				if (val == null) {
					return;
				}
				let check = val.toString();
				if (!check) {
					return;
				}
				if (this.menuCreateProc) {
					this.menuCreateProc = false;
					return
				}
				this.subMenuPanel = '';
				this.subMenuList = [];
				for (let item of this.menuList[val].subMenus) {
					this.subMenuList.push(item);
				}
				this.lastMenuList = [];
			},
			subMenuPanel(val) {
				if (val == null) {
					return;
				}
				let check = val.toString();
				if (!check) {
					return;
				}
				if (this.subMenuCreateProc) {
					this.subMenuCreateProc = false;
					return
				}
				this.lastMenuList = [];
				for (let item of this.menuList[this.menuPanel].subMenus[val].subMenus) {
					this.lastMenuList.push(item);
				}
			},
		},
		data() {
			return {
				menuList: [],
				subMenuList: [],
				lastMenuList: [],
				menuPanel: '',
				subMenuPanel: '',
				lastMenuPanel: '',
				menuCreateProc: false,
				subMenuCreateProc: false,
				insertFlag: false,
				sendData: {},
                no:'',

			}
		},
		created() {
			this.getData();
		},
		methods: {
			getData() {

				const frm = new FormData()
				apiService.post(API_URL_SHOP_CATEGORY_ADMIN_INFO, frm, (res) => {
					if(res.categoryInfo) {
						this.menuList = res.categoryInfo.categorys;

					}
				});

			},
			nameTouch(code, index) {
				switch (code) {
					case 'menu':
						this.menuList[index].nameErrors = [];
						if (!this.menuList[index].name) {
							this.menuList[index].nameErrors.push('1차카테고리명을 입력하세요');
						}
						break;
					case 'sub':
						this.subMenuList[index].nameErrors = [];
						if (!this.subMenuList[index].name) {
							this.subMenuList[index].nameErrors.push('2차카테고리명을 입력하세요');
						}
						break;
					case 'last':
						this.lastMenuList[index].nameErrors = [];
						if (!this.lastMenuList[index].name) {
							this.lastMenuList[index].nameErrors.push('3차카테고리명을 입력하세요');
						}
						break;
				}

			},

			createMenu() {
				this.menuCreateProc = true;
				let item = {
					name: '',
					code: this.getMenuCode('menu'),
					view: 'yes',
					nameErrors: [],
					subMenus: [],
				}

				this.menuList.push(item)
				this.menuPanel = parseInt(this.menuList.length - 1);
				this.subMenuList = [];
				this.lastMenuList = [];

			},
			getMenuCode(type) {
				let codeText = '';
				let menuList = [];
				switch (type) {
					case 'menu':
						codeText = 'mnu';
						menuList = this.menuList
						break;
					case 'sub':
						codeText = 'smnu';
						menuList = this.subMenuList
						break;
					case 'last':
						codeText = 'lmnu';
						menuList = this.lastMenuList
						break;

				}
				let code = codeText + (Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000);
				for (let item of menuList) {
					if (item.code == code) {
						code = this.getMenuCode(type);
					}
				}
				return code;
			},
			menuDelete(type, index) {
				let params = {
					type: 'confirm',
					message: '선택된 카테고리를 삭제하시겠습니까?',
					doAction: () => {
						this.doMenuDelete(type, index);
					}
				};
				this.$eventBus.$emit('modalOpen', params);

			},
			doMenuDelete(type, index) {
				switch (type) {
					case 'menu':
						this.menuPanel = '';
						this.subMenuPanel = '';
						this.lastMenuPanel = '';
						this.menuList.splice(index, 1)
						this.subMenuList = []
						this.lastMenuList = []
						break;
					case 'sub':


						this.subMenuPanel = '';
						this.lastMenuPanel = '';
						this.subMenuList.splice(index, 1)
						this.menuList[this.menuPanel].subMenus.splice(index, 1)
						this.lastMenuList = []
						break;
					case 'last':
						this.lastMenuPanel = '';
						this.lastMenuList.splice(index, 1)
						this.menuList[this.menuPanel].subMenus[this.subMenuPanel].subMenus.splice(index, 1)

						break;
				}
			},
			createSubMenu() {
				let check = this.menuPanel.toString();
				if (!check) {
					let params = {
						message: '1차카테고리를 선택하세요',
					};
					this.$eventBus.$emit('modalOpen', params);
					return;
				}
				if (!this.menuList[this.menuPanel].name) {
					let params = {
						message: '1차카테고리명을 입력하세요',
					};
					this.$eventBus.$emit('modalOpen', params);
					return;
				}
				this.subMenuCreateProc = true;
				let item = {
					name: '',
					code: this.getMenuCode('sub'),
					view: 'yes',
					nameErrors: [],
					subMenus: [],
				}

				this.subMenuList.push(item)
				this.subMenuPanel = parseInt(this.subMenuList.length - 1);

				this.menuList[this.menuPanel].subMenus.push(item);
				this.lastMenuList = [];

			},
			createLastMenu() {
				let check = this.subMenuPanel.toString();
				if (!check) {
					let params = {
						message: '2차카테고리를 선택하세요',
					};
					this.$eventBus.$emit('modalOpen', params);
					return;
				}
				if (!this.subMenuList[this.subMenuPanel].name) {
					let params = {
						message: '2차카테고리명을 입력하세요',
					};
					this.$eventBus.$emit('modalOpen', params);
					return;
				}
				let item = {
					name: '',
					code: this.getMenuCode('last'),
					view: 'yes',
					nameErrors: [],

				}

				this.lastMenuList.push(item)
				this.lastMenuPanel = parseInt(this.lastMenuList.length - 1);
				this.menuList[this.menuPanel].subMenus[this.subMenuPanel].subMenus.push(item);
			},
			validate() {
				if (this.insertFlag) return;
				if (this.menuList.length < 1) {
					let params = {
						message: '카테고리를 등록하세요',
					};
					this.$eventBus.$emit('modalOpen', params);
					return;

				}
				let index = 0;
				let insertAction = true;
				let checkSubIndex = '';
				let checkLastIndex = '';
				let checkType = '';
				for (let item of this.menuList) {
					if (!item.name) {
						this.nameTouch('menu', index);
						this.menuPanel = index;
						insertAction = false;
						checkType = 'menu'
						break;
					}
					if (item.subMenus.length > 0) {
						let subIndex = 0;
						for (let subItem of item.subMenus) {
							if (!subItem.name) {
								this.menuPanel = index;
								checkSubIndex = subIndex;
								insertAction = false;
								checkType = 'sub'
								break;
							}
							if (subItem.subMenus.length > 0) {
								let lastIndex = 0;
								for (let lastItem of subItem.subMenus) {
									if (!lastItem.name) {
										this.menuPanel = index;
										checkSubIndex = subIndex;
										checkLastIndex = lastIndex;
										checkType = 'last'
										insertAction = false;
										break;
									}
									lastIndex++;
								}
							}
							subIndex++;
						}
					}
					index++;
				}
				if (!insertAction) {
					if (checkType != 'menu') {
						setTimeout(() => {
							this.subMenuPanel = checkSubIndex;
							if (checkType == 'last') {
								setTimeout(() => {
									this.lastMenuPanel = checkLastIndex;
									this.nameTouch('last', checkLastIndex);

								}, 100)
							} else {
								this.nameTouch('sub', checkSubIndex);
							}

						}, 100);

					}

					return;
				}
				const frm = new FormData()
				frm.append('categorys', JSON.stringify(this.menuList))

				this.$eventBus.$emit('overlay', 'open');
				this.insertFlag = true;
				apiService.post(API_URL_SHOP_CATEGORY_ADMIN_UPDATE, frm, (res) => {
					this.$eventBus.$emit('overlay', 'hide');
					this.insertFlag = false;
					let params = {
						message: '카테고리가 등록되었습니다',
					};
					this.$eventBus.$emit('modalOpen', params);
					return;
				});
			}
		}

	}
</script>

<style lang="scss" scoped="true">
    .form-box {
        padding: 0;
        width: 100%;
        margin: 0;
        .sub-title {
            font-weight: bold;
            font-size: 11pt;
            text-align: left;
            padding: 20px 0 20px 0;
            position: relative;
            .reg-button {
                position: absolute;
                right: 0;
                bottom: 12px;
            }
        }
    }

    .submit-button-box {
        padding-top: 80px;
    }

    .menu-box {
        display: flex;
        justify-content: space-between;
        padding: 0;
        .menu-item {
            width: 32%;
            border: solid 1px #dcdcdc;
            padding: 0 20px 20px 20px;
            background: #fafafa;
            border-radius: 10px;
            .menu-ul {
                padding: 30px 0 0 0;
                .menu-li {
                    padding: 0;
                    .menu-li-item {
                        display: flex;
                        justify-content: space-between;
                        margin: 0;
                        max-height: 50px;
                        &.divide-line {
                            border-top: solid 1px #ccc;
                            padding-top: 20px;
                            max-height: 200px;
                        }
                        .page-edit-button {
                            width: 100%;
                            height: 50px;
                            color: #fff;
                        }
                        .text-box {
                            &.checkbox {
                                margin-top: -10px;
                            }
                            &.wide {
                                width: 100%;
                            }
                        }
                        .menu-code {
                            padding-top: 10px;
                            font-weight: bold;
                            color: #000;
                        }
                        .menu-button {

                        }
                        .switch-title {
                            font-size: 11pt;
                            padding-top: 10px;
                        }
                        .switch-button {
                            margin-top: -10px;
                        }
                        .select-box {
                            width: 100%;
                            &.double {
                                width: 48%;
                            }
                        }
                    }
                }
            }

        }
    }


</style>