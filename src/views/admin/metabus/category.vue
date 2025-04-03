<template>
    <div class="page-contents">
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
                                                            :readonly="item.readonly"
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
                                                    <div class="text-box wide">
                                                        <v-text-field
                                                            v-model="item.code"
                                                            label="1차 카테고리 코드"
                                                            outlined
                                                            :readonly="item.readonly"
                                                            dense
                                                            :error-messages="item.codeErrors"
                                                            @input="codeTouch('menu',index)"
                                                            @blur="codeTouch('menu',index)"
                                                        ></v-text-field>
                                                    </div>

                                                </div>
                                            </li>
                                            <li class="menu-li" v-if="!item.readonly">
                                                <div class="menu-button">

                                                    <v-btn
                                                        class="upd-button"
                                                        color="pink"
                                                        type="button"
                                                        rounded
                                                        style="width:100%;"
                                                        @click="menuDelete('menu',index)"
                                                        outlined>
                                                        삭제
                                                    </v-btn>
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
                                                            :readonly="item.readonly"
                                                            :error-messages="item.nameErrors"
                                                            @input="nameTouch('sub',index)"
                                                            @blur="nameTouch('sub',index)"
                                                        ></v-text-field>
                                                    </div>
                                                </div>
                                            </li>
                                            <li class="menu-li">
                                                <div class="menu-li-item">
                                                    <div class="text-box wide">
                                                        <v-text-field
                                                            v-model="item.code"
                                                            label="2차 카테고리 코드"
                                                            outlined
                                                            dense
                                                            :readonly="item.readonly"
                                                            :error-messages="item.codeErrors"
                                                            @input="codeTouch('sub',index)"
                                                            @blur="codeTouch('sub',index)"
                                                        ></v-text-field>
                                                    </div>
                                                </div>
                                            </li>
                                            <li class="menu-li"  v-if="!item.readonly">
                                                <div class="menu-button">

                                                    <v-btn
                                                        class="upd-button"
                                                        color="pink"
                                                        type="button"
                                                        style="width:100%;"
                                                        rounded
                                                        @click="menuDelete('sub',index)"
                                                        outlined>
                                                        삭제
                                                    </v-btn>
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
		API_URL_METABUS_CATEGORY_ADMIN_UPDATE,
		API_URL_METABUS_CATEGORY_ADMIN_INFO
	} from '../../../api/urls';
	import apiService from '../../../api/apiService';
	import draggable from "vuedraggable";

	export default {
		name: 'metabusCategory',
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
			},
		},
		data() {
			return {
				menuList: [],
				subMenuList: [],
				menuPanel: '',
				subMenuPanel: '',
				menuCreateProc: false,
				subMenuCreateProc: false,
				insertFlag: false,
				sendData: {},
				codeDouble:false,
				no: '',
				codeBad:false,

			}
		},
		created() {
			this.getData();
		},
		methods: {
			getData() {

				const frm = new FormData()
				apiService.post(API_URL_METABUS_CATEGORY_ADMIN_INFO, frm, (res) => {
					if (res.categoryInfo) {
						this.menuList = [];
                        for(let menu of res.categoryInfo.categorys) {
                        	if(menu.code=='home' || menu.code=='character' || menu.code=='furniture' || menu.code=='world'  || menu.code=='clutter')menu.readonly = true;
                        	else menu.readonly = false;
                        	for(let sub of menu.subMenus) {
                                if(sub.code=='man' || sub.code=='woman' || sub.code=='normal' || sub.code=='inf'  || sub.code=='starcity'  || sub.code=='village') {
                                	sub.readonly = true;
                                } else	sub.readonly = false;
                            }
                        	this.menuList.push(menu);

                        }
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

				}

			},
			codeTouch(code, index) {
				let k=0;
				let check = /[~!@#$%^&*()_+|<>?:{}]/;
				let checkKor = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/;
				switch (code) {
					case 'menu':
						this.menuList[index].codeErrors = [];
						if (!this.menuList[index].code) {
							this.menuList[index].codeErrors.push('1차카테고리코드을 입력하세요');
						} else {
							if(check.test(this.menuList[index].code)) {
								this.menuList[index].codeErrors.push('코드는 영문 또는 수자만 입력가능합니다');
								this.codeBad = true;
							} else if(checkKor.test(this.menuList[index].code)) {
								this.menuList[index].codeErrors.push('코드는 영문 또는 수자만 입력가능합니다');
								this.codeBad = true;
							} else {
								this.codeBad = false;
                            }
                        }
						for(let menu of this.menuList) {
							if(index != k) {
								if (menu.code == this.menuList[index].code) {
									this.menuList[index].codeErrors.push('중복된 카테고리코드 입니다');
									this.codeDouble = true;
								} else {
									this.codeDouble = false;
								}
							}
                            k++;
                        }

						break;
					case 'sub':
						this.subMenuList[index].codeErrors = [];
						if (!this.subMenuList[index].code) {
							this.subMenuList[index].codeErrors.push('2차카테고리코드를 입력하세요');
						} else {
							if(check.test(this.subMenuList[index].code)) {
								this.subMenuList[index].codeErrors.push('코드는 영문 또는 수자만 입력가능합니다');
								this.codeBad = true;
							} else if(checkKor.test(this.subMenuList[index].code)) {
								this.subMenuList[index].codeErrors.push('코드는 영문 또는 수자만 입력가능합니다');
								this.codeBad = true;
							} else {
								this.codeBad = false;
							}
						}
						for(let menu of this.subMenuList) {
							if(index != k) {
								if (menu.code == this.subMenuList[index].code) {
									this.subMenuList[index].codeErrors.push('중복된 카테고리코드 입니다');
									this.codeDouble = true;
								} else {
									this.codeDouble = false;
								}
							}
							k++;
						}

						break;

				}

			},

			createMenu() {
				this.menuCreateProc = true;
				let item = {
					name: '',
					code:'',
					view: 'yes',
					nameErrors: [],
					codeErrors: [],
					subMenus: [],
					readonly:false,
				}

				this.menuList.push(item)
				this.menuPanel = parseInt(this.menuList.length - 1);
				this.subMenuList = [];


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
						break;
					case 'sub':


						this.subMenuPanel = '';
						this.lastMenuPanel = '';
						this.subMenuList.splice(index, 1)
						this.menuList[this.menuPanel].subMenus.splice(index, 1)
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
				if (!this.menuList[this.menuPanel].code) {
					let params = {
						message: '1차카테고리코드를 입력하세요',
					};
					this.$eventBus.$emit('modalOpen', params);
					return;
				}
				this.subMenuCreateProc = true;
				let item = {
					name: '',
					code: '',
					view: 'yes',
					nameErrors: [],
					codeErrors: [],
					readonly:false,
				}

				this.subMenuList.push(item)
				this.subMenuPanel = parseInt(this.subMenuList.length - 1);
				this.menuList[this.menuPanel].subMenus.push(item);


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

				if (this.codeDouble) {
					let params = {
						message: '중복된 카테고리 코드가 존재합니다',
					};
					this.$eventBus.$emit('modalOpen', params);
					return;

				}
                if(this.codeBad) {
	                let params = {
		                message: '잘못된 형식의 카테고리 코드가 존재합니다',
	                };
	                this.$eventBus.$emit('modalOpen', params);
	                return;
                }
				let index = 0;
				let insertAction = true;
				let checkSubIndex = '';
				let checkType = '';
				for (let item of this.menuList) {
					if (!item.name) {
						this.nameTouch('menu', index);
						this.menuPanel = index;
						insertAction = false;
						checkType = 'menu'
						break;
					}
					if (!item.code) {
						this.codeTouch('menu', index);
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
							if (!subItem.code) {
								this.menuPanel = index;
								checkSubIndex = subIndex;
								insertAction = false;
								checkType = 'sub'
								break;
							}
							subIndex++;
						}
					}
					index++;
				}
				if (!insertAction) {
					if (checkType == 'sub') {
						setTimeout(() => {
							this.subMenuPanel = checkSubIndex;
							this.nameTouch('sub', checkSubIndex);
							this.codeTouch('sub', checkSubIndex);

						}, 100);

					}
					return;
				}
				const frm = new FormData()
				frm.append('categorys', JSON.stringify(this.menuList))

				this.$eventBus.$emit('overlay', 'open');
				this.insertFlag = true;
				apiService.post(API_URL_METABUS_CATEGORY_ADMIN_UPDATE, frm, (res) => {
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
        width: 800px;
        margin: 50px auto 0 auto;
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
        text-align: right;
        .submit-button {
            width: 200px;
            height: 50px;
        }
    }

    .menu-box {
        display: flex;
        justify-content: space-between;
        padding: 0;
        .menu-item {
            width: 48%;
            border: solid 1px #dcdcdc;
            background:#f4f4f4;
            padding: 0 20px 20px 20px;
            border-radius: 10px;
            .menu-ul {
                padding: 30px 0 0 0;
                .menu-li {
                    padding: 0 0 15px 0;
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
                            width: 100%;
                            .upd-button {
                                width: 100%;
                            }
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