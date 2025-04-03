<template>
    <div class="page-contents">

        <div class="search-box">
            <div class="date-box">
                <v-menu
                    ref="stDatePicker"
                    v-model="stDatePicker"
                    :close-on-content-click="false"
                    :return-value.sync="stdate"
                    transition="scale-transition"
                    offset-y
                    min-width="auto"
                >
                    <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                            v-model="stdate"
                            label="등록일(시작)"
                            readonly
                            height="30"
                            v-bind="attrs"
                            outlined
                            dense
                            v-on="on"
                        ></v-text-field>
                    </template>
                    <v-date-picker
                        v-model="stdate"
                        scrollable
                    >
                        <v-spacer></v-spacer>
                        <v-btn
                            text
                            color="primary"
                            @click="stDatePicker = false"
                        >
                            취소
                        </v-btn>
                        <v-btn
                            text
                            color="primary"
                            @click="$refs.stDatePicker.save(stdate)"
                        >
                            확인
                        </v-btn>
                    </v-date-picker>
                </v-menu>
                <i class="far fa-calendar-alt"></i>
            </div>
            <div class="date-box">
                <v-menu
                    ref="enDatePicker"
                    v-model="enDatePicker"
                    :close-on-content-click="false"
                    :return-value.sync="endate"
                    transition="scale-transition"
                    offset-y
                    min-width="auto"
                >
                    <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                            v-model="endate"
                            label="등록일(종료)"
                            readonly
                            outlined
                            dense
                            v-bind="attrs"
                            v-on="on"
                        ></v-text-field>
                    </template>
                    <v-date-picker
                        v-model="endate"
                        scrollable
                    >
                        <v-spacer></v-spacer>
                        <v-btn
                            text
                            color="primary"
                            @click="enDatePicker = false"
                        >
                            취소
                        </v-btn>
                        <v-btn
                            text
                            color="primary"
                            @click="$refs.enDatePicker.save(endate)"
                        >
                            확인
                        </v-btn>
                    </v-date-picker>
                </v-menu>
                <i class="far fa-calendar-alt"></i>
            </div>
            <div class="select-box">
                <v-select
                    v-model="firstCategory"
                    :items="firstCategorys"
                    label="1차 카테고리"
                    outlined
                    dense
                ></v-select>
            </div>
            <div class="select-box" style="margin-left:0;margin-right:30px;">
                <v-select
                    v-model="secCategory"
                    :items="secCategorys"
                    label="2차 카테고리"
                    outlined
                    dense
                ></v-select>

            </div>
            <div class="text-box" style="width:200px;">
                <v-text-field
                    v-model="keyword"
                    label="아이템명"
                    outlined
                    dense
                ></v-text-field>
                <i class="fas fa-search"></i>
            </div>

            <div class="data-remove-box">
                <div class="checkbox-box">
                    <v-checkbox style="margin-top:0;"
                                v-model="checkboxAll"
                                color="red"
                                label=""
                    ></v-checkbox>
                </div>
                <v-btn
                    class="remove-button"
                    type="button"
                    depressed
                    color="red"
                    style="color:#FFF"
                    @click="deleteItem()"
                >
                    삭제
                </v-btn>

            </div>
        </div>
        <div>
            <div class="data-info-box">
                <div class="total">전체 : {{itemTotal}}</div>
                <div class="select-box">
                    <span>페이지당 목록수 </span>
                    <v-select
                        v-model="itemLimit"
                        :items="itemLimitList"
                        label=""
                        style="font-size:10pt;width:70px;"
                        dense
                    ></v-select>

                </div>
            </div>
            <table class="list-table">
                <thead>
                <tr>
                    <th style="width:50px">

                    </th>
                    <th style="width:80px">
                        번호
                    </th>
                    <th>
                        구분
                    </th>

                    <th>
                        이미지
                    </th>
                    <th>
                        카테고리
                    </th>
                    <th class="sortBy" @click="sortByData('name')">
                        아이템명
                        <span :class="((sorts.name=='desc')?'active':'')"><i
                            class="fas fa-long-arrow-alt-up"></i></span>
                        <span :class="((sorts.name=='asc')?'active':'')"><i
                            class="fas fa-long-arrow-alt-down"></i></span>
                    </th>
                    <th>
                        아이템코드
                    </th>
                    <th>
                        가격
                    </th>

                    <th class="sortBy" @click="sortByData('rdate')">
                        등록일
                        <span :class="((sorts.rdate=='desc')?'active':'')"><i
                            class="fas fa-long-arrow-alt-up"></i></span>
                        <span :class="((sorts.rdate=='asc')?'active':'')"><i
                            class="fas fa-long-arrow-alt-down"></i></span>
                    </th>
                    <th>
                    </th>
                </tr>
                </thead>
                <tbody>
                <tr
                    v-for="item in dataList"
                    :key="item.no"
                >
                    <td style="text-align:center;">
                        <v-checkbox style="margin:-3px auto 0 auto;width:20px;height:20px;padding:0;"
                                    v-model="nos[item.no]"
                        ></v-checkbox>
                    </td>
                    <td>{{ item.num }} </td>
                    <td><div :class="'gbase '+item.gbase">{{ item.gbaseName }}</div> </td>
                    <td class="img"><img :src="host+item.img"></td>
                    <td>{{ item.category }}</td>
                    <td>{{ item.name }}</td>
                    <td>{{item.gcode}}</td>
                    <td>{{item.price}}</td>
                    <td>{{ item.rdate }}</td>
                    <td>
                        <v-btn
                            type="button"
                            depressed
                            color="primary"
                            outlined
                            class="modify-button"
                            @click="modify(item.no)"
                        >
                            수정
                        </v-btn>
                    </td>
                </tr>
                </tbody>
            </table>

            <div v-if="!progress && dataList.length<1" class="empty-data">
                데이타가 존재하지 않습니다
            </div>
            <div v-if="progress" class="empty-data">
                <v-progress-circular
                    :size="50"
                    color="purple"
                    indeterminate
                ></v-progress-circular>
            </div>

            <div class="text-center pt-2">
                <paganation v-if="dataList.length>0"
                            :page="page"
                            :pageCount="pageCount"
                            :total="itemTotal"
                            :limit="itemLimit"
                            :pageInit="pageInit"
                            @getDataListByPaging="getData"
                ></paganation>
            </div>
        </div>
        <div style="height:40px"></div>
    </div>
</template>


<script>
	import paganation from '../../../components/paganation'
	import {
		HOST,
		API_URL_METABUS_ITEM_ADMIN_LIST,
		API_URL_METABUS_ITEM_ADMIN_DELETE
	} from '../../../api/urls';
	import apiService from '../../../api/apiService'

	export default {
		name: 'metabusItemList',
		components: {
			paganation
		},
		watch: {
			checkboxAll(val) {
				for (let key in this.nos) {
					if (val) {
						this.nos[key] = true;
					} else {
						this.nos[key] = false;
					}
				}
			},
			stdate(val) {
				this.search()
			},
			endate(val) {
				this.search()
			},
			firstCategory(val) {
				if (val) {
					this.secCategory = '';
					this.secCategorys = [];
					for (let item of this.firstCategorys) {
						if (val == item.value) {
							if (item.subMenus) {
								this.secCategorys.push({
									value: '',
									text: '2차카테고리 전체',
									subMenus: []
								});
								for (let subItem of item.subMenus) {
									this.secCategorys.push({
										value: subItem.code,
										text: subItem.name,
										subMenus: subItem.subMenus
									});

								}
							}
						}
					}

				} else {
					this.secCategory = '';
					this.secCategorys = [];

				}
				this.search();
			},
			secCategory(val) {
				this.search()

			},
			keyword() {

				this.search()
			},
			itemLimit() {
				this.getData(1);
			}


		},
		data() {
			return {
				firstCategory: '',
				firstCategorys: [],
				secCategory: '',
				secCategorys: [],
				page: 1,
				host: HOST,
				nos: {},
				pageCount: 5,
				keyword: '',
				cmd: 'name',
				checkboxAll: false,
				itemLimit: 15,
				pageInit: false,
				progress: true,
				itemLimitList: [
					5, 10, 15, 20, 50, 100
				],
				sorts: {
					no: '',
					name: '',
					rdate: '',
				},
				insertFlag:false,
				itemTotal: 1,
				dataList: [],
				orgDataList: [],
				stdate: '',//new Date().toISOString().substr(0, 10),
				stDatePicker: false,
				endate: '',//new Date().toISOString().substr(0, 10),
				enDatePicker: false,
				serverDataList: [],
				categorys: {},
			}
		},
		created() {
			this.getServerData();
		},
		methods: {
			itemRegist() {
				this.$router.push('/admin/metabus/itemRegist/new');
			},
			goPage(url) {
				this.$router.push(url);
			},
			modify(no) {
				this.$router.push('/admin/metabus/itemRegist/' + no);
			},
			sortByData(field) {

				if (this.sorts[field] == 'asc') {
					this.sorts[field] = 'desc'
				} else this.sorts[field] = 'asc'
				for (let key in this.sorts) {
					if (key != field) {
						this.sorts[key] = '';
					}
				}
				this.orgDataList = _.orderBy(this.orgDataList, field, this.sorts[field]);
				this.pageInit = true;
				this.getData(1);
			},
			getServerData() {
				const frm = new FormData()
				apiService.post(API_URL_METABUS_ITEM_ADMIN_LIST, frm, (res) => {
					let categorys = res.categoryInfo.categorys;

					this.firstCategorys.push({value: '', text: '1차카테고리 전체', subMenus: []})
					for (let cate of categorys) {
						this.firstCategorys.push({value: cate.code, text: cate.name, subMenus: cate.subMenus})
						let cateItem = {name: cate.name, subMenus: {}};
						for (let sub of cate.subMenus) {
							cateItem.subMenus[sub.code] = sub.name;
						}
						this.categorys[cate.code] = cateItem;
					}

					this.progress = false;
					if (res.goodsList.length > 0) {
						this.serverDataList = res.goodsList;
						for (let item of this.serverDataList) {
							let cateData = this.categorys[item.category1];

							item.gbaseName = (item.gbase=='yes')?'기본아이템':'추가아이템';
							item.category = cateData.name + ' | ' + cateData.subMenus[item.category2];

							this.orgDataList.push(item);
						}
						this.getData(1);
					}
				});

			},
			serverData() {
				this.nos={};
				const frm = new FormData()
				apiService.post(API_URL_METABUS_ITEM_ADMIN_LIST, frm, (res) => {
					if (res.goodsList.length > 0) {
						this.serverDataList = res.goodsList;
						for (let item of this.serverDataList) {
							let cateData = this.categorys[item.category1];
							item.category = cateData.name + ' | ' + cateData.subMenus[item.category2];
						}
						this.search()
					} else {
						this.serverDataList = [];
						this.search()
                    }

				});
            },
			getData(page) {
				let start = (page - 1) * this.itemLimit;
				let end = start + this.itemLimit;
				this.itemTotal = this.orgDataList.length;

				let orgDataList = this.orgDataList.slice(start, end);
				this.dataList = [];
				let startNum = '';
				if (this.itemTotal >= this.itemLimit) {
					startNum = (this.itemTotal - ((page - 1) * this.itemLimit));
				} else startNum = this.itemTotal
				let k = 0;
				this.nos = {};
				for (let item of orgDataList) {
					this.nos[item.no] = false;
					item.num = startNum - k;
					this.dataList.push(item);
					k++;

				}

			},
			search() {
				this.orgDataList = [];
				this.serverDataList.filter(data => {
					let result = true;
					let keywordResult = false;
					if (this.keyword) {
						keywordResult = data.name.includes(this.keyword)
						if (keywordResult) result = true;
						else result = false;
					} else result = true;

					if (this.stdate) {
						if (!data.rdate) {
							result = false;
						} else {
							let stDataVal = this.stdate.split('-');
							let stDate = new Date(stDataVal[0], parseInt(stDataVal[1]) - 1, stDataVal[2]);

							let rDataVal = data.rdate.split('-');
							let rDate = new Date(rDataVal[0], parseInt(rDataVal[1]) - 1, rDataVal[2]);

							if (rDate >= stDate) {
								if(result)result = true;
							} else result = false;
						}
					}
					if (this.endate) {
						if (!data.rdate) {
							result = false;
						} else {
							let enDataVal = this.endate.split('-');
							let enDate = new Date(enDataVal[0], parseInt(enDataVal[1]) - 1, enDataVal[2]);

							let rDataVal = data.rdate.split('-');
							let rDate = new Date(rDataVal[0], parseInt(rDataVal[1]) - 1, rDataVal[2]);

							if (rDate <= enDate) {
								if(result)result = true;
							} else result = false;
						}
					}
					if (this.firstCategory) {
						if(data.category1 == this.firstCategory) {
							if (this.secCategory) {
								if(data.category2 == this.secCategory)  {
									if (result) result = true;
                                } else {
									result = false;
                                }
							} else {
								if (result) result = true;
                            }
						} else {
							result = false;
                        }
					}
					if (result) {
						this.orgDataList.push(data);
					}
				})
				this.orgDataList = _.orderBy(this.orgDataList, 'no', 'desc');
				for (let key in this.sorts) {
					this.sorts[key] = '';
				}
				this.getData(1);
			},
			deleteItem() {
				let nos = []
				for (let key in this.nos) {
					if (this.nos[key]) {
						nos.push(key);
					}
				}
				if (nos.length < 1) {
					let params = {
						message: '아이템을 선택하세요',
					};
					this.$eventBus.$emit('modalOpen', params);
					return;
				}
			    let params = {
					type: 'confirm',
					message: '선택된 아이템을 삭제하시겠습니까?',
					doAction: () => {
						if(this.insertFlag)return;
						const frm = new FormData()
						frm.append('nos', JSON.stringify(nos));
						this.$eventBus.$emit('overlay', 'open');
						this.insertFlag = true;
						apiService.post(API_URL_METABUS_ITEM_ADMIN_DELETE, frm, (res) => {
							this.insertFlag = false;
							this.$eventBus.$emit('overlay', 'hide');
							this.serverData()
							let params = {
								message: '아이템이 삭제되었습니다',
							};
							this.$eventBus.$emit('modalOpen', params);
						});
					}
				};
				this.$eventBus.$emit('modalOpen', params);
				return;
			}

		},
		updated() {
			this.pageInit = false;
		}

	}
</script>

<style lang="scss" scoped="true">
    .link {
        text-decoration: underline;
        cursor: pointer;
        color: #000;
    }

    .img {
        width: 120px;
        img {
            max-width: 100px;
        }
    }

    .select-box {
        min-width: 190px;
    }
    .no {
        color:#0088CC;
    }

</style>